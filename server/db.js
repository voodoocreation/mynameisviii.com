/* eslint-disable global-require */
const appearances = require("./mocks/appearances");
const news = require("./mocks/news");
const releases = require("./mocks/releases");

module.exports = {
  appearances,
  appearance: appearances.Items[0],
  news,
  newsArticle: news.Items[0],
  releases,
  release: releases.Items[0]
};
