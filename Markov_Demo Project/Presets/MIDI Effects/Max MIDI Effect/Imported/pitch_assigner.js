// FIRST ORDER PITCH
outlets = 2;

// Initialize model variables
var noteAssignments = {};  // Count of transitions
assignToOrgan1 = true;

// Function to train the model with a new state transition
function assignNote(incomingNote) {
	if (noteAssignments[incomingNote] == null) {
		if (assignToOrgan1) {
			noteAssignments[incomingNote] = 0;
		} else {
			noteAssignments[incomingNote] = 1;
		}
        assignToOrgan1 = !assignToOrgan1;
    }
	outletNum = noteAssignments[incomingNote];
	outlet(outletNum, incomingNote);
}

// Max wrapper functions
function reset(){
    noteAssignments = {};  // reset assignments
    post("Reset Note Assignments Algorithm");
}



function dump(){
    post("Note Assingments: " + JSON.stringify(noteAssignments));
}

function msg_int(incomingNote) {
    assignNote(incomingNote);  // assign incoming note
}


