whale.tabs.executeScript({
  code: 'document.querySelector("body").innerText'
}, function(result) {
  console.log(result);
});

whale.runtime.getBackgroundPage(function(a) {
  console.log(a);
});