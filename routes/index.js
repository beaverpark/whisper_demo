var express = require('express');
var router = express.Router();
var whisper = require('../whisper')();
var symkey = require('../keystore/symkey').key;

var keys = [];
var filterIds = [];


/* GET home page. */
router.get('/', function(req, res, next) {

	var context = {};

	console.log('Keys:', keys);

	context['keys'] = keys;

  res.render('index', context);
});


router.post('/generateKey', function(req, res, next) {

	console.log('Received passsword:', req.body.password)

	var context = {};
	context['keys'] = keys;

	whisper.generateKey(req.body.password).then(keyId => {
	// whisper.addSymKey(symkey).then(keyId => {
		console.log("symkey Id: "  + keyId);
		keys.push(keyId);

	}).then(() => {
		res.render('index', context);
	});
});

router.get('/publish', function(req, res, next) {

	var context = {};
	context['keys'] = keys;

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

	whisper.subscribe(keys[0]).then(res => {
		console.log('Subscribe result:',res);

	}).then(() => {
		res.render('index', context);
	});
});



router.get('/makeMsgFilter', function(req, res, next) {

	var context = {};
	context['keys'] = keys;

	whisper.makeMsgFilter(keys[0]).then(filterId => {
		filterIds.push(filterId); 

	}).then(() => {
		res.render('index', context);
	});
});

router.get('/useMsgFilter', function(req, res, next) {

	var context = {};
	context['keys'] = keys;

	whisper.useMsgFilter(filterIds[0]);

});


module.exports = router;