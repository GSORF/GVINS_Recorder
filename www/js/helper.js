/* Here are some helper functions used throughout the whole code */

// Log a string to the User Interface
logMessages = new Array();
function log(message)
{
    var maxLength = 200;
    var datum = new Date().toLocaleString();
    logMessages.push('<span style="color:darkred;">' + datum + '</span>: ' + message);

    if(logMessages.length > maxLength)
    {
        logMessages.shift(); // Remove first element
    }

    var output = "";
    for (let index = logMessages.length-1; index >= 0; index--) {
        output += logMessages[index] + '<br/>';
    }

	var htmlConsole = document.getElementById("consoleOutput");
    htmlConsole.innerHTML = output;
    
}









