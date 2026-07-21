/* ha-rv-energy-card — bundled (Lit inlined). Source: src/. Do not edit dist/ by hand. */
var Et=Object.defineProperty;var Ct=Object.getOwnPropertyDescriptor;var m=(r,t,e,s)=>{for(var i=s>1?void 0:s?Ct(t,e):t,o=r.length-1,n;o>=0;o--)(n=r[o])&&(i=(s?n(t,e,i):n(i))||i);return s&&i&&Et(t,e,i),i};var W=globalThis,q=W.ShadowRoot&&(W.ShadyCSS===void 0||W.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Q=Symbol(),ct=new WeakMap,R=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==Q)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(q&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=ct.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&ct.set(e,t))}return t}toString(){return this.cssText}},ht=r=>new R(typeof r=="string"?r:r+"",void 0,Q),S=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((s,i,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[o+1],r[0]);return new R(e,r,Q)},pt=(r,t)=>{if(q)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=W.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},X=q?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return ht(e)})(r):r;var{is:Pt,defineProperty:Mt,getOwnPropertyDescriptor:Tt,getOwnPropertyNames:Ot,getOwnPropertySymbols:Ut,getPrototypeOf:Rt}=Object,V=globalThis,ut=V.trustedTypes,Nt=ut?ut.emptyScript:"",Dt=V.reactiveElementPolyfillSupport,N=(r,t)=>r,D={toAttribute(r,t){switch(t){case Boolean:r=r?Nt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},B=(r,t)=>!Pt(r,t),mt={attribute:!0,type:String,converter:D,reflect:!1,useDefault:!1,hasChanged:B};Symbol.metadata??=Symbol("metadata"),V.litPropertyMetadata??=new WeakMap;var x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=mt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Mt(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:o}=Tt(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:i,set(n){let l=i?.call(this);o?.call(this,n),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??mt}static _$Ei(){if(this.hasOwnProperty(N("elementProperties")))return;let t=Rt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(N("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(N("properties"))){let e=this.properties,s=[...Ot(e),...Ut(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(X(i))}else t!==void 0&&e.push(X(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return pt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let o=(s.converter?.toAttribute!==void 0?s.converter:D).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let o=s.getPropertyOptions(i),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:D;this._$Em=i;let l=n.fromAttribute(e,o.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(t!==void 0){let n=this.constructor;if(i===!1&&(o=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??B)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,o]of this._$Ep)this[i]=o;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,o]of s){let{wrapped:n}=o,l=this[i];n!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,o,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[N("elementProperties")]=new Map,x[N("finalized")]=new Map,Dt?.({ReactiveElement:x}),(V.reactiveElementVersions??=[]).push("2.1.2");var nt=globalThis,ft=r=>r,K=nt.trustedTypes,gt=K?K.createPolicy("lit-html",{createHTML:r=>r}):void 0,bt="$lit$",b=`lit$${Math.random().toFixed(9).slice(2)}$`,wt="?"+b,Ht=`<${wt}>`,C=document,z=()=>C.createComment(""),L=r=>r===null||typeof r!="object"&&typeof r!="function",at=Array.isArray,zt=r=>at(r)||typeof r?.[Symbol.iterator]=="function",tt=`[ 	
\f\r]`,H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_t=/-->/g,yt=/>/g,k=RegExp(`>|${tt}(?:([^\\s"'>=/]+)(${tt}*=${tt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),vt=/'/g,xt=/"/g,At=/^(?:script|style|textarea|title)$/i,lt=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),_=lt(1),Y=lt(2),Jt=lt(3),P=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),$t=new WeakMap,E=C.createTreeWalker(C,129);function St(r,t){if(!at(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return gt!==void 0?gt.createHTML(t):t}var Lt=(r,t)=>{let e=r.length-1,s=[],i,o=t===2?"<svg>":t===3?"<math>":"",n=H;for(let l=0;l<e;l++){let a=r[l],h,c,d=-1,u=0;for(;u<a.length&&(n.lastIndex=u,c=n.exec(a),c!==null);)u=n.lastIndex,n===H?c[1]==="!--"?n=_t:c[1]!==void 0?n=yt:c[2]!==void 0?(At.test(c[2])&&(i=RegExp("</"+c[2],"g")),n=k):c[3]!==void 0&&(n=k):n===k?c[0]===">"?(n=i??H,d=-1):c[1]===void 0?d=-2:(d=n.lastIndex-c[2].length,h=c[1],n=c[3]===void 0?k:c[3]==='"'?xt:vt):n===xt||n===vt?n=k:n===_t||n===yt?n=H:(n=k,i=void 0);let g=n===k&&r[l+1].startsWith("/>")?" ":"";o+=n===H?a+Ht:d>=0?(s.push(h),a.slice(0,d)+bt+a.slice(d)+b+g):a+b+(d===-2?l:g)}return[St(r,o+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},I=class r{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,n=0,l=t.length-1,a=this.parts,[h,c]=Lt(t,e);if(this.el=r.createElement(h,s),E.currentNode=this.el.content,e===2||e===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=E.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let d of i.getAttributeNames())if(d.endsWith(bt)){let u=c[n++],g=i.getAttribute(d).split(b),A=/([.?@])?(.*)/.exec(u);a.push({type:1,index:o,name:A[2],strings:g,ctor:A[1]==="."?st:A[1]==="?"?it:A[1]==="@"?rt:U}),i.removeAttribute(d)}else d.startsWith(b)&&(a.push({type:6,index:o}),i.removeAttribute(d));if(At.test(i.tagName)){let d=i.textContent.split(b),u=d.length-1;if(u>0){i.textContent=K?K.emptyScript:"";for(let g=0;g<u;g++)i.append(d[g],z()),E.nextNode(),a.push({type:2,index:++o});i.append(d[u],z())}}}else if(i.nodeType===8)if(i.data===wt)a.push({type:2,index:o});else{let d=-1;for(;(d=i.data.indexOf(b,d+1))!==-1;)a.push({type:7,index:o}),d+=b.length-1}o++}}static createElement(t,e){let s=C.createElement("template");return s.innerHTML=t,s}};function O(r,t,e=r,s){if(t===P)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,o=L(t)?void 0:t._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),o===void 0?i=void 0:(i=new o(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=O(r,i._$AS(r,t.values),i,s)),t}var et=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??C).importNode(e,!0);E.currentNode=i;let o=E.nextNode(),n=0,l=0,a=s[0];for(;a!==void 0;){if(n===a.index){let h;a.type===2?h=new j(o,o.nextSibling,this,t):a.type===1?h=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(h=new ot(o,this,t)),this._$AV.push(h),a=s[++l]}n!==a?.index&&(o=E.nextNode(),n++)}return E.currentNode=C,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},j=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=O(this,t,e),L(t)?t===p||t==null||t===""?(this._$AH!==p&&this._$AR(),this._$AH=p):t!==this._$AH&&t!==P&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):zt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==p&&L(this._$AH)?this._$AA.nextSibling.data=t:this.T(C.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=I.createElement(St(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let o=new et(i,this),n=o.u(this.options);o.p(e),this.T(n),this._$AH=o}}_$AC(t){let e=$t.get(t.strings);return e===void 0&&$t.set(t.strings,e=new I(t)),e}k(t){at(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let o of t)i===e.length?e.push(s=new r(this.O(z()),this.O(z()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=ft(t).nextSibling;ft(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},U=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=p,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=p}_$AI(t,e=this,s,i){let o=this.strings,n=!1;if(o===void 0)t=O(this,t,e,0),n=!L(t)||t!==this._$AH&&t!==P,n&&(this._$AH=t);else{let l=t,a,h;for(t=o[0],a=0;a<o.length-1;a++)h=O(this,l[s+a],e,a),h===P&&(h=this._$AH[a]),n||=!L(h)||h!==this._$AH[a],h===p?t=p:t!==p&&(t+=(h??"")+o[a+1]),this._$AH[a]=h}n&&!i&&this.j(t)}j(t){t===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},st=class extends U{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===p?void 0:t}},it=class extends U{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==p)}},rt=class extends U{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=O(this,t,e,0)??p)===P)return;let s=this._$AH,i=t===p&&s!==p||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==p&&(s===p||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},ot=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){O(this,t)}};var It=nt.litHtmlPolyfillSupport;It?.(I,j),(nt.litHtmlVersions??=[]).push("3.3.3");var kt=(r,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let o=e?.renderBefore??null;s._$litPart$=i=new j(t.insertBefore(z(),o),o,void 0,e??{})}return i._$AI(r),i};var dt=globalThis,y=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=kt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return P}};y._$litElement$=!0,y.finalized=!0,dt.litElementHydrateSupport?.({LitElement:y});var jt=dt.litElementPolyfillSupport;jt?.({LitElement:y});(dt.litElementVersions??=[]).push("4.2.2");var G=r=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(r,t)}):customElements.define(r,t)};var Ft={attribute:!0,type:String,converter:D,reflect:!1,hasChanged:B},Wt=(r=Ft,t,e)=>{let{kind:s,metadata:i}=e,o=globalThis.litPropertyMetadata.get(i);if(o===void 0&&globalThis.litPropertyMetadata.set(i,o=new Map),s==="setter"&&((r=Object.create(r)).wrapped=!0),o.set(e.name,r),s==="accessor"){let{name:n}=e;return{set(l){let a=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,a,r,!0,l)},init(l){return l!==void 0&&this.C(n,void 0,r,l),l}}}if(s==="setter"){let{name:n}=e;return function(l){let a=this[n];t.call(this,l),this.requestUpdate(n,a,r,!0,l)}}throw Error("Unsupported decorator location: "+s)};function v(r){return(t,e)=>typeof e=="object"?Wt(r,t,e):((s,i,o)=>{let n=i.hasOwnProperty(o);return i.constructor.createProperty(o,s),n?Object.getOwnPropertyDescriptor(i,o):void 0})(r,t,e)}function F(r){return v({...r,state:!0,attribute:!1})}var Z=S`
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
    --ink-dim: #8a8f99;
    --ink-faint: #5a616c;
    --north: #5b9bd5;
    --south: #6bbf7b;
    --shed: #a681c4;

    --font-display: 'Oswald', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    --font-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;
    --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
`;var f=class extends y{constructor(){super(...arguments);this.value=0;this.digits=5;this.decimals=1;this.mult="";this.unit="kWh";this._positions=[]}willUpdate(e){(e.has("value")||e.has("digits")||e.has("decimals"))&&(this._positions=this._computeDigits())}_computeDigits(){let e=Math.round(this.value*Math.pow(10,this.decimals)),s=Math.max(0,e);return String(s).padStart(this.digits,"0").slice(-this.digits).split("").map(o=>parseInt(o,10)||0)}render(){let e=this.digits-this.decimals;return _`
      <div class="odometer" role="img" aria-label="${this.value} ${this.unit}">
        ${this._positions.map((s,i)=>{let o=i>=e;return _`
            <div class="digit ${o?"dec":""}">
              <div class="strip" style="transform: translateY(${-s*62}px)">
                ${[0,1,2,3,4,5,6,7,8,9].map(n=>_`<div class="cell">${n}</div>`)}
              </div>
            </div>
          `})}
        <span class="unit">${this.unit}</span>
        ${this.mult?_`<span class="mult">${this.mult}</span>`:""}
      </div>
    `}};f.styles=[Z,S`
      :host {
        display: inline-block;
      }
      .odometer {
        display: inline-flex;
        align-items: stretch;
        gap: 3px;
      }
      .digit {
        position: relative;
        width: 40px;
        height: 62px;
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
        height: 62px;
        display: grid;
        place-items: center;
        font-family: var(--font-mono);
        font-weight: 800;
        font-size: 40px;
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
    `],m([v({type:Number})],f.prototype,"value",2),m([v({type:Number})],f.prototype,"digits",2),m([v({type:Number})],f.prototype,"decimals",2),m([v({type:String})],f.prototype,"mult",2),m([v({type:String})],f.prototype,"unit",2),m([F()],f.prototype,"_positions",2),f=m([G("meter-register")],f);var qt="0.5.1",M=[{key:"north",name:"North",color:"var(--north)",power:"sensor.north_site_power",stat:"sensor.refoss_smart_energy_monitor_total_energy_north_site",fallbackPeriod:"sensor.refoss_smart_energy_monitor_north_site_billing_period",today:"sensor.north_site_today_energy"},{key:"south",name:"South",color:"var(--south)",power:"sensor.south_site_power",stat:"sensor.refoss_smart_energy_monitor_south_site_total_energy",fallbackPeriod:"sensor.refoss_smart_energy_monitor_south_site_billing_period",today:"sensor.south_site_today_energy"},{key:"shed",name:"She-Shed",color:"var(--shed)",power:"sensor.em_channel_3_power",stat:"sensor.shed_refoss_smart_energy_monitor_she_shed_total_energy",fallbackPeriod:"sensor.refoss_smart_energy_monitor_she_shed_billing_period",today:"sensor.em_channel_3_today_energy"}],w=class extends y{constructor(){super(...arguments);this._stats={};this._statsAnchor={};this._statsLoaded=!1}setConfig(e){this._config={billing_start_day:12,use_statistics:!0,show_flow:!0,show_billing:!0,total_power_entity:"sensor.total_site_power",grid_status_entity:"sensor.aiken_co_op_outage_status",customers_out_entity:"sensor.aiken_co_op_customers_out",base_rate_entity:"input_number.base_electricity_rate",pca_rate_entity:"input_number.current_pca_rate",meter_multiplier:40,...e}}updated(e){e.has("hass")&&this.hass&&!this._statsLoaded&&this._config.use_statistics&&(this._statsLoaded=!0,this._loadStatistics(),this._statsTimer=window.setInterval(()=>this._loadStatistics(),6e4))}disconnectedCallback(){super.disconnectedCallback(),this._statsTimer&&clearInterval(this._statsTimer)}_num(e,s=0){if(!e||!this.hass?.states[e])return s;let i=parseFloat(this.hass.states[e].state);return isNaN(i)?s:i}_rate(){return this._num(this._config.base_rate_entity)+this._num(this._config.pca_rate_entity)}_billingWindow(){let e=this._config.billing_start_day??12,s=new Date,i=s.getDate()>=e?new Date(s.getFullYear(),s.getMonth(),e):new Date(s.getFullYear(),s.getMonth()-1,e),o=new Date(i.getFullYear(),i.getMonth()+1,e);return{start:i,end:o}}async _loadStatistics(){if(!this.hass)return;let{start:e,end:s}=this._billingWindow(),i=M.map(o=>o.stat);try{let o=await this.hass.callWS({type:"recorder/statistics_during_period",start_time:e.toISOString(),end_time:s.toISOString(),statistic_ids:i,period:"day",types:["change"]}),n={},l={};for(let a of M){let h=o?.[a.stat];if(Array.isArray(h)&&h.length){let c=h.reduce((d,u)=>d+(u.change||0),0);a.key==="shed"&&c>1e3&&(c=c/1e3),n[a.key]=c,l[a.key]=this._liveCumulative(a)}}this._stats=n,this._statsAnchor=l}catch{this._stats={},this._statsAnchor={}}}_liveCumulative(e){let s=this._num(e.stat);return e.key==="shed"&&s>1e3&&(s=s/1e3),s}_periodKwh(e){if(this._config.use_statistics&&this._stats[e.key]!=null){let i=this._stats[e.key],o=this._statsAnchor[e.key];if(o!=null){let n=Math.max(0,this._liveCumulative(e)-o);return i+n}return i}let s=this._num(e.fallbackPeriod);return e.key==="shed"&&s>1e3&&(s=s/1e3),s}_fmtPower(e){return e>=1e3?`${(e/1e3).toFixed(2)} kW`:`${Math.round(e)} W`}_fmtRange(e,s){let i={month:"short",day:"numeric"};return`${e.toLocaleDateString("en-US",i)} \u2192 ${s.toLocaleDateString("en-US",i)}`}render(){if(!this.hass||!this._config)return p;let e=this._rate(),{start:s,end:i}=this._billingWindow(),n=Math.max(1,Math.round((new Date().getTime()-s.getTime())/864e5)),l=Math.round((i.getTime()-s.getTime())/864e5),a=this._num(this._config.total_power_entity),h=M.reduce(($,T)=>$+this._num(T.today),0),c=M.reduce(($,T)=>$+this._periodKwh(T),0),d=c/n*l,u=!!this._config.use_statistics&&Object.keys(this._stats).length>0,g=this._num(this._config.customers_out_entity),A=g===0;return _`
      <div class="wrap">
        <div class="meter">
          <div class="meter-head">
            <div class="brand">
              <div class="glyph">⌁</div>
              <div>
                <h1>RV ENERGY</h1>
                <div class="acct">
                  AIKEN CO-OP · REG ${this._fmtRange(s,i)} · DAY ${n}/${l}
                </div>
              </div>
            </div>
            <div class="status ${A?"":"alert"}">
              <span class="live-dot"></span>${A?"GRID OK":`${g} OUT`}
            </div>
          </div>

          <div class="hero">
            <div class="register-block">
              <div class="register-label">Cumulative — this billing period</div>
              <meter-register
                .value=${c}
                .digits=${7}
                .decimals=${3}
                .mult=${`\xD7 MULT ${this._config.meter_multiplier}`}
                unit="kWh"
              ></meter-register>
              <div class="register-sub">
                <b>${this._fmtPower(a)}</b> across all sites now ·
                <b>${h.toFixed(1)} kWh</b> today ·
                projected <b>${d.toFixed(0)} kWh</b>
              </div>
            </div>

            ${this._renderFlow(a)}
          </div>
        </div>

        ${this._config.show_billing?_`
              <div class="sec-head">
                <span class="idx">§</span><h2>This Billing Period</h2>
                <span class="rule"></span>
                <span class="prov ${u?"ok":"est"}">
                  ${u?"AUTHORITATIVE":"LIVE (est.)"}
                </span>
              </div>
              <div class="meter statement">
                <div class="amt">$${(c*e).toFixed(2)}</div>
                <div class="register-sub">
                  ${c.toFixed(0)} kWh · projected ~${d.toFixed(0)} kWh /
                  ~$${(d*e).toFixed(2)} @ $${e.toFixed(4)}/kWh
                </div>
                <table class="tbl">
                  <thead>
                    <tr><th>Meter</th><th>kWh</th><th>Cost</th><th>Today</th></tr>
                  </thead>
                  <tbody>
                    ${M.map($=>{let T=this._periodKwh($);return _`
                        <tr>
                          <td>
                            <span class="dot" style="background:${$.color}"></span>${$.name}
                          </td>
                          <td>${T.toFixed(1)}</td>
                          <td>$${(T*e).toFixed(2)}</td>
                          <td class="muted">${this._num($.today).toFixed(1)}</td>
                        </tr>
                      `})}
                  </tbody>
                </table>
              </div>
            `:p}
      </div>
    `}_renderFlow(e){let s=[40,95,150],i=this._config.max_expected_power||5e3,o=(l,a)=>{let h=this._num(l.power),c=Math.min(1,Math.max(0,h/i)),d=h<2?0:(5-c*4).toFixed(2),u=`M80 95 C180 95, 210 ${a}, 304 ${a}`;return Y`
        <path class="fl-base" d="${u}" stroke="${l.color}" />
        ${d===0?p:Y`<path class="fl-flow" d="${u}" stroke="${l.color}"
              style="animation-duration:${d}s" />`}
      `},n=(l,a)=>{let h=this._num(l.power),c=this._periodKwh(l);return Y`
        <circle cx="330" cy="${a}" r="24" fill="none" stroke="${l.color}" stroke-width="2.5" />
        <text x="330" y="${a-2}" text-anchor="middle" class="fl-w">${Math.round(h)}</text>
        <text x="330" y="${a+9}" text-anchor="middle" class="fl-u">W</text>
        <text x="366" y="${a-3}" class="fl-name" fill="${l.color}">${l.name.toUpperCase()}</text>
        <text x="366" y="${a+9}" class="fl-kwh">${c.toFixed(0)} kWh period</text>
      `};return _`
      <div class="flow-well">
        <div class="flow-cap">LIVE FLOW · <span>GRID → SITES</span></div>
        <svg class="flow" viewBox="0 0 470 190" preserveAspectRatio="xMidYMid meet">
          ${M.map((l,a)=>o(l,s[a]))}
          <circle cx="52" cy="95" r="26" fill="none" stroke="var(--brass-dim)" stroke-width="2.5" />
          <text x="52" y="92" text-anchor="middle" class="fl-w" style="fill:var(--brass)">
            ${(e/1e3).toFixed(2)}
          </text>
          <text x="52" y="104" text-anchor="middle" class="fl-u">kW</text>
          <text x="52" y="140" text-anchor="middle" class="fl-name" style="fill:var(--ink-dim)">GRID</text>
          ${M.map((l,a)=>n(l,s[a]))}
        </svg>
      </div>
    `}getCardSize(){return 8}static getStubConfig(){return{billing_start_day:12,use_statistics:!0}}};w.styles=[Z,S`
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
        padding-bottom: 16px;
        margin-bottom: 20px;
        border-bottom: 1px solid var(--hairline);
      }
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
      svg.flow { width: 100%; height: 190px; display: block; margin-top: 8px; }
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
      .fl-name { font-family: var(--font-display); font-size: 12px; letter-spacing: 0.05em; text-transform: uppercase; }
      .fl-kwh { fill: var(--ink-faint); font-family: var(--font-mono); font-size: 9px; }
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
      @media (max-width: 820px) {
        .register-row { flex-direction: column; align-items: flex-start; }
      }
    `],m([v({attribute:!1})],w.prototype,"hass",2),m([F()],w.prototype,"_config",2),m([F()],w.prototype,"_stats",2),w=m([G("rv-energy-card")],w);window.customCards||=[];window.customCards.push({type:"rv-energy-card",name:"RV Energy",description:"Meter-register site power & billing overview (gap-proof statistics)",preview:!0});console.info(`%c RV-ENERGY-CARD %c v${qt} `,"background:#d9a441;color:#241c08;font-weight:700;","background:#14161b;color:#d9a441;");export{w as RvEnergyCard};
