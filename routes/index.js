var express = require('express');
var router = express.Router();
// var whisper = require('../whisper')();
var symkey = require('../keystore/symkey').key;

var keys = [];
var rawKeys = [];
var filterIds = [];

// var config = require('../config/config');
// var Web3 = require('web3');
// var net = require('net');

// var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// var ipcEndpoint = config.isTestnet ? config.dataDirTestnet : dataDir;

// this.web3 = new Web3(new Web3.providers.IpcProvider(ipcEndpoint, net));
// var web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/InJGUSbjUcfHGVFxTr91'));  
// console.log("==================== web3 current provider ====================")
// console.log(this.web3.currentProvider)

// web3.shh.setProvider(new Web3.providers.IpcProvider(ipcEndpoint, net));


// OKDK js 
var OKDK = require('../../okdkjs/index.js');
var okdk = OKDK();


function main() {
  okdk.init().then(() => {
    // Initialization successful.
  }).catch(error => {
    // Initialization failed.
    console.log(error);
  });
}

main();


/* GET home page. */
router.get('/', async (req, res, next) => {

	var context = {};

  const houseInfo = await okdk.houses.getHouseInfo(1);

  if(houseInfo == null) {
  	console.log("House Info Not Available!!!!");
  }
  else {
	  context['houseInfo'] = houseInfo;
  }


	context['keys'] = keys;
	context['rawKeys'] = rawKeys;

  // res.render('index', context);

  res.render('dashboard', context);

});


// AJAX POST rent lock
router.post('/rent', async (req, res) => {

	// data form: {"new_val":" ab@gmail.comw","id":"user_1_email"}
	var data = JSON.parse(JSON.stringify(req.body));

	console.log(data)

  /* Test reservation */
  var checkInDate = new Date();
  checkInDate.setDate(checkInDate.getDate() + 15);
  var checkIn = parseInt(checkInDate.getTime() / 1000);
  var checkOutDate = new Date();
  checkOutDate.setDate(checkOutDate.getDate() + 20);
  var checkOut = parseInt(checkOutDate.getTime() / 1000);

	const reservationId = await okdk.reservations.reserve(okdk.accounts[0], 1, checkIn, checkOut);

	console.log(reservationId)

	if(reservationId > 0) {
		res.status(200).json(reservationId);
	}
	else {
		res.status(400).json("Error");
	}

});


// AJAX POST open lock
router.post('/open', async (req, res) => {

	// data form: {"new_val":" ab@gmail.comw","id":"user_1_email"}
	var data = JSON.parse(JSON.stringify(req.body));

	console.log(data)


	var topic = "0x12345678";
	var message = "0x45454564574745745745745745745747";

	const success = await okdk.whisper.post(topic, null, message);

	console.log(success);

	if(success) {
		res.status(200).json("Whisper Post Success");
	}
	else {
		res.status(400).json("Whisper Post Error");
	}

	// updateCol(table, id, col, new_val, function(err, rows) {
	// 	if(err) {
	// 		console.log("update err: " + err) 
	// 		res.status(400).json(err);
	// 	}

	// 	else {
	// 		console.log("update success");
	// 		res.status(200).json("success");
	// 	}
	// });

});




// router.post('/generateKey', function(req, res, next) {

// 	console.log('Received passsword:', req.body.password)

// 	var context = {};
// 	context['keys'] = keys;
// 	context['rawKeys'] = rawKeys;

// 	whisper.generateKey(req.body.password).then(keyId => {
// 	// whisper.addSymKey(symkey).then(keyId => {
// 		console.log("your symkey Id: "  + keyId);
// 		keys.push(keyId);
// 	}).then(() => {
// 		whisper.getSymKey(keys[0]).then(key => {
// 			console.log("your raw symKey: " + key);
// 			rawKeys.push(key);
// 		}).then(() => {
			
// 			res.render('index', context);
// 		})
// 	});
// });


// router.get('/publish', function(req, res, next) {

// 	var context = {};
// 	context['keys'] = keys;
// 	context['rawKeys'] = rawKeys;


// 	whisper.publish(keys[0]).then(res => {
// 		console.log('Publish result:', res);

// 	}).then(() => {
// 		console.log("Post successful");
// 		res.render('index', context);
// 	});
// });


// router.get('/subscribe', function(req, res, next) {

// 	var context = {};
// 	context['keys'] = keys;
// 	context['rawKeys'] = rawKeys;


// 	whisper.subscribe(keys[0]).then(res => {
// 		console.log('Subscribe result:',res);

// 	}).then(() => {
// 		res.render('index', context);
// 	});
// });



// router.get('/makeMsgFilter', function(req, res, next) {

// 	var context = {};
// 	context['keys'] = keys;
// 	context['rawKeys'] = rawKeys;


// 	whisper.makeMsgFilter(keys[0]).then(filterId => {
// 		filterIds.push(filterId); 

// 	}).then(() => {
// 		res.render('index', context);
// 	});
// });

// router.get('/useMsgFilter', function(req, res, next) {

// 	var context = {};
// 	context['keys'] = keys;
// 	context['rawKeys'] = rawKeys;

// 	whisper.useMsgFilter(filterIds[0]);

// });


module.exports = router;