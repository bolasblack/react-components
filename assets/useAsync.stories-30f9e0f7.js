import{a as l,F as p,j as s}from"./jsx-runtime-91a467a5.js";import{r as o}from"./index-8db94870.js";import{u as g}from"./useAsyncFnFactory-72d6232e.js";import"./_commonjsHelpers-042e6b4d.js";function b(r,n=[]){const a=o.useRef(!0),e=o.useRef(!0),t=g(()=>(...m)=>r(...m),n,a.current?{loading:!0,promise:r()}:void 0);a.current&&(a.current=!1);const[,c]=t;return o.useEffect(()=>{e.current?e.current=!1:c()},[...n,c]),o.useDebugValue(t),t}const k={title:"Library/use-async/useAsync"},i=()=>{const r=o.useRef(null),[n,a]=b(async e=>new Promise((t,c)=>{r.current={resolve(){e==null?t(`Current time: ${new Date().toString()}, issued after initialized`):t(`Current time: ${new Date().toString()}, issued when clicked at ${e}`)},reject:c}}),[]);return l(p,{children:[l("p",{children:[s("button",{onClick:()=>a(new Date().toString()),children:"Load current time"}),s("button",{onClick:()=>{var e;return(e=r.current)==null?void 0:e.resolve(new Date().toString())},children:"Load success"}),s("button",{onClick:()=>{var e;return(e=r.current)==null?void 0:e.reject(new Error("Load failed"))},children:"Load failed"})]}),l("p",{children:[n.loading&&s("span",{children:"Loading..."}),n.error&&s("span",{style:{color:"red"},children:n.error.message}),n.value&&s("span",{style:{color:"green"},children:n.value})]})]})};var u,d,f;i.parameters={...i.parameters,docs:{...(u=i.parameters)==null?void 0:u.docs,source:{originalSource:`() => {
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
        {(reqState.error as any) && <span style={{
        color: 'red'
      }}>
            {(reqState.error as any).message}
          </span>}
        {reqState.value && <span style={{
        color: 'green'
      }}>{reqState.value}</span>}
      </p>
    </>;
}`,...(f=(d=i.parameters)==null?void 0:d.docs)==null?void 0:f.source}}};const w=["BasicUsage"];export{i as BasicUsage,w as __namedExportsOrder,k as default};
//# sourceMappingURL=useAsync.stories-30f9e0f7.js.map
