function getQueryVariable(variable){
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		if(pair[0] == variable){return pair[1];}
	}
	return(false);
}


$(document).ready(function(){

	var id = getQueryVariable("id");

	chrome.runtime.sendMessage({
		type: 6,
		key: Number(id)
	}, function(response){

		$("#quote_content").html(response.quote_content);

		$("#quote_author").html(response.quote_author);

		$("#quote_source").html(response.quote_source);

		document.title = response.quote_content;

	});
});