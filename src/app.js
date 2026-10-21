/* ספירת העומר — UI.
   כל המסכים בנויים מרכיבי מערכת העיצוב (window.OmerDS, בתיקיית ds/). הלוגיקה ב־logic.js. */
const {createElement:h,useState,useEffect,useLayoutEffect,Fragment}=React;
const {OmerRoot,AppHeader,StatusBar,DayHero,Button,TextButton,Banner,DedicationCard,Quote,Tabs,Panel,Siddur,
  CollapsibleGroup,PrayerSection,Highlight,LinkButton,Note,AnaBekoach,Menorah,TrackerGrid,HesedSummary,MiniBar,
  AutoScrollBar,Dialog,Field,Switch,FontSizeControl,AskList,AskItem,Toast,Icon,IconButton}=window.OmerDS;

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
// תזכורות חכמות (reminderPlan ב־logic.js): בערב, ואם עוד לא סומן — שוב אחרי שעה, מאוחר בערב, בבוקר ולפני השקיעה.
// באפליקציה: התראות מקומיות (@capacitor/local-notifications) מתוזמנות ל־7 ימים קדימה, עם כפתור "ספרתי" בהתראה.
// בדפדפן: רק כשהאפליקציה פתוחה (טיימר + Service Worker להצגה עם כפתור).
const noNik=x=>String(x).replace(/[֑-ׇ]/g,'');
function remText(it){const g=gem(it.n);
  switch(it.kind){
    case 'eve':return{title:`ספירת העומר — הלילה ${g}`,body:noNik(countText(it.n,S.nusach))};
    case 'eve2':case 'late':return{title:'עדיין לא סימנת שספרת',body:`הלילה סופרים יום ${g} לעומר. אפשר לספור בברכה עד עלות השחר.`};
    case 'morn':return{title:'ספרת אמש?',body:`אם שכחת — ספור היום בלי ברכה (יום ${g}), עד השקיעה. אם ספרת — סמן.`};
    default:return{title:'לפני השקיעה',body:`אם לא ספרת אמש — ספור עכשיו, לפני השקיעה, בלי ברכה (יום ${g}), כדי להמשיך לספור בברכה.`};}}
function remPlan(){
  if(!S.remind||S.sim)return [];
  return reminderPlan(new Date(),7).filter(it=>{const v=(TRACK[it.year]||{})[it.n];return v!=='y'&&v!=='n';});}
function markCounted(n,year){n=+n;year=+year||ST.year;if(!n)return;
  if(!TRACK[year])TRACK[year]={};TRACK[year][n]='y';saveT();cancelSnooze();render();toast('נרשם כהושלם');}
// "תזכיר לי בהמשך": תזכורת אחת נוספת בעוד חצי שעה (לפני השקיעה — רבע שעה). מזהה 500, לא נמחק בסנכרון; מתבטל כשמסמנים.
const SNOOZE_ID=500;let snoozeWebT=null;
function cancelSnooze(){clearTimeout(snoozeWebT);if(LN)try{LN.cancel({notifications:[{id:SNOOZE_ID}]}).catch(()=>{});}catch(e){}}
async function snoozeReminder(n,year,kind){n=+n;year=+year||ST.year;if(!n)return;
  const mins=kind==='sunset'?15:30,it={id:SNOOZE_ID,kind:kind||'eve',n,year,at:new Date(Date.now()+mins*6e4)};
  if(NATIVE){const L=(await lnInit())?LN:null;if(!L)return;
    try{await L.schedule({notifications:[Object.assign(remText(it),{id:SNOOZE_ID,schedule:{at:it.at,allowWhileIdle:true},isExactNotification:REMST.exact==='granted',
      channelId:'omer',actionTypeId:'OMER',autoCancel:true,extra:{n,year,kind:it.kind}})]});}catch(e){toast('שגיאה: '+(e&&e.message||e));return;}}
  else{clearTimeout(snoozeWebT);snoozeWebT=setTimeout(()=>{const v=(TRACK[year]||{})[n];if(v!=='y'&&v!=='n')showWebNotif(it);},mins*6e4);}
  toast(`נזכיר לך בעוד ${mins===30?'חצי שעה':'רבע שעה'}`);}
let LN=null,lnReady=null;
// האם האפליקציה נפתחה בגלל הלחיצה על ההתראה (אז ממזערים אחרי הפעולה) או שהייתה פתוחה מקודם (לא סוגרים)
let shownAt=Date.now();document.addEventListener('visibilitychange',()=>{if(!document.hidden)shownAt=Date.now();});
const openedByNotification=()=>document.hidden||Date.now()-shownAt<2500;
function minimizeIfOpenedByNotification(){if(!openedByNotification())return;const A=nativePlugin('App');if(A&&A.minimizeApp)setTimeout(()=>A.minimizeApp().catch(()=>{}),1200);}
function lnInit(){if(lnReady)return lnReady;
  lnReady=(async()=>{LN=nativePlugin('LocalNotifications');if(!LN)return null;
    try{await LN.createChannel({id:'omer',name:'תזכורת לספירת העומר',importance:4,visibility:1,vibration:true});}catch(e){}
    try{await LN.registerActionTypes({types:[{id:'OMER',actions:[{id:'done',title:'ספרתי ✓'},{id:'later',title:'תזכיר לי בהמשך'}]}]});}catch(e){}
    LN.addListener('localNotificationActionPerformed',ev=>{const x=(ev&&ev.notification&&ev.notification.extra)||{};
      // סימון/דחייה מההתראה: אם האפליקציה נפתחה רק בשביל זה — מחזירים את המשתמש למה שעשה; אם הייתה פתוחה — נשארים
      if(ev.actionId==='done'){markCounted(x.n,x.year);minimizeIfOpenedByNotification();}
      else if(ev.actionId==='later'){snoozeReminder(x.n,x.year,x.kind);minimizeIfOpenedByNotification();}
      else if(x.n&&(x.n===ST.target||x.n===ST.inProg)){viewDay=x.n;if(tab!=='sid')goTab('sid',true);render();window.scrollTo({top:0});}});
    return true;})(); // לא להחזיר את אובייקט התוסף מתוך Promise — Capacitor זורק "LocalNotifications.then() is not implemented"
  return lnReady;}
let remSyncT=null,remWebT=null;
function scheduleReminder(){clearTimeout(remSyncT);remSyncT=setTimeout(syncReminders,400);}
// מצב ההרשאות באנדרואיד (מוצג בהגדרות): התראות + "התראות ותזכורות" (שעון מעורר מדויק)
const REMST={display:null,exact:null};
async function remStatus(){const L=(await lnInit())?LN:null;if(!L)return REMST;
  try{REMST.display=(await L.checkPermissions()).display;}catch(e){}
  try{REMST.exact=(await L.checkExactNotificationSetting()).exact_alarm;}catch(e){REMST.exact='granted';}
  rerender();return REMST;}
async function syncReminders(){
  const plan=remPlan();
  if(NATIVE){const L=(await lnInit())?LN:null;if(!L)return;
    try{await remStatus();
      // מבטלים רק תזכורות של התוכנית (מזהה ≥ 1000) — לא את התראת הניסיון
      const p=await L.getPending(),old=((p&&p.notifications)||[]).filter(x=>+x.id>=1000);
      if(old.length)await L.cancel({notifications:old.map(x=>({id:x.id}))});
      // זמן מדויק רק אם המשתמש אישר; אחרת התוסף היה פותח את מסך ההגדרות בכל תזמון
      const exact=REMST.exact==='granted';
      if(plan.length)await L.schedule({notifications:plan.map(it=>Object.assign(remText(it),{id:it.id,schedule:{at:it.at,allowWhileIdle:true},
        isExactNotification:exact,channelId:'omer',actionTypeId:'OMER',autoCancel:true,extra:{n:it.n,year:it.year,kind:it.kind}}))});}
    catch(e){console.warn('reminders',e);}
    return;}
  clearTimeout(remWebT);const it=plan[0];if(!it)return;const ms=it.at-new Date();
  if(ms>0&&ms<864e5)remWebT=setTimeout(()=>{const v=(TRACK[it.year]||{})[it.n];if(v!=='y'&&v!=='n')showWebNotif(it);scheduleReminder();},ms);
}
async function showWebNotif(it){const {title,body}=remText(it);
  try{if('Notification'in window&&Notification.permission==='granted'){
      const reg=navigator.serviceWorker&&await navigator.serviceWorker.getRegistration();
      const opt={body,dir:'rtl',lang:'he',tag:'omer-'+it.id,icon:'icons/icon-192.png',data:{n:it.n,year:it.year,kind:it.kind}};
      if(reg&&reg.showNotification)return reg.showNotification(title,Object.assign(opt,{actions:[{action:'done',title:'ספרתי ✓'},{action:'later',title:'תזכיר לי בהמשך'}]}));
      return new Notification(title,opt);}}catch(e){}
  toast(title+' — '+body);}
async function remPermission(){
  if(NATIVE){const L=(await lnInit())?LN:null;if(!L)return false;
    try{let p=await L.checkPermissions();if(p.display!=='granted')p=await L.requestPermissions();return p.display==='granted';}catch(e){return false;}}
  if(!('Notification'in window))return false;
  if(Notification.permission==='default'){try{await Notification.requestPermission();}catch(e){}}
  return Notification.permission==='granted';}
async function setRemind(on){
  S.remind=!!on;S.remindAsked=true;saveS();render();
  if(!on){scheduleReminder();return;}
  const ok=await remPermission();
  if(!ok)toast(NATIVE?'כדי לקבל תזכורות יש לאשר התראות לאפליקציה בהגדרות הטלפון':'הדפדפן לא מאשר התראות — התזכורת תוצג רק כשהאפליקציה פתוחה');
  if(NATIVE&&ok){await remStatus();if(REMST.exact==='denied'&&await appConfirm('תזכורת בזמן מדויק','כדי שהתזכורת תגיע בדיוק בצאת הכוכבים, אנדרואיד מבקש לאשר "התראות ותזכורות" לאפליקציה. לפתוח את ההגדרה?','פתח הגדרה'))await askExact();}
  const next=remPlan()[0];
  if(next)toast('תזכורת הבאה: '+next.at.toLocaleString('he-IL',{weekday:'long',hour:'2-digit',minute:'2-digit'}));
  else if(ok)toast('התזכורות הופעלו — יתחילו בימי הספירה');
  scheduleReminder();}
async function testReminder(){const ok=await remPermission();if(!ok){toast(NATIVE?'ההתראות חסומות — אשר אותן בהגדרות הטלפון':'ההתראות לא אושרו');return;}
  const n=ST.target||ST.inProg||viewDay||1,it={id:99,kind:'eve',n,year:ST.year,at:new Date()};
  if(NATIVE){const L=(await lnInit())?LN:null;
    // מוצגת מיד (בלי תזמון) — בודק הרשאה, ערוץ וכפתור "ספרתי"
    try{await L.schedule({notifications:[Object.assign(remText(it),{id:99,isExactNotification:false,channelId:'omer',actionTypeId:'OMER',autoCancel:true,extra:{n,year:it.year}})]});}
    catch(e){toast('שגיאה בהצגת ההתראה: '+(e&&e.message||e));return;}
    toast('נשלחה התראת ניסיון — בדוק בשורת ההתראות');remStatus();return;}
  setTimeout(()=>showWebNotif(it),3000);toast('התראת ניסיון תופיע בעוד 3 שניות');}
async function askExact(){const L=(await lnInit())?LN:null;if(!L)return;try{await L.changeExactNotificationSetting();}catch(e){}await remStatus();scheduleReminder();}
async function askDisplay(){const ok=await remPermission();if(!ok){toast('יש לאשר התראות בהגדרות הטלפון ← אפליקציות ← ספירת העומר ← התראות');}await remStatus();scheduleReminder();}
// סימון מהתראה בדפדפן (sw.js שולח הודעה, או פותח את האפליקציה עם #done=שנה-יום)
if(navigator.serviceWorker)navigator.serviceWorker.addEventListener('message',e=>{const d=e.data||{};if(d.type==='omer-done')markCounted(d.n,d.year);else if(d.type==='omer-later')snoozeReminder(d.n,d.year,d.kind);});
function doneFromHash(){const m=/#done=(\d+)-(\d+)/.exec(location.hash);if(m){history.replaceState(null,'',location.pathname+location.search);setTimeout(()=>markCounted(m[2],m[1]),300);}}

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

/* ============ PREVIEW (simulated date, for testing) ============ */
const pad2=x=>String(x).padStart(2,'0');
const toLocalInput=d=>`${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
function setSim(v){S.sim=v;saveS();viewDay=null;askedThisSession=false;render();}
function jumpToStart(){const o=ST.nextStart;if(!o)return;const tz=tzeit(o);
  const d=tz?new Date(tz.getTime()+15*6e4):new Date(o.y,o.m-1,o.d,21,0);
  setSim(toLocalInput(d));window.scrollTo({top:0,behavior:'smooth'});toast('מצב בדיקה: ליל היום הראשון לעומר');}
function PreviewBanner(){if(!S.sim)return null;
  return h(Banner,{tone:'warn',title:'מצב בדיקה'},`התצוגה לפי ${new Date(S.sim).toLocaleString('he-IL',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'})}. `,
    h(TextButton,{onClick:()=>{setSim('');toast('חזרה לתאריך האמיתי');}},'חזרה לתאריך האמיתי'));}

/* ============ DAY CHANGE: FADE ONLY WHAT CHANGES ============ */
// מעבר יום (החלקה / חיצים): כרטיס אחד שלא זז. היום החדש מרונדר קודם ב"צל" (React root מנותק),
// משווים אותו לתצוגה הנוכחית, ורק אלמנטים שהתוכן שלהם משתנה דועכים החוצה ואז נכנסים מחדש — בסדר מלמעלה למטה.
// טקסט קבוע (ברכה, לשם יחוד, תוויות, המזמור עצמו) לא מושפע; במזמור רק ההדגשה עוברת.
// דעיכה מינימלית: הטקסט יורד רק ל־DIP (לא נעלם), מתחלף ועולה — תחושת המשכיות, בלי חור ריק
const FADE_OUT=90,FADE_IN=170,DIP=.3,STAGGER=6,STAGGER_MAX=48;let swBusy=false;
function ownText(el){let s='';for(const c of el.childNodes)if(c.nodeType===3)s+=c.nodeValue;return s;}
function sigOf(el){return el.tagName+'|'+(el.getAttribute('class')||'')+'|'+(el.children.length?ownText(el):el.textContent);}
// משווה עץ ישן מול עץ חדש. ילדים מותאמים לפי (תגית+class) והמופע ה־k שלהם, כך שכפתור/באנר שנוסף או הוסר
// לא גורם לכל הכרטיס להיחשב "משתנה". oldOut = מה שדועך החוצה, newOut = מה שנכנס.
function diffPaths(a,b,pa,pb,oldOut,newOut){
  // מזמור: רק ההדגשה זזה בתוך פסקה שהטקסט שלה זהה — לא מדעיכים את כל הפסקה, רק את ההדגשה
  const same=sigOf(a)===sigOf(b)||(a.tagName===b.tagName&&a.getAttribute('class')===b.getAttribute('class')&&a.children.length&&a.textContent===b.textContent);
  if(a.tagName!==b.tagName||!same){oldOut.push(pa);newOut.push(pb);return;}
  diffChildren(a,b,pa,pb,oldOut,newOut);
}
function diffChildren(a,b,pa,pb,oldOut,newOut){
  const key=e=>e.tagName+'.'+(e.getAttribute('class')||'');
  const seen={},bMap={};
  Array.from(b.children).forEach((e,j)=>{const k=key(e),c=bMap[k]=bMap[k]||[];c.push(j);});
  const used=new Set();
  Array.from(a.children).forEach((e,i)=>{const k=key(e),n=seen[k]=(seen[k]||0);seen[k]++;
    const j=bMap[k]&&bMap[k][n];
    if(j===undefined){oldOut.push(pa.concat(i));return;}
    used.add(j);diffPaths(e,b.children[j],pa.concat(i),pb.concat(j),oldOut,newOut);});
  Array.from(b.children).forEach((e,j)=>{if(!used.has(j))newOut.push(pb.concat(j));});
}
const atPath=(root,path)=>path.reduce((el,i)=>el&&el.children[i],root);
function dayRoots(){return [document.querySelector('.hero'),document.getElementById('panel')];}
function shadowRender(n){ // מרנדר את היום n מחוץ למסך ומחזיר [hero, panel] להשוואה
  const box=document.createElement('div'),root=ReactDOM.createRoot(box),keep=viewDay;
  // עטיפה fixed בגודל 0 עם overflow:hidden — כך הצל לא משנה את אזור הגלילה של המסמך (מיקום מחוץ למסך ב־RTL איפס את הגלילה)
  const outer=document.createElement('div');outer.style.cssText='position:fixed;left:0;top:0;width:0;height:0;overflow:hidden;visibility:hidden;pointer-events:none;contain:strict';
  box.style.cssText='position:absolute;left:0;top:0;width:'+(document.querySelector('.wrap')||document.body).clientWidth+'px';
  outer.appendChild(box);document.body.appendChild(outer);viewDay=n;
  try{ReactDOM.flushSync(()=>root.render(h('div',null,h('div',{className:'sh-hero'},h(Hero)),h('div',{className:'sh-panel'},tab==='sid'?h(SiddurTab):tab==='men'?h(MenorahTab):h(TrackerTab)))));}
  finally{viewDay=keep;}
  return {hero:box.querySelector('.sh-hero').firstElementChild,panel:box.querySelector('.sh-panel'),done:()=>{root.unmount();outer.remove();}};
}
function setFade(els,op,ms){els.forEach((el,i)=>{if(!el||!el.style)return;
  el.style.transition=ms?`opacity ${ms}ms ease ${Math.min(i*STAGGER,STAGGER_MAX)}ms`:'none';el.style.opacity=String(op);});}
// שמירת המקום בדפדוף: עוגן = האלמנט הראשון שנראה במסך מתחת לסרגלים; אחרי הרינדור מחזירים אותו לאותו גובה
function anchorCands(){return [...document.querySelectorAll('.hero, #panel p, #panel h2, #panel h3, #panel li, #panel .countline, #panel button, #panel [class]')].filter(e=>!(e instanceof SVGElement));}
function scrollAnchor(){if(scrollY<5)return null;const top=stickyOffset(),all=anchorCands();
  for(let i=0;i<all.length;i++){const e=all[i],r=e.getBoundingClientRect();
    if(r.height>8&&r.height<innerHeight/2&&r.top>=top-1&&r.top<innerHeight)return {i,tag:e.tagName,cls:e.className,top:r.top,y:scrollY};}
  return {i:-1,top:0,y:scrollY};}
let userScrollEpoch=0;['touchstart','wheel','keydown'].forEach(ev=>addEventListener(ev,()=>userScrollEpoch++,{passive:true}));
function restoreAnchor(a){if(!a)return;const ep=userScrollEpoch;const fix=()=>{if(userScrollEpoch!==ep)return;const e=anchorCands()[a.i];
  if(e&&e.tagName===a.tag&&e.className===a.cls){const d=e.getBoundingClientRect().top-a.top;if(Math.abs(d)>.5)window.scrollTo({top:scrollY+d,behavior:'instant'});}
  else if(Math.abs(scrollY-a.y)>1)window.scrollTo({top:a.y,behavior:'instant'});};
  // גם מאוחר יותר (WebView באנדרואיד עלול לאפס גלילה אחרי הפריסה), כל עוד המשתמש לא נגע במסך בינתיים
  fix();requestAnimationFrame(()=>{fix();requestAnimationFrame(fix);});[120,300,600].forEach(t=>setTimeout(fix,t));}
function stepDay(d,animate){return changeDay(viewDay+d,animate);}
function changeDay(n,animate){if(n<1||n>49||n===viewDay)return false;
  if(!animate||swBusy||matchMedia('(prefers-reduced-motion: reduce)').matches){const a=scrollAnchor();viewDay=n;ReactDOM.flushSync(()=>render());restoreAnchor(a);return true;}
  swBusy=true;
  // P = {oh,op,nh,np}: נתיבים בכרטיס/בפאנל — ישנים (לדעיכה החוצה) וחדשים (לכניסה)
  let P={oh:[],op:[],nh:[],np:[]};
  try{const [oh,op]=dayRoots(),sh=shadowRender(n);
    if(oh&&sh.hero)diffPaths(oh,sh.hero,[],[],P.oh,P.nh);
    if(op&&sh.panel)diffChildren(op,sh.panel,[],[],P.op,P.np); // שורש הפאנל עצמו לא משתנה
    sh.done();
  }catch(e){console.error(e);P={oh:[[]],op:[],nh:[[]],np:[]};}
  const resolve=(hp,pp)=>{const [hr,pr]=dayRoots();return hp.map(p=>atPath(hr,p)).concat(pp.map(p=>atPath(pr,p))).filter(Boolean);};
  const old=resolve(P.oh,P.op);setFade(old,DIP,FADE_OUT);
  const outMs=FADE_OUT+Math.min(old.length*STAGGER,STAGGER_MAX);
  setTimeout(()=>{
    old.forEach(el=>{el.style.transition='';el.style.opacity='';});
    const a=scrollAnchor();viewDay=n;ReactDOM.flushSync(()=>render());restoreAnchor(a);
    const neu=resolve(P.nh,P.np);setFade(neu,DIP,0);void document.body.offsetHeight;setFade(neu,1,FADE_IN);
    setTimeout(()=>{neu.forEach(el=>{if(el.style){el.style.transition='';el.style.opacity='';}});swBusy=false;},FADE_IN+STAGGER_MAX+40);
  },outMs);
  return true;}
(function(){let s=null;
  document.addEventListener('touchstart',e=>{const t=e.touches[0];
    if(e.touches.length!==1||tab==='trk'||document.querySelector('dialog[open]')||!e.target.closest('.hero,#panel')||e.target.closest('input,select,textarea,.autobar,.tabs'))
      {s=null;return;}
    s={x:t.clientX,y:t.clientY,t:Date.now()};},{passive:true});
  document.addEventListener('touchmove',e=>{if(s&&e.touches.length>1)s=null;},{passive:true});
  document.addEventListener('touchend',e=>{if(!s)return;const t=e.changedTouches[0],dx=t.clientX-s.x,dy=t.clientY-s.y,dt=Date.now()-s.t;s=null;
    if(dt>800||Math.abs(dx)<60||Math.abs(dx)<Math.abs(dy)*1.6)return;
    if(String(getSelection&&getSelection())!=='')return;
    const dir=dx>0?1:-1; // RTL: ימינה = היום הבא, שמאלה = הקודם
    if(!stepDay(dir,true))toast(dir>0?'זה היום האחרון בספירה':'זה היום הראשון בספירה');},{passive:true});
})();

/* ============ SCROLL GUIDE LINE ============ */
// בגלילה במגע: קו מנחה אופקי מופיע באמצע המסך וזז יחד עם הטקסט (מסמן איפה קראת).
// כשמרימים את האצבע הוא דועך; אם יצא מהמסך — נעלם.
(function(){let st=null,line=null;
  const kill=(fade)=>{const l=line;line=null;if(!l)return;if(!fade){l.remove();return;}
    l.classList.add('out');setTimeout(()=>l.remove(),650);};
  const place=()=>{const l=document.createElement('div');l.className='scroll-guide';l.setAttribute('aria-hidden','true');
    document.body.appendChild(l);const want=innerHeight/2;l.style.top=(scrollY+want)+'px';
    const d=l.getBoundingClientRect().top-want;if(Math.abs(d)>.5)l.style.top=(scrollY+want-d)+'px'; // אם ה־body ממוקם
    return l;};
  document.addEventListener('touchstart',e=>{
    if(e.touches.length!==1||document.querySelector('dialog[open]')||!e.target.closest('#panel,.hero')){st=null;return;}
    kill(false);st={x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});
  document.addEventListener('touchmove',e=>{if(!st)return;if(e.touches.length!==1){st=null;kill(false);return;}
    if(line)return;const t=e.touches[0],dx=t.clientX-st.x,dy=t.clientY-st.y;
    if(Math.abs(dy)>10&&Math.abs(dy)>Math.abs(dx)*1.2)line=place();},{passive:true});
  const end=()=>{st=null;kill(true);};
  document.addEventListener('touchend',end,{passive:true});document.addEventListener('touchcancel',end,{passive:true});
  addEventListener('scroll',()=>{if(!line)return;const r=line.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)kill(false);},{passive:true});
})();

/* ============ CLOCK ============ */
// שורה בכותרת: יום בשבוע, תאריך לועזי ושעה (לפי now() — כולל מצב בדיקה); מתעדכנת בתחילת כל דקה
function civilLine(){const d=now();return d.toLocaleDateString('he-IL',{weekday:'long',day:'numeric',month:'long',year:'numeric'})+' · '+hm(d);}
(function tick(){setTimeout(()=>{if(!S.sim&&!document.hidden)rerender();tick();},60000-Date.now()%60000+50);})();
document.addEventListener('visibilitychange',()=>{if(!document.hidden)rerender();});

/* ============ STABLE SIZES ============ */
// גובה קבוע לאזורים שהטקסט שלהם מתחלף בין ימים (ספירה, כוונות, מקוצר, שורת הספירה בנוסח):
// מודדים לכל יום ברוחב ובגודל הגופן הנוכחיים, ולוקחים את המקסימום בתוך כל שבוע (קבוצה של 7 ימים) — min-height.
// בתוך שבוע שום דבר לא קופץ; במעבר שבוע הגובה יכול להשתנות (כדי שלא יהיה רווח ריק גדול בימים הקצרים).
let stableKey='',stableGroups=null,stableApplied='';
const sizeGroup=n=>Math.ceil(n/7);
function applyStable(n){if(!stableGroups||!n)return;const g=stableGroups[sizeGroup(n)];if(!g)return;
  const k=g.count+'|'+g.of+'|'+g.kav+'|'+g.cl;if(k===stableApplied)return;stableApplied=k;const r=document.documentElement.style;
  r.setProperty('--mh-count',g.count+'px');r.setProperty('--mh-of',g.of+'px');r.setProperty('--mh-kav',g.kav+'px');r.setProperty('--mh-countline',g.cl+'px');}
function stabilizeSizes(force){
  const hero=document.querySelector('.hero');if(!hero)return;
  const key=[hero.clientWidth,S.fs,S.nusach,S.nikud,tab].join('|');if(key===stableKey&&!force){applyStable(viewDay);return;}stableKey=key;stableApplied='';
  const root=document.documentElement,box=document.createElement('div');
  box.style.cssText='position:absolute;left:0;right:0;top:0;visibility:hidden;pointer-events:none;contain:layout';
  const ch=hero.cloneNode(true);ch.style.minHeight='';ch.querySelectorAll('[style]').forEach(e=>e.removeAttribute('style'));
  box.appendChild(ch);hero.parentNode.appendChild(box);ch.style.width=hero.offsetWidth+'px';
  const cl=document.querySelector('#panel .countline');let cc=null;
  let cbox=null;
  if(cl){cc=cl.cloneNode(true);cc.removeAttribute('style');cc.style.width=cl.offsetWidth+'px';
    // מודדים בתוך אותו הורה בנוסח, כדי שכל כללי ה־CSS (#panel, .sid) יחולו גם על העותק
    cbox=document.createElement('div');cbox.style.cssText='position:absolute;left:0;top:0;visibility:hidden;pointer-events:none';
    cbox.appendChild(cc);cl.parentNode.appendChild(cbox);}
  ['--mh-count','--mh-of','--mh-kav','--mh-countline'].forEach(v=>root.style.setProperty(v,'0px'));
  const q=s=>ch.querySelector(s),kav=[...ch.querySelectorAll('.kav > div')],kavS=kav.map(d=>d.querySelector('span'));
  // מילים לא נשברות: בעמודות הצרות (אנא בכח, למנצח) מקטינים את הגופן כך שהמילה הארוכה מבין 49 הימים תיכנס בשורה
  root.style.setProperty('--kav-fit-2','1');root.style.setProperty('--kav-fit-3','1');root.classList.remove('kav-stack');
  const fits={};
  [[1,n=>OmerDS.kav(n).anaFull],[2,n=>tx(OmerDS.kav(n).ps.w)]].forEach(([i,get])=>{
    const cell=kav[i],sp=kavS[i];if(!cell||!sp)return;
    const cs=getComputedStyle(cell),avail=cell.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);
    const probe=sp.cloneNode(false);probe.style.cssText='display:inline-block;white-space:nowrap;position:absolute;visibility:hidden';cell.appendChild(probe);
    let w=0;for(let n=1;n<=49;n++)get(n).split(/\s+/).forEach(word=>{if(i===1){probe.className='acr-k';probe.innerHTML='';[...word].forEach(c=>{if(c==='"'){probe.append(c);return;}const l=document.createElement('span');l.className='l on';l.textContent=c;probe.appendChild(l);});} // כמו בתצוגה: אותיות מודגשות עם רקע
      else probe.textContent=word;
      w=Math.max(w,probe.getBoundingClientRect().width);});
    probe.remove();fits[i]=w>avail?Math.floor(avail/w*100)/100:1;
  });
  // אם בעמודה של רבע המילה הייתה צריכה לקטון מתחת ל־80% (גופן גדול / מסך צר): ספירה בשורה מלאה, אנא בכח ולמנצח חצי־חצי
  if(Math.min(fits[1]||1,fits[2]||1)<.8)root.classList.add('kav-stack');
  else{root.style.setProperty('--kav-fit-2',String(fits[1]||1));root.style.setProperty('--kav-fit-3',String(fits[2]||1));}
  const groups={};let mx;
  for(let n=1;n<=49;n++){const k=OmerDS.kav(n);mx=groups[sizeGroup(n)]||(groups[sizeGroup(n)]={count:0,of:0,kav:0,cl:0});
    if(q('.count')){q('.count').textContent=tx(countText(n,S.nusach));mx.count=Math.max(mx.count,q('.count').offsetHeight);}
    if(q('.daynum .n'))q('.daynum .n').textContent=gem(n);
    if(q('.daynum .of')){q('.daynum .of').textContent=shortCount(n,S.nusach);mx.of=Math.max(mx.of,q('.daynum .of').offsetHeight);}
    if(kavS.length===3){kavS[0].textContent=tx(k.sef);kavS[1].textContent=k.anaFull;kavS[2].textContent=tx(k.ps.w);
      kav.forEach(d=>{mx.kav=Math.max(mx.kav,d.offsetHeight);});}
    if(cc){cc.textContent=tx(countText(n,S.nusach));mx.cl=Math.max(mx.cl,cc.offsetHeight);}
  }
  box.remove();if(cbox)cbox.remove();
  stableGroups=groups;applyStable(viewDay);
}
window.addEventListener('resize',()=>{clearTimeout(window.__stT);window.__stT=setTimeout(()=>stabilizeSizes(),150);});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>stabilizeSizes(true));

/* ============ PINCH ZOOM = TEXT SIZE ============ */
// צביטה בשתי אצבעות משנה את גודל הטקסט של האפליקציה (0.8–1.4, בצעדים של 0.1) — הטקסט נשבר מחדש
// לשורות ולא נוצרת גלילה אופקית. זום הדפדפן הרגיל חסום (touch-action ב־shell.css).
(function(){let p=null;
  const dist=t=>Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY);
  function badge(txt){let b=document.getElementById('zoomBadge');
    if(!b){b=document.createElement('div');b.id='zoomBadge';b.className='zoom-badge';b.setAttribute('aria-hidden','true');document.body.appendChild(b);}
    if(txt===null){b.style.opacity='0';return;}b.textContent=txt;b.style.opacity='1';}
  document.addEventListener('touchstart',e=>{if(e.touches.length===2&&!document.querySelector('dialog[open]')){p={d:dist(e.touches),fs:S.fs};}},{passive:true});
  document.addEventListener('touchmove',e=>{if(!p||e.touches.length!==2)return;e.preventDefault();
    const want=Math.min(1.4,Math.max(.8,Math.round(p.fs*dist(e.touches)/p.d*10)/10));
    badge('גודל טקסט '+Math.round(want*100)+'%');
    if(want!==S.fs){miniLock=Date.now()+2500;setFs(want);}},{passive:false});
  const end=e=>{if(p&&e.touches.length<2){p=null;setTimeout(()=>badge(null),500);}};
  document.addEventListener('touchend',end,{passive:true});document.addEventListener('touchcancel',end,{passive:true});
})();

/* ============ HERO ============ */
const homeDay=()=>ST.target||ST.inProg||1;
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
  }else if(vd<(ST.target||ST.inProg||0)||S.sim){
    // יום שעבר — או כל יום במצב בדיקה (S.sim): אפשר לסמן/לבטל, ולחזור להיום
    const done=T()[vd]==='y';
    acts.push(h(Button,{key:'mark',variant:done?'done':'primary',size:'small',onClick:()=>{if(done)delete T()[vd];else T()[vd]='y';saveT();render();toast(done?'הסימון בוטל':'נרשם כהושלם');}},done?'✓ הושלם':'סמן כהושלם'));
    acts.push(h(Button,{key:'home',size:'small',variant:'ghost',onClick:()=>changeDay(homeDay(),true)},'חזרה להיום'));
  }else if(vd!==homeDay()){
    // חזרה ליום של היום (מחוץ לימי הספירה: ליום הראשון)
    const home=homeDay();
    acts.push(h(Button,{key:'home',size:'small',onClick:()=>changeDay(home,true)},active||ST.inProg?'חזרה להיום':'ליום הראשון'));
  }
  // שיתוף: אייקון קטן בקצה השורה (לא במרכז, לא כפתור טקסט)
  acts.push(h(IconButton,{key:'share',size:'sm',label:'שתף',className:'share-btn',onClick:()=>share(vd)},h(Icon,{name:'share',size:18})));
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
  if((active||ST.inProg)&&!S.remind&&!S.remindAsked){
    banners.push(h(Banner,{key:'rem',title:'רוצה תזכורת לספור?'},'נזכיר לך בצאת הכוכבים, ושוב אם עוד לא סימנת שספרת. לא בשבת ובחג. אפשר לסמן "ספרתי" ישר מההתראה.',
      h('div',{className:'row',style:{marginTop:8}},
        h(Button,{size:'small',onClick:()=>setRemind(true)},'הפעל תזכורת'),
        h(Button,{size:'small',variant:'ghost',onClick:()=>{S.remindAsked=true;saveS();render();}},'לא עכשיו'))));
  }
  if((active||ST.inProg)&&noBracha()){
    banners.push(h(Banner,{key:'nob',tone:'warn',title:'ממשיכים לספור בלי ברכה.'},'לפי הרשום, חסר יום שלם בספירה. נוהגים לשמוע את הברכה מהש"ץ ולענות אמן. במקרה של ספק — שאל רב.'));
  }
  if(!active&&!ST.inProg&&ST.nextStart){
    banners.push(h(Banner,{key:'next'},`הספירה הבאה מתחילה במוצאי יום טוב ראשון של פסח — ${new Date(ST.nextStart.y,ST.nextStart.m-1,ST.nextStart.d).toLocaleDateString('he-IL',{day:'numeric',month:'long',year:'numeric'})} בערב. בינתיים אפשר לעיין בכל ימי הספירה.`,
      h('div',{className:'row',style:{marginTop:8}},h(Button,{size:'small',variant:'ghost',onClick:jumpToStart},'קפוץ לתחילת הספירה (לבדיקה)'))));
  }
  return h(DayHero,{day:vd,nusach:S.nusach,nikud:S.nikud,when,
    onPrev:()=>stepDay(-1,true),onNext:()=>stepDay(1,true),
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
    after:h('p',{className:'blessing',style:{marginTop:10}},tx(HARACHAMAN))},h('span',{className:'cl-text'},tx(countText(n,S.nusach))))); // רק הטקסט דועך במעבר יום, לא המסגרת
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
  kids.push(h(EndCTA,{key:'end',n}));
  return h(Siddur,null,kids);
}

// סוף הנוסח: סימון היום, מעבר למעקב, ותזכורת להזכיר את בעל ההקדשה (כשיש מאגר הקדשות)
function EndCTA({n}){
  const home=n===ST.target||n===ST.inProg,done=T()[n]==='y',d=DB&&DEDS.length?curDed():null;
  const live=home||n<(ST.target||ST.inProg||0)||!!S.sim; // אפשר לסמן: היום, יום שעבר, או כל יום במצב בדיקה
  const toTracker=()=>goTab('trk');
  return h('div',{className:'endcta'},
    live&&!done?h(Fragment,null,h('p',null,'סיימת את הספירה?'),
      h(Button,{onClick:()=>{T()[n]='y';saveT();render();toast('נרשם כהושלם');}},'סיימתי — סמן כהושלם')):
    live&&done?h('p',null,home?'✓ הספירה של היום נרשמה':`✓ יום ${gem(n)} נרשם`):h('p',null,`עיון ביום ${gem(n)}`),
    d?h('p',null,'הזכר בתפילתך: ',h('b',null,`${d.purpose||''} ${d.name||''}`.trim()),' ',
      h(TextButton,{onClick:()=>{const el=document.querySelector('.dedic');if(el)el.scrollIntoView({behavior:'smooth',block:'center'});}},'לכרטיס')):null,
    h('div',{className:'row'},
      h(Button,{variant:live&&!done?'ghost':'primary',onClick:toTracker},'למעקב שלי'),
      !home&&(ST.target||ST.inProg)?h(Button,{variant:'ghost',onClick:()=>{window.scrollTo({top:0,behavior:'smooth'});setTimeout(()=>changeDay(homeDay(),true),250);}},'חזרה להיום'):null));
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
// registerPlugin מגיע מ־capacitor.js (ש־build-www מוסיף ל־www); גיבוי: Capacitor.Plugins מהגשר המקורי
function nativePlugin(name){
  const reg=(window.capacitorExports&&capacitorExports.registerPlugin)||(window.Capacitor&&Capacitor.registerPlugin);
  if(reg){try{return reg(name);}catch(e){console.error(e);}}
  return (window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins[name])||null;
}
const Updater=NATIVE?nativePlugin('OmerUpdater'):null;
const UPD={cur:null,status:'idle',latestCode:0,url:'',pct:0,msg:''};
const withTimeout=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')),ms))]);
// הגרסה המותקנת: מהפלאגין, ואם הוא לא עונה — מספר הבנייה שנכתב ל־index.html בזמן הבנייה (OMER_BUILD)
async function loadVersion(){
  if(UPD.cur)return UPD.cur;
  try{const v=await withTimeout(Updater.getVersion(),4000);if(v&&+v.versionCode){UPD.cur={versionName:v.versionName,versionCode:+v.versionCode};return UPD.cur;}}
  catch(e){UPD.verErr=(e&&e.message)||String(e);}
  if(window.OMER_BUILD){UPD.cur={versionName:'1.0.'+window.OMER_BUILD,versionCode:+window.OMER_BUILD};return UPD.cur;}
  return null;
}
if(NATIVE&&Updater){
  try{
    loadVersion().then(v=>{rerender();if(v)autoCheckUpdate();});
    Promise.resolve(Updater.addListener('progress',e=>{UPD.pct=e.percent||0;rerender();})).catch(()=>{});
  }catch(e){console.error(e);}
}
async function checkUpdate(silent){
  if(!NATIVE||UPD.status==='checking'||UPD.status==='downloading')return;
  if(!silent){UPD.status='checking';UPD.msg='';rerender();}
  try{
    const cur=await loadVersion();
    if(!cur)throw new Error('לא ניתן לקרוא את הגרסה המותקנת'+(UPD.verErr?' ('+UPD.verErr+')':''));
    const r=await withTimeout(fetch(`https://api.github.com/repos/${UPD_REPO}/releases/latest`,{cache:'no-store',headers:{Accept:'application/vnd.github+json'}}),15000);
    if(!r.ok)throw new Error('GitHub '+r.status);
    const rel=await r.json(),code=parseInt(String(rel.tag_name||'').replace(/\D/g,''))||0;
    const apk=(rel.assets||[]).find(a=>/\.apk$/i.test(a.name));
    store.set('omer-upd-check',Date.now());
    if(apk&&code>cur.versionCode){UPD.status='avail';UPD.latestCode=code;UPD.url=apk.browser_download_url;UPD.msg='';if(!silent)toast('נמצאה גרסה חדשה');}
    else if(!silent){UPD.status='none';toast('האפליקציה מעודכנת');}
  }catch(e){
    if(!silent){UPD.status='error';UPD.msg='הבדיקה נכשלה: '+((e&&e.message)||e);toast('בדיקת העדכון נכשלה');}
    else UPD.status='idle';
  }
  rerender();
}
function autoCheckUpdate(){const last=store.get('omer-upd-check',0);if(Date.now()-last>6*36e5)checkUpdate(true);}
async function runUpdate(){
  if(!NATIVE||!UPD.url)return;
  UPD.status='downloading';UPD.pct=0;UPD.msg='';UPD.failed=false;rerender();
  try{await Updater.downloadAndInstall({url:UPD.url});UPD.status='avail';UPD.msg='ההתקנה נפתחה. אשר אותה בחלון של אנדרואיד.';}
  catch(e){
    if(e&&e.message==='NEED_PERMISSION'){UPD.status='avail';UPD.msg='אפשר לאפליקציה להתקין עדכונים (מתג "התקנת אפליקציות לא מוכרות" שנפתח), חזור לכאן והקש שוב על "עדכן עכשיו".';}
    else{UPD.status='avail';UPD.failed=true;UPD.msg='ההורדה נכשלה ('+(((e&&e.message)||e)+'').replace(/^download failed: /,'')+'). נסה שוב, או הורד דרך הדפדפן.';}
  }
  rerender();
}
// גיבוי: פתיחת קובץ ה־APK בדפדפן של הטלפון (ההתקנה משם)
async function openUpdateInBrowser(){const url=UPD.url||`https://github.com/${UPD_REPO}/releases/latest/download/omer-app.apk`;
  try{if(!Updater)throw 0;await Updater.openUrl({url});}catch(e){try{window.open(url,'_blank');}catch(_){}}}
const updText=()=>UPD.status==='checking'?'בודק…':UPD.status==='downloading'?`מוריד… ${UPD.pct}%`:UPD.status==='none'?'האפליקציה מעודכנת.':UPD.status==='avail'?`גרסה חדשה זמינה (${UPD.latestCode}).`:'';
function UpdateBanner(){
  if(!NATIVE||(UPD.status!=='avail'&&UPD.status!=='downloading'))return null;
  return h(Banner,{title:'יש גרסה חדשה'},UPD.status==='downloading'?`מוריד… ${UPD.pct}%`:(UPD.msg||'אפשר לעדכן בלחיצה אחת.'),
    UPD.status==='avail'?h('div',{className:'row',style:{marginTop:8}},h(Button,{size:'small',onClick:runUpdate},UPD.failed?'נסה שוב':'עדכן עכשיו'),
      UPD.failed?h(Button,{size:'small',variant:'ghost',onClick:openUpdateInBrowser},'הורד בדפדפן'):null):null);
}

/* ============ ANDROID BACK BUTTON ============ */
// סדר: סגירת חלון פתוח → חזרה מהמנורה/מעקב לנוסח → אישור יציאה מהאפליקציה
const AppPlugin=NATIVE?nativePlugin('App'):null;
async function onBack(){
  if(UI.confirm){closeConfirm(false);return;}
  if(UI.settings){UI.settings=false;rerender();return;}
  if(UI.ask){closeAsk();return;}
  if(tab!=='sid'){goTab('sid');return;}
  if(await appConfirm('יציאה','לסגור את האפליקציה?','צא'))try{await AppPlugin.exitApp();}catch(e){}
}
if(AppPlugin)try{Promise.resolve(AppPlugin.addListener('backButton',onBack)).catch(()=>{});}catch(e){console.error(e);}
window.__omerBack=onBack; // לבדיקות

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
    h(Field,{label:'תזכורת לספור',hint:'בערב, ושוב אם עוד לא סימנת. לא בשבת ובחג.',htmlFor:'sRemind'},h(Switch,{id:'sRemind',checked:!!S.remind,onChange:e=>setRemind(e.target.checked)})),
    S.remind?h(Field,{label:'מתי להזכיר',htmlFor:'sOffset'},h('select',{id:'sOffset',value:String(S.offset),onChange:e=>{S.offset=parseInt(e.target.value)||0;saveS();render();}},
      [0,15,30,60,120].concat([0,15,30,60,120].includes(+S.offset)?[]:[+S.offset]).map(v=>h('option',{key:v,value:String(v)},v?`${v>=60?(v/60)+' שע׳':v+' דק׳'} אחרי צאת הכוכבים`:'בצאת הכוכבים')))):null,
    S.remind?h(Field,{label:'תזכורות חוזרות',hint:'אחרי שעה, מאוחר בערב, ואם שכחת — בבוקר ולפני השקיעה. נעצר כשמסמנים "ספרתי".',htmlFor:'sRemMore'},
      h(Switch,{id:'sRemMore',checked:S.remindMore!==false,onChange:e=>{S.remindMore=e.target.checked;saveS();render();}})):null,
    S.remind&&NATIVE&&REMST.display&&REMST.display!=='granted'?h(Field,{label:'התראות חסומות',hint:'בלי אישור לא תופיע אף תזכורת'},h(Button,{size:'small',onClick:askDisplay},'אשר התראות')):null,
    S.remind&&NATIVE&&REMST.exact==='denied'?h(Field,{label:'תזכורת בזמן מדויק',hint:'בלי "התראות ותזכורות" אנדרואיד עלול לאחר את התזכורת בכמה דקות'},h(Button,{size:'small',variant:'ghost',onClick:askExact},'אפשר')):null,
    S.remind?h(Field,{label:'בדיקה'},h(Button,{variant:'ghost',size:'small',onClick:testReminder},'שלח התראת ניסיון')):null,
    h(Field,{label:'ערכת צבע',htmlFor:'sTheme'},h('select',{id:'sTheme',value:S.theme,onChange:set('theme')},
      h('option',{value:'auto'},'לפי המכשיר'),h('option',{value:'light'},'בהירה'),h('option',{value:'dark'},'כהה'))),
    h(Field,{label:'תצוגה לפי תאריך אחר',hint:'לבדיקה ותצוגה מקדימה',htmlFor:'sSim'},
      h('input',{id:'sSim',type:'datetime-local',value:S.sim||'',onChange:e=>{S.sim=e.target.value;saveS();viewDay=null;askedThisSession=false;render();}})),
    NATIVE?h(Field,{label:'עדכון אפליקציה',hint:[UPD.cur?'גרסה '+UPD.cur.versionName:'',updText()||'',UPD.msg].filter(Boolean).join(' · ')},
      UPD.status==='avail'?h('div',{className:'row'},h(Button,{size:'small',onClick:runUpdate},UPD.failed?'נסה שוב':'עדכן עכשיו'),
        UPD.failed?h(Button,{size:'small',variant:'ghost',onClick:openUpdateInBrowser},'הורד בדפדפן'):null):
      h(Button,{variant:'ghost',size:'small',disabled:UPD.status==='checking'||UPD.status==='downloading',onClick:()=>checkUpdate(false)},'בדוק עדכון')):null,
    h(Field,{label:'הגדרות משתמש',hint:'נוסח, תצוגה, מיקום ותזכורות'},h(Button,{variant:'ghost',size:'small',onClick:resetSettings},'אפס הגדרות')),
    h(Field,{label:'נתוני מעקב',hint:'ימים שסומנו, זמני קריאה ושמות שהוזכרו'},h(Button,{variant:'ghost',size:'small',onClick:resetData},'מחק הכל')));
}
function setFs(v){S.fs=Math.min(1.4,Math.max(.8,+(+v).toFixed(1)));saveS();render();}
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
function stickyOffset(){const m=document.querySelector('.mini'),t=document.querySelector('.tabs-sticky');return (m?m.offsetHeight:60)+(t?t.offsetHeight:50)+8;}
let sidY=null,sidReturn=null; // מיקום הגלילה בנוסח, לחזרה בדיוק לאותו מקום
function goTab(t,noScroll){if(t===tab)return;if(tab==='sid')sidY=scrollY;if(t==='sid'){sidReturn=null;}
  if(autoOn||autoMode){autoOn=false;autoMode=false;}
  tab=t;rerender(true);
  if(noScroll)return;
  if(t==='sid'&&sidY!==null){const y=sidY;requestAnimationFrame(()=>window.scrollTo({top:y}));}
  else{const r=document.getElementById('panel').getBoundingClientRect();if(r.top<0)window.scrollTo({top:scrollY+r.top-stickyOffset()});}}
function toMenorah(){sidY=scrollY;sidReturn=sidY;tab='men';if(autoOn||autoMode){autoOn=false;autoMode=false;}rerender(true);
  const r=document.getElementById('panel').getBoundingClientRect();window.scrollTo({top:scrollY+r.top-stickyOffset()});}

/* ============ APP ============ */
function toggleTheme(){const dark=S.theme==='dark'||(S.theme==='auto'&&matchMedia('(prefers-color-scheme: dark)').matches);S.theme=dark?'light':'dark';saveS();render();}
// הסרגל המקוצר מופיע כשכרטיס היום כבר מעל המסך
// מופיע ברגע שהכותרת העליונה (עם א−/א+) יוצאת מהמסך. בזמן שימוש בכפתורי הגופן שבו הוא ננעל פתוח,
// אחרת שינוי הגופן מזיז את הדף, הסרגל נעלם והלחיצה הבאה נופלת על מה שמתחתיו.
let miniLock=0;
function checkMini(){const top=document.querySelector('.top');if(!top)return;let show=top.getBoundingClientRect().bottom<0;
  if(!show&&UI.mini&&Date.now()<miniLock){setTimeout(checkMini,miniLock-Date.now()+30);return;}
  if(show!==UI.mini){UI.mini=show;rerender();}}
function miniFs(v){miniLock=Date.now()+2500;setFs(v);}
function openSettings(){UI.settings=true;rerender();if(NATIVE&&S.remind)remStatus();}

function App(){
  const [,setV]=useState(0);
  rerender=sync=>{if(sync===true)ReactDOM.flushSync(()=>setV(v=>v+1));else setV(v=>v+1);};
  useLayoutEffect(()=>{
    if(S.theme==='auto')document.documentElement.removeAttribute('data-theme');else document.documentElement.setAttribute('data-theme',S.theme);
  });
  useLayoutEffect(()=>{ // אנימציית דפדוף בין ימים + גובה הסרגל המקוצר (לכרטיסיות הצמודות)
    const m=document.querySelector('.mini');if(m)document.documentElement.style.setProperty('--mini-h',m.offsetHeight+'px');
  });
  useLayoutEffect(()=>{stabilizeSizes();});
  useEffect(()=>{checkMini();}); // גם אחרי רינדור (מעבר כרטיסייה, שחזור גלילה), לא רק באירוע גלילה
  useEffect(()=>{ // הסרגל המקוצר לא ניתן למיקוד כשהוא מוסתר
    document.querySelectorAll('.mini button').forEach(b=>b.tabIndex=UI.mini?0:-1);
    const m=document.querySelector('.mini');if(m)m.setAttribute('aria-hidden',String(!UI.mini));
  });
  useEffect(()=>{
    let raf=0;const check=()=>{raf=0;checkMini();};
    const onScroll=()=>{if(!raf)raf=requestAnimationFrame(check);};
    window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);
    document.addEventListener('touchmove',onScroll,{passive:true});
    const onVis=()=>{if(!document.hidden)render();};document.addEventListener('visibilitychange',onVis);
    const iv=setInterval(()=>{const before=ST.target+'|'+ST.night;compute();if(before!==ST.target+'|'+ST.night){viewDay=null;render();}},60000);
    return()=>{window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);document.removeEventListener('touchmove',onScroll);document.removeEventListener('visibilitychange',onVis);clearInterval(iv);};
  },[]);

  const L=loc(),status=[{label:L.name}];
  if(ST.night&&ST.n<ST.al)status.push({label:'אפשר לספור בברכה עד עלות השחר',value:hm(ST.al)});
  else status.push({label:'צאת הכוכבים'+(ST.night?' היה':''),value:hm(ST.tz)});
  if(S.sim)status.push({value:'מצב תצוגה מקדימה'});

  return h(OmerRoot,{theme:S.theme,fontScale:S.fs},
    h(MiniBar,{day:viewDay,nusach:S.nusach,visible:UI.mini,fontScale:S.fs,onFontScale:miniFs,onToggleTheme:toggleTheme,onSettings:openSettings,
      onCountClick:()=>window.scrollTo({top:0,behavior:'smooth'})}),
    h('div',{className:'wrap'},
      h(AppHeader,{hebDate:(ST.night?'ליל ':'')+hebStr(ST.night?ST.cur:ST.t),civil:civilLine(),fontScale:S.fs,onFontScale:setFs,onToggleTheme:toggleTheme,onSettings:openSettings}),
      h(StatusBar,{items:status}),
      h(UpdateBanner),
      h(PreviewBanner),
      h(Hero),
      h(Dedic),
      h(QuoteOfDay),
      h('div',{className:'tabs-sticky'+(UI.mini?' stuck':'')},h(Tabs,{items:[{id:'sid',label:'סדר הספירה'},{id:'men',label:'מנורה'},{id:'trk',label:'המעקב שלי'}],value:tab,onChange:goTab})),
      h(Panel,{id:'panel'},tab==='sid'?h(SiddurTab):tab==='men'?h(MenorahTab):h(TrackerTab))),
    tab==='sid'?h(AutoScrollBar,{playing:autoOn,speed:S.speed,onToggle:()=>autoOn?stopAuto():startAuto(),onSpeed:setSpeed}):null,
    h(SettingsDialog),h(AskDialog),h(ConfirmDialog),
    h(Toast,{message:UI.toast.msg,visible:UI.toast.show}));
}

compute();
ReactDOM.createRoot(document.getElementById('app')).render(h(App));
if(NATIVE)lnInit(); // מאזין לכפתור "ספרתי" בהתראה — גם כשהאפליקציה נפתחת ממנה
doneFromHash();
setTimeout(()=>{ensureDedic();scheduleReminder();maybeAsk();},0);
