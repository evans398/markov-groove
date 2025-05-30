inlets = 2;  // Set up two inlets: one for pitch/velocity and one to control the gate
outlets = 1; // One outlet for outputting pitch and velocity

var gateIsOpen = true; // Global variable to track the gate's open/close state

function list(incomingPitch, incomingVelocity) {
    // Check if gate is open before outputting the note
    if (gateIsOpen) {
        outlet(0, [incomingPitch, incomingVelocity]); // Output pitch and velocity as a list
        gateIsOpen = false; // Close the gate after outputting
    }
}

// Use the int function to control the gate with the second inlet
function int(value) {
	post("in but out")
    // Open the gate when an integer of 1 is received at the second inlet
    if (value == 1) {
        gateIsOpen = true;
		post("IN IN IN")
    }
}
