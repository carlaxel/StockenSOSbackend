const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  console.log("reached 'API-admin'");
  next();
});
//TODO
router.use("/route" /* callback*/);

module.exports = router;
