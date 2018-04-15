module.exports = function(okdk) {
	return new pi_whisper(okdk);
}

function pi_whisper(okdk) {
	this.subscribe(okdk);
}


pi_whisper.prototype.subscribe = async function(okdk) {
	var topics = ['0x15151515'];

	const symKeyId = await okdk.whisper.generateKey('1234');

	const success = okdk.whisper.subscribe(topics, symKeyId, async (msg, sub) => {
		console.log("============== Whisper Got Message =============");

		const message = okdk.utils.hexToString(msg.payload);
		console.log(message);

		// check device status
	  const verifyGuestResult = await okdk.devices.verifyGuest(okdk.accounts[1], okdk.accounts[0]._address);
	  if (verifyGuestResult) {
	    console.log("Guest Access Granted");

			// Doorlock specific code goes here
			if(message == 'open') {
				console.log('========= open msg received =========');
			}

			else if(message == 'close') {
				console.log('========= close msg received =========');

			}

	  } else {
	    console.log('\n- Guest Access Denied');
	  }

	}, (err, sub) => {
		console.log("============== Whisper Subscribe Error =============");
	});
}

