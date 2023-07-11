import{a as l,F as p,j as t}from"./jsx-runtime-91a467a5.js";import{r as i}from"./index-8db94870.js";import{u as g}from"./useAsyncFn-be61cee8.js";import"./_commonjsHelpers-042e6b4d.js";function b(r,n=[],s){const e=i.useRef(!0),o=i.useRef(!0);e.current&&(e.current=!1,s||(s={loading:!0,promise:r()}));const a=g(r,n,s),[,u]=a;return i.useEffect(()=>{o.current?o.current=!1:u()},[...n,u]),a}const S={title:"Library/use-async/useAsync"},c=()=>{const r=i.useRef(null),[n,s]=b(async e=>new Promise((o,a)=>{r.current={resolve(){e==null?o(`Current time: ${new Date().toString()}, issued after initialized`):o(`Current time: ${new Date().toString()}, issued when clicked at ${e}`)},reject:a}}),[]);return l(p,{children:[l("p",{children:[t("button",{onClick:()=>s(new Date().toString()),children:"Load current time"}),t("button",{onClick:()=>{var e;return(e=r.current)==null?void 0:e.resolve(new Date().toString())},children:"Load success"}),t("button",{onClick:()=>{var e;return(e=r.current)==null?void 0:e.reject(new Error("Load failed"))},children:"Load failed"})]}),l("p",{children:[n.loading&&t("span",{children:"Loading..."}),n.error&&t("span",{style:{color:"red"},children:n.error.message}),n.value&&t("span",{style:{color:"green"},children:n.value})]})]})};var d,f,m;c.parameters={...c.parameters,docs:{...(d=c.parameters)==null?void 0:d.docs,source:{originalSource:`() => {
  const callbacksRef = useRef<null | {
    resolve: (value: string) => void;
    reject: (error: Error) => void;
  }>(null);
  const [reqState, reRun] = useAsync(async (timeWhenClick?: string) => {
    return new Promise<string>((resolve, reject) => {
      callbacksRef.current = {
        resolve() {
          if (timeWhenClick == null) {
            resolve(\`Current time: \${new Date().toString()}, issued after initialized\`);
          } else {
            resolve(\`Current time: \${new Date().toString()}, issued when clicked at \${timeWhenClick}\`);
          }
        },
        reject
      };
    });
  }, []);
  return <>
      <p>
        <button onClick={() => reRun(new Date().toString())}>
          Load current time
        </button>
        <button onClick={() => callbacksRef.current?.resolve(new Date().toString())}>
          Load success
        </button>
        <button onClick={() => callbacksRef.current?.reject(new Error('Load failed'))}>
          Load failed
        </button>
      </p>

      <p>
        {reqState.loading && <span>Loading...</span>}
        {reqState.error && <span style={{
        color: 'red'
      }}>{reqState.error.message}</span>}
        {reqState.value && <span style={{
        color: 'green'
      }}>{reqState.value}</span>}
      </p>
    </>;
}`,...(m=(f=c.parameters)==null?void 0:f.docs)==null?void 0:m.source}}};const h=["BasicUsage"];export{c as BasicUsage,h as __namedExportsOrder,S as default};
//# sourceMappingURL=useAsync.stories-b834a469.js.map
