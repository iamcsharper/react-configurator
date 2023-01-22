import{j as c,a as e,T as f,c as i,s as o,u as K,A as W,V as C,F as q,b as V,d as G,e as H,f as J,g as X,h as re,r as m,D as L,i as $,k as w,l as ae,R as z,m as le}from"./index-ff14fab2.js";import{P as Q,F as N,D as E,a as g,b as Y,C as Z,u as _,s as ee,c as te,S as ce,M as ie,o as oe}from"./index-a4b928d8.js";const de=()=>{const[s]=K({name:["enabled"]});return s?c(q,{children:[e(g.Field,{name:"channel",css:i({marginBottom:o(2)},"",""),children:e(N,{label:c("div",{css:i({display:"flex",gap:o(1)},"",""),children:[e("span",{children:"Канал"}),e(E,{title:"Канал АЦП",description:"Информация о канале. TODO"})]}),options:Object.keys(W).map(t=>({key:t,value:W[t]}))})}),e(g.Field,{name:"vRef",children:e(N,{label:c("div",{css:i({display:"flex",gap:o(1)},"",""),children:[e("span",{children:"Источник опорного напряжения"}),e(E,{title:"Источник опорного напряжения",description:"Информация об источнике опорного напряжения. TODO"})]}),options:[{value:C.INNER,key:"Внутренний"},{value:C.CALIBRATABLE,key:"Настраиваемый"},{value:C.ADC_REF,key:"Внешний вывод ADC_REF"}]})}),e(Y,{})]}):null},ue=()=>c("div",{css:i({display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:o(1)},"",""),children:[e(g.Field,{name:"enabled",children:e(Z,{children:"Включить ADC"})}),e(E,{title:"ADC",description:"Информация об ADC"})]});var fe={name:"huyey5",styles:"min-height:100%;display:grid"},me={name:"14ggdrv",styles:"height:100%;display:flex;flex-direction:column;justify-content:space-between"};const pe=({children:s})=>{const t=_(),n=V(a=>a.analog.adc),r=G({defaultValues:n,mode:"all",resolver:ee(re)});return e("div",{css:fe,children:e(g,{methods:r,onSubmit:a=>{t(H(a)),r.reset(a)},onReset:()=>{t(H(r.getValues())),r.reset()},css:me,children:s})})},he=()=>{const s=J(),t=V(r=>r.analog.adc),n=_();return e(te,{onDefaultReset:()=>{n(H(X)),s.reset(X)},onReset:()=>{s.reset(t)},css:i({padding:o(2),justifyContent:"end"},"","")})},ge=()=>c(pe,{children:[c(Q,{title:"Настройки ADC",children:[e(ue,{}),c(f,{css:i({marginTop:o(2)},"",""),forceRenderTabPanel:!0,children:[c(f.List,{children:[e(f.Tab,{children:"Настройки"}),e(f.Tab,{children:"Прерывания"})]}),e(f.Panel,{children:e(de,{})}),e(f.Panel,{children:"Interrupts"})]})]}),e(he,{})]});var h=(s=>(s.DEC="dec",s.HEX="hex",s.BIN="bin",s))(h||{});const y="0b",v="0x",U=[{key:"Целое",value:h.DEC},{key:"2-чный",value:h.BIN},{key:"16-ричный",value:h.HEX}],be=[{mask:Number},{mask:"{\\0b}#### #### #### #### #### #### #### #### ####",definitions:{"#":/[0-1]/gi}},{mask:"{\\0x}#### #### #### #### #### ####",definitions:{"#":/[0-9a-f]/gi},prepare:s=>s.toUpperCase()}],j=(s,t)=>{const n=parseInt(s,t);return Number.isNaN(n)?null:n},se=s=>{if(typeof s=="number")return s;if(typeof s!="string")return null;const t=s.replace(/\s/g,"").trim();return t.startsWith(v)?j(t.replace(v,""),16):t.startsWith(y)?j(t.replace(y,""),2):j(t,10)},P=(s,t)=>{const n=se(s);return n===null?null:t===h.BIN?`${y}${n.toString(2)}`:t===h.HEX?`${v}${n.toString(16).toUpperCase()}`:n.toString(10)},ye=({initialValue:s,onChange:t,onChangeFormat:n,initialFormat:r=h.DEC})=>{const a=typeof s=="number"?s:null,[k,A]=m.useState(a),p=m.useRef(a),[I,F]=m.useState(r);p.current=a,m.useEffect(()=>{F(r)},[r]);const D=P(p.current,I),T=typeof D=="string"?D:"",[x,R]=m.useState(T);m.useEffect(()=>{A(a),R(P(a,I)||"")},[I,a]);const B=m.useCallback(d=>{const u=se(d);return p.current=u,A(l=>(setTimeout(()=>{l!==u&&(t==null||t(u))},0),u)),t==null||t(u),u},[t]),M=m.useCallback(d=>F(u=>{const l=typeof d=="function"?d(u):d;return setTimeout(()=>{u!==l&&(n==null||n(l))},0),l}),[n]);return{safeMaskValue:T,maskValue:x,setMaskValue:R,decValue:k,format:I,setValue:B,setFormat:M}};var ve={name:"zjik7",styles:"display:flex"};const ke=({innerProps:s,Arrow:t,className:n,disabled:r,id:a})=>{const{ref:k,...A}=s;return e("div",{css:ve,children:e("button",{ref:k,type:"button",className:n,disabled:r,id:a,...A,children:t})})},Ae=({format:s,onChange:t,inputRef:n})=>e(ce,{Field:ke,selected:U.filter(r=>r.value===s),onChange:r=>{var a;t(((a=r.selected)==null?void 0:a.value)||null),setTimeout(()=>{var k;(k=n.current)==null||k.focus()},0)},options:U,popoverPosition:"bottom-end",size:"md"});var De={name:"d0gv2t",styles:"display:flex;width:100%;align-items:start"};const Ie=m.forwardRef(({Format:s=Ae,format:t,error:n,value:r,onChange:a,labelWrap:k,onChangeFormat:A,...p},I)=>{const{format:F,setFormat:D,setValue:T,maskValue:x,setMaskValue:R,safeMaskValue:B,decValue:M}=ye({initialFormat:t,initialValue:r,onChange:a,onChangeFormat:A});r!==void 0&&!a&&console.warn("[IntegerMaskedInput] controlled value doesnt listen to onChange."),t!==void 0&&!A&&console.warn("[IntegerMaskedInput] controlled format doesnt listen to onChangeFormat.");const d=m.useRef(!1),u=m.useRef(null);return e("div",{css:De,children:e(ie,{...p,mask:be,value:x,autoComplete:"off",size:"md",error:n,onBlur:l=>{var b;(b=p==null?void 0:p.onBlur)==null||b.call(p,l),R(B)},ref:oe([I,u]),rightAddons:e(s,{inputRef:u,format:F,isFilled:!!x.length,onChange:l=>{console.log("fmt changed to",l),d.current=!0,D(l),R(P(M,l)||"")}}),onAccept:l=>{if(d.current){d.current=!1;return}console.log("[IntegerMaskedInput] onAccept setMaskValue=",{newVal:l}),R(l),setTimeout(()=>{l.startsWith(y)&&l.length===y.length||l.startsWith(v)&&l.length===v.length||T(l)},0)},dispatch:(l,b)=>{const O=d.current;d.current&&(d.current=!1);const{value:ne}=b,S=ne+l;return console.warn("DISPATCH! newVal:",S,"dynamicMasked.compiledMasks=",b.compiledMasks),S.substring(0,y.length)===y?(!O&&S.length>y.length&&D(h.BIN),b.compiledMasks[1]):S.substring(0,v.length)===v?(!O&&S.length>v.length&&D(h.HEX),b.compiledMasks[2]):(!O&&S.length&&D(h.DEC),b.compiledMasks[0])}})})}),Re={[L.CHANNEL_1]:"ЦАП_1",[L.CHANNEL_2]:"ЦАП_2"},Se=()=>{const[s]=K({name:["enabled"]});return s?c(q,{children:[e(g.Field,{name:"channel",css:i({marginBottom:o(2)},"",""),children:e(N,{label:c("div",{css:i({display:"flex",gap:o(1)},"",""),children:[e("span",{children:"Канал"}),e(E,{title:"Канал ЦАП",description:"Информация о канале. TODO"})]}),options:Object.values(L).map(t=>({key:Re[t],value:t}))})}),e(g.Field,{name:"vRef",css:i({marginBottom:o(2)},"",""),children:e(N,{label:c("div",{css:i({display:"flex",gap:o(1)},"",""),children:[e("span",{children:"Источник опорного напряжения"}),e(E,{title:"Источник опорного напряжения",description:"Информация об источнике опорного напряжения. TODO"})]}),options:[{value:C.INNER,key:"Внутренний"},{value:C.CALIBRATABLE,key:"Настраиваемый"},{value:C.ADC_REF,key:"Внешний вывод ADC_REF"}]})}),e(g.Field,{name:"divider",label:"Делитель",children:e(Ie,{placeholder:"Вводите 2, 10 или 16-ричное число"})}),e(Y,{})]}):null},Ce=()=>c("div",{css:i({display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:o(1)},"",""),children:[e(g.Field,{name:"enabled",children:e(Z,{children:"Включить DAC"})}),e(E,{title:"DAC",description:"Информация об DAC"})]});var Ee={name:"huyey5",styles:"min-height:100%;display:grid"},Fe={name:"14ggdrv",styles:"height:100%;display:flex;flex-direction:column;justify-content:space-between"};const Te=({children:s})=>{const t=_(),n=V(a=>a.analog.dac),r=G({defaultValues:n,mode:"all",resolver:ee(ae),shouldFocusError:!1});return e("div",{css:Ee,children:e(g,{methods:r,onSubmit:a=>{t($(a)),r.reset(a)},onReset:()=>{t($(r.getValues())),r.reset()},css:Fe,children:s})})},xe=()=>{const s=J(),t=V(r=>r.analog.dac),n=_();return e(te,{onDefaultReset:()=>{n($(w)),s.reset(w)},onReset:()=>{s.reset(t)},css:i({padding:o(2),justifyContent:"end"},"","")})},Ne=()=>c(Te,{children:[c(Q,{title:"Настройки DAC",children:[e(Ce,{}),c(f,{css:i({marginTop:o(2)},"",""),forceRenderTabPanel:!0,children:[c(f.List,{children:[e(f.Tab,{children:"Настройки"}),e(f.Tab,{children:"Прерывания"})]}),e(f.Panel,{children:e(Se,{})}),e(f.Panel,{children:"Interrupts"})]})]}),e(xe,{})]}),Be=()=>c(le,{children:[e(z,{path:"adc",element:e(ge,{})}),e(z,{path:"dac",element:e(Ne,{})})]});export{Be as default};
