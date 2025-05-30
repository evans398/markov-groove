inlets = 3;
outlets = 2;
var sendToOrgan1 = true;


function list(pitch, velocity, noteDuration) {
	if (sendToOrgan1) {
		outlet(0, [pitch, velocity, noteDuration]);
		sendToOrgan1 = false;
	} else {
		outlet(1, [pitch, velocity, noteDuration]);
		sendToOrgan1 = true;
	}
}