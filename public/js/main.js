window.addEventListener('load', function() {
  var clearEl = document.getElementById('clear');
  if (clearEl) {
    clearEl.onclick = function(event) {
      event.preventDefault();
      document.cookie = "wsie_params=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.getElementById('location').value = null;
      document.getElementById('search').value = null;
      document.getElementById('save').checked = false;
    }
  }
});
