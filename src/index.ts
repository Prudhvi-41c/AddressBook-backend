import express from 'express';
import { db } from './db/dbConfig';
import addressRouter from "./routes/addressRoute"
const cors = require("cors")
require('dotenv').config()

const app = express();
const port = process.env.PORT;

db.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Error connecting to PostgreSQL', err));

app.use(express.json())
app.use(cors())
app.use("/api",addressRouter)
app.get('/', (req, res) => {
  res.send('Hello, TypeScript with Express!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});