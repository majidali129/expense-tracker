import express from 'express'

export const app = express();



app.use(express.json({limit: '60kb'}))