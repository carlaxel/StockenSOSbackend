const { MongoClient } = require("mongodb");

const user = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;
const url = `mongodb+srv://${user}:${password}@cluster0.geek0.mongodb.net/Stocken?retryWrites=true&w=majority`;

const dbName = "Stocken";
const COLLECTION = process.env.COLLECTION;

const client = new MongoClient(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
client
  .connect()
  .then(() => {
    console.log("connected to DB");
    const db = client.db(dbName);
  })
  .catch((e) => console.log(e));

const put = async (req, res) => {
  try {
    let body = req.body.body;
    console.log(body);
    const db = client.db(dbName);
    let data = await db
      .collection(COLLECTION)
      .updateOne({ _id: body._id }, { $set: body });
    console.log(data);
    res.status(200).json("OK");
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
};

const post = async (req, res) => {
  try {
    let intent = req.body.INTENT;
    const db = client.db(dbName);
    let data = await db
      .collection(COLLECTION)
      .findOne({ stripeIntendId: intent });
    console.log(data);
    if (data == null) {
      res.status(400).json(data);
    } else {
      res.status(200).json(data);
    }
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
};

module.exports = { runnerandringPost: post, runnerandringPut: put };
