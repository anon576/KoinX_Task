import express from 'express'
import multer from 'multer'
import TaskHandler from '../Handler/TaskHandler.js'
const TaskRoute = express.Router()

const storage = multer.memoryStorage();
const upload = multer({ storage });


TaskRoute.post("/1",upload.single('file'),TaskHandler.task_1)

TaskRoute.get("/2",TaskHandler.task_2)




export default TaskRoute