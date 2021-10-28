

// Audio check trial that allows user to repeat
function audio_check_trial_1(sound) {

    // Retrieves audio file name without file path for the purpose of getting the duration from the dictionary
    var audioFileName = (sound.substring(1+sound.lastIndexOf("/")))
	
	// Audio instance is set
	var audio = new Audio(sound);

	// Timeline for active entry trial 
	var audio_check_trial_1 = {
		timeline: [{
			// Displays fixation cross
			type: 'html-keyboard-response',
			stimulus: '+',
			choices: jsPsych.NO_KEYS,
			trial_duration: 500
		}, 
		{
			// Calls audio to play during the second image display
			type: 'call-function',
			async: false,
			func: function() { audioAfterTime(audio, 1000) }
		},
		{
			// Survey input used to prompt user entry 
			type: 'survey-html-form',
			preamble: "<button onClick = 'playAudio(new Audio(\""+sound+"\"))'>Repeat audio</button>",
			// HTML form for user. "username" form serves only to prevent chrome from autocompleting 
			html: '<input id="username" autocomplete = "off" style="display:none" type="text" name="fakeusernameremembered"><p style="display:block;margin-left: auto;margin-right: auto;"> Type the English word you hear. </p><input id = "focus" name="first" type="text" style="display:block;margin-left: auto;margin-right: auto;" required autocomplete="off";/>',
			on_load: function(){ document.getElementById("focus").focus() }
		},
		{
			// Blank screen before image is displayed again
			type: 'image-keyboard-response',
			stimulus: '/static/' + core_folder_name + '/img/images/blank.png',
			choices: jsPsych.NO_KEYS,
			trial_duration: 500
		}			
		]
		,
		timeline_variables: [{
			img: null
		}
		]
		
	}
	return audio_check_trial_1
}

