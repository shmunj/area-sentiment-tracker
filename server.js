var util = require('util');

var Twitter = require('twitter');
var authData = require('./authData');
var client = new Twitter(authData);

var sentiment = require('sentiment');
var tweetLimit = 200;
var tweets = [];
var avgSentiment = 0;
var totalSentiment = 0;
var tweetCounter = 0;

var express = require('express');
var app = express();
app.use(express.static('public'));
var PORT = process.env.PORT || 3000;
var server = app.listen(PORT, function() {
    util.log(`Server running on port ${PORT}`);
});
app.set('view engine', 'pug');

var geoRect = '-74,40,-73,41';
var geoName = 'New York';

client.stream('statuses/filter', {locations: geoRect},  function(stream) {
    stream.on('data', function(tweet) {
        var r = sentiment(tweet.text);
        if (r.comparative !== 0) {
            if (tweets.length >= tweetLimit) {
                tweets.splice(0, 1);
            }
            tweets.push(r.score);
            totalSentiment = getTotalSentiment();
            avgSentiment = getAvgSentiment();
            
            tweetCounter++;
            util.log(tweetCounter, r.comparative, avgSentiment);
        }
    });
    
    stream.on('error', function(error) {
        console.log(error);
    });
});

function getTotalSentiment() {
    return tweets.reduce(function(a, b) {
        return a + b;
    }, 0);
}

function getAvgSentiment() {
    return totalSentiment / tweets.length;
}

function getSentimentColor() {
    return Math.floor(map(avgSentiment, -1, 1, 0, 255));
}

function getSentimentTextColor() {
    return (getSentimentColor() + 160) % 255;
}

function map(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function getMaxTick() {
    var absvals = [];
    tweets.forEach(function(t) {
        absvals.push(Math.abs(t));
    });
    return Math.max.apply(null, absvals);
}

app.get('/', function(req, res) {
    res.render('areasentiment', {
        sentimentColor: getSentimentColor(),
        sentimentTextColor: getSentimentTextColor(),
        stats: {
            avgSentiment: Math.round(avgSentiment * 100) / 100,
            totalTweets: tweets.length,
            totalSentiment: Math.round(totalSentiment * 100) / 100
        },
        data: JSON.stringify(tweets),
        maxTick: getMaxTick(),
        geoName: geoName,
    });
});

