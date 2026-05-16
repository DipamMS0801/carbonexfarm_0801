require("dotenv").config();
var express = require("express");
var mongoose = require("mongoose");
var cors = require("cors");

var app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
app.use(express.json());

app.use("/api/auth",         require("./routes/auth"));
app.use("/api/listings",     require("./routes/listings"));
app.use("/api/transactions", require("./routes/transactions"));
app.use("/api/ml",           require("./routes/ml"));
app.use("/api/users",        require("./routes/users"));

app.get("/api/health", function(req, res) {
  res.json({ status: "ok" });
});

var PORT = process.env.PORT || 5000;
var MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/carbonexfarm";

mongoose.connect(MONGO_URI)
  .then(function() {
    console.log("MongoDB connected");
    app.listen(PORT, function() {
      console.log("Server running on http://localhost:" + PORT);
    });
  })
  .catch(function(err) {
    console.log("DB error:", err.message);
  });