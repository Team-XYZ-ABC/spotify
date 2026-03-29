import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import indexRouter from './routes/index.route.js';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(morgan("dev"))
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use('/api/v1', indexRouter)

export default app