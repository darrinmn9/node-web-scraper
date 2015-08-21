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

      //loads html page and uses cheerio to traverse the DOM and extract data using methods with similar syntax to jQuery
      var $ = cheerio.load(html);

      //this will store our scraped data
      var json = {
        'playerData': []

      };

      //this will store our headers, which will be the unique keys for each object inside of playerData
      var headers = [];

      //traverses the document to find the unique table headers, and pushes the text into the headers array
      $('#stats').find('thead').find('tr').last().children().each(function() {
        headers.push($(this).text().toLowerCase());
      });

      //changes first element from "RK" to "id"
      headers[0] = 'id';

      /*
       traverses the document to find each unique table row containing player data
       within each <tr>, a temporary object is created by using our pre-defined headers array as keys
       each header key is set to the value of each <td> (table cell) .text value
       the temporary object is then pushed into json.playerData for each unique table row
       */
      $('#stats').find('tbody').find('tr').filter(function(index, el) {
        //filters out periodic header rows that have the designated class "thead" in common
        return !$(this).hasClass('thead');

      }).each(function(index, el) {
        var tempObj = {};
        $(this).children().each(function(index, el) {

          /*
            this condition is used because some <td>'s have a child <a>.
            In this case, we want the text inside the <a> and not the <td>
          */
          if ($(this).children().length === 0) {
            tempObj[headers[index]] = $(this).text();
          } else {
            tempObj[headers[index]] = $(this).find('a').text();
          }
        });
        json.playerData.push(tempObj);
      });

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
