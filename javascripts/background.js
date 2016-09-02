openDB();

var quoteLoadPageProbability;




// Shows a notification with a quote
function notifyQuote(quote){

	var timestamp = quote.timestamp;
	var content = quote.quote_content;
	var author = quote.quote_author;
	var source = quote.quote_source;

	chrome.notifications.create(
		String(timestamp), {   
			type: 'basic', 
			iconUrl: 'img/icon.png', 
			title: author,
			message: content
		}, function(){}
	);
}


// Random number (minutes)
function randomPeriod(a, b){
	return Math.floor(Math.random() * (b - a)) + a;
}



// Sets the probability of showing a quote when the user loads a new page
// The function returns true|false if it was able to change it.
function setLoadPageProbability(p){

	if(!(0 <= p && p <= 100))
		return false;

	// Change it (local storage)
	localStorage.setItem("quote_loadpage_probability", p);

	// Locally too (RAM)
	quoteLoadPageProbability = p;

	console.log("Probability set to: " + quoteLoadPageProbability);

	return true;
}


// Get and respond to messages
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){

	switch(message.type){

		// Show random quote
		case 1: 
			showRandomQuote(notifyQuote);
		break;


		// Add a new quote
		case 2:
			add(message.content, sendResponse);
			return true;
		break;


		// Get total number of quotes
		case 3:
			getTotalQuotes(sendResponse);
			return true;
		break;


		// Find all
		case 4:
			findAll(sendResponse);
			return true;
		break;


		// Delete quote
		case 5:
			removeByKey(message.key, sendResponse);
			return true;
		break;

		case 6:
			findByKey(message.key, sendResponse);
			return true;
		break;

		// When the user loads a new page
		case 7:

			if(Math.random()*100 < quoteLoadPageProbability){
				showRandomQuote(notifyQuote);
			}			
		break;

		// Change probability of showing a quote when loading a new page
		case 8:			
			setLoadPageProbability(message.probability);
		break;


		// Get probability
		case 9:
			sendResponse(quoteLoadPageProbability);
			return true;
		break;


	}
});



// Manually export database
function exportDatabase(){
	findAll(function(response){
		console.log(JSON.stringify(response));
	});
}

// Manually import database
function importDatabase(stringDatabase){
	var amount = stringDatabase.length;
	console.log("Importing " + amount + " items.");
	if(amount == 0) return;
	for(var i=0; i<amount; i++)
		add(stringDatabase[i]);
}



(function(){


	// Clear all alarms (if any)
	chrome.alarms.clearAll(function(wasCleared){
		if(wasCleared)
			console.log("All alarms were cleared");
		else
			console.log("Error clearing alarms");	
	});

	// Start alarm periodically
	chrome.alarms.create("quote-alarm", {
		periodInMinutes: randomPeriod(40, 55)
	});


	// Event for when the alarm beeps
	chrome.alarms.onAlarm.addListener(function(alarm) {
		showRandomQuote(notifyQuote);
		console.log("Alarm beep +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
		console.log("Current date: " + new Date());
		console.log("Alarm information:");
		console.log(alarm);
	});


	// Print alarm and other data
	chrome.alarms.getAll(function(alarms){
		console.log("Extension start!");
		console.log(new Date());
		console.log(alarms);
	});


	// Clicks notification
	chrome.notifications.onClicked.addListener(function(notifId){
		var newURL = chrome.extension.getURL("views/show_quote.html?id="+notifId);
	  	chrome.tabs.create({ url: newURL });
	});


	// Probability of showing a quote when the user loads a new page
	quoteLoadPageProbability = parseInt(localStorage.getItem("quote_loadpage_probability"));

	if(isNaN(quoteLoadPageProbability) || quoteLoadPageProbability < 0 || 100 < quoteLoadPageProbability){
		console.log("Probability (show quote when loading a page) set to default.");
		setLoadPageProbability(10);
	}

	console.log("Probability of showing a quote when the user loads a new page: " + quoteLoadPageProbability);

})();
