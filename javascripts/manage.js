
// Gets the total number of quotes in the DB
function showTotalQuotes(){
	chrome.runtime.sendMessage({type: 3}, function(response){
		$("#total_quotes").html(response);
	});
}

// Delete quote from the DB
function deleteQuote(key){

	if(confirm("Delete?")){		

		chrome.runtime.sendMessage({ type: 5, key: Number(key) }, function(response){

			if(response == true){
				$("tr[quote-key=" + key + "]").fadeOut();
				showTotalQuotes();
			}
		});
	}
}


function showContent(){

	chrome.runtime.sendMessage({
			type: 4
		},
		function(response){

			if(typeof response != "object") return;

			var table = "";

			// Render table
			for(var i=0; i<response.length; i++){
				table += "<tr quote-key=\"" + response[i].timestamp + "\"><td><button class=\"delete\"></button>"
				table += "</td><td>\"" + response[i].quote_content + "\" " + response[i].quote_author + "</td></tr>";
			}

			// Show table
			$("#content").html("<table>" + table + "</table>");		

			// Bind click events
			$(".delete").click(function(e) {
				e.preventDefault();
				deleteQuote($(this).parent().parent().attr("quote-key"));
			});

		}
	);
}





(function(){

	showContent();
	showTotalQuotes();

})();
