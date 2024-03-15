var CM = null

var MODE = 'local'

/* Load the content of the selected item into a new or existing tab */
const loadContent = (content, type) => {
    const event = new CustomEvent('clearCodeMirror', { detail: content });
    document.dispatchEvent(event);
    setTimeout(() => {
        const typeToText = {
            'js': 'JavaScript',
            'sjs': 'JavaScript',
            'sql': 'SQL',
            'sparql': 'SPARQL Query',
            'xqy': 'XQuery',
            'xq': 'XQuery'
        };
        const visibleText = typeToText[type] || 'JavaScript';
        $('#query-type').val($('#query-type option').filter(function () { return $(this).text() === visibleText; }).val()).trigger('change');
    }, 50);
}

const createHtmlContainer = () => {
    var $input = $('#dynamic-input'); // the search box
    var $list = $('#query-list');
    // Function to update the list based on the input
    function updateList(filteredData = [], hide=false) {
        if (!filteredData.length) return
        $('#query-list li.remote-script').remove();
        let lastSection = ''
        filteredData.forEach(function (item, i) {
            const { section } = item
            if (section != lastSection) {
                const li = $(`<li>`, {
                    text: `📦 ${item.section}`,
                    class: 'remote-script',
                    css: {
                        textTransform: 'uppercase',
                        marginTop: '7px',
                        fontStyle: 'italic',
                        color: 'rgb(119, 80, 40)',
                        fontWeight: 'normal',
                    }
                }).appendTo($list)

                if (hide) li.hide()
                lastSection = section
            }
            // Function to populate the content based on the selected item
            const populateContent = () => {
                // Example fetch, implement according to your needs
                fetch(item.url)
                    .then(response => response.text())
                    .then(x => loadContent(x, item.type))
                    .catch(error => console.error('Error:', error));
                $input.val(''); // Reset input
            }
            // Create the list item
            const $li = remoteItem(item.label, 'XQuery').addClass('remote-script').show()
            if (hide) $li.hide()

            // Create and add the action button
            /* $('<button>', {
                text: '+', // Change this to whatever text or symbol you prefer
                click: async (e) => {
                    e.stopPropagation(); // Prevent triggering the li's click event
                    const tabName = await qc.addTab(item.label)
                    populateContent();
                }
            }).appendTo($li);
            */
            // Append the fully constructed li to the list
            $li.appendTo($list).click(populateContent);
        });
    }
    function filterOnType (init = false) {
        var value = init ? null : $(this).val().toLowerCase();
        console.log('value', value, COMMAND_LIST)
        var filteredData = COMMAND_LIST
            .filter(function (item) {
                if (!value) return true
                return item.label.toLowerCase().indexOf(value) > -1;
            })
        updateList(filteredData, init);
    }
    filterOnType(true)
    // Listen for input changes to filter the list
    $input.on('input', filterOnType);

    // Prevent click inside the search box from propagating to the document
    $('#dynamic-input').on('click', function (e) { e.stopPropagation(); });

    // Similarly, prevent click inside the list from propagating to the document
    $('#query-list').on('click', function (e) { e.stopPropagation(); });

    // Keyboard navigation for the input field
    /*
    $input.on('keydown', function (e) {
        if (e.key === "ArrowDown") {
            e.preventDefault(); // Prevent cursor from moving
            $list.children().first().focus(); // Focus on the first list item
        }
    });
    */
}

// Create new elements ...
const remoteItem = (label, type) => {
    return $(`<li>
        <div role="button" class="query-doc-name-space">
            <p class="xquery">
                <span class="visually-hidden">${type}</span>
            </p>
            <span class="query-doc-name">${label}</span>
        </div>
        <button class="new-icon"></button>
    </li>`)
}

const initializeWarehouseDom = () => {
    $('#snippets-content').css('display', 'none');
    const $workspaceTitle = $('#workspace-title')
    const $toggleBtn = $('<button>', {
        id: 'toggle-button',
        text: '🌐',
        css: {
            position: 'absolute',
            background: 'none',
            right : '10px',
            top: '4px',
            width: '24px',
            border: 'none',
            
        }
    });

    // For each li under ul#query-list, add a class "local-script"
    $toggleBtn.on('click', () => {
        if (MODE == 'local') {
            MODE = 'remote'
        } else {
            MODE = 'local'
        }
        $('#add-query-space').toggle();
        $('#sidebar-workspace-btn').toggle();
        $('#workspace-title-text').toggle();
        $('#workspace-arrow').toggle();
        if (MODE == 'local') {
            $('#query-list > li').show();
            $('#query-list > li.remote-script').hide();
        } else {
            $('#query-list > li').hide();
            $('#query-list > li.remote-script').show();
        }
        // Turn on hidden items
        $('#dynamic-input').toggle()
    })
    $('#sidebar-btns').append($toggleBtn);
    $('#sidebar-btns').css('position', 'relative')

    $('<input>', {
        id: 'dynamic-input',
        type: 'text',
        placeholder: 'Search registry ...',
        css: {
            width: '165px',
            margin: '2px'
        }
    })
        .hide()
        .insertAfter($workspaceTitle)
}

$(document).ready(() => {
    // addGearButton($c)
    initializeWarehouseDom()
    var interval
    interval = setInterval(() => {
        if (COMMAND_LIST.length) {
            createHtmlContainer()
            clearInterval(interval)
        }
    }, 100) 
    qc.setWorkspaceWidth(200)
    const scriptElement = document.createElement('script');
    scriptElement.src = chrome.runtime.getURL('scripts/qconsole/codeMirrorManipulation.js');
    (document.head || document.documentElement).appendChild(scriptElement);
});
