const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");
const Pusher = require("pusher");

const user = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;
console.log(user);
const url = `mongodb+srv://${user}:${password}@stockensos-g1obv.mongodb.net/test?retryWrites=true&w=majority`;
const dbName = "Stocken";
const COLLECTION = "Starttider";
//cacheDB();

const client = new MongoClient(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const pusher = new Pusher({
  appId: "813966",
  key: "59c6e925000e92336b4c",
  secret: "4d2ab561cece76a80613",
  cluster: "eu",
  useTLS: true
});

client
  .connect()
  .then(db => {
    const changeStream = client
      .db(dbName)
      .collection(COLLECTION)
      .watch();
    changeStream.on("change", next => {
      console.log(next);
      pusher.trigger("my-channel", "starttime", {
        message: next
      });
    });
  })
  .catch(e => {
    console.log(e);
  });

router.use((req, res, next) => {
  console.log("reached 'api/starttime'");
  next();
});

router.get("/", (req, res) => {
  console.log(req);
  res.send("OK");
});

router.get("/test", (req, res) => {
  res.send("OK");
});

router.get("/getTime", (req, res) => {
  res.status(200).json(new Date());
});

router.get("/getAll", async (req, res) => {
  const db = client.db(dbName);
  let documents = await db
    .collection(COLLECTION)
    .find()
    .toArray();

  console.log(documents);
  res.status(200).json(documents);
});

router.patch("/updateRace", async (req, res) => {
  console.log(req.body);
  const body = { ...req.body };
  delete body._id;
  const db = client.db(dbName);
  if (body.started) {
    body.starttime = new Date();
  }
  let r = await db
    .collection(COLLECTION)
    .updateOne({ _id: req.body._id }, { $set: body });
  r.body = body;
  res.send(r);
});

module.exports = router;
