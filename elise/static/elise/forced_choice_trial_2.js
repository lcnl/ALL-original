
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

// Runs a forced choice 2 trial with 2 images, a boolean determining which is correct and an associated sound file  
function forced_choice_trial_2(image1, image2, correct, sound, plurality, alienidentifiernr, round) {
	
	// Determines the appropriate key and image to set for the correct value in the user interaction
	var corimage;
	var key;
	var cor_key;
	if (correct) {
		key = "a";
		corimage = image1;
		cor_key = 'a';
	}
	else {
		key = "l";
		corimage = image2;
		cor_key = 'l';
	}

	var neighborhood = (corimage.substring(1+corimage.lastIndexOf("/")));
	neighborhood = neighborhood.substring(0,neighborhood.lastIndexOf("."))[0];
	if(neighborhood == "h"){
		neighborhood = "big";
	}
	else{
		neighborhood = "small";
	}

    // Retrieves audio file name without file path for the purpose of getting the duration from the dictionary
    var audioFileName = (sound.substring(1+sound.lastIndexOf("/")))

	// Audio instance is set 
	var audio = new Audio(sound);


	// variable storing the timeline for the trial that will be output
	let forced_choice_trial_2 = {
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
			stimulus: "<div style='float:left'><img src='" +image1+"'style='margin-left: auto;margin-right: auto;height: 200;'><p>A</p></div><div style='float:right'><img src='" + image2+"' style='margin-left: auto;margin-right: auto;height: 200;'><p>L</p></div><div style='clear:both;height:100px;'><img src='/static/elise/img/images/width.png' style='margin-left: auto;margin-right: auto;height: 80;' ></div>",
			key_answer: key,
			choices: ["a", "l"],
			prompt: "<p></p>",
			correct_text:"<p></p>",
			incorrect_text:"<p></p>",
			feedback_duration:0

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
				var valid_node_id = current_node_id.substring(0, current_node_id.length - 3) + "2.0";
				// Gets data from this node and prints it to the screen
				// TODO: this will be changed to a server ajax call later in process
				var data_from_current_node = jsPsych.data.getDataByTimelineNode(valid_node_id);
				console.log(data_from_current_node.csv())
				var data_array = [subjectnr, cond, trialnr, "TC", alienidentifiernr, sound, neighborhood, "testing", plurality, corimage, data_from_current_node.select('rt').values[0], data_from_current_node.select('correct').values[0], data_from_current_node.select('response').values[0], cor_key, "-", "-", round, "-", key, image1, image2, "-", "-", "-", "-"]
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

	return forced_choice_trial_2
}

