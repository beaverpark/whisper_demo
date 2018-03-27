'use strict';

var config = require('./config/config');

module.exports = function() {
	return new Whisper();
}

function Whisper() {
	var Web3 = require('web3');
  var net = require('net');

  // this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

  var ipcEndpoint = config.isTestnet ? config.dataDirTestnet : dataDir;

	this.web3 = new Web3(new Web3.providers.IpcProvider(ipcEndpoint, net));
	// this.web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/InJGUSbjUcfHGVFxTr91'));
  
  var shh = this.web3.shh;

  shh.getInfo().then(console.log)



  // var temp;
  // shh.newKeyPair().then((id) => {
  //   console.log(id)
  //   temp.push(id);
  // })


  // .then(() => {
    // console.log(temp)
  // this.web3.shh.hasKeyPair('d5eef8c52458ee3f6631a5438e0d907186f5b6034aa0b14eca9c6539838d7df4').then(console.log)
  // }

	this.web3.eth.getBlockNumber().then((res) => {
	    console.log("block #: " + res);
	});


  // this.web3.shh.newMessageFilter({pubKey: '0x04f266dbdf3b62b440c61b6d1404a4409ca54f3d74bd0c1e382425eccbb6675e78cde2e258b67fba407c62d6201eac951e61c7b165d3dd168573c070928390d4de'}).then(console.log);

  // this.web3.shh.subscribe("messages", {
  //   pubKey: '0x04f266dbdf3b62b440c61b6d1404a4409ca54f3d74bd0c1e382425eccbb6675e78cde2e258b67fba407c62d6201eac951e61c7b165d3dd168573c070928390d4de',
  //   topics: ['0x33445567']
  // }, function(err, msg, subs) {
  //   if(err) console.log(err)

  //   console.log(msg)

  // });




	// var user = web3.eth.accounts;
	// console.log(user)

}

Whisper.prototype.generateKey = function(password) {
  var shh = this.web3.shh;

  return new Promise((resolve, reject) => {
    console.log('(whisper.js) Password:', password)
    // shh.newSymKey().then(id => {
    shh.generateSymKeyFromPassword(password).then(id => {
      resolve(id);
    }).catch(err => reject(err));


    // var keyPair = {
    //   keyId: null,
    //   pubKey: ""
    // };

    // shh.newKeyPair().then(id => {
    //   keyPair.keyId = id;
    //   this.keyId = id;
    //   // console.log(1)
    //   // console.log(keyPair)

    //   shh.getPublicKey(id).then(pubKey => {
    //     keyPair.pubKey = pubKey;
    //     this.pubKey = pubKey;
    //     // console.log(2)
    //     // console.log(keyPair)

    //     resolve(keyPair);
    //   }).catch(err => reject(err));
    // }).catch(err => reject(err));
  });
}

Whisper.prototype.addSymKey = function(symKey) {

  var shh = this.web3.shh;

  // return new Promise((resolve, reject) => {

  return new Promise((resolve, reject) => {

    console.log('(whisper.js) Symkey:', symKey)
    shh.addSymKey(symKey).then(res => {
      console.log(res);
      resolve(res);
    }).catch(err => {
      console.log
    });
  })
}

Whisper.prototype.subscribe = function(symKey) {

  var shh = this.web3.shh;

  // return new Promise((resolve, reject) => {

  return new Promise((resolve, reject) => {

    console.log('(whisper.js) Symkey:',symKey)
    shh.subscribe('messages', {
      symKeyID: symKey, // encrypts using the sym key ID
      topics: [config.topic],
      ttl: 200
    }, (err, msg, subscription) => {
      if(err) reject(err);

      else {
        console.log("subscription successful")
        console.log('(whisper.js) Msg:',msg);

        resolve(msg);
      }
    });
  }).catch(console.log);
}

Whisper.prototype.makeMsgFilter = function(symKey) {

  var shh = this.web3.shh;

  // return new Promise((resolve, reject) => {

  return new Promise((resolve, reject) => {
    shh.newMessageFilter({
      symKeyID: symKey, // encrypts using the sym key ID
      topics: [config.topic]
    }).then((filterId) => {
      console.log("filter id = " + filterId);
      resolve(filterId);
    });
  }).catch(console.log);
}


Whisper.prototype.useMsgFilter = function(filterId) {

  var shh = this.web3.shh;
  console.log("filter id using is " + filterId);

  setInterval(() => {
    shh.getFilterMessages(filterId).then(messages => {
      for(let msg of messages) {
        console.log("----------------THIS IS FILTERED MESSAGE-----------------");
        console.log(msg);
        console.log("--------------//THIS IS FILTERED MESSAGE//---------------");
      }
    });
  }, 1000);
}


Whisper.prototype.publish = function(symKey) {

  var shh = this.web3.shh;

  // return new Promise((resolve, reject) => {

  return new Promise((resolve, reject) => {

    console.log('(whisper.js) Symkey:',symKey)
    shh.post({
      symKeyID: symKey, // encrypts using the sym key ID
      // sig: this.keyId, // signs the message using the keyPair ID
      ttl: 20,
      topic: config.topic,
      payload: '0x6f6b6579646f6b6579', // write encode to hex fx & take in param
      powTime: 3,
      powTarget: 3.0
    }).then((res) => {
      resolve(res);
    }).catch(err => reject(err));
  });

  // const recipientPubKey = 

	// var identities = [];
	// var subscription = null;

	// var shh = this.web3.shh;


  // console.log(shh.info)

	// console.log("1")
	// Promise.all([
 //    shh.newSymKey().then((id) => {
 //    	console.log(id)
 //    	identities.push(id);
 //    }),
 //    shh.newKeyPair().then((id) => {
 //    	identities.push(id);
 //    })
	// ]).then(() => {

	// }).then(() => {
	// console.log("3")

 //    shh.post({
 //      symKeyID: identities[0], // encrypts using the sym key ID
 //      sig: identities[1], // signs the message using the keyPair ID
 //      ttl: 10,
 //      topic: '0x33445566',
 //      payload: '0x6f6b6579646f6b6579', // write encode to hex fx & take in param
 //      powTime: 3,
 //      powTarget: 0.5
 //    }, (err, res) => {
 //    	if(err) console.log(err);

 //    	console.log(res)
 //    });
	// }).then(() => {

	// console.log("2")
 //    subscription = shh.subscribe("messages", {
 //      symKeyID: identities[0],
 //      topics: ['0x33445566']
 //    }).on('data', console.log);
 //  }).catch(console.log);
}