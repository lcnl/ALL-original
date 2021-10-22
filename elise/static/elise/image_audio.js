// Returns the passive comprehension trial timeline
function image_audio(image, sound, duration) {

	// Sets audio instance
	let audio = new Audio(sound);

	
	// Timeline object that will be returned
	let image_audio = {
		timeline: [ {
			// Calls sound function so that it will play during image display
			type: 'call-function',
			async: false,
			func: function() { audioAfterTime(audio, 2500) }
		},
		{
			// Displays image with no user response
			// Adds sound duration to trial time
			type: 'image-keyboard-response',
			stimulus: image,
			choices: jsPsych.NO_KEYS,
			// Retrieves sound duration from the dictionary and adds it to the trial duration 
			trial_duration: duration
		}
		],
		timeline_variables: [{
			img: null
		}]
	}
	
	return image_audio
}
