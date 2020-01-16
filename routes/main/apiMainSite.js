const express = require("express");
const router = express.Router();

const done = require("./done.js");
const doneKnatte = require("./doneKnatte.js");
const init = require("./init.js");
const { runnerandringPost, runnerandringPut } = require("./runnerandring.js");

router.use((req, res, next) => {
  console.log("reached 'API-v1 main'");
  next();
});

router.get("/health", (req, res) => {
  res.status(200).json("OK");
});

// Gets intent id from stripe to front-end
router.post("/init", init);

//POST for a completed transaction for main and middle race, collects complete payment from stripe and logs to db
router.post("/done", done);

//POST for a completed reg for short race, logs to db
router.post("/doneKnatte", doneKnatte);

//Gets data for runners to frontend
router.post("/runnerandring", runnerandringPost);
//Sends new data to update runner
router.put("/runnerandring", runnerandringPut);

module.exports = router;
