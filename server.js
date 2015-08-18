var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/', function(req, res) {
  // this webpage contains all player statistics for 2014-2015 season
  url = 'http://www.hockey-reference.com/leagues/NHL_2015_skaters.html';

  request(url, function(error, response, html) {
    if (!error) {
      var $ = cheerio.load(html);

      var title, release, rating;

      var json = {
        'playerData': []

      };

      var headers = [];

      $('#stats').find('thead').find('tr').last().children().each(function() {
        headers.push($(this).text().toLowerCase());
      });

      headers[0] = 'id';

      $('#stats').find('tbody').find('tr').filter(function(index, el) {
        return !$(this).hasClass('thead');

      }).each(function(index, el) {
        var tempObj = {};
        $(this).children().each(function(index, el) {

          if ($(this).children().length === 0) {
            tempObj[headers[index]] = $(this).text();
          } else {
            tempObj[headers[index]] = $(this).find('a').text();
          }

        });

        json.playerData.push(tempObj);
      });








      // console.log($('#stats').find($('thead'))));
      // .each(function() {
      //   headers.push((this).text());
      // });

      //console.log(headers);



    }

    fs.writeFile('output.json', JSON.stringify(json, null, 2), function(err) {
      console.log('File successfully written! - Check your project directory for the output.json file');
    });

    res.send('Check your output.json file!');
  });
});

app.listen('8081');
console.log('Scraper listening on port 8081');
exports = module.exports = app;
