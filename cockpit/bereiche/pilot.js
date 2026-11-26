/* ---------- pilot: reputation and sessions (source: StarCitizen-Handels-Planer) ---------- */
(function(){
let node=null, X=null, tab='rep', sumTimer=0;
const HEAD=`<h1>Pilot</h1>
  <p class="ck-lede"><span class="de">Dein Ruf je Organisation und deine Spielsitzungen. Beide lesen deine Spiel-Logs nur auf deinem Rechner; es wird nichts hochgeladen.</span><span class="en">Your reputation per organisation and your play sessions. Both read your game logs on your computer only; nothing is uploaded.</span></p>
  <div class="ck-subtabs" role="tablist" aria-label="Pilot">
    <button type="button" role="tab" data-t="rep"><span class="de">Ruf</span><span class="en">Reputation</span></button>
    <button type="button" role="tab" data-t="sessions"><span class="de">Sitzungen</span><span class="en">Sessions</span></button></div>`;
// Stand-in for the cargo ledger of the trade planner page: its places, and "open this place" as a jump to Cargo.
const LB={places:[{"id":"Stanton|Nyx Gateway (Stanton)","n":"Nyx Gateway (Stanton)","sys":"Stanton","body":"","max":32,"rr":"RR_JP_StantonNyx"},{"id":"Stanton|Pyro Gateway (Stanton)","n":"Pyro Gateway (Stanton)","sys":"Stanton","body":"","max":32,"rr":"RR_JP_StantonPyro"},{"id":"Stanton|S4DC05","n":"S4DC05","sys":"Stanton","body":"","max":0},{"id":"Stanton|Terra Gateway (Stanton)","n":"Terra Gateway (Stanton)","sys":"Stanton","body":"","max":32,"rr":"RR_JP_StantonTerra"},{"id":"Stanton|UEX Station","n":"UEX Station","sys":"Stanton","body":"","max":0},{"id":"Stanton|HDMS-Anderson","n":"HDMS-Anderson","sys":"Stanton","body":"Aberdeen","max":24},{"id":"Stanton|HDMS-Norgaard","n":"HDMS-Norgaard","sys":"Stanton","body":"Aberdeen","max":24},{"id":"Stanton|ARC-L1 Wide Forest Station","n":"ARC-L1 Wide Forest Station","sys":"Stanton","body":"ArcCorp","max":32,"rr":"RR_ARC_L1"},{"id":"Stanton|ARC-L2 Lively Pathway Station","n":"ARC-L2 Lively Pathway Station","sys":"Stanton","body":"ArcCorp","max":32,"rr":"RR_ARC_L2"},{"id":"Stanton|ARC-L3 Modern Express Station","n":"ARC-L3 Modern Express Station","sys":"Stanton","body":"ArcCorp","max":32,"rr":"RR_ARC_L3"},{"id":"Stanton|ARC-L4 Faint Glen Station","n":"ARC-L4 Faint Glen Station","sys":"Stanton","body":"ArcCorp","max":32,"rr":"RR_ARC_L4"},{"id":"Stanton|ARC-L5 Yellow Core Station","n":"ARC-L5 Yellow Core Station","sys":"Stanton","body":"ArcCorp","max":32,"rr":"RR_ARC_L5"},{"id":"Stanton|Area 18","n":"Area 18","sys":"Stanton","body":"ArcCorp","max":32},{"id":"Stanton|Baijini Point","n":"Baijini Point","sys":"Stanton","body":"ArcCorp","max":32,"rr":"RR_ARC_LEO"},{"id":"Stanton|HDMS-Bezdek","n":"HDMS-Bezdek","sys":"Stanton","body":"Arial","max":32},{"id":"Stanton|HDMS-Lathan","n":"HDMS-Lathan","sys":"Stanton","body":"Arial","max":32},{"id":"Stanton|Rayari Anvik Research Outpost","n":"Rayari Anvik Research Outpost","sys":"Stanton","body":"Calliope","max":24},{"id":"Stanton|Rayari Kaltag Research Outpost","n":"Rayari Kaltag Research Outpost","sys":"Stanton","body":"Calliope","max":24},{"id":"Stanton|Shubin Mining Facility SMCa-6","n":"Shubin Mining Facility SMCa-6","sys":"Stanton","body":"Calliope","max":24},{"id":"Stanton|Shubin Mining Facility SMCa-8","n":"Shubin Mining Facility SMCa-8","sys":"Stanton","body":"Calliope","max":24},{"id":"Stanton|Hickes Research","n":"Hickes Research","sys":"Stanton","body":"Cellin","max":24},{"id":"Stanton|Terra Mills HydroFarm","n":"Terra Mills HydroFarm","sys":"Stanton","body":"Cellin","max":24},{"id":"Stanton|Rayari Cantwell Research Outpost","n":"Rayari Cantwell Research Outpost","sys":"Stanton","body":"Clio","max":24},{"id":"Stanton|Rayari McGrath Research Outpost","n":"Rayari McGrath Research Outpost","sys":"Stanton","body":"Clio","max":24},{"id":"Stanton|CRU-L1 Ambitious Dream Station","n":"CRU-L1 Ambitious Dream Station","sys":"Stanton","body":"Crusader","max":32,"rr":"RR_CRU_L1"},{"id":"Stanton|CRU-L4 Shallow Fields Station","n":"CRU-L4 Shallow Fields Station","sys":"Stanton","body":"Crusader","max":32,"rr":"RR_CRU_L4"},{"id":"Stanton|CRU-L5 Beautiful Glen Station","n":"CRU-L5 Beautiful Glen Station","sys":"Stanton","body":"Crusader","max":32,"rr":"RR_CRU_L5"},{"id":"Stanton|Orison","n":"Orison","sys":"Stanton","body":"Crusader","max":32},{"id":"Stanton|Seraphim Station","n":"Seraphim Station","sys":"Stanton","body":"Crusader","max":32,"rr":"RR_CRU_LEO"},{"id":"Stanton|ArcCorp Mining Area 141","n":"ArcCorp Mining Area 141","sys":"Stanton","body":"Daymar","max":32},{"id":"Stanton|Brio's Breaker Yard","n":"Brio's Breaker Yard","sys":"Stanton","body":"Daymar","max":24},{"id":"Stanton|Shubin Mining Facility SCD-1","n":"Shubin Mining Facility SCD-1","sys":"Stanton","body":"Daymar","max":32},{"id":"Stanton|Devlin Scrap & Salvage","n":"Devlin Scrap & Salvage","sys":"Stanton","body":"Euterpe","max":32},{"id":"Stanton|Everus Harbor","n":"Everus Harbor","sys":"Stanton","body":"Hurston","max":32,"rr":"RR_HUR_LEO"},{"id":"Stanton|HDMS-Edmond","n":"HDMS-Edmond","sys":"Stanton","body":"Hurston","max":32},{"id":"Stanton|HDMS-Hadley","n":"HDMS-Hadley","sys":"Stanton","body":"Hurston","max":24},{"id":"Stanton|HDMS-Oparei","n":"HDMS-Oparei","sys":"Stanton","body":"Hurston","max":32},{"id":"Stanton|HDMS-Pinewood","n":"HDMS-Pinewood","sys":"Stanton","body":"Hurston","max":24},{"id":"Stanton|HDMS-Stanhope","n":"HDMS-Stanhope","sys":"Stanton","body":"Hurston","max":24},{"id":"Stanton|HDMS-Thedus","n":"HDMS-Thedus","sys":"Stanton","body":"Hurston","max":24},{"id":"Stanton|HUR-L1 Green Glade Station","n":"HUR-L1 Green Glade Station","sys":"Stanton","body":"Hurston","max":32,"rr":"RR_HUR_L1"},{"id":"Stanton|HUR-L2 Faithful Dream Station","n":"HUR-L2 Faithful Dream Station","sys":"Stanton","body":"Hurston","max":32,"rr":"RR_HUR_L2"},{"id":"Stanton|HUR-L3 Thundering Express Station","n":"HUR-L3 Thundering Express Station","sys":"Stanton","body":"Hurston","max":32,"rr":"RR_HUR_L3"},{"id":"Stanton|HUR-L4 Melodic Fields Station","n":"HUR-L4 Melodic Fields Station","sys":"Stanton","body":"Hurston","max":32,"rr":"RR_HUR_L4"},{"id":"Stanton|HUR-L5 High Course Station","n":"HUR-L5 High Course Station","sys":"Stanton","body":"Hurston","max":32,"rr":"RR_HUR_L5"},{"id":"Stanton|Lorville","n":"Lorville","sys":"Stanton","body":"Hurston","max":32},{"id":"Stanton|Picker's Field","n":"Picker's Field","sys":"Stanton","body":"Hurston","max":32},{"id":"Stanton|Rappel","n":"Rappel","sys":"Stanton","body":"Hurston","max":32},{"id":"Stanton|Reclamation & Disposal Orinth","n":"Reclamation & Disposal Orinth","sys":"Stanton","body":"Hurston","max":32},{"id":"Stanton|Zephyr","n":"Zephyr","sys":"Stanton","body":"Hurston","max":0},{"id":"Stanton|HDMS-Ryder","n":"HDMS-Ryder","sys":"Stanton","body":"Ita","max":24},{"id":"Stanton|HDMS-Woodruff","n":"HDMS-Woodruff","sys":"Stanton","body":"Ita","max":24},{"id":"Stanton|Shubin Mining Facility SAL-2","n":"Shubin Mining Facility SAL-2","sys":"Stanton","body":"Lyria","max":24},{"id":"Stanton|Shubin Mining Facility SAL-5","n":"Shubin Mining Facility SAL-5","sys":"Stanton","body":"Lyria","max":24},{"id":"Stanton|HDMS-Hahn","n":"HDMS-Hahn","sys":"Stanton","body":"Magda","max":32},{"id":"Stanton|HDMS-Perlman","n":"HDMS-Perlman","sys":"Stanton","body":"Magda","max":32},{"id":"Stanton|Astor's Clearing","n":"Astor's Clearing","sys":"Stanton","body":"MicroTech","max":0},{"id":"Stanton|Dunboro","n":"Dunboro","sys":"Stanton","body":"MicroTech","max":32},{"id":"Stanton|MIC-L1 Shallow Frontier Station","n":"MIC-L1 Shallow Frontier Station","sys":"Stanton","body":"MicroTech","max":32,"rr":"RR_MIC_L1"},{"id":"Stanton|MIC-L2 Long Forest Station","n":"MIC-L2 Long Forest Station","sys":"Stanton","body":"MicroTech","max":32,"rr":"RR_MIC_L2"},{"id":"Stanton|MIC-L3 Endless Odyssey Station","n":"MIC-L3 Endless Odyssey Station","sys":"Stanton","body":"MicroTech","max":32,"rr":"RR_MIC_L3"},{"id":"Stanton|MIC-L4 Red Crossroads Station","n":"MIC-L4 Red Crossroads Station","sys":"Stanton","body":"MicroTech","max":32,"rr":"RR_MIC_L4"},{"id":"Stanton|MIC-L5 Modern Icarus Station","n":"MIC-L5 Modern Icarus Station","sys":"Stanton","body":"MicroTech","max":32,"rr":"RR_MIC_L5"},{"id":"Stanton|New Babbage","n":"New Babbage","sys":"Stanton","body":"MicroTech","max":32},{"id":"Stanton|Port Tressler","n":"Port Tressler","sys":"Stanton","body":"MicroTech","max":32,"rr":"RR_MIC_LEO"},{"id":"Stanton|Rayari Deltana Research Outpost","n":"Rayari Deltana Research Outpost","sys":"Stanton","body":"MicroTech","max":32},{"id":"Stanton|Shubin Mining Facility SM0-10","n":"Shubin Mining Facility SM0-10","sys":"Stanton","body":"MicroTech","max":24},{"id":"Stanton|Shubin Mining Facility SM0-13","n":"Shubin Mining Facility SM0-13","sys":"Stanton","body":"MicroTech","max":24},{"id":"Stanton|Shubin Mining Facility SM0-18","n":"Shubin Mining Facility SM0-18","sys":"Stanton","body":"MicroTech","max":32},{"id":"Stanton|Shubin Mining Facility SM0-22","n":"Shubin Mining Facility SM0-22","sys":"Stanton","body":"MicroTech","max":24},{"id":"Stanton|ArcCorp Mining Area 045","n":"ArcCorp Mining Area 045","sys":"Stanton","body":"Wala","max":24},{"id":"Stanton|ArcCorp Mining Area 048","n":"ArcCorp Mining Area 048","sys":"Stanton","body":"Wala","max":24},{"id":"Stanton|ArcCorp Mining Area 056","n":"ArcCorp Mining Area 056","sys":"Stanton","body":"Wala","max":24},{"id":"Stanton|ArcCorp Mining Area 061","n":"ArcCorp Mining Area 061","sys":"Stanton","body":"Wala","max":24},{"id":"Stanton|Samson & Son's Salvage Center","n":"Samson & Son's Salvage Center","sys":"Stanton","body":"Wala","max":24},{"id":"Stanton|ArcCorp Mining Area 157","n":"ArcCorp Mining Area 157","sys":"Stanton","body":"Yela","max":24},{"id":"Stanton|Deakins Research","n":"Deakins Research","sys":"Stanton","body":"Yela","max":32},{"id":"Stanton|Green Imperial Housing Exchange","n":"Green Imperial Housing Exchange","sys":"Stanton","body":"Yela","max":32},{"id":"Nyx|Levski","n":"Levski","sys":"Nyx","body":"","max":32},{"id":"Nyx|People's Service Station Alpha","n":"People's Service Station Alpha","sys":"Nyx","body":"","max":32},{"id":"Nyx|People's Service Station Delta","n":"People's Service Station Delta","sys":"Nyx","body":"","max":32},{"id":"Nyx|People's Service Station Lambda","n":"People's Service Station Lambda","sys":"Nyx","body":"","max":32},{"id":"Nyx|People's Service Station Theta","n":"People's Service Station Theta","sys":"Nyx","body":"","max":32},{"id":"Nyx|Pyro Gateway (Nyx)","n":"Pyro Gateway (Nyx)","sys":"Nyx","body":"","max":32,"rr":"RR_JP_NyxPyro"},{"id":"Nyx|Stanton Gateway (Nyx)","n":"Stanton Gateway (Nyx)","sys":"Nyx","body":"","max":32,"rr":"RR_JP_NyxStanton"},{"id":"Pyro|Nyx Gateway (Pyro)","n":"Nyx Gateway (Pyro)","sys":"Pyro","body":"","max":32,"rr":"RR_JP_PyroNyx"},{"id":"Pyro|Stanton Gateway (Pyro)","n":"Stanton Gateway (Pyro)","sys":"Pyro","body":"","max":32,"rr":"RR_JP_PyroStanton"},{"id":"Pyro|Bueno Ravine","n":"Bueno Ravine","sys":"Pyro","body":"Bloom","max":16},{"id":"Pyro|Orbituary","n":"Orbituary","sys":"Pyro","body":"Bloom","max":32,"rr":"RR_P3_LEO"},{"id":"Pyro|Patch City","n":"Patch City","sys":"Pyro","body":"Bloom","max":32,"rr":"RR_P3_L3"},{"id":"Pyro|Shepherd's Rest","n":"Shepherd's Rest","sys":"Pyro","body":"Bloom","max":32},{"id":"Pyro|Starlight Service Station","n":"Starlight Service Station","sys":"Pyro","body":"Bloom","max":32,"rr":"RR_P3_L1"},{"id":"Pyro|The Golden Riviera","n":"The Golden Riviera","sys":"Pyro","body":"Bloom","max":24},{"id":"Pyro|Windfall","n":"Windfall","sys":"Pyro","body":"Bloom","max":0},{"id":"Pyro|Ashland","n":"Ashland","sys":"Pyro","body":"Ignis","max":32},{"id":"Pyro|Arid Reach","n":"Arid Reach","sys":"Pyro","body":"Monox","max":0},{"id":"Pyro|Checkmate Station","n":"Checkmate Station","sys":"Pyro","body":"Monox","max":32,"rr":"RR_P2_L4"},{"id":"Pyro|Jackson's Swap","n":"Jackson's Swap","sys":"Pyro","body":"Monox","max":16},{"id":"Pyro|Sunset Mesa","n":"Sunset Mesa","sys":"Pyro","body":"Monox","max":16},{"id":"Pyro|Rustville","n":"Rustville","sys":"Pyro","body":"Pyro I","max":16},{"id":"Pyro|Chawla's Beach","n":"Chawla's Beach","sys":"Pyro","body":"Pyro IV","max":16},{"id":"Pyro|Endgame","n":"Endgame","sys":"Pyro","body":"Pyro IV","max":32,"rr":"RR_P6_L3"},{"id":"Pyro|Fallow Field","n":"Fallow Field","sys":"Pyro","body":"Pyro IV","max":24},{"id":"Pyro|Sacren's Plot","n":"Sacren's Plot","sys":"Pyro","body":"Pyro IV","max":16},{"id":"Pyro|Gaslight","n":"Gaslight","sys":"Pyro","body":"Pyro V","max":32,"rr":"RR_P5_L2"},{"id":"Pyro|Rat's Nest","n":"Rat's Nest","sys":"Pyro","body":"Pyro V","max":32,"rr":"RR_P5_L5"},{"id":"Pyro|Rod's Fuel 'N Supplies","n":"Rod's Fuel 'N Supplies","sys":"Pyro","body":"Pyro V","max":32,"rr":"RR_P5_L4"},{"id":"Pyro|Blackrock Exchange","n":"Blackrock Exchange","sys":"Pyro","body":"Terminus","max":0},{"id":"Pyro|Canard View","n":"Canard View","sys":"Pyro","body":"Terminus","max":16},{"id":"Pyro|Dudley & Daughters","n":"Dudley & Daughters","sys":"Pyro","body":"Terminus","max":32,"rr":"RR_P6_L4"},{"id":"Pyro|Last Landings","n":"Last Landings","sys":"Pyro","body":"Terminus","max":16},{"id":"Pyro|Megumi Refueling","n":"Megumi Refueling","sys":"Pyro","body":"Terminus","max":32,"rr":"RR_P6_L5"},{"id":"Pyro|Rough Landing","n":"Rough Landing","sys":"Pyro","body":"Terminus","max":0},{"id":"Pyro|Ruin Station","n":"Ruin Station","sys":"Pyro","body":"Terminus","max":32,"rr":"RR_P6_LEO"},{"id":"Pyro|Scarper's Turn","n":"Scarper's Turn","sys":"Pyro","body":"Terminus","max":16},{"id":"Pyro|Seer's Canyon","n":"Seer's Canyon","sys":"Pyro","body":"Vatra","max":16}], openLoc(loc){Cockpit.intent={loc}; Cockpit.go('fracht');}};
function boot(){

/* ---------- Sessions from the game logs ---------- */
const SZ=(function(){
const L=()=>(document.documentElement.getAttribute('lang')||'de').slice(0,2);
const T=(de,en)=>L()==='en'?en:de;
const $z=id=>document.getElementById('sz-'+id);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
// Cache key v2: sessions also carry the missions for the reputation tab.
const MAXF=25, CKEY='scha_sessions_cache_v2';
const DIR_OK=typeof window.showDirectoryPicker==='function';
let DIR=null, PERM=false, SESS=[], BUSY=false, SRC='', INI=null;

/* ---------- parsing ---------- */
// One session per log file: start, end, how it ended, server joins, last place, ship, jurisdiction.
const RE={join:/^<([^>]+)> \[Notice\] <Join PU> address\[([^\]]*)\] port\[(\d+)\] shard\[([^\]]*)\]/gm,
  loc:/^<([^>]+)> .*?<RequestLocationInventory> Player\[[^\]]*\] requested inventory for Location\[([^\]]+)\]/gm,
  ship:/^<([^>]+)> .*?<Local Route Guard[^>]*>.*?\| ([A-Z]{3,5}_[A-Za-z0-9_]+?)_\d{9,}\[/gm,
  jur:/^<([^>]+)> .*?notification "(?:Rechtsgebiet von ([^:"]+?) betreten|Entered ([^:"]+?) Jurisdiction)/gm,
  ts:/^<(\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z)>/gm,
  // Missions (reputation tab): notifications with a MissionId carry the title; <EndMission> the result.
  mnote:/^<([^>]+)> \[Notice\] <SHUDEvent_OnNotification> Added notification "([^"]*)" \[\d+\] to queue\. New queue size: \d+, MissionId: \[([0-9a-f-]{36})\]/gm,
  mend:/^<([^>]+)> \[Notice\] <EndMission> Ending mission for player\. MissionId\[([0-9a-f-]{36})\].*?CompletionType\[(\w+)\]/gm,
  morg:/SendCommsNotification \+?Missions\.Organization\.([A-Za-z]+)[^\n]*? - Mission: \[([0-9a-f-]{36})\]/g,
  mshare:/^<([^>]+)> \[Notice\] <SHUDEvent_OnNotification> Added notification "(?:Auftrag geteilt|Contract Shared|Mission Shared): ([^"]*)"/gm};
function all(re,text){re.lastIndex=0; const out=[]; let m; while((m=re.exec(text))) out.push(m); return out;}
function parse(text,name){
  const ts=all(RE.ts,text.slice(0,20000)), tail=all(RE.ts,text.slice(-60000));
  const crash=text.includes('crash handler taking over')||text.includes('All crash related data');
  const normal=text.includes('CCIGBroker::FastShutdown');
  const joins=all(RE.join,text).map(m=>({t:m[1],addr:m[2],port:m[3],shard:m[4]}));
  const locs=all(RE.loc,text).filter(m=>m[2]!=='INVALID_LOCATION_ID'), ships=all(RE.ship,text), jurs=all(RE.jur,text);
  const last=a=>a.length?a[a.length-1]:null, lo=last(locs), sh=last(ships), ju=last(jurs);
  return {name,start:ts[0]?.[1]||'',end:tail.length?tail[tail.length-1][1]:'',ended:crash?'crash':normal?'ok':'open',joins,
    loc:lo?{t:lo[1],raw:lo[2]}:null, ship:sh?{t:sh[1],raw:sh[2]}:null, jur:ju?{t:ju[1],n:ju[2]||ju[3]}:null, mis:missions(text)};}
// Missions of one log: per MissionId the first time, the distinct notification texts (one is the title) and the
// organisation; the ends with their result; "shared" notifications by title.
function missions(text){const ids={}, Z='00000000-0000-0000-0000-000000000000';
  for(const m of all(RE.mnote,text)){if(m[3]===Z) continue; const o=ids[m[3]]||(ids[m[3]]={t:m[1],x:[],org:''});
    const s=m[2].replace(/:\s*$/,''); if(o.x.length<6&&!o.x.includes(s)) o.x.push(s);}
  RE.morg.lastIndex=0; let g; while((g=RE.morg.exec(text))){const o=ids[g[2]]; if(o&&!o.org) o.org=g[1]; else if(!o) ids[g[2]]={t:'',x:[],org:g[1]};}
  return {ids, ends:all(RE.mend,text).map(m=>({t:m[1],id:m[2],r:m[3]})), shares:all(RE.mshare,text).map(m=>({t:m[1],x:m[2].replace(/:\s*$/,'')}))};}

/* ---------- names ---------- */
// Region from the shard name, e.g. pub_euw1b_13165946_260 -> euw1.
const REG={euw1:['EU-West','EU West'],euc1:['EU-Mitte','EU Central'],use1:['US-Ost','US East'],usw2:['US-West','US West'],usw1:['US-West','US West'],ape1:['Asien-Ost','Asia East'],apse2:['Asien-Pazifik Südost','Asia Pacific Southeast'],apne1:['Asien-Pazifik Nordost','Asia Pacific Northeast']};
// Display names of shards as the game shows them when joining. They are not in the log and do not follow
// from the id, so this is a table from screenshots (Robert, 19.–25.11.2026, build 13165946: 23 screenshots,
// 18 shards, no conflicts). The id contains the build: after a patch these entries simply stop matching.
const SHARD_NAMES={pub_apse2a_13165946_010:'confident_antimatter',pub_apse2a_13165946_050:'unruffled_variety',pub_apse2a_13165946_060:'heuristic_spherical',pub_euw1b_13165946_010:'flamboyant_terra',pub_euw1b_13165946_030:'knowledgeable_solar_system',pub_euw1b_13165946_040:'insightful_propulsion',pub_euw1b_13165946_050:'artistic_geostationary',pub_euw1b_13165946_090:'analytical_oxygen',pub_euw1b_13165946_140:'meticulous_absorption',pub_euw1b_13165946_150:'analytical_absorption',pub_euw1b_13165946_170:'balanced_reflector',pub_euw1b_13165946_180:'focused_launch',pub_euw1b_13165946_190:'reverent_alien',pub_euw1b_13165946_210:'dynamic_perihelion',pub_euw1b_13165946_280:'confident_relativity',pub_euw1b_13165946_340:'meticulous_planetarium',pub_use1b_13165946_090:'honorable_zeal',pub_use1b_13165946_240:'spirited_hypothesis'};
// Shard for display: the known name in front, the id below; unknown shards show the id only.
function shardHtml(id,big){const n=SHARD_NAMES[id];
  if(!n) return big?esc(id):`<span class="sz-mono">${esc(id)}</span>`;
  return big?`${esc(n)}<small class="sz-id">${esc(id)}</small>`:`<b class="sz-sn">${esc(n)}</b><br><span class="sz-mono">${esc(id)}</span>`;}
function region(shard){const m=/^pub_([a-z]+\d)/.exec(shard||''); if(!m) return ''; const r=REG[m[1]]; return r?`${T(r[0],r[1])} (${m[1]})`:m[1];}
const MAKERS={AEGS:'Aegis',ANVL:'Anvil',ARGO:'Argo',BANU:'Banu',CNOU:'C.O.',CRUS:'Crusader',DRAK:'Drake',ESPR:'Esperia',GAMA:'Gatac',GLSN:'Gallant',GRIN:'Greycat',KRIG:'Kruger',MISC:'MISC',MRAI:'Mirai',ORIG:'Origin',RSI:'RSI',TMBL:'Tumbril',VNCL:'Vanduul',XIAN:'Aopoa'};
function shipName(raw){const p=raw.split('_'); const mk=MAKERS[p[0]]||p[0]; return mk+' '+p.slice(1).join(' ');}
// Split internal names into words: "HDMSEdmond" -> hdms edmond, "Area056" -> area 056.
const words=s=>String(s).replace(/([a-z])([A-Z])/g,'$1 $2').replace(/([A-Z]+)([A-Z][a-z])/g,'$1 $2').replace(/([A-Za-z])(\d)/g,'$1 $2').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
const STOP=new Set(['stanton','nyx','pyro','outpost','station','the','and','von','mining','hydro','base','paf','rr','social']);
// Map an internal location name to a cargo-ledger place: internal station codes first, then shared words and numbers.
// Log names that differ from the place name. Castra and Magnus are the systems these gateways will lead to
// later; as long as Castra and Magnus are not in the game, the codes stand for the Stanton–Nyx gateways.
// Check this on every patch (Game.log: Location[RR_JP_…]).
const ALIAS={GrimHEX:'Green Imperial Housing Exchange',RR_JP_NyxCastra:'RR_JP_NyxStanton',RR_JP_StantonMagnus:'RR_JP_StantonNyx'};
function placeOf(raw){const P=(typeof LB!=='undefined'&&LB.places)||[]; if(!raw) return null;
  const al=ALIAS[raw]; if(al){const hit=P.find(p=>p.rr===al||p.n===al); if(hit) return hit;}
  const byRR=P.find(p=>p.rr===raw); if(byRR) return byRR;
  // Drop system/planet prefixes such as "Stanton1b" or "Nyx": their digits are no part of the place name.
  const core=String(raw).split('_').filter(x=>!/^(Stanton|Pyro|Nyx)\d*[a-z]?$/.test(x)).join('_');
  const norm=x=>/^\d+$/.test(x)?String(+x):x;
  const w=words(core).filter(x=>!STOP.has(x)).map(norm), nums=w.filter(x=>/^\d+$/.test(x)), txt=w.filter(x=>!/^\d+$/.test(x));
  let best=null, score=0;
  for(const p of P){const pw=new Set(words(p.n).map(norm));
    if(nums.some(n=>!pw.has(n))) continue;
    const s=txt.filter(x=>pw.has(x)).length;
    if(s>score){score=s; best=p;}}
  // At least one shared word (a number alone never counts); two if the internal name has many words.
  return score>=1&&(score>=2||txt.length<=2)?best:null;}
function prettyLoc(raw){return String(raw).replace(/^RR_/,'').replace(/_/g,' ').replace(/([a-z])([A-Z])/g,'$1 $2');}

/* ---------- reading the folder ---------- */
function cacheGet(){try{return JSON.parse(localStorage.getItem(CKEY)||'{}');}catch(e){return {};}}
function cacheSet(c){try{const keys=Object.keys(c); if(keys.length>80) for(const k of keys.slice(0,keys.length-80)) delete c[k]; localStorage.setItem(CKEY,JSON.stringify(c));}catch(e){}}
// The newest MAXF log files of a folder: Game.log plus logbackups/*.log.
async function filesFromDir(dir){const out=[];
  try{const g=await dir.getFileHandle('Game.log'); out.push(await g.getFile());}catch(e){}
  try{const b=await dir.getDirectoryHandle('logbackups'); for await (const [n,h] of b.entries()) if(h.kind==='file'&&n.endsWith('.log')) out.push(await h.getFile());}catch(e){}
  return out;}
// Language file of the game (data/Localization/<language>/global.ini) in the chosen folder; German first.
function iniFromInput(list){const c=[...list].filter(f=>/(^|\/)data\/Localization\/[^/]+\/global\.ini$/i.test(f.webkitRelativePath||''));
  return c.find(f=>/german/i.test(f.webkitRelativePath))||c[0]||null;}
async function iniFromDir(dir){try{const loc=await (await dir.getDirectoryHandle('data')).getDirectoryHandle('Localization'); let first=null;
    for await (const [n,h] of loc.entries()){if(h.kind!=='directory') continue; try{const f=await (await h.getFileHandle('global.ini')).getFile(); if(/german/i.test(n)) return f; first=first||f;}catch(e){}}
    return first;}catch(e){return null;}}
// Accept the LIVE/PTU folder (Game.log + logbackups/*.log) or the logbackups folder itself.
function filesFromInput(list){return [...list].filter(f=>{const p=(f.webkitRelativePath||f.name).split('/');
  return (p.length===2&&p[1]==='Game.log')||(p.length===2&&p[0]==='logbackups'&&p[1].endsWith('.log'))||(p.length===3&&p[1]==='logbackups'&&p[2].endsWith('.log'));});}
async function readFiles(files,label,once){if(BUSY) return; BUSY=true; SRC=label;
  const pick=files.sort((a,b)=>b.lastModified-a.lastModified).slice(0,MAXF);
  if(!pick.length){BUSY=false; stat(T('In diesem Ordner liegen keine Game.log und kein logbackups-Ordner. Bitte den Ordner LIVE (oder PTU) wählen.','No Game.log or logbackups folder here. Please choose the LIVE (or PTU) folder.')); render(); loaded(); return;}
  const cache=cacheGet(); SESS=[]; let i=0;
  for(const f of pick){i++; stat(T(`Lese ${i} von ${pick.length} Sitzungen …`,`Reading ${i} of ${pick.length} sessions …`));
    const key=f.name+'|'+f.size+'|'+f.lastModified; let s=cache[key];
    if(!s){s=parse(await f.text(),f.name); if(f.name!=='Game.log') cache[key]=s;}
    SESS.push(s); await new Promise(r=>setTimeout(r,0));}
  cacheSet(cache); SESS.sort((a,b)=>(b.start||'').localeCompare(a.start||'')); BUSY=false;
  stat(T(`${label} · ${SESS.length} Sitzungen gelesen · ${new Date().toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'})}`,`${label} · ${SESS.length} sessions read · ${new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}`)+(once?T(' · beim nächsten Besuch erneut laden (Ordner wird nicht gemerkt)',' · load again on your next visit (folder is not remembered)'):'')); render(); loaded();}
function stat(t){$z('stat').textContent=t;}
// Tell other tabs (reputation) that the sessions changed.
function loaded(){document.dispatchEvent(new CustomEvent('sz:loaded'));}

/* ---------- remembered folder (Chrome/Edge) ---------- */
function idb(){return new Promise((res,rej)=>{const r=indexedDB.open('scha_sessions',1); r.onupgradeneeded=()=>r.result.createObjectStore('h'); r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error);});}
async function idbSet(v){try{const db=await idb(); await new Promise(res=>{const tx=db.transaction('h','readwrite'); tx.objectStore('h').put(v,'dir'); tx.oncomplete=res; tx.onerror=res;});}catch(e){}}
async function idbGet(){try{const db=await idb(); return await new Promise(res=>{const r=db.transaction('h').objectStore('h').get('dir'); r.onsuccess=()=>res(r.result||null); r.onerror=()=>res(null);});}catch(e){return null;}}
// Main way: the folder input works everywhere, also under C:\Program Files.
function pick(){$z('input').click();}
// Optional: remember the folder (Chrome/Edge). Chrome refuses folders under C:\Program Files.
async function remember(){
  try{const d=await window.showDirectoryPicker({id:'sc-logs',mode:'read'}); DIR=d; PERM=true; await idbSet(d); INI=await iniFromDir(d); await readFiles(await filesFromDir(d),d.name);}
  catch(e){stat(T('Nicht gemerkt. Liegt Star Citizen unter C:\\Programme, sperrt Chrome das Merken; nimm dann „Log-Ordner laden …“.','Not remembered. If Star Citizen is under C:\\Program Files, Chrome blocks remembering; use “Load log folder …” instead.'));}}
async function reload(){if(!DIR) return pick();
  try{if(!PERM) PERM=(await DIR.requestPermission({mode:'read'}))==='granted'; if(PERM){INI=await iniFromDir(DIR); await readFiles(await filesFromDir(DIR),DIR.name);}}
  catch(e){stat(T('Ordner nicht erreichbar.','Folder not reachable.'));}}
// Draw the empty state at once; the remembered folder (IndexedDB) may answer late or not at all.
async function init(){render(); const d=DIR_OK?await Promise.race([idbGet(),new Promise(r=>setTimeout(()=>r(null),1500))]):null; if(d){DIR=d; try{PERM=(await d.queryPermission({mode:'read'}))==='granted';}catch(e){PERM=false;}}
  if(DIR&&PERM){INI=await iniFromDir(DIR); await readFiles(await filesFromDir(DIR),DIR.name);} else render();}

/* ---------- rendering ---------- */
const fmtT=s=>s?new Date(s).toLocaleString(L()==='en'?'en-GB':'de-DE',{dateStyle:'short',timeStyle:'short'}):'–';
const tOnly=s=>s?new Date(s).toLocaleTimeString(L()==='en'?'en-GB':'de-DE',{hour:'2-digit',minute:'2-digit'}):'';
function dur(a,b){if(!a||!b) return '–'; const m=Math.max(0,Math.round((new Date(b)-new Date(a))/60000)); return m>=60?`${Math.floor(m/60)} h ${m%60} min`:`${m} min`;}
function endTag(s){return s.ended==='crash'?`<span class="sz-end crash">⚠ ${T('abgestürzt','crashed')} ${tOnly(s.end)}</span>`
  :s.ended==='ok'?`<span class="sz-end ok">✓ ${T('beendet','closed')} ${tOnly(s.end)}</span>`:`<span class="sz-end">… ${T('läuft oder ohne Abschluss','running or no proper end')}</span>`;}
function locHtml(l){if(!l) return '–'; const p=placeOf(l.raw);
  return p?`<button type="button" class="sz-loc" data-loc="p:${esc(p.id)}" title="${T('Im Fracht-Logbuch öffnen','Open in the cargo ledger')}">${esc(p.n)}</button>`:`<span title="${esc(l.raw)}">${esc(prettyLoc(l.raw))}</span>`;}
function render(){const last=$z('last'), list=$z('list'), has=!!SESS.length;
  $z('pick').classList.toggle('pri',!has&&!(DIR&&!PERM)); $z('reload').hidden=!DIR; $z('remember').hidden=!DIR_OK||!!DIR;
  $z('reload').innerHTML=DIR&&!PERM?`🔓 ${T('Zugriff erlauben und einlesen','Allow access and read')}`:`⟳ ${T('Neu einlesen','Read again')}`;
  $z('reload').classList.toggle('pri',!!(DIR&&!PERM));
  if(!has){last.innerHTML=''; list.innerHTML=`<p class="sz-empty">${DIR&&!PERM?T(`Der Ordner „${esc(DIR.name)}“ ist gemerkt; der Browser braucht nach dem Neuladen einmal deine Erlaubnis.`,`The folder “${esc(DIR.name)}” is remembered; after reloading, the browser needs your permission once.`)
    :T('Lade den Log-Ordner von Star Citizen (LIVE oder PTU). Dann siehst du hier, auf welchem Server und wo du zuletzt warst, auch nach einem Absturz.','Load the Star Citizen log folder (LIVE or PTU). Then you see here which server you were on and where, also after a crash.')}</p>`; return;}
  // "Last" = the newest session that joined a server (menu-only sessions are skipped).
  const s=SESS.find(x=>x.joins.length)||SESS[0], j=s.joins[s.joins.length-1];
  // The newest crash, if it is not the session shown as "last": after a crash one usually starts again.
  const c=SESS.find(x=>x.ended==='crash'&&x.joins.length), cj=c&&c.joins[c.joins.length-1];
  const crashCard=c&&c!==s?`<div class="sz-last crash"><h3>⚠ ${T('Letzter Absturz','Last crash')} · ${fmtT(c.end)}</h3>
    <div class="sz-shard">${shardHtml(cj.shard,true)}<button type="button" class="sz-copy" data-copy="${esc(cj.shard)}">${T('kopieren','copy')}</button></div>
    <div class="sz-grid"><div><small>Region</small><b>${esc(region(cj.shard))}</b></div><div><small>Server</small><b class="sz-mono">${esc(cj.addr+':'+cj.port)}</b></div>
      <div><small>${T('Letzter Ort','Last place')}</small>${locHtml(c.loc)}${c.loc?`<small>${tOnly(c.loc.t)}</small>`:''}</div>
      <div><small>${T('Letztes Schiff','Last ship')}</small><b>${c.ship?esc(shipName(c.ship.raw)):'–'}</b></div></div></div>`:'';
  last.innerHTML=crashCard+`<div class="sz-last${s.ended==='crash'?' crash':''}"><h3>${T('Zuletzt','Last time')} · ${fmtT(s.start)}</h3>
    ${j?`<div class="sz-shard">${shardHtml(j.shard,true)}<button type="button" class="sz-copy" data-copy="${esc(j.shard)}">${T('kopieren','copy')}</button></div>`:`<div>${T('Kein Server-Beitritt in dieser Sitzung.','No server join in this session.')}</div>`}
    <div class="sz-grid">
      <div><small>Region</small><b>${j?esc(region(j.shard)):'–'}</b></div>
      <div><small>Server</small><b class="sz-mono">${j?esc(j.addr+':'+j.port):'–'}</b>${j?`<small>${T('beigetreten','joined')} ${tOnly(j.t)}</small>`:''}</div>
      <div><small>${T('Letzter Ort','Last place')}</small>${locHtml(s.loc)}${s.loc?`<small>${tOnly(s.loc.t)}</small>`:''}</div>
      <div><small>${T('Letztes Schiff','Last ship')}</small><b>${s.ship?esc(shipName(s.ship.raw)):'–'}</b>${s.ship?`<small>${tOnly(s.ship.t)}</small>`:''}</div>
      <div><small>${T('Rechtsgebiet','Jurisdiction')}</small><b>${s.jur?esc(s.jur.n):'–'}</b>${s.jur?`<small>${tOnly(s.jur.t)}</small>`:''}</div>
      <div><small>${T('Ende','End')}</small>${endTag(s)}</div>
    </div></div>`;
  list.innerHTML=`<h2>${T('Letzte Sitzungen','Recent sessions')}</h2><div class="tablewrap"><table><thead><tr><th>${T('Beginn','Start')}</th><th>${T('Dauer','Duration')}</th><th>${T('Ende','End')}</th><th>${T('Letzter Shard','Last shard')}</th><th>${T('Letzter Ort','Last place')}</th><th>${T('Letztes Schiff','Last ship')}</th><th>${T('Server-Beitritte','Server joins')}</th></tr></thead><tbody>${SESS.map(x=>{const lj=x.joins[x.joins.length-1];
    return `<tr><td>${fmtT(x.start)}</td><td>${dur(x.start,x.end)}</td><td>${endTag(x)}</td><td>${lj?`${shardHtml(lj.shard)}<br><small>${esc(region(lj.shard))}</small>`:'–'}</td><td>${locHtml(x.loc)}</td><td>${x.ship?esc(shipName(x.ship.raw)):'–'}</td>
      <td>${x.joins.length?`<details><summary>${x.joins.length}</summary><ol>${x.joins.map(k=>`<li>${tOnly(k.t)} · ${shardHtml(k.shard)}</li>`).join('')}</ol></details>`:'0'}</td></tr>`}).join('')}</tbody></table></div>
    <p class="sz-note">${T('Mehrere Beitritte in einer Sitzung entstehen meist über das Hauptmenü. Maßgeblich ist der letzte. Ob das Spiel dich gezielt auf denselben Shard zurücklässt, steht nicht im Log. Shard-Namen (wie im Spiel beim Beitritt) stammen aus einer Tabelle eigener Screenshots und gelten nur für den Spielstand, zu dem sie erfasst wurden; unbekannte Shards zeigen nur die ID.','Several joins in one session usually come from the main menu; the last one counts. Whether the game lets you back onto the same shard is not in the log. Shard names (as the game shows them when joining) come from a table of own screenshots and only hold for the game build they were recorded in; unknown shards show the id only.')}</p>`;}

/* ---------- events ---------- */
$z('pick').addEventListener('click',pick);
$z('reload').addEventListener('click',reload);
$z('remember').addEventListener('click',remember);
$z('input').addEventListener('change',e=>{INI=iniFromInput(e.target.files); const f=filesFromInput(e.target.files); const root=(e.target.files[0]?.webkitRelativePath||'').split('/')[0]; readFiles(f,root||'Logs',true); e.target.value='';});
document.getElementById('view-sessions').addEventListener('click',async e=>{const c=e.target.closest('[data-copy]');
  if(c){try{await navigator.clipboard.writeText(c.dataset.copy); c.textContent=T('kopiert ✓','copied ✓');}catch(x){c.textContent=T('nicht möglich','not possible');} setTimeout(()=>{c.textContent=T('kopieren','copy');},1600); return;}
  const l=e.target.closest('[data-loc]'); if(l&&typeof LB!=='undefined'&&LB.openLoc) LB.openLoc(l.dataset.loc);});
let started=false;
return {render(){if(!started){started=true; init();} else render();}, start(){if(!started){started=true; init();}},
  pick, sessions:()=>SESS, ini:()=>INI, _setIni:f=>{INI=f;}, status:()=>$z('stat').textContent, _parse:parse, _placeOf:placeOf, _fromInput:filesFromInput, _read:readFiles, _shipName:shipName, _load:(list)=>{SESS=list; render(); loaded();}};
})();


/* ---------- Reputation per organisation ---------- */
const RF=(function(){
const TAB={
"stand": "2026-11-21",
"quelle": "Anmerkungen der deutschen Community-Übersetzung (global.ini): nur Zahlen, Titel, Rangnamen; Rangleitern ergänzt aus sc-market.space (4.10-LIVE (Data.p4k 2026-11-14))",
"missions": {
"A Chance to Impress": [
[
"Vaughn",
100,
100,
null,
"vaughn_assassination_ve_desc_intro"
]
],
"A Complicated Task": [
[
"Vaughn",
150,
150,
null,
"vaughn_assassination_m_desc_001"
]
],
"A Difficult Task": [
[
"Vaughn",
200,
200,
null,
"vaughn_assassination_h_desc_001"
]
],
"A Fond Farewell": [
[
"Vaughn",
250,
250,
null,
"vaughn_searchbody_space_vh_desc_001"
]
],
"A Simple Task": [
[
"Vaughn",
100,
100,
null,
"vaughn_assassination_ve_desc_001"
]
],
"A Straightforward Task": [
[
"Vaughn",
100,
100,
null,
"vaughn_assassination_e_desc_001"
]
],
"A Swift Reprisal": [
[
"Headhunters",
50,
50,
0,
"headhunters_eliminateall_caves_desc_01"
]
],
"A Troublesome Task": [
[
"Vaughn",
300,
300,
null,
"vaughn_assassination_s_desc_001"
]
],
"A Very Difficult Task": [
[
"Vaughn",
250,
250,
null,
"vaughn_assassination_vh_desc_001"
]
],
"A little retaliation": [
[
"Headhunters",
375,
375,
5800,
"headhunters_chainelimall_1c_attackcfp_e_desc_001"
]
],
"Adagio Holdings in Need of Salvagers": [
[
"Adagio Holdings",
100,
100,
0,
"adagio_industrial_salvage_universal_intro_desc_001"
]
],
"Advanced Tracker License Certification": [
[
"Bounty Hunters Guild",
50,
50,
null,
"bhg_certification_veryhard_desc"
]
],
"Alert: ~mission(Location) under attack": [
[
"Citizens For Prosperity",
350,
350,
5800,
"cfp_chainelimall_1c_elimspec_genattack_e_desc_001"
]
],
"Ambush Op": [
[
"Headhunters",
150,
150,
null,
"headhunters_shipambush_m_desc_001"
]
],
"Annihilating the Alliance": [
[
"Vaughn",
300,
300,
null,
"vaughn_assassination_pa_s_desc"
]
],
"Armor with Vanduul": [
[
"Wikelo Emporium",
25,
25,
null,
"thecollector_recipes_desc_spikeyarmor"
]
],
"Armor with horn and string": [
[
"Wikelo Emporium",
25,
25,
null,
"thecollector_recipes_desc_sandarmour"
]
],
"Asgard Fight Mod": [
[
"Wikelo Emporium",
250,
250,
null,
"thecollector_ships_anvil_asgard_desc"
]
],
"Assist People's Alliance Vessel Tranquility": [
[
"InterSec Defense Solutions",
200,
200,
5800,
"intersec_tsg_assist_solo_desc_001"
]
],
"Assist Retreating Ship": [
[
"Citizens For Prosperity",
200,
200,
null,
"cfp_defendship_mrt_bombingrun_desc_001"
]
],
"Assistance needed at ~mission(Location)": [
[
"Citizens For Prosperity",
75,
75,
0,
"cfp_defend_cave_generic_desc_001"
]
],
"Attack on CFP outpost": [
[
"Citizens For Prosperity",
75,
75,
0,
"cfp_eliminateall_fromcfp_gen_e_desc_001"
]
],
"Back up needed at outpost": [
[
"Headhunters",
250,
250,
2200,
"headhunters_defend_xt_desc_001"
]
],
"Backup Needed Now": [
[
"Headhunters",
150,
150,
null,
"headhunters_defendship_mrt_pa_desc_001"
]
],
"Bad at Goodbyes": [
[
"Bit Zeros",
300,
300,
38000,
"bitzeros_blackbox_s_desc_001"
]
],
"Big Style LMG": [
[
"Wikelo Emporium",
10,
10,
null,
"thecollector_recipes_desc_gmni_lmg"
]
],
"Blackbox Recovery Request: Investigator Level": [
[
"Hockrow Agency",
150,
150,
null,
"hockrow_blackbox_space_m_desc_001"
]
],
"Blackbox Recovery Request: Junior Level": [
[
"Hockrow Agency",
100,
100,
null,
"hockrow_blackbox_space_e_desc_001"
]
],
"Blackbox Recovery Request: Lead Investigator Level": [
[
"Hockrow Agency",
250,
250,
null,
"hockrow_blackbox_space_vh_desc_001"
]
],
"Blackbox Recovery Request: Probationary Level": [
[
"Hockrow Agency",
100,
100,
null,
"hockrow_blackbox_space_ve_desc_001"
]
],
"Blackbox Recovery Request: Senior Investigator Level": [
[
"Hockrow Agency",
200,
200,
null,
"hockrow_blackbox_space_h_desc_001"
]
],
"Blackbox Recovery Request: Special Investigator Level": [
[
"Hockrow Agency",
300,
300,
null,
"hockrow_blackbox_space_s_desc_001"
]
],
"Blackbox Retrieval": [
[
"Recco Battaglia",
240,
240,
6000,
"battaglia_rpt_recoveritem_ve_01_desc"
]
],
"Blackbox Retrieval Very Dangerous": [
[
"Recco Battaglia",
360,
360,
6000,
"battaglia_rpt_recoveritem_vh_01_desc"
]
],
"Blackbox Retrieval w/Danger": [
[
"Recco Battaglia",
260,
260,
6000,
"battaglia_rpt_recoveritem_m_01_desc"
]
],
"Bleeding Edge Tech": [
[
"Bit Zeros",
100,
100,
800,
"bitzeros_recoveritem_generic_desc_001"
]
],
"Block XenoThreat Expansion": [
[
"Headhunters",
250,
250,
2200,
"headhunters_defend_xt_vh_desc_001"
]
],
"Blow Up Citizens for Prosperity Fuel Reserves": [
[
"Headhunters",
150,
200,
null,
"headhunters_bombingrun_m_cfp_desc_001"
]
],
"Blow Up XenoThreat Fuel Reserves": [
[
"Headhunters",
150,
150,
null,
"headhunters_bombingrun_h_xt_desc_001"
]
],
"Bring Down the Hammer": [
[
"Headhunters",
200,
200,
null,
"headhunters_defendship_multi_hrt_pa_desc_001"
]
],
"Build a Mod Scorpius": [
[
"Wikelo Emporium",
100,
100,
null,
"thecollector_ships_scorpius_desc"
]
],
"COURIER NEEDED FOR RETRIEVAL - EXP: E": [
[
"FTL Courier",
100,
100,
null,
"ftl_recoveritem_e_desc_001"
]
],
"COURIER NEEDED FOR RETRIEVAL - EXP: EL": [
[
"FTL Courier",
300,
300,
null,
"ftl_recoveritem_s_desc_001"
]
],
"COURIER NEEDED FOR RETRIEVAL - EXP: EX": [
[
"FTL Courier",
250,
250,
null,
"ftl_recoveritem_vh_desc_001"
]
],
"COURIER NEEDED FOR RETRIEVAL - EXP: JR": [
[
"FTL Courier",
150,
150,
null,
"ftl_recoveritem_m_desc_001"
]
],
"COURIER NEEDED FOR RETRIEVAL - EXP: S": [
[
"FTL Courier",
200,
200,
null,
"ftl_recoveritem_h_desc_001"
]
],
"COURIER NEEDED FOR RETRIEVAL - EXP: U": [
[
"FTL Courier",
100,
100,
null,
"ftl_recoveritem_ve_desc_001"
]
],
"CRITICAL FLEET REFUEL": [
[
"United Wayfarers Club",
200,
200,
15000,
"uwc_refueling_multiple_hard_desc_001"
]
],
"CRITICAL REFUEL REQUEST: ~mission(Ship)": [
[
"United Wayfarers Club",
200,
200,
38000,
"uwc_refueling_high_desc_001"
]
],
"Call for Help: ~mission(Location)": [
[
"Citizens For Prosperity",
150,
150,
800,
"cfp_defend_regionshift_desc_001"
]
],
"Campaign to reclaim XenoThreat outposts": [
[
"Citizens For Prosperity",
450,
450,
38000,
"cfp_chainelimall_3c_elimspec_xtattack_vh_desc_001"
]
],
"Capture Arlington Gang Leader Maltrox Arlington": [
[
"Eckhart Security",
500,
500,
null,
"mg_miles_capturegang_desc_006"
]
],
"Capture Arlington Gang Member Kass Dent": [
[
"Eckhart Security",
500,
500,
null,
"mg_miles_capturegang_desc_005"
]
],
"Capture Arlington Gang Member Les Arlington": [
[
"Eckhart Security",
500,
500,
null,
"mg_miles_capturegang_desc_001"
]
],
"Capture Arlington Gang Member Nicks Cantwell": [
[
"Eckhart Security",
500,
500,
null,
"mg_miles_capturegang_desc_002"
]
],
"Capture Arlington Gang Member Oslo Arlington": [
[
"Eckhart Security",
500,
500,
null,
"mg_miles_capturegang_desc_004"
]
],
"Capture Arlington Gang Member Sam \"Weepy\" Arlington": [
[
"Eckhart Security",
500,
500,
null,
"mg_miles_capturegang_desc_003"
]
],
"Carefully Clear Site": [
[
"Foxwell Enforcement",
200,
200,
5800,
"foxwell_eliminateall_nonhostiles_desc_001"
]
],
"Cargo Hauling Opportunity with Ling Hauling": [
[
"Ling Family Hauling",
100,
100,
0,
"lingfamily_haulcargo_atob_intro_desc"
]
],
"Cargo Transfer from Shuttered Facility": [
[
"Red Wind Linehaul",
50,
50,
null,
"redwind_haulcargo_atob_asd_desc"
]
],
"Checking For a Pulse": [
[
"Vaughn",
100,
100,
null,
"vaughn_searchbody_space_e_desc_001"
]
],
"Claim #~mission(ClaimNumber): ~mission(Ship) Salvage Rights": [
[
"Adagio Holdings",
100,
150,
null,
"adagio_basicsalvage_desc_01"
]
],
"Clear CFP Route of Hostiles": [
[
"Citizens For Prosperity",
100,
100,
null,
"cfp_shipwaveattack_clearhostiles_desc_e_001"
]
],
"Clear Citizens for Prosperity Servers": [
[
"Headhunters",
75,
75,
null,
"headhunters_sabotage_servers_e_cfp_desc_001"
]
],
"Client Needs Combat Support": [
[
"Eckhart Security",
250,
250,
15000,
"eckhart_defendship_multi_vhrt_sb_desc_001"
]
],
"Collect Irradiated Kopion Horns": [
[
"Rayari Incorporated",
150,
150,
null,
"rain_collectresources_storm_desc_001"
]
],
"Collect Irradiated Valakkar Eggs": [
[
"Rayari Incorporated",
150,
150,
null,
"rain_collectresources_storm_desc_004"
]
],
"Combat Support: ~mission(Location)": [
[
"Eckhart Security",
2000,
2000,
null,
"eckhartsecurity_eliminateall_storm_data_h_desc_001"
]
],
"Come to Aid of Convoy": [
[
"Citizens For Prosperity",
300,
300,
38000,
"cfp_defendship_multi_srt_desc_001"
]
],
"Convince Upstarts to Abandon Sector": [
[
"Headhunters",
200,
200,
null,
"headhunters_bombingrun_killship_m_desc_001"
]
],
"Convoy Caught in Brutal Attack": [
[
"Citizens For Prosperity",
200,
200,
5800,
"cfp_defendship_multi_hrt_desc_001"
]
],
"Convoy Under Attack": [
[
"Citizens For Prosperity",
250,
250,
15000,
"cfp_defendship_multi_vhrt_sb_desc_001"
]
],
"Counterstrike Against Vanduul Raiders": [
[
"InterSec Defense Solutions",
300,
300,
15000,
"intersec_shipwaveattack_vh_van_desc_001"
]
],
"Cracking the Alliance": [
[
"Vaughn",
200,
200,
null,
"vaughn_assassination_pa_h_desc"
]
],
"Crash some ships": [
[
"Headhunters",
300,
300,
15000,
"headhunters_multikillship_base_generic_m_desc_001"
]
],
"Crew Hasn't Checked In": [
[
"Recco Battaglia",
160,
160,
2400,
"battaglia_rpt_misscrew_01_desc"
]
],
"Curious Weapon": [
[
"Wikelo Emporium",
10,
10,
null,
"thecollector_recipes_desc_bigbooma"
]
],
"Cut Citizens For Prosperity Power": [
[
"Headhunters",
125,
125,
null,
"headhunters_sabotage_generators_e_cfp_desc_001"
]
],
"DEAD SAINTS - Trial Cargo Haul": [
[
"Dead Saints",
50,
100,
null,
"deadsaints_haulcargo_atob_intro_desc"
]
],
"Danger: Contraband Weapons Inbound": [
[
"Citizens For Prosperity",
200,
200,
null,
"cfp_bounty_desc_headhunters_001"
]
],
"Dangerous Ambush": [
[
"Eckhart Security",
250,
250,
15000,
"eckhart_shipambush_vh_desc"
]
],
"Data Transfer": [
[
"Bit Zeros",
100,
100,
0,
"bitzeros_blackbox_intro_desc_001"
]
],
"Deal with ~mission(TargetName) and Support Forces": [
[
"Eckhart Security",
500,
500,
120000,
"eckhartsecurity_multieliminateallandboss_dc_desc_001"
]
],
"Death and cargo": [
[
"Headhunters",
150,
150,
2200,
"headhunters_eliminateall_retrievestolen_base_generic_m_desc_001"
]
],
"Deep space hit": [
[
"Headhunters",
50,
50,
0,
"headhunters_eliminatespecific_asteroid_generic_ve_desc_001"
]
],
"Defend InterSec Operative": [
[
"InterSec Defense Solutions",
100,
100,
0,
"intersec_defendship_desc_easy_001"
]
],
"Defend ~mission(Location) From Mercs": [
[
"Headhunters",
250,
250,
15000,
"headhunters_defendentitesandescort_vh_desc"
]
],
"Defend ~mission(Location) from Outlaws": [
[
"Citizens For Prosperity",
125,
250,
0,
"cfp_defend-criminals_desc_001"
]
],
"Defend ~mission(Objects) From Mercs": [
[
"Headhunters",
250,
250,
null,
"headhunters_defenddestructibleentites_vh_desc_001"
]
],
"Defenders needed against Headhunters": [
[
"Citizens For Prosperity",
150,
250,
800,
"cfp_eliminateall_fromcfp_hh_m_desc_001"
]
],
"Destroy Headhunter Stolen Data": [
[
"Citizens For Prosperity",
125,
200,
0,
"cfp_sabotage_servers_m_hh_desc_001"
]
],
"Destroy Outlaw Data Servers": [
[
"Citizens For Prosperity",
150,
150,
2200,
"cfp_sabotage_vh_desc_001"
]
],
"Destroy Their Supplies": [
[
"Headhunters",
200,
200,
null,
"headhunters_bombingrun_h_desc_001"
]
],
"Destroy XenoThreat Data Servers": [
[
"Citizens For Prosperity",
350,
350,
5800,
"cfp_sabotage_servers_vh_xt_desc_001"
]
],
"Destroy XenoThreat Fuel Reserves": [
[
"Headhunters",
3200,
3200,
null,
"headhunters_bombingrun_vh_xt_desc_001"
]
],
"Destroy XenoThreat Logistic Data": [
[
"Citizens For Prosperity",
125,
125,
15000,
"cfp_sabotage_servers_h_xt_desc_001"
]
],
"Destroying the Alliance": [
[
"Vaughn",
100,
250,
null,
"vaughn_assassination_pa_vh_desc"
]
],
"Disable Headhunter Comm Towers": [
[
"Citizens For Prosperity",
125,
125,
null,
"cfp_sabotagerelays_hh_001_desc"
]
],
"Disable Outlaw Stronghold at ~mission(Location)": [
[
"Citizens For Prosperity",
75,
75,
0,
"cfp_sabotage_generators_ve_desc_001"
]
],
"Do Lava Suit": [
[
"Wikelo Emporium",
25,
25,
null,
"thecollector_recipes_desc_molten"
]
],
"Down For the Count": [
[
"Vaughn",
200,
200,
null,
"vaughn_searchbody_space_h_desc_001"
]
],
"Draw Out Maulers": [
[
"InterSec Defense Solutions",
300,
300,
95250,
"intersec_shipwaveattack_drawoutboss_s_van_desc_001"
]
],
"Driving CFP out": [
[
"Headhunters",
150,
150,
15000,
"headhunters_chainelimall_1c_elimspec_attackcfp_m_desc_001"
]
],
"Drop a XenoThreat": [
[
"Headhunters",
400,
400,
15000,
"headhunters_eliminatespecific_xenothreat_desc_001"
]
],
"ENTRY LVL. COURIER NEEDED IN NYX": [
[
"FTL Courier",
100,
100,
0,
"ftl_courier_nyx_easy_desc_001"
]
],
"ENTRY LVL. COURIER NEEDED IN STANTON": [
[
"FTL Courier",
100,
500,
0,
"ftl_courier_stanton_easy_desc_001"
]
],
"Easy Creds for Easy Work": [
[
"Dead Saints",
100,
100,
null,
"deadsaints_recoveritem_intro_desc_001"
]
],
"Efficient Miners Wanted": [
[
"Recco Battaglia",
400,
400,
6000,
"battaglia_rpt_scanmine_05_desc"
]
],
"Eliminate Annoyance": [
[
"Headhunters",
100,
100,
null,
"headhunters_defendlocation_ve_desc_001"
]
],
"Eliminate Fuel Stores": [
[
"Citizens For Prosperity",
250,
250,
2200,
"cfp_bombingrun_e_desc_001"
]
],
"Eliminate Vanduul Ship": [
[
"InterSec Defense Solutions",
300,
300,
15000,
"intersec_killship_vanduul_desc_super_001"
]
],
"Elite Op": [
[
"Headhunters",
300,
300,
null,
"headhunters_shipambush_s_desc_001"
]
],
"Engage Shattered Blade and Vanduul": [
[
"InterSec Defense Solutions",
300,
300,
null,
"intersec_3way_desc_hard_001"
]
],
"Eradicate All Traces of Headhunter Data": [
[
"Citizens For Prosperity",
1550,
1550,
38000,
"cfp_sabotage_server_elimiatespecific_hh_desc_001"
]
],
"Eradicate UEE Threat: ~mission(TargetName)": [
[
"InterSec Defense Solutions",
300,
300,
null,
"intersec_shipwaveattack_drawoutboss_s_desc_001"
]
],
"Establishing Security": [
[
"Citizens For Prosperity",
25,
25,
null,
"cfp_eliminateall_intro_desc_001"
]
],
"Exciting New Opportunities with Foxwell Enforcement": [
[
"Foxwell Enforcement",
100,
100,
null,
"foxwell_mercenary_intro_desc_001"
]
],
"Executive Protection Detail": [
[
"Eckhart Security",
100,
100,
800,
"eckhart_escortships_e_desc"
]
],
"Expel Outlaws": [
[
"Eckhart Security",
500,
500,
null,
"eckhartsecurity_eliminateall_dc_desc_001"
]
],
"Experienced Protection Detail Needed": [
[
"Eckhart Security",
150,
150,
2200,
"eckhart_escortships_m_desc"
]
],
"Extensive Repairs Needed: ~mission(Location)": [
[
"Citizens For Prosperity",
500,
500,
null,
"cfp_maintenance_h_desc_001"
]
],
"Extra Special Job": [
[
"Recco Battaglia",
800,
800,
null,
"battaglia_rpt_scan_golem_desc"
]
],
"Extremely Dangerous Defense": [
[
"Eckhart Security",
300,
300,
38000,
"eckhart_defendship_multi_srt_desc_001"
]
],
"FIND SERVERS AT ASD SITE AND DESTROY": [
[
"Eckhart Security",
50,
50,
null,
"eckhartsecurity_destroyservers_facilitydelving_desc_003"
]
],
"Firebird Mod": [
[
"Wikelo Emporium",
100,
100,
null,
"thecollector_ships_firebird_desc"
]
],
"First Haul in System": [
[
"Citizens For Prosperity",
75,
75,
null,
"cfp_hauling_intro_desc_001"
]
],
"Fortune ship for you": [
[
"Wikelo Emporium",
30,
30,
null,
"thecollector_ships_fortune_indus_desc"
]
],
"Fracturing the Alliance": [
[
"Vaughn",
150,
150,
null,
"vaughn_assassination_pa_m_desc"
]
],
"Fun Kopion Skull Gun": [
[
"Wikelo Emporium",
10,
10,
null,
"thecollector_recipes_desc_kopskull"
]
],
"Fun Military Skull Gun": [
[
"Wikelo Emporium",
10,
10,
null,
"thecollector_recipes_desc_miltskull"
]
],
"Gather Irradiated Valakkar Fangs": [
[
"Rayari Incorporated",
150,
150,
null,
"rain_collectresources_storm_desc_003"
]
],
"Get My Gear Back": [
[
"Dead Saints",
150,
150,
null,
"deadsaints_recoveritem_m_desc_001"
]
],
"Getting Our Gear Back": [
[
"Dead Saints",
100,
100,
800,
"deadsaints_recoveritem_generic_desc_001"
]
],
"Getting Our Goods Back": [
[
"Headhunters",
200,
200,
null,
"headhunters_haulcargo_multitosingle_desc_01"
]
],
"Getting To the Bottom of It": [
[
"Bit Zeros",
100,
100,
800,
"bitzeros_blackbox_e_desc_001"
]
],
"Getting What They Deserve": [
[
"Dead Saints",
250,
250,
null,
"deadsaints_recoveritem_vh_desc_001"
]
],
"Getting the Drop on the Enemy": [
[
"Headhunters",
300,
300,
null,
"headhunters_bombingrun_s_desc_001"
]
],
"Ghost some XenoTrash": [
[
"Headhunters",
3200,
3200,
95250,
"headhunters_killship_xenothreat_ert_desc_001"
]
],
"Go on the warpath": [
[
"Headhunters",
400,
400,
95250,
"headhunters_chainelimall_attackgen_e_desc_001"
]
],
"Green light on ~mission(Location)": [
[
"Headhunters",
150,
150,
800,
"headhunters_eliminateall_xt_desc_001"
]
],
"Green light on ~mission(TargetName|Last)": [
[
"Headhunters",
1200,
1200,
38000,
"headhunters_eliminatespecific_generic_vh_desc_001"
]
],
"Guard ~mission(Location) From Rivals": [
[
"Headhunters",
300,
300,
15000,
"headhunters_defendentitesandescort_s_desc"
]
],
"Guard ~mission(Objects) At All Costs": [
[
"Headhunters",
300,
300,
null,
"headhunters_defenddestructibleentites_s_desc_001"
]
],
"Guardian Fight Mod": [
[
"Wikelo Emporium",
100,
100,
null,
"thecollector_ships_guardian_desc"
]
],
"Guardian WiK-X": [
[
"Wikelo Emporium",
100,
100,
null,
"thecollector_ships_guardianmx_desc"
]
],
"Guardian take down ship": [
[
"Wikelo Emporium",
100,
100,
null,
"thecollector_ships_guardianqi_desc"
]
],
"Handle Vanduul Attack on Ship": [
[
"InterSec Defense Solutions",
300,
300,
15000,
"intersec_defendship_vanduul_desc_super_001"
]
],
"Hauling ask.": [
[
"Headhunters",
200,
200,
null,
"headhunters_haulcargo_regionlink_desc_001"
]
],
"Headhunter Needs Help": [
[
"Headhunters",
100,
100,
null,
"headhunters_defendship_lrt_pa_desc_001"
]
],
"Headhunter Pilot Needs a Hand": [
[
"Headhunters",
100,
100,
null,
"headhunters_defendship_vlrt_desc_001"
]
],
"Headhunter Pilot in Trouble": [
[
"Headhunters",
150,
150,
null,
"headhunters_defendship_lrt_desc_001"
]
],
"Headhunter Ship Needs Backup": [
[
"Headhunters",
200,
200,
null,
"headhunters_defendship_mrt_desc_001"
]
],
"Headhunter attack on ~mission(Location)": [
[
"Citizens For Prosperity",
250,
250,
5800,
"cfp_defend_headhunters_h_desc_001"
]
],
"Heavy and Bright": [
[
"Wikelo Emporium",
10,
10,
null,
"thecollector_recipes_desc_superheavycombat"
]
],
"Help Ambushed Convoy": [
[
"Citizens For Prosperity",
200,
200,
5800,
"cfp_defendship_multi_hrt_sb_desc_001"
]
],
"Help Deal with Outlaw Hunting Party": [
[
"Citizens For Prosperity",
100,
100,
null,
"cfp_shipwaveattack_clearhostiles_desc_ve_001"
]
],
"Help Headhunters Prospect": [
[
"Headhunters",
100,
100,
null,
"headhunters_defendship_vlrt_pa_desc_001"
]
],
"Help Headhunters at ~mission(DefendLocationWrapperLocation)": [
[
"Headhunters",
200,
200,
null,
"headhunters_defendlocation_h_desc_001"
]
],
"Help Protect Site": [
[
"Foxwell Enforcement",
100,
100,
800,
"foxwell_eliminateall_allies_desc_001"
]
],
"Help defend ~mission(Location) from Headhunters": [
[
"Citizens For Prosperity",
350,
350,
5800,
"cfp_chainelimall_1c_hhattack_m_desc_001"
]
],
"Hide Snow Suit": [
[
"Wikelo Emporium",
25,
25,
null,
"thecollector_recipes_desc_hush"
]
],
"High-Risk Bounty: ~mission(TargetName)": [
[
"Eckhart Security",
500,
500,
5000,
"eckhartsecurity_eliminateboss_dc_desc_001"
]
],
"High-Risk Ship Encounter": [
[
"Eckhart Security",
200,
200,
5800,
"eckhart_defendship_multi_hrt_desc_001"
]
],
"Highly Dangerous Ambush": [
[
"Eckhart Security",
300,
300,
38000,
"eckhart_shipambush_s_desc"
]
],
"Hit XenoThreat at ~mission(Location)": [
[
"Headhunters",
300,
300,
5800,
"headhunters_eliminateall_xenothreat_h_desc_001"
]
],
"Hit a CFP Complex": [
[
"Headhunters",
300,
300,
38000,
"headhunters_chainelimall_3c_elimspec_attackcfp_vh_desc_001"
]
],
"Hit a CFP Ship": [
[
"Headhunters",
300,
300,
5800,
"headhunters_killship_cfp_mrt_desc_001"
]
],
"Hit on XenoThreat command": [
[
"Headhunters",
400,
400,
95250,
"headhunters_chainelimall_boss_xenothreat_vh_desc_001"
]
],
"Hitting a CFP site": [
[
"Headhunters",
50,
50,
800,
"headhunters_eliminateall_cfp_e_desc_001"
]
],
"Hot Shot": [
[
"Wikelo Emporium",
10,
10,
null,
"thecollector_recipes_desc_nonepistol"
]
],
"Hunt Bounty: ~mission(TargetName)": [
[
"Eckhart Security",
750,
750,
null,
"eckhartsecurity_eliminatespecific_dc_desc_001"
]
],
"Hunt Some Heads": [
[
"Headhunters",
300,
300,
null,
"headhunters_securitypatrol_s_desc_001"
]
],
"INFILITRATE ASD SITE AND DESTROY SERVERS": [
[
"Eckhart Security",
50,
50,
null,
"eckhartsecurity_destroyservers_facilitydelving_desc_001"
]
],
"Idea for Isaac": [
[
"Recco Battaglia",
800,
800,
6000,
"battaglia_story03_desc"
]
],
"Inter-Outpost Delivery at ~mission(Destination)": [
[
"Citizens For Prosperity",
50,
50,
null,
"cfp_delivery_outpost_desc_001"
]
],
"Intercept Vanduul Fleet": [
[
"InterSec Defense Solutions",
300,
300,
15000,
"intersec_shipwaveattack_s_van_desc_001"
]
],
"Interdict Vanduul Maulers": [
[
"InterSec Defense Solutions",
300,
300,
95250,
"intersec_shipwaveattack_drawoutboss_vh_van_desc_001"
]
],
"JR. LVL. COURIER NEEDED IN STANTON": [
[
"FTL Courier",
100,
100,
800,
"ftl_courier_stanton_medium_desc_001"
]
],
"Journeyman Tracker License Certification": [
[
"Bounty Hunters Guild",
50,
50,
null,
"bhg_certification_hard_desc"
]
],
"Keep ~mission(Location) Safe": [
[
"Headhunters",
100,
100,
2200,
"headhunters_defendentitesandescort_ve_desc"
]
],
"Keep ~mission(Objects) Safe From Upstarts": [
[
"Headhunters",
100,
100,
null,
"headhunters_defenddestructibleentites_ve_desc_001"
]
],
"Keeping the Upstarts Down": [
[
"Headhunters",
100,
100,
null,
"headhunters_bombingrun_ve_desc_001"
]
],
"Kill Order": [
[
"Headhunters",
600,
600,
15000,
"headhunters_killship_cfp_hrt_desc_001"
]
],
"Kill the king": [
[
"Headhunters",
100,
100,
0,
"headhunters_eliminatespecific_generic_e_desc_001"
]
],
"Knock Power Out": [
[
"Headhunters",
200,
200,
null,
"headhunters_sabotage_generators_multi_m_desc_001"
]
],
"Launch Surprise Attack": [
[
"Eckhart Security",
150,
150,
2200,
"eckhart_shipambush_m_desc"
]
],
"Legendary Info?": [
[
"Bit Zeros",
200,
200,
5800,
"bitzeros_blackbox_h_desc_001"
]
],
"Locate Missing Agent: ~mission(TargetName)": [
[
"Hockrow Agency",
200,
200,
null,
"hockrow_searchbody_space_h_desc_001"
]
],
"Locate Missing Friend: ~mission(TargetName)": [
[
"Hockrow Agency",
150,
150,
null,
"hockrow_searchbody_space_m_desc_001"
]
],
"Locate Missing Person: ~mission(TargetName)": [
[
"Hockrow Agency",
100,
100,
null,
"hockrow_searchbody_space_ve_desc_001"
]
],
"Locate Missing Pilot: ~mission(TargetName)": [
[
"Hockrow Agency",
250,
250,
null,
"hockrow_searchbody_space_vh_desc_001"
]
],
"Long Distance Covalex Delivery Stanton": [
[
"Covalex",
100,
100,
null,
"covalex_delivery_stanton_hard_desc_001"
]
],
"Looking For Trouble": [
[
"Headhunters",
200,
200,
null,
"headhunters_securitypatrol_h_desc_001"
]
],
"Looking for a Damn Hero": [
[
"Headhunters",
300,
300,
null,
"headhunters_defendship_multi_srt_pa_desc_001"
]
],
"Looking for a little revenge": [
[
"Headhunters",
150,
150,
800,
"headhunters_eliminateall_cfp_desc_001"
]
],
"Low Risk Protection Detail": [
[
"Eckhart Security",
100,
100,
0,
"eckhart_escortships_ve_desc"
]
],
"Lrg. Purchase Order: Hand Mined Materials": [
[
"Shubin Interstellar",
150,
150,
2200,
"shubin_industrial_handmining_pyro_h_planetarysystem_desc_001"
],
[
"Shubin Interstellar",
150,
150,
2200,
"shubin_industrial_handmining_stanton_h_planetary_solar_desc_001"
],
[
"Shubin Interstellar",
150,
150,
2200,
"shubin_industrial_handmining_stanton_h_planetarysystem_desc_001"
]
],
"Lrg. Purchase Order: Ship Mined Ore ?": [
[
"Shubin Interstellar",
200,
200,
5800,
"shubin_industrial_shipmining_nyx_h_secondary_desc_001"
],
[
"Shubin Interstellar",
200,
200,
5800,
"shubin_industrial_shipmining_pyro_h_primarysecondary_desc_001"
],
[
"Shubin Interstellar",
200,
200,
5800,
"shubin_industrial_shipmining_pyro_h_secondary_desc_001"
],
[
"Shubin Interstellar",
200,
200,
5800,
"shubin_industrial_shipmining_stanton_h_primarysecondary_desc_001"
],
[
"Shubin Interstellar",
200,
200,
5800,
"shubin_industrial_shipmining_stanton_h_secondary_desc_001"
],
[
"Shubin Interstellar",
250,
250,
15000,
"shubin_industrial_shipmining_stanton_h_secondary_interstellar_desc_001"
]
],
"Lrg. Purchase Order: Vehicle Mined Ore": [
[
"Shubin Interstellar",
200,
200,
null,
"shubin_industrial_groundvehicle_pyro_h_solar_desc_001"
]
],
"Make ATLS shoot": [
[
"Wikelo Emporium",
20,
20,
null,
"thecollector_recipes_desc_atlspew"
]
],
"Make VOLT shotgun angrier": [
[
"Wikelo Emporium",
10,
10,
null,
"thecollector_recipes_desc_voltthwack"
]
],
"Make a Ursa Mod": [
[
"Wikelo Emporium",
20,
20,
null,
"thecollector_ships_ursa_desc"
]
],
"Make glowy armor": [
[
"Wikelo Emporium",
25,
25,
null,
"thecollector_recipes_desc_irrarm"
]
],
"Make jumpy ATLS shoot": [
[
"Wikelo Emporium",
20,
20,
null,
"thecollector_recipes_desc_atlsjump"
]
],
"Making the Most of a Bad Situation": [
[
"Dead Saints",
200,
200,
null,
"deadsaints_recoveritem_h_desc_001"
]
],
"Master Tracker License Certification": [
[
"Bounty Hunters Guild",
50,
50,
null,
"bhg_certification_super_desc"
]
],
"Med. Distance Covalex Delivery Nyx": [
[
"Covalex",
100,
100,
null,
"covalex_delivery_nyx_medium_desc_001"
]
],
"Med. Distance Covalex Delivery Stanton": [
[
"Covalex",
100,
100,
null,
"covalex_delivery_stanton_medium_desc_001"
]
],
"Med. Purchase Order: Hand Mined Materials": [
[
"Shubin Interstellar",
100,
100,
800,
"shubin_industrial_handmining_pyro_m_discoverplanetary_desc_001"
],
[
"Shubin Interstellar",
100,
100,
800,
"shubin_industrial_handmining_stanton_m_discoverplanetary_desc_001"
]
],
"Med. Purchase Order: Ship Mined Ore ?": [
[
"Shubin Interstellar",
150,
150,
2200,
"shubin_industrial_shipmining_nyx_m_solar_desc_001"
],
[
"Shubin Interstellar",
150,
150,
2200,
"shubin_industrial_shipmining_pyro_m_solar_desc_001"
],
[
"Shubin Interstellar",
150,
150,
2200,
"shubin_industrial_shipmining_stanton_m_solar_desc_001"
]
],
"Med. Purchase Order: Vehicle Mined Ore": [
[
"Shubin Interstellar",
150,
150,
null,
"shubin_industrial_groundvehicle_pyro_m_planetarysystem_desc_001"
],
[
"Shubin Interstellar",
200,
200,
null,
"shubin_industrial_groundvehicle_stanton_h_solar_desc_001"
]
],
"Mining and Data Collection": [
[
"Recco Battaglia",
600,
600,
6000,
"battaglia_rpt_scanmine_06_desc"
]
],
"Mining und MOLE": [
[
"Recco Battaglia",
800,
800,
null,
"battaglia_rpt_scanmine_mole_desc"
]
],
"Minor Mining Job": [
[
"Recco Battaglia",
200,
200,
null,
"battaglia_rpt_scanmine_01_desc"
]
],
"Missing Mining Team": [
[
"Recco Battaglia",
200,
200,
2400,
"battaglia_rpt_misscrew_02_desc"
]
],
"Missing Persons": [
[
"Recco Battaglia",
240,
240,
6000,
"battaglia_rpt_misscrew_03_desc"
]
],
"Mjr. Purchase Order: Ship Mined Ore ?": [
[
"Shubin Interstellar",
250,
250,
38000,
"shubin_industrial_shipmining_nyx_s_secondary_desc_001"
],
[
"Shubin Interstellar",
250,
250,
38000,
"shubin_industrial_shipmining_pyro_s_secondary_desc_001"
],
[
"Shubin Interstellar",
250,
250,
38000,
"shubin_industrial_shipmining_stanton_s_secondary_desc_001"
]
],
"Moderate Repairs Needed: ~mission(Location)": [
[
"Citizens For Prosperity",
100,
100,
null,
"cfp_maintenance_m_desc_001"
]
],
"Monolith Armor Very Smooth": [
[
"Wikelo Emporium",
10,
10,
null,
"thecollector_recipes_desc_greyheavycombat"
]
],
"Moraine Data Retrieval": [
[
"Recco Battaglia",
200,
200,
2400,
"battaglia_rpt_datadownload_01_desc"
]
],
"Moraine Movements": [
[
"Recco Battaglia",
300,
300,
6000,
"battaglia_rpt_createuplink_01_desc"
]
],
"More than a Max": [
[
"Wikelo Emporium",
250,
250,
null,
"thecollector_ships_starlift_max_desc"
]
],
"My Deepest Condolences": [
[
"Vaughn",
150,
150,
null,
"vaughn_searchbody_space_m_desc_001"
]
],
"NEW HIRE: Locate Missing Person": [
[
"Hockrow Agency",
100,
100,
null,
"hockrow_searchbody_space_intro_desc_001"
]
],
"NEW RETRIEVAL RUN AVAILABLE": [
[
"FTL Courier",
100,
100,
null,
"ftl_recoveritem_intro_desc_001"
]
],
"Need Some Ore Mined": [
[
"Recco Battaglia",
220,
220,
0,
"battaglia_rpt_scanmine_02_desc"
]
],
"Need a CFP taken down": [
[
"Headhunters",
100,
125,
800,
"headhunters_eliminatespecific_cfp_m_desc_001"
]
],
"Need a Hauler": [
[
"Citizens For Prosperity",
250,
250,
null,
"cfp_haulcargo_regionlink_desc_001"
]
],
"Need a death at ~mission(Location)": [
[
"Headhunters",
300,
300,
2200,
"headhunters_eliminatespecific_asteroid_generic_m_desc_001"
]
],
"Need a hitter": [
[
"Headhunters",
50,
50,
800,
"headhunters_eliminateall_base_generic_e_desc_001"
]
],
"Need multiple CFP outposts retaken": [
[
"Citizens For Prosperity",
350,
350,
15000,
"cfp_chainelimall_3c_elimspec_genattack_m_desc_001"
]
],
"Need someone taken out": [
[
"Headhunters",
50,
75,
0,
"headhunters_eliminatespecific_generic_m_desc_001"
]
],
"Neutralize Dangerous Criminal Fleet": [
[
"Citizens For Prosperity",
200,
200,
null,
"cfp_shipwaveattack_clearhostiles_desc_h_001"
]
],
"Neutralize UEE Threat: ~mission(TargetName)": [
[
"InterSec Defense Solutions",
150,
150,
800,
"intersec_killship_desc_medium_001"
]
],
"Neutralize Vanduul Target": [
[
"InterSec Defense Solutions",
250,
250,
5800,
"intersec_killship_vanduul_desc_veryhard_001"
]
],
"Neutralize Vanduul and Shattered Blade Threat": [
[
"InterSec Defense Solutions",
300,
300,
15000,
"intersec_3way_desc_veryhard_001"
]
],
"New Defense Contract: ~mission(TargetName) Elimination": [
[
"InterSec Defense Solutions",
100,
100,
0,
"intersec_killship_desc_intro_001"
]
],
"New Move Big Starlancer Ship": [
[
"Wikelo Emporium",
250,
250,
null,
"thecollector_ships_starlancer_atc_desc"
]
],
"New Opportunity - Ambush Strike": [
[
"Eckhart Security",
100,
100,
0,
"eckhart_shipambush_intro_desc"
]
],
"No Fly Zone": [
[
"Headhunters",
100,
100,
null,
"headhunters_bombingrun_e_desc_001"
]
],
"No Honor Amongst Assassins": [
[
"Vaughn",
300,
300,
null,
"vaughn_searchbody_space_s_desc_001"
]
],
"Notfall: Blinding Hope in Schwierigkeiten": [
[
"Recco Battaglia",
800,
800,
2400,
"battaglia_story02_desc"
]
],
"Now make Polaris. Short Time Deal": [
[
"Wikelo Emporium",
1000,
1000,
null,
"thecollector_menu_desc_polarisship"
]
],
"Noxy Mod": [
[
"Wikelo Emporium",
20,
20,
null,
"thecollector_ships_nox_desc"
]
],
"Obtain Irradiated Valakkar Pearls": [
[
"Rayari Incorporated",
150,
150,
null,
"rain_collectresources_storm_desc_002"
]
],
"Operative Extraction": [
[
"InterSec Defense Solutions",
150,
150,
800,
"intersec_defendship_desc_medium_001"
]
],
"Opportunity for Independent Cargo Hauler": [
[
"Covalex",
100,
100,
null,
"covalex_haulcargo_atob_intro_desc"
]
],
"Orange Level Contract: Destroy Outlaw Infrastructure": [
[
"Foxwell Enforcement",
200,
200,
5800,
"foxwell_bombingrun_h_desc_001"
]
],
"Orange Level Contract: Destroy Outlaw Threat": [
[
"Foxwell Enforcement",
150,
150,
2200,
"foxwell_shipwaveattack_clearhostiles_desc_m_001"
]
],
"Orange Level Contract: Potential Security Threat": [
[
"Foxwell Enforcement",
200,
200,
5800,
"foxwell_securitypatrol_h_desc_001"
]
],
"Orange Level Contract: Protect Our Client's Interests": [
[
"Foxwell Enforcement",
200,
200,
2200,
"foxwell_defendlocation_h_desc_001"
]
],
"Orange Level Contract: Return the Favor": [
[
"Foxwell Enforcement",
200,
200,
5800,
"foxwell_shipambush_h_desc_001"
]
],
"Orange Level Contract: Security Patrol": [
[
"Foxwell Enforcement",
150,
150,
2200,
"foxwell_securitypatrol_m_desc_001"
]
],
"Orange Level Contract: Ship Protection Needed": [
[
"Foxwell Enforcement",
150,
150,
2200,
"foxwell_defendlocation_m_desc_001"
]
],
"Orange Level Contract: Spring a Trap": [
[
"Foxwell Enforcement",
150,
150,
2200,
"foxwell_shipambush_m_desc_001"
]
],
"Orange Level Contract: Take Out Criminal Fleet": [
[
"Foxwell Enforcement",
200,
200,
5800,
"foxwell_shipwaveattack_clearhostiles_desc_h_001"
]
],
"Orange Level Contract: Take Out Fuel Supplies": [
[
"Foxwell Enforcement",
150,
150,
2200,
"foxwell_bombingrun_m_desc_001"
]
],
"Orange Level Contract: ~mission(Ship) Needs Assistance": [
[
"Foxwell Enforcement",
150,
150,
800,
"foxwell_defendship_m_desc_001"
]
],
"Orange Lvl. Contract: Defend ~mission(Objects)": [
[
"Foxwell Enforcement",
150,
150,
2200,
"foxwell_defenddestructibleentites_m_desc_001"
]
],
"Orange Lvl. Contract: Defend ~mission(Objects) and Escort Employees": [
[
"Foxwell Enforcement",
150,
150,
5800,
"foxwell_defendentitesandescort_m_desc"
]
],
"Orange Lvl. Contract: Protect ~mission(Objects)": [
[
"Foxwell Enforcement",
200,
200,
2200,
"foxwell_defenddestructibleentites_h_desc_001"
]
],
"Orange Lvl. Contract: Protect ~mission(Objects) and Escort Employees": [
[
"Foxwell Enforcement",
200,
200,
5800,
"foxwell_defendentitesandescort_h_desc"
]
],
"Ore Needs Gathering": [
[
"Recco Battaglia",
380,
380,
2400,
"battaglia_rpt_scanmine_04_desc"
]
],
"Our Version of The Truth": [
[
"Bit Zeros",
250,
250,
15000,
"bitzeros_blackbox_vh_desc_001"
]
],
"Outlaw attack at ~mission(Location)": [
[
"Citizens For Prosperity",
350,
350,
5800,
"cfp_chainelimall_2c_elimspec_genattack_m_desc_001"
]
],
"PURGE ASD SERVERS": [
[
"Eckhart Security",
50,
50,
null,
"eckhartsecurity_destroyservers_facilitydelving_desc_002"
]
],
"Paid Target in CFP": [
[
"Headhunters",
1200,
1200,
38000,
"headhunters_eliminatespecific_cfp_h_desc_001"
]
],
"Patrol Dangerous Outlaw Sector": [
[
"Citizens For Prosperity",
250,
250,
null,
"cfp_securitypatrol_vh_desc_001"
]
],
"Patrol Dangerous Sector": [
[
"InterSec Defense Solutions",
200,
200,
0,
"intersec_securitypatrol_h_desc_001"
]
],
"Patrol Dangerous Travel Lanes": [
[
"Citizens For Prosperity",
150,
150,
null,
"cfp_securitypatrol_m_desc_001"
]
],
"Patrol Extremely Dangerous Sector": [
[
"Citizens For Prosperity",
300,
300,
null,
"cfp_securitypatrol_s_desc_001"
]
],
"Patrol Outlaw Hunting Grounds": [
[
"Citizens For Prosperity",
200,
200,
null,
"cfp_securitypatrol_h_desc_001"
]
],
"Patrol Risky Travel Lanes": [
[
"Citizens For Prosperity",
100,
100,
null,
"cfp_securitypatrol_e_desc_001"
]
],
"Patrol Travel Lanes": [
[
"Citizens For Prosperity",
100,
100,
null,
"cfp_securitypatrol_ve_desc_001"
]
],
"Patrol Vanduul Hunting Ground": [
[
"InterSec Defense Solutions",
300,
300,
2200,
"intersec_securitypatrol_s_desc_001"
]
],
"Patrol to Prevent Possible Attack": [
[
"InterSec Defense Solutions",
250,
250,
800,
"intersec_securitypatrol_vh_desc_001"
]
],
"Peregrine Wikelo Mod": [
[
"Wikelo Emporium",
30,
30,
null,
"thecollector_ships_peregrine_desc"
]
],
"Pick Up and Drop Off": [
[
"Dead Saints",
100,
100,
null,
"deadsaints_recoveritem_ve_desc_001"
]
],
"Pick Up, Put Down": [
[
"Bit Zeros",
100,
100,
0,
"bitzeros_blackbox_ve_desc_001"
]
],
"Pilot Seeking Combat Support": [
[
"Citizens For Prosperity",
100,
100,
800,
"cfp_defendship_lrt_desc_001"
]
],
"Pilot Under Fire From Vanduul": [
[
"InterSec Defense Solutions",
250,
250,
5800,
"intersec_defendship_vanduul_desc_veryhard_001"
]
],
"Pilot in Distress": [
[
"Citizens For Prosperity",
100,
100,
0,
"cfp_defendship_vlrt_desc_001"
]
],
"Plug a traitor": [
[
"Headhunters",
100,
100,
800,
"headhunters_eliminatespecific_defector_desc_001"
]
],
"Potential Assassin Victim: ~mission(TargetName)": [
[
"Hockrow Agency",
100,
100,
null,
"hockrow_searchbody_space_e_desc_001"
]
],
"Precision Strike on ~mission(TargetName)": [
[
"Foxwell Enforcement",
100,
100,
800,
"foxwell_eliminatespecific_nonhostiles_desc_001"
]
],
"Preemptive Strike On ~mission(TargetName)": [
[
"InterSec Defense Solutions",
200,
200,
2200,
"intersec_killship_desc_hard_001"
]
],
"Preliminary Bounty: ~mission(TargetName)": [
[
"Bounty Hunters Guild",
50,
50,
null,
"bhg_bounty_desc_fps_intro"
]
],
"Primo Target": [
[
"Headhunters",
1200,
1200,
38000,
"headhunters_killship_cfp_vhrt_desc_001"
]
],
"Pro Tem Bounty Assignment: ~mission(TargetName)": [
[
"Northrock Service Group",
150,
150,
null,
"northrock_bounty_olp_boss_h_desc_001"
]
],
"Prospects Look Good": [
[
"Wikelo Emporium",
30,
30,
null,
"thecollector_ships_misc_prospector_desc"
]
],
"Protect Location": [
[
"Eckhart Security",
500,
500,
null,
"eckhartsecurity_defend_m_desc_001"
]
],
"Protect Our Site": [
[
"Headhunters",
100,
100,
null,
"headhunters_defendlocation_e_desc_001"
]
],
"Protect Vital Asset": [
[
"InterSec Defense Solutions",
200,
200,
2200,
"intersec_defendship_desc_hard_001"
]
],
"Protect ~mission(Location) from XenoThreat Attack": [
[
"Citizens For Prosperity",
350,
350,
5800,
"cfp_defend-xenothreat_desc_001"
]
],
"Protect ~mission(Location) from XenoThreat Incursion": [
[
"Citizens For Prosperity",
350,
350,
15000,
"cfp_defend-xenothreat_desc_003"
]
],
"Protect ~mission(Location) from XenoThreat Raid": [
[
"Citizens For Prosperity",
250,
250,
5800,
"cfp_defend-xenothreat_desc_002"
]
],
"Protect ~mission(Objects) From Luggers": [
[
"Headhunters",
100,
100,
null,
"headhunters_defenddestructibleentites_e_desc_001"
]
],
"Protecting outpost from XenoThreat": [
[
"Citizens For Prosperity",
250,
250,
2200,
"cfp_eliminateall_fromcfp_xt_m_desc_001"
]
],
"Protection Detail Needed. High Risk.": [
[
"Eckhart Security",
250,
250,
15000,
"eckhart_escortships_vh_desc"
]
],
"Protection against ~mission(TargetName|Last)": [
[
"Citizens For Prosperity",
125,
125,
null,
"cfp_eliminatespecific_generic_e_desc_001"
]
],
"Provide Combat Support": [
[
"Citizens For Prosperity",
100,
100,
800,
"cfp_defendship_lrt_sb_desc_001"
]
],
"Provide Protection at ~mission(Location)": [
[
"Headhunters",
100,
100,
2200,
"headhunters_defendentitesandescort_e_desc"
]
],
"Prowler More Utility": [
[
"Wikelo Emporium",
250,
250,
null,
"thecollector_ships_prowler_util_desc"
]
],
"Pulse Plus": [
[
"Wikelo Emporium",
20,
20,
null,
"thecollector_ships_pulse_desc"
]
],
"Purge XenoThreat Servers": [
[
"Headhunters",
3200,
3200,
null,
"headhunters_sabotage_servers_vh_xt_desc_001"
]
],
"Putting a Mind at Ease": [
[
"Vaughn",
100,
100,
null,
"vaughn_searchbody_space_ve_desc_001"
]
],
"RED WIND - Challenging Package Recovery": [
[
"Red Wind Linehaul",
200,
200,
null,
"redwind_recoveritem_h_desc_001"
]
],
"RED WIND - Dangerous Package Recovery": [
[
"Red Wind Linehaul",
250,
250,
null,
"redwind_recoveritem_vh_desc_001"
]
],
"RED WIND - Easy Package Recovery": [
[
"Red Wind Linehaul",
100,
100,
null,
"redwind_recoveritem_e_desc_001"
]
],
"RED WIND - Package Recovery": [
[
"Red Wind Linehaul",
100,
100,
null,
"redwind_recoveritem_ve_desc_001"
]
],
"RED WIND - Seeking New Couriers": [
[
"Red Wind Linehaul",
100,
100,
null,
"redwind_recoveritem_intro_desc_001"
]
],
"RED WIND - Seeking New Haulers": [
[
"Red Wind Linehaul",
100,
300,
null,
"redwind_haulcargo_desc_intro"
]
],
"RED WIND - Straightforward Package Recovery": [
[
"Red Wind Linehaul",
150,
150,
null,
"redwind_recoveritem_m_desc_001"
]
],
"REFUEL REQUEST: ~mission(Ship)": [
[
"United Wayfarers Club",
100,
200,
0,
"uwc_refueling_easy_desc_001"
]
],
"RSI Meteor Mod": [
[
"Wikelo Emporium",
30,
30,
null,
"thecollector_ships_meteor_desc"
]
],
"Rally to Help Clips Convoy": [
[
"Headhunters",
250,
250,
null,
"headhunters_defendship_multi_vhrt_pa_desc_001"
]
],
"Ready for RAFT?": [
[
"Wikelo Emporium",
30,
30,
null,
"thecollector_ships_argo_raft_desc"
]
],
"Reclaim Headhunter Outpost": [
[
"Citizens For Prosperity",
150,
150,
800,
"cfp_eliminateall_hh_e_desc_001"
]
],
"Reclaim XenoThreat Outpost": [
[
"Citizens For Prosperity",
250,
250,
2200,
"cfp_eliminateall_xt_e_desc_001"
]
],
"Reclaiming Clusters from Headhunters": [
[
"Citizens For Prosperity",
350,
350,
15000,
"cfp_chainelimall_3c_elimspec_hhattack_vh_desc_001"
]
],
"Reclaiming Outposts from XenoThreat": [
[
"Citizens For Prosperity",
450,
450,
38000,
"cfp_chainelimall_2c_elimspec_xtattack_h_desc_001"
]
],
"Reclusive Bounty: ~mission(TargetName) | Extreme Risk": [
[
"Bounty Hunters Guild",
300,
300,
null,
"bhg_shipwaveattack_drawoutboss_s_desc_001"
]
],
"Reclusive Bounty: ~mission(TargetName) | High Risk": [
[
"Bounty Hunters Guild",
200,
200,
null,
"bhg_shipwaveattack_drawoutboss_h_desc_001"
]
],
"Reclusive Bounty: ~mission(TargetName) | Very-High Risk": [
[
"Bounty Hunters Guild",
250,
250,
null,
"bhg_shipwaveattack_drawoutboss_vh_desc_001"
]
],
"Red Fight Armor": [
[
"Wikelo Emporium",
10,
10,
null,
"thecollector_recipes_desc_redhunterarmor"
]
],
"Red Fight Shotgun": [
[
"Wikelo Emporium",
10,
10,
null,
"thecollector_recipes_desc_gmni_shotgun"
]
],
"Red Level Contract: Ambush Attack Squad": [
[
"Foxwell Enforcement",
250,
250,
15000,
"foxwell_shipambush_vh_desc_001"
]
],
"Red Level Contract: Destroy Outlaw Infrastructure": [
[
"Foxwell Enforcement",
300,
300,
38000,
"foxwell_bombingrun_s_desc_001"
]
],
"Red Level Contract: Fuel Container Demolition": [
[
"Foxwell Enforcement",
250,
250,
15000,
"foxwell_bombingrun_vh_desc_001"
]
],
"Red Level Contract: High-Risk Security Patrol": [
[
"Foxwell Enforcement",
250,
250,
15000,
"foxwell_securitypatrol_vh_desc_001"
]
],
"Red Level Contract: Save Ships at ~mission(DefendLocationWrapperLocation)": [
[
"Foxwell Enforcement",
250,
250,
5800,
"foxwell_defendlocation_vh_desc_001"
]
],
"Red Level Contract: Secure Threatened Space": [
[
"Foxwell Enforcement",
300,
300,
38000,
"foxwell_securitypatrol_s_desc_001"
]
],
"Red Level Contract: Ship Under Attack": [
[
"Foxwell Enforcement",
200,
200,
800,
"foxwell_defendship_h_desc_001"
]
],
"Red Level Contract: Support VIP Clients": [
[
"Foxwell Enforcement",
300,
16000,
5800,
"foxwell_defendlocation_s_desc_001"
]
],
"Red Level Contract: Surprise Attack": [
[
"Foxwell Enforcement",
300,
300,
38000,
"foxwell_shipambush_s_desc_001"
]
],
"Red Lvl. Contract: Defend ~mission(Objects)": [
[
"Foxwell Enforcement",
250,
250,
5800,
"foxwell_defenddestructibleentites_vh_desc_001"
]
],
"Red Lvl. Contract: Defend ~mission(Objects) and Escort Employees": [
[
"Foxwell Enforcement",
250,
250,
15000,
"foxwell_defendentitesandescort_vh_desc"
]
],
"Red Lvl. Contract: Protect ~mission(Objects)": [
[
"Foxwell Enforcement",
300,
300,
5800,
"foxwell_defenddestructibleentites_s_desc_001"
]
],
"Red Lvl. Contract: Protect ~mission(Objects) and Escort Employees": [
[
"Foxwell Enforcement",
300,
300,
15000,
"foxwell_defendentitesandescort_s_desc"
]
],
"Reduce Outlaw's Operational Readiness": [
[
"Citizens For Prosperity",
350,
350,
5800,
"cfp_bombingrun_sabotage_generators_desc_001"
]
],
"Reduce Valakkar Breaker Station Population": [
[
"Highpoint Wilderness Specialists",
100,
100,
0,
"highpoint_killanimals_rockcracker_desc_e_001"
]
],
"Remove Upstart Gang From Sector": [
[
"Citizens For Prosperity",
150,
150,
null,
"cfp_shipwaveattack_clearhostiles_desc_m_001"
]
],
"Repel Raiders": [
[
"Eckhart Security",
500,
500,
null,
"eckhartsecurity_defend_h_desc_001"
]
],
"Repel Shattered Blade Ships": [
[
"Eckhart Security",
150,
150,
2200,
"eckhart_defendship_mrt_sb_desc_001"
]
],
"Reprisal Attack": [
[
"Headhunters",
200,
200,
null,
"headhunters_shipambush_h_desc_001"
]
],
"Reputation Management": [
[
"Headhunters",
75,
300,
0,
"headhunters_eliminateall_outpost_desc_01"
]
],
"Request for Ship Support": [
[
"Eckhart Security",
100,
100,
800,
"eckhart_defendship_lrt_sb_desc_001"
]
],
"Requesting Help": [
[
"Eckhart Security",
2000,
2000,
null,
"eckhartsecurity_eliminateall_storm_shut_h_desc_001"
]
],
"Respond to Distress Beacon": [
[
"Citizens For Prosperity",
250,
250,
15000,
"cfp_defendship_multi_vhrt_desc_001"
]
],
"Restore Order at ~mission(DefendLocationWrapperLocation)": [
[
"Headhunters",
300,
300,
null,
"headhunters_defendlocation_s_desc_001"
]
],
"Retake Boarded Vessel": [
[
"InterSec Defense Solutions",
300,
300,
null,
"intersec_boardship_shatteredblade_desc_001"
]
],
"Retaking Outposts from Headhunters": [
[
"Citizens For Prosperity",
350,
350,
15000,
"cfp_chainelimall_2c_elimspec_hhattack_h_desc_001"
]
],
"SEEK AND DESTROY ASD DATA": [
[
"Eckhart Security",
50,
50,
null,
"eckhartsecurity_destroyservers_facilitydelving_desc_004"
]
],
"Salvage Job: Large": [
[
"Recco Battaglia",
600,
600,
6000,
"battaglia_rpt_salvage_h_01_desc"
]
],
"Salvage Job: Mid": [
[
"Recco Battaglia",
400,
400,
6000,
"battaglia_rpt_salvage_m_01_desc"
]
],
"Salvage Job: Small": [
[
"Recco Battaglia",
200,
200,
6000,
"battaglia_rpt_salvage_e_01_desc"
]
],
"Salvager Needed (Lrg. Special Order of RMC / UCM / Components)": [
[
"Adagio Holdings",
150,
150,
2200,
"adagio_industrial_component_salvage_levski_h_desc_001"
],
[
"Adagio Holdings",
150,
150,
2200,
"adagio_industrial_component_salvage_pyro_h_desc_001"
],
[
"Adagio Holdings",
150,
150,
2200,
"adagio_industrial_component_salvage_stanton_h_desc_001"
]
],
"Salvager Needed (Lrg. Supply of RMC / UCM / Components)": [
[
"Adagio Holdings",
150,
150,
2200,
"adagio_industrial_component_salvage_universal_h_desc_001"
]
],
"Salvager Needed (Med. Special Order of RMC / UCM / Components)": [
[
"Adagio Holdings",
100,
100,
800,
"adagio_industrial_component_salvage_levski_m_desc_001"
],
[
"Adagio Holdings",
100,
100,
800,
"adagio_industrial_component_salvage_pyro_m_desc_001"
],
[
"Adagio Holdings",
100,
100,
800,
"adagio_industrial_component_salvage_stanton_m_desc_001"
]
],
"Salvager Needed (Med. Supply of RMC / UCM / Components)": [
[
"Adagio Holdings",
100,
100,
800,
"adagio_industrial_component_salvage_universal_m_desc_001"
]
],
"Salvager Needed (Med. Supply of RMC)": [
[
"Adagio Holdings",
100,
100,
800,
"adagio_industrial_salvage_universal_m_desc_001"
]
],
"Salvager Needed (Small Special Order of RMC / Components)": [
[
"Adagio Holdings",
100,
100,
null,
"adagio_industrial_component_salvage_levski_e_desc_001"
],
[
"Adagio Holdings",
100,
100,
null,
"adagio_industrial_component_salvage_pyro_e_desc_001"
],
[
"Adagio Holdings",
100,
100,
null,
"adagio_industrial_component_salvage_stanton_e_desc_001"
]
],
"Salvager Needed (Small Supply of RMC / Components)": [
[
"Adagio Holdings",
100,
100,
null,
"adagio_industrial_component_salvage_universal_e_desc_001"
]
],
"Salvager Needed (Small Supply of RMC / UCM)": [
[
"Adagio Holdings",
100,
100,
0,
"adagio_industrial_salvage_universal_e_desc_002"
]
],
"Salvager Needed (Small Supply of RMC)": [
[
"Adagio Holdings",
100,
100,
0,
"adagio_industrial_salvage_universal_e_desc_001"
]
],
"Save Ship": [
[
"Eckhart Security",
100,
100,
0,
"eckhart_defendship_vlrt_desc_001"
]
],
"Scan And Mining Needed": [
[
"Recco Battaglia",
260,
260,
2400,
"battaglia_rpt_scanmine_03_desc"
]
],
"Scan with a Prospector Payout": [
[
"Recco Battaglia",
800,
800,
null,
"battaglia_rpt_scan_prosp_desc"
]
],
"Scout and Scan": [
[
"Headhunters",
100,
100,
null,
"headhunters_securitypatrol_e_desc_001"
]
],
"Secure Our Airspace": [
[
"Headhunters",
150,
150,
null,
"headhunters_defendlocation_m_desc_001"
]
],
"Secure Site": [
[
"Eckhart Security",
500,
500,
null,
"eckhartsecurity_defend_e_desc_001"
]
],
"Secure ~mission(Location) from Upstarts": [
[
"Headhunters",
150,
150,
5800,
"headhunters_defendentitesandescort_m_desc"
]
],
"Secure ~mission(Objects) From Rivals": [
[
"Headhunters",
150,
150,
null,
"headhunters_defenddestructibleentites_m_desc_001"
]
],
"Security Contractor Evaluation": [
[
"Eckhart Security",
50,
50,
null,
"eckhartsecurity_mercenary_intro_desc_001"
]
],
"Security Contractor Reevaluation": [
[
"Eckhart Security",
500,
500,
null,
"eckhartsecurity_mercenary_rehire_desc_001"
]
],
"See What's Out There": [
[
"Headhunters",
100,
100,
null,
"headhunters_securitypatrol_ve_desc_001"
]
],
"Seek and Destroy Super Stingers": [
[
"InterSec Defense Solutions",
300,
300,
null,
"intersec_shipwaveattack_drawoutboss_h_van_desc_001"
]
],
"Seeking Experienced Combat Pilots": [
[
"Citizens For Prosperity",
50,
50,
null,
"cfp_defendship_intro_desc_001"
]
],
"Serious Shattered Blade Attack": [
[
"Eckhart Security",
200,
200,
5800,
"eckhart_defendship_multi_hrt_sb_desc_001"
]
],
"Setting a Rat Trap": [
[
"Headhunters",
250,
250,
null,
"headhunters_bombingrun_vh_desc_001"
]
],
"Setting a Trap": [
[
"Headhunters",
100,
100,
null,
"headhunters_shipambush_intro_desc_001"
]
],
"Settle a Score": [
[
"Eckhart Security",
100,
100,
0,
"eckhart_shipambush_ve_desc"
]
],
"Shattered Blade Strike": [
[
"Eckhart Security",
300,
300,
38000,
"eckhart_defendship_multi_srt_sb_desc_001"
]
],
"Ship In Distress": [
[
"Recco Battaglia",
300,
300,
null,
"battaglia_rpt_boardship_01_desc"
]
],
"Ship Needs Emergency Assistance": [
[
"Citizens For Prosperity",
150,
150,
2200,
"cfp_defendship_mrt_desc_001"
]
],
"Shot in the chaos": [
[
"Headhunters",
50,
50,
800,
"headhunters_eliminatespecific_cfp_e_desc_001"
]
],
"Shut Off Power at ~mission(Location)": [
[
"Headhunters",
25,
25,
null,
"headhunters_sabotage_generators_ve_desc_001"
]
],
"Shutdown CFP's Comms": [
[
"Headhunters",
125,
125,
null,
"headhunters_sabotagerelays_cfp_001_desc"
]
],
"Shutdown Xenothreat Comm Towers": [
[
"Citizens For Prosperity",
175,
175,
null,
"cfp_sabotagerelays_xt_001_desc"
]
],
"Silence the Xenothreat": [
[
"Headhunters",
175,
175,
null,
"headhunters_sabotagerelays_xt_001_desc"
]
],
"Silent Strike": [
[
"Headhunters",
100,
100,
null,
"headhunters_shipambush_e_desc_001"
]
],
"Simple Hit": [
[
"Headhunters",
75,
75,
800,
"headhunters_killship_gen_lrt_desc_001"
]
],
"Small Mining Order: Sadaryx": [
[
"Shubin Interstellar",
100,
100,
null,
"shubin_industrial_handmining_nyx_m_planetarysystem_desc_001"
]
],
"Small Purchase Order: Hand Mined Materials": [
[
"Shubin Interstellar",
100,
100,
0,
"shubin_industrial_handmining_intro_local_desc_001"
],
[
"Shubin Interstellar",
100,
100,
0,
"shubin_industrial_handmining_pyro_e_local_desc_001"
],
[
"Shubin Interstellar",
100,
100,
0,
"shubin_industrial_handmining_stanton_e_local_desc_001"
],
[
"Shubin Interstellar",
100,
100,
0,
"shubin_industrial_handmining_stanton_e_planetarysystem_desc_001"
]
],
"Small Purchase Order: Ship Mined Ore": [
[
"Shubin Interstellar",
100,
100,
800,
"shubin_industrial_shipmining_nyx_e_local_desc_001"
],
[
"Shubin Interstellar",
100,
100,
800,
"shubin_industrial_shipmining_pyro_e_local_desc_001"
],
[
"Shubin Interstellar",
100,
100,
800,
"shubin_industrial_shipmining_stanton_e_local_desc_001"
]
],
"Small Purchase Order: Vehicle Mined Ore": [
[
"Shubin Interstellar",
100,
100,
null,
"shubin_industrial_groundvehicle_pyro_e_discoverplanetary_desc_001"
],
[
"Shubin Interstellar",
100,
100,
null,
"shubin_industrial_groundvehicle_stanton_e_discoverplanetary_desc_001"
],
[
"Shubin Interstellar",
150,
150,
null,
"shubin_industrial_groundvehicle_stanton_m_planetarysystem_desc_001"
]
],
"Sneaky Stabber": [
[
"Wikelo Emporium",
250,
250,
null,
"thecollector_ships_f8c_stealth_desc"
]
],
"Sneaky Starfighter Ion": [
[
"Wikelo Emporium",
100,
100,
null,
"thecollector_ships_starfighter_ion_desc"
]
],
"Snow Snipe": [
[
"Wikelo Emporium",
10,
10,
null,
"thecollector_recipes_desc_zipzap"
]
],
"Space Patrol": [
[
"Headhunters",
150,
150,
null,
"headhunters_securitypatrol_m_desc_001"
]
],
"Special Covalex Delivery Stanton System": [
[
"Covalex",
200,
200,
null,
"covalex_delivery_stanton_super_desc_001"
]
],
"Special Purchase Order: Mined Materials ?": [
[
"Shubin Interstellar",
250,
250,
15000,
"shubin_industrial_shipmining_vh_org_desc_001"
]
],
"Spirit Cargo mod": [
[
"Wikelo Emporium",
30,
30,
null,
"thecollector_ships_spirit_c1_desc"
]
],
"Splintering the Alliance": [
[
"Vaughn",
100,
100,
null,
"vaughn_assassination_pa_e_desc"
]
],
"Stand Our Ground": [
[
"Headhunters",
250,
250,
null,
"headhunters_securitypatrol_vh_desc_001"
]
],
"Starfighter Inferno Special": [
[
"Wikelo Emporium",
100,
100,
null,
"thecollector_ships_starfighter_inferno_desc"
]
],
"Starlifter A2 War Mod": [
[
"Wikelo Emporium",
500,
500,
null,
"thecollector_ships_crusader_a2_desc"
]
],
"Still Looking for Work?": [
[
"Foxwell Enforcement",
100,
100,
0,
"foxwell_mercenary_rehire_desc_001"
]
],
"Stop Attack at ~mission(DefendLocationWrapperLocation)": [
[
"Headhunters",
250,
250,
null,
"headhunters_defendlocation_vh_desc_001"
]
],
"Stop Attack on High-Profile Client": [
[
"Eckhart Security",
150,
150,
2200,
"eckhart_defendship_mrt_desc_001"
]
],
"Stop Attack on Ship": [
[
"Citizens For Prosperity",
150,
150,
2200,
"cfp_defendship_mrt_sb_desc_001"
]
],
"Stop Deadly Ship Attack": [
[
"Eckhart Security",
250,
250,
15000,
"eckhart_defendship_multi_vhrt_desc_001"
]
],
"Stop Gang From Destroying ~mission(Objects)": [
[
"Headhunters",
200,
200,
null,
"headhunters_defenddestructibleentites_h_desc_001"
]
],
"Stop Rival Attack at ~mission(Location)": [
[
"Headhunters",
200,
200,
5800,
"headhunters_defendentitesandescort_h_desc"
]
],
"Stop Rivals from Launching Heist": [
[
"Headhunters",
3200,
3200,
null,
"headhunters_bombingrun_sabotage_servers_vh_desc_001"
]
],
"Stop Savage Shattered Blade Attack": [
[
"Citizens For Prosperity",
300,
300,
38000,
"cfp_defendship_multi_srt_sb_desc_001"
]
],
"Stop Shattered Blade Attack": [
[
"Eckhart Security",
100,
100,
0,
"eckhart_defendship_vlrt_sb_desc_001"
]
],
"Stop Vanduul and Shattered Blade Hostilities": [
[
"InterSec Defense Solutions",
300,
300,
15000,
"intersec_3way_desc_super_001"
]
],
"Strategic Bombing": [
[
"InterSec Defense Solutions",
200,
200,
5800,
"intersec_tsg_bombrun_solo_desc_001"
]
],
"Suit Up Take Off": [
[
"Wikelo Emporium",
10,
10,
null,
"thecollector_recipes_desc_vglflightsuit"
]
],
"Supply Order: Sadaryx Focus Lenses": [
[
"Shubin Interstellar",
100,
100,
null,
"shubin_rockcracker_collectlenses_desc_001"
]
],
"Support Client Under Attack": [
[
"Eckhart Security",
100,
100,
800,
"eckhart_defendship_lrt_desc_001"
]
],
"Support Ship Under Attack": [
[
"Citizens For Prosperity",
100,
100,
0,
"cfp_defendship_vlrt_sb_desc_001"
]
],
"Surprise Party": [
[
"Headhunters",
100,
100,
null,
"headhunters_shipambush_ve_desc_001"
]
],
"Sweep and Clear Location": [
[
"Foxwell Enforcement",
150,
150,
2200,
"foxwell_eliminateall_desc_001"
]
],
"Sweep and clear some CFP haunts": [
[
"Headhunters",
300,
300,
15000,
"headhunters_chainelimall_2c_elimspec_attackcfp_h_desc_001"
]
],
"Tactical Strike": [
[
"Headhunters",
250,
250,
null,
"headhunters_shipambush_vh_desc_001"
]
],
"Tactical Strike Group Needed": [
[
"InterSec Defense Solutions",
300,
300,
5800,
"intersec_tsg_group_desc_001"
]
],
"Take Out Citizens for Prosperity Fuel Supply": [
[
"Headhunters",
150,
200,
null,
"headhunters_bombingrun_e_cfp_desc_001"
]
],
"Take Outlaws at ~mission(Location) Offline": [
[
"Citizens For Prosperity",
200,
200,
2200,
"cfp_sabotage_generators_m_desc_001"
]
],
"Taking Out the Competition": [
[
"Headhunters",
150,
150,
null,
"headhunters_bombingrun_m_desc_001"
]
],
"Taking XenoThreat Turf": [
[
"Headhunters",
300,
300,
15000,
"headhunters_chainelimall_2c_elimspec_attackxt_h_desc_001"
]
],
"Taking back from the Headhunters": [
[
"Citizens For Prosperity",
350,
350,
5800,
"cfp_chainelimall_1c_elimspec_hhattack_m_desc_001"
]
],
"Taking down a XenoThreat Hideout": [
[
"Headhunters",
400,
400,
38000,
"headhunters_chainelimall_3c_elimspec_attackxt_vh_desc_001"
]
],
"Taking out some XenoThreat trash": [
[
"Headhunters",
150,
150,
5800,
"headhunters_chainelimall_1c_attackxt_m_desc_001"
]
],
"Target at ~mission(Location)": [
[
"Headhunters",
50,
50,
800,
"headhunters_killship_asteroid_rank1_desc_001"
]
],
"Target takedown for a fast track in": [
[
"Headhunters",
50,
50,
0,
"headhunters_killship_asteroid_rank0_desc_001"
]
],
"Teach Citizens for Prosperity A Lesson": [
[
"Headhunters",
100,
100,
null,
"headhunters_bombingrun_multi_e_cfp_desc_001"
]
],
"Terminate UEE Threat: ~mission(TargetName)": [
[
"InterSec Defense Solutions",
250,
250,
null,
"intersec_shipwaveattack_drawoutboss_vh_desc_001"
]
],
"Terrorist ~mission(TargetName) to be Neutralized": [
[
"InterSec Defense Solutions",
100,
100,
0,
"intersec_killship_desc_easy_001"
]
],
"Test Armor": [
[
"Wikelo Emporium",
25,
25,
null,
"thecollector_recipes_desc_battle"
]
],
"Time to Teach a Lesson": [
[
"Eckhart Security",
100,
100,
800,
"eckhart_shipambush_e_desc"
]
],
"Time to roll on CFP": [
[
"Headhunters",
400,
400,
38000,
"headhunters_chainelimall_attackcfp_e_desc_001"
]
],
"Too Much Gun": [
[
"Wikelo Emporium",
10,
10,
null,
"thecollector_recipes_desc_apargatlinggun"
]
],
"Too Smart For Our Own Good": [
[
"Bit Zeros",
150,
150,
2200,
"bitzeros_blackbox_m_desc_001"
]
],
"Top Tier Operator Needed": [
[
"Eckhart Security",
300,
300,
38000,
"eckhart_escortships_s_desc"
]
],
"Track Down ~mission(TargetName)": [
[
"Foxwell Enforcement",
100,
100,
800,
"foxwell_eliminatespecific_desc_001"
]
],
"Tracker Beginner's Permit Certification": [
[
"Bounty Hunters Guild",
50,
50,
null,
"bhg_certification_easy_desc"
]
],
"Tracker License Certification": [
[
"Bounty Hunters Guild",
50,
50,
null,
"bhg_certification_medium_desc"
]
],
"Tracker Training Permit Certification": [
[
"Bounty Hunters Guild",
50,
50,
null,
"bhg_certification_veryeasy_desc"
]
],
"Treat yourself to a fight": [
[
"Headhunters",
300,
300,
5800,
"headhunters_killship_gen_mrt_desc_001"
]
],
"Tricky Ambush": [
[
"Eckhart Security",
200,
200,
5800,
"eckhart_shipambush_h_desc"
]
],
"Turf War": [
[
"Headhunters",
250,
250,
2200,
"headhunters_eliminateall_xt_derelicts_desc_01"
]
],
"URGENT CAPITAL FLEET REFUEL": [
[
"United Wayfarers Club",
200,
200,
95250,
"uwc_refuelling_bespokecapital_desc"
]
],
"URGENT CONVOY REFUEL": [
[
"United Wayfarers Club",
100,
200,
0,
"uwc_refueling_multiple_med_desc_001"
]
],
"UWC'S HIRING REFUELERS": [
[
"United Wayfarers Club",
200,
200,
null,
"uwc_refueling_intro_desc_001"
]
],
"Upgrade Intrepid": [
[
"Wikelo Emporium",
30,
30,
null,
"thecollector_ships_intrepid_desc"
]
],
"Urgent: Boarding Action In Progress": [
[
"Northrock Service Group",
8000,
8000,
null,
"northrock_boarders_890j_desc_001"
]
],
"VIP Client Needs Protection": [
[
"Eckhart Security",
200,
200,
5800,
"eckhart_escortships_h_desc"
]
],
"Vanduul Strike Group Detected": [
[
"InterSec Defense Solutions",
300,
300,
null,
"intersec_shipwaveattack_h_van_desc_001"
]
],
"Verified Bounty: ~mission(TargetName) at ~mission(Location)": [
[
"Bounty Hunters Guild",
50,
50,
null,
"bhg_bounty_desc_asd_engineering_001"
],
[
"Bounty Hunters Guild",
50,
50,
null,
"bhg_bounty_desc_asd_research_001"
]
],
"Verified Bounty: ~mission(TargetName) | XenoThreat | ~mission(Danger)": [
[
"Bounty Hunters Guild",
16000,
16000,
null,
"bhg_bounty_desc_xt_001"
]
],
"Verify Deceased Criminal: ~mission(TargetName)": [
[
"Hockrow Agency",
300,
300,
null,
"hockrow_searchbody_space_s_desc_001"
]
],
"Very Long Distance Covalex Delivery Stanton": [
[
"Covalex",
150,
150,
null,
"covalex_delivery_stanton_veryhard_desc_001"
]
],
"Wanna be a Headhunter?": [
[
"Headhunters",
50,
50,
0,
"headhunters_killship_gen_vlrt_rank0_desc_001"
]
],
"Want Taurus ship": [
[
"Wikelo Emporium",
250,
250,
null,
"thecollector_ships_constellation_taurus_desc"
]
],
"Wanted: ~mission(TargetName)": [
[
"Headhunters",
600,
600,
15000,
"headhunters_eliminatespecific_xenothreat_vh_desc_001"
],
[
"Headhunters",
600,
600,
15000,
"headhunters_killship_gen_hrt_desc_001"
]
],
"What is Terrapin?": [
[
"Wikelo Emporium",
100,
100,
null,
"thecollector_ships_terrapin_medic_desc"
]
],
"Where Wolf? Here Wolf": [
[
"Wikelo Emporium",
30,
30,
null,
"thecollector_ships_kruger_wolf_desc"
]
],
"Wikelo Arrive to System": [
[
"Wikelo Emporium",
10,
10,
null,
"thecollector_intro_desc"
]
],
"Wikelo Navy F7": [
[
"Wikelo Emporium",
100,
100,
null,
"thecollector_ships_f7_mk2_desc"
]
],
"Willkommen im System": [
[
"Recco Battaglia",
800,
800,
null,
"battaglia_story01_desc"
]
],
"Wipe Citizens for Prosperity Data Farm": [
[
"Headhunters",
125,
200,
null,
"headhunters_sabotage_servers_m_cfp_desc_001"
]
],
"Wipe Out XenoThreat Servers": [
[
"Headhunters",
125,
1500,
null,
"headhunters_sabotage_servers_h_xt_desc_001"
]
],
"Write Off": [
[
"Dead Saints",
100,
100,
null,
"deadsaints_recoveritem_e_desc_001"
]
],
"XL Purchase Order: Hand Mined Materials": [
[
"Shubin Interstellar",
200,
200,
5800,
"shubin_industrial_handmining_pyro_nyx_vh_interstellar_desc_001"
],
[
"Shubin Interstellar",
200,
200,
5800,
"shubin_industrial_handmining_pyro_vh_interstellar_desc_001"
],
[
"Shubin Interstellar",
200,
200,
5800,
"shubin_industrial_handmining_stanton_vh_solar_desc_001"
]
],
"XL Purchase Order: Ship Mined Ore ?": [
[
"Shubin Interstellar",
250,
250,
15000,
"shubin_industrial_shipmining_nyx_vh_interstellar_desc_001"
],
[
"Shubin Interstellar",
250,
250,
5800,
"shubin_industrial_shipmining_nyx_vh_secondary_desc_001"
],
[
"Shubin Interstellar",
250,
250,
15000,
"shubin_industrial_shipmining_pyro_vh_secondary_desc_001"
],
[
"Shubin Interstellar",
250,
250,
15000,
"shubin_industrial_shipmining_stanton_vh_interstellar_desc_001"
],
[
"Shubin Interstellar",
250,
250,
15000,
"shubin_industrial_shipmining_stanton_vh_secondary_desc_001"
],
[
"Shubin Interstellar",
250,
250,
15000,
"shubin_industrial_shipmining_stanton_vh_secondary_interstellar_desc_001"
]
],
"XL Purchase Order: Vehicle Mined Ore": [
[
"Shubin Interstellar",
250,
250,
null,
"shubin_industrial_groundvehicle_nyx_vh_interstellar_desc_001"
],
[
"Shubin Interstellar",
250,
250,
null,
"shubin_industrial_groundvehicle_pyro_vh_interstellar_desc_001"
],
[
"Shubin Interstellar",
250,
250,
null,
"shubin_industrial_groundvehicle_stanton_vh_solar_desc_001"
]
],
"XS Purchase Order: Ship Mined Ore": [
[
"Shubin Interstellar",
100,
100,
0,
"shubin_industrial_shipmining_nyx_ve_local_desc_001"
],
[
"Shubin Interstellar",
100,
100,
0,
"shubin_industrial_shipmining_stanton_ve_local_desc_001"
]
],
"XenoThreat Lieutenant needs some killing": [
[
"Headhunters",
125,
125,
5800,
"headhunters_eliminatespecific_xenothreat_h_desc_001"
]
],
"Yellow Level Contract: Ambush An Amateur": [
[
"Foxwell Enforcement",
100,
100,
0,
"foxwell_shipambush_ve_desc_001"
]
],
"Yellow Level Contract: Clear Out PAF": [
[
"Foxwell Enforcement",
100,
100,
0,
"foxwell_eliminateall_paf_m_desc_001"
]
],
"Yellow Level Contract: Clear Shipjacking Group": [
[
"Foxwell Enforcement",
100,
100,
0,
"foxwell_shipwaveattack_clearhostiles_desc_ve_001"
]
],
"Yellow Level Contract: Defend ~mission(DefendLocationWrapperLocation)": [
[
"Foxwell Enforcement",
100,
100,
800,
"foxwell_defendlocation_e_desc_001"
]
],
"Yellow Level Contract: Disrupt Operations": [
[
"Foxwell Enforcement",
100,
100,
800,
"foxwell_bombingrun_e_desc_001"
]
],
"Yellow Level Contract: Limiting Potential Threat": [
[
"Foxwell Enforcement",
100,
100,
0,
"foxwell_bombingrun_ve_desc_001"
]
],
"Yellow Level Contract: Merc Work": [
[
"Foxwell Enforcement",
100,
100,
0,
"foxwell_eliminateall_olp_m_desc_001"
]
],
"Yellow Level Contract: Neutralize Shipjacking Gang": [
[
"Foxwell Enforcement",
100,
100,
800,
"foxwell_shipwaveattack_clearhostiles_desc_e_001"
]
],
"Yellow Level Contract: Routine Patrol": [
[
"Foxwell Enforcement",
100,
100,
0,
"foxwell_securitypatrol_ve_desc_001"
]
],
"Yellow Level Contract: Security Sweep": [
[
"Foxwell Enforcement",
100,
100,
800,
"foxwell_securitypatrol_e_desc_001"
]
],
"Yellow Level Contract: Ship Under Attack": [
[
"Foxwell Enforcement",
100,
100,
0,
"foxwell_defendship_e_desc_001"
]
],
"Yellow Level Contract: Stand Up to Aggressors": [
[
"Foxwell Enforcement",
100,
100,
800,
"foxwell_defendlocation_ve_desc_001"
]
],
"Yellow Level Contract: Surprise Strike": [
[
"Foxwell Enforcement",
100,
100,
800,
"foxwell_shipambush_e_desc_001"
]
],
"Yellow Lvl. Contract: Defend ~mission(Objects)": [
[
"Foxwell Enforcement",
100,
100,
800,
"foxwell_defenddestructibleentites_ve_desc_001"
]
],
"Yellow Lvl. Contract: Defend ~mission(Objects) and Escort Employees": [
[
"Foxwell Enforcement",
100,
100,
2200,
"foxwell_defendentitesandescort_ve_desc"
]
],
"Yellow Lvl. Contract: Protect ~mission(Objects)": [
[
"Foxwell Enforcement",
100,
100,
800,
"foxwell_defenddestructibleentites_e_desc_001"
]
],
"Yellow Lvl. Contract: Protect ~mission(Objects) and Escort Employees": [
[
"Foxwell Enforcement",
100,
100,
2200,
"foxwell_defendentitesandescort_e_desc"
]
],
"Yormandi Gun": [
[
"Wikelo Emporium",
10,
10,
null,
"thecollector_recipes_desc_slimylmg"
]
],
"Your Best Shot": [
[
"Wikelo Emporium",
10,
10,
null,
"thecollector_recipes_desc_nonear"
]
],
"Zeus Cargo Special": [
[
"Wikelo Emporium",
100,
100,
null,
"thecollector_ships_zeuscl_desc"
]
],
"Zeus Special": [
[
"Wikelo Emporium",
30,
30,
null,
"thecollector_ships_zeuses_desc"
]
],
"Ziel der Shattered Blade: ~mission(TargetName)": [
[
"InterSec Defense Solutions",
150,
150,
800,
"intersec_elimaux_shatteredblade_med_desc_001"
]
],
"~mission(Destination) Errand": [
[
"Headhunters",
50,
50,
null,
"headhunters_delivery_outpost_desc_001"
]
],
"~mission(Location) has been greenlit": [
[
"Headhunters",
150,
150,
800,
"headhunters_eliminateall_cfp_m_desc_001"
]
],
"~mission(Location) needs a bunch of repairs": [
[
"Citizens For Prosperity",
150,
150,
null,
"headhunters_maintenance_m_desc_001"
],
[
"Headhunters",
150,
150,
null,
"headhunters_maintenance_m_desc_001"
]
],
"~mission(Location) needs assistance": [
[
"Citizens For Prosperity",
150,
150,
800,
"cfp_defend_headhunters_m_desc_001"
]
],
"~mission(Location) needs massive repairs": [
[
"Citizens For Prosperity",
450,
450,
null,
"headhunters_maintenance_h_desc_001"
],
[
"Headhunters",
450,
450,
null,
"headhunters_maintenance_h_desc_001"
]
],
"~mission(Location) needs some repairs": [
[
"Citizens For Prosperity",
75,
100,
null,
"headhunters_maintenance_local_e_desc_001"
],
[
"Headhunters",
75,
100,
null,
"headhunters_maintenance_local_e_desc_001"
]
],
"~mission(Location|Address) needs help": [
[
"Citizens For Prosperity",
850,
850,
15000,
"cfp_defend_boss_generic_desc_001"
]
],
"~mission(TargetName) needs stomping": [
[
"Headhunters",
50,
50,
800,
"headhunters_killship_gen_vlrt_desc_001"
]
]
},
"ladders": {
"Adagio Holdings": [
[
0,
"Neutral"
],
[
800,
"Auftragnehmer Junior"
],
[
2200,
"Auftragnehmer"
],
[
5800,
"Auftragnehmer Senior"
],
[
15000,
"Auftragnehmer Erfahren"
],
[
38000,
"Auftragnehmer Leitend"
],
[
95250,
"Auftragnehmer Elite"
]
],
"Bit Zeros": [
[
0,
"Neutral"
],
[
800,
"Auftragnehmer Junior"
],
[
2200,
"Auftragnehmer"
],
[
5800,
"Auftragnehmer Senior"
],
[
15000,
"Auftragnehmer Erfahren"
],
[
38000,
"Auftragnehmer Leitend"
],
[
95250,
"Auftragnehmer Elite"
]
],
"Bounty Hunters Guild": [
[
0,
"Bewerber"
],
[
1,
"Gildenmitglied auf Probe"
],
[
3000,
"Gildenmitglied (Junior)"
],
[
10000,
"Gildenmitglied"
],
[
40000,
"Senior-Gildenmitglied"
],
[
200000,
"Erfahrenes Gildenmitglied"
],
[
480000,
"Gildenverwalter"
]
],
"Citizens For Prosperity": [
[
0,
"Neutral"
],
[
800,
"Auftragnehmer Junior"
],
[
2200,
"Auftragnehmer"
],
[
5800,
"Auftragnehmer Senior"
],
[
15000,
"Auftragnehmer Erfahren"
],
[
38000,
"Auftragnehmer Leitend"
],
[
95250,
"Auftragnehmer Elite"
]
],
"Civilian Defense Force": [
[
0,
"Bewerber zum Ersthelfer"
],
[
5000,
"Ersthelfer in Ausbildung"
],
[
20000,
"Ersthelfer"
],
[
80000,
"Erfahrener Ersthelfer"
]
],
"Covalex": [
[
0,
"Anwärter"
],
[
50,
"Neuling"
],
[
250,
"Junior"
],
[
5250,
"Mitglied"
],
[
27750,
"Erfahren"
],
[
77750,
"Senior"
],
[
237750,
"Meister"
]
],
"Dead Saints": [
[
0,
"Neutral"
],
[
800,
"Auftragnehmer Junior"
],
[
2200,
"Auftragnehmer"
],
[
5800,
"Auftragnehmer Senior"
],
[
15000,
"Auftragnehmer Erfahren"
],
[
38000,
"Auftragnehmer Leitend"
],
[
95250,
"Auftragnehmer Elite"
]
],
"Eckhart Security": [
[
0,
"Bewerber"
],
[
1,
"Sicherheitsagent Anwärter"
],
[
5000,
"Sicherheitsagent Junior"
],
[
30000,
"Sicherheitsagent"
],
[
120000,
"Sicherheitsagent Senior"
],
[
480000,
"Sicherheitsagent Leitend"
],
[
1600000,
"Sicherheitsagent"
]
],
"FTL Courier": [
[
0,
"Neutral"
],
[
800,
"Auftragnehmer Junior"
],
[
2200,
"Auftragnehmer"
],
[
5800,
"Auftragnehmer Senior"
],
[
15000,
"Auftragnehmer Erfahren"
],
[
38000,
"Auftragnehmer Leitend"
],
[
95250,
"Auftragnehmer Elite"
]
],
"Foxwell Enforcement": [
[
0,
"Neutral"
],
[
800,
"Auftragnehmer Junior"
],
[
2200,
"Auftragnehmer"
],
[
5800,
"Auftragnehmer Senior"
],
[
15000,
"Auftragnehmer Erfahren"
],
[
38000,
"Auftragnehmer Leitend"
],
[
95250,
"Auftragnehmer Elite"
]
],
"Headhunters": [
[
0,
"Neutral"
],
[
800,
"Auftragnehmer Junior"
],
[
2200,
"Auftragnehmer"
],
[
5800,
"Auftragnehmer Senior"
],
[
15000,
"Auftragnehmer Erfahren"
],
[
38000,
"Auftragnehmer Leitend"
],
[
95250,
"Auftragnehmer Elite"
]
],
"Highpoint Wilderness Specialists": [
[
0,
"Neutral"
],
[
800,
"Auftragnehmer Junior"
],
[
2200,
"Auftragnehmer"
],
[
5800,
"Auftragnehmer Senior"
],
[
15000,
"Auftragnehmer Erfahren"
],
[
38000,
"Auftragnehmer Leitend"
],
[
95250,
"Auftragnehmer Elite"
]
],
"Hockrow Agency": [
[
0,
"Neutral"
],
[
800,
"Auftragnehmer Junior"
],
[
2200,
"Auftragnehmer"
],
[
5800,
"Auftragnehmer Senior"
],
[
15000,
"Auftragnehmer Erfahren"
],
[
38000,
"Auftragnehmer Leitend"
],
[
95250,
"Auftragnehmer Elite"
]
],
"InterSec Defense Solutions": [
[
0,
"Neutral"
],
[
800,
"Auftragnehmer Junior"
],
[
2200,
"Auftragnehmer"
],
[
5800,
"Auftragnehmer Senior"
],
[
15000,
"Auftragnehmer Erfahren"
],
[
38000,
"Auftragnehmer Leitend"
],
[
95250,
"Auftragnehmer Elite"
]
],
"Ling Family Hauling": [
[
0,
"Neutral"
],
[
800,
"Auftragnehmer Junior"
],
[
2200,
"Auftragnehmer"
],
[
5800,
"Auftragnehmer Senior"
],
[
15000,
"Auftragnehmer Erfahren"
],
[
38000,
"Auftragnehmer Leitend"
],
[
95250,
"Auftragnehmer Elite"
]
],
"Northrock Service Group": [
[
0,
"Neutral"
],
[
800,
"Auftragnehmer Junior"
],
[
2200,
"Auftragnehmer"
],
[
5800,
"Auftragnehmer Senior"
],
[
15000,
"Auftragnehmer Erfahren"
],
[
38000,
"Auftragnehmer Leitend"
],
[
95250,
"Auftragnehmer Elite"
]
],
"Rayari Incorporated": [
[
0,
"Neutral"
],
[
800,
"Auftragnehmer Junior"
],
[
2200,
"Auftragnehmer"
],
[
5800,
"Auftragnehmer Senior"
],
[
15000,
"Auftragnehmer Erfahren"
],
[
38000,
"Auftragnehmer Leitend"
],
[
95250,
"Auftragnehmer Elite"
]
],
"Recco Battaglia": [
[
0,
"Anwärter"
],
[
2400,
"Mitglied"
],
[
6000,
"Vertrauensmitglied"
],
[
10800,
"Prestige 1"
],
[
30000,
"Prestige 2"
],
[
69600,
"Prestige 3"
]
],
"Red Wind Linehaul": [
[
0,
"Anwärter"
],
[
50,
"Neuling"
],
[
250,
"Junior"
],
[
5250,
"Mitglied"
],
[
27750,
"Erfahren"
],
[
77750,
"Senior"
],
[
237750,
"Meister"
]
],
"Shubin Interstellar": [
[
0,
"Neutral"
],
[
800,
"Auftragnehmer Junior"
],
[
2200,
"Auftragnehmer"
],
[
5800,
"Auftragnehmer Senior"
],
[
15000,
"Auftragnehmer Erfahren"
],
[
38000,
"Auftragnehmer Leitend"
]
],
"United Wayfarers Club": [
[
0,
"Neutral"
],
[
800,
"Auftragnehmer Junior"
],
[
2200,
"Auftragnehmer"
],
[
5800,
"Auftragnehmer Senior"
],
[
15000,
"Auftragnehmer Erfahren"
],
[
38000,
"Auftragnehmer Leitend"
],
[
95250,
"Auftragnehmer Elite"
]
],
"Vaughn": [
[
0,
"Neutral"
],
[
800,
"Auftragnehmer Junior"
],
[
2200,
"Auftragnehmer"
],
[
5800,
"Auftragnehmer Senior"
],
[
15000,
"Auftragnehmer Erfahren"
],
[
38000,
"Auftragnehmer Leitend"
],
[
95250,
"Auftragnehmer Elite"
]
],
"Wikelo Emporium": [
[
0,
"Neuer Kunde"
],
[
340,
"Sehr guter Kunde"
],
[
999,
"Bester Kunde"
]
]
},
"scopes": {
"Adagio Holdings": "factionreputationscope",
"Bit Zeros": "factionreputationscope",
"Bounty Hunters Guild": "reputationscope_bounty_bountyhuntersguild",
"Citizens For Prosperity": "factionreputationscope",
"Civilian Defense Force": "reputationscope_emergency",
"Covalex": "reputationscope_hauling",
"Dead Saints": "factionreputationscope",
"Eckhart Security": "reputationscope_security",
"FTL Courier": "factionreputationscope",
"Foxwell Enforcement": "factionreputationscope",
"Headhunters": "factionreputationscope",
"Highpoint Wilderness Specialists": "factionreputationscope",
"Hockrow Agency": "factionreputationscope",
"InterSec Defense Solutions": "factionreputationscope",
"Ling Family Hauling": "factionreputationscope",
"Northrock Service Group": "factionreputationscope",
"Rayari Incorporated": "factionreputationscope",
"Recco Battaglia": "missionproviderreputationscope_battaglia",
"Red Wind Linehaul": "reputationscope_hauling",
"Shubin Interstellar": "factionreputationscope",
"United Wayfarers Club": "factionreputationscope",
"Vaughn": "factionreputationscope",
"Wikelo Emporium": "reputationscope_wikelo"
},
"tiles0": {
"Bounty Hunters Guild": 1,
"Civilian Defense Force": 1,
"Covalex": 1,
"Eckhart Security": 1,
"Red Wind Linehaul": 1
}
};
const L=()=>(document.documentElement.getAttribute('lang')||'de').slice(0,2);
const T=(de,en)=>L()==='en'?en:de;
const $r=id=>document.getElementById('rf-'+id);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const SKEY='scha_rep_v1', F0=1.0, MINLEARN=200;
let MIGRATED=0;
// Names of the external guild list shown in 1.13.0–1.15.0; stored alignments and stars under them belong to the
// organisation of the table (the game knows only one: log id CovalexIndependentContractors, mobiGlas "COVALEX").
const OLDNAMES={'Covalex Independent Haulers':'Covalex','Rayari Inc.':'Rayari Incorporated','Wikelo':'Wikelo Emporium'};
let MERGED=[];   // old names merged on this load (for the status line)   // alignments converted to the corrected tile reading on this load
const fmt=n=>Math.round(n).toLocaleString(L()==='en'?'en-GB':'de-DE');
const fmtT=s=>s?new Date(s).toLocaleString(L()==='en'?'en-GB':'de-DE',{dateStyle:'short',timeStyle:'short'}):'–';
// Title as in the table: markup of the translation removed, spaces collapsed (same rule as ruf_daten.norm_title).
const normT=s=>String(s||'').replace(/<[^>]+>|\[BP\]\*?|\*/g,' ').replace(/\s+/g,' ').trim();
const compact=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'');
let OPEN=null;   // organisation whose alignment form is open

/* ---------- stored state ---------- */
function load(){let st; try{st=JSON.parse(localStorage.getItem(SKEY)||'{}');}catch(e){st={};}
  // Old names of the guild list: move alignments and the star to the table name, drop duplicates
  let renamed=false;
  for(const [old,now] of Object.entries(OLDNAMES)){const os=st.orgs&&st.orgs[old]; if(!os) continue;
    const to=st.orgs[now]||(st.orgs[now]={cals:[],fav:false});
    for(const c of os.cals||[]) if(!to.cals.some(x=>x.t===c.t)) to.cals.push(c);
    to.cals.sort((a,b)=>a.t.localeCompare(b.t)); to.fav=!!(to.fav||os.fav); delete st.orgs[old]; MERGED.push(`${old} → ${now}`); renamed=true;}
  if(renamed){try{localStorage.setItem(SKEY,JSON.stringify(st));}catch(e){}}
  // Until 1.18.0 the highlighted tile counted as the next rank, so stored alignments are one rank too low: move each
  // up one band, keeping its share of the band. A value at the first threshold is left (ambiguous, usually a start).
  if(!st.lesart){let n=0;
    for(const [o,os] of Object.entries(st.orgs||{})){const l=ladder(o); if(l.length<2) continue;
      for(const c of os.cals||[]){const x=c.xp; if(x<=l[0][0]) continue; let j=0; while(j+1<l.length&&x>=l[j+1][0]) j++;
        if(j+1>=l.length) continue; const fr=(x-l[j][0])/(l[j+1][0]-l[j][0]), a=l[j+1][0], b=l[j+2]?l[j+2][0]:a;
        c.xp=Math.round(a+fr*(b-a)); n++;}}
    st.lesart=2; MIGRATED+=n; try{localStorage.setItem(SKEY,JSON.stringify(st));}catch(e){}}
  return st;}
function save(s){try{localStorage.setItem(SKEY,JSON.stringify(s));}catch(e){}}
function orgState(st,o){st.orgs=st.orgs||{}; return st.orgs[o]||(st.orgs[o]={cals:[],fav:false});}

/* ---------- table lookups ---------- */
// Table entry for one mission: the first notification text (or its part after "Prefix: ") that is a known title.
function lookup(texts){if(!TAB) return null;
  for(const x of texts){const parts=[x]; let i=x.indexOf(': '); while(i>=0){parts.push(x.slice(i+2)); i=x.indexOf(': ',i+2);}
    for(const p of parts){const e=TAB.missions[normT(p)]; if(e) return {title:normT(p),e};}}
  // Titles with placeholders ("Orange Level Contract: ~mission(Ship) Needs Assistance"): the log has the filled-in name
  for(const x of texts){const parts=[x]; let i=x.indexOf(': '); while(i>=0){parts.push(x.slice(i+2)); i=x.indexOf(': ',i+2);}
    for(const p of parts){const n=normT(p), hit=pats().find(q=>q.re.test(n)); if(hit) return {title:hit.title,e:TAB.missions[hit.title]};}}
  return null;}
let PATS=null;
// Regular expressions for the table titles that contain ~mission(…) placeholders.
function pats(){if(PATS) return PATS; PATS=[];
  for(const tt of Object.keys(TAB.missions)) if(tt.includes('~mission(')){
    const src=tt.split(/~mission\([^)]*\)/).map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('.+?');
    PATS.push({re:new RegExp('^'+src+'$'),title:tt});}
  return PATS;}
// Title for display: placeholders as [Name].
const prettyT=s=>String(s).replace(/~mission\(([^)|]*)(?:\|[^)]*)?\)/g,'[$1]');
// Guilds from Alpha 5.0 (PTU list, 20.11.2026): name, focus, and the words that identify their mission givers.
const GUILDS=[
  {n:'Transport Guild', d:['Fracht und Kurier','Cargo and courier'], k:['covalex','ftl','ling'], c:'var(--g-tr)'},
  {n:'Resources Guild', d:['Rohstoffe und Bergung','Resources and salvage'], k:['shubin','adagio','cornerstone'], c:'var(--g-re)'},
  {n:'Mercenary Guild', d:['Sicherheit, Kampf, Söldner','Security, combat, mercenary'], k:['northrock'], c:'var(--g-me)'},
  {n:'Bounty Hunter Guild', d:['Kopfgeldjagd','Bounty hunting'], k:['bounty'], c:'var(--g-bo)'},
  {n:'Academy of Science', d:['Forschung, Sammeln, Erkundung','Research, collecting, exploration'], k:['rayari'], c:'var(--g-ac)'},
  {n:'Lokale / persönliche Boards', d:['Terminals außerhalb der Gildenhallen','Terminals outside the guild halls'], k:['wikelo','hockrow'], c:'var(--g-lo)'}];
const gCol=o=>(guildOf(o)||{c:'var(--g-no)'}).c;   // colour of an organisation's guild; grey without guild
// Mission givers named in the guild list that the reputation table does not know (shown from the start).
// Names as in the table (Covalex, Rayari Incorporated, Wikelo Emporium …) so that nobody appears twice.
const EXTRA=['Cornerstone Developments','Northrock Service Group','Bounty Hunters Guild','Hockrow Agency'];
// Generic giver ids of the log that are no organisation.
const NOORG=new Set(['missiongiver','civilian']);
// All organisations: with a rank ladder, with missions in the table, and the extra ones of the guild list.
const known=()=>{if(!TAB) return EXTRA.slice(); const s=new Set(Object.keys(TAB.ladders)); for(const es of Object.values(TAB.missions)) for(const e of es) s.add(e[0]); for(const x of EXTRA) s.add(x); return [...s];};
const guildOf=o=>{const c=compact(o); return GUILDS.find(g=>g.k.some(k=>c.includes(k)))||null;};
// Display name of an organisation id from the log ("FoxwellEnforcement", "NorthRock" → Northrock Service Group).
function orgName(id){if(!id||NOORG.has(compact(id))) return ''; const c=compact(id);
  for(const o of known()){const k=compact(o); if(k===c||k.startsWith(c.slice(0,10))||c.startsWith(k.slice(0,10))) return o;}
  return id.replace(/([a-z])([A-Z])/g,'$1 $2');}
// Title of a mission without a table entry: the text of the accept notification without its prefix.
function plainTitle(texts){const x=texts[0]||''; const i=x.indexOf(': '); return i>0?x.slice(i+2):x;}

/* ---------- missions from the sessions ---------- */
// All ended missions over the loaded sessions, oldest first: time, title, organisation, result, stated XP, shared.
function missions(){const S=(typeof SZ!=='undefined'&&SZ.sessions)?SZ.sessions():[]; const ids={}, ends=[], shares=[];
  for(const s of S){if(!s.mis) continue;
    for(const [id,o] of Object.entries(s.mis.ids)){const a=ids[id]||(ids[id]={t:o.t,x:[],org:''}); if(o.t&&(!a.t||o.t<a.t)) a.t=o.t;
      for(const x of o.x) if(!a.x.includes(x)) a.x.push(x); if(!a.org&&o.org) a.org=o.org;}
    ends.push(...s.mis.ends); shares.push(...s.mis.shares);}
  const seen=new Set(), out=[];
  for(const e of ends.sort((a,b)=>a.t.localeCompare(b.t))){if(seen.has(e.id)) continue; seen.add(e.id);
    const m=ids[e.id]||{t:'',x:[],org:''}, hit=lookup(m.x), title=hit?hit.title:normT(plainTitle(m.x));
    const tab=hit?hit.e:null;
    // "Shared" notification with the same title between accepting and ending (it carries no MissionId)
    const shared=shares.some(sh=>(!m.t||sh.t>=m.t)&&sh.t<=e.t&&normT(sh.x)===title);
    // A mission can pay reputation to two organisations at once; each gets its own entry
    const orgs=tab?[...new Set(tab.map(x=>x[0]))]:[orgName(m.org)];
    for(const org of orgs){if(!org) continue; const es=tab?tab.filter(x=>x[0]===org):null;
      out.push({t:e.t,id:e.id,title,org,res:e.r,lo:es?Math.min(...es.map(x=>x[1])):null,hi:es?Math.max(...es.map(x=>x[2])):null,shared});}}
  return out;}

/* ---------- estimate ---------- */
// Rank ladder of an organisation; without own data the contractor ladder is assumed (flagged by ladderGuess).
const CONTRACTOR=()=>Object.values(TAB?TAB.ladders:{}).find(l=>l.some(r=>r[1]==='Auftragnehmer Elite'))||[];
const ladderGuess=o=>!(TAB&&TAB.ladders[o]&&TAB.ladders[o].length>1);
const ladder=o=>ladderGuess(o)?CONTRACTOR():TAB.ladders[o];
// Rank band for an XP value: [reached rank, next rank or null].
function band(o,x){const l=ladder(o); let i=0; while(i+1<l.length&&x>=l[i+1][0]) i++; return [l[i]||[0,'–'],l[i+1]||null];}
// Stated XP of a completed mission as [low, high] after the factor; shared missions count half to full.
function gain(m,f){if(m.res!=='Complete'||m.lo==null) return [0,0]; return [m.shared?m.lo*f/2:m.lo*f, m.hi*f];}
// Factor of an organisation: learned from the last two alignments when enough stated XP lies between them.
function factor(o,list,cals){if(cals.length>=2){const a=cals[cals.length-2], b=cals[cals.length-1];
    const between=list.filter(m=>m.org===o&&m.t>a.t&&m.t<=b.t&&m.res==='Complete'&&m.lo!=null&&!m.shared);
    const stated=between.reduce((s,m)=>s+(m.lo+m.hi)/2,0);
    if(stated>=MINLEARN&&b.xp>a.xp) return {f:Math.min(3,Math.max(0.05,(b.xp-a.xp)/stated)),learned:true,stated};}
  return {f:F0,learned:false};}
function estimate(o,list,st){const os=orgState(st,o), cal=os.cals[os.cals.length-1]||null, fac=factor(o,list,os.cals);
  const mine=list.filter(m=>m.org===o), after=cal?mine.filter(m=>m.t>cal.t):mine;
  let lo=0, hi=0, stated=0; for(const m of after){const g=gain(m,fac.f); lo+=g[0]; hi+=g[1]; if(m.res==='Complete'&&m.lo!=null) stated+=(m.lo+m.hi)/2;}
  return {cal,fac,mine,after,lo:cal?cal.xp+lo:null,hi:cal?cal.xp+hi:null,stated,
    unknown:after.filter(m=>m.res==='Complete'&&m.lo==null).length, failed:after.filter(m=>m.res==='Fail'||m.res==='Abandon').length,
    shared:after.filter(m=>m.res==='Complete'&&m.shared).length};}

/* ---------- screenshot of the mobiGlas ---------- */
// Measures the reputation tiles of a mobiGlas screenshot. The tiles sit at fixed places relative to image centre
// and height (four per row; measured at 2000×837). The highlighted tile (green frame = current rank) is the one whose
// top edge is clearly greener than all others – relative, because the mobiGlas is translucent and a bright
// background tints every tile. Its bar is measured as green run length with fractional edge pixels, against the
// length of the full bars of the tiles before it.
function measureShot(cv){const W=cv.width, H=cv.height, d=cv.getContext('2d',{willReadFrequently:true}).getImageData(0,0,W,H).data, s=H/837;
  const inside=(x,y)=>x>=0&&y>=0&&x<W&&y<H, at=(x,y)=>(Math.round(y)*W+Math.round(x))*4;
  const gr=(x,y)=>{if(!inside(x,y)) return 0; const i=at(x,y); return d[i+1]-d[i];};
  const bright=(x,y)=>{if(!inside(x,y)) return false; const i=at(x,y); return d[i+1]>150&&d[i+1]-d[i]>60;};
  const edge=(x,y)=>inside(x,y)?Math.min(1,Math.max(0,(d[at(x,y)+1]-100)/150)):0;
  const X0=W/2-204*s, Y0=276*s, DX=184*s, DY=186*s, BL=98.5*s;
  const slot=i=>[X0+(i%4)*DX, Y0+Math.floor(i/4)*DY];
  const top=i=>{const [x,y]=slot(i); let best=-1e9;
    for(let yy=Math.round(y-8*s);yy<=Math.round(y+8*s);yy++){let tt=0,n=0; for(let xx=Math.round(x+10*s);xx<x+150*s;xx++){tt+=gr(xx,yy); n++;} best=Math.max(best,tt/n);}
    return best;};
  const sc=[0,1,2,3,4,5,6,7].map(i=>({i,v:top(i)})).sort((p,q)=>q.v-p.v), conf=sc[0].v/Math.max(1,sc[1].v);
  if(sc[0].v<25||conf<1.6) return {err:T('Keine hervorgehobene Rang-Kachel gefunden. Ist es die mobiGlas-Seite „Ruf“ einer Organisation? Ein heller Hintergrund scheint durch das mobiGlas – dann vor dunklerem Hintergrund neu aufnehmen.','No highlighted rank tile found. Is it the mobiGlas “Reputation” page of an organisation? A bright background shows through the mobiGlas – then take it again in front of a darker one.')};
  // Bar of a tile: starts 32 px right of the frame; the row with the most green 93..109 px below its top edge
  const barRow=i=>{const [x,y]=slot(i), bx=x+32*s; let yb=y+101*s, best=-1e9;
    for(let yy=Math.round(y+93*s);yy<=Math.round(y+109*s);yy++){let tt=0; for(let xx=Math.round(bx);xx<bx+BL;xx++) tt+=gr(xx,yy); if(tt>best){best=tt; yb=yy;}}
    return [bx,yb];};
  // Green run length from the bar start, with the partly green boundary pixels as fractions
  const runAt=(x0,y)=>{let a=-1; for(let x=Math.floor(x0-4*s);x<x0+6*s;x++) if(bright(x,y)){a=x; break;}
    if(a<0) return edge(Math.round(x0),y)>.5?edge(Math.round(x0),y):0; let b=a; while(bright(b+1,y)) b++; return b-a+1+edge(a-1,y)+edge(b+1,y);};
  const cover=(x0,y)=>Math.max(runAt(x0,y-1),runAt(x0,y),runAt(x0,y+1));
  const idx=sc[0].i, [bx,yb]=barRow(idx);
  let Lc=0; for(let j=0;j<idx;j++){const [x,y]=barRow(j); Lc=Math.max(Lc,cover(x,y));}
  if(Lc<0.85*BL||Lc>1.2*BL) Lc=BL;   // no full bar before it: nominal length
  const pct=Math.max(0,Math.min(100,cover(bx,yb)/Lc*100));
  return {idx, pct:Math.round(pct*10)/10, weak:conf<2.5, box:[bx,yb,Lc],
    area:[Math.max(0,X0-40*s),Math.max(0,Y0-150*s),Math.min(W,800*s),Math.min(H,500*s)]};}
// Tiles before the first rank in the mobiGlas ("Nicht berechtigt" for hauling, security, bounty, emergency).
const offOf=o=>(TAB&&TAB.tiles0&&TAB.tiles0[o])||0;
// Rank reached and bar for one measured screenshot of organisation o: the highlighted tile is the current rank,
// its bar the way to the next one. Highlighted "Nicht berechtigt" (negative standing) counts as the first threshold.
function interpret(o,m){const l=ladder(o), k=m.idx-offOf(o);
  if(k<0) return {reached:l[0],next:null,pct:0,below:true};
  if(k>=l.length) return {err:T(`Hervorgehoben ist Kachel ${m.idx+1}, die Rangleiter von ${o} hat aber nur ${l.length+offOf(o)} Kacheln. Ist es der Screenshot dieser Organisation?`,`Tile ${m.idx+1} is highlighted, but the rank ladder of ${o} has only ${l.length+offOf(o)} tiles. Is it the screenshot of this organisation?`)};
  return {reached:l[k],next:l[k+1]||null,pct:l[k+1]?m.pct:0};}
const xpOf=r=>r.reached[0]+(r.next?(r.next[0]-r.reached[0])*r.pct/100:0);
const pctTxt=p=>String(p).replace('.',L()==='en'?'.':',');
// Time of the screenshot from its file name ("ScreenShot-2026-11-20_11-59-18-B56.jpg"), else the file date.
function shotTime(f){const m=/(\d{4})-(\d\d)-(\d\d)_(\d\d)-(\d\d)-(\d\d)/.exec(f.name||''); return m?new Date(+m[1],m[2]-1,+m[3],+m[4],+m[5],+m[6]):new Date(f.lastModified||Date.now());}
const localISO=d=>new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16);
// Image file to canvas (Image element instead of createImageBitmap: works in more browsers and in headless tests).
async function shotCanvas(f){const url=URL.createObjectURL(f), bm=new Image(); bm.src=url;
  try{await new Promise((ok,no)=>{bm.onload=ok; bm.onerror=no;});} finally{URL.revokeObjectURL(url);}
  const cv=document.createElement('canvas'); cv.width=bm.naturalWidth; cv.height=bm.naturalHeight; cv.getContext('2d').drawImage(bm,0,0); return cv;}
// Read a screenshot file into the open form: measure, show a preview with the measured bar marked, fill the fields.
async function readShot(f,form){const res=form.querySelector('.rf-res'), o=form.dataset.form, l=ladder(o);
  res.className='rf-res'; res.textContent=T('Lese Screenshot …','Reading screenshot …');
  try{const cv=await shotCanvas(f), m=measureShot(cv);
    if(m.err){res.className='rf-res bad'; res.textContent=m.err; return;}
    const r=interpret(o,m);
    if(r.err){res.className='rf-res bad'; res.textContent=r.err; return;}
    form.rank.value=String(r.reached[0]); form.pct.type='text'; form.pct.value=r.next?pctTxt(r.pct):'0'; form.t.value=localISO(shotTime(f));
    // Preview: the tile area, the measured bar framed
    const [bx,by,bl]=m.box, [x0,y0,w,h]=m.area, pv=form.querySelector('canvas'); pv.width=420; pv.height=Math.round(420*h/w);
    const c=pv.getContext('2d'); c.drawImage(cv,x0,y0,w,h,0,0,pv.width,pv.height);
    const k=pv.width/w; c.strokeStyle='#ff5a5a'; c.lineWidth=2; c.strokeRect((bx-x0-4)*k,(by-y0-8)*k,(bl+8)*k,16*k); pv.hidden=false;
    const warn=m.weak?T(' Die Kachel war nur knapp zu erkennen (heller Hintergrund?) – bitte prüfen.',' The tile was barely visible (bright background?) – please check.'):'';
    res.className='rf-res'+(warn?' bad':'');
    res.textContent=(r.below?T(`Erkannt: „Nicht berechtigt“ ist hervorgehoben – gezählt als ${fmt(l[0][0])} XP.`,`Found: “Not eligible” is highlighted – counted as ${fmt(l[0][0])} XP.`)
      :r.next?T(`Erkannt: Rang ${r.reached[1]}, Weg zu ${r.next[1]} zu ${pctTxt(r.pct)} % gefüllt`,`Found: rank ${r.reached[1]}, way to ${r.next[1]} ${r.pct} % filled`)
      :T(`Erkannt: höchster Rang ${r.reached[1]}`,`Found: top rank ${r.reached[1]}`))
      +T(` · Zeitpunkt ${fmtT(shotTime(f).toISOString())}. Rot markiert ist der gemessene Balken – bitte kurz prüfen und übernehmen.`,` · time ${fmtT(shotTime(f).toISOString())}. The measured bar is framed in red – please check and apply.`)+warn;}
  catch(e){res.className='rf-res bad'; res.textContent=T('Bild konnte nicht gelesen werden.','Could not read the image.');}}

/* ---------- several screenshots at once ---------- */
const OCRLIB={src:'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js',sri:'sha384-GJqSu7vueQ9qN0E9yLPb3Wtpd7OrgK8KmYzC8T1IysG1bcvxvIO4qtYR/D3A991F'};
let OCRP=null, BATCH=[], BSTOP=false;
// Text recognition (English model: the organisation names are written in Latin capitals), loaded once on demand.
function ocrWorker(){if(OCRP) return OCRP;
  OCRP=new Promise((ok,no)=>{if(window.Tesseract) return ok(); const sc=document.createElement('script'); sc.src=OCRLIB.src; sc.integrity=OCRLIB.sri; sc.crossOrigin='anonymous'; sc.onload=ok; sc.onerror=no; document.head.appendChild(sc);})
    .then(()=>Tesseract.createWorker('eng')).catch(e=>{OCRP=null; throw e;});
  return OCRP;}
// Title line with the organisation name above the tiles, enlarged; white capitals become black on white.
function titleCanvas(cv){const s=cv.height/837, x=Math.max(0,cv.width/2-200*s), y=140*s, w=Math.min(cv.width-x,840*s), h=56*s, k=2;
  const c=document.createElement('canvas'); c.width=Math.round(w*k); c.height=Math.round(h*k); const g=c.getContext('2d',{willReadFrequently:true});
  g.drawImage(cv,x,y,w,h,0,0,c.width,c.height); const im=g.getImageData(0,0,c.width,c.height), p=im.data;
  for(let i=0;i<p.length;i+=4){const v=0.299*p[i]+0.587*p[i+1]+0.114*p[i+2]>185?0:255; p[i]=p[i+1]=p[i+2]=v;}
  g.putImageData(im,0,0); return c;}
// Edit distance of a name to its best matching part of the read text.
function subDist(pn,tx){let prev=new Array(tx.length+1).fill(0);
  for(let i=1;i<=pn.length;i++){const cur=[i]; for(let j=1;j<=tx.length;j++) cur[j]=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(pn[i-1]===tx[j-1]?0:1)); prev=cur;}
  return Math.min(...prev);}
// Known organisation that best matches the read title (at least 75 % of its letters right), else null.
function matchOrg(text){const tx=compact(text); if(tx.length<3) return null; let best=null;
  for(const o of known()){const k=compact(o); const sc=1-subDist(k,tx)/k.length; if(!best||sc>best.sc) best={o,sc};}
  return best&&best.sc>=0.75?best:null;}
// Which rows are applied by default: newest image per organisation, readable, not applied before.
function markBatch(){const st=load(), seen=new Set();
  for(const b of BATCH){b.old=false; b.dup=false; if(!b.org){b.ok=false; continue;}
    const cals=(st.orgs&&st.orgs[b.org]&&st.orgs[b.org].cals)||[];
    b.dup=cals.some(c=>Math.abs(new Date(c.t)-b.t)<60000); b.old=seen.has(b.org); seen.add(b.org);
    b.ok=!b.old&&!b.dup&&!interpret(b.org,b.m).err;}}
async function batchRead(files){const st=$r('bstat');
  files=[...files].filter(f=>/^image\//.test(f.type)||/\.(jpe?g|png|webp|bmp)$/i.test(f.name)).sort((p,q)=>shotTime(q)-shotTime(p));
  BATCH=[]; BSTOP=false; $r('bres').innerHTML=''; $r('bok').disabled=true;
  if(!files.length){st.textContent=T('Keine Bilder gefunden.','No images found.'); return;}
  let worker=null, skipped=0;
  for(let i=0;i<files.length&&!BSTOP;i++){const f=files[i]; st.textContent=T(`Lese Bild ${i+1} von ${files.length} …`,`Reading image ${i+1} of ${files.length} …`);
    let cv; try{cv=await shotCanvas(f);}catch(e){skipped++; continue;}
    const m=measureShot(cv); if(m.err){skipped++; continue;}
    if(worker===null){st.textContent=T('Lade die Texterkennung (nur beim ersten Mal, einige MB) …','Loading text recognition (first time only, a few MB) …');
      try{worker=await ocrWorker();}catch(e){worker=false;}}
    let hit=null, raw='';
    if(worker){try{const r=await worker.recognize(titleCanvas(cv)); raw=r.data.text.replace(/\s+/g,' ').trim(); hit=matchOrg(raw);}catch(e){}}
    BATCH.push({f,t:shotTime(f),m,org:hit?hit.o:'',raw,ok:false});}
  markBatch(); renderBatch(skipped,worker===false);}
function batchRow(b,i){const orgs=known().sort((p,q)=>p.localeCompare(q));
  const opts=[`<option value="">${T('– nicht erkannt, bitte wählen –','– not recognised, please choose –')}</option>`,...orgs.map(o=>`<option${o===b.org?' selected':''}>${esc(o)}</option>`)].join('');
  let info, bad=false;
  if(!b.org){bad=true; info=T('Organisation nicht erkannt','Organisation not recognised')+(b.raw?` (${T('gelesen','read')}: „${esc(b.raw.slice(0,40))}“)`:'');}
  else{const r=interpret(b.org,b.m);
    if(r.err){bad=true; info=esc(r.err);}
    else info=(r.below?T(`„Nicht berechtigt“ · ${fmt(r.reached[0])} XP`,`“Not eligible” · ${fmt(r.reached[0])} XP`)
      :r.next?`${esc(r.reached[1])} → ${esc(r.next[1])} ${pctTxt(r.pct)} % · ≈ ${fmt(xpOf(r))} XP`:`${esc(r.reached[1])} · ${T('höchster Rang','top rank')}`)
      +(b.old?' · '+T('älteres Bild, nicht übernommen','older image, not applied'):'')+(b.dup?' · '+T('schon übernommen','applied before'):'')
      +(b.m.weak?' · '+T('Kachel nur knapp erkannt (heller Hintergrund?)','tile barely visible (bright background?)'):'');}
  return `<tr class="${bad?'bad':''}"><td><input type="checkbox" data-bi="${i}"${b.ok?' checked':''}${b.org?'':' disabled'} aria-label="${T('übernehmen','apply')}"></td>
    <td><span class="rf-dot" style="--gc:${b.org?gCol(b.org):'transparent'}" aria-hidden="true"></span><select data-bo="${i}" aria-label="${T('Organisation','Organisation')}">${opts}</select></td><td>${info}</td><td>${fmtT(b.t.toISOString())}</td></tr>`;}
let BSKIP=0, BNOOCR=false;
function renderBatch(skipped,noOcr){if(skipped!=null){BSKIP=skipped; BNOOCR=noOcr;} const n=BATCH.length;
  $r('bres').innerHTML=n?`<div class="tablewrap"><table><thead><tr><th>✓</th><th>${T('Organisation','Organisation')}</th><th>${T('Erkannt','Found')}</th><th>${T('Zeitpunkt','Time')}</th></tr></thead><tbody>${BATCH.map(batchRow).join('')}</tbody></table></div>`:'';
  bCount();}
function bCount(){const n=BATCH.length, k=BATCH.filter(b=>b.ok).length;
  $r('bstat').textContent=(n?T(`${n} Ruf-Screenshots gelesen`,`${n} reputation screenshots read`):T('Kein Ruf-Screenshot gefunden','No reputation screenshot found'))
    +(BSKIP?T(`, ${BSKIP} andere Bilder übersprungen`,`, ${BSKIP} other images skipped`):'')+'. '
    +(n?T(`${k} zum Übernehmen ausgewählt – bitte prüfen; die Organisation lässt sich je Zeile ändern.`,`${k} selected to apply – please check; the organisation can be changed per row.`):'')
    +(BNOOCR?' '+T('Texterkennung nicht verfügbar (offline?) – bitte die Organisation je Zeile wählen.','Text recognition not available (offline?) – please choose the organisation per row.'):'');
  const ok=$r('bok'); ok.disabled=!k; ok.lastChild.textContent=k?T(`${k} Abgleiche übernehmen`,`Apply ${k} alignments`):T('Übernehmen','Apply');}
function applyBatch(){const st=load(); let k=0;
  for(const b of BATCH){if(!b.ok||!b.org) continue; const r=interpret(b.org,b.m); if(r.err) continue;
    const os=orgState(st,b.org); os.cals.push({t:b.t.toISOString(),xp:Math.round(xpOf(r))}); os.cals.sort((p,q)=>p.t.localeCompare(q.t)); k++;}
  save(st); $r('bdlg').close(); render();
  $r('stat').textContent=T(`${k} Abgleiche aus Screenshots gespeichert.`,`${k} alignments from screenshots saved.`);}

/* ---------- missions by rank ---------- */
const TKEY='scha_rep_texts';
let INIMAP=null, INIFILE=null;
const textsOn=()=>{try{return localStorage.getItem(TKEY)==='1';}catch(e){return false;}};
const iniFile=()=>(typeof SZ!=='undefined'&&SZ.ini)?SZ.ini():null;
// Missions of one organisation from the table, grouped by minimum rank (XP threshold); null = no rank given.
function byRank(o){const m=new Map();
  for(const [title,es] of Object.entries(TAB?TAB.missions:{})){const e=es.filter(x=>x[0]===o); if(!e.length) continue;
    const min=e.find(x=>x[3]!=null)?.[3]??null, k=min==null?'x':String(min);
    if(!m.has(k)) m.set(k,{min,list:[]});
    m.get(k).list.push({title,lo:Math.min(...e.map(x=>x[1])),hi:Math.max(...e.map(x=>x[2])),key:e[0][4]});}
  return [...m.values()].sort((a,b)=>(a.min==null)-(b.min==null)||(a.min||0)-(b.min||0));}
function overview(o,est){const groups=byRank(o); if(!groups.length) return '';
  const n=groups.reduce((s,g)=>s+g.list.length,0), mid=est.cal?(est.lo+est.hi)/2:null, l=ladder(o), canText=textsOn()&&!!iniFile();
  const nextMin=mid==null?null:(groups.find(g=>g.min!=null&&g.min>mid)||{}).min;
  const html=groups.map(g=>{const rank=g.min==null?T('Stufe nicht angegeben','Rank not given'):((l.find(r=>r[0]===g.min)||[0,`${fmt(g.min)} XP`])[1]+` (${fmt(g.min)})`);
    const cls=g.min==null||mid==null?'':g.min<=mid?' done':g.min===nextMin?' next':' later';
    const tag=g.min==null||mid==null?'':g.min<=mid?`<span class="rf-tag">✓ ${T('freigeschaltet','unlocked')}</span>`:g.min===nextMin?`<span class="rf-tag">→ ${T(`als Nächstes, noch ≈ ${fmt(g.min-mid)} XP`,`next, ≈ ${fmt(g.min-mid)} XP to go`)}</span>`:`<span class="rf-tag">🔒 ${T('später','later')}</span>`;
    const items=g.list.sort((a,b)=>a.title.localeCompare(b.title)).map(x=>`<li>${canText?`<button type="button" class="rf-mt" data-mt="${esc(x.key)}" data-mtt="${esc(prettyT(x.title))}">${esc(prettyT(x.title))}</button>`:`<span data-mtwhy="${esc(prettyT(x.title))}">${esc(prettyT(x.title))}</span>`}<small>${x.lo===x.hi?fmt(x.lo):fmt(x.lo)+'–'+fmt(x.hi)} XP</small></li>`).join('');
    return `<div class="rf-lvl${cls}"><h4>${esc(rank)} <small>· ${g.list.length}</small>${tag}</h4><ul>${items}</ul></div>`;}).join('');
  const hint=mid==null?`<p class="rf-meta">${T('Nach dem ersten Abgleich siehst du hier, was freigeschaltet ist und was als Nächstes kommt.','After the first alignment you see here what is unlocked and what comes next.')}</p>`:'';
  return `<details data-ov="${esc(o)}"${OVOPEN.has(o)?' open':''}><summary>${T('Missionen nach Rufstufe','Missions by rank')} (${n})</summary>${hint}${html}</details>`;}
const OVOPEN=new Set();
// Read the needed descriptions from the player's global.ini once (only keys of the table).
async function loadTexts(){const f=iniFile(); if(!f) return null; if(INIMAP&&INIFILE===f) return INIMAP;
  const need=new Set(Object.values(TAB.missions).flat().map(e=>e[4])), map={}, txt=await f.text();
  for(const line of txt.split(/\r?\n/)){const i=line.indexOf('='); if(i<0) continue; const k=line.slice(0,i).split(',')[0].toLowerCase(); if(need.has(k)) map[k]=line.slice(i+1);}
  INIMAP=map; INIFILE=f; return map;}
// Ini value as plain text: "\n" to line breaks, markup removed, placeholders shortened.
const iniText=v=>String(v||'').replace(/\\n/g,'\n').replace(/<\/?EM\d>/g,'').replace(/~mission\(([^)|]*)(?:\|[^)]*)?\)/g,'[$1]');
// Click on a title while texts are off: say what is missing instead of doing nothing.
function showWhy(title){const dlg=$r('dlg'); $r('dlg-h').textContent=title;
  $r('dlg-t').textContent=!textsOn()?T('Missionstexte sind ausgeschaltet. Schalte oben „Missionstexte anzeigen“ ein, dann öffnet ein Klick auf den Titel den Text.','Mission texts are switched off. Switch on “Show mission texts” at the top, then a click on the title opens the text.')
    :T('Die Sprachdatei des Spiels fehlt (StarCitizen\\LIVE\\data\\Localization\\…\\global.ini). Lade über „Log-Ordner laden …“ den ganzen Ordner LIVE, nicht nur „logbackups“. Hinweis: Eine lokal geöffnete Datei des Planers hat einen eigenen Speicher – dort den Ordner einmal neu wählen.','The game’s language file is missing (StarCitizen\\LIVE\\data\\Localization\\…\\global.ini). Load the whole LIVE folder via “Load log folder …”, not just “logbackups”. Note: a locally opened copy of the planner has its own storage – choose the folder there once again.');
  if(!dlg.open) dlg.showModal();}
async function showText(key,title){const dlg=$r('dlg'); $r('dlg-h').textContent=title; $r('dlg-t').textContent=T('Lese Sprachdatei …','Reading language file …');
  if(!dlg.open) dlg.showModal();
  try{const map=await loadTexts(); $r('dlg-t').textContent=map&&map[key]?iniText(map[key]):T('Für diese Mission steht kein Text in der Sprachdatei.','No text for this mission in the language file.');}
  catch(e){$r('dlg-t').textContent=T('Die Sprachdatei konnte nicht gelesen werden – bitte den Log-Ordner neu laden.','The language file could not be read – please load the log folder again.');}}
function textsBar(){const box=$r('texts'), lab=box.closest('label'), has=!!iniFile(), note=$r('texts-note');
  box.checked=textsOn(); box.disabled=!has; lab.classList.toggle('off',!has);
  // The reason shows when the switch was on before or when someone clicks the greyed switch (no silent grey box)
  note.hidden=has||!(textsOn()||WHYTEXTS);
  lab.title=has?'':T('Braucht die Sprachdatei des Spiels – den ganzen Ordner LIVE laden.','Needs the game’s language file – load the whole LIVE folder.');
  note.textContent=has?'':T('Missionstexte brauchen die Sprachdatei des Spiels (StarCitizen\\LIVE\\data\\Localization\\…\\global.ini) im geladenen Ordner – die gibt es nur mit installierter Übersetzung. Lade dafür über „Log-Ordner laden …“ den ganzen Ordner LIVE, nicht nur „logbackups“. Eine lokal geöffnete Kopie des Planers hat einen eigenen Speicher – dort den Ordner einmal neu wählen.','Mission texts need the game’s language file (StarCitizen\\LIVE\\data\\Localization\\…\\global.ini) in the loaded folder – it exists only with a translation installed. Load the whole LIVE folder via “Load log folder …”, not just “logbackups”. A locally opened copy of the planner has its own storage – choose the folder there once again.');}
let WHYTEXTS=false;

/* ---------- to the phone ---------- */
const PKEY='scha_rep_snap';
const loadSnap=()=>{try{return JSON.parse(localStorage.getItem(PKEY)||'null');}catch(e){return null;}};
// Rank and bar of every aligned organisation (for the phone, which has no logs)
function handyData(){const ms=missions(), st=load(), out=[];
  for(const o of Object.keys(st.orgs||{})){const os=st.orgs[o]; if(!os.cals||!os.cals.length) continue;
    const e=estimate(o,ms,st), mid=(e.lo+e.hi)/2, [cur,next]=band(o,mid);
    out.push([o,cur[1],cur[0],next?next[1]:null,next?next[0]:null,Math.round(e.lo),Math.round(e.hi),os.fav?1:0]);}
  return {t:new Date().toISOString(),o:out};}
function fromHandy(d){if(!d||!Array.isArray(d.o)) throw new Error('format'); try{localStorage.setItem(PKEY,JSON.stringify(d));}catch(e){} render();}
function renderSnap(d){const list=$r('list');
  const card=([o,rank,cx,next,nx,lo,hi])=>{const mid=(lo+hi)/2, span=nx!=null?nx-cx:0, p=x=>span?Math.max(0,Math.min(100,(x-cx)/span*100)):100;
    // Same compact layout as the upper half of the cards on the PC (view only, nothing to unfold)
    return `<article class="rf-org" style="--gc:${gCol(o)}"><div class="rf-top"><div class="rf-head">${rankBadge(o,mid)}<h3 title="${esc(o)}">${esc(o)}</h3></div>
      <div class="rf-sub"><span class="rf-rank">${esc(rank)}</span>${ladderMini(o,mid)}</div>
      <div class="rf-track" role="img" aria-label="${T('Fortschritt','Progress')} ${Math.round(p(mid))} %"><div class="rf-fill" style="width:${p(lo)}%"></div><div class="rf-unc" style="left:${p(lo)}%;width:${Math.max(0,p(hi)-p(lo))}%"></div></div>
      <div class="rf-nums"><span><b>≈ ${fmt(mid)} XP</b></span><span>${next?T(`noch ≈ ${fmt(Math.max(0,nx-mid))} bis ${esc(shortRank(o,next))}`,`≈ ${fmt(Math.max(0,nx-mid))} to ${esc(shortRank(o,next))}`):T('höchster Rang','top rank')}</span></div></div></article>`;};
  const rows=d.o.slice().sort((a,b)=>b[7]-a[7]||a[0].localeCompare(b[0]));
  const groups=[...GUILDS.map(g=>({g,list:rows.filter(r=>guildOf(r[0])===g)})),{g:null,list:rows.filter(r=>!guildOf(r[0]))}].filter(x=>x.list.length);
  list.innerHTML=`<div class="rf-snap"><span>📱 ${T(`Stand vom PC · ${fmtT(d.t)} · nur ansehen`,`State from the PC · ${fmtT(d.t)} · view only`)}</span><button type="button" class="btn" data-snapend>${T('Ansicht beenden','End view')}</button></div>`
    +(groups.length?groups.map(x=>`<details class="rf-guild" open style="--gc:${x.g?x.g.c:'var(--g-no)'}"><summary><h2>${esc(x.g?x.g.n:T('Keiner Gilde zugeordnet','No guild assigned'))}</h2><small>${x.list.length}</small></summary><div class="rf-cards">${x.list.map(card).join('')}</div></details>`).join('')
    :`<p class="rf-empty">${T('Im übertragenen Stand ist keine Organisation abgeglichen.','No organisation is aligned in the transferred state.')}</p>`);}

/* ---------- rank badges ---------- */
// Own badge for position i of a ladder (drawn for this tool): shield with 1–3 stars, from the fourth rank on with
// wings, then one or two chevrons above, from the seventh a crown. st: 'done' filled, 'next' outlined in accent,
// 'later' outlined grey.
function starPath(cx,cy,r){let p=''; for(let k=0;k<10;k++){const a=-Math.PI/2+k*Math.PI/5, rr=k%2?r*.45:r; p+=(k?'L':'M')+(cx+rr*Math.cos(a)).toFixed(2)+' '+(cy+rr*Math.sin(a)).toFixed(2);} return p+'Z';}
function badge(i,st,sz){const fill=st==='done', col=st==='later'?'var(--muted)':'var(--accent)';
  const sf=fill?'var(--bg)':col, n=Math.min(3,i+1), ys=i<3?18:19;
  const pos=n===1?[[16,ys]]:n===2?[[12.5,ys],[19.5,ys]]:[[16,ys-4.5],[12,ys+2.5],[20,ys+2.5]];
  let g=`<path d="M16 7 L25 10.5 V17 C25 23 21 27.5 16 29.5 C11 27.5 7 23 7 17 V10.5 Z" fill="${fill?col:'none'}" stroke="${col}" stroke-width="1.6" stroke-linejoin="round"/>`;
  g+=pos.map(([x,y])=>`<path d="${starPath(x,y,n===3?3.2:3.6)}" fill="${sf}"/>`).join('');
  if(i>=3) g+=`<path d="M7 13 L1.5 10.5 L2.5 15 L1.5 17.5 L7 19.5 Z M25 13 L30.5 10.5 L29.5 15 L30.5 17.5 L25 19.5 Z" fill="${fill?col:'none'}" stroke="${col}" stroke-width="1.2" stroke-linejoin="round"/>`;
  if(i===4||i===5) for(let k=0;k<i-3;k++) g+=`<path d="M11.5 ${(6.3-k*2.7).toFixed(1)} L16 ${(3.6-k*2.7).toFixed(1)} L20.5 ${(6.3-k*2.7).toFixed(1)}" fill="none" stroke="${col}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`;
  if(i>=6) g+=`<path d="M10 5.5 L11.5 1.5 L14 4 L16 0.8 L18 4 L20.5 1.5 L22 5.5 Z" fill="${fill?col:'none'}" stroke="${col}" stroke-width="1.2" stroke-linejoin="round"/>`;
  return `<svg width="${sz}" height="${sz}" viewBox="0 0 32 32" aria-hidden="true" focusable="false">${g}</svg>`;}
// Ladder as a row of badges like the mobiGlas tiles; x = XP now (null: not aligned, all grey).
// Short rank name: the first word most ranks of the ladder share ("Auftragnehmer", "Sicherheitsagent") is left out.
function shortRank(o,n){const l=ladder(o), fw={}; for(const r of l){const w=r[1].split(' ')[0]; fw[w]=(fw[w]||0)+1;}
  const com=Object.keys(fw).find(w=>fw[w]>=3&&fw[w]>=l.length/2); const s=com&&n.startsWith(com+' ')?n.slice(com.length+1):n; return /^[0-9IVX]+$/.test(s)?n:s;}   // never a bare number ("Prestige 1")
function ladderStrip(o,x){const l=ladder(o); if(!l.length) return '';
  let cur=-1; if(x!=null) l.forEach((r,i)=>{if(x>=r[0]) cur=i;});
  const short=n=>shortRank(o,n);   // full name in the tooltip
  const items=l.map(([xp,n],i)=>{const st=x==null?'later':i<=cur?'done':i===cur+1?'next':'later', cls=i===cur?'cur':st;
    return `<li class="${cls}" title="${esc(n)} · ${fmt(xp)} XP">${badge(i,st==='done'?'done':st,30)}<span>${esc(short(n))}</span></li>`;}).join('');
  const lab=x==null?T(`Rangleiter, ${l.length} Stufen`,`Rank ladder, ${l.length} ranks`):T(`Stufe ${cur+1} von ${l.length}`,`Rank ${cur+1} of ${l.length}`);
  return `<ul class="rf-ladder" role="img" aria-label="${esc(lab)}">${items}</ul>`;}
// Mini ladder for the compact card: badges only, full name and threshold in the tooltip.
function ladderMini(o,x){const l=ladder(o); if(!l.length) return ''; let cur=-1; if(x!=null) l.forEach((r,i)=>{if(x>=r[0]) cur=i;});
  return `<span class="rf-mini" role="img" aria-label="${esc(x==null?T(`Rangleiter, ${l.length} Stufen`,`Rank ladder, ${l.length} ranks`):T(`Stufe ${cur+1} von ${l.length}`,`Rank ${cur+1} of ${l.length}`))}">`
    +l.map(([xp,n],i)=>`<span title="${esc(n)} · ${fmt(xp)} XP">${badge(i,x==null?'later':i<=cur?'done':i===cur+1?'next':'later',18)}</span>`).join('')+'</span>';}
const rankBadge=(o,x)=>{const l=ladder(o); let cur=0; l.forEach((r,i)=>{if(x>=r[0]) cur=i;}); return badge(cur,'done',26);};

/* ---------- rendering ---------- */
function bar(o,est){const mid=(est.lo+est.hi)/2, [cur,next]=band(o,mid);
  if(!next) return {cur,next,html:`<div class="rf-track"><div class="rf-fill" style="width:100%"></div></div>`};
  const span=next[0]-cur[0], p=x=>Math.max(0,Math.min(100,(x-cur[0])/span*100));
  return {cur,next,html:`<div class="rf-track" role="img" aria-label="${T('Fortschritt','Progress')} ${Math.round(p(mid))} %"><div class="rf-fill" style="width:${p(est.lo)}%"></div><div class="rf-unc" style="left:${p(est.lo)}%;width:${Math.max(0,p(est.hi)-p(est.lo))}%"></div></div>`};}
function card(o,list,st){const est=estimate(o,list,st), os=orgState(st,o), isOpen=EXP.has(o)||OPEN===o;
  const tog=`<button type="button" class="rf-tog" data-tog="${esc(o)}" aria-expanded="${isOpen}" aria-label="${T(isOpen?'Details zuklappen':'Details aufklappen',isOpen?'Hide details':'Show details')}">${isOpen?'▴':'▾'}</button>`;
  const star=`<button type="button" class="rf-star" data-fav="${esc(o)}" aria-pressed="${os.fav}" aria-label="${T('Favorit','Favourite')}" title="${T('Oben anheften','Pin to top')}">${os.fav?'★':'☆'}</button>`;
  let top, body;
  if(!est.cal){const n=est.mine.filter(m=>m.res==='Complete').length;
    top=`<div class="rf-sub"><span class="rf-meta">${T('Noch kein Abgleich','Not aligned yet')}${n?` · ${n} ${T('Missionen in den Logs','missions in the logs')}`:''}</span>${ladderMini(o,null)}</div>`;
    body=`<p class="rf-meta">${T(`${est.mine.filter(m=>m.res==='Complete').length} abgeschlossene Missionen in den geladenen Logs. Noch kein Abgleich – trag einmal ein, was dein mobiGlas zeigt.`,`${est.mine.filter(m=>m.res==='Complete').length} completed missions in the loaded logs. Not aligned yet – enter once what your mobiGlas shows.`)}</p>`+ladderStrip(o,null);}
  else{const b=bar(o,est), mid=(est.lo+est.hi)/2, range=est.hi-est.lo>=1?` <small>(${fmt(est.lo)}–${fmt(est.hi)})</small>`:'';
    const up=b.cur[1]!==band(o,est.cal.xp)[0][1]?` <span class="rf-tag">${T('rechnerisch aufgestiegen','computed rank-up')}</span>`:'';
    top=`<div class="rf-sub"><span class="rf-rank">${esc(b.cur[1])}${up}</span>${ladderMini(o,mid)}</div>${b.html}
      <div class="rf-nums"><span><b>≈ ${fmt(mid)} XP</b>${range}</span><span>${b.next?T(`noch ≈ ${fmt(Math.max(0,b.next[0]-mid))} bis ${esc(shortRank(o,b.next[1]))}`,`≈ ${fmt(Math.max(0,b.next[0]-mid))} to ${esc(shortRank(o,b.next[1]))}`):T('höchster Rang','top rank')}</span></div>`;
    body=`${ladderStrip(o,mid)}<p class="rf-meta">${T('Abgleich','Aligned')} ${fmtT(est.cal.t)} (${fmt(est.cal.xp)} XP) · ${T(`seit dann ${est.after.filter(m=>m.res==='Complete').length} Missionen, +${fmt(est.stated)} XP laut Beschreibung`,`since then ${est.after.filter(m=>m.res==='Complete').length} missions, +${fmt(est.stated)} XP as stated`)}
        · ${T('Faktor','factor')} ${est.fac.f.toFixed(2).replace('.',L()==='en'?'.':',')} ${est.fac.learned?T('(gelernt)','(learned)'):`<span class="est">${T('(geschätzt – zweiter Abgleich macht ihn genau)','(estimated – a second alignment makes it exact)')}</span>`}
        ${est.unknown?` · <span class="est">+? ${T(`aus ${est.unknown} Missionen ohne Wert`,`from ${est.unknown} missions without a value`)}</span>`:''}
        ${est.shared?` · ${T(`${est.shared} geteilt (halb bis voll gezählt)`,`${est.shared} shared (counted half to full)`)}`:''}
        ${est.failed?` · ${T(`${est.failed} fehlgeschlagen/abgebrochen (0 gezählt)`,`${est.failed} failed/abandoned (counted 0)`)}`:''}</p>`;}
  const rows=est.after.slice().reverse().map(m=>`<tr><td>${fmtT(m.t)}</td><td>${esc(prettyT(m.title))}${m.shared?`<span class="rf-tag">${T('geteilt','shared')}</span>`:''}</td><td>${m.res==='Complete'?'✓':`<span class="rf-tag fail">${esc(m.res==='Fail'?T('fehlgeschlagen','failed'):m.res==='Abandon'?T('abgebrochen','abandoned'):m.res)}</span>`}</td><td class="num">${m.lo==null?'?':m.lo===m.hi?fmt(m.lo):fmt(m.lo)+'–'+fmt(m.hi)}</td></tr>`).join('');
  const det=est.after.length?`<details><summary>${T(est.cal?'Missionen seit dem Abgleich':'Missionen in den geladenen Logs',est.cal?'Missions since the alignment':'Missions in the loaded logs')} (${est.after.length})</summary><div class="tablewrap"><table><thead><tr><th>${T('Ende','End')}</th><th>${T('Mission','Mission')}</th><th>${T('Ergebnis','Result')}</th><th class="num">${T('XP laut Beschreibung','XP as stated')}</th></tr></thead><tbody>${rows}</tbody></table></div></details>`:'';
  const acts=`<div class="rf-acts"><button type="button" class="btn" data-align="${esc(o)}">⇄ ${T('Stand aus dem mobiGlas abgleichen …','Align with the mobiGlas …')}</button>${os.cals.length?`<button type="button" class="btn" data-undo="${esc(o)}">↶ ${T('Letzten Abgleich entfernen','Remove last alignment')}</button>`:''}</div>`;
  const guess=ladderGuess(o)?`<p class="rf-meta"><span class="est">${T('Rangleiter nicht bekannt – Auftragnehmer-Stufen angenommen.','Rank ladder unknown – contractor ranks assumed.')}</span></p>`:'';
  const icon=est.cal?rankBadge(o,(est.lo+est.hi)/2):badge(0,'later',26);
  return `<article class="rf-org${os.fav?' fav':''}${isOpen?' open':''}" data-org="${esc(o)}" style="--gc:${gCol(o)}"><div class="rf-top" data-top="${esc(o)}"><div class="rf-head">${icon}<h3 title="${esc(o)}">${esc(o)}</h3>${star}${tog}</div>${top}</div>`
    +`<div class="rf-more"${isOpen?'':' hidden'}>${body}${guess}${acts}${OPEN===o?form(o,est):''}${det}${overview(o,est)}</div></article>`;}
const EXP=new Set();   // organisations whose card is unfolded (kept while the page is open)
// One row of the list view (aligned organisations); a click unfolds it into the full card.
function row(o,list,st){const est=estimate(o,list,st), os=orgState(st,o), mid=(est.lo+est.hi)/2, b=bar(o,est);
  return `<div class="rf-row${os.fav?' fav':''}" data-top="${esc(o)}" data-org="${esc(o)}" style="--gc:${gCol(o)}">${rankBadge(o,mid)}`
    +`<span class="rf-rn" title="${esc(o)}">${esc(o)}</span><span class="rf-rank">${esc(shortRank(o,b.cur[1]))}</span>${b.html}`
    +`<span class="rf-rm">≈ ${fmt(mid)} XP · ${b.next?T(`noch ≈ ${fmt(Math.max(0,b.next[0]-mid))} bis ${esc(shortRank(o,b.next[1]))}`,`≈ ${fmt(Math.max(0,b.next[0]-mid))} to ${esc(shortRank(o,b.next[1]))}`):T('höchster Rang','top rank')}</span>`
    +`<button type="button" class="rf-tog" data-tog="${esc(o)}" aria-expanded="false" aria-label="${T('Details aufklappen','Show details')}">▾</button></div>`;}
const VKEY='scha_rep_view', OKEY='scha_rep_sort';
const viewMode=()=>{try{return localStorage.getItem(VKEY)==='list'?'list':'cards';}catch(e){return 'cards';}};
const sortMode=()=>{try{return localStorage.getItem(OKEY)==='next'?'next':'guild';}catch(e){return 'guild';}};
// Alignment form: current rank (highlighted tile), fill of its bar, time of the look into the mobiGlas.
function form(o,est){const l=ladder(o), cur=est.cal?band(o,(est.lo+est.hi)/2)[0][1]:(l[0]||[0,''])[1];
  const now=new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,16);
  return `<form class="rf-form" data-form="${esc(o)}" novalidate>
    <p class="rf-help">${T('mobiGlas → Ruf → Organisation: Die <b>hervorgehobene Kachel</b> ist dein aktueller Rang, ihr Balken der Weg zum nächsten. Am genauesten: Screenshot auswerten lassen; sonst den hervorgehobenen Rang wählen und schätzen, wie weit sein Balken gefüllt ist.','mobiGlas → Reputation → organisation: the <b>highlighted tile</b> is your current rank, its bar the way to the next one. Most precise: let the page read a screenshot; otherwise choose the highlighted rank and estimate how far its bar is filled.')}</p>
    <div class="rf-shot" data-drop><button type="button" class="btn" data-shot>📷 ${T('Screenshot auswerten …','Read screenshot …')}</button><input type="file" accept="image/*" hidden data-shotin>
      <p class="rf-res" role="status">${T('Screenshot der Ruf-Seite dieser Organisation wählen oder hierher ziehen (Ordner <code>StarCitizen\\LIVE\\screenshots</code>). Die Felder werden ausgefüllt.','Choose or drop a screenshot of this organisation’s reputation page (folder <code>StarCitizen\\LIVE\\screenshots</code>). The fields get filled in.')}</p><canvas hidden></canvas></div>
    <label>${T('Rang (hervorgehobene Kachel)','Rank (highlighted tile)')}<select name="rank">${l.map(([x,n])=>`<option value="${x}"${n===cur?' selected':''}>${esc(n)} (${fmt(x)})</option>`).join('')}</select></label>
    <label>${T('Balken dieser Kachel in %','Bar of this tile in %')}<input name="pct" type="number" inputmode="decimal" min="0" max="100" step="0.5" value="0"></label>
    <label>${T('Zeitpunkt des Blicks','Time of the look')}<input name="t" type="datetime-local" value="${now}"></label>
    <div class="rf-btns"><button type="submit" class="btn pri">✓ ${T('Übernehmen','Apply')}</button><button type="button" class="btn" data-cancel>${T('Abbrechen','Cancel')}</button></div>
    <p class="rf-err" role="alert"></p></form>`;}
function render(){const list=$r('list'), S=(typeof SZ!=='undefined'&&SZ.sessions)?SZ.sessions():[];
  const snapD=loadSnap(); document.getElementById('view-rep').classList.toggle('rf-snapmode',!!snapD); if(snapD){renderSnap(snapD); return;}
  $r('src').textContent=TAB?T(`Ruf-Tabelle: ${Object.keys(TAB.missions).length} Missionstitel, Stand ${TAB.stand}. Quelle: ${TAB.quelle}.`,`Reputation table: ${Object.keys(TAB.missions).length} mission titles, as of ${TAB.stand}. Source: annotations of the German community translation (numbers, titles, rank names only).`):T('Ruf-Tabelle fehlt in diesem Bau.','Reputation table missing in this build.');
  $r('load').classList.toggle('pri',!S.length); textsBar(); if(textsOn()&&iniFile()) loadTexts().catch(()=>{});
  load();   // first, so that merges and conversions of the stored state can be reported below
  $r('stat').textContent=S.length?(SZ.status?SZ.status():''):'';
  // One-time notes about the stored state (merged old names, converted alignments), shown together
  const notes=[];
  if(MERGED.length) notes.push(T(`Zusammengeführt (alte Namen aus der Gildenliste): ${MERGED.join(', ')}.`,`Merged (old names from the guild list): ${MERGED.join(', ')}.`));
  if(MIGRATED) notes.push(MIGRATED===1?T('1 bisheriger Abgleich auf die korrigierte Lesart umgerechnet (eine Stufe höher).','1 earlier alignment converted to the corrected reading (one rank up).')
    :T(`${MIGRATED} bisherige Abgleiche auf die korrigierte Lesart umgerechnet (eine Stufe höher).`,`${MIGRATED} earlier alignments converted to the corrected reading (one rank up).`));
  if(notes.length){$r('stat').textContent=notes.join(' ')+' '+T('Genauer ist ein neuer Abgleich: „Screenshots abgleichen …“.','A new alignment is more precise: “Align from screenshots …”.'); MERGED=[]; MIGRATED=0;}
  // All known organisations from the start (table, guild list, logs, own alignments)
  const ms=missions(), st=load(), hide=hideOn(), mode=viewMode(), order=sortMode();
  const orgs=[...new Set([...known(),...ms.map(m=>m.org),...Object.keys(st.orgs||{})])].filter(Boolean);
  const last=o=>ms.filter(m=>m.org===o).map(m=>m.t).sort().pop()||'';
  const has=o=>orgState(st,o).cals.length>0, fav=o=>orgState(st,o).fav, unf=o=>EXP.has(o)||OPEN===o;
  const shown=orgs.filter(o=>!hide||has(o)||fav(o));
  $r('hide').checked=hide;
  for(const r of document.querySelectorAll('#view-rep input[name="rf-view"]')) r.checked=r.value===mode;
  const so=$r('sort'); so.value=order; so.options[0].textContent=T('nach Gilde','by guild'); so.options[1].textContent=T('nächster Aufstieg zuerst','next rank-up first');
  // Share of the current band reached (for "next rank-up first"); top rank and not aligned at the end
  const SH={}; for(const o of shown){const e=estimate(o,ms,st); if(!e.cal){SH[o]=-2; continue;} const mid=(e.lo+e.hi)/2, [c,n]=band(o,mid); SH[o]=n?(mid-c[0])/(n[0]-c[0]):-1;}
  const byGuild=(p,q)=>has(q)-has(p)||last(q).localeCompare(last(p))||p.localeCompare(q), byNext=(p,q)=>SH[q]-SH[p]||p.localeCompare(q);
  const item=o=>mode==='list'&&has(o)&&!unf(o)?row(o,ms,st):card(o,ms,st);
  const wrap=xs=>xs.length?(mode==='list'?`<div class="rf-rows">${xs.map(item).join('')}</div>`:`<div class="rf-cards">${xs.map(item).join('')}</div>`):'';
  // Without alignment: one line of names; a click unfolds the card to align it
  const quiet=xs=>xs.length?`<p class="rf-quiet"><span>${T('Ohne Abgleich','Not aligned')} (${xs.length}):</span>${xs.map(o=>`<button type="button" class="rf-qn" data-tog="${esc(o)}" style="--gc:${gCol(o)}" title="${T('Aufklappen und abgleichen','Unfold and align')}">${esc(o)}</button>`).join('')}</p>`:'';
  const split=xs=>[xs.filter(o=>has(o)||unf(o)),xs.filter(o=>!(has(o)||unf(o))).sort((p,q)=>p.localeCompare(q))];
  const favs=shown.filter(fav).sort(order==='next'?byNext:byGuild), rest=shown.filter(o=>!fav(o));
  const hint=S.length?'':`<p class="rf-empty">${T('Lade den Log-Ordner von Star Citizen (LIVE oder PTU), dann zählt der Reiter deine Missionen mit. Abgleichen geht auch ohne Logs.','Load the Star Citizen log folder (LIVE or PTU), then the tab counts your missions. Aligning works without logs too.')}</p>`;
  const nHidden=orgs.length-shown.length;
  let html=favs.length?`<section class="rf-favs"><h2>★ ${T('Favoriten','Favourites')} <small>${favs.length}</small></h2>${wrap(favs)}</section>`:'';
  if(order==='next'){const [a,q]=split(rest); a.sort(byNext); html+=`<section class="rf-flat">${wrap(a)}${quiet(q)}</section>`;}
  else{const closed=gClosed();
    const groups=[...GUILDS.map(g=>({g,list:rest.filter(o=>guildOf(o)===g)})),{g:null,list:rest.filter(o=>!guildOf(o))}].filter(x=>x.list.length);
    html+=`<div class="rf-guilds${mode==='list'?' list':''}">`+groups.map(x=>{const gn=x.g?x.g.n:'-', [a,q]=split(x.list); a.sort(byGuild);
      const desc=x.g?T(x.g.d[0],x.g.d[1]):T('Im Testserver 5.0 noch keiner Gilde zugeordnet (geprüft 20.11.2026).','Not yet assigned to a guild on the 5.0 test server (checked 20 Nov 2026).');
      return `<details class="rf-guild" style="--gc:${x.g?x.g.c:'var(--g-no)'};--n:${Math.min(Math.max(a.length,1),4)}" data-guild="${esc(gn)}"${closed.has(gn)?'':' open'}><summary title="${esc(desc)}"><h2>${esc(x.g?x.g.n:T('Keiner Gilde zugeordnet','No guild assigned'))}</h2><small>${x.list.length}${a.length<x.list.length?` · ${a.length} ${T('abgeglichen','aligned')}`:''}</small></summary>${wrap(a)}${quiet(q)}</details>`;}).join('')+'</div>';}
  list.innerHTML=hint+(shown.length?html:`<p class="rf-empty">${T('Noch keine Organisation abgeglichen. Schalte „Ohne Abgleich ausblenden“ aus, um alle zu sehen.','No organisation aligned yet. Switch off “Hide not aligned” to see all.')}</p>`)
    +(hide&&nHidden?`<p class="rf-note">${T(`${nHidden} Organisationen ohne Abgleich ausgeblendet.`,`${nHidden} organisations without alignment hidden.`)}</p>`:'');
  if(OPEN){const f=document.querySelector(`#view-rep [data-form="${CSS.escape(OPEN)}"] select`); if(f) f.focus();}}

/* ---------- events ---------- */
$r('load').addEventListener('click',()=>{if(typeof SZ!=='undefined') SZ.pick();});
document.addEventListener('sz:loaded',()=>{if(!document.getElementById('view-rep').classList.contains('hide')) render();});
const view=document.getElementById('view-rep');
view.addEventListener('click',e=>{const st=load(); let b;
  if((b=e.target.closest('[data-tog]'))){const o=b.dataset.tog; if(EXP.has(o)||OPEN===o){EXP.delete(o); if(OPEN===o) OPEN=null;} else EXP.add(o); render(); return;}
  if((b=e.target.closest('[data-fav]'))){const os=orgState(st,b.dataset.fav); os.fav=!os.fav; save(st); render(); return;}
  if((b=e.target.closest('[data-align]'))){OPEN=OPEN===b.dataset.align?null:b.dataset.align; if(OPEN) EXP.add(OPEN); render(); return;}
  if((b=e.target.closest('[data-undo]'))){const os=orgState(st,b.dataset.undo); const c=os.cals.pop(); save(st); render();
    $r('stat').textContent=c?T(`Abgleich vom ${fmtT(c.t)} entfernt.`,`Alignment of ${fmtT(c.t)} removed.`):''; return;}
  if(e.target.closest('[data-cancel]')){OPEN=null; render(); return;}
  if((b=e.target.closest('[data-shot]'))){b.parentElement.querySelector('[data-shotin]').click(); return;}
  if((b=e.target.closest('[data-mt]'))){showText(b.dataset.mt,b.dataset.mtt); return;}
  if((b=e.target.closest('[data-mtwhy]'))){showWhy(b.dataset.mtwhy); return;}
  // A click anywhere on the upper half of a card (not on a control) folds it in or out
  if((b=e.target.closest('[data-top]'))&&!e.target.closest('button,a,input,select,label')){const o=b.dataset.top; if(EXP.has(o)||OPEN===o){EXP.delete(o); if(OPEN===o) OPEN=null;} else EXP.add(o); render(); return;}
  if(e.target.closest('[data-snapend]')){try{localStorage.removeItem(PKEY);}catch(x){} render();}});
$r('handy').addEventListener('click',()=>{const d=handyData();
  if(!d.o.length){$r('stat').textContent=T('Noch keine Organisation abgeglichen – erst abgleichen, dann aufs Handy.','No organisation aligned yet – align first, then send to the phone.'); return;}
  HY.share('ruf',d,T('Ruf aufs Handy','Reputation to the phone'),T(`Rang und Balken von ${d.o.length} abgeglichenen Organisationen, Stand jetzt. Das Handy zeigt ihn nur an; für einen neuen Stand hier wieder scannen.`,`Rank and bar of ${d.o.length} aligned organisations, as of now. The phone only shows it; scan again here for a newer state.`));});
// Remember which overviews are open across re-renders
view.addEventListener('toggle',e=>{const d=e.target.closest&&e.target.closest('[data-ov]'); if(d){if(d.open) OVOPEN.add(d.dataset.ov); else OVOPEN.delete(d.dataset.ov);}},true);
const HKEY='scha_rep_hide', GKEY='scha_rep_gclosed';
// Guilds the player has folded in (remembered in the browser).
function gClosed(){try{return new Set(JSON.parse(localStorage.getItem(GKEY)||'[]'));}catch(e){return new Set();}}
view.addEventListener('toggle',e=>{const g=e.target.closest&&e.target.closest('[data-guild]'); if(!g||e.target!==g) return; const s=gClosed();
  if(g.open) s.delete(g.dataset.guild); else s.add(g.dataset.guild); try{localStorage.setItem(GKEY,JSON.stringify([...s]));}catch(x){}},true);
function hideOn(){try{return localStorage.getItem(HKEY)==='1';}catch(e){return false;}}
for(const r of document.querySelectorAll('#view-rep input[name="rf-view"]')) r.addEventListener('change',e=>{try{localStorage.setItem(VKEY,e.target.value);}catch(x){} render();});
$r('sort').addEventListener('change',e=>{try{localStorage.setItem(OKEY,e.target.value);}catch(x){} render();});
$r('hide').addEventListener('change',e=>{try{localStorage.setItem(HKEY,e.target.checked?'1':'0');}catch(x){} render();});
$r('texts').closest('label').addEventListener('click',()=>{if($r('texts').disabled){WHYTEXTS=true; textsBar();}});
$r('texts').addEventListener('change',e=>{try{localStorage.setItem(TKEY,e.target.checked?'1':'0');}catch(x){} render();});
view.addEventListener('change',e=>{const i=e.target.closest('[data-shotin]'); if(i&&i.files[0]) readShot(i.files[0],i.closest('form'));});
view.addEventListener('dragover',e=>{const z=e.target.closest('[data-drop]'); if(z){e.preventDefault(); z.classList.add('drag');}});
view.addEventListener('dragleave',e=>{const z=e.target.closest('[data-drop]'); if(z) z.classList.remove('drag');});
view.addEventListener('drop',e=>{const z=e.target.closest('[data-drop]'); if(!z) return; e.preventDefault(); z.classList.remove('drag');
  const f=[...(e.dataTransfer?.files||[])].find(f=>f.type.startsWith('image/')); if(f) readShot(f,z.closest('form'));});
// Several screenshots at once
$r('batch').addEventListener('click',()=>{BATCH=[]; $r('bres').innerHTML=''; $r('bstat').textContent=''; $r('bok').disabled=true; $r('bok').lastChild.textContent=T('Übernehmen','Apply'); $r('bdlg').showModal();});
$r('bfiles').addEventListener('click',()=>$r('bin').click());
$r('bdir').addEventListener('click',()=>$r('bdirin').click());
for(const id of ['bin','bdirin']) $r(id).addEventListener('change',e=>{const fs=[...e.target.files]; e.target.value=''; batchRead(fs);});
$r('bx').addEventListener('click',()=>{BSTOP=true; $r('bdlg').close();});
$r('bok').addEventListener('click',applyBatch);
$r('bres').addEventListener('change',e=>{const c=e.target.closest('[data-bi]'), s=e.target.closest('[data-bo]');
  if(c){BATCH[+c.dataset.bi].ok=c.checked; bCount();}
  if(s){BATCH[+s.dataset.bo].org=s.value; markBatch(); renderBatch();}});
const bz=document.querySelector('#rf-bdlg [data-bdrop]');
bz.addEventListener('dragover',e=>{e.preventDefault(); bz.classList.add('drag');});
bz.addEventListener('dragleave',()=>bz.classList.remove('drag'));
$r('bdlg').addEventListener('dragover',e=>e.preventDefault());
$r('bdlg').addEventListener('drop',e=>{e.preventDefault(); bz.classList.remove('drag'); batchRead(e.dataTransfer?.files||[]);});
view.addEventListener('submit',e=>{const f=e.target.closest('[data-form]'); if(!f) return; e.preventDefault();
  const o=f.dataset.form, l=ladder(o), x0=+f.rank.value, i=l.findIndex(r=>r[0]===x0), next=l[i+1];
  const pct=parseFloat(String(f.pct.value).replace(',','.')), err=f.querySelector('.rf-err');
  if(!(pct>=0&&pct<=100)){err.textContent=T('Bitte einen Wert von 0 bis 100 eintragen.','Please enter a value from 0 to 100.'); f.pct.focus(); return;}
  const t=f.t.value?new Date(f.t.value).toISOString():new Date().toISOString();
  const xp=x0+(next?(next[0]-x0)*pct/100:0), st=load(), os=orgState(st,o);
  os.cals.push({t,xp:Math.round(xp)}); os.cals.sort((a,b)=>a.t.localeCompare(b.t)); save(st); OPEN=null; render();
  $r('stat').textContent=T(`${o}: Abgleich gespeichert (${fmt(xp)} XP).`,`${o}: alignment saved (${fmt(xp)} XP).`);});

let started=false;
return {render(){if(!started){started=true; if(typeof SZ!=='undefined') SZ.start();} render();}, _missions:missions, _estimate:(o)=>estimate(o,missions(),load()), _band:band, handyData, fromHandy, _measure:measureShot, _interpret:interpret, _matchOrg:matchOrg, _titleCanvas:titleCanvas, _ocr:ocrWorker, _batchRead:files=>batchRead(files), _batch:()=>BATCH, _guildOf:o=>(guildOf(o)||{}).n||'', _orgName:orgName, _byRank:byRank, _iniText:iniText, _loadTexts:loadTexts};
})();

return {SZ,RF};
}
function show(t){tab=t==='sessions'?'sessions':'rep';
  node.querySelector('#view-rep').classList.toggle('hide',tab!=='rep'); node.querySelector('#view-sessions').classList.toggle('hide',tab!=='sessions');
  node.querySelectorAll('.ck-subtabs [data-t]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.t===tab)));
  if(tab==='rep') X.RF.render(); else X.SZ.render(); summary();}
// Short reputation state for the status board of the overview (aligned organisations with rank and estimate).
// Written a moment after every interaction, because reading the logs changes the estimate later.
function summary(){clearTimeout(sumTimer); sumTimer=setTimeout(()=>{try{const d=X.RF.handyData(); if(d&&d.o) localStorage.setItem('sc_cockpit_ruf',JSON.stringify(d));}catch(e){}},800);}
function start(el){
  const st=document.createElement('style'); st.textContent="\n  #view-sessions .sz-bar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:0 0 6px}\n  #view-sessions .sz-bar .btn{min-height:44px}\n  #view-sessions .sz-bar .btn.pri{background:var(--accent);border-color:var(--accent);color:var(--bg)}\n  #view-sessions .sz-stat{color:var(--muted);font-size:13px}\n  #view-sessions .sz-note{color:var(--muted);font-size:12.5px;margin:0 0 14px}\n  #view-sessions [hidden]{display:none!important}\n  #view-sessions .sz-hint{background:var(--panel2);border-left:4px solid var(--accent2);border-radius:0 8px 8px 0;padding:10px 12px;margin:4px 0 8px;font-size:14px}\n  #view-sessions .sz-hint code{font-size:12.5px;background:var(--panel);border:1px solid var(--line);border-radius:5px;padding:0 4px}\n  #view-sessions .sz-hint.loaded{display:none}\n  #view-sessions .sz-note code{font-size:12px;background:var(--panel2);border:1px solid var(--line);border-radius:5px;padding:0 4px}\n  #view-sessions .sz-last{border:2px solid var(--accent);border-radius:12px;padding:14px 16px;margin:0 0 18px;background:var(--panel2)}\n  #view-sessions .sz-last.crash{border-color:var(--bad)}\n  #view-sessions .sz-last h3{font-family:var(--disp);font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);margin:0 0 6px}\n  #view-sessions .sz-shard{font-family:ui-monospace,Consolas,monospace;font-size:clamp(17px,2.4vw,22px);font-weight:700;word-break:break-all}\n  #view-sessions .sz-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px 18px;margin-top:10px}\n  #view-sessions .sz-grid div small{display:block;font-size:11.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}\n  #view-sessions .sz-grid div b{font-family:var(--disp);font-size:16px}\n  #view-sessions .sz-end{display:inline-block;font-family:var(--disp);font-weight:700;font-size:13px;border-radius:6px;padding:2px 8px;border:1px solid var(--line)}\n  #view-sessions .sz-end.crash{color:var(--bad);border-color:var(--bad)}\n  #view-sessions .sz-end.ok{color:var(--ok);border-color:var(--ok)}\n  #view-sessions .sz-loc{font:inherit;font-family:var(--disp);font-weight:700;font-size:16px;color:var(--accent);background:none;border:0;padding:0;min-height:32px;cursor:pointer;text-decoration:underline;text-align:left}\n  #view-sessions .sz-copy{font:inherit;font-size:12.5px;min-height:32px;margin-left:8px;padding:0 10px;border-radius:8px;border:1px solid var(--line);background:var(--panel);color:var(--ink);cursor:pointer;vertical-align:middle}\n  #view-sessions table td{vertical-align:top}\n  #view-sessions details summary{cursor:pointer;color:var(--accent);min-height:28px}\n  #view-sessions details ol{margin:4px 0;padding-left:18px;font-size:12.5px}\n  #view-sessions .sz-shard .sz-id{display:block;font-size:12.5px;font-weight:400;color:var(--muted);margin-top:2px}\n  #view-sessions .sz-sn{font-family:ui-monospace,Consolas,monospace;font-size:13.5px}\n  #view-sessions .sz-mono{font-family:ui-monospace,Consolas,monospace;font-size:12.5px;word-break:break-all}\n  #view-sessions .sz-empty{color:var(--muted);padding:12px 2px}\n\n  #view-rep [hidden]{display:none!important}\n  #view-rep .rf-bar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:0 0 6px}\n  #view-rep .rf-bar .btn{min-height:44px}\n  #view-rep .btn.pri{background:var(--accent);border-color:var(--accent);color:var(--bg)}\n  #view-rep .rf-stat{color:var(--muted);font-size:13px}\n  #view-rep .rf-note{color:var(--muted);font-size:12.5px;margin:0 0 14px;max-width:80ch}\n  #view-rep .rf-org{border:1px solid var(--line);border-radius:12px;padding:12px 14px;margin:0;background:var(--panel);min-width:0}\n  /* Cards side by side: two or more per row on wide screens, one on narrow ones */\n  #view-rep .rf-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr));gap:10px;align-items:start}\n  #view-rep .rf-org{padding:8px 10px 10px}\n  #view-rep .rf-top{cursor:pointer}\n  #view-rep.rf-snapmode .rf-top{cursor:default}\n  #view-rep .rf-top .rf-head{flex-wrap:nowrap;align-items:center;gap:8px}\n  #view-rep .rf-top .rf-head h3{font-size:15px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n  #view-rep .rf-top .rf-star{min-width:40px;min-height:40px;font-size:16px}\n  #view-rep .rf-tog{font:inherit;font-size:15px;min-width:44px;min-height:40px;border:1px solid var(--line);border-radius:10px;background:var(--panel2);color:var(--accent);cursor:pointer;flex:0 0 auto}\n  #view-rep .rf-sub{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin:4px 0 0;font-size:13px}\n  #view-rep .rf-sub .rf-rank{font-size:13.5px}\n  #view-rep .rf-mini{display:inline-flex;gap:1px;flex-wrap:wrap}\n  #view-rep .rf-top .rf-track{margin:6px 0 3px;height:10px}\n  #view-rep .rf-top .rf-nums{font-size:12.5px}\n  #view-rep .rf-top .rf-nums b{font-size:13.5px}\n  #view-rep .rf-more{border-top:1px dashed var(--line);margin-top:8px;padding-top:4px}\n  #view-rep .rf-org.open{border-color:var(--accent)}\n  /* Guild colours: darker tones on the light theme (text contrast >= 4.5:1), the test tones on the dark one */\n  #view-rep{--g-tr:#1d64ad;--g-re:#7f5300;--g-me:#ad2f2b;--g-bo:#6c3fb8;--g-ac:#1c7038;--g-lo:#9a3672;--g-no:#5a6472}\n  :root[data-theme=\"dark\"] #view-rep{--g-tr:#3b8fe8;--g-re:#d9962b;--g-me:#d9534f;--g-bo:#9b6be0;--g-ac:#3baa5c;--g-lo:#c9609e;--g-no:#7a8696}\n  /* Guild colour: stripe on the left, light tint at the top of the card, coloured guild heading */\n  #view-rep .rf-org[style*=\"--gc\"]{border-left:5px solid var(--gc);background:linear-gradient(180deg,color-mix(in srgb,var(--gc) 14%,var(--panel)) 0,var(--panel) 70px)}\n  #view-rep .rf-guild[style*=\"--gc\"]{border-top:3px solid var(--gc)}\n  #view-rep .rf-guild[style*=\"--gc\"]>summary h2{color:var(--gc)}\n  #view-rep .rf-guild[style*=\"--gc\"]>summary::before{color:var(--gc)}\n  /* View bar: cards / list, order */\n  #view-rep .rf-viewbar{display:flex;gap:10px 16px;flex-wrap:wrap;align-items:center;margin:0 0 10px}\n  #view-rep .rf-seg{display:inline-flex;border:1px solid var(--line);border-radius:10px;overflow:hidden}\n  #view-rep .rf-seg label{display:inline-flex;align-items:center;gap:6px;min-height:40px;padding:0 14px;cursor:pointer;font-size:14px}\n  #view-rep .rf-seg label+label{border-left:1px solid var(--line)}\n  #view-rep .rf-seg label:has(input:checked){background:var(--panel2);color:var(--accent);font-weight:700}\n  #view-rep .rf-seg input{accent-color:var(--accent)}\n  #view-rep .rf-sel{display:inline-flex;align-items:center;gap:8px;font-size:14px}\n  #view-rep .rf-sel select{min-height:40px;font:inherit;font-size:14px;padding:0 8px;border-radius:8px;border:1px solid var(--line);background:var(--panel2);color:var(--ink)}\n  /* Small guilds share a row: each guild is as wide as its cards (up to four) */\n  #view-rep .rf-guilds{display:flex;flex-wrap:wrap;gap:4px 14px;align-items:flex-start}\n  #view-rep .rf-guilds>.rf-guild{flex:1 1 calc(var(--n,1) * 310px);min-width:min(100%,300px);max-width:100%;margin:0 0 8px}\n  #view-rep .rf-guilds.list>.rf-guild{flex-basis:100%}\n  #view-rep .rf-guild>summary{min-height:40px;padding:6px 0}\n  #view-rep .rf-favs{margin:0 0 12px;border-top:3px solid var(--accent)}\n  #view-rep .rf-favs>h2{font-family:var(--disp);font-size:15px;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);margin:8px 0}\n  #view-rep .rf-favs>h2 small,#view-rep .rf-flat>h2 small{font-size:12.5px;color:var(--muted);letter-spacing:0;text-transform:none;font-family:var(--body)}\n  /* Organisations without alignment: one line of names */\n  #view-rep .rf-quiet{display:flex;flex-wrap:wrap;gap:4px 6px;align-items:center;font-size:12.5px;color:var(--muted);margin:6px 0 2px}\n  #view-rep .rf-qn{font:inherit;font-size:12.5px;min-height:32px;padding:0 10px;border:1px solid var(--line);border-left:4px solid var(--gc);border-radius:8px;background:var(--panel2);color:var(--ink);cursor:pointer}\n  /* List view: one row per organisation */\n  #view-rep .rf-rows{display:flex;flex-direction:column;gap:4px}\n  #view-rep .rf-row{display:grid;grid-template-columns:26px minmax(140px,230px) minmax(100px,160px) minmax(100px,1fr) minmax(190px,300px) 44px;grid-template-areas:\"b n r x m t\";gap:4px 10px;align-items:center;min-height:44px;padding:2px 6px 2px 8px;border:1px solid var(--line);border-left:5px solid var(--gc);border-radius:8px;background:var(--panel);cursor:pointer}\n  #view-rep .rf-row.fav{border-color:var(--accent);border-left-color:var(--gc)}\n  #view-rep .rf-row>svg{grid-area:b}\n  #view-rep .rf-rn{grid-area:n;font-family:var(--disp);font-weight:700;font-size:14.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n  #view-rep .rf-row .rf-rank{grid-area:r;font-size:13px}\n  #view-rep .rf-row .rf-track{grid-area:x;margin:0;height:9px}\n  #view-rep .rf-rm{grid-area:m;font-size:12.5px;color:var(--muted);text-align:right;white-space:nowrap}\n  #view-rep .rf-row .rf-tog{grid-area:t;min-height:36px}\n  @media (max-width:720px){#view-rep .rf-row{grid-template-columns:26px 1fr auto 44px;grid-template-areas:\"b n r t\" \"x x x x\" \"m m m m\";padding:4px 6px 6px 8px}\n    #view-rep .rf-rm{text-align:left}}\n  /* Guild colour dot in the check list of the batch alignment */\n  #view-rep .rf-dot{display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--gc);margin-right:6px;vertical-align:middle}\n  #view-rep .rf-org.fav{border-color:var(--accent)}\n  #view-rep .rf-head{display:flex;gap:10px;align-items:baseline;flex-wrap:wrap}\n  #view-rep .rf-head h3{font-family:var(--disp);font-size:17px;letter-spacing:.04em;margin:0;flex:1 1 auto}\n  #view-rep .rf-rank{font-family:var(--disp);font-weight:700;font-size:14px;color:var(--accent);display:inline-flex;align-items:center;gap:8px}\n  #view-rep .rf-ladder{display:flex;gap:4px;flex-wrap:wrap;margin:8px 0 2px;padding:0;list-style:none}\n  #view-rep .rf-ladder li{display:flex;flex-direction:column;align-items:center;width:58px;font-size:10.5px;line-height:1.15;text-align:center;color:var(--muted);border:1px solid transparent;border-radius:8px;padding:3px 2px}\n  #view-rep .rf-ladder li.done{color:var(--ink)}\n  #view-rep .rf-ladder li.cur{border-color:var(--accent);color:var(--accent);font-weight:700}\n  #view-rep .rf-ladder li.next{border-style:dashed;border-color:var(--accent);color:var(--ink)}\n  #view-rep .rf-ladder li.later svg{opacity:.45}\n  #view-rep .rf-ladder li span{overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;hyphens:auto;overflow-wrap:anywhere}\n  #view-rep .rf-star{font:inherit;font-size:18px;min-width:44px;min-height:44px;border:1px solid var(--line);border-radius:10px;background:var(--panel2);color:var(--muted);cursor:pointer}\n  #view-rep .rf-star[aria-pressed=\"true\"]{color:var(--accent);border-color:var(--accent)}\n  #view-rep .rf-track{position:relative;height:14px;border-radius:7px;background:var(--panel2);border:1px solid var(--line);overflow:hidden;margin:10px 0 4px}\n  #view-rep .rf-fill{position:absolute;left:0;top:0;bottom:0;background:var(--accent)}\n  #view-rep .rf-unc{position:absolute;top:0;bottom:0;background:repeating-linear-gradient(135deg,var(--accent) 0 4px,transparent 4px 8px);opacity:.55}\n  #view-rep .rf-nums{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;font-size:13px}\n  #view-rep .rf-nums b{font-family:var(--disp);font-size:15px}\n  #view-rep .rf-meta{color:var(--muted);font-size:12.5px;margin:6px 0 0}\n  #view-rep .rf-meta .est{color:var(--warn,#c0841a)}\n  #view-rep .rf-acts{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}\n  #view-rep .rf-acts .btn{min-height:44px}\n  #view-rep .rf-form{border-top:1px dashed var(--line);margin-top:12px;padding-top:12px;display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px 14px;align-items:end}\n  #view-rep .rf-form label{display:flex;flex-direction:column;gap:4px;font-size:13px}\n  #view-rep .rf-form select,#view-rep .rf-form input{min-height:44px;font:inherit;padding:0 10px;border-radius:8px;border:1px solid var(--line);background:var(--panel2);color:var(--ink)}\n  #view-rep .rf-form .rf-help{grid-column:1/-1;color:var(--muted);font-size:12.5px;margin:0}\n  #view-rep .rf-form .rf-err{grid-column:1/-1;color:var(--bad);font-size:13px;margin:0}\n  #view-rep .rf-form .rf-btns{display:flex;gap:8px;flex-wrap:wrap}\n  #view-rep .rf-shot{grid-column:1/-1;display:flex;gap:12px;flex-wrap:wrap;align-items:center;border:2px dashed var(--line);border-radius:10px;padding:10px}\n  #view-rep .rf-shot.drag{border-color:var(--accent);background:var(--panel2)}\n  #view-rep .rf-shot .btn{min-height:44px}\n  #view-rep .rf-shot canvas{max-width:min(420px,100%);height:auto;border-radius:6px;border:1px solid var(--line)}\n  #view-rep .rf-shot .rf-res{flex:1 1 240px;font-size:13px;margin:0}\n  #view-rep .rf-shot .rf-res.bad{color:var(--bad)}\n  #view-rep details summary{cursor:pointer;color:var(--accent);min-height:32px;margin-top:6px}\n  #view-rep .rf-tag{display:inline-block;font-size:11.5px;border:1px solid var(--line);border-radius:6px;padding:0 6px;margin-left:4px}\n  #view-rep .rf-tag.fail{color:var(--bad);border-color:var(--bad)}\n  #view-rep .rf-empty{color:var(--muted);padding:12px 2px}\n  #view-rep .rf-toggle{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 10px;border:1px solid var(--line);border-radius:10px;cursor:pointer;font-size:14px}\n  #view-rep .rf-toggle input{width:20px;height:20px}\n  #view-rep .rf-guild{margin:0 0 14px;border-top:1px solid var(--line)}\n  #view-rep.rf-snapmode .rf-bar,#view-rep.rf-snapmode .rf-note{display:none}\n  #view-rep .rf-snap{display:flex;gap:10px;flex-wrap:wrap;align-items:center;justify-content:space-between;border:2px solid var(--accent);border-radius:12px;padding:10px 14px;margin:0 0 12px;background:var(--panel2);font-size:14px}\n  #view-rep .rf-snap .btn{min-height:44px}\n  #view-rep .rf-guild>summary{list-style:none;cursor:pointer;min-height:44px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:8px 0}\n  #view-rep .rf-guild>summary::-webkit-details-marker{display:none}\n  #view-rep .rf-guild>summary::before{content:\"▸\";color:var(--accent);font-size:16px;transition:transform .15s}\n  #view-rep .rf-guild[open]>summary::before{transform:rotate(90deg)}\n  #view-rep .rf-guild>summary h2{font-family:var(--disp);font-size:15px;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);margin:0}\n  #view-rep .rf-guild>summary small{font-size:12.5px;color:var(--muted)}\n  #view-rep .rf-guild>summary .rf-gd{flex-basis:100%;margin-left:26px}\n  #view-rep .rf-toggle.off{opacity:.55;cursor:not-allowed}\n  #view-rep .rf-lvl{margin:10px 0 0;border-left:4px solid var(--line);padding:2px 0 2px 10px}\n  #view-rep .rf-lvl h4{margin:0 0 4px;font-family:var(--disp);font-size:14px;display:flex;gap:8px;flex-wrap:wrap;align-items:baseline}\n  #view-rep .rf-lvl.done{border-left-color:var(--ok)}\n  #view-rep .rf-lvl.next{border-left-color:var(--accent);background:var(--panel2);border-radius:0 8px 8px 0}\n  #view-rep .rf-lvl.later{opacity:.7}\n  #view-rep .rf-lvl ul{list-style:none;margin:0;padding:0;columns:2 340px;column-gap:24px}\n  #view-rep .rf-lvl li{break-inside:avoid;display:flex;justify-content:space-between;gap:10px;font-size:13px;padding:3px 0;border-bottom:1px solid var(--line)}\n  #view-rep .rf-lvl li small{color:var(--muted);white-space:nowrap}\n  #view-rep [data-mtwhy]{cursor:help}\n  #view-rep .rf-mt{font:inherit;font-size:13px;color:var(--accent);background:none;border:0;padding:0;min-height:28px;text-align:left;cursor:pointer;text-decoration:underline}\n  #view-rep dialog{max-width:min(720px,92vw);max-height:84vh;border:1px solid var(--line);border-radius:12px;background:var(--panel);color:var(--ink);padding:16px 18px}\n  #view-rep dialog::backdrop{background:rgba(0,0,0,.55)}\n  #view-rep dialog h3{font-family:var(--disp);margin:0 0 10px}\n  #view-rep #rf-dlg-t{white-space:pre-wrap;font-size:14px;line-height:1.5;max-height:62vh;overflow:auto}\n  #view-rep dialog form{margin-top:12px;text-align:right}\n  #view-rep dialog .btn{min-height:44px}\n  #view-rep #rf-bdlg{max-width:min(980px,96vw);width:100%}\n  #view-rep .rf-bpick{display:flex;gap:10px;flex-wrap:wrap;align-items:center;border:2px dashed var(--line);border-radius:10px;padding:10px}\n  #view-rep .rf-bpick.drag{border-color:var(--accent);background:var(--panel2)}\n  #view-rep .rf-bpick p{flex-basis:100%;margin:0;font-size:13.5px}\n  #view-rep .rf-bpick small{color:var(--muted)}\n  #view-rep #rf-bstat{font-size:13.5px;margin:10px 0}\n  #view-rep #rf-bres{max-height:52vh;overflow:auto}\n  #view-rep #rf-bres td{font-size:13px;vertical-align:middle}\n  #view-rep #rf-bres tr.bad td:nth-child(3){color:var(--bad)}\n  #view-rep #rf-bres select{min-height:40px;font:inherit;font-size:13px;padding:0 6px;border-radius:8px;border:1px solid var(--line);background:var(--panel2);color:var(--ink);max-width:260px}\n  #view-rep #rf-bres input[type=checkbox]{width:22px;height:22px}\n  #view-rep .rf-bbtns{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;margin-top:12px}\n"; document.head.appendChild(st);
  node=document.createElement('div'); node.className='ck-pilot'; node.innerHTML=HEAD+"\n  <!-- Sessions from the game logs -->\n  <section class=\"panel hide\" id=\"view-sessions\">\n    <div class=\"sz-bar\">\n      <button type=\"button\" class=\"btn\" id=\"sz-pick\">📁 <span class=\"de\">Log-Ordner laden …</span><span class=\"en\">Load log folder …</span></button>\n      <button type=\"button\" class=\"btn\" id=\"sz-reload\" hidden>⟳ <span class=\"de\">Neu einlesen</span><span class=\"en\">Read again</span></button>\n      <button type=\"button\" class=\"btn\" id=\"sz-remember\" hidden>📌 <span class=\"de\">Ordner merken …</span><span class=\"en\">Remember folder …</span></button>\n      <input type=\"file\" id=\"sz-input\" webkitdirectory multiple hidden>\n      <span class=\"sz-stat\" id=\"sz-stat\" role=\"status\"></span>\n    </div>\n    <div class=\"sz-hint\" role=\"note\"><span class=\"de\"><b>Bei jedem Besuch neu laden:</b> Liegt Star Citizen unter <code>C:\\Programme</code> (Standard), kann sich der Browser den Ordner nicht merken – Chrome sperrt dort den dauerhaften Zugriff. Wähle dann bei jedem Besuch einmal „Log-Ordner laden …“ und den Ordner <code>…\\Roberts Space Industries\\StarCitizen\\LIVE</code> (oder <code>PTU</code>). Liegt Star Citizen woanders, verknüpft „Ordner merken …“ ihn dauerhaft.</span><span class=\"en\"><b>Load again on every visit:</b> If Star Citizen is installed under <code>C:\\Program Files</code> (the default), the browser cannot remember the folder – Chrome blocks lasting access there. Then choose “Load log folder …” once per visit and pick <code>…\\Roberts Space Industries\\StarCitizen\\LIVE</code> (or <code>PTU</code>). If Star Citizen is elsewhere, “Remember folder …” links it for good.</span></div>\n    <p class=\"sz-note\"><span class=\"de\">Chrome fragt beim Laden „Dateien hochladen?“: Die Dateien bleiben trotzdem auf deinem Rechner, die Seite liest nur <code>Game.log</code> und <code>logbackups</code> und sendet nichts. Die Logs enthalten deinen Spielernamen und Server-Adressen.</span><span class=\"en\">Chrome asks “Upload files?” when loading: the files still stay on your computer, the page only reads <code>Game.log</code> and <code>logbackups</code> and sends nothing. The logs contain your player name and server addresses.</span></p>\n    <div id=\"sz-last\"></div>\n    <div id=\"sz-list\"></div>\n  </section>\n\n  <!-- Reputation per organisation, estimated from the game logs -->\n  <section class=\"panel hide\" id=\"view-rep\">\n    <div class=\"rf-bar\">\n      <button type=\"button\" class=\"btn\" id=\"rf-load\">📁 <span class=\"de\">Log-Ordner laden …</span><span class=\"en\">Load log folder …</span></button>\n      <label class=\"rf-toggle\"><input type=\"checkbox\" id=\"rf-hide\"> <span class=\"de\">Ohne Abgleich ausblenden</span><span class=\"en\">Hide not aligned</span></label>\n      <label class=\"rf-toggle\"><input type=\"checkbox\" id=\"rf-texts\"> <span class=\"de\">Missionstexte anzeigen</span><span class=\"en\">Show mission texts</span></label>\n      <button type=\"button\" class=\"btn\" id=\"rf-batch\">📷 <span class=\"de\">Screenshots abgleichen …</span><span class=\"en\">Align from screenshots …</span></button>\n      <button type=\"button\" class=\"btn\" id=\"rf-handy\">📱 <span class=\"de\">Aufs Handy …</span><span class=\"en\">To the phone …</span></button>\n      <span class=\"rf-stat\" id=\"rf-stat\" role=\"status\"></span>\n    </div>\n    <div class=\"rf-viewbar\">\n      <span class=\"rf-seg\" role=\"radiogroup\" aria-label=\"Ansicht / View\">\n        <label><input type=\"radio\" name=\"rf-view\" value=\"cards\"> <span class=\"de\">Karten</span><span class=\"en\">Cards</span></label>\n        <label><input type=\"radio\" name=\"rf-view\" value=\"list\"> <span class=\"de\">Liste</span><span class=\"en\">List</span></label>\n      </span>\n      <label class=\"rf-sel\"><span class=\"de\">Ordnen:</span><span class=\"en\">Order:</span> <select id=\"rf-sort\"><option value=\"guild\"></option><option value=\"next\"></option></select></label>\n    </div>\n    <p class=\"rf-note\" id=\"rf-texts-note\" hidden></p>\n    <p class=\"rf-note\"><span class=\"de\">Das Spiel schreibt keine Ruf-Punkte ins Log. Der Reiter rechnet: <b>Stand aus deinem mobiGlas</b> + Ruf der danach abgeschlossenen Missionen (laut Missionsbeschreibung × Faktor). Gleiche einmal je Organisation ab, dann läuft der Balken mit. Gleicher Log-Ordner wie unter „Sitzungen“.</span><span class=\"en\">The game writes no reputation points to the log. This tab computes: <b>the state from your mobiGlas</b> + reputation of the missions completed afterwards (as stated in the mission description × factor). Align once per organisation, then the bar keeps up. Same log folder as under “Sessions”.</span></p>\n    <div id=\"rf-list\"></div>\n    <p class=\"rf-note\" id=\"rf-src\"></p>\n    <dialog id=\"rf-dlg\" aria-labelledby=\"rf-dlg-h\"><h3 id=\"rf-dlg-h\"></h3><div id=\"rf-dlg-t\"></div>\n      <form method=\"dialog\"><button class=\"btn\" value=\"x\">✕ <span class=\"de\">Schließen</span><span class=\"en\">Close</span></button></form></dialog>\n    <dialog id=\"rf-bdlg\" aria-labelledby=\"rf-bdlg-h\"><h3 id=\"rf-bdlg-h\"><span class=\"de\">Screenshots abgleichen</span><span class=\"en\">Align from screenshots</span></h3>\n      <div class=\"rf-bpick\" data-bdrop>\n        <p><span class=\"de\">Mehrere Screenshots der mobiGlas-Seite „Ruf“ auf einmal (je Organisation einer, Taste <b>Druck</b> im Spiel). Die Seite erkennt je Bild die Organisation, den erreichten Rang und den Balken; je Organisation zählt das neueste Bild. Du prüfst die Liste, dann übernimmst du sie. Das mobiGlas ist durchscheinend – vor dunklem Hintergrund aufgenommen klappt es am besten.</span><span class=\"en\">Several screenshots of the mobiGlas “Reputation” page at once (one per organisation, <b>Print</b> key in game). The page finds the organisation, the rank reached and the bar in each image; per organisation the newest image counts. You check the list, then apply it. The mobiGlas is translucent – it works best in front of a dark background.</span></p>\n        <button type=\"button\" class=\"btn\" id=\"rf-bfiles\">🖼 <span class=\"de\">Screenshots wählen …</span><span class=\"en\">Choose screenshots …</span></button>\n        <button type=\"button\" class=\"btn\" id=\"rf-bdir\">📁 <span class=\"de\">Ordner wählen …</span><span class=\"en\">Choose folder …</span></button>\n        <small class=\"de\">oder Bilder hierher ziehen · Ordner: <code>StarCitizen\\LIVE\\screenshots</code></small><small class=\"en\">or drop images here · folder: <code>StarCitizen\\LIVE\\screenshots</code></small>\n        <input type=\"file\" id=\"rf-bin\" accept=\"image/*\" multiple hidden><input type=\"file\" id=\"rf-bdirin\" webkitdirectory multiple hidden>\n      </div>\n      <p id=\"rf-bstat\" role=\"status\"></p>\n      <div id=\"rf-bres\"></div>\n      <div class=\"rf-bbtns\"><button type=\"button\" class=\"btn pri\" id=\"rf-bok\" disabled>✓ <span>Übernehmen</span></button>\n        <button type=\"button\" class=\"btn\" id=\"rf-bx\">✕ <span class=\"de\">Schließen</span><span class=\"en\">Close</span></button></div>\n    </dialog>\n  </section>\n";
  el.replaceChildren(node);
  // "To the phone" needs the phone module (HY) the cockpit page carries.
  const h=node.querySelector('#rf-handy'); if(h) h.hidden=typeof HY==='undefined';
  X=boot();
  node.querySelector('.ck-subtabs').addEventListener('click',e=>{const b=e.target.closest('[data-t]'); if(b) show(b.dataset.t);});
  node.addEventListener('click',summary); node.addEventListener('change',summary);
}
Cockpit.register('pilot',{render(el){if(!node) start(el); else if(node.parentNode!==el) el.replaceChildren(node);
  const it=Cockpit.intent; if(it&&it.tab){tab=it.tab; Cockpit.intent=null;}
  // A reputation state sent with "To the phone": the tab shows it as the state from the PC.
  if(it&&it.handy&&it.handy.kind==='ruf'){tab='rep'; Cockpit.intent=null; const bad=()=>Cockpit.toast(Cockpit.T('Der Link ist unvollständig oder beschädigt – bitte am PC neu erzeugen.','The link is incomplete or damaged – please create it again on the PC.'));
    if(typeof HY==='undefined') bad(); else HY._dec(it.handy.code).then(d=>{try{X.RF.fromHandy(d); summary();}catch(e){bad();}},bad);}
  show(tab);}});
})();
