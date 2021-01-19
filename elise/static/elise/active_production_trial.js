
// Plays audio file 
async function playAudio(audio) {
	audio.play()
}

// Sets timer then calls audio play function
function audioAfterTime(audio, time) {
	return new Promise(resolve => {
		setTimeout(() => {
			playAudio(audio);
		}, time);
	});
}

// Returns the active entry trial timeline
function active_production_trial(image1, sound, prompt,plurality,alienidentifiernr) {

    // Retrieves audio file name without file path for the purpose of getting the duration from the dictionary
    var audioFileName = (sound.substring(1+sound.lastIndexOf("/")))
	
	// Audio instance is set
	var audio = new Audio(sound);
	
	// Determines if big or small 
	var neighborhood = (image1.substring(1+image1.lastIndexOf("/")));
	neighborhood = neighborhood.substring(0,neighborhood.lastIndexOf("."))[0];
	if(neighborhood == "h"){
		neighborhood = "big";
	}
	else{
		neighborhood = "small";
	}
	
	// Sets image based on plurality(true indicates singular, false plural)
	if(plurality){
		image1 = image1.substring(0,image1.length-4)+"p.png";
	}

	// Timeline for active entry trial 
	var active_production_trial = {
		timeline: [{
			// Displays fixation cross
			type: 'html-keyboard-response',
			stimulus: '+',
			choices: jsPsych.NO_KEYS,
			trial_duration: 500
		},
		{
			// Survey input used to prompt user entry 
			type: 'survey-html-form',
			preamble: "<img src='" +image1 + "' style='display:block;margin-left: auto;margin-right: auto;'>",
			// html form for user to enter info. The "username" form serves only to prevent chrome from autofilling the form 
			html: '<input id="username" autocomplete = "off" style="display:none" type="text" name="fakeusernameremembered"><p style="display:block;margin-left: auto;margin-right: auto;"> What is the name of this alien? click continue after typing </p><input name="first" type="text" style="display:block;margin-left: auto;margin-right: auto;" required autocomplete="off";/>'
		},
		{
			// Blank screen before image is displayed again
			type: 'image-keyboard-response',
			stimulus: '/static/elise/img/images/blank.png',
			choices: jsPsych.NO_KEYS,
			trial_duration: 500
		}, {
			// Calls audio to play during the second image display
			type: 'call-function',
			async: false,
			func: function() { audioAfterTime(audio, 1000) }
		},
		{
			// Displays image a second time
			// Adds sound duration to trial time
			type: 'image-keyboard-response',
			prompt: "<p>" + prompt + "</p>",
			stimulus: image1,
			choices: jsPsych.NO_KEYS,
			// Retrieves sound duration from the dictionary and adds it to the trial duration 
			trial_duration: 2000+1000*(parseFloat(durationDict[audioFileName]))
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
				console.log(data_from_current_node.csv());


				var data_array = [subjectnr,comp,trialnr,"AP",alienidentifiernr,image1,image1,sound, neighborhood, JSON.parse(data_from_current_node.select('responses').values[0])["first"],"N/A",data_from_current_node.select('rt').values[0],plurality]
				total_data_array.push(data_array)
				console.log(data_array)
				// Increments trial number to account for adding this trial to experiment
				trialnr++;

			}
		}
		],
		timeline_variables: [{
			img: image1
		}
		]
	}
	return active_production_trial
}

