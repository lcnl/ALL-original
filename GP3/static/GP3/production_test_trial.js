

// Returns the active entry trial timeline
function production_test_trial(image1, sound, prompt,plurality,alienidentifiernr, neighborhood, subset) {

	
	// Determines if big or small 
	var neighborhood = (image1.substring(1+image1.lastIndexOf("/")));
	neighborhood = neighborhood.substring(0,neighborhood.lastIndexOf("."))[0];
	if(neighborhood == "h"){
		neighborhood = "big";
	}
	else{
		neighborhood = "small";
	}
	
	// Sets image based on plurality(true indicates singular, false plural)
	if(plurality){
		image1 = image1.substring(0,image1.length-4)+"p.png";
	}

	// Timeline for active entry trial 
	var active_production_trial = {
		timeline: [{
			// Displays fixation cross
			type: 'html-keyboard-response',
			stimulus: '+',
			choices: jsPsych.NO_KEYS,
			trial_duration: 500
		},
		{
			// Survey input used to prompt user entry 
			type: 'survey-html-form',
			preamble: "<img src='" +image1 + "' style='display:block;margin-left: auto;margin-right: auto; height: 400;'>",
			// html form for user to enter info. The "username" form serves only to prevent chrome from autofilling the form 
			html: '<input id="username" autocomplete = "off" style="display:none" type="text" name="fakeusernameremembered"><p style="display:block;margin-left: auto;margin-right: auto;"> Type the name! </p><input id = "focus" name="first" type="text" style="display:block;margin-left: auto;margin-right: auto;" required autocomplete="off";/>',
			on_load: function(){ document.getElementById("focus").focus() }
		},
		{
		// Retrieves and separates relevant data from the appropriate timeline node
		type: 'call-function',
		async: false,
		func: function() {
			var current_node_id = jsPsych.currentTimelineNodeID();
			// Navigates from the end of the timeline to the node associated with the categorize image trial
			var valid_node_id = current_node_id.substring(0, current_node_id.length - 3) + "1.0";
			// Gets data from this node and prints it to the screen
			console.log(valid_node_id)
			// TODO: this will be changed to a server ajax call later in process
			var data_from_current_node = jsPsych.data.getDataByTimelineNode(valid_node_id);
			console.log(data_from_current_node.csv());


			var data_array = [subjectnr, cond, trialnr, "PT", alienidentifiernr,sound, neighborhood, subset, plurality, image1, data_from_current_node.select('rt').values[0], "-", "-", "-", "-", "-", "-", "-", data_from_current_node.select('response').values[0]["first"], prompt,"-", "-","-", "-","-", "-", "-", "-", "-", "-"]
			total_data_array.push(data_array)
			console.log(data_array)
			// Increments trial number to account for adding this trial to experiment
			trialnr++;

		}
		}
		],
		timeline_variables: [{
			img: image1
		}
		]
	}
	return active_production_trial
}

