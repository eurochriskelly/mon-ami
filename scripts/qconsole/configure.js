const addGearButton = ($c) => {
  const $button = $('<button class="gearIcon">').text('⚙️'); // Create a button element
  $button.css('border', 'none')
  // add the button after the input
  $('#mon-ami-query-search > input').after($button);
}

$(document).ready(function() {
  if (!localStorage.getItem('registries')) {
    localStorage.setItem('registries', JSON.stringify([]));
  }

  function renderDialog() {
    const dialogHTML = `
      <div id="configureDialogOverlay" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:1000;display:flex;justify-content:center;align-items:center;">
        <div id="configureDialog" style="background:#fff;padding:20px;box-shadow:0 4px 6px rgba(0,0,0,0.1);position:relative;">
          <button id="closeDialog" style="position:absolute;top:10px;right:10px;">x</button>
          <div id="registriesList"></div>
          <input type="text" id="newRegistryUrl" placeholder="http://example.com" />
          <button id="addRegistry">Add</button>
          <button id="removeSelected">Remove Selected</button>
        </div>
      </div>
    `;

    $('body').append(dialogHTML);
    updateRegistryList();

    $('#configureDialogOverlay').on('click', function(event) {
      if (event.target.id === 'configureDialogOverlay') {
        closeDialog();
      }
    });

    // Close dialog on close button click
    $('#closeDialog').click(closeDialog);

    $('#addRegistry').click(function() {
      const url = $('#newRegistryUrl').val();
      if (url) {
        const registries = JSON.parse(localStorage.getItem('registries'));
        if (!registries.includes(url)) {
          registries.push(url);
          localStorage.setItem('registries', JSON.stringify(registries));
          updateRegistryList();
          $('#newRegistryUrl').val('');
        } else {
          alert('This URL is already in the list.');
        }
      }
    });

    $('#removeSelected').click(function() {
      const selectedUrl = $('#registriesList select').val();
      let registries = JSON.parse(localStorage.getItem('registries'));
      registries = registries.filter(url => url !== selectedUrl);
      localStorage.setItem('registries', JSON.stringify(registries));
      updateRegistryList();
    });
  }

  function updateRegistryList() {
    const registries = JSON.parse(localStorage.getItem('registries'));
    let listHTML = '<select size="5" style="width:100%;">';
    registries.forEach(url => {
      listHTML += `<option value="${url}">${url}</option>`;
    });
    listHTML += '</select>';
    $('#registriesList').html(listHTML);
  }

  async function closeDialog() {
    updateRegistry();
    $('#configureDialogOverlay').remove();
  }

  $(document).on('click', '.gearIcon', function() {
    renderDialog();
  });
});
