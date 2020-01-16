const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");
const Pusher = require("pusher");

const user = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;

const url = `mongodb+srv://${user}:${password}@stockensos-g1obv.mongodb.net/test?retryWrites=true&w=majority`;
const dbName = "Stocken";
const COLLECTION = "Deltagare";
//cacheDB();

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const pusher = new Pusher({
  appId: process.env.PUSHER_APPID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: "eu",
  useTLS: true
});

client
  .connect()
  .then(db => {
    console.log("connected to mongoDB");
    const changeStream = client
      .db(dbName)
      .collection(COLLECTION)
      .watch();
    changeStream.on("change", next => {
      pusher.trigger("my-channel", "runners", {
        message: next
      });
    });

    const changeStreamKnatte = client
      .db(dbName)
      .collection("DeltagareKorta")
      .watch();
    changeStreamKnatte.on("change", next => {
      pusher.trigger("my-channel", "runnersKnatte", {
        message: next
      });
    });
  })
  .catch(e => {
    console.log(e);
  });

// router.use((req, res, next) => {
//   console.log("reached 'api/runners'");
//   next();
// });

router.get("/", (req, res) => {
  res.send("OK run");
});

router.get("/getAll", async (req, res) => {
  const db = client.db(dbName);
  let documents = await db
    .collection(COLLECTION)
    .find()
    .toArray();

  res.status(200).json(documents);
});

router.get("/getAllKnatte", async (req, res) => {
  const COLLECTION = "DeltagareKorta";
  const db = client.db(dbName);
  let documents = await db
    .collection(COLLECTION)
    .find()
    .toArray();

  res.status(200).json(documents);
});

router.post("/newTeam", async (req, res) => {
  console.log(req.body);
  const { _id, runnersclass, runner1, runner2, race, startgroup } = req.body;

  const db = client.db(dbName);
  let r = await db.collection(COLLECTION).insertOne({
    _id: parseInt(_id),
    runnersclass,
    runner1,
    runner2,
    race,
    startgroup,
    checkin: false,
    finished: false,
    finishtime: null,
    officialtime: null
  });
  res.send(r);
});

router.patch("/updateCheckIn", async (req, res) => {
  console.log(req.body);
  const db = client.db(dbName);
  let r = await db
    .collection(COLLECTION)
    .updateOne({ _id: req.body._id }, { $set: { checkin: req.body.checkin } });

  res.send(r);
});

router.patch("/updateCheckInKnatte", async (req, res) => {
  console.log(req.body);
  const COLLECTION = "DeltagareKorta";
  const db = client.db(dbName);
  let r = await db
    .collection(COLLECTION)
    .updateOne({ _id: req.body._id }, { $set: { checkin: req.body.checkin } });

  res.send(r);
});

router.patch("/updateTeam", async (req, res) => {
  console.log(req.body);
  const body = { ...req.body };
  delete body._id;
  const db = client.db(dbName);
  let r = await db
    .collection(COLLECTION)
    .updateOne({ _id: req.body._id }, { $set: body });

  res.send(r);
});

router.patch("/updateTeamKnatte", async (req, res) => {
  console.log(req.body);
  const COLLECTION = "DeltagareKorta";
  const body = { ...req.body };
  delete body._id;
  const db = client.db(dbName);
  let r = await db
    .collection(COLLECTION)
    .updateOne({ _id: req.body._id }, { $set: body });

  res.send(r);
});

module.exports = router;
