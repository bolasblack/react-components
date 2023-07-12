import{a as s,F as p,j as n}from"./jsx-runtime-91a467a5.js";import{r as m}from"./index-8db94870.js";import{u as g}from"./useAsyncFnFactory-72d6232e.js";import"./_commonjsHelpers-042e6b4d.js";const k={title:"Library/use-async/useAsyncFnFactory"},t=()=>{const a=m.useRef(null),[r,u]=g(()=>async e=>new Promise((o,d)=>{a.current={resolve(){e==null?o(`Current time: ${new Date().toString()}, issued after initialized`):o(`Current time: ${new Date().toString()}, issued when clicked at ${e}`)},reject:d}}),[]);return s(p,{children:[s("p",{children:[n("button",{onClick:()=>u(new Date().toString()),children:"Load current time"}),n("button",{onClick:()=>{var e;return(e=a.current)==null?void 0:e.resolve(new Date().toString())},children:"Load success"}),n("button",{onClick:()=>{var e;return(e=a.current)==null?void 0:e.reject(new Error("Load failed"))},children:"Load failed"})]}),s("p",{children:[r.loading&&n("span",{children:"Loading..."}),r.error&&n("span",{style:{color:"red"},children:r.error.message}),r.value&&n("span",{style:{color:"green"},children:r.value})]})]})};var c,i,l;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`() => {
  const callbacksRef = useRef<null | {
    resolve: (value: string) => void;
    reject: (error: Error) => void;
  }>(null);
  const [reqState, reRun] = useAsyncFnFactory(() => async (timeWhenClick?: string) => {
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
}`,...(l=(i=t.parameters)==null?void 0:i.docs)==null?void 0:l.source}}};const v=["BasicUsage"];export{t as BasicUsage,v as __namedExportsOrder,k as default};
//# sourceMappingURL=useAsyncFnFactory.stories-a42740c1.js.map
