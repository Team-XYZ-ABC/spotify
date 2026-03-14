import express from 'express';
import app from './src/app.js';
import config from './src/configs/env.config.js'
import connectDB from './src/configs/db.config.js';

connectDB()

app.listen(config.PORT, ()=>{
    console.log(`server is running on port ${config.PORT}`)
})