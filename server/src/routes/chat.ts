import { Router } from 'express';
import type { Request, Response } from 'express';
import chatController from '../controllers/chat.controller.js';
import listChatController from '../controllers/listchat.controller.js';
import listMessagesController from '../controllers/listmessages.controller.js';

const router = Router();

router.post('/', chatController);
router.post('/:conversationId', chatController);
router.get('/', listChatController);
router.get('/:conversationId/messages', listMessagesController);
export default router;
