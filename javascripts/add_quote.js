// When the user closes the window, the form is saved.
addEventListener("unload", function (event) {
    saveForm();
}, true);


// Saves the current values from the form
function saveForm(){
	localStorage.setItem("quote_content", $("#quote_content").val());
	localStorage.setItem("quote_author", $("#quote_author").val());
	localStorage.setItem("quote_source", $("#quote_source").val());
}
 

// Resets the form (and saves it to storage)
function resetForm(){
	$("input").val("");
	$("textarea").val("");
	$("#quote_content").removeClass("missing");
	saveForm();
}


$("#get_random_quote_btn").click(function(e){

	chrome.runtime.sendMessage({ type: 1 });
});


$("#quote_ok_btn").click(function(e){
		
	var new_quote = {
		quote_content: $("#quote_content").val().trim(),
		quote_author: $("#quote_author").val().trim(),
		quote_source: $("#quote_source").val().trim(),
		timestamp: Date.now()
	};

	// Add to DB
	chrome.runtime.sendMessage({
			type: 2,
			content: new_quote
		},
		function(response){
			if(!response){
				// Successful
				$("#tick_image").finish();
				$("#tick_image").show();
				$("#tick_image").hide(3000);

				// Reset form
				resetForm();
			} else {
				$("#quote_content").addClass("missing");
			}
		}
	);
	e.preventDefault();
});



(function(){

	// Load form (saved data)
	$("#quote_content").val(localStorage.getItem("quote_content") || "");
	$("#quote_author").val(localStorage.getItem("quote_author") || "");
	$("#quote_source").val(localStorage.getItem("quote_source") || "");

})();


