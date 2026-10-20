/* ספירת העומר — logic: locations, storage, time, state.
   Data and text helpers (SEF, ANA, PS, countText, gem, kav, ...) come from the design system bundle (window.OmerDS). */
const {SEF,SEFB,ANA,PS,PS_FLAT,PS_TITLE,LESHEM,HINENI,BRACHA,HARACHAMAN,BARUCH_SHEM,RIBONO_A,RIBONO_B,countText,shortCount,gem,kav,stripNikud}=window.OmerDS;

const LOCS=[
 // ישראל
 {id:'jlm',name:'ירושלים',lat:31.778,lng:35.235,g:'il'},{id:'bb',name:'בני ברק',lat:32.084,lng:34.834,g:'il'},
 {id:'tlv',name:'תל אביב',lat:32.085,lng:34.781,g:'il'},{id:'hfa',name:'חיפה',lat:32.794,lng:34.989,g:'il'},
 {id:'ash',name:'אשדוד',lat:31.804,lng:34.655,g:'il'},{id:'ntn',name:'נתניה',lat:32.321,lng:34.853,g:'il'},
 {id:'pt',name:'פתח תקווה',lat:32.087,lng:34.887,g:'il'},{id:'rch',name:'רחובות',lat:31.894,lng:34.811,g:'il'},
 {id:'eld',name:'אלעד',lat:32.052,lng:34.951,g:'il'},{id:'bsh',name:'בית שמש',lat:31.745,lng:34.989,g:'il'},
 {id:'mdi',name:'מודיעין עילית',lat:31.933,lng:35.042,g:'il'},{id:'btr',name:'ביתר עילית',lat:31.697,lng:35.117,g:'il'},
 {id:'bs',name:'באר שבע',lat:31.252,lng:34.791,g:'il'},{id:'sfd',name:'צפת',lat:32.965,lng:35.496,g:'il'},
 {id:'tbr',name:'טבריה',lat:32.794,lng:35.531,g:'il'},{id:'kg',name:'קרית גת',lat:31.61,lng:34.764,g:'il'},
 {id:'ntv',name:'נתיבות',lat:31.421,lng:34.588,g:'il'},{id:'ilt',name:'אילת',lat:29.558,lng:34.952,g:'il'},
 // חו"ל
 {id:'ny',name:'ניו יורק',lat:40.713,lng:-74.006,tz:['America/New_York','America/Detroit']},
 {id:'lkw',name:'לייקווד',lat:40.096,lng:-74.218},
 {id:'chi',name:'שיקגו',lat:41.878,lng:-87.63,tz:['America/Chicago']},
 {id:'la',name:'לוס אנג\'לס',lat:34.052,lng:-118.244,tz:['America/Los_Angeles']},
 {id:'mia',name:'מיאמי',lat:25.762,lng:-80.192},
 {id:'tor',name:'טורונטו',lat:43.653,lng:-79.383,tz:['America/Toronto']},
 {id:'mtl',name:'מונטריאול',lat:45.502,lng:-73.567,tz:['America/Montreal']},
 {id:'mex',name:'מקסיקו סיטי',lat:19.433,lng:-99.133,tz:['America/Mexico_City']},
 {id:'pan',name:'פנמה',lat:8.983,lng:-79.517,tz:['America/Panama']},
 {id:'bue',name:'בואנוס איירס',lat:-34.604,lng:-58.382,tz:['America/Argentina/Buenos_Aires','America/Buenos_Aires']},
 {id:'sao',name:'סאו פאולו',lat:-23.551,lng:-46.633,tz:['America/Sao_Paulo']},
 {id:'ldn',name:'לונדון',lat:51.507,lng:-0.128,tz:['Europe/London']},
 {id:'mnc',name:'מנצ\'סטר',lat:53.481,lng:-2.242},
 {id:'par',name:'פריז',lat:48.857,lng:2.352,tz:['Europe/Paris']},
 {id:'ant',name:'אנטוורפן',lat:51.219,lng:4.402,tz:['Europe/Brussels']},
 {id:'ams',name:'אמסטרדם',lat:52.37,lng:4.895,tz:['Europe/Amsterdam']},
 {id:'zur',name:'ציריך',lat:47.377,lng:8.541,tz:['Europe/Zurich']},
 {id:'ber',name:'ברלין',lat:52.52,lng:13.405,tz:['Europe/Berlin']},
 {id:'rom',name:'רומא',lat:41.903,lng:12.496,tz:['Europe/Rome']},
 {id:'kyv',name:'קייב',lat:50.45,lng:30.523,tz:['Europe/Kiev','Europe/Kyiv']},
 {id:'mos',name:'מוסקבה',lat:55.756,lng:37.617,tz:['Europe/Moscow']},
 {id:'jnb',name:'יוהנסבורג',lat:-26.204,lng:28.047,tz:['Africa/Johannesburg']},
 {id:'mel',name:'מלבורן',lat:-37.814,lng:144.963,tz:['Australia/Melbourne']},
 {id:'syd',name:'סידני',lat:-33.869,lng:151.209,tz:['Australia/Sydney']}
];

/* ============ STORAGE ============ */
const store={get(k,f){try{const v=localStorage.getItem(k);return v?JSON.parse(v):f}catch(e){return f}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const DEF={speed:2,nusach:'em',nikud:true,before:true,after:true,fs:1,loc:'jlm',custom:null,tzeit:'d8.5',remind:false,offset:0,theme:'auto',sim:''};
let S=Object.assign({},DEF,store.get('omer-settings',{}));S.fs=Math.min(1.4,Math.max(.8,+S.fs||1));
let TRACK=store.get('omer-track',{});
const saveS=()=>store.set('omer-settings',S), saveT=()=>store.set('omer-track',TRACK);

/* ============ TIME ============ */
const now=()=>S.sim?new Date(S.sim):new Date();
const ymd=d=>({y:d.getFullYear(),m:d.getMonth()+1,d:d.getDate()});
const addD=(o,k)=>ymd(new Date(o.y,o.m-1,o.d+k,12));
const rad=Math.PI/180;
function loc(){return S.loc==='custom'&&S.custom?S.custom:(LOCS.find(l=>l.id===S.loc)||LOCS[0]);}
function sunEvent(o,zen,rising){
  const {lat,lng}=loc();const N=Math.round((Date.UTC(o.y,o.m-1,o.d)-Date.UTC(o.y,0,0))/864e5);
  const lh=lng/15,t=N+((rising?6:18)-lh)/24,M=0.9856*t-3.289;
  let L=(M+1.916*Math.sin(M*rad)+0.020*Math.sin(2*M*rad)+282.634)%360;if(L<0)L+=360;
  let RA=Math.atan(0.91764*Math.tan(L*rad))/rad;RA=(RA+360)%360;RA+=Math.floor(L/90)*90-Math.floor(RA/90)*90;RA/=15;
  const sd=0.39782*Math.sin(L*rad),cd=Math.cos(Math.asin(sd));
  const ch=(Math.cos(zen*rad)-sd*Math.sin(lat*rad))/(cd*Math.cos(lat*rad));if(ch>1||ch<-1)return null;
  let H=Math.acos(ch)/rad;if(rising)H=360-H;H/=15;
  let T=(H+RA-0.06571*t-6.622)%24;if(T<0)T+=24;
  return new Date(Date.UTC(o.y,o.m-1,o.d)+(T-lh)*36e5);
}
function tzeit(o){const m=S.tzeit;if(m[0]==='d')return sunEvent(o,90+parseFloat(m.slice(1)),false);const ss=sunEvent(o,90.833,false);return ss?new Date(ss.getTime()+parseInt(m.slice(1))*6e4):null;}
const alot=o=>sunEvent(o,106.1,true);
const hm=d=>d?d.toLocaleTimeString('he-IL',{hour:'2-digit',minute:'2-digit'}):'—';

/* Hebrew calendar via Intl */
const fmtEn=new Intl.DateTimeFormat('en-u-ca-hebrew',{timeZone:'UTC',day:'numeric',month:'long',year:'numeric'});
const fmtHe=new Intl.DateTimeFormat('he-u-ca-hebrew',{timeZone:'UTC',day:'numeric',month:'long',year:'numeric'});
function hebParts(o){const p={};fmtEn.formatToParts(new Date(Date.UTC(o.y,o.m-1,o.d,12))).forEach(x=>p[x.type]=x.value);return{day:parseInt(p.day),month:p.month||'',year:parseInt(p.year)};}
const HMON={tishri:'תשרי',heshvan:'חשון',cheshvan:'חשון',kislev:'כסלו',tevet:'טבת',shevat:'שבט',adar:'אדר','adar i':'אדר א׳','adar ii':'אדר ב׳',nisan:'ניסן',iyar:'אייר',sivan:'סיון',tamuz:'תמוז',tammuz:'תמוז',av:'אב',elul:'אלול'};
function yGem(y){let n=y%1000,s='';for(const[v,c]of[[400,'ת'],[300,'ש'],[200,'ר'],[100,'ק'],[90,'צ'],[80,'פ'],[70,'ע'],[60,'ס'],[50,'נ'],[40,'מ'],[30,'ל'],[20,'כ'],[10,'י']])while(n>=v){s+=c;n-=v;}
  if(n===15||n===16){s+=n===15?'טו':'טז';n=0;}if(n)s+='אבגדהוזחט'[n-1];return s.length>1?s.slice(0,-1)+'"'+s.slice(-1):s+"'";}
function hebStr(o){const h=hebParts(o),m=HMON[h.month.toLowerCase()]||h.month;return gem(h.day)+' '+m+' '+yGem(h.year);}
function omerOf(o){const h=hebParts(o),m=h.month.toLowerCase();
  if(m.startsWith('nis')&&h.day>=16)return h.day-15;
  if(m.startsWith('iy'))return 15+h.day;
  if(m.startsWith('siv')&&h.day<=5)return 44+h.day;
  return null;}
function nextStart(from){for(let i=0;i<420;i++){const o=addD(from,i),h=hebParts(o);if(h.month.toLowerCase().startsWith('nis')&&h.day===16)return addD(o,-1);}return null;}

/* ============ STATE ============ */
let ST={},viewDay=null,tab='sid',askedThisSession=false;
function compute(){
  const n=now(),t=ymd(n),tz=tzeit(t),al=alot(t);
  let night,cur;
  if(tz&&n>=tz){night=true;cur=addD(t,1);}else if(al&&n<al){night=true;cur=t;}else{night=false;cur=addD(t,1);}
  const target=omerOf(cur),inProg=night?null:omerOf(t);
  const yearDate=target?cur:(inProg?t:cur);
  const year=hebParts(yearDate).year;
  ST={n,t,tz,al,night,cur,target,inProg,year,nextStart:(!target&&!inProg)?nextStart(t):null};
  if(!TRACK[year])TRACK[year]={};
  if(viewDay===null)viewDay=target||inProg||1;
}
const T=()=>TRACK[ST.year];
function pastLimit(){if(ST.target)return ST.night?ST.target-1:ST.target-2;if(ST.inProg)return ST.inProg-1;return 0;}
function noBracha(){const lim=ST.target?ST.target-1:(ST.inProg||0);for(let k=1;k<=lim;k++)if(T()[k]==='n')return true;return false;}
