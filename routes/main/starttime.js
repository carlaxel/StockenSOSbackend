const express = require("express");
const { MongoClient } = require("mongodb");
const Pusher = require("pusher");

const router = express.Router();

const {
  MONGO_PASSWORD: password,
  MONGO_USER: user,
  DB_NAME: dbName,
  COLLECTION_TIMER: COLLECTION,
  PUSHER_APPID,
  PUSHER_KEY,
  PUSHER_SECRET,
} = process.env;

const url = `mongodb+srv://${user}:${password}@cluster0.geek0.mongodb.net/Stocken?retryWrites=true&w=majority`;

const client = new MongoClient(url, { useNewUrlParser: true });

const pusher = new Pusher({
  appId: PUSHER_APPID,
  key: PUSHER_KEY,
  secret: PUSHER_SECRET,
  cluster: "eu",
  useTLS: true,
});

client
  .connect()
  .then((db) => {
    console.log("connected starttime to DB");
    const changeStream = client.db(dbName).collection(COLLECTION).watch();
    changeStream.on("change", (next) => {
      console.log(next);
      pusher.trigger("my-channel", "starttime", {
        message: next,
      });
    });
  })
  .catch((e) => {
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
  let documents = await db.collection(COLLECTION).find().toArray();

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
