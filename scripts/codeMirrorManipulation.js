document.addEventListener('clearCodeMirror', function() {
    var cmElement = document.querySelector('.CodeMirror');
    if (cmElement && cmElement.CodeMirror) {
        cmElement.CodeMirror.setValue('');
    }
});
