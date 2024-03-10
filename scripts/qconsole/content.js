var CM = null

const loadContent = (content, type) => {
    const event = new CustomEvent('clearCodeMirror', { detail: content });
    document.dispatchEvent(event);
    setTimeout(() => {
        // Assuming the id of your select element is 'dropdown-id'
        var selectElement = document.getElementById('query-type');
        let visibleText = 'JavaScript'
        switch (type) {
            case 'js':
            case 'sjs':
                visibleText = 'JavaScript'; break;
            case 'sql':
                visibleText = 'SQL'; break;
            case 'sparql':
                visibleText = 'SPARQL Query'; break;
            case 'xqy':
            case 'xq':
                visibleText = 'XQuery'; break;
            default: break
        }
        console.log(visibleText)
        // Change the value as before
        $('#query-type option').each(function() {
            if ($(this).text() == visibleText) {
                $(this).prop('selected', true);
            }
        });

        // Manually dispatch the change event
        if (typeof(Event) === 'function') {
            // Modern browsers
            var event = new Event('change', { 'bubbles': true, 'cancelable': true });
            selectElement.dispatchEvent(event);
        } else {
            // IE 11
            var event = document.createEvent('Event');
            event.initEvent('change', true, true);
            selectElement.dispatchEvent(event);
        }

        // If 'change' is not enough, you might also need to dispatch 'click' or 'mousedown' events to the dropdown
        var mouseEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        selectElement.dispatchEvent(mouseEvent);
    }, 500)
}

const createHtmlContainer = () => {
    // Find the .qc-tabs-holder div and append the container to it
    var $tabsHolder = $('.qc-tabs-holder').first(); // Use .first() in case there are multiple elements with this class

    // Create the container with adjusted positioning
    var $container = $('<div>', {
        id: 'dynamic-list-container',
        css: {
            position: 'absolute', // Changed to absolute for positioning inside a relative parent
            top: '2px',
            right: '5px',
            zIndex: 9999 // Ensure it appears above other content
        }
    }).appendTo($tabsHolder);

    // The .qc-tabs-holder needs a CSS position other than 'static' for absolute positioning to work
    $tabsHolder.css('position', 'relative');

    // Append the input and list elements to the container
    $container.append(
        '<input type="text" id="dynamic-input" placeholder="Search registry ...">' +
        '<ul id="dynamic-list" style="list-style: none; margin-top: 5px; padding: 0; display: none;"></ul>'
    );

    var $input = $('#dynamic-input');
    var $list = $('#dynamic-list');
    $list.css('opacity', '1');
    $list.css('background', '#efefef');
    $list.css('border', '1px solid #ccc');
    $list.css('border-radius', '4px');
    $list.css('margin', '2px');
    $list.css('font-size', '0.9rem');
    $input.css('background', '#cbebff');

    // Function to update the list based on the input
    function updateList(filteredData) {
        $list.empty(); // Clear current list
        filteredData.forEach(function (item) {
            const { type } = item
            $('<li>', {
                text: item.label,
                tabindex: 0,
                click: function () {
                    console.log(`Fetching: ${item.url}`);
                    // Example fetch, implement according to your needs
                    fetch(item.url)
                        .then(response => response.text())
                        .then(x => loadContent(x, type))
                        .catch(error => console.error('Error:', error));
                    $input.val(''); // Reset input
                    $list.hide(); // Hide list
                },
                keydown: function (e) {
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
    $input.on('focus', function () {
        updateList(COMMAND_LIST);
    });

    $input.on('blur', function () {
        setTimeout(() => {
            $list.hide();
        }, 1000)
    });

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
