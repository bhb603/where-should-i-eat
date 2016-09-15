function lazyLoadCss(filename) {
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = filename
    var h = document.getElementsByTagName('head')[0];
    h.parentNode.insertBefore(l, h);
}
window.addEventListener('load', function() {
  lazyLoadCss('https://fonts.googleapis.com/css?family=Raleway');
});
