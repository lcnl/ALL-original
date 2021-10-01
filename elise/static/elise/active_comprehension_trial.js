
// Runs an active comprehension trial 
function active_comprehension_trial(image1, image2, match, sound, prompt,plurality,alienidentifiernr) {
	
	// Determines the appropriate key to set for the correct value in the user interaction (76 is L, 65 is A)
	var key;
	var cor_key;
	if (match) {
		key = "k";
		cor_key = "k";
	}
	else {
		key = "a";
		cor_key = "a";
	}

	// Determines if big or small
	var neighborhood = (image2.substring(1+image2.lastIndexOf("/")));
	neighborhood = neighborhood.substring(0,neighborhood.lastIndexOf("."))[0];
	if(neighborhood == "h"){
		neighborhood = "big";
	}
	else{
		neighborhood = "small";
	}

    // Retrieves audio file name without file path for the purpose of getting the duration from the dictionary
    var audioFileName = "combined_sounds/" + (sound.substring(1+sound.lastIndexOf("/")))
    console.log(audioFileName)

	// Audio instance is set 
	var audio = new Audio(sound);

	var tot_time = 1000 + 1000*(parseFloat(soundDurations[audioFileName]["tot_dur"]));

	// variable storing the timeline for the trial that will be output
	let active_comprehension_trial = {
		timeline: [{
			// Displays fixation cross
			type: 'html-keyboard-response',
			stimulus: '+',
			choices: jsPsych.NO_KEYS,
			trial_duration: 500
		} ,
		{
			// Calls sound in 1 second so that it will play during the image display
			type: 'call-function',
			async: false,
			func: function() {audioAfterTime(audio, 1000) }
		},
		{
			// Displays image while playing audio so that no responses can be given until after sound is done. 
			type: 'image-keyboard-response',
			prompt: "<pre>Mismatch? Press A                                     Match? Press K</pre>",
			stimulus: image1,
			choices: jsPsych.NO_KEYS,
			// Retrieves sound duration from the dictionary and adds it to the trial duration 
			trial_duration: tot_time
		},
		{
			// Displays image and asks user to select K for correct or A for incorrect based on the sound that is played
			type: 'categorize-image',
			stimulus: image1,
			key_answer: key,
			choices: ["k", "a"],
			correct_text: "<img src='" +"/static/elise/img/images/greencheck.png'style='margin-left: auto;margin-right: auto;'>",
			incorrect_text: "<img src='" + "/static/elise/img/images/redx.png' style='margin-left: auto;margin-right: auto;'>",
			// Uses html pre tag to make spaces persist. To adjust distance in between, simply add spaces
			prompt: "<pre>Mismatch? Press A                                     Match? Press K</pre>",
			show_stim_with_feedback: true,
			feedback_duration: 1000
		},

		{
			// Blank screen to implement pause
			type: 'image-keyboard-response',
			stimulus: '/static/elise/img/images/blank.png',
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
			// Retrieves sound duration from the dictionary and adds it to the trial duration 
			trial_duration: tot_time + 1000
		} 
		, {
		// Retrieves and separates relevant data from the appropriate timeline node
		type: 'call-function',
		async: false,
		func: function() {
			var current_node_id = jsPsych.currentTimelineNodeID();
			// Navigates from the end of the timeline to the node associated with the categorize image trial
			var valid_node_id = current_node_id.substring(0, current_node_id.length - 3) + "3.0";
			// Gets data from this node and prints it to the screen
			// TODO: this will be changed to a server ajax call later in process
			console.log(valid_node_id)
			var data_from_current_node = jsPsych.data.getDataByTimelineNode(valid_node_id);
			console.log(data_from_current_node.csv())
			var data_array = [subjectnr, cond, trialnr, "AC", alienidentifiernr, sound, neighborhood, "training", plurality, image2, data_from_current_node.select('rt').values[0],soundDurations[audioFileName]["tot_dur"],soundDurations[audioFileName]["w1_dur"],soundDurations[audioFileName]["sil"],soundDurations[audioFileName]["w2_dur"], data_from_current_node.select('correct').values[0], data_from_current_node.select('response').values[0], cor_key, "-", "-", "-", match, image1, "-", "-", "-", "-", "-", "-", "-"]
			total_data_array.push(data_array)
			console.log(data_array)
			// Increments trial number to account for adding this trial to experiment
			trialnr++;
		}
		}
		],
		timeline_variables: [{
			img: null
		}
		]
	}

	return active_comprehension_trial
}

