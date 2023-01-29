import{j as n,a as e,T as i,c,s as l,u as F,A as b,V as h,F as R,b as u,d as T,e as g,f as x,g as A,h as O,D as y,i as C,k as D,l as j,R as v,m as N}from"./index-c4e2f641.js";import{P as I,F as p,D as m,a as d,b as S,u as f,s as E,c as k}from"./Component-aa69d3c5.js";import{C as _}from"./index-e19e5194.js";import{I as P}from"./index-af220133.js";const B=()=>{const[t]=F({name:["enabled"]});return t?n(R,{children:[e(d.Field,{name:"channel",css:c({marginBottom:l(2)},"",""),children:e(p,{label:n("div",{css:c({display:"flex",gap:l(1)},"",""),children:[e("span",{children:"Канал"}),e(m,{title:"Канал АЦП",description:"Информация о канале. TODO"})]}),options:Object.keys(b).map(s=>({key:s,value:b[s]}))})}),e(d.Field,{name:"vRef",children:e(p,{label:n("div",{css:c({display:"flex",gap:l(1)},"",""),children:[e("span",{children:"Источник опорного напряжения"}),e(m,{title:"Источник опорного напряжения",description:"Информация об источнике опорного напряжения. TODO"})]}),options:[{value:h.INNER,key:"Внутренний"},{value:h.CALIBRATABLE,key:"Настраиваемый"},{value:h.ADC_REF,key:"Внешний вывод ADC_REF"}]})}),e(S,{})]}):null},L=()=>n("div",{css:c({display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:l(1)},"",""),children:[e(d.Field,{name:"enabled",children:e(_,{children:"Включить ADC"})}),e(m,{title:"ADC",description:"Информация об ADC"})]});var V={name:"huyey5",styles:"min-height:100%;display:grid"},w={name:"14ggdrv",styles:"height:100%;display:flex;flex-direction:column;justify-content:space-between"};const H=({children:t})=>{const s=f(),o=u(r=>r.analog.adc),a=T({defaultValues:o,mode:"all",resolver:E(O)});return e("div",{css:V,children:e(d,{methods:a,onSubmit:r=>{s(g(r)),a.reset(r)},onReset:()=>{s(g(a.getValues())),a.reset()},css:w,children:t})})},$=()=>{const t=x(),s=u(a=>a.analog.adc),o=f();return e(k,{onDefaultReset:()=>{o(g(A)),t.reset(A)},onReset:()=>{t.reset(s)},css:c({padding:l(2),justifyContent:"end"},"","")})},W=()=>n(H,{children:[n(I,{title:"Настройки ADC",children:[e(L,{}),n(i,{css:c({marginTop:l(2)},"",""),forceRenderTabPanel:!0,children:[n(i.List,{children:[e(i.Tab,{children:"Настройки"}),e(i.Tab,{children:"Прерывания"})]}),e(i.Panel,{children:e(B,{})}),e(i.Panel,{children:"Interrupts"})]})]}),e($,{})]}),M={[y.CHANNEL_1]:"ЦАП_1",[y.CHANNEL_2]:"ЦАП_2"},U=()=>{const[t]=F({name:["enabled"]});return t?n(R,{children:[e(d.Field,{name:"channel",css:c({marginBottom:l(2)},"",""),children:e(p,{label:n("div",{css:c({display:"flex",gap:l(1)},"",""),children:[e("span",{children:"Канал"}),e(m,{title:"Канал ЦАП",description:"Информация о канале. TODO"})]}),options:Object.values(y).map(s=>({key:M[s],value:s}))})}),e(d.Field,{name:"vRef",css:c({marginBottom:l(2)},"",""),children:e(p,{label:n("div",{css:c({display:"flex",gap:l(1)},"",""),children:[e("span",{children:"Источник опорного напряжения"}),e(m,{title:"Источник опорного напряжения",description:"Информация об источнике опорного напряжения. TODO"})]}),options:[{value:h.INNER,key:"Внутренний"},{value:h.CALIBRATABLE,key:"Настраиваемый"},{value:h.ADC_REF,key:"Внешний вывод ADC_REF"}]})}),e(d.Field,{name:"divider",label:"Делитель",children:e(P,{placeholder:"Вводите 2, 10 или 16-ричное число"})}),e(S,{})]}):null},q=()=>n("div",{css:c({display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:l(1)},"",""),children:[e(d.Field,{name:"enabled",children:e(_,{children:"Включить DAC"})}),e(m,{title:"DAC",description:"Информация об DAC"})]});var z={name:"huyey5",styles:"min-height:100%;display:grid"},G={name:"14ggdrv",styles:"height:100%;display:flex;flex-direction:column;justify-content:space-between"};const J=({children:t})=>{const s=f(),o=u(r=>r.analog.dac),a=T({defaultValues:o,mode:"all",resolver:E(j),shouldFocusError:!1});return e("div",{css:z,children:e(d,{methods:a,onSubmit:r=>{s(C(r)),a.reset(r)},onReset:()=>{s(C(a.getValues())),a.reset()},css:G,children:t})})},K=()=>{const t=x(),s=u(a=>a.analog.dac),o=f();return e(k,{onDefaultReset:()=>{o(C(D)),t.reset(D)},onReset:()=>{t.reset(s)},css:c({padding:l(2),justifyContent:"end"},"","")})},Q=()=>n(J,{children:[n(I,{title:"Настройки DAC",children:[e(q,{}),n(i,{css:c({marginTop:l(2)},"",""),forceRenderTabPanel:!0,children:[n(i.List,{children:[e(i.Tab,{children:"Настройки"}),e(i.Tab,{children:"Прерывания"})]}),e(i.Panel,{children:e(U,{})}),e(i.Panel,{children:"Interrupts"})]})]}),e(K,{})]}),ne=()=>n(N,{children:[e(v,{path:"adc",element:e(W,{})}),e(v,{path:"dac",element:e(Q,{})})]});export{ne as default};
