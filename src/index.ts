import express from 'express';
import { db } from './db/dbConfig';
import addressRouter from "./routes/addressRoute"
import userRouter from "./routes/userRoute"
const cors = require("cors")
require('dotenv').config()

const app = express();
const port = process.env.PORT;
const cookieParser = require('cookie-parser'); 
db.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Error connecting to PostgreSQL', err));


app.use(cookieParser()); 
app.use(express.json())
app.use(cors({
  origin: "http://localhost:5173",
  credentials:true
}))
app.use("/api",addressRouter)
app.use("/api",userRouter)
app.get('/', (req, res) => {
  res.send('Hello, TypeScript with Express!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});