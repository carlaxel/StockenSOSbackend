const express = require("express");
const Pusher = require("pusher");
const { MongoClient } = require("mongodb");

const router = express.Router();

const {
  MONGO_PASSWORD: password,
  MONGO_USER: user,
  DB_NAME: dbName,
  COLLECTION,
  PUSHER_APPID,
  PUSHER_KEY,
  PUSHER_SECRET,
} = process.env;

const url = `mongodb+srv://${user}:${password}@cluster0.geek0.mongodb.net/Stocken?retryWrites=true&w=majority`;

const pusher = new Pusher({
  appId: PUSHER_APPID,
  key: PUSHER_KEY,
  secret: PUSHER_SECRET,
  cluster: "eu",
  useTLS: true,
});

const client = new MongoClient(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
client
  .connect()
  .then(() => {
    console.log("connected runners to DB");
    const changeStream = client.db(dbName).collection(COLLECTION).watch();
    changeStream.on("change", (next) => {
      pusher.trigger("my-channel", "runners", {
        message: next,
      });
    });
  })
  .catch((e) => console.log(e));

router.get("/getAll", async (req, res) => {
  const db = client.db(dbName);

  let runners = await db.collection(COLLECTION).find().toArray();
  runners = runners
    .filter((team) => team.cancelled !== true)
    .map((team) => {
      const {
        _id,
        firstname1,
        lastname1,
        firstname2,
        lastname2,
        firstname3,
        lastname3,
        race,
        runnerclass,
        startgroup,
        checkin,
        finished,
        finishtime,
        officialtime,
        runnersclass,
        shirt1,
        shirt2
      } = team;
      return {
        _id,
        runner1: `${firstname1} ${lastname1}`,
        runner2: `${firstname2} ${lastname2}`,
        ...(firstname3 && {runner3:`${firstname3} ${lastname3}`}),
        race,
        runnerclass,
        startgroup,
        checkin,
        finished,
        finishtime,
        officialtime,
        runnersclass,
        ...(shirt1 && {shirt1}),
        ...(shirt2 && {shirt2})
      };
    });
  res.status(200).json(runners);
});

router.post("/newTeam", async (req, res) => {
  console.log(req.body);
  const {
    _id,
    runnersclass,
    firstname1,
    lastname1,
    firstname2,
    lastname2,
    race,
    startgroup,
    checkin = false,
  } = req.body;

  const db = client.db(dbName);
  let r = await db.collection(COLLECTION).insertOne({
    _id: parseInt(_id),
    runnersclass,
    firstname1,
    lastname1,
    firstname2,
    lastname2,
    race,
    startgroup,
    checkin,
    finished: false,
    finishtime: null,
    officialtime: null,
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

module.exports = router;
