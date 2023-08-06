// const ElasticEmail = require('@elasticemail/elasticemail-client');
// require('dotenv').config();
 
// const defaultClient = ElasticEmail.ApiClient.instance;
//  const {ELASTIC_API_KEY, EMAIL_RECIPIENT} = process.env;

// // const apikey = defaultClient.authentications['apikey'];
// const {apikey} = defaultClient.authentications;
// apikey.apiKey = ELASTIC_API_KEY
 
// const api = new ElasticEmail.EmailsApi()
 
// const email = ElasticEmail.EmailMessageData.constructFromObject({
//   Recipients: [
//     new ElasticEmail.EmailRecipient("casax20772@weizixu.com")
//   ],
//   Content: {
//     Body: [
//       ElasticEmail.BodyPart.constructFromObject({
//         ContentType: "HTML",
//         Content: "<p>Verify email</p>"
//       })
//     ],
//     Subject: "Verify email of client",
//     From: EMAIL_RECIPIENT
//   }
// });
 
// const callback = function(error, data, response) {
//   if (error) {
//     console.error(error);
//   } else {
//     console.log('API called successfully.');
//   }
// };
// api.emailsPost(email, callback);

// module.exports = api;
