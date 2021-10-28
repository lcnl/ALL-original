
// Saves current folder in server for ease of path determination
	var loc = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname + window.location.search
	
// Returns the passive comprehension trial timeline
function passive_comprehension_trial(image, sound, prompt, plurality, alienidentifiernr) {
	
	// Retrieves audio file name without file path for the purpose of getting the duration from the dictionary
    var audioFileName = "combined_sounds/" + (sound.substring(1+sound.lastIndexOf("/")))

	// Sets audio instance
	let audio = new Audio(sound);

	
	// Sets image based on plurality(true indicates singular, false plural)
	if(plurality){
		image = image.substring(0,image.length-4)+"p.png";
	}




	// Determines if big or small 
	var ending = (image.substring(1+image.lastIndexOf("/")));
	var neighborhood = ending.substring(0,ending.lastIndexOf("."))[0];
	if(neighborhood == "h"){
		neighborhood = "big";
	}
	else{
		neighborhood = "small";
	}
	image = "/static/" + core_folder_name + "/img/images/g" + ending;

	// Timeline object that will be returned
	let passive_comprehension_trial = {
		timeline: [{
			// Displays fixation cross
			type: 'html-keyboard-response',
			stimulus: '+',
			choices: jsPsych.NO_KEYS,
			trial_duration: 500
		}, {
			// Calls sound function so that it will play during image display
			type: 'call-function',
			async: false,
			func: function() { audioAfterTime(audio, 1000) }
		},
		{
			// Displays image with no user response
			// Adds sound duration to trial time
			type: 'image-keyboard-response',
			stimulus: jsPsych.timelineVariable('img'),
			stimulus_height: 400,
			choices: jsPsych.NO_KEYS,
			// Retrieves sound duration from the dictionary and adds it to the trial duration 
			trial_duration: 2500+1000*(parseFloat(soundDurations[audioFileName]["tot_dur"]))
		},
		{
			// Blank screen in between displays
			type: 'image-keyboard-response',
			stimulus: '/static/' + core_folder_name + '/img/images/blank.png',
			choices: jsPsych.NO_KEYS,
			trial_duration: 500
		}, {
			// Calls sound function so that it will play during image display
			type: 'call-function',
			async: false,
			func: function() { audioAfterTime(audio, 1000) }
		},
		{
			// Displays image a second time
			// Adds sound duration to trial time
			type: 'image-keyboard-response',
			prompt: '<p>'+prompt+'<\p>',
			stimulus: jsPsych.timelineVariable('img'),
			stimulus_height: 400,
			choices: jsPsych.NO_KEYS,
			trial_duration: 2000+1000*(parseFloat(soundDurations[audioFileName]["tot_dur"]))
		}
		, {
		// Retrieves and separates relevant data from the appropriate timeline node
		type: 'call-function',
		async: false,
		func: function() {
			// TODO: this will be changed to a server ajax call later in process
			var data_array = [subjectnr, cond, trialnr, "P", alienidentifiernr, sound, neighborhood, "training", plurality, image, "-",soundDurations[audioFileName]["tot_dur"],soundDurations[audioFileName]["w1_dur"],soundDurations[audioFileName]["sil"],soundDurations[audioFileName]["w2_dur"], "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"]
			total_data_array.push(data_array)
			console.log(data_array)
			// Increments trial number to account for adding this trial to experiment
			trialnr++;

		}
		}
		],
		timeline_variables: [{
			img: image
		}]
	}
	
	return passive_comprehension_trial
}
