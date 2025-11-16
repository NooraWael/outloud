import { Router } from 'express';
import { getDemoTopics, getDemoTopicById } from '../controllers/demoController';

const router = Router();

router.get('/topics', getDemoTopics);
router.get('/topics/:id', getDemoTopicById);

export default router;