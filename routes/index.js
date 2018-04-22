var express = require('express');
var router = express.Router();
// var whisper = require('../whisper')();
var symkey = require('../keystore/symkey').key;

// var keys = [];
// var rawKeys = [];
// var filterIds = [];
var reservation_code = null;
var reseration_id = null;
var symKeyId = null;

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

// DEMO: subscription happens from the beginning
// for real, after getting event from the reservation contract, subscription should happen
var pi_whisper = require('../pi_whisper')(okdk); 


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

	var user = await okdk.accounts[0];
	console.log(user)


  context['houseInfo'] = await okdk.houses.getHouseInfo(1);
  context['user'] = await okdk.accounts[0];

  // DEMO: for now, manually set token balance to show reasonable amt
  // context['token_balance'] = await okdk.token.getBalance(okdk.accounts[0]);
  context['token_balance'] = '11640';
  context['balance_after'] = 11640 - context.houseInfo.dailyRate;

	// 30key = $1 
  var key_1usd = 30;

	// context['keys'] = keys;
	// context['rawKeys'] = rawKeys;

	console.log(context);

  res.render('dashboard', context);
});


/* GET home page. */
router.get('/reservations', (req, res, next) => {

  res.render('reservations');
});


// AJAX POST rent lock
router.post('/rent', async (req, res) => {

	var context = {};

  /* Test reservation */
  var checkInDate = new Date();
  checkInDate.setDate(checkInDate.getDate() + 15);
  var checkIn = parseInt(checkInDate.getTime() / 1000);
  var checkOutDate = new Date();
  checkOutDate.setDate(checkOutDate.getDate() + 20);
  var checkOut = parseInt(checkOutDate.getTime() / 1000);

	const reservationId = await okdk.reservations.reserve(okdk.accounts[0], 1, checkIn, checkOut);
	reservation_id = reservationId;

	// get reservation code
	const reservationInfo = await okdk.reservations.getReservationInfo(reservationId);
	reservation_code = reservationInfo.reservationCode;

	// console.log("reservation code: " + reservation_code)

	// make symKey using reservation Id
	// const symKeyId = await okdk.whisper.generateKey(reservationId);

	// DEMO: generate key from pw 1234
	symKeyId = await okdk.whisper.generateKey('1234');

	console.log(symKeyId);

	if(reservationId > 0) {
		res.status(200).json("Your reservation has been confirmed.");
	}
	else {
		res.status(400).json("Error");
	}

});

// AJAX POST generate symmetric key
// router.post('/generateKey', async (req, res) => {

// 	// make symKey using reservation Id
// 	const symKeyId = await okdk.whisper.generateKey(reservationId);

// 	console.log(symKeyId);

// 	res.status(200).json(symKeyId);
// });


// AJAX POST open lock (post whisper message)
router.post('/open', async (req, res) => {

	// var data = JSON.parse(JSON.stringify(req.body));
	// console.log(data)

	var topic = "0x15151515";

	// DEMO: should have guest addr to the msg as well 
	var hex_message = okdk.utils.stringToHex("open");

	const success = await okdk.whisper.post(topic, symKeyId, hex_message);

	// console.log(success);

	if(success) {
		console.log("============== Whisper POST Success =============");
		res.status(200).json("Whisper Post Success");
	}
	else {
		console.log("============== Whisper POST Error =============");
		res.status(400).json("Whisper Post Error");
	}
});


// AJAX POST open lock (post whisper message)
router.post('/close', async (req, res) => {

	// var data = JSON.parse(JSON.stringify(req.body));
	// console.log(data)

	var topic = "0x15151515";

	// DEMO: should have guest addr to the msg as well 
	var hex_message = okdk.utils.stringToHex("close");

	const success = await okdk.whisper.post(topic, symKeyId, hex_message);

	// console.log(success);

	if(success) {
		console.log("============== Whisper POST Success =============");
		res.status(200).json("Whisper Post Success");
	}
	else {
		console.log("============== Whisper POST Error =============");
		res.status(400).json("Whisper Post Error");
	}
});




// // AJAX POST subscribe to whisper message
// router.post('/subscribe', (req, res) => {

// 	var data = JSON.parse(JSON.stringify(req.body));

// 	console.log("Subscription")

// 	var topics = ['0x15151515'];
// 	const success = okdk.whisper.subscribe(topics, data.symKeyId, async (msg, sub) => {
// 		console.log("============== Whisper Subscribe Success =============");

// 		// check device status
// 	  const verifyGuestResult = await okdk.devices.verifyGuest(okdk.accounts[1], okdk.accounts[0]._address);
// 	  if (verifyGuestResult) {
// 	    console.log("Guest authorization test passed");
// 			// Doorlock specific code goes here

// 	  } else {
// 	    console.log('\n- Guest authorization test failed!');
// 	  }

// 	}, (err, sub) => {
// 		console.log("============== Whisper Subscribe Error =============");
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