
// Runs an active comprehension trial 
function grammaticality_judgment_trial(correct, sound, plurality, alienidentifiernr, errortype, subneigh) {
	
	// Determines the appropriate key and image to set for the correct value in the user interaction (76 is L, 65 is A)
	var corimage;
	var key;
	var cor_key;
	if (correct) {
		key = "l";
		cor_key = 'l';
	}
	else {
		key = "a";
		cor_key = 'a';
	}

	var neighborhood = (sound.substring(1+sound.lastIndexOf("/")));
	neighborhood = neighborhood.substring(0,neighborhood.lastIndexOf("."))[5];
	if(neighborhood == "b"){
		neighborhood = "big";
	}
	else{
		neighborhood = "small";
	}

    // Retrieves audio file name for the purpose of getting the duration from the dictionary
    var audioFileName = "combined_sounds/" + (sound.substring(1+sound.lastIndexOf("/")))

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
			func: function() { audioAfterTimePausable(audio, 1000) }
		},
		{
			// Displays image and asks user to select y for yes or n for no based on the sound that is played
			type: 'categorize-html',
			stimulus: "<p></p>",
			key_answer: key,
			choices: ["a", "k"],
			correct_text: "<p></p>",
			incorrect_text: "<p></p>",
			// Uses html pre tag to make spaces persist. To adjust distance in between, simply add spaces
			prompt: "<pre>ungrammatical push A                                     grammatical push K</pre>",
			feedback_duration: 0
		},
		{
			// Blank screen to implement pause
			type: 'image-keyboard-response',
			stimulus: '/static/' + core_folder_name + '/img/images/blank.png',
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
				var data_array = [subjectnr, cond, trialnr, "EM", alienidentifiernr, sound, neighborhood, subneigh, plurality, "-",data_from_current_node.select('rt').values[0],  soundDurations[audioFileName]["tot_dur"],soundDurations[audioFileName]["w1_dur"],soundDurations[audioFileName]["sil"],soundDurations[audioFileName]["w2_dur"], data_from_current_node.select('correct').values[0], data_from_current_node.select('response').values[0], cor_key, "-", "-", errortype, correct, "-", "-", "-", "-", "-", "-", "-", "-"]
				total_data_array.push(data_array)
				console.log(data_array)
				trialnr++;
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

