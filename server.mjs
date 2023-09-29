import { createRequestHandler } from "@remix-run/express";
import { broadcastDevReady } from "@remix-run/node";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

// notice that the result of `remix build` is "just a module"
import * as build from "./build/index.js";

const app = express();
app.use(express.static("public"));

app.use(morgan("tiny"));

// and your app is "just a request handler"
app.all("*", createRequestHandler({ build }));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  if (process.env.NODE_ENV === "development") {
    broadcastDevReady(build);
  }
  console.log(`App listening on http://localhost:${port}`);
});
