require("dotenv").config();
var input = process.argv;
var command = input[2];
var keys = require('./keys.js');
var request = require('request');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var twitter = require('twitter');
var x = "";

for (var i = 3; i < input.length; i++) {
  if (i > 3 && i < input.length) {
    x = x + "+" + input[i];
  } else {
    x = x + input[i];
  }
}

switch (command) {
  case "my-tweets":
    twitterSearch();
    break;

  case "spotify-this-song":
    if (x) {
      spotifySearch(x);
    } else {
      spotifySearch("The Sign");
    }
    break;

  case "movie-this":
    if (x) {
      omdbSearch(x)
    } else {
      omdbSearch("Mr. Nobody")
    }
    break;

  case "do-what-it-says":
    defaultSong();
    break;
};


function spotifySearch() {
  spotify.search({ type: 'track', query: song }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
      console.log(data);
    } else if (!err) {
      for (var i = 0; i < data.tracks.items.length; i++) {
        var song = data.tracks.items[i];
        console.log("Artist" + song.artist[0].name);
        console.log("Song: " + song.name);
        console.log("Preview URL: " + song.preview_url);
        console.log("Album: " + song.album.name);
      }
    }
  });
}

function omdbSearch(x) {
  var omdbURL = "http://www.omdbapi.com/?t=" + x + "&plot=short&tomatoes=true&apikey=trilogy";

  request(omdbURL, function (error, response, body) {

    if (!error && response.statusCode === 200) {
      var body = JSON.parse(body);

      console.log("Title " + body.Title);
      console.log("Year " + body.Year);
      console.log("IMDB Rating " + body.imdbRating);
      console.log("Rotten Tomatoes Rating " + body.tomatoRating);
      console.log("Country " + body.Country);
      console.log("Language " + body.Language);
      console.log("Plot " + body.Plot);
    } else {
      console.log("error")
    }
    if (x === "Mr. Nobody") {

      console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      console.log("It's on Netflix!");
    }
  });
}

function defaultSong() {
  fs.readFile('random.txt', "utf8", function (error, data) {
    var txt = data.split(',');

    spotifySong(txt[1]);
  });
}