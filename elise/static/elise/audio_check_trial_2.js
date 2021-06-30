
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
			html: '<input id="username" autocomplete = "off" style="display:none" type="text" name="fakeusernameremembered"><p style="display:block;margin-left: auto;margin-right: auto;"> Type the English word you hear. </p><p>Feel free to take a break, but make sure to continue within 5 minutes! To help, this is how much time is left: <span id="clock">5:00</span>. Make sure to hit "continue" before the time is up, otherwise the experiment will end.</p><input name="first" type="text" style="display:block;margin-left: auto;margin-right: auto;" required autocomplete="off";/>'
			on_load: function(){
		    var wait_time = 5 * 60 * 1000; // in milliseconds
		    var start_time = performance.now();
		    var interval = setInterval(function(){
		      var time_left = wait_time - (performance.now() - start_time);
		      var minutes = Math.floor(time_left / 1000 / 60);
		      var seconds = Math.floor((time_left - minutes*1000*60)/1000);
		      var seconds_str = seconds.toString().padStart(2,'0');
		      document.querySelector('#clock').innerHTML = minutes + ':' + seconds_str
		      if(time_left <= 0){
		        document.querySelector('#clock').innerHTML = "0:00";
		        clearInterval(interval);
		        jsPsych.endExperiment("You paused for longer than 5 minutes, and so the experiment has ended. You will receive compensation for the proportion of the experiment you completed.")
		      }
		    }, 250)
		},
		{
			// Blank screen before image is displayed again
			type: 'image-keyboard-response',
			stimulus: '/static/elise/img/images/blank.png',
			choices: jsPsych.NO_KEYS,
			trial_duration: 500
		}, 
		{
		  type: 'html-button-response',
		  stimulus: '<p>Feel free to take a break, but make sure to continue within 5 minutes! To help, this is how much time is left: <span id="clock">5:00</span>. Make sure to hit "continue" before the time is up, otherwise the experiment will end.',
		  choices: ['Continue'],
		  on_load: function(){
		    var wait_time = 5 * 60 * 1000; // in milliseconds
		    var start_time = performance.now();
		    var interval = setInterval(function(){
		      var time_left = wait_time - (performance.now() - start_time);
		      var minutes = Math.floor(time_left / 1000 / 60);
		      var seconds = Math.floor((time_left - minutes*1000*60)/1000);
		      var seconds_str = seconds.toString().padStart(2,'0');
		      document.querySelector('#clock').innerHTML = minutes + ':' + seconds_str
		      if(time_left <= 0){
		        document.querySelector('#clock').innerHTML = "0:00";
		        clearInterval(interval);
		        jsPsych.endExperiment("You paused for longer than 5 minutes, and so the experiment has ended. You will receive compensation for the proportion of the experiment you completed.")
		      }
		    }, 250)
		  }
		}
		, {
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
			var data_array = [subjectnr,cond,trialnr,"SC","-",sound, "-", "-", "-", "-", data_from_current_node.select('rt').values[0], "-","-", "-", JSON.parse(data_from_current_node.select('responses').values[0])["first"], prompt, "-", "-", "-", "-", "-", "-"]
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

