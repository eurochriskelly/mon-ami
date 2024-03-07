// poor mans registry for qconsole scripts
var REGISTRY = {};
var COMMAND_LIST = []

const updateRegistry = async () => {
    let registries = JSON.parse(localStorage.getItem('registries'));

    if (!registries.length) {
        registries = ["https://raw.githubusercontent.com/eurochriskelly/mon-ami/main/registry/default.json"];
    }

    COMMAND_LIST = []
    for (const registry of registries) {
        const response = await fetch(registry);
        const data = await response.json();
        for (const item of data) {
            COMMAND_LIST.push(item);
        }
    }
}

updateRegistry()

