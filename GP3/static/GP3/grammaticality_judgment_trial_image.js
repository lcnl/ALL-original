

// Runs an active comprehension trial 
function grammaticality_judgment_trial_image(correct, sound, plurality, alienidentifiernr, errortype, subneigh, image1) {
	
	// Determines the appropriate key and image to set for the correct value in the user interaction (76 is L, 65 is A)
	var corimage;
	var key;
	var cor_key;
	if (correct) {
		key = "k";
		cor_key = 'k';
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
	// Sets image based on plurality(true indicates singular, false plural)
	if(plurality){
		image1 = image1.substring(0,image1.length-4)+"p.png";
	}
    // Retrieves audio file name for the purpose of getting the duration from the dictionary
    var audioFileName = "combined_sounds/" + (sound.substring(1+sound.lastIndexOf("/")))

	// Sets audio instance
	let audio = new Audio(sound);


	// variable storing the timeline for the trial that will be output
	let grammaticality_judgment_trial= {
		timeline: [{
			// Displays fixation cross
			type: 'html-keyboard-response',
			stimulus: '+',
			choices: jsPsych.NO_KEYS,
			trial_duration: 500
		}, {
			type: 'audio-image-keyboard-response',
			stimulus: sound,
			prompt: "<pre>incorrect? push A                                     correct? push K</pre>",
			stimulus_image: image1,
			stimulus_feedback: '/static/elise/img/images/white_fb.png',
			stimulus_height: 400,
			key_answer: key,
			choices: ["a", "k"],
			response_allowed_while_playing: true,
			delay_duration: 1
		},
		{
			// Blank screen to implement pause
			type: 'image-keyboard-response',
			stimulus: '/static/elise/img/images/blank.png',
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
				var valid_node_id = current_node_id.substring(0, current_node_id.length - 3) + "1.0";
				// Gets data from this node and prints it to the screen
				// TODO: this will be changed to a server ajax call later in process
				var data_from_current_node = jsPsych.data.getDataByTimelineNode(valid_node_id);
				console.log(data_from_current_node.csv())
				var key_they_pressed = data_from_current_node.select('response').values[0]
				if (key_they_pressed == cor_key){
					var were_they_correct = true
				} else {
					var were_they_correct = false
				}
				var data_array = [subjectnr, cond, trialnr, "EM", alienidentifiernr, sound, neighborhood, subneigh, plurality, "-",data_from_current_node.select('rt').values[0], soundDurations[audioFileName]["tot_dur"],soundDurations[audioFileName]["w1_dur"],soundDurations[audioFileName]["sil"],soundDurations[audioFileName]["w2_dur"], were_they_correct, data_from_current_node.select('response').values[0], cor_key, "-", "-", errortype, correct, image1, "-", "-", "-", "-", "-", "-", "-"]
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

