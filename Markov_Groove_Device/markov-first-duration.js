// FIRST ORDER DURATION

inlets = 1;
outlets = 3;

// Initialize model variables
var transitionCounts = {};  // Count of transitions from a single state
var transitionProbs = {};   // Calculated transition probabilities
var currentExternalState = null;   // Most recent state

var currentInternalState = null;

var listenToExternalInput = null;

// Function to train the model with a new state transition
function train(nextState) {
    // post("IN TRAIN\n");

    if (currentExternalState !== null) {
        // Initialize dictionaries if they don't exist for the current state
        if (!transitionCounts[currentExternalState]) {
            transitionCounts[currentExternalState] = {};
            transitionProbs[currentExternalState] = {};
        }

        // Update the count for transitions based on the current state
        if (!transitionCounts[currentExternalState][nextState]) {
            transitionCounts[currentExternalState][nextState] = 0;
        }
        transitionCounts[currentExternalState][nextState]++;

        // Update probabilities based on the new counts
        updateProbabilities(currentExternalState);
    }

    // Update state
    currentExternalState = nextState;

    // Initialize internal state values to initial external inputs
    if (currentInternalState === null) {
        currentInternalState = nextState; // Initialize the internal state if it doesn't exist
        // post("CURRENT INTERNAL: " + currentInternalState + "\n");
    }
}

// Function to update probabilities for a given state
function updateProbabilities(state) {
    // Initialize total transitions for the given state
    var totalTransitions = 0;

    // Sum up the counts of transitions from the given state to each target state
    for (var targetState in transitionCounts[state]) {
        totalTransitions += transitionCounts[state][targetState];
    }

    // Calculate probabilities for each transition from the given state
    for (var targetState in transitionCounts[state]) {
        transitionProbs[state][targetState] = transitionCounts[state][targetState] / totalTransitions;
    }
}

// Function to get the next state based on probabilities (external)
function getNextStateExternal() {
    if (currentExternalState !== null && transitionProbs[currentExternalState]) {
        var rand = Math.random();
        var cumulativeProb = 0;

        // Iterate over possible next states
        for (var nextState in transitionProbs[currentExternalState]) {
            cumulativeProb += transitionProbs[currentExternalState][nextState];
            if (rand < cumulativeProb) {
                return parseFloat(nextState);
            }
        }
    }
    return null;  // Return null if there's no valid transition
}

// Function to get the next state based on probabilities (internal)
function getNextStateInternal() {
    if (currentInternalState !== null && transitionProbs[currentInternalState]) {
        var rand = Math.random();
        var cumulativeProb = 0;

        // Iterate over possible next states
        for (var nextState in transitionProbs[currentInternalState]) {
            cumulativeProb += transitionProbs[currentInternalState][nextState];
            if (rand < cumulativeProb) {
                currentInternalState = nextState;  // Update the internal state to the chosen next state
                return parseFloat(nextState);
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
    currentInternalState = null;
    // post("First Order Markov Duration Model Reset\n");
}

function followExternal() {
    listenToExternalInput = true;
    // post("First Order Markov Duration Model following external input\n");
}

function followInternal() {
    listenToExternalInput = false;
    // post("First Order Markov Duration Model following internal state\n");
}

function dump() {
    post("First Order Duration Counts: " + JSON.stringify(transitionCounts) + "\n");
    post("First Order Duration Probabilities: " + JSON.stringify(transitionProbs) + "\n");
    outlet(1, "First Order Duration Counts: " + JSON.stringify(transitionCounts));
    outlet(2, "First Order Duration Probabilities: " + JSON.stringify(transitionProbs));
}

function list() {
    // post("IN LIST\n");
    // Assuming the list contains two values: pitch and noteDuration
    if (arguments.length >= 2) {
        var pitch = arguments[0];     // First value in the list is pitch (not needed)
        var noteDuration = arguments[1];  // Second value in the list is duration
        train(noteDuration);  // Train with the duration value
    } else {
        post("Error: Expected a list of at least two values (pitch and note duration).\n");
    }
}

function bang() {
    var nextState = null;
    // Check that follow source is set
    if (listenToExternalInput === null) {
        post("Markov First Order Model follow source not set!\n");
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
