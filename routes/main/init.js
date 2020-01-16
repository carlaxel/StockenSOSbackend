const stripe = require("stripe")(process.env.STRIPE);
const env = process.env.NODE_ENV;

module.exports = async (req, res) => {
  try {
    if (!validateEmail(req.body.email)) {
      res.status(400).json("Faulty email");
      return;
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 50000 * 2, //amount in öre
      currency: "sek",
      receipt_email: req.body.email
    });
    console.log(env);
    console.log("secret: " + paymentIntent.client_secret);
    res.status(200).json(paymentIntent.client_secret);
  } catch (e) {
    console.log(e);
    res.status(500).json("error");
  }
};

function validateEmail(email) {
  let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
