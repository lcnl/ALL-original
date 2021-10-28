
// Runs an active comprehension trial 
function active_comprehension_trial(image1, image2, match, sound, prompt,plurality,alienidentifiernr) {
	console.log(sound)
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
	var ending2 = (image2.substring(1+image2.lastIndexOf("/")));
	var neighborhood = ending2.substring(0,ending2.lastIndexOf("."))[0];
	if(neighborhood == "h"){
		neighborhood = "big";
	}
	else{
		neighborhood = "small";
	}
	var image_2 = "/static/" + core_folder_name + "/img/images/g" + ending2;
	var ending1 = (image1.substring(1+image1.lastIndexOf("/")));
	var image_1 = "/static/" + core_folder_name + "/img/images/b" + ending1;

    // Retrieves audio file name without file path for the purpose of getting the duration from the dictionary
    var audioFileName = "combined_sounds/" + (sound.substring(1+sound.lastIndexOf("/")))

	// Audio instance is set 
	var audio = new Audio(sound);

	var tot_time  = 1000+1000*(parseFloat(soundDurations[audioFileName]["tot_dur"]));

	var were_they_correct;
	var white_fb = '/static/' + core_folder_name + '/img/images/white_fb.png'

	// variable storing the timeline for the trial that will be output
	let active_comprehension_trial = {
		timeline: [{
			// Displays fixation cross
			type: 'html-keyboard-response',
			stimulus: '+',
			choices: jsPsych.NO_KEYS,
			trial_duration: 500
		}, 
		{
			type: 'audio-image-keyboard-response',
			stimulus: sound,
			prompt: "<pre>Mismatch? Press A                                     Match? Press K</pre>",
			stimulus_image: image_1,
			stimulus_height: 400,
			stimulus_feedback: white_fb,
			key_answer: key,
			choices: ["a", "k"],
			response_allowed_while_playing: false,
			delay_duration: 1
		},{
			// Displays image while playing audio so that no responses can be given until after sound is done. 
			type: 'image-keyboard-response-feedback',
			stimulus: image_1,
			stimulus_height: 400,
			stimulus_feedback: function(){
				var this_node_id = jsPsych.currentTimelineNodeID();
				var prev_node_id = this_node_id.substring(0, this_node_id.length - 3) + "1.0"
				var prev_trial_data = jsPsych.data.getDataByTimelineNode(prev_node_id)
				var key_they_pressed = prev_trial_data.select('response').values[0]
				console.log(key_they_pressed)
				if (key_they_pressed == cor_key){
					were_they_correct = true
					feedback_image = '/static/' + core_folder_name + '/img/images/greencheck.png'
				} else {
					were_they_correct = false
					feedback_image = '/static/' + core_folder_name + '/img/images/redx.png'
				}
				return feedback_image
			},	
			choices: jsPsych.NO_KEYS,
			prompt: "<pre> </pre>",
			render_on_canvas: false,
			trial_duration: 1000
		},{
			// Blank screen to implement pause
			type: 'image-keyboard-response',
			stimulus: '/static/' + core_folder_name + '/img/images/blank.png',
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
			stimulus: image_2,
			stimulus_height: 400,
			choices: jsPsych.NO_KEYS,
			// Retrieves sound duration from the dictionary and adds it to the trial duration 
			trial_duration: tot_time + 1000
		}, 
		{
		// Retrieves and separates relevant data from the appropriate timeline node
		type: 'call-function',
		async: false,
		func: function() {
			var current_node_id = jsPsych.currentTimelineNodeID();
			// Navigates from the end of the timeline to the node associated with the categorize image trial
			var valid_node_id = current_node_id.substring(0, current_node_id.length - 3) + "1.0";
			// Gets data from this node and prints it to the screen
			// TODO: this will be changed to a server ajax call later in process
			console.log(valid_node_id)
			var data_from_current_node = jsPsych.data.getDataByTimelineNode(valid_node_id);
			console.log(data_from_current_node.csv())
			var data_array = [subjectnr, cond, trialnr, "AC", alienidentifiernr, sound, neighborhood, "training", plurality, image_2, data_from_current_node.select('rt').values[0],soundDurations[audioFileName]["tot_dur"],soundDurations[audioFileName]["w1_dur"],soundDurations[audioFileName]["sil"],soundDurations[audioFileName]["w2_dur"], were_they_correct, data_from_current_node.select('response').values[0], cor_key, "-", "-", "-", match, image_1, "-", "-", "-", "-", "-", "-", "-"]
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

