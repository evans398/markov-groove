inlets = 3;
outlets = 2;

var minNote = null;
var maxNote = null;

// Route incoming messages based on the inlet
function msg_int(value) {
    if (inlet === 1) {
        minNote = value;
    } else if (inlet === 2) {
        maxNote = value;
    }
}

// Function to handle a list of pitch and velocity
function list() {
    if (arguments.length >= 2) {
        var pitch = arguments[0];     // First value in the list is pitch
        var velocity = arguments[1];  // Second value in the list is velocity

        if(pitch >= minNote && pitch <= maxNote) {
			post("OUTPUTTING");
        	outlet(0, pitch);
			outlet(1, velocity);
		}
    } else {
        post("Error: Expected a list of at least two values (pitch and velocity).\n");
    }
}