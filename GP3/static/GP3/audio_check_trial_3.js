

// Audio check trial that does not allow user to repeat, and does not have a break at the end
function audio_check_trial_3(sound, prompt) {

    // Retrieves audio file name without file path for the purpose of getting the duration from the dictionary
    var audioFileName = (sound.substring(1+sound.lastIndexOf("/")))
	
	// Audio instance is set
	var audio = new Audio(sound);

	// Timeline for active entry trial 
	var audio_check_trial_2 = {
		timeline: [
		{
			// Displays fixation cross
			type: 'html-keyboard-response',
			stimulus: '+',
			choices: jsPsych.NO_KEYS,
			trial_duration: 500
		}, {
			// Calls audio to play during the second image display
			type: 'call-function',
			async: false,
			func: function() { audioAfterTime(audio, 1000) }
		},
		{
			// Survey input used to prompt user entry 
			type: 'survey-html-form',
			preamble: "",
			// HTML form for user to enter info. "username" form serves only to prevent chrome from autocompleting
			html: '<input id="username" autocomplete = "off" style="display:none" type="text" name="fakeusernameremembered"><p style="display:block;margin-left: auto;margin-right: auto;"> Type the English word you hear. </p><input id = "focus" name="first" type="text" style="display:block;margin-left: auto;margin-right: auto;" required autocomplete="off";/>',
			on_load: function(){ document.getElementById("focus").focus() },
			on_finish: function(timestamp){
	          var timestamp = (new Date).toISOString().replace(/z|t/gi,' ').trim();
	          jsPsych.data.addDataToLastTrial({timestamp});
	      	}
		},
		{
			// Blank screen before image is displayed again
			type: 'image-keyboard-response',
			stimulus: '/static/' + core_folder_name + '/img/images/blank.png',
			choices: jsPsych.NO_KEYS,
			trial_duration: 500
		}, 
		{
		// Retrieves and separates relevant data from the appropriate timeline node
		type: 'call-function',
		async: false,
		func: function() {
			var current_node_id = jsPsych.currentTimelineNodeID();
			// Navigates from the end of the timeline to the node associated with the categorize image trial
			// the '2.0' indicates that the node with data is node number two within this entire trial
			var valid_node_id = current_node_id.substring(0, current_node_id.length - 3) + "2.0";
			console.log(valid_node_id)
			// Gets data from this node and prints it to the screen
			// TODO: this will be changed to a server ajax call later in process
			var data_from_current_node = jsPsych.data.getDataByTimelineNode(valid_node_id);
			console.log(data_from_current_node.csv());
			var data_array = [subjectnr,cond,trialnr,"SC","-",sound, "-", "-", "-", "-", data_from_current_node.select('rt').values[0], "-", "-", "-", "-", "-","-", "-", data_from_current_node.select('response').values[0]["first"], prompt, "-", "-", "-", "-", "-", "-", data_from_current_node.select('timestamp').values[0], "-", "-", "-"]
			total_data_array.push(data_array)
			console.log(data_array)
			// Increments trial number to account for adding this trial to experiment
			trialnr++;
		}
		}
		]
		,
		timeline_variables: [{
			img: null
		}
		]
		
	}
	return audio_check_trial_2
}

