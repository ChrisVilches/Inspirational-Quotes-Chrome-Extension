
var p;

function setP(newP){

	chrome.runtime.sendMessage({ type: 8, probability: newP });
	p = newP;
	$("#probability").html(newP);

}

$("#less").click(function(){
	if(p - 5 >= 0)
		setP(p-5);
	else
		setP(0);
});


$("#plus").click(function(){
	if(p + 5 <= 100)
		setP(p+5);
	else
		setP(100);
});


// Allow custom input (probability)
$("#probability").click(function(){

	$("#buttons_probability_input").toggle();
	$("#custom_probability_input").toggle();

	$("#custom_probability").val(p);
	$("#custom_probability").focus();

});


// Blur event (custom probability input)
$("#custom_probability").blur(function(){

	$("#buttons_probability_input").toggle();
	$("#custom_probability_input").toggle();

	var newP = parseInt($("#custom_probability").val());

	if(newP < 0 || isNaN(newP)) newP = 0;
	else if(newP > 100) newP = 100;

	setP(newP);

});


$(document).ready(function(){

	chrome.runtime.sendMessage({
		type: 9
	}, function(response){

		p = response;

		$("#probability").html(p);

	});

});
