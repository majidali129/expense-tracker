import express from 'express'

import userRouter from '../src/routes/user.routes.js'
export const app = express();



app.use(express.json({limit: '60kb'}))




// routes mounting
app.use('/api/v1/users', userRouter)