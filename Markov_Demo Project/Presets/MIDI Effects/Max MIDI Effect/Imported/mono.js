// MONO GROOVE

var currentPitch = null;
var currentVelocity = 0;

function list(incomingPitch, incomingVelocity) {
    // post("entry vel: " + incomingVelocity + "\n");
    
    // Check if there's already an active note that is not the incoming note
    if (currentVelocity != 0 && currentPitch != incomingPitch) {
	
        return;  // Block new note if another note is still active
    } 
    
    // Handle note-off for the current active note
    if (incomingVelocity == 0 && currentPitch == incomingPitch) {
	
        outlet(0, 0);  // Send a complete note-off message
        currentPitch = null;            // Reset the active pitch
        currentVelocity = 0;            // Reset the velocity
        return;
    } 
    
    // Handle note-on if no current note is active
    if (currentVelocity == 0 && incomingVelocity > 0) {
	
        currentPitch = incomingPitch;
        currentVelocity = incomingVelocity;
        outlet(0, incomingVelocity);  // Send the note-on message
    }
    
   // post("exit vel: " + currentVelocity + "\n");
}

