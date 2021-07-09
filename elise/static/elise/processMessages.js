// This code converts the message text from txt files to strings, allowing them to easily be placed into trial objects within the sequence

// Variables that store strings containing messages
var activecompmessage11;
var activecompmessage1bcd;
var activecompmessage2;
var activecompmessage;
var activeprodmessage;
var activeprodmessage1;
var activeprodmessage2;
var audiocheckmessage1;
var audiocheckmessage2;
var audiocheckmessage3;
var audiocheckmessage;
var endmessagec;
var endmessagep;
var forcedchoicemessage2pic;
var forcedchoicemessage4pic;
var FC4message;
var grammaticalityjudgment;
var grammaticalityjudgmentmessage;
var openingmessage;
var passivemessage;
var passivemessage1;
var passivemessage2;
var prodtest1;
var prodtest2;
var prodtestmessage;
var surveymessage;

// Makes ajax calls for each individual text file
// If message files and names are changed, they will need to have their ajax calls edited/added here 
function processMessages() {
	 
	$.ajax({
		type : "GET",
		url : "/static/elise/Instructions/activecompmessage11.txt",
		dataType : "text",
		success : function(data) {
			activecompmessage11 = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/elise/Instructions/activecompmessage1bcd.txt",
		dataType : "text",
		success : function(data) {
			activecompmessage1bcd = data;
			
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/elise/Instructions/activecompmessage2.txt",
		dataType : "text",
		success : function(data) {
			activecompmessage2 = data;
	
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/elise/Instructions/activecompmessage.txt",
		dataType : "text",
		success : function(data) {
			activecompmessage = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/elise/Instructions/activeprodmessage.txt",
		dataType : "text",
		success : function(data) {
			activeprodmessage = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/elise/Instructions/activeprodmessage1.txt",
		dataType : "text",
		success : function(data) {
			activeprodmessage1 = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/elise/Instructions/activeprodmessage2.txt",
		dataType : "text",
		success : function(data) {
			activeprodmessage2 = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/elise/Instructions/audiocheckmessage1.txt",
		dataType : "text",
		success : function(data) {
			audiocheckmessage1 = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/elise/Instructions/audiocheckmessage2.txt",
		dataType : "text",
		success : function(data) {
			audiocheckmessage2 = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/elise/Instructions/audiocheckmessage3.txt",
		dataType : "text",
		success : function(data) {
			audiocheckmessage3 = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/elise/Instructions/audiocheckmessage.txt",
		dataType : "text",
		success : function(data) {
			audiocheckmessage = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/elise/Instructions/endmessagec.txt",
		dataType : "text",
		success : function(data) {
			endmessagec = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/elise/Instructions/endmessagep.txt",
		dataType : "text",
		success : function(data) {
			endmessagep = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/elise/Instructions/forcedchoicemessage2pic.txt",
		dataType : "text",
		success : function(data) {
			forcedchoicemessage2pic = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/elise/Instructions/forcedchoicemessage4pic.txt",
		dataType : "text",
		success : function(data) {
			forcedchoicemessage4pic = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/elise/Instructions/FC4message.txt",
		dataType : "text",
		success : function(data) {
			FC4message = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/elise/Instructions/grammaticalityjudgment.txt",
		dataType : "text",
		success : function(data) {
			grammaticalityjudgment = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/elise/Instructions/grammaticalityjudgmentmessage.txt",
		dataType : "text",
		success : function(data) {
			grammaticalityjudgmentmessage = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/elise/Instructions/openingmessage.txt",
		dataType : "text",
		success : function(data) {
			openingmessage = data;
			console.log(openingmessage);
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/elise/Instructions/passivemessage.txt",
		dataType : "text",
		success : function(data) {
			passivemessage = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/elise/Instructions/passivemessage1.txt",
		dataType : "text",
		success : function(data) {
			passivemessage1 = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/elise/Instructions/passivemessage2.txt",
		dataType : "text",
		success : function(data) {
			passivemessage2 = data;
		}
	});
	
	$.ajax({
		type : "GET",
		url : "/static/elise/Instructions/prodtest1.txt",
		dataType : "text",
		success : function(data) {
			prodtest1 = data;
		}
	});$.ajax({
		type : "GET",
		url : "/static/elise/Instructions/prodtest2.txt",
		dataType : "text",
		success : function(data) {
			prodtest2 = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/elise/Instructions/prodtestmessage.txt",
		dataType : "text",
		success : function(data) {
			prodtestmessage = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/elise/Instructions/surveymessage.txt",
		dataType : "text",
		success : function(data) {
			surveymessage = data;
		}
	});
	}
	
	
	
	