import{a,F as p,j as n}from"./jsx-runtime-91a467a5.js";import{r as m}from"./index-8db94870.js";import{u as g}from"./useAsyncFn-be61cee8.js";import"./_commonjsHelpers-042e6b4d.js";const v={title:"Library/use-async/useAsyncFn"},t=()=>{const s=m.useRef(null),[r,u]=g(async e=>new Promise((o,d)=>{s.current={resolve(){e==null?o(`Current time: ${new Date().toString()}, issued after initialized`):o(`Current time: ${new Date().toString()}, issued when clicked at ${e}`)},reject:d}}),[]);return a(p,{children:[a("p",{children:[n("button",{onClick:()=>u(new Date().toString()),children:"Load current time"}),n("button",{onClick:()=>{var e;return(e=s.current)==null?void 0:e.resolve(new Date().toString())},children:"Load success"}),n("button",{onClick:()=>{var e;return(e=s.current)==null?void 0:e.reject(new Error("Load failed"))},children:"Load failed"})]}),a("p",{children:[r.loading&&n("span",{children:"Loading..."}),r.error&&n("span",{style:{color:"red"},children:r.error.message}),r.value&&n("span",{style:{color:"green"},children:r.value})]})]})};var c,i,l;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`() => {
  const callbacksRef = useRef<null | {
    resolve: (value: string) => void;
    reject: (error: Error) => void;
  }>(null);
  const [reqState, reRun] = useAsyncFn(async (timeWhenClick?: string) => {
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
}`,...(l=(i=t.parameters)==null?void 0:i.docs)==null?void 0:l.source}}};const w=["BasicUsage"];export{t as BasicUsage,w as __namedExportsOrder,v as default};
//# sourceMappingURL=useAsyncFn.stories-16fd430c.js.map
