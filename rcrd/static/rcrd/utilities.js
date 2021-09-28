
var send_data_to_server = function(data, filename){
	sendJSONData(JSON.stringify(data), "s_" + subjectnr + "_" + filename);
}


// Function used to pause the trial when required
function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
		currentDate = Date.now();
	} while (currentDate - date < milliseconds);
}
// Function for grabbing parameters from URL
function getParamFromURL( name ) {
	name = name.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");
	var regexS = "[\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( window.location.href );
	if( results == null )
		return "";
	else
		return results[1];
}

var experiments = [];

// Generates an experiment timeline 
function makeExp() {
	

	
	// Obtains value 'cond' from URL which encodes whether the experiment will be production 'p'/NA or comprehension 'c'
	// Obtains value 'subjectnr' from URL
	// example: http://localhost:8000/elise6.html?subjectnr=11111&?cond=c
	// example: https://talk.psych.wisc.edu/test/elise7/?subjectnr=11113&?cond=p
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	cond = getParamFromURL('cond');
	subjectnr =getParamFromURL('subjectnr');

	if (cond == 'c') {
		comp = true;
	} else {
		comp = false;
		cond = 'p';
	}

    var hello_trial = {
        type: 'html-keyboard-response',
        stimulus: 'Hello world!',
        trial_duration: 5000
    }
    experiments.push(hello_trial)
	
	
	var test_recording =  {
		type: 'audio_recorder',
		prompt: "test audio recording",
		trial_duration: 2000,
		file_name_recording: "tesssst",
		subjectID: subjectnr
	}
	
	experiments.push(test_recording)
	
	
	 var bye_trial = {
        type: 'html-keyboard-response',
        stimulus: 'Bye world!',
        trial_duration: 5000
    }
	
    experiments.push(bye_trial)

	// Returns matrix of experiment timelines
	return experiments;
}