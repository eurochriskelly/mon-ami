document.addEventListener('clearCodeMirror', function(event) {
    var cmElement = document.querySelector('.CodeMirror');
    if (cmElement && cmElement.CodeMirror) {
        cmElement.CodeMirror.setValue('');
        cmElement.CodeMirror.setValue(event.detail);
    }
});
