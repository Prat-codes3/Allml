import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

// GET /users — Get all users
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
