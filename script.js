let defaultElement = '';

whale.tabs.executeScript({
  code: 'document.body.innerHTML'
}, (html) => {
  defaultElement = html;
  console.log(defaultElement[0]);

  const el = document.createElement('body');
  el.innerHTML = html;
  console.log(el);
});


// console.log(document.getElementById('keyword'));

setTimeout(() => {
  whale.tabs.executeScript({
    code: 'document.getElementById("page").style.backgroundColor="red"'
  });
}, 2000);

setTimeout(() => {
  whale.tabs.executeScript({
    code: 'document.body.innerHTML=`'+defaultElement+'`'
  });
}, 4000);