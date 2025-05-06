inlets = 2;  // Set up two inlets: one for pitch/velocity and one to control the gate
outlets = 2; // One outlet for outputting pitch and velocity

var gateIsOpen = true; // Global variable to track the gate's open/close state

function list(incomingPitch, incomingVelocity) {
    // Check if gate is open before outputting the note
    if (gateIsOpen) {
		outlet(1, "bang");
        outlet(0, [incomingPitch, incomingVelocity]); // Output pitch and velocity as a list
        gateIsOpen = false; // Close the gate after outputting
		post("LETNOTEPASS")
    } else {
		post("DENIEDANOTE")
	}
}

// Use the int function to control the gate with the second inlet
function bang() {
    gateIsOpen = true;
	post("OPENEDUPTHEGATE")
}
