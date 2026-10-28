import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

export const usersService = {
  async findAll() {
    return prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  async remove(id: number) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new AppError(404, 'User not found');

    await prisma.user.delete({ where: { id } });
  },
};
