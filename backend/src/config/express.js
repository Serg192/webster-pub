const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const https = require("https");
const path = require("path");
const fs = require("fs");
const limiter = require("express-rate-limit");
const HttpStatus = require("http-status-codes").StatusCodes;
const app = express();

const router = require("../api/routes");
const logger = require("./logger");

// max 60 requests per 1 minute
app.use(
  limiter({
    windowMs: 1 * 60 * 1000,
    max: 200,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: "GET, POST, PUT, PATCH, DELETE",
    allowedHeaders: "Content-Type, Authorization, Set-Cookie",
  })
);

app.use("/api/v1", router);

app.use((req, res, next) => {
  return res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode
    ? err.statusCode
    : HttpStatus.INTERNAL_SERVER_ERROR;

  logger.error(`CODE: ${statusCode}, msg: ${err.message}, stack: ${err.stack}`);
  res.status(statusCode).json({
    message: err.message,
  });
});

module.exports = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "../../cert", "websterCert.key")),
    cert: fs.readFileSync(
      path.join(__dirname, "../../cert", "websterCert.crt")
    ),
  },
  app
);
