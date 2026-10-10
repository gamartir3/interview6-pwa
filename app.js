/* ============ احراز هویت ============ */
const BYPASS={'2800408049':{code:'379876',name:'جواد جوادی',nc:'8049'}};
const VALID_USERS={};
const AUTH_KEY='ig-auth-v5';

function validNC(nc){
if(!/^\d{10}$/.test(nc))return false;
if(/^(\d)\1{9}$/.test(nc))return false;
let s=0;for(let i=0;i<9;i++)s+=parseInt(nc[i])*(10-i);
const r=s%11,c=parseInt(nc[9]);
return(r<2&&c===r)||(r>=2&&c===11-r);
}
async function sha256(t){
const b=new TextEncoder().encode(t);
const h=await crypto.subtle.digest('SHA-256',b);
return Array.from(new Uint8Array(h)).map(x=>x.toString(16).padStart(2,'0')).join('');
}

/* ============ ذخیره‌سازی ============ */
const K={r:'ig-r',b:'ig-b',q:'ig-q',qa:'ig-qa',ct:'ig-ct',nt:'ig-nt',cn:'ig-cn',th:'ig-th',fn:'ig-fn',iv:'ig-iv',ss:'ig-ss'};

let st={r:{},b:[],q:{},qa:{},ct:{},nt:{name:'',position:'',date:'',before:'',during:'',after:''},cn:'',th:'light',fn:'md',iv:{name:'',code:'',office:''},ss:{},auth:{ok:false,hash:'',name:'',nc:''},view:'home',sec:null,sq:'',stab:'all',qi:0,qA:[],fi:0,fF:false,cur:null,sFrom:'',sTo:''};

function load(){
try{
st.r=JSON.parse(localStorage.getItem(K.r)||'{}');
st.b=JSON.parse(localStorage.getItem(K.b)||'[]');
st.q=JSON.parse(localStorage.getItem(K.q)||'{}');
st.qa=JSON.parse(localStorage.getItem(K.qa)||'{}');
st.ct=JSON.parse(localStorage.getItem(K.ct)||'{}');
st.nt=JSON.parse(localStorage.getItem(K.nt)||'{}');
st.cn=localStorage.getItem(K.cn)||'';
st.iv=JSON.parse(localStorage.getItem(K.iv)||'{"name":"","code":"","office":""}');
st.ss=JSON.parse(localStorage.getItem(K.ss)||'{}');
}catch(e){}
}
function SV(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
function RD(s,i){return !!st.r[s+':'+i];}
function SR(s,i,v){const k=s+':'+i;if(v)st.r[k]=1;else delete st.r[k];SV(K.r,st.r);}
function iB(s,i){return st.b.indexOf(s+':'+i)>-1;}
function tB(s,i){const k=s+':'+i;const x=st.b.indexOf(k);if(x>-1)st.b.splice(x,1);else st.b.push(k);SV(K.b,st.b);}
function SP(s){if(s.type==='flow')return RD(s.id,0)?{d:1,t:1}:{d:0,t:1};let d=0;for(let i=0;i<s.cards.length;i++)if(RD(s.id,i))d++;return{d,t:s.cards.length};}
function OP(){let t=0,d=0;S.forEach(s=>{const p=SP(s);t+=p.t;d+=p.d;});return t?Math.round(d/t*100):0;}
function tF(n){return String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);}
function tk(){const d=new Date();return d.getFullYear()+'/'+String(d.getMonth()+1).padStart(2,'0')+'/'+String(d.getDate()).padStart(2,'0');}
function fD(d){return tF(d.getFullYear())+'/'+tF(String(d.getMonth()+1).padStart(2,'0'))+'/'+tF(String(d.getDate()).padStart(2,'0'));}

/* ============ AUTH ============ */
function chkAuth(){
try{
const raw=localStorage.getItem(AUTH_KEY);if(!raw)return;
const a=JSON.parse(raw);
if(a&&a.hash){
if(BYPASS[a.nc]){st.auth={ok:true,hash:'bypass',name:BYPASS[a.nc].name,nc:a.nc};return;}
if(VALID_USERS[a.hash]){st.auth={ok:true,hash:a.hash,name:VALID_USERS[a.hash].name,nc:VALID_USERS[a.hash].nc};return;}
}
}catch(e){}
}
async function doLogin(nc,code){
nc=(nc||'').replace(/\D/g,'');code=(code||'').trim().toUpperCase();
if(!validNC(nc))return{ok:false,err:'کد ملی نامعتبر است.'};
if(code.length<3)return{ok:false,err:'کد سازمانی را وارد کنید.'};
if(BYPASS[nc]&&BYPASS[nc].code===code){
st.auth={ok:true,hash:'bypass',name:BYPASS[nc].name,nc:BYPASS[nc].nc};
try{localStorage.setItem(AUTH_KEY,JSON.stringify({hash:'bypass',nc:st.auth.nc,name:BYPASS[nc].name}));}catch(e){}
return{ok:true};
}
if(Object.keys(VALID_USERS).length>0){
const h=await sha256(nc+':'+code);
if(VALID_USERS[h]){
st.auth={ok:true,hash:h,name:VALID_USERS[h].name,nc:VALID_USERS[h].nc};
try{localStorage.setItem(AUTH_KEY,JSON.stringify({hash:h,nc:st.auth.nc,name:VALID_USERS[h].name}));}catch(e){}
return{ok:true};
}
}
return{ok:false,err:'کد ملی یا کد سازمانی صحیح نیست.'};
}
function logout(){if(!confirm('خارج می‌شوید؟'))return;st.auth={ok:false,hash:'',name:'',nc:''};try{localStorage.removeItem(AUTH_KEY);}catch(e){}st.view='home';render();}

/* ============ RENDER ============ */
const app=document.getElementById('app');
function render(){
if(!st.auth.ok){rLogin();return;}
const v=st.view;
if(v==='home')rHome();
else if(v==='section')rSec();
else if(v==='search')rSearch();
else if(v==='tools')rTools();
else if(v==='checklist')rChk();
else if(v==='newSession')rNew();
else if(v==='session')rSes();
else if(v==='stats')rStats();
else if(v==='notepad')rNote();
else if(v==='glossary')rGloss();
else if(v==='flashcards')rFC();
else if(v==='progress')rProg();
else if(v==='certificate')rCert();
else if(v==='examSheet')rSheet();
else if(v==='settings')rSet();
document.querySelectorAll('.nb').forEach(b=>{
const n=b.dataset.n;let a=false;
if(n==='home')a=(v==='home'||v==='section');
else if(n==='search')a=(v==='search');
else if(n==='tools')a=(v==='tools'||v==='checklist'||v==='newSession'||v==='session'||v==='stats'||v==='notepad'||v==='glossary'||v==='flashcards');
else if(n==='progress')a=(v==='progress'||v==='certificate'||v==='examSheet');
else if(n==='settings')a=(v==='settings');
b.classList.toggle('on',a);
});
}

/* LOGIN */
function rLogin(){
const has=Object.keys(BYPASS).length>0||Object.keys(VALID_USERS).length>0;
app.innerHTML=`
<div class="screen on"><div class="lw"><div class="lc">
<img src="logo.png" class="ll" alt="">
<h1 class="lt">راهنمای جامع مصاحبه گزینش</h1>
<p class="ls">هسته گزینش اداره کل آموزش و پرورش استان قم</p>
${has?`
<div style="text-align:right">
<label class="lbl">کد ملی</label>
<input type="tel" id="inNc" class="li" placeholder="۱۲۳۴۵۶۷۸۹۰" maxlength="10" inputmode="numeric">
<label class="lbl">کد سازمانی</label>
<input type="text" id="inCd" class="li" placeholder="XXXX" maxlength="12" autocapitalize="characters">
<div class="ler" id="ler"></div>
<button class="lbt" id="lbt" onclick="runLogin()">ورود</button>
</div>
`:`
<div style="background:#FEF3C7;border:1px solid #F59E0B;padding:14px;border-radius:12px;font-size:13px;color:#78350F;text-align:right">
<strong>توجه:</strong> هیچ کاربری تنظیم نشده است.
</div>
`}
<div class="lft">در صورت نداشتن کد سازمانی، با مسئول تماس بگیرید.</div>
</div></div></div>`;
if(has){
const nc=document.getElementById('inNc'),cd=document.getElementById('inCd');
nc.addEventListener('input',e=>{e.target.value=e.target.value.replace(/\D/g,'').slice(0,10);});
cd.addEventListener('input',e=>{e.target.value=e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,'');});
cd.addEventListener('keypress',e=>{if(e.key==='Enter')runLogin();});
setTimeout(()=>nc.focus(),300);
}
}
async function runLogin(){
const nc=document.getElementById('inNc').value;
const cd=document.getElementById('inCd').value;
const b=document.getElementById('lbt');
const e=document.getElementById('ler');
e.textContent='';b.disabled=true;b.textContent='بررسی...';
const r=await doLogin(nc,cd);
b.disabled=false;b.textContent='ورود';
if(r.ok){st.view='home';window.scrollTo({top:0,behavior:'instant'});render();}
else{e.textContent=r.err;const box=document.querySelector('.lc');box.classList.remove('shake');void box.offsetWidth;box.classList.add('shake');}
}

/* HOME */
function rHome(){
const p=OP(),c=326.7,off=c-(p/100)*c;
let nx=S.find(s=>SP(s).d<SP(s).t)||S[0];
const np=SP(nx);
app.innerHTML=`
<div class="screen on">
<div class="hr">
<img src="logo.png" class="hl" alt="">
<div class="hb">هسته گزینش اداره کل آموزش و پرورش استان قم</div>
<h1>راهنمای جامع مصاحبه گزینش</h1>
<p>ویژه مصاحبه‌گران و کارشناسان هسته گزینش</p>
<div class="hu">${st.auth.name} — ${tF(st.auth.nc)}</div>
<div class="rw"><div class="rb">
<svg viewBox="0 0 120 120"><circle class="rbg" cx="60" cy="60" r="52"/><circle class="rfl" cx="60" cy="60" r="52" style="stroke-dashoffset:${off}"/></svg>
<div class="rc"><div class="rp">${tF(p)}٪</div><div class="rl">پیشرفت کل</div></div>
</div></div>
</div>
<div class="hbd">
<button class="cbt" onclick="openSec('${nx.id}')">
<div class="ic">${ICONS[nx.id]}</div>
<div class="tx"><div class="lbl2">${np.d===0?'شروع مطالعه':'ادامه مطالعه'}</div><div class="ttl">${nx.title}</div></div>
</button>
<div class="sh"><h2>بخش‌های آموزشی</h2><span>${tF(S.length)} بخش</span></div>
<div class="gr">${S.map(s=>{const p=SP(s);const pt=p.t?Math.round(p.d/p.t*100):0;return`
<div class="sc" onclick="openSec('${s.id}')">
<div class="si" style="background:${s.cl};color:${s.color}">${ICONS[s.id]}</div>
<div class="sn">
<h3 class="stl">${s.title}</h3>
<p class="ssb">${s.sub}</p>
<div class="sp"><div class="spf" style="width:${pt}%;background:${s.color}"></div></div>
<div class="spt">${pt===100?'✓ تکمیل':tF(pt)+'٪'}</div>
</div>
<svg class="sa" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
</div>`;}).join('')}
</div>
</div>
</div>`;
}
function openSec(id){st.view='section';st.sec=id;st.qi=0;st.qA=[];window.scrollTo({top:0,behavior:'instant'});render();}
function backH(){st.view='home';st.sec=null;window.scrollTo({top:0,behavior:'instant'});render();}

/* SECTION */
function rSec(){
const s=S.find(x=>x.id===st.sec);if(!s)return backH();
const p=SP(s),pt=p.t?Math.round(p.d/p.t*100):0;
const body=s.type==='flow'?rFlow(s):rCards(s);
app.innerHTML=`
<div class="screen on">
<div class="hd">
<button class="bb" onclick="backH()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></button>
<div class="hi"><h1 class="ht">${s.title}</h1><p class="hs">${s.sub} — ${tF(pt)}٪</p></div>
</div>
<div class="bd" style="--ac:${s.color}">${body}</div>
</div>`;
}
function rCards(s){
const cs=s.cards.map((c,i)=>{
const r=RD(s.id,i),b=iB(s.id,i);
return `<article class="cd ${r?'rd':''}" style="--ac:${s.color}">
<div class="wm">${st.auth.name} — ${tF(st.auth.nc)}</div>
<div class="ch" onclick="tC(this)">
<div class="cn">${r?ICONS.check:tF(i+1)}</div>
<h3 class="ct">${c.t}</h3>
<div class="ca">
<button class="ib ${b?'on':''}" onclick="event.stopPropagation();bmC(this,'${s.id}',${i})">${b?ICONS.bmf:ICONS.bm}</button>
<svg class="cv" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
</div>
</div>
<div class="cbd"><div class="cc">
${c.h||''}
${c.ex?`<div class="ex">${c.ex}</div>`:''}
${c.tip?`<div class="tip">${c.tip}</div>`:''}
<button class="rb2 ${r?'dn':''}" onclick="tR(event,this,'${s.id}',${i})">${r?'خوانده شد':'علامت‌گذاری به‌عنوان خوانده‌شده'}</button>
</div></div>
</article>`;
}).join('');
return cs+rQuiz(s.id);
}
function rQuiz(id){
const s=S.find(x=>x.id===id);const q=QZ[id];if(!q)return'';
if(st.qi>=q.length){
const ok=st.qA.filter((a,i)=>a===q[i].c).length;
const tot=q.length;const pct=Math.round(ok/tot*100);
const pv=st.q[id];
if(!pv||pct>pv.best)st.q[id]={best:pct,ok,tot,at:(pv?pv.at+1:1)};
else if(pv)st.q[id].at=(pv.at||1)+1;
SV(K.q,st.q);
let m='';
if(pct===100)m='عالی! همه پاسخ‌ها درست بود.';
else if(pct>=70)m='خوب! سطح دانش مناسب است.';
else m='توصیه می‌شود بخش را دوباره مرور کنید.';
return `<div class="qb" style="--ac:${s.color}"><div class="qr">
<div class="qbg" style="background:#DCFCE7;color:#16A34A">آزمون تکمیل شده</div>
<div class="sc">${tF(pct)}٪</div>
<div class="sl">${tF(ok)} از ${tF(tot)} پاسخ درست</div>
<div class="ms">${m}</div>
<button class="rb2" onclick="retry()" style="width:100%">آزمون مجدد (برای یادگیری)</button>
</div></div>`;
}
const c=q[st.qi];
return `<div class="qb" style="--ac:${s.color}">
<div class="qp"><span>${ICONS.quiz} آزمون کوتاه</span><span>${tF(st.qi+1)} از ${tF(q.length)}</span></div>
<h4 class="qq">${c.q}</h4>
<div class="qo">${c.o.map((o,i)=>`<button class="qopt" onclick="aQ(${i})">${o}</button>`).join('')}</div>
</div>`;
}
function aQ(i){
const q=QZ[st.sec][st.qi];
const ops=document.querySelectorAll('.qopt');
ops.forEach((o,x)=>{o.style.pointerEvents='none';if(x===q.c)o.classList.add('ok');if(x===i&&x!==q.c)o.classList.add('no');});
st.qA[st.qi]=i;st.qa[st.sec+':'+st.qi]=i;SV(K.qa,st.qa);
const ex=document.createElement('div');ex.className='qe';
ex.innerHTML=`<strong>پاسخ درست:</strong> ${q.o[q.c]}<br>${q.e}`;
document.querySelector('.qo').after(ex);
setTimeout(()=>{st.qi++;rSec();const qb=document.querySelector('.qb');if(qb)qb.scrollIntoView({behavior:'smooth',block:'start'});},2000);
}
function retry(){if(!confirm('آزمون مجدد؟ بهترین نتیجه ثبت می‌شود.'))return;st.qi=0;st.qA=[];rSec();}
function rFlow(s){
const r=RD(s.id,0);
let h='<div class="fl">';let last=0;
const nm={1:'فاز دریافت',2:'فاز انجام',3:'فاز ارجاع'};
s.steps.forEach((x,i)=>{
if(x.p!==last){last=x.p;h+=`<div class="fp p${x.p}">${nm[x.p]}</div>`;}
h+=`<div class="fs" style="--ac:${s.color}"><div class="fn" style="background:${s.color}">${tF(i+1)}</div><div class="ft">${x.t}</div><div class="fd">${x.d}</div></div>`;
});
h+=`<button class="rb2 ${r?'dn':''}" style="margin-top:16px" onclick="tR(event,this,'${s.id}',0,true)">${r?'فرآیند مطالعه شد':'فرآیند را مطالعه کردم'}</button></div>`;
return h;
}
function tC(h){h.parentElement.classList.toggle('op');}
function tR(e,b,id,i,flow){
e.stopPropagation();
const c=b.closest('.cd');const cur=RD(id,i);SR(id,i,!cur);
if(cur){
b.classList.remove('dn');b.textContent=flow?'فرآیند را مطالعه کردم':'علامت‌گذاری به‌عنوان خوانده‌شده';
if(c){c.classList.remove('rd');const n=c.querySelector('.cn');if(n)n.textContent=tF(i+1);}
}else{
b.classList.add('dn');b.textContent=flow?'فرآیند مطالعه شد':'خوانده شد';
if(c){c.classList.add('rd');const n=c.querySelector('.cn');if(n)n.innerHTML=ICONS.check;}
}
const s=S.find(x=>x.id===id);const p=SP(s);const pt=p.t?Math.round(p.d/p.t*100):0;
const sub=document.querySelector('.hs');if(sub)sub.textContent=s.sub+' — '+tF(pt)+'٪';
if(p.d===p.t&&!cur){
const op=OP();
if(op===100)md('تبریک!','همه بخش‌ها را تکمیل کردی. برگه نتیجه در بخش پیشرفت آماده است.');
else md('آفرین!',`بخش «${s.title}» تکمیل شد.`);
}
}
function bmC(b,id,i){tB(id,i);const x=iB(id,i);b.classList.toggle('on',x);b.innerHTML=x?ICONS.bmf:ICONS.bm;}

/* SEARCH */
function rSearch(){
const q=st.sq.trim(),t=st.stab;let r=[];
if(t==='bm'){
st.b.forEach(k=>{
const[sid,ix]=k.split(':');const s=S.find(x=>x.id===sid);if(!s||s.type==='flow')return;
const i=parseInt(ix);const c=s.cards[i];if(!c)return;
r.push({s,c,i,t:c.t,x:strip(c.h).slice(0,120)});
});
}else if(q){
const qq=q.toLowerCase();
S.forEach(s=>{
if(s.type==='flow'){
s.steps.forEach((x,i)=>{const z=(x.t+' '+x.d).toLowerCase();if(z.indexOf(qq)>-1)r.push({s,c:{t:x.t,h:x.d},i,t:x.t,x:x.d});});
}else{
s.cards.forEach((c,i)=>{const z=(c.t+' '+strip(c.h)+(c.tip||'')).toLowerCase();if(z.indexOf(qq)>-1)r.push({s,c,i,t:c.t,x:strip(c.h)});});
}
});
}
app.innerHTML=`
<div class="screen on">
<div class="hd"><div class="hi"><h1 class="ht">جستجو در محتوا</h1><p class="hs">میان ${tF(S.length)} بخش</p></div></div>
<div class="sv">
<input class="sin" type="text" placeholder="واژه یا عبارت..." value="${q}" oninput="onQ(this.value)">
<div class="sts">
<button class="tb ${t==='all'?'on':''}" onclick="st.stab='all';rSearch()">همه</button>
<button class="tb ${t==='bm'?'on':''}" onclick="st.stab='bm';rSearch()">نشانک‌ها (${tF(st.b.length)})</button>
</div>
${t==='bm'&&st.b.length===0?`<div class="es">هنوز کارتی نشانک نشده.</div>`
:t==='all'&&!q?`<div class="es">واژه‌ای برای جستجو بنویسید.</div>`
:r.length===0?`<div class="es">نتیجه‌ای یافت نشد.</div>`
:`<div style="font-size:12px;color:var(--mt);margin-bottom:9px">${tF(r.length)} نتیجه</div>
${r.map(x=>`<div class="ri" onclick="goR('${x.s.id}',${x.i})">
<div class="rs">${x.s.title}</div>
<h4 class="rt">${hl(x.t,q)}</h4>
<p class="rp2">${hl(x.x,q)}</p>
</div>`).join('')}`}
</div>
</div>`;
}
function strip(h){return(h||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();}
function hl(t,q){if(!q)return t;const r=new RegExp('('+q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi');return t.replace(r,'<mark>$1</mark>');}
let _t=null;
function onQ(v){st.sq=v;clearTimeout(_t);_t=setTimeout(()=>{if(st.view==='search')rSearch();},200);}
function goR(id,i){
st.view='section';st.sec=id;st.qi=0;st.qA=[];
window.scrollTo({top:0,behavior:'instant'});render();
setTimeout(()=>{const cs=document.querySelectorAll('.cd');const f=document.querySelector('.fl');if(cs[i]){cs[i].classList.add('op');cs[i].scrollIntoView({behavior:'smooth',block:'center'});}else if(f)f.scrollIntoView({behavior:'smooth',block:'start'});},200);
}

/* TOOLS */
function rTools(){
app.innerHTML=`
<div class="screen on">
<div class="hd"><div class="hi"><h1 class="ht">ابزارهای حرفه‌ای</h1><p class="hs">برای مصاحبه‌گر</p></div></div>
<div class="tv">
<div class="tc" onclick="st.view='checklist';render()"><div class="ti" style="background:#EFF6FF;color:#1E40AF">${ICONS.clip}</div><div class="tin"><h3 class="ttl">چک‌لیست جلسات مصاحبه</h3><p class="tds">جلسه‌محور — با خروجی Excel</p></div></div>
<div class="tc" onclick="st.view='stats';render()"><div class="ti" style="background:#ECFEFF;color:#0891B2">${ICONS.chart}</div><div class="tin"><h3 class="ttl">آمار مصاحبه در بازه زمانی</h3><p class="tds">گزارش Excel با نام داوطلب و تاریخ</p></div></div>
<div class="tc" onclick="st.view='notepad';render()"><div class="ti" style="background:#F0FDF4;color:#16A34A">${ICONS.note}</div><div class="tin"><h3 class="ttl">یادداشت‌بردار مصاحبه</h3><p class="tds">ثبت نکات آزاد</p></div></div>
<div class="tc" onclick="st.view='flashcards';render()"><div class="ti" style="background:#FEF3C7;color:#D97706">${ICONS.cards}</div><div class="tin"><h3 class="ttl">کارت‌های فلش</h3><p class="tds">${tF(FC.length)} مفهوم کلیدی</p></div></div>
<div class="tc" onclick="st.view='glossary';render()"><div class="ti" style="background:#FDF2F8;color:#BE185D">${ICONS.book}</div><div class="tin"><h3 class="ttl">واژه‌نامه تخصصی</h3><p class="tds">${tF(GL.length)} اصطلاح کلیدی</p></div></div>
</div>
</div>`;
}

/* ============ CHECKLIST (Sessions Hub) ============ */
function rChk(){
const td=tk();
const today=st.ss[td]||[];
const all=[];Object.keys(st.ss).forEach(d=>st.ss[d].forEach(s=>all.push({...s,date:d})));
const wk=new Date();wk.setDate(wk.getDate()-7);
const wS=all.filter(s=>{const d=new Date(s.date.replace(/\//g,'-'));return d>=wk;});
const avg=all.length?Math.round(all.reduce((a,s)=>a+(s.percent||0),0)/all.length):0;
app.innerHTML=`
<div class="screen on">
<div class="hd">
<button class="bb" onclick="st.view='tools';render()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></button>
<div class="hi"><h1 class="ht">چک‌لیست جلسات</h1><p class="hs">${st.iv.name||'مصاحبه‌گر'}${st.iv.code?' — '+st.iv.code:''}</p></div>
</div>
<div class="tv">
${!st.iv.name?`<div class="fld" style="background:#FEF3C7;border-color:#F59E0B"><label style="color:#B45309">ابتدا مشخصات مصاحبه‌گر را ثبت کنید</label><button class="btn bp" style="margin-top:5px" onclick="setupIv()">ثبت مشخصات</button></div>`:`
<button class="btn bp" onclick="st.view='newSession';render()">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
جلسه جدید
</button>
<button class="btn bs" onclick="expWeek()">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
گزارش هفته و خروجی Excel
</button>`}
<div class="str">
<div class="stat"><div class="sn2">${tF(today.length)}</div><div class="sl2">امروز</div></div>
<div class="stat"><div class="sn2">${tF(wS.length)}</div><div class="sl2">هفته</div></div>
<div class="stat"><div class="sn2">${tF(avg)}٪</div><div class="sl2">میانگین</div></div>
</div>
${today.length?`<div class="sh"><h2>جلسات امروز</h2><span>${tF(today.length)}</span></div>`:''}
${today.map((s,i)=>sesCard(s,i,td)).join('')}
${!today.length?`<div class="es" style="padding:20px">هنوز جلسه‌ای امروز ثبت نشده.</div>`:''}
</div>
</div>`;
}
function sesCard(s,i,date){
const cl=s.done?'dn':'pg';
return `<div class="ses" onclick="openSes('${date}',${i})">
<div class="sei ${cl}">${s.done?'✓':tF(i+1)}</div>
<div class="sein">
<div class="sen">${s.candidate}</div>
<div class="sem"><span>${s.time||'—'}</span><span>کد: ${s.track||'—'}</span></div>
</div>
<div class="sep">${tF(s.percent||0)}٪</div>
</div>`;
}
function setupIv(){
const n=prompt('نام و نام خانوادگی:');if(!n)return;
const c=prompt('کد سازمانی:');if(!c)return;
const o=prompt('محل خدمت:')||'';
st.iv={name:n,code:c.toUpperCase(),office:o};
SV(K.iv,st.iv);rChk();
}

/* NEW SESSION */
function rNew(){
const now=new Date();
const hh=tF(String(now.getHours()).padStart(2,'0'))+':'+tF(String(now.getMinutes()).padStart(2,'0'));
app.innerHTML=`
<div class="screen on">
<div class="hd">
<button class="bb" onclick="st.view='checklist';render()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></button>
<div class="hi"><h1 class="ht">جلسه جدید</h1><p class="hs">اطلاعات داوطلب</p></div>
</div>
<div class="tv">
<div class="fld"><label>نام داوطلب</label><input type="text" id="nCand" placeholder="نام و نام خانوادگی"></div>
<div class="fld"><label>کد پیگیری پرونده</label><input type="text" id="nTrack" placeholder="مثلاً ۱۲۳۴" dir="ltr"></div>
<div class="fld"><label>ساعت شروع</label><input type="text" id="nTime" value="${hh}" dir="ltr"></div>
<div class="fld"><label>یادداشت اولیه (اختیاری)</label><textarea id="nInit" placeholder="نکات مهم برای این جلسه..."></textarea></div>
<button class="btn bp" style="margin-top:8px" onclick="createSes()">شروع جلسه و باز کردن چک‌لیست</button>
</div>
</div>`;
}
function createSes(){
const c=document.getElementById('nCand').value.trim();
if(!c){alert('نام داوطلب را وارد کنید.');return;}
const t=document.getElementById('nTrack').value.trim();
const tm=document.getElementById('nTime').value.trim();
const ini=document.getElementById('nInit').value.trim();
const d=tk();
if(!st.ss[d])st.ss[d]=[];
const id='s'+Date.now();
st.ss[d].push({id,candidate:c,track:t,time:tm,checks:{},note:ini,done:false,percent:0});
SV(K.ss,st.ss);
st.cur={date:d,id};
st.view='session';render();
}

/* SESSION */
function rSes(){
const d=st.cur.date;
const s=st.ss[d].find(x=>x.id===st.cur.id);
if(!s)return st.view='checklist';
const total=CH.reduce((a,g)=>a+g.i.length,0);
const done=Object.keys(s.checks||{}).length;
const pct=Math.round(done/total*100);
app.innerHTML=`
<div class="screen on">
<div class="hd">
<button class="bb" onclick="if(confirm('بازگشت به لیست؟')){st.view='checklist';render();}"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></button>
<div class="hi"><h1 class="ht">${s.candidate}</h1><p class="hs">${tF(done)} از ${tF(total)} — ${tF(pct)}٪</p></div>
</div>
<div class="tv">
<div class="fld"><label>کد پیگیری</label><input type="text" value="${s.track||''}" oninput="upS('track',this.value)" dir="ltr"></div>
<div class="fld"><label>ساعت شروع</label><input type="text" value="${s.time||''}" oninput="upS('time',this.value)" dir="ltr"></div>
${CH.map((g,gi)=>`
<div class="cs2">
<div class="cst">${g.g}</div>
${g.i.map((it,ii)=>{
const k=gi+'_'+ii;const c=s.checks[k];
return `<div class="cr ${c?'dn':''}" onclick="tChk('${k}')">
<div class="cb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg></div>
<div class="ctt">${it}</div>
</div>`;
}).join('')}
</div>
`).join('')}
<div class="fld"><label>یادداشت جلسه (اختیاری)</label><textarea oninput="upS('note',this.value)" style="min-height:90px">${s.note||''}</textarea></div>
<button class="btn bok" onclick="doneSes()">${s.done?'✓ جلسه تکمیل شده (ویرایش و ذخیره)':'پایان جلسه و ذخیره'}</button>
<button class="btn bd2" onclick="delSes()">حذف این جلسه</button>
</div>
</div>`;
}
function openSes(d,i){const s=st.ss[d][i];st.cur={date:d,id:s.id};st.view='session';render();}
function upS(k,v){
const d=st.cur.date;const s=st.ss[d].find(x=>x.id===st.cur.id);if(!s)return;
s[k]=v;
const total=CH.reduce((a,g)=>a+g.i.length,0);
const done=Object.keys(s.checks||{}).length;
s.percent=Math.round(done/total*100);
SV(K.ss,st.ss);
}
function tChk(k){
const d=st.cur.date;const s=st.ss[d].find(x=>x.id===st.cur.id);if(!s)return;
if(!s.checks)s.checks={};
if(s.checks[k])delete s.checks[k];else s.checks[k]=true;
const total=CH.reduce((a,g)=>a+g.i.length,0);
s.percent=Math.round(Object.keys(s.checks).length/total*100);
SV(K.ss,st.ss);
rSes();
}
function doneSes(){
const d=st.cur.date;const s=st.ss[d].find(x=>x.id===st.cur.id);if(!s)return;
s.done=true;SV(K.ss,st.ss);
md('ذخیره شد','جلسه با موفقیت ذخیره شد.');
setTimeout(()=>{st.view='checklist';render();},1200);
}
function delSes(){
if(!confirm('حذف این جلسه؟ این عمل بازگشت‌ناپذیر است.'))return;
const d=st.cur.date;
st.ss[d]=st.ss[d].filter(x=>x.id!==st.cur.id);
if(!st.ss[d].length)delete st.ss[d];
SV(K.ss,st.ss);
st.view='checklist';render();
}

/* XLSX Export */
function makeXLSX(rows,sheetName,filename){
if(typeof XLSX==='undefined'){alert('کتابخانه Excel لود نشده. اتصال اینترنت را بررسی کنید.');return;}
const ws=XLSX.utils.aoa_to_sheet(rows);
ws['!cols']=[{wch:18},{wch:12},{wch:12},{wch:10},{wch:18},{wch:12},{wch:10},{wch:8},{wch:25}];
const range=XLSX.utils.decode_range(ws['!ref']);
for(let R=range.s.r;R<=range.e.r;R++){
for(let C=range.s.c;C<=range.e.c;C++){
const addr=XLSX.utils.encode_cell({r:R,c:C});
if(!ws[addr])continue;
if(R===0){ws[addr].s={font:{bold:true,color:{rgb:'FFFFFF'},sz:12},fill:{fgColor:{rgb:'1E40AF'}},alignment:{horizontal:'center',vertical:'center'}};}
else{ws[addr].s={alignment:{horizontal:'right',vertical:'center'}};}
}
}
const wb=XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb,ws,sheetName);
XLSX.writeFile(wb,filename);
}
function expWeek(){
const all=[];Object.keys(st.ss).forEach(d=>st.ss[d].forEach(s=>all.push({...s,date:d})));
const wk=new Date();wk.setDate(wk.getDate()-7);
const wS=all.filter(s=>{const d=new Date(s.date.replace(/\//g,'-'));return d>=wk;});
if(!wS.length){alert('در هفته گذشته جلسه‌ای ثبت نشده.');return;}
const total=CH.reduce((a,g)=>a+g.i.length,0);
const rows=[['مصاحبه‌گر','کد سازمانی','تاریخ','ساعت','نام داوطلب','کد پیگیری','تیک‌ها','درصد','یادداشت']];
wS.forEach(s=>{
const done=Object.keys(s.checks||{}).length;
rows.push([st.iv.name||'',st.iv.code||'',s.date,s.time||'',s.candidate,s.track||'-',done+'/'+total,s.percent+'%',s.note||'-']);
});
makeXLSX(rows,'گزارش هفتگی','interview-week-'+tk().replace(/\//g,'-')+'.xlsx');
}

/* STATS */
function rStats(){
app.innerHTML=`
<div class="screen on">
<div class="hd">
<button class="bb" onclick="st.view='tools';render()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></button>
<div class="hi"><h1 class="ht">آمار مصاحبه</h1><p class="hs">در بازه زمانی</p></div>
</div>
<div class="tv">
<div class="fld"><label>از تاریخ (مثال ۱۴۰۴/۰۸/۰۱)</label><input type="text" id="sF" value="${st.sFrom}" dir="ltr"></div>
<div class="fld"><label>تا تاریخ</label><input type="text" id="sT" value="${st.sTo}" dir="ltr"></div>
<div class="br" style="margin-bottom:9px">
<button class="btn bg2" onclick="quickRange('today')">امروز</button>
<button class="btn bg2" onclick="quickRange('week')">این هفته</button>
<button class="btn bg2" onclick="quickRange('month')">این ماه</button>
</div>
<button class="btn bp" onclick="runStats()">نمایش آمار</button>
<div id="sRes"></div>
</div>
</div>`;
}
function quickRange(t){
const now=new Date();
let from=now,to=now;
if(t==='week'){const d=now.getDay();from=new Date(now);from.setDate(now.getDate()-d);}
else if(t==='month'){from=new Date(now.getFullYear(),now.getMonth(),1);}
document.getElementById('sF').value=fD(from);
document.getElementById('sT').value=fD(to);
}
function runStats(){
const f=document.getElementById('sF').value.trim();
const t=document.getElementById('sT').value.trim();
if(!f||!t){alert('تاریخ‌ها را وارد کنید.');return;}
st.sFrom=f;st.sTo=t;
const all=[];
Object.keys(st.ss).forEach(d=>{if(d>=f&&d<=t){st.ss[d].forEach(s=>all.push({...s,date:d}));}});
const total=all.length;
if(!total){document.getElementById('sRes').innerHTML=`<div class="es">در این بازه جلسه‌ای یافت نشد.</div>`;return;}
const avg=Math.round(all.reduce((a,s)=>a+(s.percent||0),0)/total);
const dates=[...new Set(all.map(s=>s.date))];
const workingDays=dates.length;
const avgPerDay=Math.round(total/workingDays*10)/10;
document.getElementById('sRes').innerHTML=`
<div class="str"><div class="stat"><div class="sn2">${tF(total)}</div><div class="sl2">کل جلسات</div></div><div class="stat"><div class="sn2">${tF(avg)}٪</div><div class="sl2">میانگین تیک</div></div></div>
<div class="str"><div class="stat"><div class="sn2">${tF(workingDays)}</div><div class="sl2">روز کاری</div></div><div class="stat"><div class="sn2">${tF(avgPerDay)}</div><div class="sl2">جلسه/روز</div></div></div>
<button class="btn bok" onclick="expStats('${f}','${t}')">دانلود فایل Excel</button>
`;
}
function expStats(f,t){
const total=CH.reduce((a,g)=>a+g.i.length,0);
const rows=[['مصاحبه‌گر','کد سازمانی','تاریخ','ساعت','نام داوطلب','کد پیگیری','تیک‌ها','درصد','یادداشت']];
Object.keys(st.ss).sort().forEach(d=>{
if(d>=f&&d<=t){
st.ss[d].forEach(s=>{
const done=Object.keys(s.checks||{}).length;
rows.push([st.iv.name||'',st.iv.code||'',d,s.time||'',s.candidate,s.track||'-',done+'/'+total,s.percent+'%',s.note||'-']);
});
}
});
makeXLSX(rows,'آمار بازه','interview-stats-'+f.replace(/\//g,'-')+'-to-'+t.replace(/\//g,'-')+'.xlsx');
}

/* NOTEPAD */
function rNote(){
const n=st.nt;
app.innerHTML=`
<div class="screen on">
<div class="hd">
<button class="bb" onclick="st.view='tools';render()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></button>
<div class="hi"><h1 class="ht">یادداشت‌بردار</h1><p class="hs">ثبت نکات آزاد</p></div>
</div>
<div class="tv">
<div class="fld"><label>نام داوطلب</label><input type="text" value="${esc(n.name)}" oninput="svN('name',this.value)"></div>
<div class="fld"><label>سمت / شغل</label><input type="text" value="${esc(n.position)}" oninput="svN('position',this.value)"></div>
<div class="fld"><label>تاریخ</label><input type="text" value="${esc(n.date)}" oninput="svN('date',this.value)" dir="ltr"></div>
<div class="fld"><label>نکات پیش از مصاحبه</label><textarea oninput="svN('before',this.value)">${esc(n.before)}</textarea></div>
<div class="fld"><label>نکات حین مصاحبه</label><textarea oninput="svN('during',this.value)" style="min-height:110px">${esc(n.during)}</textarea></div>
<div class="fld"><label>خلاصه و نتیجه</label><textarea oninput="svN('after',this.value)" style="min-height:90px">${esc(n.after)}</textarea></div>
<div class="br"><button class="btn bp" onclick="expNote()">کپی متن</button><button class="btn bs" onclick="printNote()">چاپ</button></div>
<button class="btn bd2" style="margin-top:9px" onclick="clrNote()">پاک کردن</button>
</div>
</div>`;
}
function esc(s){return(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function svN(f,v){st.nt[f]=v;SV(K.nt,st.nt);}
function expNote(){
const n=st.nt;
const t=`یادداشت مصاحبه گزینش\n============\nنام داوطلب: ${n.name||'-'}\nسمت: ${n.position||'-'}\nتاریخ: ${n.date||'-'}\n\nنکات پیش از مصاحبه:\n${n.before||'-'}\n\nنکات حین مصاحبه:\n${n.during||'-'}\n\nخلاصه و نتیجه:\n${n.after||'-'}`;
if(navigator.clipboard)navigator.clipboard.writeText(t).then(()=>md('کپی شد','متن یادداشت در کلیپ‌بورد کپی شد.')).catch(()=>alert(t));
else alert(t);
}
function printNote(){
const n=st.nt;
const w=window.open('','_blank');
w.document.write(`<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8"><title>یادداشت</title><style>body{font-family:Tahoma;padding:30px;line-height:1.9}h1{color:#1E40AF;border-bottom:2px solid #1E40AF}h3{color:#1E40AF}pre{white-space:pre-wrap;background:#f9fafb;padding:12px;border-radius:8px}</style></head><body><h1>یادداشت مصاحبه گزینش</h1><p><b>نام:</b> ${esc(n.name)||'-'} | <b>سمت:</b> ${esc(n.position)||'-'} | <b>تاریخ:</b> ${esc(n.date)||'-'}</p><h3>پیش از مصاحبه</h3><pre>${esc(n.before)||'-'}</pre><h3>حین مصاحبه</h3><pre>${esc(n.during)||'-'}</pre><h3>خلاصه و نتیجه</h3><pre>${esc(n.after)||'-'}</pre></body></html>`);
w.document.close();setTimeout(()=>w.print(),400);
}
function clrNote(){
if(!confirm('پاک کردن تمام یادداشت؟'))return;
st.nt={name:'',position:'',date:'',before:'',during:'',after:''};
SV(K.nt,st.nt);rNote();
}

/* GLOSSARY */
function rGloss(){
app.innerHTML=`
<div class="screen on">
<div class="hd">
<button class="bb" onclick="st.view='tools';render()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></button>
<div class="hi"><h1 class="ht">واژه‌نامه تخصصی</h1><p class="hs">${tF(GL.length)} اصطلاح</p></div>
</div>
<div class="gv">${GL.map(g=>`<div class="gi" onclick="this.classList.toggle('op')"><div class="gn"><span>${g.t}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></div><div class="gd">${g.d}</div></div>`).join('')}</div>
</div>`;
}

/* FLASHCARDS */
function rFC(){
const c=FC[st.fi];const f=st.fF;
app.innerHTML=`
<div class="screen on">
<div class="hd">
<button class="bb" onclick="st.view='tools';render()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></button>
<div class="hi"><h1 class="ht">کارت‌های فلش</h1><p class="hs">${tF(FC.length)} مفهوم</p></div>
</div>
<div class="fcv">
<div class="fcc ${f?'fl':''}" onclick="flip()">
<div class="fcl">${f?'پاسخ':'پرسش'}</div>
<div class="fct">${f?c.b:c.f}</div>
</div>
<div class="fccn">${tF(st.fi+1)} از ${tF(FC.length)}</div>
<div class="fcc2"><button class="fcb pv" onclick="prevF()">قبلی</button><button class="fcb nx" onclick="nextF()">بعدی</button></div>
</div>
</div>`;
}
function flip(){st.fF=!st.fF;rFC();}
function nextF(){st.fi=(st.fi+1)%FC.length;st.fF=false;rFC();}
function prevF(){st.fi=(st.fi-1+FC.length)%FC.length;st.fF=false;rFC();}

/* PROGRESS */
function rProg(){
const p=OP(),c=402,off=c-(p/100)*c;
const allDone=Object.keys(st.r).length;
const completed=S.filter(s=>{const x=SP(s);return x.d===x.t;}).length;
const qk=Object.keys(st.q);
const qAvg=qk.length?Math.round(qk.reduce((a,k)=>a+st.q[k].best,0)/qk.length):0;
const canCert=p===100&&qk.length===S.length;
app.innerHTML=`
<div class="screen on">
<div class="hd"><div class="hi"><h1 class="ht">پیشرفت مطالعه</h1><p class="hs">نگاهی به مسیر یادگیری</p></div></div>
<div class="pv">
<div class="ph">
<div class="br2"><svg viewBox="0 0 140 140"><circle class="bg3" cx="70" cy="70" r="64"/><circle class="fl3" cx="70" cy="70" r="64" style="stroke-dashoffset:${off}"/></svg><div class="cc3"><div class="nn">${tF(p)}٪</div><div class="ll2">پیشرفت کل</div></div></div>
<div class="str" style="margin-top:18px"><div class="stat"><div class="sn2">${tF(completed)}</div><div class="sl2">بخش</div></div><div class="stat"><div class="sn2">${tF(allDone)}</div><div class="sl2">کارت</div></div><div class="stat"><div class="sn2">${tF(qAvg)}٪</div><div class="sl2">آزمون</div></div></div>
</div>
${canCert?`
<div class="tc" onclick="st.view='certificate';render()" style="background:linear-gradient(135deg,#FEF3C7,#FDE68A);border-color:#B45309">
<div class="ti" style="background:#B45309;color:#fff">${ICONS.award}</div>
<div class="tin"><h3 class="ttl" style="color:#78350F">دریافت گواهی پایان دوره</h3><p class="tds" style="color:#92400E">شما همه بخش‌ها را تکمیل کرده‌اید</p></div>
</div>
<div class="tc" onclick="st.view='examSheet';render()">
<div class="ti" style="background:#1E40AF;color:#fff">${ICONS.sheet}</div>
<div class="tin"><h3 class="ttl">برگه نتیجه آزمون نهایی</h3><p class="tds">قابل چاپ و ثبت در پرونده</p></div>
</div>
`:''}
<div class="sh"><h2>جزئیات بخش‌ها</h2></div>
${S.map(s=>{const x=SP(s);const pt=x.t?Math.round(x.d/x.t*100):0;const qs=st.q[s.id];return`
<div class="li2" onclick="openSec('${s.id}')" style="cursor:pointer">
<div class="lii" style="background:${s.cl};color:${s.color}">${ICONS[s.id]}</div>
<div class="lin">
<h4 class="lnm">${s.title}</h4>
<div class="lbr"><div class="lbf" style="width:${pt}%;background:${s.color}"></div></div>
${qs?`<div style="font-size:10.5px;color:var(--mt);margin-top:3px">آزمون: ${tF(qs.best)}٪</div>`:''}
</div>
<div class="lpt">${tF(pt)}٪</div>
</div>`;}).join('')}
</div>
</div>`;
}

/* CERTIFICATE */
function rCert(){
const p=OP();
if(p<100){app.innerHTML=`<div class="screen on"><div class="hd"><button class="bb" onclick="st.view='progress';render()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></button><div class="hi"><h1 class="ht">گواهی پایان دوره</h1></div></div><div class="es" style="padding:60px 20px">ابتدا همه بخش‌ها را تکمیل کنید.<br><br>پیشرفت فعلی: <b>${tF(p)}٪</b></div></div>`;return;}
const nm=st.cn||'................................................';
const td=new Date();
const ds=fD(td);
const code='HQ-'+td.getFullYear()+'-'+String(td.getMonth()+1).padStart(2,'0')+'-'+Math.floor(Math.random()*9999);
const qk=Object.keys(st.q);const qA=qk.length?Math.round(qk.reduce((a,k)=>a+st.q[k].best,0)/qk.length):0;
app.innerHTML=`
<div class="screen on">
<div class="hd"><button class="bb" onclick="st.view='progress';render()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></button><div class="hi"><h1 class="ht">گواهی پایان دوره</h1><p class="hs">قابل چاپ</p></div></div>
<div class="cv2">
${!st.cn?`<div class="fld"><label>نام خود را وارد کنید</label><input type="text" oninput="svCN(this.value)" placeholder="نام شما" style="font-size:15px;font-weight:700"></div>`:''}
<div class="cp">
<img src="logo.png" class="cpl" alt="">
<h2 class="cpt">گواهی پایان دوره</h2>
<p class="cps">هسته گزینش اداره کل آموزش و پرورش استان قم</p>
<p class="cpb">بدین‌وسیله گواهی می‌شود</p>
<div class="cpn">${nm}</div>
<p class="cpb">دوره آموزشی «راهنمای جامع مصاحبه گزینش» را با موفقیت به پایان رسانده و تمام بخش‌های آموزشی و آزمون‌ها را با موفقیت گذرانده است.</p>
<div class="cpst">
<div class="cpstat"><b>${tF(p)}٪</b>پیشرفت</div>
<div class="cpstat"><b>${tF(qA)}٪</b>میانگین آزمون</div>
<div class="cpstat"><b>${tF(S.length)}</b>بخش</div>
</div>
<div class="cpsig">
<div>مسئول هسته گزینش<b>امضاء و مهر</b></div>
<div>تاریخ صدور<b>${ds}</b></div>
</div>
<div class="cpc">کد پیگیری: ${code}</div>
</div>
<div class="br" style="margin-top:14px">
<button class="btn bp" onclick="window.print()">چاپ</button>
<button class="btn bs" onclick="rstCN()">تغییر نام</button>
</div>
</div>
</div>`;
}
function svCN(v){st.cn=v;localStorage.setItem(K.cn,v);clearTimeout(_t);_t=setTimeout(()=>rCert(),400);}
function rstCN(){st.cn='';localStorage.removeItem(K.cn);rCert();}

/* EXAM SHEET */
function rSheet(){
const p=OP();
if(p<100){app.innerHTML=`<div class="screen on"><div class="hd"><button class="bb" onclick="st.view='progress';render()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></button><div class="hi"><h1 class="ht">برگه نتیجه آزمون نهایی</h1></div></div><div class="es" style="padding:60px 20px">ابتدا همه بخش‌ها را تکمیل کنید.</div></div>`;return;}
const td=new Date();const ds=fD(td);
const code='EX-'+td.getFullYear()+'-'+Math.floor(Math.random()*99999);
let totalQ=0,totalOk=0;
let secsHTML='';
S.forEach((s,si)=>{
const quiz=QZ[s.id];if(!quiz)return;
let secOk=0;
let qHTML='';
quiz.forEach((q,qi)=>{
totalQ++;
const key=s.id+':'+qi;
const ans=st.qa[key];
const ok=ans===q.c;
if(ok){secOk++;totalOk++;}
qHTML+=`<div class="spq ${ok?'ok':'no'}">
<div class="spqt">${tF(qi+1)}. ${q.q}</div>
<div class="spa"><span class="spm ${ok?'ok':'no'}">${ok?'✓ درست':'✗ غلط'}</span><strong>پاسخ شما:</strong> ${ans!==undefined?q.o[ans]:'—'}</div>
${!ok?`<div class="spa" style="background:#F0FDF4"><strong>پاسخ درست:</strong> ${q.o[q.c]}</div>`:''}
</div>`;
});
const pct=Math.round(secOk/quiz.length*100);
secsHTML+=`<div class="spsc">
<div class="spsct"><span>${s.title}</span><span>${tF(secOk)}/${tF(quiz.length)} — ${tF(pct)}٪</span></div>
${qHTML}
</div>`;
});
const totalPct=totalQ?Math.round(totalOk/totalQ*100):0;
const status=totalPct>=70?'قبول':'نیاز به مرور';
app.innerHTML=`
<div class="screen on">
<div class="hd"><button class="bb" onclick="st.view='progress';render()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></button><div class="hi"><h1 class="ht">برگه نتیجه آزمون نهایی</h1><p class="hs">قابل چاپ</p></div></div>
<div class="cv2">
<div class="sp2">
<div class="sph">
<img src="logo.png" class="cpl" alt="">
<div class="spt2">برگه نتیجه آزمون نهایی</div>
<p class="sps">راهنمای جامع مصاحبه گزینش — هسته گزینش آموزش و پرورش قم</p>
</div>
<div class="spi">
<div><b>نام:</b> ${st.auth.name}</div>
<div><b>کد سازمانی:</b> ${st.iv.code||'—'}</div>
<div><b>کد ملی:</b> ${tF(st.auth.nc)}****</div>
<div><b>تاریخ:</b> ${ds}</div>
</div>
${secsHTML}
<div class="spsum">
<div>خلاصه نهایی:</div>
<div><b>${tF(totalPct)}٪</b></div>
<div>${tF(totalOk)} از ${tF(totalQ)} پاسخ درست</div>
<div>وضعیت: <b>${status}</b></div>
</div>
<div class="spf2">
<div>مصاحبه‌گر<b>امضاء</b></div>
<div>مسئول هسته گزینش<b>مهر</b></div>
</div>
<div class="spc">کد پیگیری: ${code}</div>
</div>
<button class="btn bp" style="margin-top:14px" onclick="window.print()">چاپ برگه</button>
</div>
</div>`;
}

/* SETTINGS */
function rSet(){
const th=document.documentElement.getAttribute('data-theme');
const fn=localStorage.getItem(K.fn)||'md';
app.innerHTML=`
<div class="screen on">
<div class="hd"><div class="hi"><h1 class="ht">تنظیمات</h1><p class="hs">شخصی‌سازی</p></div></div>
<div class="sv2">
<div class="sg">
<div class="sgt">نمایش</div>
<div class="sr" onclick="tgTh()"><div><div class="slb">حالت تاریک</div><div class="sdc">برای مطالعه شبانه</div></div><div class="sw ${th==='dark'?'on':''}" id="swTh"></div></div>
<div class="sr" style="cursor:default"><div><div class="slb">اندازه فونت</div><div class="sdc">خوانایی بهتر</div></div>
<div class="fo">
<button class="fopt ${fn==='sm'?'on':''}" onclick="setFn('sm')">کوچک</button>
<button class="fopt ${fn==='md'?'on':''}" onclick="setFn('md')">متوسط</button>
<button class="fopt ${fn==='lg'?'on':''}" onclick="setFn('lg')">بزرگ</button>
</div>
</div>
</div>
<div class="sg">
<div class="sgt">حساب کاربری</div>
<div class="sr" style="cursor:default"><div><div class="slb">${st.auth.name}</div><div class="sdc">کد ملی: ${tF(st.auth.nc)}**** | کد سازمانی: ${st.iv.code||'—'}</div></div></div>
<button class="btn bd2" style="width:calc(100% - 30px);margin:8px 15px" onclick="logout()">خروج از حساب</button>
</div>
<div class="sg">
<div class="sgt">اطلاعات</div>
<div class="sr" style="cursor:default"><div><div class="slb">عنوان</div><div class="sdc">راهنمای جامع مصاحبه گزینش</div></div></div>
<div class="sr" style="cursor:default"><div><div class="slb">تهیه‌کننده</div><div class="sdc">هسته گزینش اداره کل آموزش و پرورش استان قم</div></div></div>
<div class="sr" style="cursor:default"><div><div class="slb">نسخه</div><div class="sdc">۵٫۰ — احراز هویت + جلسه‌محور</div></div></div>
</div>
<div class="sg">
<div class="sgt">مدیریت داده</div>
<button class="btn bd2" style="width:calc(100% - 30px);margin:8px 15px" onclick="clrReads()">پاک کردن پیشرفت مطالعه</button>
<button class="btn bd2" style="width:calc(100% - 30px);margin:0 15px 8px" onclick="clrSes()">پاک کردن جلسات قدیمی (بیش از ۳ ماه)</button>
<button class="btn bd2" style="width:calc(100% - 30px);margin:0 15px 12px" onclick="clrAll()">پاک کردن همه داده‌ها</button>
</div>
</div>
</div>`;
}
function tgTh(){
const c=document.documentElement.getAttribute('data-theme');
const n=c==='dark'?'light':'dark';
document.documentElement.setAttribute('data-theme',n);
localStorage.setItem(K.th,n);
document.getElementById('swTh').classList.toggle('on',n==='dark');
}
function setFn(s){
const m={sm:'0.9',md:'1',lg:'1.15'};
document.documentElement.style.setProperty('--fs',m[s]||'1');
localStorage.setItem(K.fn,s);rSet();
}
function clrReads(){
if(!confirm('پاک کردن پیشرفت مطالعه؟'))return;
st.r={};st.q={};st.qa={};SV(K.r,st.r);SV(K.q,st.q);SV(K.qa,st.qa);
md('انجام شد','پیشرفت مطالعه پاک شد.');
}
function clrSes(){
const cutoff=new Date();cutoff.setDate(cutoff.getDate()-90);
let n=0;
Object.keys(st.ss).forEach(d=>{
const dd=new Date(d.replace(/\//g,'-'));
if(dd<cutoff){n+=st.ss[d].length;delete st.ss[d];}
});
if(!n){md('بدون تغییر','جلسه‌ای قدیمی‌تر از ۳ ماه وجود ندارد.');return;}
if(!confirm(`${n} جلسه قدیمی‌تر از ۳ ماه پیدا شد. حذف شود؟`))return;
SV(K.ss,st.ss);
md('انجام شد',`${n} جلسه قدیمی حذف شد.`);
}
function clrAll(){
if(!confirm('پاک کردن همه داده‌ها؟ این عمل بازگشت‌ناپذیر است.'))return;
[K.r,K.b,K.q,K.qa,K.ct,K.nt,K.cn,K.iv,K.ss].forEach(k=>localStorage.removeItem(k));
load();md('انجام شد','همه داده‌ها پاک شدند.');
setTimeout(()=>{st.view='home';render();},1000);
}

/* MODAL */
function md(t,x){
document.getElementById('mdT').textContent=t;
document.getElementById('mdX').textContent=x;
document.getElementById('md').classList.add('on');
}
function closeMd(){document.getElementById('md').classList.remove('on');}

/* NAV */
document.querySelectorAll('.nb').forEach(b=>{
b.addEventListener('click',()=>{
st.view=b.dataset.n;st.sec=null;st.sq='';st.stab='all';
window.scrollTo({top:0,behavior:'instant'});render();
});
});

if('serviceWorker' in navigator){
window.addEventListener('load',()=>{navigator.serviceWorker.register('sw.js').catch(()=>{});});
}

(function(){
load();
chkAuth();
const th=localStorage.getItem(K.th);
if(th)document.documentElement.setAttribute('data-theme',th);
const fn=localStorage.getItem(K.fn)||'md';
const m={sm:'0.9',md:'1',lg:'1.15'};
document.documentElement.style.setProperty('--fs',m[fn]);
render();
})();
