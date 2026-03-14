import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import indexRouter from './routes/index.route.js';


const app = express();

app.use(express.json());
app.use(morgan("dev"))
app.use(cookieParser())

app.use('/api/v1', indexRouter)

export default app