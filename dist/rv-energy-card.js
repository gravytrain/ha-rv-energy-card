/* ha-rv-energy-card — bundled (Lit inlined). Source: src/. Do not edit dist/ by hand. */
var Pt=Object.defineProperty;var Mt=Object.getOwnPropertyDescriptor;var _=(o,t,e,s)=>{for(var i=s>1?void 0:s?Mt(t,e):t,r=o.length-1,n;r>=0;r--)(n=o[r])&&(i=(s?n(t,e,i):n(i))||i);return s&&i&&Pt(t,e,i),i};var Y=globalThis,B=Y.ShadowRoot&&(Y.ShadyCSS===void 0||Y.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Z=Symbol(),pt=new WeakMap,N=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==Z)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(B&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=pt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&pt.set(e,t))}return t}toString(){return this.cssText}},mt=o=>new N(typeof o=="string"?o:o+"",void 0,Z),C=(o,...t)=>{let e=o.length===1?o[0]:t.reduce((s,i,r)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+o[r+1],o[0]);return new N(e,o,Z)},ft=(o,t)=>{if(B)o.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=Y.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,o.appendChild(s)}},Q=B?o=>o:o=>o instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return mt(e)})(o):o;var{is:Ot,defineProperty:Tt,getOwnPropertyDescriptor:Rt,getOwnPropertyNames:Ut,getOwnPropertySymbols:zt,getPrototypeOf:Nt}=Object,V=globalThis,ut=V.trustedTypes,Dt=ut?ut.emptyScript:"",Lt=V.reactiveElementPolyfillSupport,D=(o,t)=>o,L={toAttribute(o,t){switch(t){case Boolean:o=o?Dt:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,t){let e=o;switch(t){case Boolean:e=o!==null;break;case Number:e=o===null?null:Number(o);break;case Object:case Array:try{e=JSON.parse(o)}catch{e=null}}return e}},q=(o,t)=>!Ot(o,t),gt={attribute:!0,type:String,converter:L,reflect:!1,useDefault:!1,hasChanged:q};Symbol.metadata??=Symbol("metadata"),V.litPropertyMetadata??=new WeakMap;var k=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=gt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Tt(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:r}=Rt(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:i,set(n){let d=i?.call(this);r?.call(this,n),this.requestUpdate(t,d,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??gt}static _$Ei(){if(this.hasOwnProperty(D("elementProperties")))return;let t=Nt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(D("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(D("properties"))){let e=this.properties,s=[...Ut(e),...zt(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(Q(i))}else t!==void 0&&e.push(Q(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ft(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let r=(s.converter?.toAttribute!==void 0?s.converter:L).toAttribute(e,s.type);this._$Em=t,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let r=s.getPropertyOptions(i),n=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:L;this._$Em=i;let d=n.fromAttribute(e,r.type);this[i]=d??this._$Ej?.get(i)??d,this._$Em=null}}requestUpdate(t,e,s,i=!1,r){if(t!==void 0){let n=this.constructor;if(i===!1&&(r=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??q)(r,e)||s.useDefault&&s.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:r},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),r!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,r]of s){let{wrapped:n}=r,d=this[i];n!==!0||this._$AL.has(i)||d===void 0||this.C(i,void 0,r,d)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};k.elementStyles=[],k.shadowRootOptions={mode:"open"},k[D("elementProperties")]=new Map,k[D("finalized")]=new Map,Lt?.({ReactiveElement:k}),(V.reactiveElementVersions??=[]).push("2.1.2");var nt=globalThis,_t=o=>o,K=nt.trustedTypes,vt=K?K.createPolicy("lit-html",{createHTML:o=>o}):void 0,kt="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,St="?"+E,Ft=`<${St}>`,O=document,H=()=>O.createComment(""),I=o=>o===null||typeof o!="object"&&typeof o!="function",at=Array.isArray,Ht=o=>at(o)||typeof o?.[Symbol.iterator]=="function",tt=`[ 	
\f\r]`,F=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,xt=/-->/g,bt=/>/g,P=RegExp(`>|${tt}(?:([^\\s"'>=/]+)(${tt}*=${tt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),$t=/'/g,yt=/"/g,At=/^(?:script|style|textarea|title)$/i,lt=o=>(t,...e)=>({_$litType$:o,strings:t,values:e}),g=lt(1),S=lt(2),Zt=lt(3),T=Symbol.for("lit-noChange"),m=Symbol.for("lit-nothing"),wt=new WeakMap,M=O.createTreeWalker(O,129);function Et(o,t){if(!at(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return vt!==void 0?vt.createHTML(t):t}var It=(o,t)=>{let e=o.length-1,s=[],i,r=t===2?"<svg>":t===3?"<math>":"",n=F;for(let d=0;d<e;d++){let a=o[d],c,l,h=-1,f=0;for(;f<a.length&&(n.lastIndex=f,l=n.exec(a),l!==null);)f=n.lastIndex,n===F?l[1]==="!--"?n=xt:l[1]!==void 0?n=bt:l[2]!==void 0?(At.test(l[2])&&(i=RegExp("</"+l[2],"g")),n=P):l[3]!==void 0&&(n=P):n===P?l[0]===">"?(n=i??F,h=-1):l[1]===void 0?h=-2:(h=n.lastIndex-l[2].length,c=l[1],n=l[3]===void 0?P:l[3]==='"'?yt:$t):n===yt||n===$t?n=P:n===xt||n===bt?n=F:(n=P,i=void 0);let p=n===P&&o[d+1].startsWith("/>")?" ":"";r+=n===F?a+Ft:h>=0?(s.push(c),a.slice(0,h)+kt+a.slice(h)+E+p):a+E+(h===-2?d:p)}return[Et(o,r+(o[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},W=class o{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,n=0,d=t.length-1,a=this.parts,[c,l]=It(t,e);if(this.el=o.createElement(c,s),M.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=M.nextNode())!==null&&a.length<d;){if(i.nodeType===1){if(i.hasAttributes())for(let h of i.getAttributeNames())if(h.endsWith(kt)){let f=l[n++],p=i.getAttribute(h).split(E),u=/([.?@])?(.*)/.exec(f);a.push({type:1,index:r,name:u[2],strings:p,ctor:u[1]==="."?st:u[1]==="?"?it:u[1]==="@"?rt:U}),i.removeAttribute(h)}else h.startsWith(E)&&(a.push({type:6,index:r}),i.removeAttribute(h));if(At.test(i.tagName)){let h=i.textContent.split(E),f=h.length-1;if(f>0){i.textContent=K?K.emptyScript:"";for(let p=0;p<f;p++)i.append(h[p],H()),M.nextNode(),a.push({type:2,index:++r});i.append(h[f],H())}}}else if(i.nodeType===8)if(i.data===St)a.push({type:2,index:r});else{let h=-1;for(;(h=i.data.indexOf(E,h+1))!==-1;)a.push({type:7,index:r}),h+=E.length-1}r++}}static createElement(t,e){let s=O.createElement("template");return s.innerHTML=t,s}};function R(o,t,e=o,s){if(t===T)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,r=I(t)?void 0:t._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(o),i._$AT(o,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=R(o,i._$AS(o,t.values),i,s)),t}var et=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??O).importNode(e,!0);M.currentNode=i;let r=M.nextNode(),n=0,d=0,a=s[0];for(;a!==void 0;){if(n===a.index){let c;a.type===2?c=new j(r,r.nextSibling,this,t):a.type===1?c=new a.ctor(r,a.name,a.strings,this,t):a.type===6&&(c=new ot(r,this,t)),this._$AV.push(c),a=s[++d]}n!==a?.index&&(r=M.nextNode(),n++)}return M.currentNode=O,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},j=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=m,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=R(this,t,e),I(t)?t===m||t==null||t===""?(this._$AH!==m&&this._$AR(),this._$AH=m):t!==this._$AH&&t!==T&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ht(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==m&&I(this._$AH)?this._$AA.nextSibling.data=t:this.T(O.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=W.createElement(Et(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let r=new et(i,this),n=r.u(this.options);r.p(e),this.T(n),this._$AH=r}}_$AC(t){let e=wt.get(t.strings);return e===void 0&&wt.set(t.strings,e=new W(t)),e}k(t){at(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let r of t)i===e.length?e.push(s=new o(this.O(H()),this.O(H()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=_t(t).nextSibling;_t(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},U=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=m,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=m}_$AI(t,e=this,s,i){let r=this.strings,n=!1;if(r===void 0)t=R(this,t,e,0),n=!I(t)||t!==this._$AH&&t!==T,n&&(this._$AH=t);else{let d=t,a,c;for(t=r[0],a=0;a<r.length-1;a++)c=R(this,d[s+a],e,a),c===T&&(c=this._$AH[a]),n||=!I(c)||c!==this._$AH[a],c===m?t=m:t!==m&&(t+=(c??"")+r[a+1]),this._$AH[a]=c}n&&!i&&this.j(t)}j(t){t===m?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},st=class extends U{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===m?void 0:t}},it=class extends U{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==m)}},rt=class extends U{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=R(this,t,e,0)??m)===T)return;let s=this._$AH,i=t===m&&s!==m||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==m&&(s===m||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},ot=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){R(this,t)}};var Wt=nt.litHtmlPolyfillSupport;Wt?.(W,j),(nt.litHtmlVersions??=[]).push("3.3.3");var Ct=(o,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let r=e?.renderBefore??null;s._$litPart$=i=new j(t.insertBefore(H(),r),r,void 0,e??{})}return i._$AI(o),i};var ct=globalThis,$=class extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ct(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return T}};$._$litElement$=!0,$.finalized=!0,ct.litElementHydrateSupport?.({LitElement:$});var jt=ct.litElementPolyfillSupport;jt?.({LitElement:$});(ct.litElementVersions??=[]).push("4.2.2");var G=o=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(o,t)}):customElements.define(o,t)};var Yt={attribute:!0,type:String,converter:L,reflect:!1,hasChanged:q},Bt=(o=Yt,t,e)=>{let{kind:s,metadata:i}=e,r=globalThis.litPropertyMetadata.get(i);if(r===void 0&&globalThis.litPropertyMetadata.set(i,r=new Map),s==="setter"&&((o=Object.create(o)).wrapped=!0),r.set(e.name,o),s==="accessor"){let{name:n}=e;return{set(d){let a=t.get.call(this);t.set.call(this,d),this.requestUpdate(n,a,o,!0,d)},init(d){return d!==void 0&&this.C(n,void 0,o,d),d}}}if(s==="setter"){let{name:n}=e;return function(d){let a=this[n];t.call(this,d),this.requestUpdate(n,a,o,!0,d)}}throw Error("Unsupported decorator location: "+s)};function y(o){return(t,e)=>typeof e=="object"?Bt(o,t,e):((s,i,r)=>{let n=i.hasOwnProperty(r);return i.constructor.createProperty(r,s),n?Object.getOwnPropertyDescriptor(i,r):void 0})(o,t,e)}function z(o){return y({...o,state:!0,attribute:!1})}var J=C`
  :host {
    --housing: #14161b;
    --panel: #1c2027;
    --panel-2: #23282f;
    --well: #171a20;
    --bezel: #2c323b;
    --hairline: #333a44;
    --brass: #d9a441;
    --brass-dim: #a67f34;
    --needle: #c8483a;
    --ledger: #9fbf8f;
    --ink: #e7e3d8;
    --ink-dim: #9aa0ab;
    --ink-faint: #6b7280;
    --north: #5b9bd5;
    --south: #6bbf7b;
    --shed: #a681c4;

    --font-display: 'Oswald', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    --font-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;
    --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
`;var x=class extends ${constructor(){super(...arguments);this.value=0;this.digits=5;this.decimals=1;this.mult="";this.unit="kWh";this._positions=[]}willUpdate(e){(e.has("value")||e.has("digits")||e.has("decimals"))&&(this._positions=this._computeDigits())}_computeDigits(){let e=Math.round(this.value*Math.pow(10,this.decimals)),s=Math.max(0,e);return String(s).padStart(this.digits,"0").slice(-this.digits).split("").map(r=>parseInt(r,10)||0)}render(){let e=this.digits-this.decimals;return g`
      <div class="odometer" role="img" aria-label="${this.value} ${this.unit}">
        ${this._positions.map((s,i)=>{let r=i>=e;return g`
            <div class="digit ${r?"dec":""}">
              <div class="strip" style="transform: translateY(-${s*10}%)">
                ${[0,1,2,3,4,5,6,7,8,9].map(n=>g`<div class="cell">${n}</div>`)}
              </div>
            </div>
          `})}
        <span class="unit">${this.unit}</span>
        ${this.mult?g`<span class="mult">${this.mult}</span>`:""}
      </div>
    `}};x.styles=[J,C`
      :host {
        display: inline-block;
      }
      .odometer {
        display: flex;
        flex-wrap: wrap;
        align-items: stretch;
        gap: 3px;
      }
      .digit {
        position: relative;
        /* responsive: shrinks on narrow screens so all digits + unit + mult fit */
        width: clamp(28px, 8.5vw, 40px);
        height: clamp(44px, 13vw, 62px);
        overflow: hidden;
        border: 1px solid #000;
        border-radius: 4px;
        background: linear-gradient(
          180deg,
          #0a0b0e 0%,
          #202329 48%,
          #202329 52%,
          #0a0b0e 100%
        );
        box-shadow: 0 1px 0 #3a414c inset;
      }
      .digit.dec {
        background: linear-gradient(180deg, #3a2a0c, #241c08 52%, #120d04);
      }
      /* the mechanical seam across the middle of the window */
      .digit::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        height: 1px;
        background: rgba(0, 0, 0, 0.6);
        box-shadow: 0 1px 0 rgba(255, 255, 255, 0.04);
        z-index: 2;
        pointer-events: none;
      }
      .strip {
        display: flex;
        flex-direction: column;
        transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        will-change: transform;
      }
      .cell {
        height: clamp(44px, 13vw, 62px);
        display: grid;
        place-items: center;
        font-family: var(--font-mono);
        font-weight: 800;
        font-size: clamp(27px, 8vw, 40px);
        line-height: 1;
        color: var(--ink);
        text-shadow: 0 1px 1px #000;
      }
      .digit.dec .cell {
        color: var(--brass);
      }
      .unit {
        align-self: flex-end;
        font-family: var(--font-display);
        font-size: 15px;
        letter-spacing: 0.1em;
        color: var(--ink-dim);
        margin-left: 8px;
        padding-bottom: 8px;
      }
      .mult {
        align-self: center;
        display: inline-flex;
        align-items: center;
        margin-left: 14px;
        font-family: var(--font-mono);
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.05em;
        color: var(--brass);
        border: 1px solid var(--brass-dim);
        border-radius: 4px;
        padding: 4px 8px;
      }
      @media (prefers-reduced-motion: reduce) {
        .strip {
          transition: none;
        }
      }
    `],_([y({type:Number})],x.prototype,"value",2),_([y({type:Number})],x.prototype,"digits",2),_([y({type:Number})],x.prototype,"decimals",2),_([y({type:String})],x.prototype,"mult",2),_([y({type:String})],x.prototype,"unit",2),_([z()],x.prototype,"_positions",2),x=_([G("meter-register")],x);var Vt="0.6.1",w=[{key:"north",name:"North",color:"var(--north)",power:"sensor.north_site_power",stat:"sensor.refoss_smart_energy_monitor_total_energy_north_site",fallbackPeriod:"sensor.refoss_smart_energy_monitor_north_site_billing_period",today:"sensor.north_site_today_energy"},{key:"south",name:"South",color:"var(--south)",power:"sensor.south_site_power",stat:"sensor.refoss_smart_energy_monitor_south_site_total_energy",fallbackPeriod:"sensor.refoss_smart_energy_monitor_south_site_billing_period",today:"sensor.south_site_today_energy"},{key:"shed",name:"She-Shed",color:"var(--shed)",power:"sensor.em_channel_3_power",stat:"sensor.shed_refoss_smart_energy_monitor_she_shed_total_energy",fallbackPeriod:"sensor.refoss_smart_energy_monitor_she_shed_billing_period",today:"sensor.em_channel_3_today_energy"}],A=class extends ${constructor(){super(...arguments);this._stats={};this._statsAnchor={};this._statsLoaded=!1;this._generateInvoice=()=>{let e=this._config.invoice_script;if(!this.hass||!e)return;let[s,i]=e.split(".");this.hass.callWS({type:"call_service",domain:s,service:i,service_data:{}})};this._updateBilledKwh=e=>{let s=e.target,i=parseFloat(s.value);if(!this.hass||isNaN(i)||i<0)return;let r=this._config.last_bill_kwh_entity;r&&this.hass.callWS({type:"call_service",domain:"input_number",service:"set_value",service_data:{entity_id:r,value:i}})}}setConfig(e){this._config={billing_start_day:12,use_statistics:!0,show_flow:!0,show_billing:!0,total_power_entity:"sensor.total_site_power",grid_status_entity:"sensor.aiken_co_op_outage_status",customers_out_entity:"sensor.aiken_co_op_customers_out",base_rate_entity:"input_number.base_electricity_rate",pca_rate_entity:"input_number.current_pca_rate",meter_multiplier:40,show_last_period:!0,show_invoices:!0,last_bill_kwh_entity:"input_number.last_coop_bill_kwh",portal_url:"https://billing.aikenco-op.org/onlineportal/Customer-Login",bills_url:"https://b3ck.me/drive/d/f/199RztKSB0unwLwGBCGyNOlM6yaSLEYz",invoice_url_base:"http://becknas.becknet:9000/invoices/invoice-",invoice_script:"rest_command.generate_invoice",...e}}updated(e){e.has("hass")&&this.hass&&!this._statsLoaded&&this._config.use_statistics&&(this._statsLoaded=!0,this._loadStatistics(),this._statsTimer=window.setInterval(()=>this._loadStatistics(),6e4))}disconnectedCallback(){super.disconnectedCallback(),this._statsTimer&&clearInterval(this._statsTimer)}_num(e,s=0){if(!e||!this.hass?.states[e])return s;let i=parseFloat(this.hass.states[e].state);return isNaN(i)?s:i}_rate(){return this._num(this._config.base_rate_entity)+this._num(this._config.pca_rate_entity)}_billingWindow(){let e=this._config.billing_start_day??12,s=new Date,i=s.getDate()>=e?new Date(s.getFullYear(),s.getMonth(),e):new Date(s.getFullYear(),s.getMonth()-1,e),r=new Date(i.getFullYear(),i.getMonth()+1,e);return{start:i,end:r}}async _loadStatistics(){if(!this.hass)return;let{start:e,end:s}=this._billingWindow(),i=w.map(r=>r.stat);try{let r=await this.hass.callWS({type:"recorder/statistics_during_period",start_time:e.toISOString(),end_time:s.toISOString(),statistic_ids:i,period:"day",types:["change"]}),n={},d={};for(let a of w){let c=r?.[a.stat];if(Array.isArray(c)&&c.length){let l=c.reduce((h,f)=>h+(f.change||0),0);a.key==="shed"&&l>1e3&&(l=l/1e3),n[a.key]=l,d[a.key]=this._liveCumulative(a)}}this._stats=n,this._statsAnchor=d}catch{this._stats={},this._statsAnchor={}}if(this._config.show_last_period)try{let r=e,n=new Date(e.getFullYear(),e.getMonth()-1,e.getDate()),d=await this.hass.callWS({type:"recorder/statistics_during_period",start_time:n.toISOString(),end_time:r.toISOString(),statistic_ids:i,period:"day",types:["change"]}),a=0;for(let c of w){let l=d?.[c.stat];if(Array.isArray(l)&&l.length){let h=l.reduce((f,p)=>f+(p.change||0),0);c.key==="shed"&&h>1e3&&(h=h/1e3),a+=h}}this._lastPeriodMonitored=a}catch{this._lastPeriodMonitored=void 0}}_liveCumulative(e){let s=this._num(e.stat);return e.key==="shed"&&s>1e3&&(s=s/1e3),s}_periodKwh(e){if(this._config.use_statistics&&this._stats[e.key]!=null){let i=this._stats[e.key],r=this._statsAnchor[e.key];if(r!=null){let n=Math.max(0,this._liveCumulative(e)-r);return i+n}return i}let s=this._num(e.fallbackPeriod);return e.key==="shed"&&s>1e3&&(s=s/1e3),s}_fmtPower(e){return e>=1e3?`${(e/1e3).toFixed(2)} kW`:`${Math.round(e)} W`}_fmtRange(e,s){let i={month:"short",day:"numeric"};return`${e.toLocaleDateString("en-US",i)} \u2192 ${s.toLocaleDateString("en-US",i)}`}render(){if(!this.hass||!this._config)return m;let e=this._rate(),{start:s,end:i}=this._billingWindow(),n=Math.max(1,Math.round((new Date().getTime()-s.getTime())/864e5)),d=Math.round((i.getTime()-s.getTime())/864e5),a=this._num(this._config.total_power_entity),c=w.reduce((v,b)=>v+this._num(b.today),0),l=w.reduce((v,b)=>v+this._periodKwh(b),0),h=l/n*d,f=!!this._config.use_statistics&&Object.keys(this._stats).length>0,p=this._num(this._config.customers_out_entity),u=p===0;return g`
      <div class="wrap">
        <div class="meter">
          <div class="meter-head">
            <div class="brand">
              <div class="glyph">⌁</div>
              <div>
                <h1>RV ENERGY</h1>
                <div class="acct">
                  AIKEN CO-OP · REG ${this._fmtRange(s,i)} · DAY ${n}/${d}
                </div>
              </div>
            </div>
            <div class="head-right">
              ${this._config.portal_url?g`<a
                    class="portal"
                    href="${this._config.portal_url}"
                    target="_blank"
                    rel="noopener noreferrer"
                    >AIKEN PORTAL ↗</a
                  >`:m}
              <div class="status ${u?"":"alert"}">
                <span class="live-dot"></span>${u?"GRID OK":`${p} OUT`}
              </div>
            </div>
          </div>

          <div class="hero">
            <div class="register-block">
              <div class="register-label">Cumulative — this billing period</div>
              <meter-register
                .value=${l}
                .digits=${7}
                .decimals=${3}
                .mult=${`\xD7 MULT ${this._config.meter_multiplier}`}
                unit="kWh"
              ></meter-register>
              <div class="register-sub">
                <b>${this._fmtPower(a)}</b> across all sites now ·
                <b>${c.toFixed(1)} kWh</b> today ·
                projected <b>${h.toFixed(0)} kWh</b>
              </div>
            </div>

            ${this._renderFlow(a)}
          </div>
        </div>

        ${this._config.show_billing?g`
              <div class="sec-head">
                <span class="idx">§</span><h2>This Billing Period</h2>
                <span class="rule"></span>
                <span class="prov ${f?"ok":"est"}">
                  ${f?"AUTHORITATIVE":"LIVE (est.)"}
                </span>
              </div>
              <div class="meter statement">
                <div class="amt">$${(l*e).toFixed(2)}</div>
                <div class="register-sub">
                  ${l.toFixed(0)} kWh · projected ~${h.toFixed(0)} kWh /
                  ~$${(h*e).toFixed(2)} @ $${e.toFixed(4)}/kWh
                </div>
                <table class="tbl">
                  <thead>
                    <tr><th>Meter</th><th>kWh</th><th>Cost</th><th>Today</th></tr>
                  </thead>
                  <tbody>
                    ${w.map(v=>{let b=this._periodKwh(v);return g`
                        <tr>
                          <td>
                            <span class="dot" style="background:${v.color}"></span>${v.name}
                          </td>
                          <td>${b.toFixed(1)}</td>
                          <td>$${(b*e).toFixed(2)}</td>
                          <td class="muted">${this._num(v.today).toFixed(1)}</td>
                        </tr>
                      `})}
                  </tbody>
                </table>
              </div>
            `:m}

        ${this._config.show_last_period?this._renderLastPeriod(e):m}
        ${this._config.show_invoices?this._renderInvoices():m}
      </div>
    `}_renderLastPeriod(e){let{start:s}=this._billingWindow(),i=new Date(s.getFullYear(),s.getMonth()-1,s.getDate()),r=s,n=this._num(this._config.last_bill_kwh_entity),d=this._lastPeriodMonitored??0,a=d>0&&n>0,c=d-n,l=n>0?c/n*100:0,h=Math.abs(l)<=2,f=c>=0?"+":"";return g`
      <div class="sec-head">
        <span class="idx">§</span><h2>Last Billing Period</h2>
        <span class="rule"></span>
        <span class="meta">${this._fmtRange(i,r)}</span>
      </div>
      <div class="meter">
        ${a?g`
              <div class="recon">
                <div class="recon-col">
                  <div class="recon-k">Monitored · actual</div>
                  <div class="recon-v ledger">
                    ${d.toFixed(1)} <small>kWh</small>
                  </div>
                  <div class="recon-k2">$${(d*e).toFixed(2)}</div>
                </div>
                <div class="recon-col">
                  <div class="recon-k">Co-op bill</div>
                  <div class="recon-v">${n.toFixed(1)} <small>kWh</small></div>
                  <div class="recon-k2">$${(n*e).toFixed(2)}</div>
                  <div class="recon-edit">
                    <input
                      type="number"
                      class="bill-input"
                      .value=${n.toString()}
                      @change=${this._updateBilledKwh}
                      min="0"
                      step="0.1"
                      placeholder="Bill kWh"
                    />
                    <span class="edit-hint">edit to update</span>
                  </div>
                </div>
                <div class="recon-col">
                  <div class="recon-k">Variance vs bill</div>
                  <div class="recon-v ${h?"ledger":"alert"}">
                    ${f}${l.toFixed(1)}%
                  </div>
                  <div class="recon-k2">${f}${c.toFixed(1)} kWh</div>
                </div>
              </div>
              <div class="var-note">
                ${h?g`Monitored total matched the co-op bill to
                      <b>within ${Math.abs(l).toFixed(1)}%</b> — gaps backfilled from
                      device statistics.`:g`Monitored total is <b>${f}${l.toFixed(1)}%</b> off the co-op
                      bill — worth a look.`}
              </div>
            `:g`<div class="var-note">
              Set <code>${this._config.last_bill_kwh_entity}</code> to the co-op's billed kWh to
              see the reconciliation.
            </div>`}
      </div>
    `}_renderInvoices(){let e=this._config.invoice_url_base,s=new Date,i=[];for(let r=0;r<4;r++){let n=new Date(s.getFullYear(),s.getMonth()-r,1);i.push({label:n.toLocaleDateString("en-US",{month:"short",year:"numeric"}),ym:`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`})}return g`
      <div class="sec-head">
        <span class="idx">§</span><h2>Invoices</h2>
        <span class="rule"></span>
        <span class="meta">IN-LAWS · NORTH + SHE-SHED</span>
      </div>
      <div class="meter">
        <div class="actions">
          ${this._config.invoice_script?g`<button class="btn primary" @click=${this._generateInvoice}>
                ⎙ Generate invoice
              </button>`:m}
          ${this._config.bills_url?g`<a
                class="btn"
                href="${this._config.bills_url}"
                target="_blank"
                rel="noopener noreferrer"
                >↗ View co-op bills</a
              >`:m}
        </div>
        <div class="invoice-list">
          ${i.map(r=>g`
              <div class="invoice-row">
                <span class="p">${r.label}</span>
                <span class="s">
                  ${e?g`<a href="${e}${r.ym}.pdf" target="_blank" rel="noopener noreferrer"
                        >invoice ↗</a
                      >`:m}
                </span>
              </div>
            `)}
        </div>
      </div>
    `}_renderFlow(e){let s=this._config.max_expected_power||5e3,i=()=>{let n=[40,95,150],d=(c,l)=>{let h=this._num(c.power),f=Math.min(1,Math.max(0,h/s)),p=h<2?0:(5-f*4).toFixed(2),u=`M80 95 C180 95, 210 ${l}, 304 ${l}`;return S`
          <path class="fl-base" d="${u}" stroke="${c.color}" />
          ${p===0?m:S`<path class="fl-flow" d="${u}" stroke="${c.color}" style="animation-duration:${p}s" />`}
        `},a=(c,l)=>{let h=this._num(c.power),f=this._periodKwh(c);return S`
          <circle cx="330" cy="${l}" r="24" fill="none" stroke="${c.color}" stroke-width="2.5" />
          <text x="330" y="${l-2}" text-anchor="middle" class="fl-w">${Math.round(h)}</text>
          <text x="330" y="${l+9}" text-anchor="middle" class="fl-u">W</text>
          <text x="366" y="${l-3}" class="fl-name" fill="${c.color}">${c.name.toUpperCase()}</text>
          <text x="366" y="${l+9}" class="fl-kwh">${f.toFixed(0)} kWh period</text>
        `};return S`
        <svg class="flow flow-h" viewBox="0 0 470 190" preserveAspectRatio="xMidYMid meet">
          ${w.map((c,l)=>d(c,n[l]))}
          <circle cx="52" cy="95" r="26" fill="none" stroke="var(--brass-dim)" stroke-width="2.5" />
          <text x="52" y="92" text-anchor="middle" class="fl-w" style="fill:var(--brass)">${(e/1e3).toFixed(2)}</text>
          <text x="52" y="104" text-anchor="middle" class="fl-u">kW</text>
          <text x="52" y="140" text-anchor="middle" class="fl-name" style="fill:var(--ink-dim)">GRID</text>
          ${w.map((c,l)=>a(c,n[l]))}
        </svg>
      `},r=()=>{let c=[30,95,160],l=100,h=(p,u)=>{let v=this._num(p.power),b=Math.min(1,Math.max(0,v/s)),dt=v<2?0:(5-b*4).toFixed(2),ht=`M95 63 L95 ${l} C95 ${l+20}, ${u} 110, ${u} 122`;return S`
          <path class="fl-base" d="${ht}" stroke="${p.color}" />
          ${dt===0?m:S`<path class="fl-flow" d="${ht}" stroke="${p.color}" style="animation-duration:${dt}s" />`}
        `},f=(p,u)=>{let v=this._num(p.power),b=this._periodKwh(p);return S`
          <circle cx="${u}" cy="${150}" r="22" fill="none" stroke="${p.color}" stroke-width="2.5" />
          <text x="${u}" y="${148}" text-anchor="middle" class="fl-w">${Math.round(v)}</text>
          <text x="${u}" y="${159}" text-anchor="middle" class="fl-u">W</text>
          <text x="${u}" y="${186}" text-anchor="middle" class="fl-name" fill="${p.color}">${p.name.toUpperCase()}</text>
          <text x="${u}" y="${198}" text-anchor="middle" class="fl-kwh">${b.toFixed(0)} kWh</text>
        `};return S`
        <svg class="flow flow-v" viewBox="0 0 190 210" preserveAspectRatio="xMidYMid meet">
          ${w.map((p,u)=>h(p,c[u]))}
          <circle cx="${95}" cy="${35}" r="24" fill="none" stroke="var(--brass-dim)" stroke-width="2.5" />
          <text x="${95}" y="${32}" text-anchor="middle" class="fl-w" style="fill:var(--brass)">${(e/1e3).toFixed(2)}</text>
          <text x="${95}" y="${44}" text-anchor="middle" class="fl-u">kW</text>
          <text x="${95}" y="${77}" text-anchor="middle" class="fl-name" style="fill:var(--ink-dim)">GRID</text>
          ${w.map((p,u)=>f(p,c[u]))}
        </svg>
      `};return g`
      <div class="flow-well">
        <div class="flow-cap">LIVE FLOW · <span>GRID → SITES</span></div>
        ${i()}
        ${r()}
      </div>
    `}getCardSize(){return 8}static getStubConfig(){return{billing_start_day:12,use_statistics:!0}}};A.styles=[J,C`
      :host {
        display: block;
        font-family: var(--font-body);
      }
      .meter {
        background: linear-gradient(180deg, var(--panel) 0%, #191c22 100%);
        border: 1px solid var(--bezel);
        border-radius: 10px;
        box-shadow: 0 1px 0 #3a414c inset, 0 18px 40px -22px #000;
        padding: 22px 24px;
        margin-bottom: 18px;
      }
      .meter-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        flex-wrap: wrap;
        padding-bottom: 16px;
        margin-bottom: 20px;
        border-bottom: 1px solid var(--hairline);
      }
      .brand { min-width: 0; }
      .acct { overflow: hidden; text-overflow: ellipsis; }
      .head-right { display: flex; align-items: center; gap: 10px; }
      .portal {
        display: inline-flex; align-items: center; gap: 6px;
        font-family: var(--font-mono); font-size: 10px; font-weight: 700;
        letter-spacing: 0.06em; color: var(--brass); border: 1px solid var(--brass-dim);
        border-radius: 5px; padding: 6px 10px; text-decoration: none; white-space: nowrap;
      }
      .portal:hover { background: rgba(217, 164, 65, 0.1); }
      .brand { display: flex; align-items: center; gap: 14px; }
      .glyph {
        width: 40px; height: 40px; border-radius: 7px;
        background: radial-gradient(circle at 35% 30%, var(--brass) 0%, var(--brass-dim) 70%, #6f5620 100%);
        display: grid; place-items: center; color: #241c08; font-size: 22px;
        box-shadow: 0 0 0 1px #000 inset, 0 2px 6px -1px #000;
      }
      h1 {
        margin: 0; font-family: var(--font-display); font-weight: 600;
        font-size: 20px; letter-spacing: 0.06em; color: var(--ink); line-height: 1;
      }
      .acct {
        font-family: var(--font-mono); font-size: 11px; color: var(--ink-dim);
        letter-spacing: 0.04em; margin-top: 5px;
      }
      .status {
        display: inline-flex; align-items: center; gap: 7px;
        font-family: var(--font-mono); font-size: 11px; font-weight: 700;
        letter-spacing: 0.08em; padding: 5px 10px; border-radius: 4px;
        color: var(--ledger); border: 1px solid #3d5236; background: rgba(120, 160, 110, 0.08);
      }
      .status.alert {
        color: var(--needle); border-color: #5a2f2a; background: rgba(200, 72, 58, 0.09);
      }
      .live-dot {
        width: 7px; height: 7px; border-radius: 50%; background: currentColor;
        box-shadow: 0 0 0 0 currentColor; animation: live-pulse 2s infinite;
      }
      @keyframes live-pulse {
        0% { box-shadow: 0 0 0 0 rgba(159, 191, 143, 0.5); }
        70% { box-shadow: 0 0 0 6px rgba(159, 191, 143, 0); }
        100% { box-shadow: 0 0 0 0 rgba(159, 191, 143, 0); }
      }
      @media (prefers-reduced-motion: reduce) { .live-dot { animation: none; } }
      .hero {
        display: flex; gap: 20px; align-items: stretch; flex-wrap: wrap;
      }
      .register-block {
        flex: 1; min-width: 330px; display: flex; flex-direction: column; justify-content: center;
      }
      .register-label {
        font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.22em;
        text-transform: uppercase; color: var(--ink-faint); margin-bottom: 8px;
      }
      .register-sub {
        font-family: var(--font-mono); font-size: 12px; color: var(--ink-dim); margin-top: 12px;
      }
      .register-sub b { color: var(--ledger); font-weight: 700; }

      /* integrated live-flow well */
      .flow-well {
        flex: 1.1; min-width: 360px; position: relative;
        background: var(--well, #171a20); border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.35) inset, 0 0 0 1px #000 inset;
        padding: 16px 18px;
      }
      .flow-cap {
        position: absolute; top: 12px; left: 16px;
        font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.2em;
        text-transform: uppercase; color: var(--ink-faint);
      }
      .flow-cap span { color: var(--ledger); }
      svg.flow { width: 100%; margin-top: 8px; }
      svg.flow-h { height: 190px; display: block; }
      svg.flow-v { height: auto; display: none; }
      .fl-base { fill: none; stroke-width: 3; stroke-linecap: round; opacity: 0.28; }
      .fl-flow {
        fill: none; stroke-width: 3.5; stroke-linecap: round;
        stroke-dasharray: 7 12; animation: fl-move 1s linear infinite;
        filter: drop-shadow(0 0 3px currentColor);
      }
      @keyframes fl-move { to { stroke-dashoffset: -38; } }
      @media (prefers-reduced-motion: reduce) { .fl-flow { animation: none; } }
      .fl-w { fill: var(--ink); font-family: var(--font-mono); font-size: 13px; font-weight: 700; }
      .fl-u { fill: var(--ink-dim); font-family: var(--font-mono); font-size: 8px; }
      .fl-name { font-family: var(--font-display); font-size: 12px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; }
      .fl-kwh { fill: var(--ink-dim); font-family: var(--font-mono); font-size: 9px; }
      .sec-head { display: flex; align-items: baseline; gap: 12px; margin: 26px 2px 12px; }
      .sec-head .idx { font-family: var(--font-mono); font-size: 11px; color: var(--brass); font-weight: 700; }
      .sec-head h2 {
        font-family: var(--font-display); font-weight: 500; font-size: 15px;
        letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink); margin: 0;
      }
      .sec-head .rule { flex: 1; height: 1px; background: var(--hairline); }
      .prov {
        font-family: var(--font-mono); font-size: 10px; font-weight: 700; letter-spacing: 0.06em;
        padding: 3px 8px; border-radius: 4px;
      }
      .prov.ok { color: var(--ledger); border: 1px solid #3d5236; }
      .prov.est { color: var(--brass); border: 1px dashed var(--brass-dim); }
      .statement .amt {
        font-family: var(--font-display); font-weight: 700; font-size: 34px;
        color: var(--ledger); line-height: 1.1;
      }
      .tbl { width: 100%; border-collapse: collapse; font-family: var(--font-mono); font-size: 13px; margin-top: 16px; }
      .tbl th {
        text-align: right; font-size: 10px; font-weight: 600; color: var(--ink-faint);
        text-transform: uppercase; letter-spacing: 0.1em; padding: 6px 8px; border-bottom: 1px solid var(--hairline);
      }
      .tbl th:first-child, .tbl td:first-child { text-align: left; }
      .tbl td { text-align: right; padding: 10px 8px; border-bottom: 1px solid var(--hairline); color: var(--ink); }
      .tbl tr:last-child td { border-bottom: none; }
      .tbl .muted { color: var(--ink-dim); }
      .dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 8px; vertical-align: middle; }

      /* Last-period reconciliation */
      .recon { display: flex; gap: 16px; flex-wrap: wrap; }
      .recon-col { flex: 1; min-width: 140px; }
      .recon-k {
        font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.14em;
        text-transform: uppercase; color: var(--ink-faint); margin-bottom: 6px;
      }
      .recon-v { font-family: var(--font-display); font-size: 26px; font-weight: 600; color: var(--ink); }
      .recon-v small { font-family: var(--font-mono); font-size: 12px; color: var(--ink-dim); font-weight: 400; }
      .recon-v.ledger { color: var(--ledger); }
      .recon-v.alert { color: var(--needle); }
      .recon-k2 { font-family: var(--font-mono); font-size: 12px; color: var(--ink-dim); margin-top: 4px; }
      .recon-edit { margin-top: 8px; }
      .bill-input {
        width: 100%; max-width: 120px; padding: 6px 8px; font-family: var(--font-mono);
        font-size: 12px; color: var(--ink); background: var(--well); border: 1px solid var(--hairline);
        border-radius: 4px;
      }
      .bill-input:focus { outline: none; border-color: var(--brass-dim); }
      .edit-hint { font-family: var(--font-mono); font-size: 9px; color: var(--ink-faint); margin-left: 6px; }
      .var-note { font-family: var(--font-mono); font-size: 11px; color: var(--ink-dim); margin-top: 16px; line-height: 1.6; }
      .var-note b { color: var(--ledger); font-weight: 700; }
      .var-note code { color: var(--brass); font-size: 11px; }

      /* Invoice actions + list */
      .actions { display: flex; gap: 10px; flex-wrap: wrap; }
      .btn {
        display: inline-flex; align-items: center; gap: 8px;
        font-family: var(--font-mono); font-size: 12px; font-weight: 700; letter-spacing: 0.04em;
        padding: 10px 14px; border-radius: 6px; cursor: pointer; text-decoration: none;
        border: 1px solid var(--hairline); color: var(--ink); background: rgba(255, 255, 255, 0.02);
      }
      .btn:hover { border-color: var(--brass-dim); }
      .btn.primary {
        color: #241c08; background: linear-gradient(180deg, var(--brass), var(--brass-dim));
        border-color: var(--brass-dim);
      }
      .invoice-list { margin-top: 14px; font-family: var(--font-mono); font-size: 12px; }
      .invoice-row {
        display: flex; justify-content: space-between; align-items: center;
        padding: 9px 4px; border-bottom: 1px solid rgba(49, 56, 66, 0.5);
      }
      .invoice-row:last-child { border-bottom: none; }
      .invoice-row .p { color: var(--ink); }
      .invoice-row a { color: var(--brass); text-decoration: none; font-weight: 700; }

      @media (max-width: 760px) {
        .hero { flex-direction: column; align-items: stretch; }
        .head-right { width: 100%; justify-content: space-between; }
      }
      @media (max-width: 480px) {
        .register-sub { font-size: 11px; word-wrap: break-word; overflow-wrap: break-word; }
        .flow-well { padding: 12px; min-width: 0; }
        svg.flow-h { display: none; }
        svg.flow-v { display: block; }
      }
    `],_([y({attribute:!1})],A.prototype,"hass",2),_([z()],A.prototype,"_config",2),_([z()],A.prototype,"_stats",2),_([z()],A.prototype,"_lastPeriodMonitored",2),A=_([G("rv-energy-card")],A);window.customCards||=[];window.customCards.push({type:"rv-energy-card",name:"RV Energy",description:"Meter-register site power & billing overview (gap-proof statistics)",preview:!0});console.info(`%c RV-ENERGY-CARD %c v${Vt} `,"background:#d9a441;color:#241c08;font-weight:700;","background:#14161b;color:#d9a441;");export{A as RvEnergyCard};
