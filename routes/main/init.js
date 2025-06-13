const stripe = require("stripe")(process.env.STRIPE);
const env = process.env.NODE_ENV;

module.exports = async (req, res) => {
  try {
    if (!validateEmail(req.body.email)) {
      res.status(400).json("Fel i email format");
      return;
    }
    console.log(req.body)
    const shirtAmount = req.body.paytshirts || 0;
    if(!req.body.race){
      res.status(400).json("Ingen race inställning");
      return;
    }
    const amount = req.body.race === "lång" ? 600 : 400;

    let lastTshirtDate = new Date("June 30 2025 23:59:59 GMT+0200");
    let today = new Date();
    if (today > lastTshirtDate && shirtAmount !== 0) {
      
      res.status(400).json("Inte längre möjligt att köpa t-shirt");
      return;
    }

    let lastTshirtDateFree = new Date("Aug 15 2024 23:59:59 GMT+0200");
    const freeShirt = today < lastTshirtDateFree;
    let shirtCost = 0;
    if(!freeShirt){
      shirtCost = shirtAmount* 250 * 100;
      
      }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 2 * 100 + shirtCost , //amount in öre
      currency: "sek",
      receipt_email: req.body.email,
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
  let re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
