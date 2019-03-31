
const findAllDom = function() {
  return function() {

    const exceptEl = ['SCRIPT', 'LINK', 'STYLE', 'IFRAME'];
    const findWord = 'About';

    function findAllDom2(el) {
      el.childNodes.forEach(node => {
        if(node.nodeName === '#text') {
          if(node.data.indexOf(findWord) !== -1) {
            const fmwElement = document.createElement('i');
            fmwElement.className = 'fmw-style';
            fmwElement.innerText = findWord;
            node.parentNode.replaceChild(fmwElement, node);
          }
        } else {
          if(node.childNodes && node.childNodes.length && exceptEl.indexOf(node.nodeName) === -1) {
            findAllDom2(node);
          }
        }
      });
    }

    document.body.childNodes.forEach(node => {
      findAllDom2(node);
    });

  };
};

whale.tabs.executeScript({
  code: `
  console.log(${findAllDom()}());
  `
});

// function findAllDom2(el) {
//   let changeInnerHTML = '';
//   el.childNodes.forEach(node => {
//     if(node.nodeName === '#text') {
//       if(node.data.indexOf(findWord) !== -1) {
//         console.dir(node.parentNode);
//         c = document.createElement('i');
//         c.innerText = findWord;
//         node.parentNode.replaceChild(c, node.childNodes[0]);
//         changeInnerHTML += node.data.replace(findWord, `<i class="fmw-style">${findWord}</i>`);
//       } else {
//         if(node.data) changeInnerHTML += node.data;
//       }
//     } else if(node.nodeName === '#comment') {
//       changeInnerHTML += `<!--${node.data}-->`;
//     } else {
//       if(node.childNodes && node.childNodes.length) {
//         let container = node.outerHTML;
//         for(let el of node.childNodes) {
//           if(el.nodeData) container = container.replace(el.data, '');
//           if(el.outerHTML) container = container.replace(el.outerHTML, '');
//         }
//         const containerStart = container.split('>')[0] + '>';
//         const containerEnd = '<' + container.split('<')[2];
//         changeInnerHTML += containerStart;
//         changeInnerHTML += findAllDom(node);
//         changeInnerHTML += containerEnd;
//       } else {
//         changeInnerHTML += node.outerHTML;
//       }
//     }
//   });
//   return changeInnerHTML;
// }


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
//     // 'document.body.innerHTML=`'+editHTML+'`'
//     code: `document.body.innerHTML=\`${editHTML}\``
//   });
// }, 2000);

// setTimeout(() => {
//   whale.tabs.executeScript({
//     code: 'document.body.innerHTML=`'+defaultElement+'`'
//   });
// }, 4000);