"use strict";
const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
var assert = require("assert");
const axios = require("axios");
const execSync = require("child_process").execSync;

const app = express();

var grant_result = null;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors)
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/get_policy_key", async (req, res) => {
  const policy_data = await axios.post(
    "http://127.0.0.1:8151/derive_policy_encrypting_key/peaceful_protest"
  );
  res.json(policy_data.data.result);
});

app.get("/get_public_keys", async (req, res) => {
  const public_keys_url = "http://localhost:4000/public_keys";
  try {
    var public_keys = await axios.get(public_keys_url);
    res.jsonp(public_keys.data.result);
  } catch (e) {
    console.log(e);
  }
});

app.post("/grant_access_to_protest_info", async (req, res) => {
  if (req.body) {
    console.log(req.body);
    const grant_url = "http://localhost:8151/grant";
    const public_keys_url = "http://localhost:4000/public_keys";
    const encrypt_message_url = "http://localhost:5000/encrypt_message";

    try {
      var encrypted_message = await axios.post(
        encrypt_message_url,
        {
          message: JSON.stringify({
            key: req.body.encrypting_key,
            protest_data: JSON.stringify(req.body.protests),
          }),
        },
        { "Content-Type": "application/json" }
      );
      // console.log(encrypted_message);
      console.log(encrypted_message.data.result);

      const grant_query_data = {
        bob_encrypting_key: req.body.encrypting_key,
        bob_verifying_key: req.body.verifying_key,
        m: 1,
        n: 1,
        label: "peaceful_protest",
        expiration: "2020-12-14T09:53:25-0400",
      };
      console.log("\n\n\n");
      console.log(
        "********************************************* Parameters in the Grant Query: *********************************************"
      );
      console.log(grant_query_data);

      try {
        grant_result = await axios.put(
          grant_url,
          {
            bob_encrypting_key: req.body.encrypting_key,
            bob_verifying_key: req.body.verifying_key,
            m: 1,
            n: 1,
            label: "peaceful_protest",
            expiration: "2020-12-14T09:53:25-0400",
          },
          { "Content-Type": "application/json" }
        );
        // console.log(grant_result);

        console.log(
          "********************************************* Access granted to Bob *********************************************\n"
        );

        console.log(grant_result.data.result);

        var retrieve_query = {
          policy_encrypting_key: grant_result.data.result.policy_encrypting_key,
          alice_verifying_key: grant_result.data.result.alice_verifying_key,
          label: "peaceful_protest",
          message_kit: encrypted_message.data.result.message_kit,
        };
        console.log("\n\n\n");

        console.log(
          "********************************************* Parameters required by Bob to retrieve the cleartext *********************************************\n"
        );

        console.log(retrieve_query);
        res.json(retrieve_query);
      } catch (e) {
        console.log(e);
        res.send("some mistake");
      }
    } catch (e) {
      console.log(e);
      res.send("some mistake");
    }
  } else {
    console.log("no data");
  }
});

app.post("/retrieve_data", async (req, res) => {
  console.log("retrieving");
  console.log(req.body.retrieve_query);
  try {
    await axios
      .post("http://localhost:4000/retrieve", req.body.retrieve_query)
      .then((details) => {
        console.log(JSON.parse(details.data.result.cleartexts[0]));
        res.json(JSON.parse(details.data.result.cleartexts[0]));
      });
  } catch (e) {
    res.json(e);
  }
});

app.listen(3000, function () {
  console.log("listening on 3000");
});
