import express from 'express'
import { config } from './config.js'
import { PrismaClient } from '@prisma/client'

const app = express();
const prisma = new PrismaClient();

app.use(express.json())

app.get('/', (req, res) => {
    res.send(`hello buoy`)
})

// Get all users
app.get('/users', async (req, res) => {
   const users = await prisma.user.findMany();
   res.json(users)
})

export { app }


