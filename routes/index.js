var express = require('express');
var router = express.Router();
// var whisper = require('../whisper')();
var symkey = require('../keystore/symkey').key;

var keys = [];
var rawKeys = [];
var filterIds = [];


// Web3 Initialize
// const ethClient = 'http://localhost:8546';
// const bzzClient = 'http://swarm-gateways.net';

// let Web3 = require('web3');
// let net = require('net');

// web3 = new Web3(new Web3.providers.HttpProvider(ethClient));
// web3.bzz.setProvider(bzzClient);

// web3.shh.setProvider(new Web3.providers.IpcProvider("/Users/ryanpark/Documents/okdk-whisper/datadir/geth.ipc", net));



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

	// var data = JSON.parse(JSON.stringify(req.body));
	// console.log(data.password)

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

	const success = await okdk.whisper.post(topic, data.symKeyId, message);

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


router.post('/generateKey', async (req, res) => {

	var data = JSON.parse(JSON.stringify(req.body));

	console.log(data)

	const symKeyId = await okdk.whisper.generateKey(data.password);

	console.log(symKeyId);

	res.status(200).json(symKeyId);

});


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