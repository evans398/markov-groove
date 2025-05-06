var noteIsOn = null;  // Variable to store the currently active pitch
inlets = 2;
// Function to process incoming pitch and velocity
function list(pitch, velocity) {
	if (inlet == 0){
		if (noteIsOn) {
			return;
		} else if(!noteIsOn && velocity > 0) {
			noteIsOn = true;
			outlet(0, velocity);
		}
	}
}

// Function to reset noteIsOn when receiving a 0 on the second inlet
function msg_int(value) {
    if (inlet == 1 && value == 0) {
        noteIsOn = false;
        post("noteIsOn reset\n");  // Optional: print confirmation in the Max console
    }
}
