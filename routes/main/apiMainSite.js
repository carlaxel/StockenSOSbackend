const express = require("express");
const router = express.Router();
const starttime = require("./starttime");
const runners = require("./runners");
const done = require("./done");
const init = require("./init");
const { runnerandringPost, runnerandringPut } = require("./runnerandring");

router.use((req, res, next) => {
  console.log("reached 'API-v1 main'");
  next();
});

router.get("/health", (req, res) => {
  res.status(200).json("OK");
});

router.use("/runners", runners);
router.use("/starttime", starttime);
// Gets intent id from stripe to front-end
router.post("/init", init);

//POST for a completed transaction for main and middle race, collects complete payment from stripe and logs to db
router.post("/done", done);

//Gets data for runners to frontend
router.post("/runnerandring", runnerandringPost);
//Sends new data to update runner
router.put("/runnerandring", runnerandringPut);

module.exports = router;
