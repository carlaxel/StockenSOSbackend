const verifier = require("alexa-verifier");

let skill;

const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  console.log("reached 'API-alexa'");
  next();
});

// const DieCast = {
//   canHandle(handlerInput) {
//     return handlerInput.requestEnvelope.request.type === "LaunchRequest";
//   },
//   handle(handlerInput) {
//     let value = Math.ceil(Math.random() * 6);
//     return handlerInput.responseBuilder
//       .speak(`I have cast a ${value}`)
//       .withSimpleCard("DieCast", `I have cast a ${value}`)
//       .getResponse();
//   }
// };

router.post("/diecast", async (req, res) => {
  let value = Math.ceil(Math.random() * 6);
  console.log(req.headers);
  console.log(req.body);

  let error = await verifier(
    req.headers.signaturecertchainurl,
    req.headers.signature,
    JSON.stringify(req.body)
  );

  if (error) {
    console.log(er);
    res.status(400).json("error");
  } else {
    let response = {
      version: "1.0",
      response: {
        outputSpeech: {
          type: "PlainText"
        }
      }
    };
    response.response.shouldEndSession = true;
    response.response.outputSpeech.text = `I have cast a ${value}`;
    res.status(200).json(response);
  }
  //   {
  //     'x-forwarded-for': '72.21.217.119',
  //     host: 'stockentest.carl-axel.com',
  //     connection: 'close',
  //     'content-length': '3730',
  //     'content-type': 'application/json; charset=utf-8',
  //     accept: 'application/json',
  //     'accept-charset': 'utf-8',
  //     signature: 'mBfKSj9FzGc/pYr/t9V3cvFtFdJA/vOSQJn9ijNk26NwJnXtRvZZ3yLrmcSR40YrHYfo3t3XMvrI2nG+UM2qT7pc45/xJNvaesQaJzNLF5aVFNXsgz4i8nOiMtuVs9VUjgB1ud8ZsuNjmZr6yVbakAbQmmKV5xGTwJyvvihRd4PkTu5qTe+6X0wlR+KY+f1oPfJsyizY1c9knbYNsx70Jy1QKjKaAnBfmLIBDtlEQoNUST6Btu7+7hyySYRMFvZ0xLwVgK9lhc6cGrFUBBqoxXwoXB4lSSWPuS9Hh4UMDb1MCCPwc5KJMnylbvAghjp72WKIgXThsCMbGZUrq+cuaw==',
  //     signaturecertchainurl: 'https://s3.amazonaws.com/echo.api/echo-api-cert-7.pem',
  //     'user-agent': 'Apache-HttpClient/4.5.x (Java/1.8.0_222)'
  //   }

  //   if (!skill) {
  //     skill = Alexa.SkillBuilders.custom()
  //       .addRequestHandlers(DieCast)
  //       .create();
  //   }

  //   skill
  //     .invoke(req.body)
  //     .then(function(responseBody) {
  //       res.json(responseBody);
  //     })
  //     .catch(function(error) {
  //       console.log(error);
  //       res.status(500).send("Error during the request");
  //     });
});

module.exports = router;
