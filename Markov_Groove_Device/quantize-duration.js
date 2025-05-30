inlets = 2;
outlets = 1;

var bpm;

var fourQuarterNote;
var threeQuarterNote;
var twoQuarterNote;
var quarterNote;
var eighthNote;
var sixteenthNote;
var thirtySecondNote;

var threeQuarterNoteLowerBound;
var twoQuarterNoteLowerBound;
var quarterNoteLowerBound;
var eighthNoteLowerBound;
var sixteenthNoteLowerBound;

function quantizeDuration(pitch, duration){
    var quantizedQuarterNoteValue;
    if (duration >= fourQuarterNoteLowerBound) {
        quantizedQuarterNoteValue = 4;
    }
    else if (duration < fourQuarterNoteLowerBound && duration >= threeQuarterNoteLowerBound) {
        quantizedQuarterNoteValue = 3;
    }
    else if (duration < threeQuarterNoteLowerBound && duration >= twoQuarterNoteLowerBound) {
        quantizedQuarterNoteValue = 2;
    }
    else if (duration < twoQuarterNoteLowerBound && duration >= quarterNoteLowerBound) {
        quantizedQuarterNoteValue = 1;
    }
    else if (duration < quarterNoteLowerBound && duration >= eighthNoteLowerBound) {
        quantizedQuarterNoteValue = 0.5;
    }
    else if (duration < eighthNoteLowerBound && duration >= sixteenthNoteLowerBound) {
        quantizedQuarterNoteValue = 0.25;
    } 
    else if (duration < sixteenthNoteLowerBound) {
        quantizedQuarterNoteValue = 0.125;
    }
    pitchQuantizedQuarterNoteValuePair = [pitch, quantizedQuarterNoteValue];
    return pitchQuantizedQuarterNoteValuePair;
}

// Route incoming messages based on the inlet
function msg_int(value) {
    if (inlet === 0) {
        outlet(0, quantizeDuration(duration));
    } else if (inlet === 1) {
        bpm = value;
        quarterNote = 60000/bpm;

        fourQuarterNote = 4 * quarterNote;
        threeQuarterNote = 3 * quarterNote;
        twoQuarterNote = 2 * quarterNote;
        eighthNote = quarterNote/2;
        sixteenthNote = eighthNote/2;
        thirtySecondNote = sixteenthNote/2;

        fourQuarterNoteLowerBound = 3.5 * quarterNote;
        threeQuarterNoteLowerBound = 2.5 * quarterNote;
        twoQuarterNoteLowerBound = 1.5 * quarterNote;
        quarterNoteLowerBound = quarterNote - (sixteenthNote);
        eighthNoteLowerBound = eighthNote - thirtySecondNote;
        sixteenthNoteLowerBound = thirtySecondNote + (0.5 * thirtySecondNote);
    }
}

function list(pitch, duration) {
    if (inlet === 0) {
        outlet(0, quantizeDuration(pitch, duration));
    } else if (inlet === 1) {
        post("inlet 2 should be an int type for BPM")
    }
}

