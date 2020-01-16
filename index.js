const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
let dotenv = require("dotenv-flow").config();
const app = express();
const apiMainSite = require("./routes/main/apiMainSite");
const apiTimer = require("./routes/api");
const apiAlexa = require("./routes/apiAlexa");
const apiAdmin = require("./routes/admin/index");

if (dotenv.error) {
  throw dotenv.error;
}
console.log(dotenv.parsed);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use(helmet());

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use("/api-v1", apiMainSite);
app.use("/api-2019", apiTimer);
app.use("/api-alexa", apiAlexa);
app.use("/api-admin", apiAdmin);
app.listen(process.env.PORT, () => {
  console.log(`Running on port ${process.env.PORT}`);
});
