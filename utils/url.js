const LastFmKey = require("./constants/key");

export const getLastFmUrlByArtist = artistName => {
  return (
    "http://ws.audioscrobbler.com/2.0/" +
    "?method=artist.getinfo" +
    `&artist=${artistName}` +
    `&api_key=${LastFmKey}` +
    "&format=json"
  );
};
