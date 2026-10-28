import { Router } from 'express';
import { usersController } from '../controllers/users.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

router.get('/', authenticate, authorize('STAFF'), usersController.findAll);
router.delete('/:id', authenticate, authorize('STAFF'), usersController.remove);

export { router as usersRoutes };
