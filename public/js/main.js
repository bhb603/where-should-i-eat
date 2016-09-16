function lazyLoadCss(filename) {
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = filename
    var h = document.getElementsByTagName('head')[0];
    h.parentNode.insertBefore(l, h);
}
window.addEventListener('load', function() {
  lazyLoadCss('https://fonts.googleapis.com/css?family=Raleway');
  var clearEl = document.getElementById('clear');
  if (clearEl) {
    clearEl.onclick = function(event) {
      event.preventDefault();
      document.cookie = "wsie_params=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.getElementById('location').value = null;
      document.getElementById('radius').value = '1';
      document.getElementById('search').value = null;
      document.getElementById('save').checked = false;
    }
  }
});
