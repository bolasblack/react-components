import{a as m,j as s}from"./jsx-runtime-91a467a5.js";import{r as p}from"./index-8db94870.js";import{w as y}from"./index-be6d86db.js";const a=({children:e})=>e||null;function f(e){const o=new Set(e.join(" ").split(" "));return Array.from(o).filter(Boolean).join(" ")}function g(e){const o=Object.assign({},...e.map(l=>l.style||{})),t=e.map(l=>l.className||"");return{style:o,className:f(t)}}function S(e){const{documentElement:o}=document,{style:t}=e;o.style.cssText="",t&&Object.keys(t).forEach(c=>o.style.setProperty(c,t[c]));const l=e.className||"";l!==o.className&&(o.className=l)}const r=y(g,S)(a);try{a.displayName="_DocumentElementInner",a.__docgenInfo={description:"",displayName:"_DocumentElementInner",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}},style:{defaultValue:null,description:"",name:"style",required:!1,type:{name:"(CSSProperties & SimpleJSON<string>)"}}}}}catch{}const _={title:"Components/DocumentElement",component:r},n=()=>{const[e,o]=p.useState("blue");return m(r,{className:"root-class-name",style:{"--font-color":"black"},children:[s(r,{style:{"--font-color":e}}),m("label",{children:["Choose text color:",s("select",{value:e,onChange:t=>o(t.target.value),children:["green","blue","yellow"].map(t=>s("option",{value:t,children:t},t))})]}),s("div",{style:{color:"var(--font-color)"},children:"Some text"})]})};var i,u,d;n.parameters={...n.parameters,docs:{...(i=n.parameters)==null?void 0:i.docs,source:{originalSource:`() => {
  const [color, changeColor] = useState('blue');
  return <DocumentElement className="root-class-name" style={{
    '--font-color': 'black'
  }}>
      <DocumentElement style={{
      '--font-color': color
    }} />
      <label>
        Choose text color:
        <select value={color} onChange={e => changeColor(e.target.value)}>
          {['green', 'blue', 'yellow'].map(color => <option key={color} value={color}>
              {color}
            </option>)}
        </select>
      </label>
      <div style={{
      color: 'var(--font-color)'
    }}>Some text</div>
    </DocumentElement>;
}`,...(d=(u=n.parameters)==null?void 0:u.docs)==null?void 0:d.source}}};const h=["BasicUsage"],C=Object.freeze(Object.defineProperty({__proto__:null,BasicUsage:n,__namedExportsOrder:h,default:_},Symbol.toStringTag,{value:"Module"}));export{n as B,C as D};
//# sourceMappingURL=DocumentElement.stories-cfb9c6bc.js.map
