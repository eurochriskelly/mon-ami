// poor mans registry for qconsole scripts
const REGISTRY = {
    "Extract logs": {
        "description": "Extract logs from the database",
        "script": "https://raw.githubusercontent.com/eurochriskelly/ml-log-stream/main/src/extract-logs.xqy"
    }
}

var data = [
    { label: 'Export logs', url: 'https://raw.githubusercontent.com/eurochriskelly/ml-log-stream/main/src/extract-logs.xqy' },
    { label: 'Search logs', url: 'https://raw.githubusercontent.com/eurochriskelly/ml-log-stream/main/src/logStreamer.sjs' },
    // Add more items to your array as needed
];
