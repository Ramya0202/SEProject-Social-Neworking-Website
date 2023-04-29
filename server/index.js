import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// routes
import AuthRoute from "./src/routes/auth/index.js";
import UserRoute from "./src/routes/user/index.js";
import BucketRoute from "./src/routes/bucket/index.js";
import ContentRoute from "./src/routes/content/index.js";

const app = express();

// middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(express.static("src/uploads"));
app.use("/images", express.static("images"));

dotenv.config();
const PORT = process.env.PORT;
const CONNECTION = process.env.MONGO_URI;

mongoose
  .connect(CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Listening at Port ${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

app.use("/auth", AuthRoute);
app.use("/user", UserRoute);
app.use("/bucket", BucketRoute);
app.use("/content", ContentRoute);