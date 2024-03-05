var CM = null

function loadContent(content) {
    console.log(content)
    console.log('-0----')
    const event = new CustomEvent('clearCodeMirror', { detail: content });
    document.dispatchEvent(event);
}

// Define a function to create and position the fixed div with a dropdown that includes a placeholder
function _createFixedDivWithDropdown1() {
    // Create a new div element to hold the dropdown
    var div = $("<div>");

    // Set CSS properties for the div
    div.css({
        position: "fixed",
        top: "6px",
        left: "470px",
        padding: '4px',
        zIndex: "9999" // Ensure it's above other content
    });

    // Create a dropdown select element
    var select = $("<select>");

    // Add a placeholder option
    select.append($("<option>").val("").text("Pull script").prop("disabled", true).prop("selected", true));

    // Define your options here
    var options = {
        "option1": "Option 1",
        "option2": "Option 2",
        "option3": "Option 3" // Add more options as needed
    };

    // Populate the select element with options
    $.each(options, function (val, text) {
        select.append($("<option>").val(val).text(text));
    });

    // Handle the selection change
    select.change(function () {
        // Perform action based on selected option
        var selectedOption = $(this).val();

        // Example action switch, replace with actual functionality
        switch (selectedOption) {
            case "option1":
                // Action for option 1
                console.log("Option 1 selected");
                break;
            case "option2":
                // Action for option 2
                console.log("Option 2 selected");
                break;
            case "option3":
                // Action for option 3
                console.log("Option 3 selected");
                break;
            // Add more cases as needed
        }

        // Reset the dropdown to the placeholder after action
        $(this).val("").change();
    });

    // Append the select element to the div
    div.append(select);

    // Append the div to the body of the page
    $("body").append(div);
}


// Define a function to create and position the fixed div with a dropdown
function _createFixedDivWithDropdown() {
    // Create a new div element to hold the dropdown
    var div = $("<div>");

    // Set CSS properties for the div
    div.css({
        position: "fixed",
        top: "6px",
        left: "470px",
        padding: '4px',
        zIndex: "9999" // Ensure it's above other content
    });

    // Create a dropdown select element
    var select = $("<select>");

    // Define your options here
    var options = {
        "blank": "",
        "option1": "Extract Logs",
        "option2": "Option 2",
        "option3": "Option 3" // Add more options as needed
    };

    // Populate the select element with options
    $.each(options, function (val, text) {
        select.append($("<option>").val(val).text(text));
    });

    // Handle the selection change
    select.change(async function () {
        // Perform action based on selected option
        var selectedOption = $(this).val();

        // Example action switch, replace with actual functionality
        switch (selectedOption) {
            case "blank":
                // Do nothing
                break;
            case "option1":
                // Action for option 1
                console.log("Option 1 selected");
                const res = await fetch('https://raw.githubusercontent.com/eurochriskelly/ml-log-stream/main/src/extract-logs.xqy')
                console.log(res)
                break;
            case "option2":
                // Action for option 2
                console.log("Option 2 selected");
                break;
            case "option3":
                // Action for option 3
                console.log("Option 3 selected");
                break;
            // Add more cases as needed
        }
    });

    // Append the select element to the div
    div.append(select);

    // Append the div to the body of the page
    $("body").append(div);
}

const createHtmlContainer = () => {
    // Find the .qc-tabs-holder div and append the container to it
    var $tabsHolder = $('.qc-tabs-holder').first(); // Use .first() in case there are multiple elements with this class

    // Create the container with adjusted positioning
    var $container = $('<div>', {
        id: 'dynamic-list-container',
        css: {
            position: 'absolute', // Changed to absolute for positioning inside a relative parent
            top: '1px',
            right: '5px',
            zIndex: 9999 // Ensure it appears above other content
        }
    }).appendTo($tabsHolder);

    // The .qc-tabs-holder needs a CSS position other than 'static' for absolute positioning to work
    $tabsHolder.css('position', 'relative');

    // Append the input and list elements to the container
    $container.append(
        '<input type="text" id="dynamic-input" placeholder="Type to search...">' +
        '<ul id="dynamic-list" style="list-style: none; margin-top: 5px; padding: 0; display: none;"></ul>'
    );

    var $input = $('#dynamic-input');
    var $list = $('#dynamic-list');
    $list.css('opacity', '1');
    $list.css('background', 'white');
    $list.css('border', '1px solid #ccc');
    $list.css('border-radius', '4px');
    $list.css('margin', '2px');
    $list.css('font-size', '0.9rem');

    // Function to update the list based on the input
    function updateList(filteredData) {
        $list.empty(); // Clear current list
        filteredData.forEach(function(item) {
            $('<li>', {
                text: item.label,
                tabindex: 0,
                click: function() {
                    console.log(`Fetching: ${item.url}`);
                    // Example fetch, implement according to your needs
                    fetch(item.url)
                        .then(response => response.text())
                        .then(data => {
                            // console.log(data)
                            loadContent(data)
                        })
                        .catch(error => console.error('Error:', error));

                    $input.val(''); // Reset input
                    $list.hide(); // Hide list
                },
                keydown: function(e) {
                    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                        e.preventDefault(); // Prevent page scroll
                        var $current = $(document.activeElement);
                        var $next = (e.key === "ArrowDown") ? $current.next() : $current.prev();
        
                        if ($next.length) $next.focus(); // Move focus if next element exists
                    }
                }
            }).appendTo($list);
        });

        if (filteredData.length) {
            $list.show(); // Show list if there are items
        } else {
            $list.hide(); // Hide list if empty
        }
    }

    // Listen for input changes to filter the list
    $input.on('input', function() {
        var value = $(this).val().toLowerCase();
        var filteredData = data.filter(function(item) {
            return item.label.toLowerCase().indexOf(value) > -1;
        });
        updateList(filteredData);
    });

    // Show all items when the input is focused
    $input.on('focus', function() {
        updateList(data);
    });

    // Keyboard navigation for the input field
    $input.on('keydown', function(e) {
        if (e.key === "ArrowDown") {
            e.preventDefault(); // Prevent cursor from moving
            $list.children().first().focus(); // Focus on the first list item
        }
    });

}

$(document).ready(() => {
    createHtmlContainer()
    const scriptElement = document.createElement('script');
    scriptElement.src = chrome.runtime.getURL('scripts/codeMirrorManipulation.js');
    (document.head || document.documentElement).appendChild(scriptElement);
});
