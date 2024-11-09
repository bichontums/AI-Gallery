/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// -----------------Section: Handle OpenAPI API requests ----------------- //

// firebase-functions is the Firebase SDK module for writing functions.
const functions = require("firebase-functions");
// axios is a library for making HTTP requests.
const axios = require("axios");
// Automatically adds the necessary CORS headers to the response.
// Allows requests from any origin.
const cors = require("cors")({origin: true});
// provides tools for parameterized configuration in Firebase function
const { defineSecret } = require('firebase-functions/params');
// creating a reference to a secret named OPENAI_API_KEY. 
// This secret will be stored securely in Google Cloud's Secret Manager.
const openaiApiKey = defineSecret('OPENAI_API_KEY');


// OpenAPI cloud function
exports.fetchOpenAIResponse = functions.https.onRequest(
    { secrets: [openaiApiKey] },
    (req, res) => {
      cors(req, res, async () => {
        try {
          const apiKey = openaiApiKey.value();
          const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            req.body,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
              },
            }
          );
          res.status(200).send(response.data);
        } catch (error) {
          console.error('Error calling OpenAI:', error.response ? error.response.data : error.message);
      res.status(500).send({ error: error.response ? error.response.data : error.message });
        }
      });
    }
  );