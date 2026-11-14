import OpenAI from "openai";
import Message from "../models/Message.js";
import 'dotenv/config'
import { Request, Response } from "express";
import { ChatCompletionMessage } from "openai/resources.js";
import { ChatCompletionMessageParam } from "openai/resources";
import { personas } from "../utils/personas.js";

type personaId = 'hitesh' | 'piyush';

interface saveMessageBody {
  personaId: personaId;
  role: 'user' | 'assistant';
  content: string;
}

interface ConversationMessage {
  id: string,
  role: 'user' | 'assistant',
  personaId: personaId,
  content: string,
  createdAt: Date,
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const sendMessage = async (req:Request<{}, {}, saveMessageBody >, res: Response): Promise<void> => {
  try{
    const {personaId, role, content} = req.body;

    const message = await Message.create({
      sessionId: req.sessionId,
      personaId,
      role,
      content
    });

    const prevMsg = await Message.find({
      sessionId: req.sessionId,
      personaId
    }).sort({createdAt: -1}).limit(11).lean();

    const MESSAGES: ChatCompletionMessageParam[] = [
      {role: 'system', content: personas[personaId].systemPrompt},
      ...prevMsg.reverse().map((msg)=>({
        role: msg.role,
        content: msg.content
      }))
    ]

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: MESSAGES
    })

    const assistantContent = response.choices[0]?.message?.content

    if(!assistantContent) throw new Error('AI returned an empty response');

    const assistantMessage = await Message.create({
      role: 'assistant',
      sessionId: req.sessionId,
      personaId,
      content: assistantContent,
    })

    res.status(201).json({success: true, message: assistantMessage});
  } catch (err) {
    console.error('Send Message Error:', err);
    res.status(500).json({
      success: false, 
      message: err instanceof Error ? err.message : "Internal server error",
    })
  }
}

const getAllMessages = async (req: Request, res: Response): Promise<void> => {
  try{
    const messages = await Message.find({
      sessionId: req.sessionId
    }).sort({createdAt: 1}).lean()

    const conversations: Record<personaId, ConversationMessage[]> = {
      hitesh: [],
      piyush: [],
    }

    messages.forEach((message) => {
      conversations[message.personaId].push({
        id: message._id.toString(),
        role: message.role,
        personaId: message.personaId,
        content: message.content,
        createdAt: message.createdAt,
      });
    })

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Internal server error",
    });
  }
}

export {
  sendMessage,
  getAllMessages
}