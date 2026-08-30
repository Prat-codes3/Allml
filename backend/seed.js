import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  try {
    const user = await prisma.user.create({
      data: {
        username: 'john_doe',
        email: `john_@example.com`,
        password: 'John_it_is'
      },
    });
    console.log(' Dummy user created successfully:', user);
  } catch (error) {
    console.error('Error creating user:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
