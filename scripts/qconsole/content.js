var CM = null

/* Load the content of the selected item into a new or existing tab */
const loadContent = (content, type) => {
    const event = new CustomEvent('clearCodeMirror', { detail: content });
    document.dispatchEvent(event);
    setTimeout(() => {
        // Assuming the id of your select element is 'dropdown-id'
        var selectElement = document.getElementById('query-type');
        let visibleText = 'JavaScript'
        switch (type) {
            case 'js':
            case 'sjs': visibleText = 'JavaScript'; break;
            case 'sql': visibleText = 'SQL'; break;
            case 'sparql': visibleText = 'SPARQL Query'; break;
            case 'xqy':
            case 'xq': visibleText = 'XQuery'; break;
            default: break
        }
        console.log(visibleText)
        // Change the value as before
        $('#query-type option').each(function () {
            if ($(this).text() == visibleText) {
                $(this).prop('selected', true);
            }
        });

        // Modern browsers
        var event = new Event('change', { 'bubbles': true, 'cancelable': true });
        selectElement.dispatchEvent(event);

        // If 'change' is not enough, you might also need to dispatch 'click' or 'mousedown' events to the dropdown
        var mouseEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        selectElement.dispatchEvent(mouseEvent);
    }, 50)
}


const createHtmlContainer = () => {
    // Find the .qc-tabs-holder div and append the container to it
    var $tabsHolder = $('.qc-tabs-holder').first(); // Use .first() in case there are multiple elements with this class

    // Create the container with adjusted positioning
    var $container = $('<div>', { id: 'dynamic-list-container' }).appendTo($tabsHolder);

    // The .qc-tabs-holder needs a CSS position other than 'static' for absolute positioning to work
    $tabsHolder.css('position', 'relative');

    // Append the input and list elements to the container
    $container.append(
        '<span id="mon-ami-query-search">' +
        '  <input type="text" id="dynamic-input" placeholder="Search registry ..." />' + 
        '</span>' +
        '<ul id="dynamic-list" style="list-style: none; margin-top: 5px; padding: 0; display: none;"></ul>'
    );

    var $input = $('#dynamic-input');
    var $list = $('#dynamic-list');
    $input.css('background', '#cbebff');
    // Function to update the list based on the input
    function updateList(filteredData) {
        $list.empty(); // Clear current list
        filteredData.forEach(function (item) {
            // Function to populate the content based on the selected item
            const populateContent = () => {
                // Example fetch, implement according to your needs
                fetch(item.url)
                    .then(response => response.text())
                    .then(x => loadContent(x, item.type))
                    .catch(error => console.error('Error:', error));
                $input.val(''); // Reset input
                $list.hide(); // Hide list after selection
            }
            // Create the list item
            const $li = $('<li>', {
                css: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px' }
            });

            // Show the query label in the list
            $('<span>', { text: item.label }).appendTo($li);

            // Create and add the action button
            $('<button>', {
                text: '+', // Change this to whatever text or symbol you prefer
                css: { width: '20px', border: 'none', height: '20px', marginLeft: '10px' },
                click: async (e) => {
                    e.stopPropagation(); // Prevent triggering the li's click event
                    const tabName = await qc.addTab(item.label)
                    populateContent();
                }
            }).appendTo($li);

            // Append the fully constructed li to the list
            $li.appendTo($list).click(populateContent);
        });

        if (filteredData.length) {
            $list.show(); // Show list if there are items
        } else {
            $list.hide(); // Hide list if empty
        }
    }

    // Listen for input changes to filter the list
    $input.on('input', function () {
        var value = $(this).val().toLowerCase();
        var filteredData = COMMAND_LIST
            .filter(function (item) {
                return item.label.toLowerCase().indexOf(value) > -1;
            })
            .sort()
        updateList(filteredData);
    });

    // Show all items when the input is focused
    $input.on('focus', () => updateList(COMMAND_LIST));

    $container.on('blur', () => {
        console.log('bluh conainer')
        setTimeout(() => {
            console.log('bluuuuuuuh')
            $list.hide()
        }, 500)
    })

    // Keyboard navigation for the input field
    $input.on('keydown', function (e) {
        if (e.key === "ArrowDown") {
            e.preventDefault(); // Prevent cursor from moving
            $list.children().first().focus(); // Focus on the first list item
        }
    });

    return $container
}

$(document).ready(() => {
    const $c = createHtmlContainer()
    addGearButton($c)
    const scriptElement = document.createElement('script');
    scriptElement.src = chrome.runtime.getURL('scripts/qconsole/codeMirrorManipulation.js');
    (document.head || document.documentElement).appendChild(scriptElement);
});
