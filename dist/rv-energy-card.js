/* ha-rv-energy-card — bundled (Lit inlined). Source: src/. Do not edit dist/ by hand. */
var Pt=Object.defineProperty;var Mt=Object.getOwnPropertyDescriptor;var _=(n,t,e,i)=>{for(var s=i>1?void 0:i?Mt(t,e):t,r=n.length-1,o;r>=0;r--)(o=n[r])&&(s=(i?o(t,e,s):o(s))||s);return i&&s&&Pt(t,e,s),s};var B=globalThis,G=B.ShadowRoot&&(B.ShadyCSS===void 0||B.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,tt=Symbol(),ht=new WeakMap,I=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==tt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(G&&t===void 0){let i=e!==void 0&&e.length===1;i&&(t=ht.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&ht.set(e,t))}return t}toString(){return this.cssText}},ut=n=>new I(typeof n=="string"?n:n+"",void 0,tt),M=(n,...t)=>{let e=n.length===1?n[0]:t.reduce((i,s,r)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+n[r+1],n[0]);return new I(e,n,tt)},mt=(n,t)=>{if(G)n.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let i=document.createElement("style"),s=B.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,n.appendChild(i)}},et=G?n=>n:n=>n instanceof CSSStyleSheet?(t=>{let e="";for(let i of t.cssRules)e+=i.cssText;return ut(e)})(n):n;var{is:Tt,defineProperty:Nt,getOwnPropertyDescriptor:Ot,getOwnPropertyNames:Rt,getOwnPropertySymbols:Ut,getPrototypeOf:Dt}=Object,q=globalThis,ft=q.trustedTypes,zt=ft?ft.emptyScript:"",It=q.reactiveElementPolyfillSupport,L=(n,t)=>n,F={toAttribute(n,t){switch(t){case Boolean:n=n?zt:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,t){let e=n;switch(t){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},K=(n,t)=>!Tt(n,t),gt={attribute:!0,type:String,converter:F,reflect:!1,useDefault:!1,hasChanged:K};Symbol.metadata??=Symbol("metadata"),q.litPropertyMetadata??=new WeakMap;var E=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=gt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&Nt(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){let{get:s,set:r}=Ot(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){let c=s?.call(this);r?.call(this,o),this.requestUpdate(t,c,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??gt}static _$Ei(){if(this.hasOwnProperty(L("elementProperties")))return;let t=Dt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(L("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(L("properties"))){let e=this.properties,i=[...Rt(e),...Ut(e)];for(let s of i)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[e,i]of this.elementProperties){let s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let s of i)e.unshift(et(s))}else t!==void 0&&e.push(et(t));return e}static _$Eu(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return mt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){let i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(s!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:F).toAttribute(e,i.type);this._$Em=t,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){let i=this.constructor,s=i._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let r=i.getPropertyOptions(s),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:F;this._$Em=s;let c=o.fromAttribute(e,r.type);this[s]=c??this._$Ej?.get(s)??c,this._$Em=null}}requestUpdate(t,e,i,s=!1,r){if(t!==void 0){let o=this.constructor;if(s===!1&&(r=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??K)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),r!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,r]of this._$Ep)this[s]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,r]of i){let{wrapped:o}=r,c=this[s];o!==!0||this._$AL.has(s)||c===void 0||this.C(s,void 0,r,c)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};E.elementStyles=[],E.shadowRootOptions={mode:"open"},E[L("elementProperties")]=new Map,E[L("finalized")]=new Map,It?.({ReactiveElement:E}),(q.reactiveElementVersions??=[]).push("2.1.2");var lt=globalThis,_t=n=>n,X=lt.trustedTypes,vt=X?X.createPolicy("lit-html",{createHTML:n=>n}):void 0,kt="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,St="?"+P,Lt=`<${St}>`,O=document,W=()=>O.createComment(""),j=n=>n===null||typeof n!="object"&&typeof n!="function",dt=Array.isArray,Ft=n=>dt(n)||typeof n?.[Symbol.iterator]=="function",it=`[ 	
\f\r]`,H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,xt=/-->/g,bt=/>/g,T=RegExp(`>|${it}(?:([^\\s"'>=/]+)(${it}*=${it}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),yt=/'/g,$t=/"/g,At=/^(?:script|style|textarea|title)$/i,ct=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),m=ct(1),C=ct(2),Zt=ct(3),R=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),wt=new WeakMap,N=O.createTreeWalker(O,129);function Et(n,t){if(!dt(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return vt!==void 0?vt.createHTML(t):t}var Ht=(n,t)=>{let e=n.length-1,i=[],s,r=t===2?"<svg>":t===3?"<math>":"",o=H;for(let c=0;c<e;c++){let a=n[c],l,d,p=-1,g=0;for(;g<a.length&&(o.lastIndex=g,d=o.exec(a),d!==null);)g=o.lastIndex,o===H?d[1]==="!--"?o=xt:d[1]!==void 0?o=bt:d[2]!==void 0?(At.test(d[2])&&(s=RegExp("</"+d[2],"g")),o=T):d[3]!==void 0&&(o=T):o===T?d[0]===">"?(o=s??H,p=-1):d[1]===void 0?p=-2:(p=o.lastIndex-d[2].length,l=d[1],o=d[3]===void 0?T:d[3]==='"'?$t:yt):o===$t||o===yt?o=T:o===xt||o===bt?o=H:(o=T,s=void 0);let u=o===T&&n[c+1].startsWith("/>")?" ":"";r+=o===H?a+Lt:p>=0?(i.push(l),a.slice(0,p)+kt+a.slice(p)+P+u):a+P+(p===-2?c:u)}return[Et(n,r+(n[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},Y=class n{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,o=0,c=t.length-1,a=this.parts,[l,d]=Ht(t,e);if(this.el=n.createElement(l,i),N.currentNode=this.el.content,e===2||e===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(s=N.nextNode())!==null&&a.length<c;){if(s.nodeType===1){if(s.hasAttributes())for(let p of s.getAttributeNames())if(p.endsWith(kt)){let g=d[o++],u=s.getAttribute(p).split(P),f=/([.?@])?(.*)/.exec(g);a.push({type:1,index:r,name:f[2],strings:u,ctor:f[1]==="."?rt:f[1]==="?"?ot:f[1]==="@"?nt:z}),s.removeAttribute(p)}else p.startsWith(P)&&(a.push({type:6,index:r}),s.removeAttribute(p));if(At.test(s.tagName)){let p=s.textContent.split(P),g=p.length-1;if(g>0){s.textContent=X?X.emptyScript:"";for(let u=0;u<g;u++)s.append(p[u],W()),N.nextNode(),a.push({type:2,index:++r});s.append(p[g],W())}}}else if(s.nodeType===8)if(s.data===St)a.push({type:2,index:r});else{let p=-1;for(;(p=s.data.indexOf(P,p+1))!==-1;)a.push({type:7,index:r}),p+=P.length-1}r++}}static createElement(t,e){let i=O.createElement("template");return i.innerHTML=t,i}};function D(n,t,e=n,i){if(t===R)return t;let s=i!==void 0?e._$Co?.[i]:e._$Cl,r=j(t)?void 0:t._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),r===void 0?s=void 0:(s=new r(n),s._$AT(n,e,i)),i!==void 0?(e._$Co??=[])[i]=s:e._$Cl=s),s!==void 0&&(t=D(n,s._$AS(n,t.values),s,i)),t}var st=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??O).importNode(e,!0);N.currentNode=s;let r=N.nextNode(),o=0,c=0,a=i[0];for(;a!==void 0;){if(o===a.index){let l;a.type===2?l=new V(r,r.nextSibling,this,t):a.type===1?l=new a.ctor(r,a.name,a.strings,this,t):a.type===6&&(l=new at(r,this,t)),this._$AV.push(l),a=i[++c]}o!==a?.index&&(r=N.nextNode(),o++)}return N.currentNode=O,s}p(t){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},V=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=D(this,t,e),j(t)?t===h||t==null||t===""?(this._$AH!==h&&this._$AR(),this._$AH=h):t!==this._$AH&&t!==R&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ft(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==h&&j(this._$AH)?this._$AA.nextSibling.data=t:this.T(O.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:i}=t,s=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=Y.createElement(Et(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{let r=new st(s,this),o=r.u(this.options);r.p(e),this.T(o),this._$AH=r}}_$AC(t){let e=wt.get(t.strings);return e===void 0&&wt.set(t.strings,e=new Y(t)),e}k(t){dt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,s=0;for(let r of t)s===e.length?e.push(i=new n(this.O(W()),this.O(W()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let i=_t(t).nextSibling;_t(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},z=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=h,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=h}_$AI(t,e=this,i,s){let r=this.strings,o=!1;if(r===void 0)t=D(this,t,e,0),o=!j(t)||t!==this._$AH&&t!==R,o&&(this._$AH=t);else{let c=t,a,l;for(t=r[0],a=0;a<r.length-1;a++)l=D(this,c[i+a],e,a),l===R&&(l=this._$AH[a]),o||=!j(l)||l!==this._$AH[a],l===h?t=h:t!==h&&(t+=(l??"")+r[a+1]),this._$AH[a]=l}o&&!s&&this.j(t)}j(t){t===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},rt=class extends z{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===h?void 0:t}},ot=class extends z{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==h)}},nt=class extends z{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=D(this,t,e,0)??h)===R)return;let i=this._$AH,s=t===h&&i!==h||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==h&&(i===h||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},at=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){D(this,t)}};var Wt=lt.litHtmlPolyfillSupport;Wt?.(Y,V),(lt.litHtmlVersions??=[]).push("3.3.3");var Ct=(n,t,e)=>{let i=e?.renderBefore??t,s=i._$litPart$;if(s===void 0){let r=e?.renderBefore??null;i._$litPart$=s=new V(t.insertBefore(W(),r),r,void 0,e??{})}return s._$AI(n),s};var pt=globalThis,y=class extends E{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ct(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return R}};y._$litElement$=!0,y.finalized=!0,pt.litElementHydrateSupport?.({LitElement:y});var jt=pt.litElementPolyfillSupport;jt?.({LitElement:y});(pt.litElementVersions??=[]).push("4.2.2");var J=n=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(n,t)}):customElements.define(n,t)};var Yt={attribute:!0,type:String,converter:F,reflect:!1,hasChanged:K},Vt=(n=Yt,t,e)=>{let{kind:i,metadata:s}=e,r=globalThis.litPropertyMetadata.get(s);if(r===void 0&&globalThis.litPropertyMetadata.set(s,r=new Map),i==="setter"&&((n=Object.create(n)).wrapped=!0),r.set(e.name,n),i==="accessor"){let{name:o}=e;return{set(c){let a=t.get.call(this);t.set.call(this,c),this.requestUpdate(o,a,n,!0,c)},init(c){return c!==void 0&&this.C(o,void 0,n,c),c}}}if(i==="setter"){let{name:o}=e;return function(c){let a=this[o];t.call(this,c),this.requestUpdate(o,a,n,!0,c)}}throw Error("Unsupported decorator location: "+i)};function $(n){return(t,e)=>typeof e=="object"?Vt(n,t,e):((i,s,r)=>{let o=s.hasOwnProperty(r);return s.constructor.createProperty(r,i),o?Object.getOwnPropertyDescriptor(s,r):void 0})(n,t,e)}function U(n){return $({...n,state:!0,attribute:!1})}var Q=M`
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
`;var v=class extends y{constructor(){super(...arguments);this.value=0;this.digits=5;this.decimals=1;this.mult="";this.unit="kWh";this._positions=[]}willUpdate(e){(e.has("value")||e.has("digits")||e.has("decimals"))&&(this._positions=this._computeDigits())}_computeDigits(){let e=Math.round(this.value*Math.pow(10,this.decimals)),i=Math.max(0,e);return String(i).padStart(this.digits,"0").slice(-this.digits).split("").map(r=>parseInt(r,10)||0)}render(){let e=this.digits-this.decimals;return m`
      <div class="odometer" role="img" aria-label="${this.value} ${this.unit}">
        ${this._positions.map((i,s)=>{let r=s>=e;return m`
            <div class="digit ${r?"dec":""}">
              <div class="strip" style="transform: translateY(-${i*10}%)">
                ${[0,1,2,3,4,5,6,7,8,9].map(o=>m`<div class="cell">${o}</div>`)}
              </div>
            </div>
          `})}
        <span class="unit">${this.unit}</span>
        ${this.mult?m`<span class="mult">${this.mult}</span>`:""}
      </div>
    `}};v.styles=[Q,M`
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
    `],_([$({type:Number})],v.prototype,"value",2),_([$({type:Number})],v.prototype,"digits",2),_([$({type:Number})],v.prototype,"decimals",2),_([$({type:String})],v.prototype,"mult",2),_([$({type:String})],v.prototype,"unit",2),_([U()],v.prototype,"_positions",2),v=_([J("meter-register")],v);var Bt="0.7.0",w=[{key:"north",name:"North",color:"var(--north)",power:"sensor.north_site_power",stat:"sensor.refoss_smart_energy_monitor_total_energy_north_site",fallbackPeriod:"sensor.refoss_smart_energy_monitor_north_site_billing_period",today:"sensor.north_site_today_energy"},{key:"south",name:"South",color:"var(--south)",power:"sensor.south_site_power",stat:"sensor.refoss_smart_energy_monitor_south_site_total_energy",fallbackPeriod:"sensor.refoss_smart_energy_monitor_south_site_billing_period",today:"sensor.south_site_today_energy"},{key:"shed",name:"She-Shed",color:"var(--shed)",power:"sensor.em_channel_3_power",stat:"sensor.shed_refoss_smart_energy_monitor_she_shed_total_energy",fallbackPeriod:"sensor.refoss_smart_energy_monitor_she_shed_billing_period",today:"sensor.em_channel_3_today_energy"}],k=class extends y{constructor(){super(...arguments);this._stats={};this._gridExpanded=!1;this._statsAnchor={};this._statsLoaded=!1;this._toggleGridStatus=()=>{this._gridExpanded=!this._gridExpanded};this._generateInvoice=()=>{let e=this._config.invoice_script;if(!this.hass||!e)return;let[i,s]=e.split(".");this.hass.callWS({type:"call_service",domain:i,service:s,service_data:{}})};this._updateBilledKwh=e=>{let i=e.target,s=parseFloat(i.value);if(!this.hass||isNaN(s)||s<0)return;let r=this._config.last_bill_kwh_entity;r&&this.hass.callWS({type:"call_service",domain:"input_number",service:"set_value",service_data:{entity_id:r,value:s}})}}setConfig(e){this._config={billing_start_day:12,use_statistics:!0,show_flow:!0,show_billing:!0,total_power_entity:"sensor.total_site_power",grid_status_entity:"sensor.aiken_co_op_outage_status",customers_out_entity:"sensor.aiken_co_op_customers_out",show_grid_status:!0,grid_metrics:[{entity:"sensor.aiken_co_op_customers_affected",name:"Affected"},{entity:"sensor.aiken_co_op_customers_restored",name:"Restored"},{entity:"sensor.aiken_co_op_planned_outages",name:"Planned"}],grid_map_url:"https://map.aikenco-op.org/",grid_map_link:"https://map.aikenco-op.org/",base_rate_entity:"input_number.base_electricity_rate",pca_rate_entity:"input_number.current_pca_rate",meter_multiplier:40,show_last_period:!0,show_invoices:!0,last_bill_kwh_entity:"input_number.last_coop_bill_kwh",last_bill_energy_entity:"input_number.last_coop_bill_energy_charge",last_bill_local_tax_entity:"input_number.last_coop_bill_local_tax",last_bill_sc_tax_entity:"input_number.last_coop_bill_sc_tax",invoice_script:"script.generate_monthly_invoice",...e}}updated(e){e.has("hass")&&this.hass&&!this._statsLoaded&&this._config.use_statistics&&(this._statsLoaded=!0,this._loadStatistics(),this._statsTimer=window.setInterval(()=>this._loadStatistics(),6e4))}disconnectedCallback(){super.disconnectedCallback(),this._statsTimer&&clearInterval(this._statsTimer)}_num(e,i=0){if(!e||!this.hass?.states[e])return i;let s=parseFloat(this.hass.states[e].state);return isNaN(s)?i:s}_rate(){return this._num(this._config.base_rate_entity)+this._num(this._config.pca_rate_entity)}_billingWindow(){let e=this._config.billing_start_day??12,i=new Date,s=i.getDate()>=e?new Date(i.getFullYear(),i.getMonth(),e):new Date(i.getFullYear(),i.getMonth()-1,e),r=new Date(s.getFullYear(),s.getMonth()+1,e);return{start:s,end:r}}async _loadStatistics(){if(!this.hass)return;let{start:e,end:i}=this._billingWindow(),s=w.map(r=>r.stat);try{let r=await this.hass.callWS({type:"recorder/statistics_during_period",start_time:e.toISOString(),end_time:i.toISOString(),statistic_ids:s,period:"day",types:["change"]}),o={},c={};for(let a of w){let l=r?.[a.stat];if(Array.isArray(l)&&l.length){let d=l.reduce((p,g)=>p+(g.change||0),0);a.key==="shed"&&d>1e3&&(d=d/1e3),o[a.key]=d,c[a.key]=this._liveCumulative(a)}}this._stats=o,this._statsAnchor=c}catch{this._stats={},this._statsAnchor={}}if(this._config.show_last_period)try{let r=e,o=new Date(e.getFullYear(),e.getMonth()-1,e.getDate()),c=await this.hass.callWS({type:"recorder/statistics_during_period",start_time:o.toISOString(),end_time:r.toISOString(),statistic_ids:s,period:"day",types:["change"]}),a=0;for(let l of w){let d=c?.[l.stat];if(Array.isArray(d)&&d.length){let p=d.reduce((g,u)=>g+(u.change||0),0);l.key==="shed"&&p>1e3&&(p=p/1e3),a+=p}}this._lastPeriodMonitored=a}catch{this._lastPeriodMonitored=void 0}}_liveCumulative(e){let i=this._num(e.stat);return e.key==="shed"&&i>1e3&&(i=i/1e3),i}_periodKwh(e){if(this._config.use_statistics&&this._stats[e.key]!=null){let s=this._stats[e.key],r=this._statsAnchor[e.key];if(r!=null){let o=Math.max(0,this._liveCumulative(e)-r);return s+o}return s}let i=this._num(e.fallbackPeriod);return e.key==="shed"&&i>1e3&&(i=i/1e3),i}_fmtPower(e){return e>=1e3?`${(e/1e3).toFixed(2)} kW`:`${Math.round(e)} W`}_fmtRange(e,i){let s={month:"short",day:"numeric"};return`${e.toLocaleDateString("en-US",s)} \u2192 ${i.toLocaleDateString("en-US",s)}`}_gridStatus(){let e=this.hass?.states[this._config.grid_status_entity??""]?.state;return!e||e==="unknown"||e==="unavailable"?"STATUS UNKNOWN":e.replace(/[_-]/g," ").toUpperCase()}_lastUpdated(e){let i=e?this.hass?.states[e]?.last_updated:void 0;if(!i)return"\u2014";let s=new Date(i);return Number.isNaN(s.getTime())?"\u2014":s.toLocaleString("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}_hasGridIssue(e){let i=this.hass?.states[this._config.grid_status_entity??""]?.state?.toLowerCase();return e>0||i==="unknown"||i==="unavailable"}_hasMeaningfulValue(e){let i=e.trim().toLowerCase();if(["","0","off","false","none","no","unknown","unavailable"].includes(i))return!1;let s=Number(i);return Number.isNaN(s)||s!==0}_gridMetrics(e){return(this._config.grid_metrics??[]).filter(i=>{let s=i?.entity?this.hass?.states[i.entity]:void 0;if(!s)return!1;let r=i.show_when??"issue";return r==="always"||r==="issue"&&e||r==="nonzero"&&this._hasMeaningfulValue(s.state)})}_outages(){let e=this.hass?.states["sensor.aiken_co_op_outage_details"]?.attributes.outages;return Array.isArray(e)?e.filter(i=>!!i&&typeof i=="object"):[]}_outageCounties(){let e=this.hass?.states["sensor.aiken_co_op_county_status"]?.attributes.counties;return Array.isArray(e)?e.filter(i=>!!i&&typeof i=="object"&&Number(i.customersOutNow)>0):[]}_fmtIncidentTime(e){if(!e)return"\u2014";let i=new Date(e);return Number.isNaN(i.getTime())?"\u2014":i.toLocaleString("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}_renderGridStatus(e,i){let s=this._hasGridIssue(i),r=this._gridMetrics(s||this._gridExpanded),o=this._outages(),c=this._outageCounties();return!s&&!this._gridExpanded?h:m`
      <div class="grid-status ${s?"alert":""}" aria-label="Grid service status">
        <div class="grid-status-head">
          <div class="grid-cap">GRID SERVICE · AIKEN CO-OP</div>
          <div class="grid-state ${e?"ok":"alert"}">
            <span class="live-dot"></span>${e?"SERVICE NORMAL":"OUTAGE REPORTED"}
          </div>
          <div class="grid-updated">UPDATED ${this._lastUpdated(this._config.grid_status_entity)}</div>
        </div>
        ${(s||this._gridExpanded)&&this._config.grid_map_url?m`<div class="grid-map">
              <iframe src="${this._config.grid_map_url}" title="Aiken Co-op live outage map" loading="lazy"></iframe>
              <a href="${this._config.grid_map_link??this._config.grid_map_url}" target="_blank" rel="noopener noreferrer">Open live map ↗</a>
            </div>`:h}
        <div class="grid-readings">
          <div class="grid-reading">
            <span class="grid-reading-k">Co-op status</span>
            <b>${this._gridStatus()}</b>
          </div>
          <div class="grid-reading ${e?"":"alert"}">
            <span class="grid-reading-k">Customers out</span>
            <b>${i.toLocaleString()}</b>
          </div>
          ${r.map(a=>{let l=this.hass.states[a.entity],d=a.name??l.attributes.friendly_name??a.entity,p=a.unit??l.attributes.unit_of_measurement??"";return m`
              <div class="grid-reading">
                <span class="grid-reading-k">${d}</span>
                <b>${l.state}${p?m` <small>${p}</small>`:h}</b>
              </div>
            `})}
        </div>
        ${s&&(o.length||c.length)?m`<div class="grid-incidents">
              ${o.map(a=>m`
                <div class="incident">
                  <b>${a.outageName??"ACTIVE OUTAGE"}</b>
                  <span>${Number(a.customersOutNow??0).toLocaleString()} out</span>
                  <span>${a.crewAssigned?"crew assigned":"awaiting crew"}</span>
                  <span>since ${this._fmtIncidentTime(a.outageStartTime)}</span>
                  <span>ETR ${a.estimatedTimeOfRestoral??"TBD"}</span>
                  ${a.cause?m`<span>${a.cause}</span>`:h}
                </div>
              `)}
              ${c.length?m`<div class="county-alerts">
                ${c.map(a=>m`<span>${a.name}: <b>${Number(a.customersOutNow).toLocaleString()}</b> / ${Number(a.customersServed??0).toLocaleString()}</span>`)}
              </div>`:h}
            </div>`:h}
      </div>
    `}render(){if(!this.hass||!this._config)return h;let e=this._rate(),{start:i,end:s}=this._billingWindow(),o=Math.max(1,Math.round((new Date().getTime()-i.getTime())/864e5)),c=Math.round((s.getTime()-i.getTime())/864e5),a=this._num(this._config.total_power_entity),l=w.reduce((b,A)=>b+this._num(A.today),0),d=w.reduce((b,A)=>b+this._periodKwh(A),0),p=d/o*c,g=!!this._config.use_statistics&&Object.keys(this._stats).length>0,u=this._num(this._config.customers_out_entity),f=this._hasGridIssue(u),x=!f,S=u>0?`${u} OUT`:x?"GRID OK":"GRID STATUS ?";return m`
      <div class="wrap">
        <div class="meter">
          <div class="meter-head">
            <div class="brand">
              <div class="glyph">⌁</div>
              <div>
                <h1>RV ENERGY</h1>
                <div class="acct">
                  AIKEN CO-OP · REG ${this._fmtRange(i,s)} · DAY ${o}/${c}
                </div>
              </div>
            </div>
            <div class="head-right">
              ${this._config.portal_url?m`<a
                    class="portal"
                    href="${this._config.portal_url}"
                    target="_blank"
                    rel="noopener noreferrer"
                    >AIKEN PORTAL ↗</a
                  >`:h}
              <button
                class="status ${x?"":"alert"}"
                type="button"
                @click=${this._toggleGridStatus}
                aria-expanded="${this._gridExpanded||f}"
                aria-controls="grid-service-details"
                title="${f?"Grid service details":"Open grid service details"}"
              >
                <span class="live-dot"></span>${S}
              </button>
            </div>
          </div>

          <div class="hero">
            <div class="register-block">
              <div class="register-label">Cumulative — this billing period</div>
              <meter-register
                .value=${d}
                .digits=${7}
                .decimals=${3}
                .mult=${`\xD7 MULT ${this._config.meter_multiplier}`}
                unit="kWh"
              ></meter-register>
              <div class="register-sub">
                <b>${this._fmtPower(a)}</b> across all sites now ·
                <b>${l.toFixed(1)} kWh</b> today ·
                projected <b>${p.toFixed(0)} kWh</b>
              </div>
            </div>

            ${this._config.show_flow?this._renderFlow(a):h}
          </div>
          ${this._config.show_grid_status?m`<div id="grid-service-details">${this._renderGridStatus(x,u)}</div>`:h}
        </div>

        ${this._config.show_billing?m`
              <div class="sec-head">
                <span class="idx">§</span><h2>This Billing Period</h2>
                <span class="rule"></span>
                <span class="prov ${g?"ok":"est"}">
                  ${g?"AUTHORITATIVE":"LIVE (est.)"}
                </span>
              </div>
              <div class="meter statement">
                <div class="amt">$${(d*e).toFixed(2)}</div>
                <div class="register-sub">
                  ${d.toFixed(0)} kWh · projected ~${p.toFixed(0)} kWh /
                  ~$${(p*e).toFixed(2)} @ $${e.toFixed(4)}/kWh
                </div>
                <table class="tbl">
                  <thead>
                    <tr><th>Meter</th><th>kWh</th><th>Cost</th><th>Today</th></tr>
                  </thead>
                  <tbody>
                    ${w.map(b=>{let A=this._periodKwh(b);return m`
                        <tr>
                          <td>
                            <span class="dot" style="background:${b.color}"></span>${b.name}
                          </td>
                          <td>${A.toFixed(1)}</td>
                          <td>$${(A*e).toFixed(2)}</td>
                          <td class="muted">${this._num(b.today).toFixed(1)}</td>
                        </tr>
                      `})}
                  </tbody>
                </table>
              </div>
            `:h}

        ${this._config.show_last_period?this._renderLastPeriod(e):h}
        ${this._config.show_invoices?this._renderInvoices():h}
      </div>
    `}_renderLastPeriod(e){let{start:i}=this._billingWindow(),s=new Date(i.getFullYear(),i.getMonth()-1,i.getDate()),r=i,o=this._num(this._config.last_bill_kwh_entity),c=this._num(this._config.last_bill_energy_entity),a=this._num(this._config.last_bill_local_tax_entity),l=this._num(this._config.last_bill_sc_tax_entity),d=c+a+l,p=this._lastPeriodMonitored??0,g=p>0&&o>0,u=p-o,f=o>0?u/o*100:0,x=Math.abs(f)<=2,S=u>=0?"+":"";return m`
      <div class="sec-head">
        <span class="idx">§</span><h2>Last Billing Period</h2>
        <span class="rule"></span>
        <span class="meta">${this._fmtRange(s,r)}</span>
      </div>
      <div class="meter">
        ${g?m`
              <div class="recon">
                <div class="recon-col">
                  <div class="recon-k">Monitored · actual</div>
                  <div class="recon-v ledger">
                    ${p.toFixed(1)} <small>kWh</small>
                  </div>
                  <div class="recon-k2">device statistics</div>
                </div>
                <div class="recon-col">
                  <div class="recon-k">Co-op bill</div>
                  <div class="recon-v">${o.toFixed(1)} <small>kWh</small></div>
                  <div class="recon-k2">
                    ${d>0?m`$${d.toFixed(2)}`:h}
                  </div>
                  <div class="recon-edit">
                    <input
                      type="number"
                      class="bill-input"
                      .value=${o.toString()}
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
                  <div class="recon-v ${x?"ledger":"alert"}">
                    ${S}${f.toFixed(1)}%
                  </div>
                  <div class="recon-k2">${S}${u.toFixed(1)} kWh</div>
                </div>
              </div>
              <div class="var-note">
                ${x?m`Monitored total matched the co-op bill to
                      <b>within ${Math.abs(f).toFixed(1)}%</b> — gaps backfilled from
                      device statistics.`:m`Monitored total is <b>${S}${f.toFixed(1)}%</b> off the co-op
                      bill — worth a look.`}
              </div>
            `:m`<div class="var-note">
              Set <code>${this._config.last_bill_kwh_entity}</code> to the co-op's billed kWh to
              see the reconciliation.
            </div>`}
      </div>
    `}_renderInvoices(){let e=this._config.invoice_url_base,{start:i}=this._billingWindow(),s=this._config.billing_start_day??12,r=[];for(let o=1;o<=4;o++){let c=new Date(i.getFullYear(),i.getMonth()-o,s),a=new Date(i.getFullYear(),i.getMonth()-o+1,s),l=d=>d.toLocaleDateString("en-US",{month:"short",day:"numeric"});r.push({label:`${l(c)} \u2013 ${l(a)}`,ym:`${c.getFullYear()}-${String(c.getMonth()+1).padStart(2,"0")}`})}return m`
      <div class="sec-head">
        <span class="idx">§</span><h2>Invoices</h2>
        <span class="rule"></span>
        <span class="meta">IN-LAWS · NORTH + SHE-SHED</span>
      </div>
      <div class="meter">
        <div class="actions">
          ${this._config.invoice_script?m`<button class="btn primary" @click=${this._generateInvoice}>
                ⎙ Generate invoice
              </button>`:h}
          ${this._config.bills_url?m`<a
                class="btn"
                href="${this._config.bills_url}"
                target="_blank"
                rel="noopener noreferrer"
                >↗ View co-op bills</a
              >`:h}
        </div>
        <div class="invoice-list">
          ${r.map(o=>m`
              <div class="invoice-row">
                <span class="p">${o.label}</span>
                <span class="s">
                  ${e?m`<a href="${e}${o.ym}.pdf" target="_blank" rel="noopener noreferrer"
                        >invoice ↗</a
                      >`:h}
                </span>
              </div>
            `)}
        </div>
      </div>
    `}_renderFlow(e){let i=this._config.max_expected_power||5e3,s=()=>{let o=[40,95,150],c=(l,d)=>{let p=this._num(l.power),g=Math.min(1,Math.max(0,p/i)),u=p<2?0:(5-g*4).toFixed(2),f=`M80 95 C180 95, 210 ${d}, 304 ${d}`;return C`
          <path class="fl-base" d="${f}" stroke="${l.color}" />
          ${u===0?h:C`<path class="fl-flow" d="${f}" stroke="${l.color}" style="animation-duration:${u}s" />`}
        `},a=(l,d)=>{let p=this._num(l.power),g=this._periodKwh(l);return C`
          <circle cx="330" cy="${d}" r="24" fill="none" stroke="${l.color}" stroke-width="2.5" />
          <text x="330" y="${d-2}" text-anchor="middle" class="fl-w">${Math.round(p)}</text>
          <text x="330" y="${d+9}" text-anchor="middle" class="fl-u">W</text>
          <text x="366" y="${d-3}" class="fl-name" fill="${l.color}">${l.name.toUpperCase()}</text>
          <text x="366" y="${d+9}" class="fl-kwh">${g.toFixed(0)} kWh period</text>
        `};return C`
        <svg class="flow flow-h" viewBox="0 0 470 190" preserveAspectRatio="xMidYMid meet">
          ${w.map((l,d)=>c(l,o[d]))}
          <circle cx="52" cy="95" r="26" fill="none" stroke="var(--brass-dim)" stroke-width="2.5" />
          <text x="52" y="92" text-anchor="middle" class="fl-w" style="fill:var(--brass)">${(e/1e3).toFixed(2)}</text>
          <text x="52" y="104" text-anchor="middle" class="fl-u">kW</text>
          <text x="52" y="140" text-anchor="middle" class="fl-name" style="fill:var(--ink-dim)">GRID</text>
          ${w.map((l,d)=>a(l,o[d]))}
        </svg>
      `},r=()=>{let l=[30,95,160],d=100,p=(u,f)=>{let x=this._num(u.power),S=Math.min(1,Math.max(0,x/i)),b=x<2?0:(5-S*4).toFixed(2),A=`M95 63 L95 ${d} C95 ${d+20}, ${f} 110, ${f} 122`;return C`
          <path class="fl-base" d="${A}" stroke="${u.color}" />
          ${b===0?h:C`<path class="fl-flow" d="${A}" stroke="${u.color}" style="animation-duration:${b}s" />`}
        `},g=(u,f)=>{let x=this._num(u.power),S=this._periodKwh(u);return C`
          <circle cx="${f}" cy="${150}" r="22" fill="none" stroke="${u.color}" stroke-width="2.5" />
          <text x="${f}" y="${148}" text-anchor="middle" class="fl-w">${Math.round(x)}</text>
          <text x="${f}" y="${159}" text-anchor="middle" class="fl-u">W</text>
          <text x="${f}" y="${186}" text-anchor="middle" class="fl-name" fill="${u.color}">${u.name.toUpperCase()}</text>
          <text x="${f}" y="${198}" text-anchor="middle" class="fl-kwh">${S.toFixed(0)} kWh</text>
        `};return C`
        <svg class="flow flow-v" viewBox="0 0 190 210" preserveAspectRatio="xMidYMid meet">
          ${w.map((u,f)=>p(u,l[f]))}
          <circle cx="${95}" cy="${35}" r="24" fill="none" stroke="var(--brass-dim)" stroke-width="2.5" />
          <text x="${95}" y="${32}" text-anchor="middle" class="fl-w" style="fill:var(--brass)">${(e/1e3).toFixed(2)}</text>
          <text x="${95}" y="${44}" text-anchor="middle" class="fl-u">kW</text>
          <text x="${95}" y="${77}" text-anchor="middle" class="fl-name" style="fill:var(--ink-dim)">GRID</text>
          ${w.map((u,f)=>g(u,l[f]))}
        </svg>
      `};return m`
      <div class="flow-well">
        <div class="flow-cap">LIVE FLOW · <span>GRID → SITES</span></div>
        ${s()}
        ${r()}
      </div>
    `}getCardSize(){return 8}static getStubConfig(){return{billing_start_day:12,use_statistics:!0}}};k.styles=[Q,M`
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
        cursor: pointer;
      }
      button.status { appearance: none; }
      .status:hover, .status:focus-visible { border-color: var(--brass-dim); outline: none; }
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

      /* The grid-status page becomes source-health context for the live flow. */
      .grid-status {
        display: flex; align-items: center; gap: 18px; flex-wrap: wrap;
        margin-top: 16px; padding: 14px 16px;
        background: var(--well); border: 1px solid var(--hairline); border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,.25) inset;
      }
      .grid-status.alert { border-color: #5a2f2a; }
      .grid-status-head { min-width: 190px; }
      .grid-cap, .grid-reading-k, .grid-updated {
        font-family: var(--font-mono); font-size: 9px; letter-spacing: .14em;
        text-transform: uppercase; color: var(--ink-faint);
      }
      .grid-state {
        display: inline-flex; align-items: center; gap: 7px; margin-top: 7px;
        font-family: var(--font-mono); font-size: 12px; font-weight: 700; letter-spacing: .07em;
        color: var(--ledger);
      }
      .grid-state.alert, .grid-reading.alert b { color: var(--needle); }
      .grid-updated { margin-top: 7px; letter-spacing: .06em; }
      .grid-readings { display: flex; flex: 1; align-items: stretch; flex-wrap: wrap; }
      .grid-reading {
        flex: 1; min-width: 120px; padding: 1px 14px; border-left: 1px solid var(--hairline);
        display: flex; flex-direction: column; gap: 5px;
      }
      .grid-reading b { font-family: var(--font-mono); font-size: 13px; color: var(--ink); }
      .grid-reading small { color: var(--ink-dim); font-size: 10px; font-weight: 400; }
      .grid-map {
        position: relative; flex: 0 0 230px; height: 132px; overflow: hidden;
        border: 1px solid var(--hairline); border-radius: 5px; background: #111;
      }
      .grid-map iframe { width: 100%; height: 100%; border: 0; display: block; }
      .grid-map a {
        position: absolute; right: 6px; bottom: 6px; padding: 4px 6px; border-radius: 3px;
        background: rgba(20,22,27,.86); color: var(--ink); text-decoration: none;
        font-family: var(--font-mono); font-size: 9px; letter-spacing: .04em;
      }
      .grid-incidents { flex-basis: 100%; border-top: 1px solid var(--hairline); padding-top: 11px; }
      .incident { display: flex; align-items: baseline; gap: 9px; flex-wrap: wrap; font-family: var(--font-mono); font-size: 11px; color: var(--ink-dim); }
      .incident b { color: var(--needle); letter-spacing: .05em; }
      .county-alerts { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
      .county-alerts span { font-family: var(--font-mono); font-size: 10px; color: var(--ink-dim); border: 1px solid var(--hairline); border-radius: 3px; padding: 4px 6px; }
      .county-alerts b { color: var(--needle); }
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
        .grid-reading:first-child { border-left: none; }
      }
      @media (max-width: 480px) {
        .register-sub { font-size: 11px; word-wrap: break-word; overflow-wrap: break-word; }
        .flow-well { padding: 12px; min-width: 0; }
        svg.flow-h { display: none; }
        svg.flow-v { display: block; }
        .grid-status { gap: 12px; }
        .grid-status-head { min-width: 0; width: 100%; }
        .grid-map { flex-basis: 100%; height: 180px; }
        .grid-readings { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px 0; }
        .grid-reading { min-width: 0; padding: 1px 10px; }
        .grid-reading:nth-child(odd) { border-left: none; }
      }
    `],_([$({attribute:!1})],k.prototype,"hass",2),_([U()],k.prototype,"_config",2),_([U()],k.prototype,"_stats",2),_([U()],k.prototype,"_gridExpanded",2),_([U()],k.prototype,"_lastPeriodMonitored",2),k=_([J("rv-energy-card")],k);window.customCards||=[];window.customCards.push({type:"rv-energy-card",name:"RV Energy",description:"Meter-register site power & billing overview (gap-proof statistics)",preview:!0});console.info(`%c RV-ENERGY-CARD %c v${Bt} `,"background:#d9a441;color:#241c08;font-weight:700;","background:#14161b;color:#d9a441;");export{k as RvEnergyCard};
