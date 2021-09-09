
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
// Saves current folder in server for ease of path determination
	var loc = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname + window.location.search
	
// Returns the passive comprehension trial timeline
function passive_comprehension_trial(image, sound, prompt, plurality, alienidentifiernr) {
	
	// Retrieves audio file name without file path for the purpose of getting the duration from the dictionary
    var audioFileName = (sound.substring(1+sound.lastIndexOf("/")))

	// Sets audio instance
	var audio = new Audio(sound);
	
	// Sets image based on plurality(true indicates singular, false plural)
	if(plurality){
		image = image.substring(0,image.length-4)+"p.png";
	}

	// Determines if big or small 
	var neighborhood = (image.substring(1+image.lastIndexOf("/")));
	neighborhood = neighborhood.substring(0,neighborhood.lastIndexOf("."))[0];
	if(neighborhood == "h"){
		neighborhood = "big";
	}
	else{
		neighborhood = "small";
	}
	
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
			choices: jsPsych.NO_KEYS,
			// Retrieves sound duration from the dictionary and adds it to the trial duration 
			trial_duration: 2500+1000*(parseFloat(durationDict[audioFileName]))
		},
		{
			// Blank screen in between displays
			type: 'image-keyboard-response',
			stimulus: '/static/elise/img/images/blank.png',
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
			choices: jsPsych.NO_KEYS,
			trial_duration: 2000+1000*(parseFloat(durationDict[audioFileName]))
		}
		, {
		// Retrieves and separates relevant data from the appropriate timeline node
		type: 'call-function',
		async: false,
		func: function() {
			// TODO: this will be changed to a server ajax call later in process
			var data_array = [subjectnr, cond, trialnr, "P", alienidentifiernr, sound, neighborhood, "training", plurality, image, "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"]
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
