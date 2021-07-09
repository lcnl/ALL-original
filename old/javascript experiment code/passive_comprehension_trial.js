
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

// Returns the passive comprehension trial timeline
function passive_comprehension_trial(image, sound, prompt) {

	// Sets audio instance
	var audio = new Audio(sound);

	// Adds the duration of the audio to the image displays within the timeline
	audio.addEventListener("loadeddata", function() {
		passive_comprehension_trial['timeline'][2]['trial_duration'] += 1000 * this.duration
		passive_comprehension_trial['timeline'][5]['trial_duration'] += 1000 * this.duration
	});

	// Saves current folder in server for ease of path determination
	var loc = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname + window.location.search

	// Timeline object that will be returned
	var passive_comprehension_trial = {
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
			type: 'image-keyboard-response',
			stimulus: jsPsych.timelineVariable('img'),
			choices: jsPsych.NO_KEYS,
			trial_duration: 2500
		},
		{
			// Blank screen in between displays
			type: 'image-keyboard-response',
			stimulus: loc + '/lcnl javascript experiments/blank.png',
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
			type: 'image-keyboard-response',
			prompt: '<p>'+prompt+'<\p>',
			stimulus: jsPsych.timelineVariable('img'),
			choices: jsPsych.NO_KEYS,
			trial_duration: 2000
		}
		
		],
		timeline_variables: [{
			img: image
		}]
	}
	console.log(jsPsych.data.get());
	return passive_comprehension_trial
}
