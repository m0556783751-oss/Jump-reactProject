import { Response, NextFunction } from 'express';
import { usersService } from '../services/users.service';
import { AuthRequest } from '../middleware/auth';

export const usersController = {
  async findAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const users = await usersService.findAll();
      res.json(users);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await usersService.remove(Number(req.params.id));
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },
};
