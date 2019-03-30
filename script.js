let bodyHTML = '';
const exceptEl = ['SCRIPT', 'LINK', 'STYLE', 'IFRAME'];

whale.tabs.executeScript({
  code: 'document.body.innerHTML'
}, (html) => {
  const el = document.createElement('body');
  el.innerHTML = html;
  findAllDom(el, modifyDom);
});

function modifyDom(target) {
  console.log(target);
}

function findAllDom(target, modifyDomEl) {
  if(target.length) {
    for(let i=0, len=target.length; i<len; i++) {
      findAllDom(target[i], modifyDomEl);
    }
  } else {
    modifyDomEl(target);
    if(target.children && target.children.length) {
      for(let i=0, len=target.children.length; i<len; i++) {
        if(exceptEl.indexOf(target.children[i].tagName) === -1) {
          findAllDom(target.children[i], modifyDomEl);
        }
      }
    }
  }
}

// setTimeout(() => {
//   whale.tabs.executeScript({
//     code: 'document.getElementById("page").style.backgroundColor="red"'
//   });
// }, 2000);

// setTimeout(() => {
//   whale.tabs.executeScript({
//     code: 'document.body.innerHTML=`'+defaultElement+'`'
//   });
// }, 4000);