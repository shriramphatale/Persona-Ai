import { Router } from "express";
import {sendMessage, getAllMessages} from '../controllers/chat.controller.js'
import {manageSession} from '../middleware/session.middleware.js'

const router = Router()

router.use(manageSession)

router.post('/', sendMessage);
router.get('/messages', getAllMessages);

export default router;

