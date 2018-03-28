var express = require('express');
var router = express.Router();
var whisper = require('../whisper')();
var symkey = require('../keystore/symkey').key;

var keys = [];
var rawKeys = [];
var filterIds = [];


/* GET home page. */
router.get('/', function(req, res, next) {

	var context = {};

	console.log('Keys:', keys);

	context['keys'] = keys;
	context['rawKeys'] = rawKeys;

  res.render('index', context);
});


router.post('/generateKey', function(req, res, next) {

	console.log('Received passsword:', req.body.password)

	var context = {};
	context['keys'] = keys;
	context['rawKeys'] = rawKeys;

	whisper.generateKey(req.body.password).then(keyId => {
	// whisper.addSymKey(symkey).then(keyId => {
		console.log("your symkey Id: "  + keyId);
		keys.push(keyId);
	}).then(() => {
		whisper.getSymKey(keys[0]).then(key => {
			console.log("your raw symKey: " + key);
			rawKeys.push(key);
		}).then(() => {
			
			res.render('index', context);
		})
	});
});


router.get('/publish', function(req, res, next) {

	var context = {};
	context['keys'] = keys;
	context['rawKeys'] = rawKeys;


	whisper.publish(keys[0]).then(res => {
		console.log('Publish result:', res);

	}).then(() => {
		console.log("Post successful");
		res.render('index', context);
	});
});


router.get('/subscribe', function(req, res, next) {

	var context = {};
	context['keys'] = keys;
	context['rawKeys'] = rawKeys;


	whisper.subscribe(keys[0]).then(res => {
		console.log('Subscribe result:',res);

	}).then(() => {
		res.render('index', context);
	});
});



router.get('/makeMsgFilter', function(req, res, next) {

	var context = {};
	context['keys'] = keys;
	context['rawKeys'] = rawKeys;


	whisper.makeMsgFilter(keys[0]).then(filterId => {
		filterIds.push(filterId); 

	}).then(() => {
		res.render('index', context);
	});
});

router.get('/useMsgFilter', function(req, res, next) {

	var context = {};
	context['keys'] = keys;
	context['rawKeys'] = rawKeys;

	whisper.useMsgFilter(filterIds[0]);

});


module.exports = router;