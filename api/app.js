import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(morgan(':remote-addr :method :url :status - :response-time ms'))
app.use(cors({
  origin: [process.env.FRONTEND_URL],
  credentials: true
}));

app.use("/test", (req, res) => {
  res.send("server is running");
})

app.all('*', (req, res) => {
  res.status(404).send("OOPS!! yeh glt hole hain")
})

app.use(errorMiddleware);
export default app;
