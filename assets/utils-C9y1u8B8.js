function a(e,r={}){const{collapseNewlines:l=!1}=r;let t=e.replace(/\r\n/g,`
`).replace(/\t/g,"  ").trim();return l?t=t.replace(/\n+/g," ").replace(/\s+/g," ").trim():t=t.split(`
`).map(n=>n.replace(/\s+/g," ").trim()).filter(n=>n.length>0).join(`
`),t}const o={get(e,r=null){try{const l=localStorage.getItem(`codedrill_${e}`);return l?JSON.parse(l):r}catch{return r}},set(e,r){try{return localStorage.setItem(`codedrill_${e}`,JSON.stringify(r)),!0}catch{return!1}},remove(e){localStorage.removeItem(`codedrill_${e}`)}};export{a as n,o as s};
