/* ha-rv-energy-card — bundled (Lit inlined). Source: src/. Do not edit dist/ by hand. */
var Mt=Object.defineProperty;var Nt=Object.getOwnPropertyDescriptor;var _=(n,e,t,i)=>{for(var s=i>1?void 0:i?Nt(e,t):e,r=n.length-1,o;r>=0;r--)(o=n[r])&&(s=(i?o(e,t,s):o(s))||s);return i&&s&&Mt(e,t,s),s};var Y=globalThis,q=Y.ShadowRoot&&(Y.ShadyCSS===void 0||Y.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,et=Symbol(),ut=new WeakMap,L=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==et)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(q&&e===void 0){let i=t!==void 0&&t.length===1;i&&(e=ut.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&ut.set(t,e))}return e}toString(){return this.cssText}},mt=n=>new L(typeof n=="string"?n:n+"",void 0,et),N=(n,...e)=>{let t=n.length===1?n[0]:e.reduce((i,s,r)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+n[r+1],n[0]);return new L(t,n,et)},gt=(n,e)=>{if(q)n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let i=document.createElement("style"),s=Y.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=t.cssText,n.appendChild(i)}},it=q?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(let i of e.cssRules)t+=i.cssText;return mt(t)})(n):n;var{is:Tt,defineProperty:Pt,getOwnPropertyDescriptor:Ut,getOwnPropertyNames:Dt,getOwnPropertySymbols:zt,getPrototypeOf:Rt}=Object,K=globalThis,ft=K.trustedTypes,It=ft?ft.emptyScript:"",Lt=K.reactiveElementPolyfillSupport,F=(n,e)=>n,H={toAttribute(n,e){switch(e){case Boolean:n=n?It:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},X=(n,e)=>!Tt(n,e),_t={attribute:!0,type:String,converter:H,reflect:!1,useDefault:!1,hasChanged:X};Symbol.metadata??=Symbol("metadata"),K.litPropertyMetadata??=new WeakMap;var C=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=_t){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(e,i,t);s!==void 0&&Pt(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){let{get:s,set:r}=Ut(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:s,set(o){let d=s?.call(this);r?.call(this,o),this.requestUpdate(e,d,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??_t}static _$Ei(){if(this.hasOwnProperty(F("elementProperties")))return;let e=Rt(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(F("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(F("properties"))){let t=this.properties,i=[...Dt(t),...zt(t)];for(let s of i)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[i,s]of t)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let s=this._$Eu(t,i);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let s of i)t.unshift(it(s))}else e!==void 0&&t.push(it(e));return t}static _$Eu(e,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return gt(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){let i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(s!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:H).toAttribute(t,i.type);this._$Em=e,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(e,t){let i=this.constructor,s=i._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let r=i.getPropertyOptions(s),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:H;this._$Em=s;let d=o.fromAttribute(t,r.type);this[s]=d??this._$Ej?.get(s)??d,this._$Em=null}}requestUpdate(e,t,i,s=!1,r){if(e!==void 0){let o=this.constructor;if(s===!1&&(r=this[e]),i??=o.getPropertyOptions(e),!((i.hasChanged??X)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,i))))return;this.C(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:r},o){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),r!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,r]of this._$Ep)this[s]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,r]of i){let{wrapped:o}=r,d=this[s];o!==!0||this._$AL.has(s)||d===void 0||this.C(s,void 0,r,d)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};C.elementStyles=[],C.shadowRootOptions={mode:"open"},C[F("elementProperties")]=new Map,C[F("finalized")]=new Map,Lt?.({ReactiveElement:C}),(K.reactiveElementVersions??=[]).push("2.1.2");var dt=globalThis,vt=n=>n,J=dt.trustedTypes,bt=J?J.createPolicy("lit-html",{createHTML:n=>n}):void 0,St="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,At="?"+M,Ft=`<${At}>`,U=document,j=()=>U.createComment(""),G=n=>n===null||typeof n!="object"&&typeof n!="function",ct=Array.isArray,Ht=n=>ct(n)||typeof n?.[Symbol.iterator]=="function",st=`[ 	
\f\r]`,W=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,xt=/-->/g,yt=/>/g,T=RegExp(`>|${st}(?:([^\\s"'>=/]+)(${st}*=${st}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),$t=/'/g,wt=/"/g,Et=/^(?:script|style|textarea|title)$/i,pt=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),m=pt(1),v=pt(2),te=pt(3),D=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),kt=new WeakMap,P=U.createTreeWalker(U,129);function Ct(n,e){if(!ct(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return bt!==void 0?bt.createHTML(e):e}var Wt=(n,e)=>{let t=n.length-1,i=[],s,r=e===2?"<svg>":e===3?"<math>":"",o=W;for(let d=0;d<t;d++){let a=n[d],l,p,c=-1,f=0;for(;f<a.length&&(o.lastIndex=f,p=o.exec(a),p!==null);)f=o.lastIndex,o===W?p[1]==="!--"?o=xt:p[1]!==void 0?o=yt:p[2]!==void 0?(Et.test(p[2])&&(s=RegExp("</"+p[2],"g")),o=T):p[3]!==void 0&&(o=T):o===T?p[0]===">"?(o=s??W,c=-1):p[1]===void 0?c=-2:(c=o.lastIndex-p[2].length,l=p[1],o=p[3]===void 0?T:p[3]==='"'?wt:$t):o===wt||o===$t?o=T:o===xt||o===yt?o=W:(o=T,s=void 0);let u=o===T&&n[d+1].startsWith("/>")?" ":"";r+=o===W?a+Ft:c>=0?(i.push(l),a.slice(0,c)+St+a.slice(c)+M+u):a+M+(c===-2?d:u)}return[Ct(n,r+(n[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]},V=class n{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let r=0,o=0,d=e.length-1,a=this.parts,[l,p]=Wt(e,t);if(this.el=n.createElement(l,i),P.currentNode=this.el.content,t===2||t===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(s=P.nextNode())!==null&&a.length<d;){if(s.nodeType===1){if(s.hasAttributes())for(let c of s.getAttributeNames())if(c.endsWith(St)){let f=p[o++],u=s.getAttribute(c).split(M),g=/([.?@])?(.*)/.exec(f);a.push({type:1,index:r,name:g[2],strings:u,ctor:g[1]==="."?ot:g[1]==="?"?nt:g[1]==="@"?at:R}),s.removeAttribute(c)}else c.startsWith(M)&&(a.push({type:6,index:r}),s.removeAttribute(c));if(Et.test(s.tagName)){let c=s.textContent.split(M),f=c.length-1;if(f>0){s.textContent=J?J.emptyScript:"";for(let u=0;u<f;u++)s.append(c[u],j()),P.nextNode(),a.push({type:2,index:++r});s.append(c[f],j())}}}else if(s.nodeType===8)if(s.data===At)a.push({type:2,index:r});else{let c=-1;for(;(c=s.data.indexOf(M,c+1))!==-1;)a.push({type:7,index:r}),c+=M.length-1}r++}}static createElement(e,t){let i=U.createElement("template");return i.innerHTML=e,i}};function z(n,e,t=n,i){if(e===D)return e;let s=i!==void 0?t._$Co?.[i]:t._$Cl,r=G(e)?void 0:e._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),r===void 0?s=void 0:(s=new r(n),s._$AT(n,t,i)),i!==void 0?(t._$Co??=[])[i]=s:t._$Cl=s),s!==void 0&&(e=z(n,s._$AS(n,e.values),s,i)),e}var rt=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??U).importNode(t,!0);P.currentNode=s;let r=P.nextNode(),o=0,d=0,a=i[0];for(;a!==void 0;){if(o===a.index){let l;a.type===2?l=new B(r,r.nextSibling,this,e):a.type===1?l=new a.ctor(r,a.name,a.strings,this,e):a.type===6&&(l=new lt(r,this,e)),this._$AV.push(l),a=i[++d]}o!==a?.index&&(r=P.nextNode(),o++)}return P.currentNode=U,s}p(e){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}},B=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=z(this,e,t),G(e)?e===h||e==null||e===""?(this._$AH!==h&&this._$AR(),this._$AH=h):e!==this._$AH&&e!==D&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ht(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==h&&G(this._$AH)?this._$AA.nextSibling.data=e:this.T(U.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:i}=e,s=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=V.createElement(Ct(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{let r=new rt(s,this),o=r.u(this.options);r.p(t),this.T(o),this._$AH=r}}_$AC(e){let t=kt.get(e.strings);return t===void 0&&kt.set(e.strings,t=new V(e)),t}k(e){ct(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,s=0;for(let r of e)s===t.length?t.push(i=new n(this.O(j()),this.O(j()),this,this.options)):i=t[s],i._$AI(r),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let i=vt(e).nextSibling;vt(e).remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},R=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,r){this.type=1,this._$AH=h,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=h}_$AI(e,t=this,i,s){let r=this.strings,o=!1;if(r===void 0)e=z(this,e,t,0),o=!G(e)||e!==this._$AH&&e!==D,o&&(this._$AH=e);else{let d=e,a,l;for(e=r[0],a=0;a<r.length-1;a++)l=z(this,d[i+a],t,a),l===D&&(l=this._$AH[a]),o||=!G(l)||l!==this._$AH[a],l===h?e=h:e!==h&&(e+=(l??"")+r[a+1]),this._$AH[a]=l}o&&!s&&this.j(e)}j(e){e===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},ot=class extends R{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===h?void 0:e}},nt=class extends R{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==h)}},at=class extends R{constructor(e,t,i,s,r){super(e,t,i,s,r),this.type=5}_$AI(e,t=this){if((e=z(this,e,t,0)??h)===D)return;let i=this._$AH,s=e===h&&i!==h||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==h&&(i===h||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},lt=class{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){z(this,e)}};var jt=dt.litHtmlPolyfillSupport;jt?.(V,B),(dt.litHtmlVersions??=[]).push("3.3.3");var Ot=(n,e,t)=>{let i=t?.renderBefore??e,s=i._$litPart$;if(s===void 0){let r=t?.renderBefore??null;i._$litPart$=s=new B(e.insertBefore(j(),r),r,void 0,t??{})}return s._$AI(n),s};var ht=globalThis,w=class extends C{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ot(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return D}};w._$litElement$=!0,w.finalized=!0,ht.litElementHydrateSupport?.({LitElement:w});var Gt=ht.litElementPolyfillSupport;Gt?.({LitElement:w});(ht.litElementVersions??=[]).push("4.2.2");var Z=n=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(n,e)}):customElements.define(n,e)};var Vt={attribute:!0,type:String,converter:H,reflect:!1,hasChanged:X},Bt=(n=Vt,e,t)=>{let{kind:i,metadata:s}=t,r=globalThis.litPropertyMetadata.get(s);if(r===void 0&&globalThis.litPropertyMetadata.set(s,r=new Map),i==="setter"&&((n=Object.create(n)).wrapped=!0),r.set(t.name,n),i==="accessor"){let{name:o}=t;return{set(d){let a=e.get.call(this);e.set.call(this,d),this.requestUpdate(o,a,n,!0,d)},init(d){return d!==void 0&&this.C(o,void 0,n,d),d}}}if(i==="setter"){let{name:o}=t;return function(d){let a=this[o];e.call(this,d),this.requestUpdate(o,a,n,!0,d)}}throw Error("Unsupported decorator location: "+i)};function k(n){return(e,t)=>typeof t=="object"?Bt(n,e,t):((i,s,r)=>{let o=s.hasOwnProperty(r);return s.constructor.createProperty(r,i),o?Object.getOwnPropertyDescriptor(s,r):void 0})(n,e,t)}function O(n){return k({...n,state:!0,attribute:!1})}var tt=N`
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
`;var b=class extends w{constructor(){super(...arguments);this.value=0;this.digits=5;this.decimals=1;this.mult="";this.unit="kWh";this._positions=[]}willUpdate(t){(t.has("value")||t.has("digits")||t.has("decimals"))&&(this._positions=this._computeDigits())}_computeDigits(){let t=Math.round(this.value*Math.pow(10,this.decimals)),i=Math.max(0,t);return String(i).padStart(this.digits,"0").slice(-this.digits).split("").map(r=>parseInt(r,10)||0)}render(){let t=this.digits-this.decimals;return m`
      <div class="odometer" role="img" aria-label="${this.value} ${this.unit}">
        ${this._positions.map((i,s)=>{let r=s>=t;return m`
            <div class="digit ${r?"dec":""}">
              <div class="strip" style="transform: translateY(-${i*10}%)">
                ${[0,1,2,3,4,5,6,7,8,9].map(o=>m`<div class="cell">${o}</div>`)}
              </div>
            </div>
          `})}
        <span class="unit">${this.unit}</span>
        ${this.mult?m`<span class="mult">${this.mult}</span>`:""}
      </div>
    `}};b.styles=[tt,N`
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
    `],_([k({type:Number})],b.prototype,"value",2),_([k({type:Number})],b.prototype,"digits",2),_([k({type:Number})],b.prototype,"decimals",2),_([k({type:String})],b.prototype,"mult",2),_([k({type:String})],b.prototype,"unit",2),_([O()],b.prototype,"_positions",2),b=_([Z("meter-register")],b);var Yt="0.7.0",S=[{key:"north",name:"North",color:"var(--north)",power:"sensor.north_site_power",stat:"sensor.refoss_smart_energy_monitor_total_energy_north_site",fallbackPeriod:"sensor.refoss_smart_energy_monitor_north_site_billing_period",today:"sensor.north_site_today_energy"},{key:"south",name:"South",color:"var(--south)",power:"sensor.south_site_power",stat:"sensor.refoss_smart_energy_monitor_south_site_total_energy",fallbackPeriod:"sensor.refoss_smart_energy_monitor_south_site_billing_period",today:"sensor.south_site_today_energy"},{key:"shed",name:"She-Shed",color:"var(--shed)",power:"sensor.em_channel_3_power",stat:"sensor.shed_refoss_smart_energy_monitor_she_shed_total_energy",fallbackPeriod:"sensor.refoss_smart_energy_monitor_she_shed_billing_period",today:"sensor.em_channel_3_today_energy"}],qt=[{name:"McCormick",lat:33.92,lng:-82.29},{name:"Greenwood",lat:34.19,lng:-82.16},{name:"Edgefield",lat:33.78,lng:-82},{name:"Saluda",lat:34.01,lng:-81.77},{name:"Aiken",lat:33.57,lng:-81.72},{name:"Lexington",lat:33.91,lng:-81.31},{name:"Barnwell",lat:33.25,lng:-81.44},{name:"Orangeburg",lat:33.5,lng:-80.86},{name:"Calhoun",lat:33.67,lng:-80.78}],I={north:34.31,south:33.1,west:-82.43,east:-80.63},x=class extends w{constructor(){super(...arguments);this._stats={};this._gridExpanded=!1;this._mapOpen=!1;this._statsAnchor={};this._statsLoaded=!1;this._openMap=()=>{this._mapOpen=!0};this._closeMap=()=>{this._mapOpen=!1};this._selectOutage=t=>{this._selectedOutage=t};this._toggleGridStatus=()=>{this._gridExpanded=!this._gridExpanded};this._generateInvoice=()=>{let t=this._config.invoice_script;if(!this.hass||!t)return;let[i,s]=t.split(".");this.hass.callWS({type:"call_service",domain:i,service:s,service_data:{}})};this._updateBilledKwh=t=>{let i=t.target,s=parseFloat(i.value);if(!this.hass||isNaN(s)||s<0)return;let r=this._config.last_bill_kwh_entity;r&&this.hass.callWS({type:"call_service",domain:"input_number",service:"set_value",service_data:{entity_id:r,value:s}})}}setConfig(t){this._config={billing_start_day:12,use_statistics:!0,show_flow:!0,show_billing:!0,total_power_entity:"sensor.total_site_power",grid_status_entity:"sensor.aiken_co_op_outage_status",customers_out_entity:"sensor.aiken_co_op_customers_out",show_grid_status:!0,grid_metrics:[{entity:"sensor.aiken_co_op_customers_affected",name:"Affected"},{entity:"sensor.aiken_co_op_customers_restored",name:"Restored"},{entity:"sensor.aiken_co_op_planned_outages",name:"Planned"}],grid_map_url:"https://map.aikenco-op.org/",grid_map_link:"https://map.aikenco-op.org/",base_rate_entity:"input_number.base_electricity_rate",pca_rate_entity:"input_number.current_pca_rate",meter_multiplier:40,show_last_period:!0,show_invoices:!0,last_bill_kwh_entity:"input_number.last_coop_bill_kwh",last_bill_energy_entity:"input_number.last_coop_bill_energy_charge",last_bill_local_tax_entity:"input_number.last_coop_bill_local_tax",last_bill_sc_tax_entity:"input_number.last_coop_bill_sc_tax",invoice_script:"script.generate_monthly_invoice",...t}}updated(t){t.has("hass")&&this.hass&&!this._statsLoaded&&this._config.use_statistics&&(this._statsLoaded=!0,this._loadStatistics(),this._statsTimer=window.setInterval(()=>this._loadStatistics(),6e4))}disconnectedCallback(){super.disconnectedCallback(),this._statsTimer&&clearInterval(this._statsTimer)}_num(t,i=0){if(!t||!this.hass?.states[t])return i;let s=parseFloat(this.hass.states[t].state);return isNaN(s)?i:s}_rate(){return this._num(this._config.base_rate_entity)+this._num(this._config.pca_rate_entity)}_billingWindow(){let t=this._config.billing_start_day??12,i=new Date,s=i.getDate()>=t?new Date(i.getFullYear(),i.getMonth(),t):new Date(i.getFullYear(),i.getMonth()-1,t),r=new Date(s.getFullYear(),s.getMonth()+1,t);return{start:s,end:r}}async _loadStatistics(){if(!this.hass)return;let{start:t,end:i}=this._billingWindow(),s=S.map(r=>r.stat);try{let r=await this.hass.callWS({type:"recorder/statistics_during_period",start_time:t.toISOString(),end_time:i.toISOString(),statistic_ids:s,period:"day",types:["change"]}),o={},d={};for(let a of S){let l=r?.[a.stat];if(Array.isArray(l)&&l.length){let p=l.reduce((c,f)=>c+(f.change||0),0);a.key==="shed"&&p>1e3&&(p=p/1e3),o[a.key]=p,d[a.key]=this._liveCumulative(a)}}this._stats=o,this._statsAnchor=d}catch{this._stats={},this._statsAnchor={}}if(this._config.show_last_period)try{let r=t,o=new Date(t.getFullYear(),t.getMonth()-1,t.getDate()),d=await this.hass.callWS({type:"recorder/statistics_during_period",start_time:o.toISOString(),end_time:r.toISOString(),statistic_ids:s,period:"day",types:["change"]}),a=0;for(let l of S){let p=d?.[l.stat];if(Array.isArray(p)&&p.length){let c=p.reduce((f,u)=>f+(u.change||0),0);l.key==="shed"&&c>1e3&&(c=c/1e3),a+=c}}this._lastPeriodMonitored=a}catch{this._lastPeriodMonitored=void 0}}_liveCumulative(t){let i=this._num(t.stat);return t.key==="shed"&&i>1e3&&(i=i/1e3),i}_periodKwh(t){if(this._config.use_statistics&&this._stats[t.key]!=null){let s=this._stats[t.key],r=this._statsAnchor[t.key];if(r!=null){let o=Math.max(0,this._liveCumulative(t)-r);return s+o}return s}let i=this._num(t.fallbackPeriod);return t.key==="shed"&&i>1e3&&(i=i/1e3),i}_fmtPower(t){return t>=1e3?`${(t/1e3).toFixed(2)} kW`:`${Math.round(t)} W`}_fmtRange(t,i){let s={month:"short",day:"numeric"};return`${t.toLocaleDateString("en-US",s)} \u2192 ${i.toLocaleDateString("en-US",s)}`}_gridStatus(){let t=this.hass?.states[this._config.grid_status_entity??""]?.state;return!t||t==="unknown"||t==="unavailable"?"STATUS UNKNOWN":t.replace(/[_-]/g," ").toUpperCase()}_lastUpdated(t){let i=t?this.hass?.states[t]?.last_updated:void 0;if(!i)return"\u2014";let s=new Date(i);return Number.isNaN(s.getTime())?"\u2014":s.toLocaleString("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}_hasGridIssue(t){let i=this.hass?.states[this._config.grid_status_entity??""]?.state?.toLowerCase();return t>0||i==="unknown"||i==="unavailable"}_hasMeaningfulValue(t){let i=t.trim().toLowerCase();if(["","0","off","false","none","no","unknown","unavailable"].includes(i))return!1;let s=Number(i);return Number.isNaN(s)||s!==0}_gridMetrics(t){return(this._config.grid_metrics??[]).filter(i=>{let s=i?.entity?this.hass?.states[i.entity]:void 0;if(!s)return!1;let r=i.show_when??"issue";return r==="always"||r==="issue"&&t||r==="nonzero"&&this._hasMeaningfulValue(s.state)})}_outages(){let t=this.hass?.states["sensor.aiken_co_op_outage_details"]?.attributes.outages;return Array.isArray(t)?t.filter(i=>!!i&&typeof i=="object"):[]}_outageCounties(){let t=this.hass?.states["sensor.aiken_co_op_county_status"]?.attributes.counties;return Array.isArray(t)?t.filter(i=>!!i&&typeof i=="object"&&Number(i.customersOutNow)>0):[]}_fmtIncidentTime(t){if(!t)return"\u2014";let i=new Date(t);return Number.isNaN(i.getTime())?"\u2014":i.toLocaleString("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}_allCounties(){let t=this.hass?.states["sensor.aiken_co_op_county_status"]?.attributes.counties;return Array.isArray(t)?t.filter(i=>!!i&&typeof i=="object"):[]}_mapPoint(t,i,s,r){return{x:(i-I.west)/(I.east-I.west)*s,y:(I.north-t)/(I.north-I.south)*r}}_renderTerritoryMap(t=!1){let i=t?250:780,s=t?132:500,r=new Map(this._allCounties().map(d=>[d.name,d])),o=this._outages();return v`<svg class="territory-map ${t?"compact":"full"}" viewBox="0 0 ${i} ${s}" role="img" aria-label="Aiken Co-op territory outage map">
      <defs><pattern id="territory-grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="#333a44" stroke-width=".7"/></pattern><filter id="outage-glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <rect width="${i}" height="${s}" fill="url(#territory-grid)"/>
      ${qt.map(d=>{let{x:a,y:l}=this._mapPoint(d.lat,d.lng,i,s),p=Number(r.get(d.name)?.customersOutNow??0)>0,c=Math.min(i,s)*.11;return v`<g><polygon class="county ${p?"affected":""}" points="${a-c},${l-c*.3} ${a-c*.4},${l-c} ${a+c*.5},${l-c*.8} ${a+c},${l} ${a+c*.4},${l+c*.8} ${a-c*.5},${l+c*.8}"/>${t?h:v`<text x="${a}" y="${l+4}" text-anchor="middle" class="county-name">${d.name}</text>`}</g>`})}
      ${o.map(d=>{let a=d.outagePoint;if(typeof a?.lat!="number"||typeof a.lng!="number")return h;let{x:l,y:p}=this._mapPoint(a.lat,a.lng,i,s),c=d.outageName===(this._selectedOutage??o[0]?.outageName);return v`<g class="outage-marker ${c?"selected":""}" @click=${()=>this._selectOutage(d.outageName)}><circle class="outage-halo" cx="${l}" cy="${p}" r="${t?8:13}" filter="url(#outage-glow)"/><circle class="outage-core" cx="${l}" cy="${p}" r="${t?4:7}"/>${t?h:v`<text class="outage-label" x="${l+15}" y="${p-12}">${d.outageName??"OUTAGE"} · ${d.customersOutNow??0} OUT</text>`}</g>`})}
      ${o.length?h:v`<text class="map-clear" x="${i/2}" y="${s/2}" text-anchor="middle">NO ACTIVE OUTAGES</text>`}
    </svg>`}_renderFullMap(){let t=this._outages(),i=t.find(s=>s.outageName===this._selectedOutage)??t[0];return m`<div class="map-modal" role="dialog" aria-modal="true" @click=${this._closeMap}><section class="map-dialog" @click=${s=>s.stopPropagation()}><header class="map-head"><div><div class="grid-cap">AIKEN CO-OP · LIVE OUTAGES</div><div class="map-title">Grid Territory</div></div><div><a href="${this._config.grid_map_link}" target="_blank" rel="noopener noreferrer">Vendor map ↗</a><button @click=${this._closeMap}>×</button></div></header><div class="map-summary"><span><b>${this._num(this._config.customers_out_entity)}</b> OUT NOW</span><span><b>${this._num("sensor.aiken_co_op_customers_affected")}</b> AFFECTED</span><span><b>${this._num("sensor.aiken_co_op_customers_restored")}</b> RESTORED</span><span><b>${this._num("sensor.aiken_co_op_planned_outages")}</b> PLANNED</span></div><div class="map-body"><div class="map-canvas">${this._renderTerritoryMap()}</div><aside class="map-aside"><div class="aside-cap">Active outages</div>${t.length?t.map(s=>m`<button class="map-incident ${s===i?"selected":""}" @click=${()=>this._selectOutage(s.outageName)}><b>${s.outageName??"ACTIVE OUTAGE"}</b><span>${s.customersOutNow??0} out · ${s.crewAssigned?"crew assigned":"awaiting crew"}</span></button>`):m`<div class="map-empty">No active incidents reported.</div>`}${i?m`<div class="selected-detail"><span>Started</span><b>${this._fmtIncidentTime(i.outageStartTime)}</b><span>Estimated restoration</span><b>${i.estimatedTimeOfRestoral??"TBD"}</b></div>`:h}<div class="aside-cap">County status</div><div class="map-counties">${this._allCounties().sort((s,r)=>Number(r.customersOutNow)-Number(s.customersOutNow)).map(s=>m`<span class="${Number(s.customersOutNow)>0?"affected":""}">${s.name}<b>${Number(s.customersOutNow)} / ${Number(s.customersServed??0).toLocaleString()}</b></span>`)}</div></aside></div></section></div>`}_renderGridStatus(t,i){let s=this._hasGridIssue(i),r=this._gridMetrics(s||this._gridExpanded),o=this._outages(),d=this._outageCounties();return!s&&!this._gridExpanded?h:m`
      <div class="grid-status ${s?"alert":""}" aria-label="Grid service status">
        <div class="grid-status-head">
          <div class="grid-cap">GRID SERVICE · AIKEN CO-OP</div>
          <div class="grid-state ${t?"ok":"alert"}">
            <span class="live-dot"></span>${t?"SERVICE NORMAL":"OUTAGE REPORTED"}
          </div>
          <div class="grid-updated">UPDATED ${this._lastUpdated(this._config.grid_status_entity)}</div>
        </div>
        <div class="grid-map native-map">
          ${this._renderTerritoryMap(!0)}
          <button @click=${this._openMap}>Open map ↗</button>
        </div>
        <div class="grid-readings">
          <div class="grid-reading">
            <span class="grid-reading-k">Co-op status</span>
            <b>${this._gridStatus()}</b>
          </div>
          <div class="grid-reading ${t?"":"alert"}">
            <span class="grid-reading-k">Customers out</span>
            <b>${i.toLocaleString()}</b>
          </div>
          ${r.map(a=>{let l=this.hass.states[a.entity],p=a.name??l.attributes.friendly_name??a.entity,c=a.unit??l.attributes.unit_of_measurement??"";return m`
              <div class="grid-reading">
                <span class="grid-reading-k">${p}</span>
                <b>${l.state}${c?m` <small>${c}</small>`:h}</b>
              </div>
            `})}
        </div>
        ${s&&(o.length||d.length)?m`<div class="grid-incidents">
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
              ${d.length?m`<div class="county-alerts">
                ${d.map(a=>m`<span>${a.name}: <b>${Number(a.customersOutNow).toLocaleString()}</b> / ${Number(a.customersServed??0).toLocaleString()}</span>`)}
              </div>`:h}
            </div>`:h}
      </div>
    `}render(){if(!this.hass||!this._config)return h;let t=this._rate(),{start:i,end:s}=this._billingWindow(),o=Math.max(1,Math.round((new Date().getTime()-i.getTime())/864e5)),d=Math.round((s.getTime()-i.getTime())/864e5),a=this._num(this._config.total_power_entity),l=S.reduce(($,E)=>$+this._num(E.today),0),p=S.reduce(($,E)=>$+this._periodKwh(E),0),c=p/o*d,f=!!this._config.use_statistics&&Object.keys(this._stats).length>0,u=this._num(this._config.customers_out_entity),g=this._hasGridIssue(u),y=!g,A=u>0?`${u} OUT`:y?"GRID OK":"GRID STATUS ?";return m`
      <div class="wrap">
        <div class="meter">
          <div class="meter-head">
            <div class="brand">
              <div class="glyph">⌁</div>
              <div>
                <h1>RV ENERGY</h1>
                <div class="acct">
                  AIKEN CO-OP · REG ${this._fmtRange(i,s)} · DAY ${o}/${d}
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
                class="status ${y?"":"alert"}"
                type="button"
                @click=${this._toggleGridStatus}
                aria-expanded="${this._gridExpanded||g}"
                aria-controls="grid-service-details"
                title="${g?"Grid service details":"Open grid service details"}"
              >
                <span class="live-dot"></span>${A}
              </button>
            </div>
          </div>

          <div class="hero">
            <div class="register-block">
              <div class="register-label">Cumulative — this billing period</div>
              <meter-register
                .value=${p}
                .digits=${7}
                .decimals=${3}
                .mult=${`\xD7 MULT ${this._config.meter_multiplier}`}
                unit="kWh"
              ></meter-register>
              <div class="register-sub">
                <b>${this._fmtPower(a)}</b> across all sites now ·
                <b>${l.toFixed(1)} kWh</b> today ·
                projected <b>${c.toFixed(0)} kWh</b>
              </div>
            </div>

            ${this._config.show_flow?this._renderFlow(a):h}
          </div>
          ${this._config.show_grid_status?m`<div id="grid-service-details">${this._renderGridStatus(y,u)}</div>`:h}
        </div>

        ${this._config.show_billing?m`
              <div class="sec-head">
                <span class="idx">§</span><h2>This Billing Period</h2>
                <span class="rule"></span>
                <span class="prov ${f?"ok":"est"}">
                  ${f?"AUTHORITATIVE":"LIVE (est.)"}
                </span>
              </div>
              <div class="meter statement">
                <div class="amt">$${(p*t).toFixed(2)}</div>
                <div class="register-sub">
                  ${p.toFixed(0)} kWh · projected ~${c.toFixed(0)} kWh /
                  ~$${(c*t).toFixed(2)} @ $${t.toFixed(4)}/kWh
                </div>
                <table class="tbl">
                  <thead>
                    <tr><th>Meter</th><th>kWh</th><th>Cost</th><th>Today</th></tr>
                  </thead>
                  <tbody>
                    ${S.map($=>{let E=this._periodKwh($);return m`
                        <tr>
                          <td>
                            <span class="dot" style="background:${$.color}"></span>${$.name}
                          </td>
                          <td>${E.toFixed(1)}</td>
                          <td>$${(E*t).toFixed(2)}</td>
                          <td class="muted">${this._num($.today).toFixed(1)}</td>
                        </tr>
                      `})}
                  </tbody>
                </table>
              </div>
            `:h}

        ${this._config.show_last_period?this._renderLastPeriod(t):h}
        ${this._config.show_invoices?this._renderInvoices():h}
      </div>
      ${this._mapOpen?this._renderFullMap():h}
    `}_renderLastPeriod(t){let{start:i}=this._billingWindow(),s=new Date(i.getFullYear(),i.getMonth()-1,i.getDate()),r=i,o=this._num(this._config.last_bill_kwh_entity),d=this._num(this._config.last_bill_energy_entity),a=this._num(this._config.last_bill_local_tax_entity),l=this._num(this._config.last_bill_sc_tax_entity),p=d+a+l,c=this._lastPeriodMonitored??0,f=c>0&&o>0,u=c-o,g=o>0?u/o*100:0,y=Math.abs(g)<=2,A=u>=0?"+":"";return m`
      <div class="sec-head">
        <span class="idx">§</span><h2>Last Billing Period</h2>
        <span class="rule"></span>
        <span class="meta">${this._fmtRange(s,r)}</span>
      </div>
      <div class="meter">
        ${f?m`
              <div class="recon">
                <div class="recon-col">
                  <div class="recon-k">Monitored · actual</div>
                  <div class="recon-v ledger">
                    ${c.toFixed(1)} <small>kWh</small>
                  </div>
                  <div class="recon-k2">device statistics</div>
                </div>
                <div class="recon-col">
                  <div class="recon-k">Co-op bill</div>
                  <div class="recon-v">${o.toFixed(1)} <small>kWh</small></div>
                  <div class="recon-k2">
                    ${p>0?m`$${p.toFixed(2)}`:h}
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
                  <div class="recon-v ${y?"ledger":"alert"}">
                    ${A}${g.toFixed(1)}%
                  </div>
                  <div class="recon-k2">${A}${u.toFixed(1)} kWh</div>
                </div>
              </div>
              <div class="var-note">
                ${y?m`Monitored total matched the co-op bill to
                      <b>within ${Math.abs(g).toFixed(1)}%</b> — gaps backfilled from
                      device statistics.`:m`Monitored total is <b>${A}${g.toFixed(1)}%</b> off the co-op
                      bill — worth a look.`}
              </div>
            `:m`<div class="var-note">
              Set <code>${this._config.last_bill_kwh_entity}</code> to the co-op's billed kWh to
              see the reconciliation.
            </div>`}
      </div>
    `}_renderInvoices(){let t=this._config.invoice_url_base,{start:i}=this._billingWindow(),s=this._config.billing_start_day??12,r=[];for(let o=1;o<=4;o++){let d=new Date(i.getFullYear(),i.getMonth()-o,s),a=new Date(i.getFullYear(),i.getMonth()-o+1,s),l=p=>p.toLocaleDateString("en-US",{month:"short",day:"numeric"});r.push({label:`${l(d)} \u2013 ${l(a)}`,ym:`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`})}return m`
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
                  ${t?m`<a href="${t}${o.ym}.pdf" target="_blank" rel="noopener noreferrer"
                        >invoice ↗</a
                      >`:h}
                </span>
              </div>
            `)}
        </div>
      </div>
    `}_renderFlow(t){let i=this._config.max_expected_power||5e3,s=()=>{let o=[40,95,150],d=(l,p)=>{let c=this._num(l.power),f=Math.min(1,Math.max(0,c/i)),u=c<2?0:(5-f*4).toFixed(2),g=`M80 95 C180 95, 210 ${p}, 304 ${p}`;return v`
          <path class="fl-base" d="${g}" stroke="${l.color}" />
          ${u===0?h:v`<path class="fl-flow" d="${g}" stroke="${l.color}" style="animation-duration:${u}s" />`}
        `},a=(l,p)=>{let c=this._num(l.power),f=this._periodKwh(l);return v`
          <circle cx="330" cy="${p}" r="24" fill="none" stroke="${l.color}" stroke-width="2.5" />
          <text x="330" y="${p-2}" text-anchor="middle" class="fl-w">${Math.round(c)}</text>
          <text x="330" y="${p+9}" text-anchor="middle" class="fl-u">W</text>
          <text x="366" y="${p-3}" class="fl-name" fill="${l.color}">${l.name.toUpperCase()}</text>
          <text x="366" y="${p+9}" class="fl-kwh">${f.toFixed(0)} kWh period</text>
        `};return v`
        <svg class="flow flow-h" viewBox="0 0 470 190" preserveAspectRatio="xMidYMid meet">
          ${S.map((l,p)=>d(l,o[p]))}
          <circle cx="52" cy="95" r="26" fill="none" stroke="var(--brass-dim)" stroke-width="2.5" />
          <text x="52" y="92" text-anchor="middle" class="fl-w" style="fill:var(--brass)">${(t/1e3).toFixed(2)}</text>
          <text x="52" y="104" text-anchor="middle" class="fl-u">kW</text>
          <text x="52" y="140" text-anchor="middle" class="fl-name" style="fill:var(--ink-dim)">GRID</text>
          ${S.map((l,p)=>a(l,o[p]))}
        </svg>
      `},r=()=>{let l=[30,95,160],p=100,c=(u,g)=>{let y=this._num(u.power),A=Math.min(1,Math.max(0,y/i)),$=y<2?0:(5-A*4).toFixed(2),E=`M95 63 L95 ${p} C95 ${p+20}, ${g} 110, ${g} 122`;return v`
          <path class="fl-base" d="${E}" stroke="${u.color}" />
          ${$===0?h:v`<path class="fl-flow" d="${E}" stroke="${u.color}" style="animation-duration:${$}s" />`}
        `},f=(u,g)=>{let y=this._num(u.power),A=this._periodKwh(u);return v`
          <circle cx="${g}" cy="${150}" r="22" fill="none" stroke="${u.color}" stroke-width="2.5" />
          <text x="${g}" y="${148}" text-anchor="middle" class="fl-w">${Math.round(y)}</text>
          <text x="${g}" y="${159}" text-anchor="middle" class="fl-u">W</text>
          <text x="${g}" y="${186}" text-anchor="middle" class="fl-name" fill="${u.color}">${u.name.toUpperCase()}</text>
          <text x="${g}" y="${198}" text-anchor="middle" class="fl-kwh">${A.toFixed(0)} kWh</text>
        `};return v`
        <svg class="flow flow-v" viewBox="0 0 190 210" preserveAspectRatio="xMidYMid meet">
          ${S.map((u,g)=>c(u,l[g]))}
          <circle cx="${95}" cy="${35}" r="24" fill="none" stroke="var(--brass-dim)" stroke-width="2.5" />
          <text x="${95}" y="${32}" text-anchor="middle" class="fl-w" style="fill:var(--brass)">${(t/1e3).toFixed(2)}</text>
          <text x="${95}" y="${44}" text-anchor="middle" class="fl-u">kW</text>
          <text x="${95}" y="${77}" text-anchor="middle" class="fl-name" style="fill:var(--ink-dim)">GRID</text>
          ${S.map((u,g)=>f(u,l[g]))}
        </svg>
      `};return m`
      <div class="flow-well">
        <div class="flow-cap">LIVE FLOW · <span>GRID → SITES</span></div>
        ${s()}
        ${r()}
      </div>
    `}getCardSize(){return 8}static getStubConfig(){return{billing_start_day:12,use_statistics:!0}}};x.styles=[tt,N`
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
      .grid-map.native-map{padding:0;background:#11151b}.grid-map.native-map button{position:absolute;right:6px;bottom:6px;z-index:1;border:1px solid var(--hairline);border-radius:3px;padding:4px 6px;color:var(--ink);background:rgba(20,22,27,.88);font:9px var(--font-mono);cursor:pointer}.territory-map{width:100%;height:100%;display:block;background:#11151b}.county{fill:#202730;stroke:#4a5562;stroke-width:1.2}.county.affected{fill:#572e2a;stroke:var(--needle)}.county-name,.outage-label,.map-clear{fill:var(--ink-dim);font-family:var(--font-mono);font-size:12px}.outage-label{fill:var(--ink);font-size:11px}.outage-marker{cursor:pointer}.outage-halo{fill:rgba(200,72,58,.32)}.outage-core{fill:var(--needle);stroke:#fff0df;stroke-width:1.5}.outage-marker.selected .outage-core{fill:var(--brass)}.map-modal{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:22px;background:rgba(4,5,7,.76)}.map-dialog{width:min(1100px,100%);max-height:min(760px,94vh);overflow:auto;border:1px solid var(--bezel);border-radius:10px;background:var(--panel);box-shadow:0 30px 70px #000}.map-head{display:flex;justify-content:space-between;align-items:center;padding:18px 20px;border-bottom:1px solid var(--hairline)}.map-title{margin-top:4px;font-family:var(--font-display);font-size:23px;color:var(--ink)}.map-head a,.map-head button{color:var(--brass);background:none;border:0;text-decoration:none;font-family:var(--font-mono);cursor:pointer}.map-head button{margin-left:15px;font-size:26px;line-height:1}.map-summary{display:flex;flex-wrap:wrap;padding:12px 20px;border-bottom:1px solid var(--hairline)}.map-summary span{padding:2px 16px;border-left:1px solid var(--hairline);color:var(--ink-dim);font:10px var(--font-mono)}.map-summary span:first-child{border-left:0;padding-left:0}.map-summary b{color:var(--needle);font-size:14px}.map-body{display:grid;grid-template-columns:minmax(0,1fr) 280px;min-height:480px}.map-canvas{min-height:420px;padding:18px}.map-aside{padding:18px;border-left:1px solid var(--hairline);background:var(--well)}.aside-cap{margin:0 0 9px;color:var(--ink-faint);font:9px var(--font-mono);letter-spacing:.14em;text-transform:uppercase}.map-incident{width:100%;margin-bottom:7px;padding:9px;text-align:left;border:1px solid var(--hairline);border-radius:4px;background:transparent;color:var(--ink);cursor:pointer}.map-incident.selected{border-color:var(--needle);background:rgba(200,72,58,.08)}.map-incident b,.map-incident span{display:block}.map-incident b{font:11px var(--font-mono)}.map-incident span,.selected-detail span{color:var(--ink-dim);font:10px var(--font-mono)}.selected-detail{display:grid;gap:3px;padding:10px 0 16px}.selected-detail b{font:12px var(--font-mono);color:var(--ink)}.map-counties{display:grid;gap:4px}.map-counties span{display:flex;justify-content:space-between;color:var(--ink-dim);font:10px var(--font-mono)}.map-counties span.affected b{color:var(--needle)}
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
    `],_([k({attribute:!1})],x.prototype,"hass",2),_([O()],x.prototype,"_config",2),_([O()],x.prototype,"_stats",2),_([O()],x.prototype,"_gridExpanded",2),_([O()],x.prototype,"_mapOpen",2),_([O()],x.prototype,"_selectedOutage",2),_([O()],x.prototype,"_lastPeriodMonitored",2),x=_([Z("rv-energy-card")],x);window.customCards||=[];window.customCards.push({type:"rv-energy-card",name:"RV Energy",description:"Meter-register site power & billing overview (gap-proof statistics)",preview:!0});console.info(`%c RV-ENERGY-CARD %c v${Yt} `,"background:#d9a441;color:#241c08;font-weight:700;","background:#14161b;color:#d9a441;");export{x as RvEnergyCard};
