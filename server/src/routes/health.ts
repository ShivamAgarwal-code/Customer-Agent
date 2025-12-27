import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
}

router.get('/', (_req: Request, res: Response): void => {
  const health: HealthResponse = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env['npm_package_version'] ?? '1.0.0',
  };

  res.json(health);
});

router.get('/ready', (_req: Request, res: Response): void => {
  // Add readiness checks here (database connections, external services, etc.)
  res.json({ ready: true });
});

router.get('/live', (_req: Request, res: Response): void => {
  res.json({ live: true });
});

export default router;
