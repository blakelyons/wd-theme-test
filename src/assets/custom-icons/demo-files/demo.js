if (!('boxShadow' in document.body.style)) {
    document.body.setAttribute('class', 'noBoxShadow');
}

document.body.addEventListener("click", function(e) {
    var target = e.target;
    if (target.tagName === "INPUT" &&
        target.getAttribute('class').indexOf('liga') === -1) {
        target.select();
    }
});

(function() {
    var fontSize = document.getElementById('fontSize'),
        testDrive = document.getElementById('testDrive'),
        testText = document.getElementById('testText');
    function updateTest() {
        testDrive.innerHTML = testText.value || String.fromCharCode(160);
        if (window.icomoonLiga) {
            window.icomoonLiga(testDrive);
        }
    }
    function updateSize() {
        testDrive.style.fontSize = fontSize.value + 'px';
    }
    fontSize.addEventListener('change', updateSize, false);
    testText.addEventListener('input', updateTest, false);
    testText.addEventListener('change', updateTest, false);
    updateSize();
}());

//BEGIN FREEDOM CHANGES
var elements = document.getElementsByClassName("glyph");

var insertIconFunction = function() {
if(window.location.search.indexOf('useliga') >  0){
  var icon = this.querySelector('.liga').value;
    if(icon && icon.indexOf(',') > -1){
        icon = icon.split(',')[0]
    } 
} else {
    var icon = this.querySelector('.mls').innerText;
    icon = icon.replace('icon-', '');
}
   console.log(icon);
    if(window.self != window.parent &&  typeof( window.parent.insertIcon) == 'function'){
        window.parent.insertIcon(icon);
    }
};

for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener('click', insertIconFunction, false);
}