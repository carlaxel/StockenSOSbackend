const stripe = require("stripe")(process.env.STRIPE);
const { MongoClient } = require("mongodb");

const sendEmail = require("../functions/sendEmail");
const user = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;
const url = `mongodb+srv://${user}:${password}@cluster0.geek0.mongodb.net/Stocken?retryWrites=true&w=majority`;
const dbName = process.env.DB_NAME;
const COLLECTION = process.env.COLLECTION;

const client = new MongoClient(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
client
  .connect()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((e) => console.log(e));

module.exports = async (req, res) => {
  //console.log(req.body.INTENT);
  try {
    const intent = await stripe.paymentIntents.retrieve(req.body.INTENT.id);
    console.log(intent);
    console.log(req.body.reg_data);
    let data = req.body.reg_data;
    const db = client.db(dbName);
    let length; // number of registered runners
    if (data.race === "lång") {
      length =
        (await db.collection(COLLECTION).countDocuments({ race: "lång" })) + 1;
    } else {
      length =
        (await db.collection(COLLECTION).countDocuments({ race: "mellan" })) +
        301;
    }

    await db.collection(COLLECTION).insertOne({
      _id: parseInt(length),
      checkin: false,
      finished: false,
      finishtime: null,
      officialtime: null,
      ...data,
      stripeIntendId: req.body.INTENT.id,
    });

    res.status(200).json("OK");
    sendEmail(data.email1, data.email2, data, length, req.body.INTENT.id);
  } catch (e) {
    console.log(e);
    res.status(500).json("Failed payment");
  }
};
