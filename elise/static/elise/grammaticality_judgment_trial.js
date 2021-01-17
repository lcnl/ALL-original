
// Plays audio file 
async function playAudio(audio) {
	audio.play()
}

// Function used to set a timer and then call the audio file player
function audioAfterTime(audio, time) {
	return new Promise(resolve => {
		setTimeout(() => {
			playAudio(audio);
		}, time);
	});
}

// Runs an active comprehension trial 
function grammaticality_judgment_trial(correct, sound) {
	
	// Determines the appropriate key and image to set for the correct value in the user interaction (76 is L, 65 is A)
	var corimage;
	var key;
	if (correct) {
		key = 76;
		
	}
	else {
		key = 65;
	
	}

    // Retrieves audio file name for the purpose of getting the duration from the dictionary
    var audioFileName = (sound.substring(1+sound.lastIndexOf("/")))

	// Audio instance is set 
	var audio = new Audio(sound);


	// variable storing the timeline for the trial that will be output
	let grammaticality_judgment_trial= {
		timeline: [{
			// Displays fixation cross
			type: 'html-keyboard-response',
			stimulus: '+',
			choices: jsPsych.NO_KEYS,
			trial_duration: 500
		}, {
			// Calls sound in 1 second so that it will play during the image display
			type: 'call-function',
			async: false,
			func: function() { audioAfterTime(audio, 1000) }
		},
		{
			// Displays image and asks user to select y for yes or n for no based on the sound that is played
			type: 'categorize-html',
			stimulus: "<p></p>",
			key_answer: key,
			choices: [76, 65],
			correct_text: "<p></p>",
			incorrect_text: "<p></p>",
			// Uses html pre tag to make spaces persist. To adjust distance in between, simply add spaces
			prompt: "<pre>ungrammatical push a                                                                                   grammatical push l</pre>",
			feedback_duration: 0
		},
		{
			// Blank screen to implement pause
			type: 'image-keyboard-response',
			stimulus: '../elise/static/elise/img/images/blank.png',
			choices: jsPsych.NO_KEYS,
			trial_duration: 500
		}
			, {
			// Retrieves and separates relevant data from the appropriate timeline node
			type: 'call-function',
			async: false,
			func: function() {
				var current_node_id = jsPsych.currentTimelineNodeID();
				// Navigates from the end of the timeline to the node associated with the categorize image trial
				var valid_node_id = current_node_id.substring(0, current_node_id.length - 3) + "2.0";
				// Gets data from this node and prints it to the screen
				// TODO: this will be changed to a server ajax call later in process
				var data_from_current_node = jsPsych.data.getDataByTimelineNode(valid_node_id);
				console.log(data_from_current_node.csv())
				
			}
		}
		],
		timeline_variables: [{
			img: null
		}
		]
	}

	return grammaticality_judgment_trial
}

