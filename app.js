// require csvtojson module
const CSVToJSON = require('csvtojson');

// convert dino.csv file to JSON array
CSVToJSON().fromFile('dino.csv')
    .then(users => {

        // users is a JSON array
        // log the JSON array
        console.log(dino);
    }).catch(err => {
        // log error if any
        console.log(err);
    });