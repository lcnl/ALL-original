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
var endmessage;
var forcedchoicemessage2pic;
var forcedchoicemessage4pic;
var FC4message;
var grammaticalityjudgment;
var grammaticalityjudgmentmessage;
var openingmessage1;
var passivemessage;
var passivemessage1;
var passivemessage2;
var prodtest1;
var prodtest2;
var prodtestmessage;
var PTEmessage;

// Makes ajax calls for each individual text file
// If message files and names are changed, they will need to have their ajax calls edited/added here 
function processMessages(folder_name) {
	 
	$.ajax({
		type : "GET",
		url : "/static/" + folder_name + "/Instructions/activecompmessage11.txt",
		dataType : "text",
		success : function(data) {
			activecompmessage11 = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/" + folder_name + "/Instructions/activecompmessage1bcd.txt",
		dataType : "text",
		success : function(data) {
			activecompmessage1bcd = data;
			
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/" + folder_name + "/Instructions/activecompmessage2.txt",
		dataType : "text",
		success : function(data) {
			activecompmessage2 = data;
	
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/" + folder_name + "/Instructions/activecompmessage.txt",
		dataType : "text",
		success : function(data) {
			activecompmessage = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/" + folder_name + "/Instructions/activeprodmessage.txt",
		dataType : "text",
		success : function(data) {
			activeprodmessage = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/" + folder_name + "/Instructions/activeprodmessage1.txt",
		dataType : "text",
		success : function(data) {
			activeprodmessage1 = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/" + folder_name + "/Instructions/activeprodmessage2.txt",
		dataType : "text",
		success : function(data) {
			activeprodmessage2 = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/" + folder_name + "/Instructions/audiocheckmessage1.txt",
		dataType : "text",
		success : function(data) {
			audiocheckmessage1 = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/" + folder_name + "/Instructions/audiocheckmessage2.txt",
		dataType : "text",
		success : function(data) {
			audiocheckmessage2 = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/" + folder_name + "/Instructions/audiocheckmessage3.txt",
		dataType : "text",
		success : function(data) {
			audiocheckmessage3 = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/" + folder_name + "/Instructions/audiocheckmessage.txt",
		dataType : "text",
		success : function(data) {
			audiocheckmessage = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/" + folder_name + "/Instructions/endmessage.txt",
		dataType : "text",
		success : function(data) {
			endmessage = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/" + folder_name + "/Instructions/forcedchoicemessage2pic.txt",
		dataType : "text",
		success : function(data) {
			forcedchoicemessage2pic = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/" + folder_name + "/Instructions/forcedchoicemessage4pic.txt",
		dataType : "text",
		success : function(data) {
			forcedchoicemessage4pic = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/" + folder_name + "/Instructions/FC4message.txt",
		dataType : "text",
		success : function(data) {
			FC4message = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/" + folder_name + "/Instructions/grammaticalityjudgment.txt",
		dataType : "text",
		success : function(data) {
			grammaticalityjudgment = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/" + folder_name + "/Instructions/grammaticalityjudgmentmessage.txt",
		dataType : "text",
		success : function(data) {
			grammaticalityjudgmentmessage = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/" + folder_name + "/Instructions/openingmessage1.txt",
		dataType : "text",
		success : function(data) {
			openingmessage1 = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/" + folder_name + "/Instructions/passivemessage.txt",
		dataType : "text",
		success : function(data) {
			passivemessage = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/" + folder_name + "/Instructions/passivemessage1.txt",
		dataType : "text",
		success : function(data) {
			passivemessage1 = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/" + folder_name + "/Instructions/passivemessage2.txt",
		dataType : "text",
		success : function(data) {
			passivemessage2 = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/" + folder_name + "/Instructions/prodtest1.txt",
		dataType : "text",
		success : function(data) {
			prodtest1 = data;
		}
	});$.ajax({
		type : "GET",
		url : "/static/" + folder_name + "/Instructions/prodtest2.txt",
		dataType : "text",
		success : function(data) {
			prodtest2 = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/" + folder_name + "/Instructions/prodtestmessage.txt",
		dataType : "text",
		success : function(data) {
			prodtestmessage = data;
		}
	});
	$.ajax({
		type : "GET",
		url : "/static/" + folder_name + "/Instructions/PTEmessage.txt",
		dataType : "text",
		success : function(data) {
			PTEmessage = data;
		}
	});
}
