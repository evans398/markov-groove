inlets = 1;
outlets = 3;

// Initialize model variables
var transitionCounts = {};  // Count of transitions from a state pair
var transitionProbs = {};   // Calculated transition probabilities
var currentExternalState = null;   // Most recent state
var lastExternalState = null;      // Second most recent state

var currentInternalState = null;
var lastInternalState = null;

var listenToExternalInput = null;

// Function to train the model with a new state transition
function train(nextState) {
	// post("IN TRAIN");
    if (currentExternalState !== null && lastExternalState !== null) {
        // Use a key that combines the last two states for second-order
        var statePair = lastExternalState + "," + currentExternalState;
		// post("SET PAIR");

        // Initialize dictionaries if they don't exist for the state pair
        if (!transitionCounts[statePair]) {
            transitionCounts[statePair] = {};
            transitionProbs[statePair] = {};
        }

        // Update the count for transitions based on the last two states
        if (!transitionCounts[statePair][nextState]) {
            transitionCounts[statePair][nextState] = 0;
        }
        transitionCounts[statePair][nextState]++;

        // Update probabilities based on the new counts
        updateProbabilities(statePair);
    }

    // Update states
    lastExternalState = currentExternalState;  // The most recent state becomes the second most recent
    currentExternalState = nextState;          // Set the new state as the most recent

	// Initialize internal state values to initial external inputs
    if(lastInternalState == null && currentInternalState != null) {
        lastInternalState = currentInternalState; // if a current internal state already exists, set it to be last internal state
		currentInternalState = nextState;
		// post("LAST INTERNAL: " + lastInternalState);
    	// post("CURRENT INTERNAL: " + currentInternalState);
	}
	if(currentInternalState == null) {
        currentInternalState = nextState; // if there is not current internal state, set it to the first external state 
		// post("CURRENT INTERNAL: " + currentInternalState);
    }
}

// Function to update probabilities for a given state pair
function updateProbabilities(statePair) {
    // Initialize total transitions for the given state pair
    var totalTransitions = 0;

    // Sum up the counts of transitions from the given state pair to each target state
    for (var targetState in transitionCounts[statePair]) {
        totalTransitions += transitionCounts[statePair][targetState];
    }

    // Calculate probabilities for each transition from the given state pair
    for (var targetState in transitionCounts[statePair]) {
        transitionProbs[statePair][targetState] = transitionCounts[statePair][targetState] / totalTransitions;
    }
}

// Function to get the next state based on probabilities
function getNextStateExternal() {
    if (lastExternalState !== null && currentExternalState !== null) {
        // Construct the state pair
        var statePair = lastExternalState + "," + currentExternalState;

        if (transitionProbs[statePair]) {
            var rand = Math.random();
            var cumulativeProb = 0;

            // Iterate over possible next states
            for (var nextState in transitionProbs[statePair]) {
                cumulativeProb += transitionProbs[statePair][nextState];
                if (rand < cumulativeProb) {
                    return parseInt(nextState, 10);
                }
            }
        }
    }
    return null;  // Return null if there's no valid transition
}

// Function to get the next state based on internal probabilities
function getNextStateInternal() {
    if (lastInternalState !== null && currentInternalState !== null) {
        // Construct the internal state pair
        var statePair = lastInternalState + "," + currentInternalState;
		// post("STATE PAIR INTERNAL: " + statePair);
        if (transitionProbs[statePair]) {
            var rand = Math.random();
            var cumulativeProb = 0;

            // Iterate over possible next states
            for (var nextState in transitionProbs[statePair]) {
                cumulativeProb += transitionProbs[statePair][nextState];
                if (rand < cumulativeProb) {
					lastInternalState = currentInternalState;
					currentInternalState = nextState;
					statePair = lastInternalState + "," + currentInternalState;
					// post("NEW STATE PAIR INTERNAL: " + statePair);
                    return parseInt(nextState, 10);
                }
            }
        }
    }
    return null;  // Return null if there's no valid transition
}

// Max wrapper functions
function reset() {
    transitionCounts = {};  // Reset transition counts
    transitionProbs = {};   // Reset transition probabilities
    currentExternalState = null;
    lastExternalState = null;
    currentInternalState = null;
    lastInternalState = null;
    // post("Second Order Markov Pitch Model Reset\n");
}

function followExternal() {
    listenToExternalInput = true;
    // post("Second Order Markov Pitch Model following external input\n");
}

function followInternal() {
    listenToExternalInput = false;
    // post("Second Order Markov Pitch Model following internal state\n");
}

function dump() {
    // post("Second Order Pitch Counts: " + JSON.stringify(transitionCounts) + "\n");
    // post("Second Order Pitch Probabilities: " + JSON.stringify(transitionProbs) + "\n");
    outlet(1, "Second Order Pitch Counts: " + JSON.stringify(transitionCounts));
    outlet(2, "Second Order Pitch Probabilities: " + JSON.stringify(transitionProbs));
}

// Function to handle a list of pitch and velocity
function list() {
	// post("IN LIST");
    // Assuming the list contains two values: pitch and velocity
    if (arguments.length >= 2) {
        var pitch = arguments[0];     // First value in the list is pitch
        var velocity = arguments[1];  // Second value in the list is velocity

        if(velocity > 0) {
        	train(pitch);  // Train with the pitch value
		}
    } else {
        post("Error: Expected a list of at least two values (pitch and velocity).\n");
    }
}

function bang() {
    var nextState = null;
    // Check that follow source is set
    if (listenToExternalInput === null) {
        post("Markov Second Order Model follow source not set!\n");
        return;
    }
    if (listenToExternalInput) {
        nextState = getNextStateExternal();  // Generate next state
    } else {
        nextState = getNextStateInternal();  // Generate next state
    }
    if (nextState !== null) {
        outlet(0, nextState);
    }
}
