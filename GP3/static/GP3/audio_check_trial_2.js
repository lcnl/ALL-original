

// Audio check trial that does not allow user to repeat
function audio_check_trial_2(sound, prompt) {

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
			on_load: function(){ document.getElementById("focus").focus() }
		},
		{
			// Blank screen before image is displayed again
			type: 'image-keyboard-response',
			stimulus: '/static/' + core_folder_name + '/img/images/blank.png',
			choices: jsPsych.NO_KEYS,
			trial_duration: 500
		}, 
		{
		  type: 'html-button-response',
		  stimulus: '<div style="white-space: pre-wrap; padding-left:20%; padding-right:20%">Feel free to take a break, but make sure to continue within 5 minutes! \n\nTo help, this is how long your break has been: <span id="clock">0:00</span>. \n\nMake sure to hit "continue" before the time is up, otherwise the experiment will end.</div>',
		  choices: ['Continue'],
		  trial_duration: 300000,
		  on_load: function(){
		        timer_start_time = Date.now();
		        timer_ticks = setInterval(function(){
		          var time_elapsed = Math.floor((Date.now() - timer_start_time) / 1000);
			      var minutes = Math.floor(time_elapsed / 60);
			      var seconds = Math.floor((time_elapsed - minutes*60));
			      var seconds_str = seconds.toString().padStart(2,'0');
			      document.querySelector('#clock').innerHTML = minutes + ':' + seconds_str
		          console.log(time_elapsed)
		        }, 1000)
		      },
		  on_finish: function(timestamp){
	          var timestamp = (new Date).toISOString().replace(/z|t/gi,' ').trim();
	          jsPsych.data.addDataToLastTrial({timestamp});
	      }
		},{
		// Retrieves and separates relevant data from the appropriate timeline node
		type: 'call-function',
		async: false,
		func: function() {
			clearInterval(timer_ticks)
			var current_node_id = jsPsych.currentTimelineNodeID();
			// Navigates from the end of the timeline to the node associated with the categorize image trial
			// the '2.0' indicates that the node with data is node number two within this entire trial
			var valid_node_id = current_node_id.substring(0, current_node_id.length - 3) + "2.0";
			var timer_node_id = current_node_id.substring(0, current_node_id.length - 3) + "4.0";
			console.log(valid_node_id)
			console.log(timer_node_id)
			// Gets data from this node and prints it to the screen
			// TODO: this will be changed to a server ajax call later in process
			var data_from_current_node = jsPsych.data.getDataByTimelineNode(valid_node_id);
			var data_from_timer_node = jsPsych.data.getDataByTimelineNode(timer_node_id);
			console.log(data_from_current_node.csv());
			console.log(data_from_timer_node.csv());
			var data_array = [subjectnr,cond,trialnr,"SC","-",sound, "-", "-", "-", "-", data_from_current_node.select('rt').values[0], "-", "-", "-", "-", "-","-", "-", data_from_current_node.select('response').values[0]["first"], prompt, "-", "-", "-", "-", "-", "-", data_from_timer_node.select('timestamp').values[0],data_from_timer_node.select('rt').values[0], window.innerWidth, window.innerHeight]
			total_data_array.push(data_array)
			console.log(data_array)
			// Increments trial number to account for adding this trial to experiment
			trialnr++;
			var button_responded = data_from_timer_node.select('response').values[0];
		    if (button_responded == null){
				console.log("did not respond on time");
				jsPsych.endExperiment("You paused for longer than 5 minutes, and so the experiment has ended. You will receive compensation for the proportion of the experiment you completed.")
			}
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

