
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

// Runs a forced choice trial with 4 input images, the correct choice between 1 and 4 and the associated sound as arguments
function forced_choice_trial_4(image1, image2, image3, image4, correct, sound, plurality, alienidentifiernr) {
	
	// Determines the appropriate key and image to set for the correct value in the user interaction
	var corimage;
	var key;
	var match;
	switch(correct){
		case 1:
		key = 65;
		corimage = image1;
		match = 'a';
		break
		case 2:
		key = 76;
		corimage = image2;
		match = 'l';
		break
		case 3:
		key = 90;
		corimage = image3;
		match = 'z';
		break
		case 4:
		key = 77;
		corimage = image4;
		match = 'm';
		break
	}

	var neighborhood = (corimage.substring(1+corimage.lastIndexOf("/")));
	neighborhood = neighborhood.substring(0,neighborhood.lastIndexOf("."))[0];
	if(neighborhood == "h"){
		neighborhood = "big";
	}
	else{
		neighborhood = "small";
	}
	

    // Retrieves audio file name without path for the purpose of getting the duration from the dictionary
    var audioFileName = (sound.substring(1+sound.lastIndexOf("/")))

	// Audio instance is set 
	var audio = new Audio(sound);


	// variable storing the timeline for the trial that will be output
	let forced_choice_trial_4 = {
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
			// Displays images and selects correct key based on function argument "correct", which is stored as "key" in the switch statement earlier in the function
			type: 'categorize-html',
			stimulus: "<div style='float:left;'><img src='" +image1+"'style='margin-left: auto;margin-right: auto;height: 200;'><p>a</p></div><div style='float:right;'><img src='" + image2+"' style='margin-left: auto;margin-right: auto;height: 200;'><p>l</p></div><div style='clear:both;height:100px;'><img src='/static/elise/img/images/width.png' style='margin-left: auto;margin-right: auto;height: 80;' ></div><div style='float:left;'><img src='" +image3+"'style='margin-left: auto;margin-right: auto;height: 200;'><p>z</p></div><div style='float:right;'><img src='" + image4+"' style='margin-left: auto;margin-right: auto;height: 200;'><p>m</p></div>",
			key_answer: key,
			choices: [65, 76,90,77],
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
		},  {
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
				var data_array = [subjectnr,cond,trialnr,"FC",alienidentifiernr,image1,image2, image3, image4,corimage,sound,neighborhood, String.fromCharCode(data_from_current_node.select('key_press').values[0]),data_from_current_node.select('correct').values[0], match,data_from_current_node.select('rt').values[0], plurality, key]
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

	return forced_choice_trial_4
}

