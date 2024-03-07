const createHtmlContainer = () => {
    // Find the .qc-tabs-holder div and append the container to it
    var $tabsHolder = $('.qc-tabs-holder').first();
  // Use .first() in case there are multiple elements with this class

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
        '<span>' +
        '<input type="text" id="dynamic-input" placeholder="Type to search...">' +
        '<ul id="dynamic-list" style="list-style: none; margin-top: 5px; padding: 0; display: none;"></ul>' +
      '</span>'
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
    return $container
}
