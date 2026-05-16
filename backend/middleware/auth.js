var jwt = require("jsonwebtoken");

function auth(req, res, next) {
  var header = req.headers["authorization"];
  if (!header) {
    return res.status(401).json({ error: "No token provided" });
  }
  var token = header.replace("Bearer ", "");
  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET || "carbonexfarm_secret_2026");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = auth;