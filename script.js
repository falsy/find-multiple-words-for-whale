let bodyHTML = '';
const exceptEl = ['SCRIPT', 'LINK', 'STYLE', 'IFRAME'];
const findWord = 'About';

whale.tabs.executeScript({
  code: 'document.body.innerHTML'
}, (html) => {
  const el = document.createElement('body');
  el.innerHTML = html;
  console.log(html[0]);
  console.log(findAllDom(el));
});


function findAllDom(el) {
  let changeInnerHTML = '';
  el.childNodes.forEach(node => {
    if(node.nodeName === '#text') {
      if(node.data.indexOf(findWord) !== -1) {
        changeInnerHTML += node.data.replace(findWord, `<i class="fmw-style">${findWord}</i>`);
      } else {
        if(node.data) changeInnerHTML += node.data;
      }
    } else if(node.nodeName === '#comment') {
      changeInnerHTML += `<!--${node.data}-->`;
    } else {
      if(node.childNodes && node.childNodes.length) {
        let container = node.outerHTML;
        for(let el of node.childNodes) {
          if(el.nodeData) container = container.replace(el.data, '');
          if(el.outerHTML) container = container.replace(el.outerHTML, '');
        }
        const containerStart = container.split('>')[0] + '>';
        const containerEnd = '<' + container.split('<')[2];
        changeInnerHTML += containerStart;
        changeInnerHTML += findAllDom(node);
        changeInnerHTML += containerEnd;
      } else {
        changeInnerHTML += node.outerHTML;
      }
    }
  });
  return changeInnerHTML;
}


// function findAllDom(target) {
//   if(target.length) {
//     for(let i=0, len=target.length; i<len; i++) {
//       if(target[i]) findAllDom(target[i], modifyDom);
//     }
//   } else {
//     if(target.childNodes && target.childNodes.length && exceptEl.indexOf(target.nodeName) === -1) {
//       changeTextNode(target);
//     }
//   }
// }

// function changeTextNode(target) {
//   const child = target.childNodes;
//   console.dir(child);
//   const checkTextNode = child.filter((node) => node.nodeName === '#text');

//   if(checkTextNode.length) {
//     let changeInnerHTML = '';
//     for(let i=0, len=child.length; i<len; i++) {
//       if(!child[i]) continue;
//       if(child[i].nodeName === '#text') {
//         if(child[i].data.indexOf(findWord) !== -1) {
//           changeInnerHTML += child[i].data.replace(findWord, `<i class="fmw-style">${findWord}</i>`);
//         } else {
//           changeInnerHTML += child[i].data;
//         }
//       } else {
//         changeInnerHTML += child[i].outerHTML;
//         findAllDom(child[i], modifyDomEl);
//       }
//     }
//     target.innerHTML = changeInnerHTML;
//   } else {
//     for(let i=0, len=child.length; i<len; i++) {
//       if(child[i]) findAllDom(child[i], modifyDomEl);
//     }
//   }
// }

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