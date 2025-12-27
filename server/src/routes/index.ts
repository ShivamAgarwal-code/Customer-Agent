import { Router } from 'express';
import healthRoutes from './health.js';
import chatRoutes from './chat.js';
const router = Router();

router.use('/health', healthRoutes);
router.use('/chat', chatRoutes);

// Add more routes here
// router.use('/api/users', userRoutes);
// router.use('/api/products', productRoutes);

export default router;
