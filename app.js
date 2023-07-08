require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:

const app = express();

app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

async function getAccessToken() {
  const data = await spotifyApi.clientCredentialsGrant();
  const accessToken = data.body["access_token"];
  spotifyApi.setAccessToken(accessToken);
}

getAccessToken();

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", async (req, res) => {
  try {
    const searchQuery = req.query.artist;
    const data = await spotifyApi.searchArtists(searchQuery);
    console.log(data);
    const artistFromDb = data.body.artists.items;
    res.render("artist-search-results", { artistFromDb });
  } catch (err) {
    console.error(
      "An error as occured while searching artists: " + err.message
    );
    res.render("error");
  }
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
