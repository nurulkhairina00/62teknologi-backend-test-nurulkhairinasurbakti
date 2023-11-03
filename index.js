const express = require("express");
const cors = require("cors");
const axios = require("axios");
const dataRoutes = require("./api/business/routers");
var config = require("./database/config");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const API_KEY = config.api_key;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(`/business`, dataRoutes);

// --------------------------------------- API FE -----------------------------------------
// get data search based on term, location and price
app.get("/v3/business/search", async (req, res) => {
  const { term, location, price } = req.query;
  await axios
    .get(`https://api.yelp.com/v3/businesses/search`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
      params: {
        term,
        location,
        price,
      },
    })
    .then((response) => {
      res.status(200).json(response.data.businesses);
    })
    .catch((error) => {
      if (error.response) {
        if (error.response.data.error.code === "LOCATION_NOT_FOUND") {
          return res.status(404).json({ message: "Data Not Found" });
        }
      }
      console.error("Error fetching searching:", error);
      res.status(500).json({ error: "Internal Server Errorsss" });
    });
});

// get data details business
app.get("/v3/business/detail/:id", async (req, res) => {
  const businessId = req.params.id;
  await axios
    .get(`https://api.yelp.com/v3/businesses/${businessId}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    })
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((error) => {
      console.error("Error fetching business details:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

// get data review business
app.get("/v3/business/review/:id", async (req, res) => {
  const businessId = req.params.id;
  await axios
    .get(`https://api.yelp.com/v3/businesses/${businessId}/reviews`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    })
    .then((response) => {
      res.status(200).json(response.data.reviews);
    })
    .catch((error) => {
      console.error("Error fetching business details:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

// --------------------------------------- END API FE -----------------------------------------

app.listen(5000, () => console.log("Server running at http://localhost:5000"));
