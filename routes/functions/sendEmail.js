const env = process.env.NODE_ENV;
const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-west-1" });
const ses = new AWS.SES();

module.exports = function sendEmail(address1, address2, data, id, intentId) {
  console.log(env);
  let params;
  if (data.race == "knatte") {
    params = {
      Destination: {
        ToAddresses: [address1, address2],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `<html>
          <h2>Välkommen till Stocken SOS</h2>
          <div>
          <p>Tack för ditt köp för att deltaga i Stocken SOS den 17 Juli.</p>
          <p>Deltagare ${data.firstname1} ${data.lastname1} & ${data.firstname2} ${data.lastname2}</p>
          <p>Lopp: ${data.race}, Klass: ${data.runnersclass}</p>
          </div>
          </html>`,
          },
          Text: {
            Charset: "UTF-8",
            Data: "Välkommen till Stocken SOS den 17 Juli.",
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Stocken SOS knatte",
        },
      },
      Source: "no-reply@stockensos.se",
      ConfigurationSetName: "standard",
    };
  } else {
    params = {
      Destination: {
        ToAddresses: [address1, address2],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `<html>
          <h2>Välkommen till Stocken SOS</h2>
          <div>
          <p>Tack för ditt köp för att deltaga i Stocken SOS den 17 Juli.</p>
          <p>Ert team har startnummer: ${id}<p/>
          <p>Deltagare ${data.firstname1} ${data.lastname1} & ${
              data.firstname2
            } ${data.lastname2}</p>
          <p>Lopp: ${data.race}, Klass: ${data.runnersclass}</p>
          <p>T-Shirt: ${data.shirt1} & ${data.shirt2}</p>
          <p>Ifall ni vill ändra något i er anmälan, vänligen gå till ${
            env == "test" ? "test." : ""
          }stockensos.se/andring/${intentId}</p>
          </div>
          </html>`,
          },
          Text: {
            Charset: "UTF-8",
            Data: "Välkommen till StockenSOS. Tack för ditt köp för att deltaga i Stocken SOS den 17 Juli.",
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Stocken SOS köp bekräftelse",
        },
      },
      Source: "no-reply@stockensos.se",
      ConfigurationSetName: "standard",
    };
  }

  ses.sendEmail(params, function (err, data) {
    if (err) console.log(err, err.stack);
    // an error occurred
    else console.log(data); // successful response
    /*
         data = {
          MessageId: "EXAMPLE78603177f-7a5433e7-8edb-42ae-af10-f0181f34d6ee-000000"
         }
         */
  });
};
