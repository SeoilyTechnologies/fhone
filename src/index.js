const dotenv=require('dotenv');
const express = require("express");
const cors = require("cors"); 
const app= express();
dotenv.config();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization"
  ],
}));

const authRoute=require('./routes/auth')
const userRoute=require('./routes/user');

const path = require("path");

const mongoose=require("../src/db/mongoose_connect"); 

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
//app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/auth/",authRoute);
app.use("/api/user/",userRoute);

const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
app.get("/health", (req, res) => {
  res.send("OK");
});
