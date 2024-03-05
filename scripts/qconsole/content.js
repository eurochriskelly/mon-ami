var CM = null

function clearPage() {
    const event = new CustomEvent('clearCodeMirror');
    document.dispatchEvent(event);
}

// Define a function to create and position the fixed div
function createFixedDiv() {
    // Create a new div element
    var div = $("<div>");

    // Set CSS properties for the div
    div.css({
        position: "fixed",
        color: 'white',
        top: "6px",
        left: "470px",
        padding: '4px',
        width: "11px", // Adjust width as needed
        height: "16px", // Adjust height as needed
        background: "rgba(255, 0, 0, 0.5)", // Example background color (red with 50% opacity)
        zIndex: "9999" // Set z-index to ensure it's above other content
    });

    // Add content to the div (if needed)
    div.text("L");
    div.on('click', clearPage)

    // Append the div to the body of the page
    $("body").append(div);
}

$(document).ready(() => {
    console.log('Starting up'); // Assuming II is a logging function
    createFixedDiv(); // Ensure createFixedDiv is defined and works as expected
    const scriptElement = document.createElement('script');
    scriptElement.src = chrome.runtime.getURL('scripts/codeMirrorManipulation.js');
    (document.head || document.documentElement).appendChild(scriptElement);
});
