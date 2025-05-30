// RANDOM DURATION

inlets = 1;
outlets = 1;


// Initialize an array with a fixed length of 5
var durationList = [0.125, 0.25, 0.5, 1, 2, 3, 4];

// Function to randomly select a value from the list
function getRandomValueFromList() {
    if (durationList.length === 0) {
        post("The random duration list is empty.\n");
        return null;
    }

    // Generate a random index based on the list length
    var randomIndex = Math.floor(Math.random() * durationList.length);

    // Return the value at the random index
    return durationList[randomIndex];
}

function bang() {
	if (durationList.length > 0) {
        outlet(0, getRandomValueFromList());
    }
}

