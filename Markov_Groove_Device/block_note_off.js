// Pitch and velocity filter script in Max
inlets = 1;
outlets = 2;

function list() {
    // Retrieve pitch and velocity from the list input
    var pitch = parseInt(arguments[0], 10);
    var velocity = parseInt(arguments[1], 10);

    // Check if velocity is not zero
    if (velocity > 0) {
        // Output pitch and velocity as a list
        outlet(0, pitch);
		outlet(1, velocity);
    }
    // If velocity is 0, do nothing
}
