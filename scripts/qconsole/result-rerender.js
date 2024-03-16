// Re render results if certain patterns are detected in output.
//
var ctrlKeyPressed = false;

// Detect when the run button is clicked and wait until it completes.
// The run button has the id #run-btn
// To detect when it's completed, we wait for the output to change.
// so first check the value of #query-view-info-container
const setupResultArea = () => {
    // Button click event
    $('#run-btn').click(startObservation);
    $(document).on('keydown', function(e) {
        // Check if the Ctrl key is pressed
        if((e.ctrlKey || e.metaKey)) {
            startObservation();
        }
    });
}

const startObservation = () => {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                if (mutation.target.id === 'query-view') {
                    rerenderResults();
                }
            }
        });
    });

    observer.observe(document.body, { // Changed from `document` to `document.body` for more specific targeting
        childList: true,
        subtree: true
    });
};

const rerenderResults = () => {
    $('.resultItem').each(function () {
        const resultItem = $(this);
        var elementName = resultItem.find('.element-open > .element-name > .local-name').first().text();
        if (!elementName) {
            // Look for the value of a code item instead
            elementName = resultItem.find('code').first().text();
            elementName = elementName.split('>')[0].replace('<', '');
        }
        if (['html', 'body', 'h1', 'h2', 'h3', 'h4', 'table', 'p', 'div', 'span'].includes(elementName.toLowerCase())) {
            const selectElement = $('#render-as-select');
            selectElement.val('html');
            selectElement.trigger('change'); // For jQuery listeners
            const event = new Event('change', { 'bubbles': true, 'cancelable': true });
            selectElement[0].dispatchEvent(event); // For native listeners
        }
    });
};
