// Returns the survey trial timeline
function survey_trial(prompt) {
	var survey_question = {
		timeline: [{
		  type: 'survey-text',
		  questions: [{prompt: prompt, rows: 15, columns: 70}] 
		},
		{
		// Retrieves and separates relevant data from the appropriate timeline node
		type: 'call-function',
		async: false,
		func: function() {
			var current_node_id = jsPsych.currentTimelineNodeID();
			console.log(current_node_id)
			// Navigates from the end of the timeline to the node associated with the categorize image trial
			var valid_node_id = current_node_id.substring(0, current_node_id.length - 3) + "0.0";
			// Gets data from this node and prints it to the screen
			console.log(valid_node_id)
			// TODO: this will be changed to a server ajax call later in process
			var data_from_current_node = jsPsych.data.getDataByTimelineNode(valid_node_id);
			console.log(data_from_current_node.csv());
			console.log(data_from_current_node.select('response').values[0]["Q0"])
			var data_array = [subjectnr, cond, trialnr, "SV", "-", "-",  "-", "-",  "-",  "-", data_from_current_node.select('rt').values[0], "-", "-", "-", data_from_current_node.select('response').values[0]["Q0"],  "-", "-", "-", "-", "-", "-", "-", "-", "-"]
			total_data_array.push(data_array)
			console.log(data_array)
			// Increments trial number to account for adding this trial to experiment
			trialnr++;
			}
		}
		]}
		return survey_question
}