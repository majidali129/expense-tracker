import express from 'express'
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import userRouter from '../src/routes/user.routes.js'
import categoryRouter from '../src/routes/category.routes.js'
import expenseRouter from '../src/routes/expense.routes.js'
export const app = express();


app.use(morgan('dev'))
app.use(express.json({limit: '60kb'}))
app.use(cookieParser())




// routes mounting
app.use('/api/v1/users', userRouter)
app.use('/api/v1/categories', categoryRouter)
app.use('/api/v1/expenses', expenseRouter)