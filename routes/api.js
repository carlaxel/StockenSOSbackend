const express = require("express");
const router = express.Router();

const runners = require("./timer/runners");
const starttime = require("./timer/starttime");

router.use((req, res, next) => {
  console.log("reached 'API-2019'");
  next();
});

router.use("/runners", runners);
router.use("/starttime", starttime);

module.exports = router;
