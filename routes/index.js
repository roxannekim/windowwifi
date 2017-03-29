var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// our db model
var AverageColor = require("../models/model.js");

/**
 * GET '/'
 * Default home route. Just relays a success message back.
 * @param  {Object} req
 * @return {Object} json
 */
router.get('/', function(req, res) {
  var jsonData = {
  	'name': 'averageColorWindow',
  	'api-status':'OK'
  }
  // respond with json data
  res.json(jsonData)
});


// simple route to show an HTML page
router.get('/sample-page', function(req,res){
  res.render('sample.html')
});


// /**
//  * POST '/api/create'
//  * Receives a POST request of the new animal, saves to db, responds back
//  * @param  {Object} req. An object containing the different attributes of the Animal
//  * @return {Object} JSON
//  */
router.post('/api/create', function(req, res){
    console.log(req.body);
    // pull out the information from the req.body
    var city = req.body.city;
    var red = req.body.red;
    var green = req.body.green;
    var blue = req.body.blue;
    var localtime = req.body.localtime;
    // hold all this data in an object
    // this object should be structured the same way as your db model
    var averagecolorObj = {
      city: city,
      red: red,
      green: green,
      blue: blue,
      localtime: localtime
    };
    // create a new animal model instance, passing in the object
    var averagecolor = new AverageColor(averagecolorObj);
    // now, save that animal instance to the database
    // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model-save    
    averagecolor.save(function(err,data){
      // if err saving, respond back with error
      if (err){
        var error = {status:'ERROR', message: 'Error saving average color'};
        return res.json(error);
      }
      console.log('saved a new average color!');
      console.log(data);
      // now return the json data of the new animal
      var jsonData = {
        status: 'OK',
        averagecolor: data
      }
      return res.json(jsonData);
    })  
});


// /**
//  * GET '/api/get'
//  * Receives a GET request to get all animal details
//  * @return {Object} JSON
//  */
router.get('/api/get', function(req, res){
  // mongoose method to find all, see http://mongoosejs.com/docs/api.html#model_Model.find
  AverageColor.find(function(err, data){
    // if err or no animals found, respond with error 
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find average color'};
      return res.json(error);
    }
    // otherwise, respond with the data 
    var jsonData = {
      status: 'OK',
      averagecolor: data
    } 
    res.json(jsonData);
  })
})


router.get('/api/get/latest', function(req,res){
  // find all people, reverse sorted by dateAdded, so the last one added comes first
  AverageColor.find().sort('-dateAdded').exec(function(err,data){
      if(err){
        var error = {
          status: "ERROR",
          message: err
        }
        return res.json(err)
      }
      // let's just send back the first result
      var jsonData = {
        status: 'OK',
        averagecolor: data[0]

      }
      
      return res.json(jsonData);
  })
});


// /**
//  * GET '/api/search'
//  * Receives a GET request to search an animal
//  * @return {Object} JSON
//  */
router.get('/api/search', function(req,res){
  // first use req.query to pull out the search query
  var searchTerm = req.query.name;
  console.log("we are searching for " + searchTerm);
  // let's find that animal
  AverageColor.find({name: searchTerm}, function(err,data){
    // if err, respond with error 
    if(err){
      var error = {status:'ERROR', message: 'Something went wrong'};
      return res.json(error);
    }
    //if no animals, respond with no animals message
    if(data==null || data.length==0){
      var message = {status:'NO RESULTS', message: 'We couldn\'t find any results'};
      return res.json(message);      
    }
    // otherwise, respond with the data 
    var jsonData = {
      status: 'OK',
      averagecolor: data
    } 
    res.json(jsonData);        
  })
})


module.exports = router;
