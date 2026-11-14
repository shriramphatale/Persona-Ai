import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true
  },

  personaId: {
    type: String,
    required: true,
    enum: ["hitesh", "piyush"]
  },

  role: {
    type: String,
    required: true,
    enum: ["user", "assistant"]
  },

  content: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Optimize fetching conversation history
messageSchema.index({
  sessionId: 1,
  personaId: 1,
  createdAt: 1
});

export default mongoose.model("Message", messageSchema);