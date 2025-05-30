// Dictionary to store note data with pitch as the key
var noteData = {};


// Function to handle incoming pitch, velocity, and timestamp
function processNoteData(timestamp, pitch, velocity) {
    if (velocity > 0) {
        // Note-on: store pitch with the start timestamp
        noteData[pitch] = { start: timestamp };
    } else {
        // Note-off: check if the note exists in the dictionary
        if (noteData[pitch] && noteData[pitch].start !== undefined) {
            // Calculate duration
            var duration = timestamp - noteData[pitch].start;
            
            // Store the duration and reset start time for pitch
            noteData[pitch].duration = duration;
            delete noteData[pitch].start;

            // list to send
            pitchDurationPair = [pitch, duration];

            // Use outlet to send the list to Max/MSP
            outlet(0, pitchDurationPair);  // Max will interpret this as a list
        }
    }
}

// Max/MSP functions to receive data
function msg_int(value) {
    // Assuming `value` is either pitch or velocity based on input configuration
    // This function can be configured to accept and route inputs as needed
}

function list(timestamp, pitch, velocity) {
    // Accept a list with pitch, velocity, and timestamp
    processNoteData(timestamp, pitch, velocity);
}
