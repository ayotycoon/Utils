
function start () {
  chrome.tabs.executeScript({
    code: '(' + findInput + ')();' //argument here is a string but function.toString() returns function's code
}, (results) => {
    //Here we have just the innerHTML and not DOM structure
    console.log('Popup script:')
    console.log(results[0]);
});
}
let timesRan = 0;

document.addEventListener('DOMContentLoaded', function() {
  var link = document.getElementById('start');
  // onClick's logic below:
  link.addEventListener('click', start);
  console.log({timesRan})
  timesRan ++


});