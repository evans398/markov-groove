// FIRST ORDER DURATION

inlets = 1;
outlets = 1;


// Initialize an array with a fixed length of 5
var pitchList = [];

// Function to add a new value to the list if it doesn't already exist
function addToList(newPitch) {
	// Check if the value exists using indexOf
	if (pitchList.indexOf(newPitch) !== -1) {
    	// post("Pitch already exists in the list.\n");
	} else {
        // Add the new value to the end of the list
        pitchList.push(newPitch);

        // Check if the list is longer than 5, and remove the oldest value if needed
        if (pitchList.length > 5) {
            pitchList.shift(); // Remove the first (oldest) element
        }

        // Print the current list to the Max console
        // post("Current List: " + pitchList + "\n");
    }
}

// Function to randomly select a value from the list
function getRandomValueFromList() {
    if (pitchList.length === 0) {
        post("The list is empty.\n");
        return null;
    }

    // Generate a random index based on the list length
    var randomIndex = Math.floor(Math.random() * pitchList.length);

    // Return the value at the random index
    return pitchList[randomIndex];
}

function followExternal() {
    // N/A do nothing
}

function followInternal() {
    // N/A do nothing
}

// Max wrapper functions
function reset() {
    pitchList = [];
    // post("Random Pitch Model Reset\n");
}

function dump() {
    post("Random Pitch List: " + JSON.stringify(pitchList) + "\n");
}

// Function to handle a list of pitch and velocity
function list() {
	// post("IN LIST");
    // Assuming the list contains two values: pitch and velocity
    if (arguments.length >= 2) {
        var pitch = arguments[0];     // First value in the list is pitch
        var velocity = arguments[1];  // Second value in the list is velocity

        if(velocity > 0) {
        	addToList(parseInt(pitch));  // Train with the pitch value
		}
    } else {
        post("Error: Expected a list of at least two values (pitch and velocity).\n");
    }
}


function bang() {
	if (pitchList.length > 0) {
        outlet(0, getRandomValueFromList());
    }
}

