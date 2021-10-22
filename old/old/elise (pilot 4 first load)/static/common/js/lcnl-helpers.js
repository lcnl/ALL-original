function getExperiment() {
	//location.pathname will look like 
	// "/experiment/NAME/"
	var urlparts = window.location.href.split("/");
	return urlparts[urlparts.length - 2];
}
function sendJSONData( json, participant ) {
	$.ajax(
		{
		url:	"/upload/",
		type:	"POST",
		data:	JSON.stringify(json),
		contentType:	"application/json",
		headers:	{
				"experiment":getExperiment(),
				"participant": participant
				},
		success: function(data, textStatus, jqXHR){
			console.log(textStatus, data);
			},
		error: function(jqXHR, textStatus, errorThrown){
			console.log("ajax error");
			console.log(textStatus)
			console.log(errorThrown);
			},
		}
	);
}
function sendWAVData( blob, participant, filename ) {
	$.ajax(
		{
		url:	"/upload/",
		type:	"POST",
		data:	blob,
		contentType:	"audio/x-wav",
		headers:	{
				"experiment":	getExperiment(),
				"participant":	participant,
				"filename":	filename
				},
		processData:	false,
		success: function(data, textStatus, jqXHR){
			console.log(textStatus, data);
			},
		error: function(jqXHR, textStatus, errorThrown){
			console.log("ajax error");
			console.log(textStatus)
			console.log(errorThrown);
			},
		}
	);
}
