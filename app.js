const cors = require("cors");
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config();

const contactsRouter = require("./routes/api/contacts");
const usersRouter = require("./routes/api/users");

const DB_HOST = process.env.DB_HOST;

const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";
const db = mongoose.connect(DB_HOST);

db.then(() => {
	console.log("Database connection successful");
}).catch((error) => {
	console.log(error);
	process.exit(1);
});

app.use(express.urlencoded());
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use("/api/contacts", contactsRouter);
app.use("/api/users", usersRouter);
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res) => {
	res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
	res.status(500).json({ message: err.message });
});

module.exports = app;
