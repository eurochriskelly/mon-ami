/* a module that knows how to control the qc-console 
 * e.g.
 * - adding tabs
 * - removing tabs
 * - renaming tabs
 * - etc.
 */
const qc = {
    getOpenTabNames: () => {
        const openTabs = [];
        $('.qc-tabs-scroll-pane > ul > li > div.tab-name').each(function () {
            openTabs.push($(this).text());
        });
        return openTabs;
    },
    addTab: (label) => new Promise((accept, reject) => {
        // gather existing open tab labels by looping over '.qc-tab-scroll-pane > ul > li'
        // and adding them to an array.
        const openTabs = qc.getOpenTabNames();

        // click on the button with class .add-tab-btn
        $('.add-tab-btn').click();

        if (label) {
            console.log('TODO: implement renaming the tab');
        }

        // wait until the tab is added. To know when it's added
        let newTab = ''
        let ii = 0;
        setInterval(() => {
            const newOpenTabs = qc.getOpenTabNames();
            if (newOpenTabs.length > openTabs.length) {
                // find the new tab by comparing the newOpenTabs array with the openTabs array
                newTab = newOpenTabs.filter(tab => !openTabs.includes(tab));
                accept(newTab[0])
            }
        }, 100);
    }),
}