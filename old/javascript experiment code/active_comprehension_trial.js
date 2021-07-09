
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
function active_comprehension_trial(image1, image2, correct, sound, prompt) {

	// Determines the appropriate key to set for the correct value in the user interaction
	var key;
	if (correct) {
		key = 76;
	}
	else {
		key = 65;
	}

	// Saves current folder in server for ease of path determination
	var loc = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname + window.location.search;

	// Audio instance is set 
	var audio = new Audio(sound);

	// Audio file duration is used to determine how long the images need to be shown
	audio.addEventListener("loadeddata", function() {
		active_comprehension_trial['timeline'][2]['stimulus_duration'] += 1000 * this.duration;
		active_comprehension_trial['timeline'][5]['trial_duration'] += 1000 * this.duration;
	});

	// variable storing the timeline for the trial that will be output
	var active_comprehension_trial = {
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
			type: 'categorize-image',
			stimulus: image1,
			key_answer: key,
			choices: [76, 65],
			correct_text: "<img src='" + loc + "lcnl javascript experiments/greencheck.png'style='margin-left: auto;margin-right: auto;'>",
			incorrect_text: "<img src='" + loc + "lcnl javascript experiments/redx.png' style='margin-left: auto;margin-right: auto;'>",
			prompt: "<p>Correct: press L			 Incorrect: press A</p>",
			show_stim_with_feedback: true,
			feedback_duration: 1000
		},
		{
			// Blank screen to implement pause
			type: 'image-keyboard-response',
			stimulus: loc + '/lcnl javascript experiments/blank.png',
			choices: jsPsych.NO_KEYS,
			trial_duration: 500
		}, {
			// Calls sound in 1 second so that it will play during the image display
			type: 'call-function',
			async: false,
			func: function() { audioAfterTime(audio, 1000) }
		},
		{
			// Displays correct image 
			type: 'image-keyboard-response',
			prompt: "<p>" + prompt + "</p>",
			stimulus: image2,
			choices: jsPsych.NO_KEYS,
			trial_duration: 2000
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
			img: image1
		}
		]
	}

	return active_comprehension_trial
}

