import{j as i,a as p}from"./jsx-runtime-91a467a5.js";import{r as c}from"./index-8db94870.js";import{w as v}from"./index-be6d86db.js";import{r as O}from"./index-8ce4a492.js";import{s as E}from"./index-67a74965.js";var S=({children:l})=>l||null;function R(l){const e=new Set(l.join(" ").split(" "));return Array.from(e).filter(Boolean).join(" ")}function V(l){const e=Object.assign({},...l.map(t=>t.style||{})),n=l.map(t=>t.className||"");return{style:e,className:R(n)}}function N(l){const{documentElement:e}=document,{style:n}=l;e.style.cssText="",n&&Object.keys(n).forEach(r=>e.style.setProperty(r,n[r]));const t=l.className||"";t!==e.className&&(e.className=t)}var P=v(V,N)(S);const m=class m extends c.PureComponent{constructor(){super(...arguments),this._portalEl=document.createElement("div"),this._onClickDocument=e=>{var n,t;this.props.visible&&((t=(n=this.props).onVisibleChange)==null||t.call(n,!1,{event:e}))}}componentDidMount(){(this.props.baseElement??document.documentElement).addEventListener("click",this._onClickDocument),this._assignRef(this.props.portalContainerRef,this._portalEl),this._updatePortalEl(this._portalEl,null,this.props)}componentDidUpdate(e){this._updatePortalEl(this._portalEl,e,this.props)}componentWillUnmount(){(this.props.baseElement??document.documentElement).removeEventListener("click",this._onClickDocument),this._updatePortalEl(this._portalEl,this.props,null),this._assignRef(this.props.portalContainerRef,null)}render(){return this._getParent(this.props)?O.createPortal(this.props.children,this._portalEl):i("div",{className:this.props.className,style:{...this._getDisplayStyle(this.props.visible),...this.props.style},children:this.props.children})}_updatePortalEl(e,n,t){var r;if((!n||!t||n.parent!==t.parent)&&(this._operateParent(n,s=>s==null?void 0:s.removeChild(e)),this._operateParent(t,s=>s==null?void 0:s.appendChild(e))),t){(!n||n.className!==t.className)&&(e.className=((r=t.className)==null?void 0:r.trim())||"");const s=(n&&n.style)??{},o=t.style??{};E(s,o)?t.visible?e.style.removeProperty("display"):e.style.display="none":(e.style.cssText="",Object.assign(e.style,this._getDisplayStyle(t.visible),o),Object.keys(o).filter(a=>a.startsWith("--")).forEach(a=>{e.style.setProperty(a,o[a])}))}}_assignRef(e,n){e!=null&&(typeof e=="function"?e(n):e.current=n)}_getDisplayStyle(e){return e?{}:{display:"none"}}_getParent(e){return e.parent===void 0?document.body:typeof e.parent=="function"?e.parent():e.parent}_operateParent(e,n){e&&n(this._getParent(e))}};m.displayName="Portal";let u=m;try{u.displayName="Portal",u.__docgenInfo={description:"",displayName:"Portal",props:{portalContainerRef:{defaultValue:null,description:"",name:"portalContainerRef",required:!1,type:{name:"Ref<HTMLElement>"}},baseElement:{defaultValue:null,description:"Specify the element to listen the click-outside event,\n\nif omitted, use the `document.documentElement`",name:"baseElement",required:!1,type:{name:"HTMLElement"}},parent:{defaultValue:null,description:"Specify the parent element for portal,\n\n* if `null`, render children inline\n* if omitted, use the `document.body`",name:"parent",required:!1,type:{name:"HTMLElement | (() => HTMLElement) | null"}},children:{defaultValue:null,description:"Children in portal",name:"children",required:!1,type:{name:"ReactNode"}},className:{defaultValue:null,description:"Specify portal class name",name:"className",required:!1,type:{name:"string"}},style:{defaultValue:null,description:"Specify portal style",name:"style",required:!1,type:{name:"(CSSProperties & SimpleJSON)"}},visible:{defaultValue:null,description:"The visibility of portal",name:"visible",required:!1,type:{name:"boolean"}},onVisibleChange:{defaultValue:null,description:"Will be call when the visibility needs to be changed",name:"onVisibleChange",required:!1,type:{name:"OnVisibleChangeCallback"}}}}}catch{}const x={title:"Components/Portal",component:u},f=()=>{const l=c.useRef(null),e=c.useRef(null),[n,t]=c.useState(!1),[r,s]=h(!1,"checked"),[o,a]=h(!1,"checked"),[b,k]=h(!1,"checked");return p("div",{children:[i("p",{children:p("label",{children:["renderInline",i("input",{type:"checkbox",checked:r,onChange:s})]})}),i("p",{children:p("label",{children:["closeOnClick",i("input",{type:"checkbox",checked:o,onChange:a})]})}),i("p",{children:p("label",{children:["closeOnOutsideClick",i("input",{type:"checkbox",checked:b,onChange:k})]})}),i("p",{children:i("button",{ref:l,type:"button",onClick:()=>t(!0),children:"Show Portal"})}),i(P,{style:n?{overflow:"hidden"}:{}}),i(u,{parent:r?null:void 0,visible:n,onVisibleChange:(_,{event:d})=>{d!=null&&d.target instanceof HTMLElement&&l.current&&e.current&&(_?t(!0):(o&&e.current.contains(d.target)||b&&!l.current.contains(d.target)&&!e.current.contains(d.target))&&t(!1))},children:i("div",{style:{position:"fixed",top:0,right:0,bottom:0,left:0,background:"#00000050"},children:p("div",{ref:e,style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",minWidth:"300px",minHeight:"300px",background:"#fff"},children:[i("p",{children:"Portal content"}),i("p",{children:i("button",{type:"button",onClick:()=>t(!1),children:"Close Portal"})})]})})})]})};function h(l,e="value"){const[n,t]=c.useState(l),r=c.useCallback(s=>{t(s.target[e])},[e]);return[n,r,t]}var C,y,g;f.parameters={...f.parameters,docs:{...(C=f.parameters)==null?void 0:C.docs,source:{originalSource:`() => {
  const triggerContentRef = useRef<HTMLButtonElement>(null);
  const portalContentRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [renderInline, setRenderInline] = useInputValue(false, 'checked');
  const [closeOnClick, setCloseOnClick] = useInputValue(false, 'checked');
  const [closeOnOutsideClick, setCloseOnOutsideClick] = useInputValue(false, 'checked');
  const onVisibleChange: OnVisibleChangeCallback = (visible, {
    event
  }): void => {
    if (event == null) return;
    if (!(event.target instanceof HTMLElement)) return;
    if (!triggerContentRef.current) return;
    if (!portalContentRef.current) return;
    if (visible) {
      setVisible(true);
    } else if (closeOnClick && portalContentRef.current.contains(event.target) || closeOnOutsideClick && !triggerContentRef.current.contains(event.target) && !portalContentRef.current.contains(event.target)) {
      setVisible(false);
    }
  };
  return <div>
      <p>
        <label>
          renderInline
          <input type="checkbox" checked={renderInline} onChange={setRenderInline} />
        </label>
      </p>
      <p>
        <label>
          closeOnClick
          <input type="checkbox" checked={closeOnClick} onChange={setCloseOnClick} />
        </label>
      </p>
      <p>
        <label>
          closeOnOutsideClick
          <input type="checkbox" checked={closeOnOutsideClick} onChange={setCloseOnOutsideClick} />
        </label>
      </p>
      <p>
        <button ref={triggerContentRef} type="button" onClick={() => setVisible(true)}>
          Show Portal
        </button>
      </p>
      <DocumentElement style={visible ? {
      overflow: 'hidden'
    } : {}} />
      <Portal parent={renderInline ? null : undefined} visible={visible} onVisibleChange={onVisibleChange}>
        <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        background: '#00000050'
      }}>
          <div ref={portalContentRef} style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          minWidth: '300px',
          minHeight: '300px',
          background: '#fff'
        }}>
            <p>Portal content</p>
            <p>
              <button type="button" onClick={() => setVisible(false)}>
                Close Portal
              </button>
            </p>
          </div>
        </div>
      </Portal>
    </div>;
}`,...(g=(y=f.parameters)==null?void 0:y.docs)==null?void 0:g.source}}};const I=["BasicUsage"],w=Object.freeze(Object.defineProperty({__proto__:null,BasicUsage:f,__namedExportsOrder:I,default:x},Symbol.toStringTag,{value:"Module"}));export{f as B,w as P};
//# sourceMappingURL=Portal.stories-9d66cbd5.js.map
