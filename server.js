import express from 'express'
import cors from 'cors'; 
import TaskRoute from './Router/TaskRouter.js'

const app = express()
app.use(express.json());
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})
app.use(cors({
    // origin: "http://localhost:3000",
    origin:"*",
    methods: ["GET", "POST", "PUT", "DELETE"],
}));


app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.use("/task",TaskRoute)



app.listen(5000, () => {
    console.log('Server is running on port http://localhost:5000');
  });