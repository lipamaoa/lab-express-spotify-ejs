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

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error))

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
  }
});

app.get("/albums/:artistId", async(req,res) =>{
  try{
    const artistId = req.params.artistId;
    const data= await spotifyApi.getArtistAlbums(artistId);
    const albums = data.body.items;
    res.render('albums', {albums});

  }catch(err){
    console.error("An error as occured while trying to load an album")
  }
})

app.get("/tracks/:albumId" , async(req, res) =>{
  try{

    const albumId = req.params.albumId;
    const data= await spotifyApi.getAlbumTracks(albumId);
    const tracks = data.body.items;
    res.render('tracks', {tracks});

  }catch(err){
    console.error("An error as occured while trying to load a track.")
  }
})

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
