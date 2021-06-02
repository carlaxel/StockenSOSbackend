const { MongoClient } = require("mongodb");

const sendEmail = require("../functions/sendEmail");

const user = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;
const url = `mongodb+srv://${user}:${password}@cluster0.geek0.mongodb.net/Stocken?retryWrites=true&w=majority`;

const dbName = "Stocken";
const COLLECTION_KNATTE = process.env.COLLECTION_KNATTE;

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

module.exports = async (req, res) => {
  //console.log(req.body.INTENT);
  try {
    console.log(req.body);
    const db = client.db(dbName);
    let r = await db.collection(COLLECTION_KNATTE).insertOne({
      ...req.body.reg_data,
    });
    console.log(r.ops[0]._id);
    res.status(200).json("OK");
    sendEmail(data.email1, data.email2, data);
  } catch (e) {
    console.log(e);
    res.status(500).json("Failed registration");
  }
};
