/* ספירת העומר — UI.
   כל המסכים בנויים מרכיבי מערכת העיצוב (window.OmerDS, בתיקיית ds/). הלוגיקה ב־logic.js. */
const {createElement:h,useState,useEffect,useLayoutEffect,Fragment}=React;
const {OmerRoot,AppHeader,StatusBar,DayHero,Button,TextButton,Banner,DedicationCard,Quote,Tabs,Panel,Siddur,
  CollapsibleGroup,PrayerSection,Highlight,LinkButton,Note,AnaBekoach,Menorah,TrackerGrid,HesedSummary,MiniBar,
  AutoScrollBar,Dialog,Field,Switch,FontSizeControl,AskList,AskItem,Toast}=window.OmerDS;

const tx=s=>stripNikud(s,S.nikud);

/* ============ UI STATE / RE-RENDER ============ */
const UI={settings:false,ask:false,askDays:[],askSel:{},confirm:null,toast:{msg:'',show:false},mini:false,geoBusy:false};
let rerender=()=>{};
function render(){compute();ensureDedic();scheduleReminder();maybeAsk();rerender();}

/* ============ TOAST / SHARE / CONFIRM ============ */
let toastT;
function toast(m){UI.toast={msg:m,show:true};rerender();clearTimeout(toastT);toastT=setTimeout(()=>{UI.toast={msg:m,show:false};rerender();},2600);}
async function share(n){const k=kav(n);const text=`${countText(n,S.nusach)}\n${k.sef}\n`.replace(/[֑-ׇ]/g,'');
  try{if(navigator.share){await navigator.share({text});return;}await navigator.clipboard.writeText(text);toast('הטקסט הועתק');}catch(e){toast('לא ניתן לשתף ממכשיר זה');}}
// חלון אישור פנימי — חלונות confirm של הדפדפן חסומים בתוך ה־artifact ובחלק מאפליקציות ה־PWA
function appConfirm(title,msg,yes){return new Promise(res=>{UI.confirm={title,msg,yes,res};rerender();});}
function closeConfirm(v){const c=UI.confirm;UI.confirm=null;rerender();if(c)c.res(v);}

/* ============ READING ACTIVITY ============ */
let ACT=store.get('omer-activity',{});const sessSeen={};
function scrollPct(){const el=document.getElementById('panel');if(!el)return 0;const r=el.getBoundingClientRect();if(r.height<=0)return 0;return Math.max(0,Math.min(100,(innerHeight-r.top)/r.height*100));}
function fmtDur(s){if(s<60)return s+' שניות';const m=Math.floor(s/60),r=s%60;return m+(m===1?' דקה':' דקות')+(r>=10?' ו־'+r+' שניות':'');}
function actOf(d){return (ACT[ST.year]||{})[d];}
function actNode(d){const a=actOf(d);if(!a||a.sec<10)return null;
  return h(Fragment,null,'לפי רישומי האפליקציה פתחת את סדר הספירה ליום '+gem(d)+(a.opens>1?' '+a.opens+' פעמים, לראשונה':'')+' בשעה ',
    h('b',null,hm(new Date(a.first))),', שהית בו ',h('b',null,fmtDur(a.sec)),' וגללת עד ',h('b',null,Math.round(a.scroll)+'%'),' מהנוסח. אם קראת — סמן כהושלם.');}
function actShort(d){const a=actOf(d);return a&&a.sec>=10?`נרשמה פתיחה ב־${hm(new Date(a.first))}, ${fmtDur(a.sec)}, ${Math.round(a.scroll)}% גלילה`:null;}
setInterval(()=>{
  if(tab!=='sid'||document.hidden||!ST.year)return;const d=viewDay;if(d!==ST.target&&d!==ST.inProg)return;
  const y=ACT[ST.year]=ACT[ST.year]||{};const a=y[d]=y[d]||{first:Date.now(),sec:0,scroll:0,opens:0};
  if(!sessSeen[d]){sessSeen[d]=1;a.opens++;}
  a.sec++;a.last=Date.now();a.scroll=Math.max(a.scroll,scrollPct());
  if(a.sec%5===0)store.set('omer-activity',ACT);
  if(a.sec===10||a.sec%30===0)rerender();
},1000);

/* ============ ASK FOR MISSED DAYS ============ */
function unknownDays(){const lim=pastLimit(),r=[];for(let i=1;i<=lim;i++)if(!T()[i])r.push(i);return r;}
function maybeAsk(){if(askedThisSession)return;if(unknownDays().length){askedThisSession=true;setTimeout(()=>openAsk(),400);}}
function openAsk(){const days=unknownDays();if(!days.length)return;UI.askDays=days;UI.askSel={};UI.ask=true;rerender();}
function closeAsk(){UI.ask=false;rerender();}

/* ============ REMINDERS ============ */
let remT=null;
function nextReminder(){const n=now();let tz=tzeit(ST.t);if(!tz||n>=tz)tz=tzeit(addD(ST.t,1));return tz?new Date(tz.getTime()+S.offset*6e4):null;}
function scheduleReminder(){
  if(remT)clearTimeout(remT);if(!S.remind||S.sim)return;
  const at=nextReminder();if(!at)return;const ms=at-new Date();
  if(ms>0&&ms<864e5)remT=setTimeout(()=>{
    compute();const d=ST.target;if(!d||T()[d]==='y')return;
    const body=countText(d,S.nusach).replace(/[֑-ׇ]/g,'');
    try{if('Notification'in window&&Notification.permission==='granted')new Notification('ספירת העומר — הגיע הזמן',{body});else toast('הגיע הזמן לספור: '+body);}catch(e){toast('הגיע הזמן לספור');}
    render();
  },ms);
}

/* ============ AUTO SCROLL ============ */
let autoOn=false,autoMode=false,touching=false,lastT=0,acc=0;
const SPEEDS=[14,28,50,85,150];
S.speed=Math.min(5,Math.max(1,S.speed|0||2));
function loop(t){if(!autoOn)return;if(lastT&&!touching){acc+=(t-lastT)/1000*SPEEDS[S.speed-1];const px=Math.floor(acc);if(px){window.scrollBy(0,px);acc-=px;}}lastT=t;
  if(innerHeight+scrollY>=document.documentElement.scrollHeight-2){stopAuto();autoMode=false;toast('הגעת לסוף הנוסח');return;}requestAnimationFrame(loop);}
function startAuto(){autoOn=true;autoMode=true;lastT=0;acc=0;const r=document.getElementById('panel').getBoundingClientRect();if(r.top>innerHeight*.5)window.scrollTo({top:scrollY+r.top-70});rerender();requestAnimationFrame(loop);}
function stopAuto(){autoOn=false;rerender();}
const setSpeed=v=>{v=Math.min(5,Math.max(1,v));if(v!==S.speed){S.speed=v;saveS();rerender();}};
let spDrag=null,spMoved=false;
// החלקה על אזור המהירות: כל ~28 פיקסלים = לחיצה אחת על + או −. בעברית + משמאל, לכן החלקה שמאלה מאיצה.
document.addEventListener('pointerdown',e=>{const sp=e.target.closest&&e.target.closest('.spd');if(sp){spDrag={x:e.clientX,v:S.speed,id:e.pointerId,el:sp};spMoved=false;}});
document.addEventListener('pointermove',e=>{if(!spDrag)return;const dx=spDrag.x-e.clientX;
  if(Math.abs(dx)>6&&!spMoved){spMoved=true;spDrag.el.classList.add('drag');try{spDrag.el.setPointerCapture(spDrag.id);}catch(_){}}
  if(spMoved)setSpeed(spDrag.v+Math.round(dx/28));});
const spEnd=()=>{if(!spDrag)return;spDrag.el.classList.remove('drag');spDrag=null;setTimeout(()=>spMoved=false,0);};
document.addEventListener('pointerup',spEnd);document.addEventListener('pointercancel',spEnd);
// גרירה על אזור המהירות לא נחשבת ללחיצה על + או −
document.addEventListener('click',e=>{if(spMoved&&e.target.closest&&e.target.closest('.spd')){e.stopPropagation();e.preventDefault();}},true);
document.addEventListener('keydown',e=>{const sp=e.target.closest&&e.target.closest('.spd');if(!sp)return;
  if(e.key==='ArrowLeft'||e.key==='ArrowUp'){setSpeed(S.speed+1);e.preventDefault();}
  if(e.key==='ArrowRight'||e.key==='ArrowDown'){setSpeed(S.speed-1);e.preventDefault();}});
// גלילה ידנית לא עוצרת — ממשיכים מהמיקום החדש. בזמן מגע האצבע הגלילה האוטומטית ממתינה.
window.addEventListener('touchstart',e=>{if(!e.target.closest('.autobar'))touching=true;},{passive:true});
window.addEventListener('touchend',()=>touching=false,{passive:true});
window.addEventListener('touchcancel',()=>touching=false,{passive:true});
// הקשה על המסך במצב גלילה = לחיצה על כפתור ההפעלה/עצירה
let tapStart=null;
document.addEventListener('pointerdown',e=>{if(autoOn&&!e.target.closest('.autobar')&&e.target.closest('button,a,input,select,textarea,summary,.tabs,.dedic'))stopAuto();tapStart=(autoMode&&tab==='sid'&&!e.target.closest('button,a,input,select,textarea,summary,dialog,.autobar,.tabs,.dedic,.mini'))?{x:e.clientX,y:e.clientY,t:Date.now()}:null;});
document.addEventListener('pointerup',e=>{if(!tapStart)return;const m=Math.hypot(e.clientX-tapStart.x,e.clientY-tapStart.y),dt=Date.now()-tapStart.t;tapStart=null;
  if(m<10&&dt<350){if(autoOn){stopAuto();toast('הגלילה נעצרה — הקש שוב להמשך');}else startAuto();}});

/* ============ DEDICATIONS & QUOTES (shared db) ============ */
let DB=null,DEDS=[],QUOTES=[],STATS={},dIdx=null,dedLoaded=false;
const PRAY=store.get('omer-prayed',{});
const todayKey=()=>{const t=ymd(new Date());return t.y+'-'+t.m+'-'+t.d;};
function shownList(){let s=store.get('omer-shown',{});if(s.date!==todayKey())s={date:todayKey(),ids:[]};s.ids=s.ids.filter(id=>DEDS.some(d=>d.id===id));return s;}
function addShown(){const s=shownList();const fresh=DEDS.filter(d=>!s.ids.includes(d.id)&&!PRAY[d.id]);const pool=fresh.length?fresh:DEDS.filter(d=>!s.ids.includes(d.id));
  if(!pool.length)return false;const d=pool[Math.floor(Math.random()*pool.length)];s.ids.push(d.id);store.set('omer-shown',s);dIdx=s.ids.length-1;bump(d.id,{shown:1});return true;}
const bq={};
function bump(id,f){if(!DB)return;bq[id]=(bq[id]||Promise.resolve()).then(async()=>{
  const ref=DB.doc('stats/'+id),snap=await ref.get(),nx=JSON.parse(JSON.stringify(snap.exists?snap.data():{}));
  for(const[k,v]of Object.entries(f)){if(k==='hour'){nx.hours=nx.hours||{};nx.hours[v]=(nx.hours[v]||0)+1;}else nx[k]=(nx[k]||0)+v;}
  nx.updated=new Date().toISOString();await ref.set(nx);}).catch(()=>{});}
function curDed(){const s=shownList();if(!s.ids.length)return null;if(dIdx===null||dIdx>=s.ids.length)dIdx=s.ids.length-1;return DEDS.find(d=>d.id===s.ids[dIdx]);}
function ensureDedic(){if(DB&&DEDS.length&&!shownList().ids.length)addShown();}
function pray(d,btn){
  PRAY[d.id]={ts:Date.now(),name:d.name,purpose:d.purpose||''};store.set('omer-prayed',PRAY);
  bump(d.id,{prayed:1,hour:String(new Date().getHours())});
  STATS[d.id]=Object.assign({},STATS[d.id],{prayed:((STATS[d.id]&&STATS[d.id].prayed)||0)+1});
  const box=document.querySelector('.dedic'),br=btn?btn.getBoundingClientRect():null,bx=box?box.getBoundingClientRect():null;
  rerender();
  if(box&&br&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    setTimeout(()=>{const b=document.querySelector('.dedic');if(!b)return;
      b.classList.remove('glow');void b.offsetWidth;b.classList.add('glow');
      for(let i=0;i<22;i++){const sp=document.createElement('span');sp.className='spark';
        sp.style.left=(br.left-bx.left+br.width*Math.random())+'px';sp.style.top=(br.top-bx.top+br.height/2)+'px';
        sp.style.setProperty('--dx',(Math.random()*80-40)+'px');sp.style.animationDelay=(Math.random()*.6)+'s';
        b.appendChild(sp);setTimeout(()=>sp.remove(),2600);}},0);
  }
  const n=Object.keys(PRAY).length;toast(n===1?'קיבלת תג: נר ראשון 🕯️':'+10 נקודות חסד');
}
/* display duration of the dedication card */
let dwell=0;
function dedVisible(){const el=document.querySelector('.dedic');if(!el)return false;const r=el.getBoundingClientRect();if(r.height<=0)return false;
  const vis=Math.min(r.bottom,innerHeight)-Math.max(r.top,0);return vis/r.height>=.5;}
setInterval(()=>{if(dedVisible()&&!document.hidden&&DEDS.length)dwell++;if(dwell>=20)flushDwell();},1000);
function flushDwell(){const d=curDed();if(d&&dwell>0)bump(d.id,{dwellSec:dwell});dwell=0;}
document.addEventListener('visibilitychange',()=>{if(document.hidden)flushDwell();});
(async()=>{
  try{DB=window.claude&&window.claude.use?await window.claude.use('db'):null;}catch(e){DB=null;}
  if(!DB){dedLoaded=true;rerender();return;}
  const upd=()=>{ensureDedic();rerender();};
  DB.collection('dedications').onSnapshot(s=>{DEDS=s.docs.map(d=>Object.assign({id:d.id},d.data())).filter(d=>d.active!==false).sort((a,b)=>(a.order||0)-(b.order||0));dedLoaded=true;upd();},()=>{dedLoaded=true;upd();});
  DB.collection('quotes').onSnapshot(s=>{QUOTES=s.docs.map(d=>d.data()).filter(q=>q.active!==false).sort((a,b)=>(a.order||0)-(b.order||0));rerender();},()=>{});
  DB.collection('stats').onSnapshot(s=>{STATS={};s.docs.forEach(d=>STATS[d.id]=d.data());rerender();},()=>{});
})();

function Dedic(){
  if(!DB||!DEDS.length)return null;
  const d=curDed();if(!d)return null;
  const s=shownList(),prayed=!!PRAY[d.id],cnt=(STATS[d.id]&&STATS[d.id].prayed)||0;
  return h(DedicationCard,{purpose:d.purpose||'',name:d.name||'',prayedCount:cnt,prayed,index:dIdx+1,total:s.ids.length,
    onPrev:()=>{flushDwell();dIdx--;rerender();},
    onNext:()=>{flushDwell();dIdx++;rerender();},
    onMore:()=>{flushDwell();bump(d.id,{more:1});if(!addShown())toast('הוצגו כל השמות להיום');rerender();},
    onPray:e=>pray(d,e&&e.currentTarget),
    onUndo:()=>{delete PRAY[d.id];store.set('omer-prayed',PRAY);bump(d.id,{prayed:-1,undo:1});
      STATS[d.id]=Object.assign({},STATS[d.id],{prayed:Math.max(0,((STATS[d.id]&&STATS[d.id].prayed)||1)-1)});rerender();toast('הסימון בוטל');}});
}
function QuoteOfDay(){if(!QUOTES.length)return null;const x=QUOTES[(viewDay-1)%QUOTES.length];return h(Quote,{text:x.text,source:x.source});}

/* ============ HERO ============ */
const hebStrPlus=o=>hebStr(addD(o,1));
function Hero(){
  const vd=viewDay,active=ST.target,isCurrent=vd===active;
  let when;
  if(!active&&!ST.inProg)when=ST.nextStart?`הספירה תתחיל בליל ${hebStrPlus(ST.nextStart)}`:'מחוץ לימי הספירה';
  else if(isCurrent)when=ST.night?'הלילה סופרים':`הערב, מ־${hm(ST.tz)}, נספור`;
  else if(vd===ST.inProg)when='היום — נספר אמש';
  else when='תצוגת יום';

  const acts=[];
  if(isCurrent){
    const done=T()[vd]==='y';
    acts.push(h(Button,{key:'mark',variant:done?'done':'primary',onClick:()=>{if(done)delete T()[vd];else T()[vd]='y';saveT();render();toast(done?'הסימון בוטל':'נרשם כהושלם');}},done?'✓ הושלם':'סמן כהושלם'));
  }else if(active||ST.inProg){
    acts.push(h(TextButton,{key:'back',onClick:()=>{viewDay=active||ST.inProg;render();}},'חזרה לספירה הנוכחית'));
  }
  acts.push(h(Button,{key:'share',variant:'ghost',size:'small',onClick:()=>share(vd)},'שתף'));
  if((isCurrent||vd===ST.inProg)&&T()[vd]!=='y'){const at=actNode(vd);if(at)acts.push(h('div',{key:'act',className:'activity',style:{flexBasis:'100%'}},at));}

  const banners=[];
  if(ST.inProg&&T()[ST.inProg]!=='y'&&T()[ST.inProg]!=='n'){
    const at=actNode(ST.inProg),ip=ST.inProg;
    banners.push(h(Banner,{key:'ask',tone:'warn',title:'האם ספרת אמש?'},
      'אם שכחת — ספור היום עד השקיעה ',h('b',null,'בלי ברכה'),` (יום ${ip}), והערב תמשיך בברכה.`,
      at?h('div',{className:'activity'},at):null,
      h('div',{className:'row',style:{marginTop:8}},
        h(Button,{size:'small',onClick:()=>{T()[ip]='y';saveT();render();}},'סמן כהושלם'),
        h(Button,{size:'small',variant:'ghost',onClick:()=>{T()[ip]='n';saveT();render();}},'לא ספרתי כלל'))));
  }
  if((active||ST.inProg)&&noBracha()){
    banners.push(h(Banner,{key:'nob',tone:'warn',title:'ממשיכים לספור בלי ברכה.'},'לפי הרשום, חסר יום שלם בספירה. נוהגים לשמוע את הברכה מהש"ץ ולענות אמן. במקרה של ספק — שאל רב.'));
  }
  if(!active&&!ST.inProg&&ST.nextStart){
    banners.push(h(Banner,{key:'next'},`הספירה הבאה מתחילה במוצאי יום טוב ראשון של פסח — ${new Date(ST.nextStart.y,ST.nextStart.m-1,ST.nextStart.d).toLocaleDateString('he-IL',{day:'numeric',month:'long',year:'numeric'})} בערב. בינתיים אפשר לעיין בכל ימי הספירה.`));
  }
  return h(DayHero,{day:vd,nusach:S.nusach,nikud:S.nikud,when,
    onPrev:()=>{if(viewDay>1){viewDay--;render();}},onNext:()=>{if(viewDay<49){viewDay++;render();}},
    actions:h(Fragment,null,acts),yesterday:isCurrent&&!!active?true:null},banners);
}

/* ============ PANELS ============ */
function SiddurTab(){
  const n=viewDay,k=kav(n),kids=[];
  if(S.before){
    const open=S.nusach==='ashk'?HINENI:LESHEM+HINENI;
    kids.push(h(CollapsibleGroup,{key:'before',title:'לפני הספירה',open:S.openBefore!==false,onToggle:v=>{S.openBefore=v;saveS();}},
      h(PrayerSection,{title:S.nusach==='ashk'?'הכנה':'לשם יחוד'},tx(open))));
  }
  kids.push(h(PrayerSection,{key:'bracha',title:'ברכה',variant:'blessing',note:noBracha()?'הושמטה ברכה? — לפי הרשום ממשיכים בלי ברכה.':null},tx(BRACHA)));
  kids.push(h(PrayerSection,{key:'count',title:'הספירה',variant:'count',note:'כוונה: '+tx(k.sef),
    after:h('p',{className:'blessing',style:{marginTop:10}},tx(HARACHAMAN))},tx(countText(n,S.nusach))));
  if(S.after){
    // טקסט רציף נשמר כצומת אחד, והמילה של היום בלבד נעטפת (כך הדפדפן מעצב את הניקוד כמו בעבר)
    const ps=[h('b',{key:'t'},tx(PS_TITLE))];let idx=0,buf=' ';
    PS.forEach((v,vi)=>{v.forEach((w,wi)=>{idx++;
      if(idx===n){ps.push(buf);buf='';ps.push(h(Highlight,{key:vi+'-'+wi},tx(w)));}else buf+=tx(w);
      if(wi<v.length-1)buf+=' ';});buf+='. ';});
    ps.push(buf);
    const inner=[
      h(PrayerSection,{key:'ps',title:'למנצח (תהלים סז)',
        headerAction:h(LinkButton,{icon:'menorah',onClick:toMenorah},'בצורת המנורה'),
        note:h(Fragment,null,'מכוונים למילה ',h(Highlight,{soft:true},tx(k.ps.w)),` — המילה ה־${n} במזמור.`)},ps),
      h('section',{key:'ana'},h('h3',null,'אנא בכח'),h(AnaBekoach,{day:n,nikud:S.nikud}),
        h(Note,null,`שבוע ${gem(k.w+1)}: שם ${tx(k.anaFull)}. ${k.d<6?'הלילה מכוונים לאות '+tx(k.ana):'ביום השביעי מכוונים לשם כולו'}.`)),
      h(PrayerSection,{key:'ribono',title:'רבונו של עולם'},tx(RIBONO_A),h(Highlight,null,tx(k.sef)),tx(RIBONO_B))];
    kids.push(h(CollapsibleGroup,{key:'after',title:'אחרי הספירה',open:S.openAfter!==false,onToggle:v=>{S.openAfter=v;saveS();}},inner));
  }
  if((n===ST.target||n===ST.inProg)&&T()[n]!=='y')
    kids.push(h('div',{key:'fin',className:'finish'},h(Button,{onClick:()=>{T()[viewDay]='y';saveT();render();toast('נרשם כהושלם');}},'סיימתי — סמן כהושלם')));
  return h(Siddur,null,kids);
}

function MenorahTab(){
  const [w,setW]=useState(0);
  useLayoutEffect(()=>{const el=document.getElementById('panel');if(!el)return;const f=()=>setW(el.clientWidth);f();
    const ro=new ResizeObserver(f);ro.observe(el);return()=>ro.disconnect();},[]);
  return h(Fragment,null,
    sidReturn!==null?h('div',{className:'backrow'},h(LinkButton,{icon:'chevron-right',onClick:()=>goTab('sid')},'חזרה לנוסח')):null,
    h(Menorah,{day:viewDay,width:w||360,fontScale:S.fs,nikud:S.nikud}));
}

let lpFired=false,lpTimer=null;
function TrackerTab(){
  const cur=ST.target||(ST.inProg?ST.inProg+1:null);
  const vals=Object.values(T());const y=vals.filter(v=>v==='y').length,no=vals.filter(v=>v==='n').length;
  const unk=unknownDays().length;
  const entries=Object.values(PRAY).sort((a,b)=>b.ts-a.ts).map(x=>({name:x.name,purpose:x.purpose,
    when:new Date(x.ts).toLocaleDateString('he-IL',{day:'numeric',month:'numeric'})+' '+hm(new Date(x.ts))}));
  // לחיצה ארוכה על יום פותחת אותו בתצוגה
  const cellDay=e=>{const c=e.target.closest&&e.target.closest('.cell');if(!c)return null;const m=/\d+/.exec(c.getAttribute('aria-label')||'');return m?+m[0]:null;};
  const clear=()=>{if(lpTimer){clearTimeout(lpTimer);lpTimer=null;}};
  return h(Fragment,null,
    h('div',{
      onPointerDownCapture:e=>{const n=cellDay(e);lpFired=false;clear();if(n)lpTimer=setTimeout(()=>{lpTimer=null;lpFired=true;viewDay=n;goTab('sid',true);render();window.scrollTo({top:0,behavior:'smooth'});},550);},
      onPointerUpCapture:clear,onPointerLeave:clear},
      h(TrackerGrid,{statuses:T(),current:cur,tonight:ST.target,onDayClick:n=>{
        if(lpFired){lpFired=false;return;}
        const s=T()[n];const nx=s==='y'?'n':s==='n'?undefined:'y';if(nx)T()[n]=nx;else delete T()[n];saveT();render();}})),
    h('div',{className:'stats'},`ספרת ${y} ימים${no?`, חסרו ${no}`:''}.`,
      unk?h(Fragment,null,' ',h(TextButton,{onClick:()=>openAsk()},`${unk} ימים לא סומנו — סמן עכשיו`)):null),
    h(Note,null,'הקש על יום קודם כדי לשנות את הסימון. לחיצה ארוכה פותחת את היום בתצוגה.'),
    h(HesedSummary,{entries}));
}

/* ============ APP UPDATE (Android APK only) ============ */
// The APK is built by GitHub Actions and published as a GitHub Release (tag build-<N>, N = versionCode).
// The native plugin OmerUpdater (android/.../OmerUpdaterPlugin.java) downloads it and opens Android's installer.
const NATIVE=!!(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform());
const UPD_REPO='yanivmalka/omer-app';
let Updater=null;try{if(NATIVE)Updater=Capacitor.registerPlugin('OmerUpdater');}catch(e){console.error(e);}
const UPD={cur:null,status:'idle',latestCode:0,url:'',pct:0,msg:''};
if(NATIVE&&Updater){
  try{
    Promise.resolve(Updater.getVersion()).then(v=>{UPD.cur=v;rerender();autoCheckUpdate();}).catch(()=>{});
    Promise.resolve(Updater.addListener('progress',e=>{UPD.pct=e.percent||0;rerender();})).catch(()=>{});
  }catch(e){console.error(e);}
}
async function checkUpdate(silent){
  if(!NATIVE||!UPD.cur||UPD.status==='checking'||UPD.status==='downloading')return;
  if(!silent){UPD.status='checking';UPD.msg='';rerender();}
  try{
    const r=await fetch(`https://api.github.com/repos/${UPD_REPO}/releases/latest`,{cache:'no-store',headers:{Accept:'application/vnd.github+json'}});
    if(!r.ok)throw new Error('http '+r.status);
    const rel=await r.json(),code=parseInt(String(rel.tag_name||'').replace(/\D/g,''))||0;
    const apk=(rel.assets||[]).find(a=>/\.apk$/i.test(a.name));
    store.set('omer-upd-check',Date.now());
    if(apk&&code>UPD.cur.versionCode){UPD.status='avail';UPD.latestCode=code;UPD.url=apk.browser_download_url;UPD.msg='';}
    else if(!silent)UPD.status='none';
  }catch(e){if(!silent){UPD.status='error';UPD.msg='לא ניתן לבדוק עדכון כרגע. בדוק חיבור לאינטרנט.';}}
  rerender();
}
function autoCheckUpdate(){const last=store.get('omer-upd-check',0);if(Date.now()-last>6*36e5)checkUpdate(true);}
async function runUpdate(){
  if(!NATIVE||!UPD.url)return;
  UPD.status='downloading';UPD.pct=0;UPD.msg='';rerender();
  try{await Updater.downloadAndInstall({url:UPD.url});UPD.status='avail';UPD.msg='ההתקנה נפתחה. אשר אותה בחלון של אנדרואיד.';}
  catch(e){
    if(e&&e.message==='NEED_PERMISSION'){UPD.status='avail';UPD.msg='אפשר לאפליקציה להתקין עדכונים (מתג "התקנת אפליקציות לא מוכרות" שנפתח), חזור לכאן והקש שוב על "עדכן עכשיו".';}
    else{UPD.status='avail';UPD.msg='ההורדה נכשלה. נסה שוב.';}
  }
  rerender();
}
const updText=()=>UPD.status==='checking'?'בודק…':UPD.status==='downloading'?`מוריד… ${UPD.pct}%`:UPD.status==='none'?'האפליקציה מעודכנת.':UPD.status==='avail'?`גרסה חדשה זמינה (${UPD.latestCode}).`:'';
function UpdateBanner(){
  if(!NATIVE||(UPD.status!=='avail'&&UPD.status!=='downloading'))return null;
  return h(Banner,{title:'יש גרסה חדשה'},UPD.status==='downloading'?`מוריד… ${UPD.pct}%`:(UPD.msg||'אפשר לעדכן בלחיצה אחת.'),
    UPD.status==='avail'?h('div',{className:'row',style:{marginTop:8}},h(Button,{size:'small',onClick:runUpdate},'עדכן עכשיו')):null);
}

/* ============ DIALOGS ============ */
function SettingsDialog(){
  const set=(k,fn=v=>v)=>e=>{S[k]=fn(e.target.type==='checkbox'?e.target.checked:e.target.value);saveS();render();};
  const close=()=>{UI.settings=false;rerender();};
  const opt=l=>h('option',{key:l.id,value:l.id},l.name);
  return h(Dialog,{open:UI.settings,title:'הגדרות',onClose:close,actions:h(Button,{onClick:close},'סגור')},
    h(Field,{label:'נוסח',htmlFor:'sNusach'},h('select',{id:'sNusach',value:S.nusach,onChange:set('nusach')},
      h('option',{value:'em'},'עדות המזרח'),h('option',{value:'sefard'},'ספרד'),h('option',{value:'ashk'},'אשכנז'),h('option',{value:'chabad'},'חב"ד'))),
    h(Field,{label:'ניקוד',htmlFor:'sNikud'},h(Switch,{id:'sNikud',checked:!!S.nikud,onChange:set('nikud')})),
    h(Field,{label:'תפילות לפני הספירה',htmlFor:'sBefore'},h(Switch,{id:'sBefore',checked:!!S.before,onChange:set('before')})),
    h(Field,{label:'תפילות אחרי הספירה',htmlFor:'sAfter'},h(Switch,{id:'sAfter',checked:!!S.after,onChange:set('after')})),
    h(Field,{label:'גודל טקסט'},h(FontSizeControl,{value:S.fs,size:'sm',onChange:setFs})),
    h(Field,{label:'מיקום',hint:'לחישוב צאת הכוכבים',htmlFor:'sLoc'},
      h('select',{id:'sLoc',value:S.loc,onChange:set('loc')},
        S.custom?h('option',{value:'custom'},S.custom.name):null,
        h('optgroup',{label:'ישראל'},LOCS.filter(l=>l.g==='il').map(opt)),
        h('optgroup',{label:'חוץ לארץ'},LOCS.filter(l=>l.g!=='il').map(opt)))),
    h(Field,{label:'מיקום נוכחי'},h(Button,{variant:'ghost',size:'small',disabled:UI.geoBusy,onClick:geoLocate},UI.geoBusy?'מאתר…':'אתר אותי')),
    h(Field,{label:'שיטת צאת הכוכבים',htmlFor:'sTzeit'},h('select',{id:'sTzeit',value:S.tzeit,onChange:set('tzeit')},
      h('option',{value:'d8.5'},'8.5° מתחת לאופק'),h('option',{value:'d7.083'},"7.083° (ג' כוכבים בינוניים)"),
      h('option',{value:'m18'},"18 דק' אחרי השקיעה"),h('option',{value:'m20'},"20 דק' אחרי השקיעה"),h('option',{value:'m72'},'72 דק\' (ר"ת)'))),
    h(Field,{label:'תזכורת',hint:'התראה בצאת הכוכבים',htmlFor:'sRemind'},h(Switch,{id:'sRemind',checked:!!S.remind,onChange:onRemind})),
    h(Field,{label:'דקות אחרי צאת הכוכבים',htmlFor:'sOffset'},h('input',{id:'sOffset',type:'number',min:0,max:240,step:5,style:{width:80},value:S.offset,onChange:set('offset',v=>Math.max(0,parseInt(v)||0))})),
    h(Field,{label:'ערכת צבע',htmlFor:'sTheme'},h('select',{id:'sTheme',value:S.theme,onChange:set('theme')},
      h('option',{value:'auto'},'לפי המכשיר'),h('option',{value:'light'},'בהירה'),h('option',{value:'dark'},'כהה'))),
    h(Field,{label:'תצוגה לפי תאריך אחר',hint:'לבדיקה ותצוגה מקדימה',htmlFor:'sSim'},
      h('input',{id:'sSim',type:'datetime-local',value:S.sim||'',onChange:e=>{S.sim=e.target.value;saveS();viewDay=null;askedThisSession=false;render();}})),
    NATIVE?h(Field,{label:'עדכון אפליקציה',hint:[UPD.cur?'גרסה '+UPD.cur.versionName:'',updText()||'',UPD.msg].filter(Boolean).join(' · ')},
      UPD.status==='avail'?h(Button,{size:'small',onClick:runUpdate},'עדכן עכשיו'):
      h(Button,{variant:'ghost',size:'small',disabled:UPD.status==='checking'||UPD.status==='downloading',onClick:()=>checkUpdate(false)},'בדוק עדכון')):null,
    h(Field,{label:'הגדרות משתמש',hint:'נוסח, תצוגה, מיקום ותזכורות'},h(Button,{variant:'ghost',size:'small',onClick:resetSettings},'אפס הגדרות')),
    h(Field,{label:'נתוני מעקב',hint:'ימים שסומנו, זמני קריאה ושמות שהוזכרו'},h(Button,{variant:'ghost',size:'small',onClick:resetData},'מחק הכל')));
}
function setFs(v){S.fs=Math.min(1.4,Math.max(.8,+(+v).toFixed(1)));saveS();render();}
async function onRemind(e){
  S.remind=e.target.checked;saveS();
  if(S.remind&&'Notification'in window&&Notification.permission==='default'){try{await Notification.requestPermission();}catch(err){}}
  if(S.remind){const at=nextReminder();toast(at?'תזכורת הבאה: '+at.toLocaleString('he-IL',{weekday:'long',hour:'2-digit',minute:'2-digit'}):'התזכורת הופעלה');}
  render();
}
async function resetSettings(){
  if(await appConfirm('איפוס הגדרות','כל ההגדרות יחזרו לברירת המחדל. נתוני המעקב יישמרו.','אפס הגדרות')){S=Object.assign({},DEF);saveS();render();toast('ההגדרות אופסו');}
}
async function resetData(){
  if(!await appConfirm('מחיקת נתוני המעקב','יימחקו הימים שסומנו, רישומי הקריאה, השמות שהזכרת בתפילה והנקודות. ההגדרות יישמרו.','מחק הכל'))return;
  TRACK={};saveT();
  for(const k in ACT)delete ACT[k];store.set('omer-activity',ACT);
  for(const k in PRAY)delete PRAY[k];store.set('omer-prayed',PRAY);
  try{localStorage.removeItem('omer-shown');}catch(e){}
  for(const k in sessSeen)delete sessSeen[k];dIdx=null;askedThisSession=false;
  UI.settings=false;render();toast('נתוני המעקב נמחקו');
}
// איתור מיקום: GPS כשהוא זמין; אחרת (למשל כשהדפדפן או המסגרת חוסמים) — לפי אזור הזמן של המכשיר
function nearest(lat,lng){let best=null,bd=1e9;LOCS.forEach(l=>{const d=Math.hypot(l.lat-lat,(l.lng-lng)*Math.cos(lat*rad));if(d<bd){bd=d;best=l;}});return {l:best,km:bd*111};}
function byTimezone(){let tz='';try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||'';}catch(e){}
  if(tz==='Asia/Jerusalem'||tz==='Asia/Tel_Aviv')return LOCS[0];return LOCS.find(l=>(l.tz||[]).includes(tz))||null;}
function tzFallback(reason){const l=byTimezone();
  if(l){S.loc=l.id;saveS();render();toast(`${reason} נבחרה ${l.name} לפי אזור הזמן — אפשר לדייק מהרשימה`);}
  else toast(`${reason} בחר עיר מהרשימה`);}
function geoLocate(){
  if(!navigator.geolocation){tzFallback('איתור GPS לא זמין במכשיר.');return;}
  UI.geoBusy=true;rerender();let done=false;
  const finish=()=>{done=true;UI.geoBusy=false;rerender();};
  const guard=setTimeout(()=>{if(!done){finish();tzFallback('האיתור לא הגיב.');}},10000);
  try{navigator.geolocation.getCurrentPosition(p=>{if(done)return;clearTimeout(guard);finish();
      const {latitude:lat,longitude:lng}=p.coords,nr=nearest(lat,lng);
      S.custom={name:nr.km<25?`המיקום שלי (${nr.l.name})`:'המיקום שלי',lat,lng};S.loc='custom';saveS();render();toast('המיקום עודכן');},
    e=>{if(done)return;clearTimeout(guard);finish();tzFallback(e&&e.code===1?'אין הרשאת מיקום.':'לא ניתן לאתר כרגע.');},
    {enableHighAccuracy:false,timeout:9000,maximumAge:600000});}
  catch(e){clearTimeout(guard);finish();tzFallback('איתור GPS חסום כאן.');}
}

function AskDialog(){
  const sel=UI.askSel;
  const close=()=>{UI.ask=false;rerender();};
  return h(Dialog,{open:UI.ask,title:'האם ספרת בימים האלה?',onClose:close,
    actions:h(Fragment,null,
      h(Button,{variant:'ghost',size:'small',onClick:close},'אחר כך'),
      h(Button,{onClick:()=>{Object.entries(sel).forEach(([d,v])=>T()[d]=v);saveT();UI.ask=false;render();}},'שמור'))},
    h(Note,null,'לא השתמשת באפליקציה בימים אלה. סמן כדי שנדע אם ממשיכים לספור בברכה.'),
    h(AskList,null,UI.askDays.map(d=>h(AskItem,{key:d,label:h(Fragment,null,'יום '+gem(d)+' ',h('small',{className:'note'},`(${d})`)),
      detail:actShort(d),value:sel[d],onChange:v=>{UI.askSel={...UI.askSel,[d]:v};rerender();}}))),
    h('div',{className:'row'},h(Button,{variant:'ghost',size:'small',onClick:()=>{unknownDays().forEach(d=>T()[d]='y');saveT();UI.ask=false;render();}},'ספרתי בכולם')));
}
function ConfirmDialog(){
  const c=UI.confirm;
  return h(Dialog,{open:!!c,title:c&&c.title,onClose:()=>closeConfirm(false),
    actions:h(Fragment,null,h(Button,{variant:'ghost',onClick:()=>closeConfirm(false)},'ביטול'),h(Button,{variant:'danger',onClick:()=>closeConfirm(true)},c&&c.yes))},
    h('p',{style:{margin:'0 0 16px'}},c&&c.msg));
}

/* ============ NAV ============ */
let sidY=null,sidReturn=null; // מיקום הגלילה בנוסח, לחזרה בדיוק לאותו מקום
function goTab(t,noScroll){if(t===tab)return;if(tab==='sid')sidY=scrollY;if(t==='sid'){sidReturn=null;}
  if(autoOn||autoMode){autoOn=false;autoMode=false;}
  tab=t;rerender(true);
  if(noScroll)return;
  if(t==='sid'&&sidY!==null){const y=sidY;requestAnimationFrame(()=>window.scrollTo({top:y}));}
  else{const r=document.getElementById('panel').getBoundingClientRect();if(r.top<0)window.scrollTo({top:scrollY+r.top-80});}}
function toMenorah(){sidY=scrollY;sidReturn=sidY;tab='men';if(autoOn||autoMode){autoOn=false;autoMode=false;}rerender(true);
  const r=document.getElementById('panel').getBoundingClientRect();window.scrollTo({top:scrollY+r.top-80});}

/* ============ APP ============ */
function toggleTheme(){const dark=S.theme==='dark'||(S.theme==='auto'&&matchMedia('(prefers-color-scheme: dark)').matches);S.theme=dark?'light':'dark';saveS();render();}
function openSettings(){UI.settings=true;rerender();}

function App(){
  const [,setV]=useState(0);
  rerender=sync=>{if(sync===true)ReactDOM.flushSync(()=>setV(v=>v+1));else setV(v=>v+1);};
  useLayoutEffect(()=>{
    if(S.theme==='auto')document.documentElement.removeAttribute('data-theme');else document.documentElement.setAttribute('data-theme',S.theme);
  });
  useEffect(()=>{ // הסרגל המקוצר לא ניתן למיקוד כשהוא מוסתר
    document.querySelectorAll('.mini button').forEach(b=>b.tabIndex=UI.mini?0:-1);
    const m=document.querySelector('.mini');if(m)m.setAttribute('aria-hidden',String(!UI.mini));
  });
  useEffect(()=>{
    let raf=0;const check=()=>{raf=0;const hero=document.querySelector('.hero');if(!hero)return;const show=hero.getBoundingClientRect().bottom<0;if(show!==UI.mini){UI.mini=show;rerender();}};
    const onScroll=()=>{if(!raf)raf=requestAnimationFrame(check);};
    window.addEventListener('scroll',onScroll,{passive:true});
    const onVis=()=>{if(!document.hidden)render();};document.addEventListener('visibilitychange',onVis);
    const iv=setInterval(()=>{const before=ST.target+'|'+ST.night;compute();if(before!==ST.target+'|'+ST.night){viewDay=null;render();}},60000);
    return()=>{window.removeEventListener('scroll',onScroll);document.removeEventListener('visibilitychange',onVis);clearInterval(iv);};
  },[]);

  const L=loc(),status=[{label:L.name}];
  if(ST.night&&ST.n<ST.al)status.push({label:'אפשר לספור בברכה עד עלות השחר',value:hm(ST.al)});
  else status.push({label:'צאת הכוכבים'+(ST.night?' היה':''),value:hm(ST.tz)});
  if(S.sim)status.push({value:'מצב תצוגה מקדימה'});

  return h(OmerRoot,{theme:S.theme,fontScale:S.fs},
    h(MiniBar,{day:viewDay,nusach:S.nusach,visible:UI.mini,fontScale:S.fs,onFontScale:setFs,onToggleTheme:toggleTheme,onSettings:openSettings,
      onCountClick:()=>window.scrollTo({top:0,behavior:'smooth'})}),
    h('div',{className:'wrap'},
      h(AppHeader,{hebDate:(ST.night?'ליל ':'')+hebStr(ST.night?ST.cur:ST.t),fontScale:S.fs,onFontScale:setFs,onToggleTheme:toggleTheme,onSettings:openSettings}),
      h(StatusBar,{items:status}),
      h(UpdateBanner),
      h(Hero),
      h(Dedic),
      h(QuoteOfDay),
      h(Tabs,{items:[{id:'sid',label:'סדר הספירה'},{id:'men',label:'מנורה'},{id:'trk',label:'המעקב שלי'}],value:tab,onChange:goTab}),
      h(Panel,{id:'panel'},tab==='sid'?h(SiddurTab):tab==='men'?h(MenorahTab):h(TrackerTab))),
    tab==='sid'?h(AutoScrollBar,{playing:autoOn,speed:S.speed,onToggle:()=>autoOn?stopAuto():startAuto(),onSpeed:setSpeed}):null,
    h(SettingsDialog),h(AskDialog),h(ConfirmDialog),
    h(Toast,{message:UI.toast.msg,visible:UI.toast.show}));
}

compute();
ReactDOM.createRoot(document.getElementById('app')).render(h(App));
setTimeout(()=>{ensureDedic();scheduleReminder();maybeAsk();},0);
