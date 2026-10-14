/* Smith Asset Group: prime-time Deal Board. Mounts into #dealBoard. Data: deals.json (public). */
(function(){
  var mount = document.getElementById('dealBoard');
  if(!mount) return;
  var FORM_URL = 'https://formsubmit.co/ajax/smithassetgrp@gmail.com';

  var font = document.createElement('link');
  font.rel = 'stylesheet';
  font.href = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;1,700&display=swap';
  document.head.appendChild(font);

  var css = `
  .snf{--n0:#060b16;--n1:#0b1424;--n2:#111d33;--n3:#1a2944;--line:rgba(255,255,255,.10);--txt:#f4f6fb;--mut:#a9b4c8;--gold:#f2c14e;--lime:#c8f135;--red:#ff4d4d;
    position:relative; color:var(--txt); background:radial-gradient(1200px 500px at 15% -10%,rgba(255,255,255,.14),transparent 60%),radial-gradient(1000px 520px at 85% -12%,rgba(242,193,78,.16),transparent 60%),linear-gradient(180deg,var(--n1),var(--n0)); padding:56px 0 64px; overflow:hidden; isolation:isolate;}
  .snf::before{content:""; position:absolute; inset:0; z-index:-1; background:repeating-linear-gradient(90deg,transparent 0 119px,rgba(255,255,255,.035) 119px 120px); mask-image:linear-gradient(180deg,transparent,#000 30%,#000 70%,transparent);}
  .snf .sb-wrap{max-width:1160px; margin:0 auto; padding-inline:20px;}
  .snf h2,.snf .cond{font-family:"Barlow Condensed","Arial Narrow",Impact,sans-serif; text-transform:uppercase; letter-spacing:.02em; color:var(--txt);}
  .snf .sb-top{display:flex; flex-wrap:wrap; align-items:flex-end; justify-content:space-between; gap:18px;}
  .snf .sb-kick{display:flex; align-items:center; gap:10px; font:700 13px/1 "IBM Plex Sans",sans-serif; letter-spacing:.18em; text-transform:uppercase; color:var(--gold);}
  .snf .live{display:inline-flex; align-items:center; gap:7px; padding:5px 10px; border-radius:999px; background:rgba(255,77,77,.14); border:1px solid rgba(255,77,77,.5); color:#ffd6d6; letter-spacing:.14em;}
  .snf .live i{width:8px; height:8px; border-radius:50%; background:var(--red); box-shadow:0 0 0 0 rgba(255,77,77,.7); animation:sbpulse 1.6s infinite;}
  @keyframes sbpulse{0%{box-shadow:0 0 0 0 rgba(255,77,77,.6)}70%{box-shadow:0 0 0 10px rgba(255,77,77,0)}100%{box-shadow:0 0 0 0 rgba(255,77,77,0)}}
  .snf h2{font-size:clamp(44px,7vw,84px); line-height:.92; font-weight:800; margin:10px 0 0;}
  .snf h2 em{font-style:italic; color:var(--gold);}
  .snf .sb-sub{color:var(--mut); max-width:56ch; margin:12px 0 0; font-size:17px;}
  .snf .scores{display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:10px; min-width:min(460px,100%);}
  .snf .score{background:linear-gradient(180deg,var(--n3),var(--n2)); border:1px solid var(--line); border-radius:12px; padding:12px 14px; text-align:center; box-shadow:inset 0 1px 0 rgba(255,255,255,.06);}
  .snf .score b{display:block; font:800 44px/1 "Barlow Condensed",sans-serif; font-variant-numeric:tabular-nums; color:#fff;}
  .snf .score.av b{color:var(--lime);} .snf .score.uc b{color:var(--gold);}
  .snf .score span{display:block; margin-top:6px; font:600 11px/1.2 "IBM Plex Sans",sans-serif; letter-spacing:.16em; text-transform:uppercase; color:var(--mut);}
  .snf .ticker{margin-top:26px; border-top:1px solid var(--line); border-bottom:1px solid var(--line); background:rgba(0,0,0,.25); overflow:hidden; white-space:nowrap; position:relative;}
  .snf .ticker::before{content:"SAG WIRE"; position:absolute; left:0; top:0; bottom:0; z-index:2; display:flex; align-items:center; padding:0 14px; background:var(--gold); color:#1a1300; font:800 15px/1 "Barlow Condensed",sans-serif; letter-spacing:.08em;}
  .snf .ticker-run{display:inline-block; padding:11px 0 11px 120px; animation:sbtick 38s linear infinite; font:600 15px/1 "Barlow Condensed",sans-serif; letter-spacing:.06em; text-transform:uppercase; color:#dfe6f2;}
  .snf .ticker-run span{margin-right:42px;} .snf .ticker-run span b{color:var(--lime); margin-right:8px;}
  @keyframes sbtick{from{transform:translateX(0)}to{transform:translateX(-50%)}}
  @media (prefers-reduced-motion:reduce){ .snf .ticker-run{animation:none;} .snf .live i{animation:none;} }
  .snf .tabs{display:flex; gap:8px; margin:26px 0 16px; overflow-x:auto; -webkit-overflow-scrolling:touch; scrollbar-width:none;}
  .snf .tabs::-webkit-scrollbar{display:none;}
  .snf .tabs button{flex:none;}
  .snf .tabs button{appearance:none; border:1px solid var(--line); background:rgba(255,255,255,.04); color:var(--txt); padding:11px 18px; border-radius:10px; font:700 17px/1 "Barlow Condensed",sans-serif; letter-spacing:.08em; text-transform:uppercase; cursor:pointer;}
  .snf .tabs button.on{background:var(--gold); border-color:var(--gold); color:#1a1300;}
  .snf .filters{display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:10px; margin-bottom:14px;}
  @media (max-width:860px){ .snf .filters{grid-template-columns:1fr 1fr;} .snf .scores{min-width:100%;} }
  .snf label.fl{display:block; font:600 11px/1 "IBM Plex Sans",sans-serif; letter-spacing:.14em; text-transform:uppercase; color:var(--mut); margin-bottom:6px;}
  .snf select,.snf input,.snf textarea{width:100%; padding:11px 12px; font:400 16px/1.3 "IBM Plex Sans",sans-serif; color:var(--txt); background:var(--n2); border:1px solid var(--line); border-radius:10px;}
  .snf select:focus,.snf input:focus,.snf textarea:focus{outline:none; border-color:var(--gold); box-shadow:0 0 0 3px rgba(242,193,78,.2);}
  .snf textarea{min-height:88px; resize:vertical;}
  .snf .cnt{font-size:14px; color:var(--mut); margin:6px 0 16px;}
  .snf .grid{display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:18px;}
  @media (max-width:980px){ .snf .grid{grid-template-columns:repeat(2,minmax(0,1fr));} }
  @media (max-width:640px){ .snf .grid{grid-template-columns:1fr;} }
  .snf .dc{position:relative; background:linear-gradient(180deg,var(--n3),var(--n2)); border:1px solid var(--line); border-radius:14px; overflow:hidden; cursor:pointer; transition:transform .15s ease, border-color .15s ease, box-shadow .15s ease;}
  .snf .dc::before{content:""; position:absolute; inset:0 0 auto 0; height:3px; background:linear-gradient(90deg,var(--lime),var(--gold));}
  .snf .dc:hover,.snf .dc:focus-visible{transform:translateY(-3px); border-color:rgba(242,193,78,.5); box-shadow:0 18px 40px rgba(0,0,0,.45); outline:none;}
  .snf .dc .ph{aspect-ratio:16/9; background:radial-gradient(400px 140px at 50% 0,rgba(255,255,255,.12),transparent),linear-gradient(135deg,#1b2a47,#0f1a2e); display:flex; align-items:center; justify-content:center; color:#5d6d8c; position:relative;}
  .snf .dc .ph img{width:100%; height:100%; object-fit:cover;}
  .snf .dc .ph svg{width:52px; height:52px;}
  .snf .pill{position:absolute; top:12px; left:12px; font:800 13px/1 "Barlow Condensed",sans-serif; letter-spacing:.1em; text-transform:uppercase; padding:6px 9px; border-radius:6px; background:var(--lime); color:#132000;}
  .snf .pill.uc{background:var(--gold); color:#1a1300;} .snf .pill.sd{background:#5b6680; color:#fff;}
  .snf .jid{position:absolute; bottom:10px; right:12px; font:700 14px/1 "Barlow Condensed",sans-serif; letter-spacing:.08em; color:#cfd8ea; background:rgba(0,0,0,.45); padding:4px 8px; border-radius:6px;}
  .snf .dc .bd{padding:14px 16px 16px;}
  .snf .dc .pr{font:800 38px/1 "Barlow Condensed",sans-serif; color:#fff; font-variant-numeric:tabular-nums;}
  .snf .dc .pr small{font:600 12px/1 "IBM Plex Sans",sans-serif; letter-spacing:.14em; text-transform:uppercase; color:var(--mut); margin-left:8px;}
  .snf .dc .lc{font-weight:600; margin-top:6px;} .snf .dc .lc2{color:var(--mut); font-size:14px;}
  .snf .statline{display:grid; grid-template-columns:repeat(4,1fr); margin-top:12px; border:1px solid var(--line); border-radius:10px; overflow:hidden;}
  .snf .statline div{padding:8px 6px; text-align:center; border-right:1px solid var(--line);} .snf .statline div:last-child{border-right:0;}
  .snf .statline b{display:block; font:700 18px/1 "Barlow Condensed",sans-serif; font-variant-numeric:tabular-nums;}
  .snf .statline span{display:block; margin-top:4px; font:600 10px/1 "IBM Plex Sans",sans-serif; letter-spacing:.12em; text-transform:uppercase; color:var(--mut);}
  .snf .kick{grid-column:1/-1; text-align:center; padding:46px 20px; border:1px dashed rgba(242,193,78,.4); border-radius:16px; background:radial-gradient(600px 200px at 50% 0,rgba(242,193,78,.12),transparent);}
  .snf .kick .cond{font-size:clamp(34px,5vw,54px); font-weight:800; line-height:1; color:var(--gold);}
  .snf .kick p{color:var(--mut); max-width:52ch; margin:12px auto 18px;}
  .snf .btn{display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:13px 20px; border-radius:10px; border:1px solid transparent; font:800 18px/1 "Barlow Condensed",sans-serif; letter-spacing:.08em; text-transform:uppercase; cursor:pointer; text-decoration:none;}
  .snf .btn-gold{background:var(--gold); color:#1a1300;} .snf .btn-lime{background:var(--lime); color:#132000;}
  .snf .btn-ghost{background:transparent; color:#fff; border-color:rgba(255,255,255,.35);}
  .snf .pane{display:none;} .snf .pane.on{display:block;}
  .snf .formbox{background:linear-gradient(180deg,var(--n3),var(--n2)); border:1px solid var(--line); border-radius:16px; padding:22px;}
  .snf .g2{display:grid; grid-template-columns:1fr 1fr; gap:12px;} .snf .g2 .full{grid-column:1/-1;}
  @media (max-width:560px){ .snf .g2{grid-template-columns:1fr;} }
  .snf .formbox label:not(.ck){display:block; font:600 13px/1.2 "IBM Plex Sans",sans-serif; color:#dfe6f2; margin-bottom:6px;}
  .snf .ck{display:flex; gap:10px; align-items:flex-start; font-size:14px; color:var(--mut); margin-top:10px;}
  .snf .ck input{width:20px; height:20px; flex:none; margin-top:2px;}
  .snf .priv{margin-top:12px; border:1px solid rgba(242,193,78,.35); background:rgba(242,193,78,.06); border-radius:12px; padding:14px;}
  .snf .priv h4{margin:0 0 10px; font:700 16px/1 "Barlow Condensed",sans-serif; letter-spacing:.08em; text-transform:uppercase; color:var(--gold);}
  .snf .note{font-size:14px; color:var(--mut); margin-top:10px;} .snf .note.ok{color:var(--lime); font-weight:600;}
  .snf .req{color:var(--gold);}
  .snf .hp{position:absolute; left:-9999px; width:1px; height:1px; opacity:0;}
  .snf .split{display:grid; grid-template-columns:.9fr 1.1fr; gap:24px; align-items:start;}
  @media (max-width:900px){ .snf .split{grid-template-columns:1fr;} }
  .snf .plays{display:grid; gap:12px; margin-top:10px;}
  .snf .plays div{display:grid; grid-template-columns:40px 1fr; gap:12px; align-items:start;}
  .snf .plays i{font:800 26px/1 "Barlow Condensed",sans-serif; color:var(--gold); font-style:normal;}
  .snf .plays b{display:block; font:700 20px/1.1 "Barlow Condensed",sans-serif; letter-spacing:.04em; text-transform:uppercase;}
  .snf .plays span{color:var(--mut); font-size:15px;}
  .snf .fine{font-size:12.5px; color:#8794ad; margin-top:18px; line-height:1.55;}
  /* drawer */
  .sbd{position:fixed; inset:0; z-index:2600; display:none; color:#f4f6fb;}
  .sbd.open{display:block;}
  .sbd .shade{position:absolute; inset:0; background:rgba(3,6,12,.7);}
  .sbd .sheet{position:absolute; top:0; right:0; height:100%; width:min(760px,100%); overflow:auto; background:linear-gradient(180deg,#0b1424,#060b16); box-shadow:-20px 0 60px rgba(0,0,0,.5);}
  .sbd .sh{position:sticky; top:0; z-index:3; display:flex; justify-content:space-between; align-items:center; padding:12px 18px; background:rgba(6,11,22,.92); border-bottom:1px solid rgba(255,255,255,.1); backdrop-filter:blur(8px);}
  .sbd .sh span{font:700 16px/1 "Barlow Condensed",sans-serif; letter-spacing:.1em; text-transform:uppercase; color:#f2c14e;}
  .sbd .x{width:44px; height:44px; border-radius:10px; border:1px solid rgba(255,255,255,.25); background:transparent; color:#fff; font-size:22px; cursor:pointer;}
  .sbd .sbody{padding:20px 18px 40px;}
  .sbd .gal{aspect-ratio:16/9; border-radius:14px; background:radial-gradient(500px 160px at 50% 0,rgba(255,255,255,.12),transparent),linear-gradient(135deg,#1b2a47,#0f1a2e); display:flex; align-items:center; justify-content:center; color:#7d8db0; overflow:hidden; text-align:center; font-size:14px;}
  .sbd .gal img{width:100%; height:100%; object-fit:cover;}
  .sbd h3{font:800 clamp(30px,4.6vw,44px)/.95 "Barlow Condensed",sans-serif; text-transform:uppercase; margin:16px 0 6px; color:#fff;}
  .sbd .mut{color:#a9b4c8;}
  .sbd .board{display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:8px; margin:16px 0;}
  @media (max-width:640px){ .sbd .board{grid-template-columns:1fr 1fr;} }
  .sbd .board div{background:#111d33; border:1px solid rgba(255,255,255,.1); border-radius:10px; padding:10px 12px;}
  .sbd .board span{display:block; font:600 10.5px/1 "IBM Plex Sans",sans-serif; letter-spacing:.14em; text-transform:uppercase; color:#a9b4c8;}
  .sbd .board b{display:block; margin-top:6px; font:800 28px/1 "Barlow Condensed",sans-serif; font-variant-numeric:tabular-nums; color:#fff;}
  .sbd table{width:100%; border-collapse:collapse; font-size:15px; background:#0f1a2e; border:1px solid rgba(255,255,255,.1); border-radius:12px; overflow:hidden;}
  .sbd th,.sbd td{text-align:left; padding:9px 12px; border-bottom:1px solid rgba(255,255,255,.07);}
  .sbd th{width:44%; color:#a9b4c8; font-weight:500;}
  .sbd h4{font:700 20px/1 "Barlow Condensed",sans-serif; letter-spacing:.06em; text-transform:uppercase; color:#f2c14e; margin:22px 0 10px;}
  .sbd .amap{height:240px; border-radius:12px; border:1px solid rgba(255,255,255,.1); background:#0f1a2e;}
  .sbd .tabs2{display:flex; gap:8px; margin:20px 0 12px;}
  .sbd .tabs2 button{flex:1; padding:12px; border-radius:10px; border:1px solid rgba(255,255,255,.2); background:transparent; color:#fff; font:700 17px/1 "Barlow Condensed",sans-serif; letter-spacing:.08em; text-transform:uppercase; cursor:pointer;}
  .sbd .tabs2 button.on{background:#f2c14e; color:#1a1300; border-color:#f2c14e;}
  .sbd form .g2{display:grid; grid-template-columns:1fr 1fr; gap:10px;} .sbd form .full{grid-column:1/-1;}
  @media (max-width:560px){ .sbd form .g2{grid-template-columns:1fr;} }
  .sbd label{display:block; font:600 13px/1.2 "IBM Plex Sans",sans-serif; color:#dfe6f2; margin-bottom:6px;}
  .sbd input,.sbd select,.sbd textarea{width:100%; padding:11px 12px; font:16px/1.3 "IBM Plex Sans",sans-serif; color:#fff; background:#111d33; border:1px solid rgba(255,255,255,.14); border-radius:10px;}
  .sbd textarea{min-height:80px;}
  .sbd .ck{display:flex; gap:10px; align-items:flex-start; font-size:14px; color:#a9b4c8; font-weight:400;}
  .sbd .ck input{width:20px; height:20px; flex:none; margin-top:2px;}
  .sbd .btn{width:100%; margin-top:12px; padding:14px; border-radius:10px; border:0; font:800 19px/1 "Barlow Condensed",sans-serif; letter-spacing:.08em; text-transform:uppercase; cursor:pointer; background:#f2c14e; color:#1a1300;}
  .sbd .btn.lime{background:#c8f135; color:#132000;}
  .sbd .note{font-size:14px; color:#a9b4c8; margin-top:8px;} .sbd .note.ok{color:#c8f135; font-weight:600;}
  .sbd .req{color:#f2c14e;} .sbd .hp{position:absolute; left:-9999px; width:1px; height:1px; opacity:0;}
  .sbd .fine{font-size:12.5px; color:#8794ad; margin-top:16px; line-height:1.55;}
  `;
  var st = document.createElement('style'); st.id = 'deal-board-css'; st.textContent = css; document.head.appendChild(st);

  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function money(v){ return (v || v === 0) ? '$' + Number(v).toLocaleString('en-US') : null; }
  function short(v){ if(!(v || v === 0)) return '—'; v = Number(v); return v >= 1e6 ? '$' + (v/1e6).toFixed(1).replace(/\.0$/, '') + 'M' : (v >= 1e3 ? '$' + Math.round(v/1e3) + 'K' : '$' + v); }
  var HOUSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/></svg>';
  var onHome = /(^|\/)(index\.html)?$/.test(location.pathname);
  var BUY = onHome ? '#buy' : 'index.html#buy';

  mount.innerHTML =
    '<div class="sb-wrap">' +
      '<div class="sb-top"><div>' +
        '<div class="sb-kick"><span class="live"><i></i>Live</span> Prime-time off-market</div>' +
        '<h2>The SAG <em>Deal Board</em></h2>' +
        '<p class="sb-sub">Off-market deals from Smith Asset Group and our partner network across Augusta and the CSRA. Every inquiry runs through us, so sellers and sources stay protected.</p>' +
      '</div><div class="scores" aria-label="Deal scoreboard">' +
        '<div class="score av"><b id="sbAv">0</b><span>Available</span></div>' +
        '<div class="score uc"><b id="sbUc">0</b><span>Under contract</span></div>' +
        '<div class="score"><b id="sbCl">0</b><span>Closed</span></div>' +
      '</div></div>' +
      '<div class="ticker" aria-hidden="true"><div class="ticker-run" id="sbTick"></div></div>' +
      '<div class="tabs" role="tablist">' +
        '<button type="button" class="on" data-p="browse" role="tab" aria-selected="true">Browse deals</button>' +
        '<button type="button" data-p="post" role="tab" aria-selected="false">Post a deal</button>' +
        '<button type="button" data-p="alerts" role="tab" aria-selected="false">Get first look</button>' +
      '</div>' +
      '<div class="pane on" data-pane="browse">' +
        '<div class="filters">' +
          '<div><label class="fl" for="sbS">Status</label><select id="sbS"><option value="">All</option><option>Available</option><option>Under Contract</option><option>Closed</option></select></div>' +
          '<div><label class="fl" for="sbT">Type</label><select id="sbT"><option value="">All types</option></select></div>' +
          '<div><label class="fl" for="sbB">Beds</label><select id="sbB"><option value="0">Any</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option></select></div>' +
          '<div><label class="fl" for="sbM">Max price</label><select id="sbM"><option value="">No max</option><option>25000</option><option>50000</option><option>100000</option><option>200000</option></select></div>' +
          '<div><label class="fl" for="sbO">Sort</label><select id="sbO"><option value="new">Newest</option><option value="low">Price low-high</option><option value="high">Price high-low</option><option value="spread">Biggest spread</option></select></div>' +
        '</div>' +
        '<div class="cnt" id="sbCnt" aria-live="polite"></div>' +
        '<div class="grid" id="sbGrid"></div>' +
      '</div>' +
      '<div class="pane" data-pane="post"><div class="split">' +
        '<div><h2 style="font-size:clamp(34px,4.6vw,52px);">Got a deal? <em>Put it on the board.</em></h2>' +
          '<div class="plays">' +
            '<div><i>01</i><div><b>Submit it</b><span>Public numbers, plus private details only we see.</span></div></div>' +
            '<div><i>02</i><div><b>We review it</b><span>Street and area only. No owner, no seller, no poster contacts.</span></div></div>' +
            '<div><i>03</i><div><b>We run the buyers</b><span>Inquiries and offers come to us, then to you. Nobody goes around you.</span></div></div>' +
            '<div><i>04</i><div><b>Terms in writing</b><span>Fees and splits are agreed in writing before any buyer gets the address.</span></div></div>' +
          '</div></div>' +
        '<form class="formbox" id="sbPost" novalidate><input class="hp" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true"><div class="g2">' +
          '<div><label>Your name <span class="req">*</span></label><input name="Name" required></div>' +
          '<div><label>Your phone <span class="req">*</span></label><input name="Phone" type="tel" required></div>' +
          '<div><label>Email</label><input name="Email" type="email"></div>' +
          '<div><label>You are a <span class="req">*</span></label><select name="Role" required><option value="" disabled selected>Select one</option><option>Wholesaler</option><option>Licensed agent</option><option>Investor</option><option>Other</option></select></div>' +
          '<div class="full"><label>Street and area (public) <span class="req">*</span></label><input name="Street and area (public)" placeholder="e.g. Walton Way, Summerville, 30904" required></div>' +
          '<div><label>Asking / assignment price <span class="req">*</span></label><input name="Price" inputmode="numeric" placeholder="$" required></div>' +
          '<div><label>ARV</label><input name="ARV" inputmode="numeric" placeholder="$"></div>' +
          '<div><label>Est. repairs</label><input name="Repairs" inputmode="numeric" placeholder="$"></div>' +
          '<div><label>Beds / baths / sqft</label><input name="Beds baths sqft" placeholder="3 / 2 / 1,400"></div>' +
          '<div><label>Occupancy</label><select name="Occupancy"><option value="">Select</option><option>Vacant</option><option>Owner occupied</option><option>Tenant occupied</option></select></div>' +
          '<div><label>Close by</label><input name="Close by" placeholder="Date"></div>' +
          '<div class="full"><label>Condition &amp; notes (public)</label><textarea name="Public notes" placeholder="Roof, HVAC, foundation, anything a buyer should know"></textarea></div>' +
        '</div><div class="priv"><h4>&#128274; Private &middot; only Smith Asset Group sees this</h4><div class="g2">' +
          '<div class="full"><label>Full property address</label><input name="PRIVATE full address"></div>' +
          '<div class="full"><label>Contract status</label><select name="PRIVATE contract status"><option value="">Select</option><option>Under contract, assignable</option><option>Under contract, double close</option><option>Listing (agent)</option><option>Not yet under contract</option></select></div>' +
          '<div class="full"><label>Your terms (fee, split, access, deadlines)</label><textarea name="PRIVATE terms" style="min-height:70px"></textarea></div>' +
        '</div></div>' +
        '<label class="ck"><input type="checkbox" name="Agrees to routing" value="Yes" required> I have the right to market this deal, and I agree Smith Asset Group handles buyer inquiries for it. <span class="req">*</span></label>' +
        '<button class="btn btn-gold" type="submit" style="width:100%;margin-top:14px;">Submit for review</button>' +
        '<p class="note">Reviewed before it posts. Your name and contacts are never published.</p></form>' +
      '</div></div>' +
      '<div class="pane" data-pane="alerts"><div class="kick" style="text-align:left;">' +
        '<div class="cond">Get the first look.</div>' +
        '<p style="margin-left:0;">Our buyer list sees new contracts before they ever hit the board. Tell us your buy box once and we\'ll text or email you the deals that fit.</p>' +
        '<a class="btn btn-lime" href="' + BUY + '">Join the buyer list</a>' +
      '</div></div>' +
      '<p class="fine">Smith Asset Group LLC markets its contract interests and coordinates inquiries for partner deals; it is not acting as a real estate broker. Details come from county records and the deal source and must be verified by the buyer. Full addresses and access are released only to verified buyers who agree not to contact owners, sellers, or deal sources directly. Not an offer where prohibited.</p>' +
    '</div>';

  var drawer = document.createElement('div');
  drawer.className = 'sbd'; drawer.setAttribute('aria-hidden', 'true');
  drawer.innerHTML = '<div class="shade" data-x></div><div class="sheet" role="dialog" aria-modal="true" aria-label="Deal details"><div class="sh"><span id="sbdId"></span><button class="x" type="button" data-x aria-label="Close">&times;</button></div><div class="sbody" id="sbdBody"></div></div>';
  document.body.appendChild(drawer);

  var deals = [], byId = {};
  var $ = function(id){ return document.getElementById(id); };
  var F = {s:$('sbS'), t:$('sbT'), b:$('sbB'), m:$('sbM'), o:$('sbO')};
  function spread(d){ return (d.arv && d.price) ? d.arv - d.price - (d.repairs || 0) : null; }
  function pillClass(s){ s = (s || '').toLowerCase(); return s.indexOf('contract') > -1 ? 'uc' : ((s === 'closed' || s === 'sold') ? 'sd' : ''); }

  function card(d){
    var ph = (d.photos && d.photos.length) ? '<img src="' + esc(d.photos[0]) + '" alt="" loading="lazy">' : HOUSE;
    return '<article class="dc" tabindex="0" role="button" data-id="' + esc(d.id) + '" aria-label="' + esc(d.headline || d.id) + '">' +
      '<div class="ph">' + ph + '<span class="pill ' + pillClass(d.status) + '">' + esc(d.status) + '</span><span class="jid">' + esc(d.id) + '</span></div>' +
      '<div class="bd"><div class="pr">' + (money(d.price) || 'Call') + '<small>' + esc(d.priceLabel || 'Asking') + '</small></div>' +
      '<div class="lc">' + esc(d.street) + (d.area ? ', ' + esc(d.area) : '') + '</div>' +
      '<div class="lc2">' + esc(d.city) + ', ' + esc(d.state) + ' ' + esc(d.zip) + ' &middot; ' + esc(d.propertyType || '') + '</div>' +
      '<div class="statline"><div><b>' + short(d.arv) + '</b><span>ARV</span></div><div><b>' + short(d.repairs) + '</b><span>Repairs</span></div><div><b>' + (d.beds != null ? d.beds : '—') + '/' + (d.baths != null ? d.baths : '—') + '</b><span>Bd/Ba</span></div><div><b>' + (d.sqft ? Number(d.sqft).toLocaleString('en-US') : '—') + '</b><span>Sq ft</span></div></div>' +
      '</div></article>';
  }

  function render(){
    var list = deals.filter(function(d){
      if(F.s.value && d.status !== F.s.value) return false;
      if(F.t.value && d.propertyType !== F.t.value) return false;
      if(+F.b.value && !(d.beds >= +F.b.value)) return false;
      if(F.m.value && !(d.price <= +F.m.value)) return false;
      return true;
    });
    list.sort(function(a, b){
      if(F.o.value === 'low') return (a.price || 9e15) - (b.price || 9e15);
      if(F.o.value === 'high') return (b.price || 0) - (a.price || 0);
      if(F.o.value === 'spread') return (spread(b) || -9e15) - (spread(a) || -9e15);
      return String(b.posted || '').localeCompare(String(a.posted || ''));
    });
    var c = function(fn){ return deals.filter(fn).length; };
    countUp($('sbAv'), c(function(d){ return d.status === 'Available'; }));
    countUp($('sbUc'), c(function(d){ return /contract/i.test(d.status || ''); }));
    countUp($('sbCl'), c(function(d){ return /closed|sold/i.test(d.status || ''); }));
    $('sbCnt').textContent = deals.length ? (list.length + ' of ' + deals.length + ' deals shown') : '';
    if(!deals.length){
      $('sbGrid').innerHTML = '<div class="kick"><div class="cond">Kickoff soon.</div><p>No public deals on the board right now. New contracts go to our buyer list first, then land here. Get on the list so you don\'t miss the next one.</p><a class="btn btn-lime" href="' + BUY + '">Get first look</a> <button class="btn btn-ghost" type="button" data-go="post">Post a deal</button></div>';
    } else {
      $('sbGrid').innerHTML = list.length ? list.map(card).join('') : '<div class="kick"><div class="cond">No matches.</div><p>Nothing fits those filters right now. Join the buyer list and we\'ll send the next one that does.</p><a class="btn btn-lime" href="' + BUY + '">Get first look</a></div>';
    }
    var items = deals.slice(0, 8).map(function(d){ return '<span><b>' + esc(d.status) + '</b>' + esc(d.street) + ' &middot; ' + esc(d.area || d.city) + ' &middot; ' + (money(d.price) || 'Call') + '</span>'; });
    if(!items.length) items = ['<span><b>Board</b>New deals hit the buyer list first</span>', '<span><b>Sellers</b>Cash offers, no repairs, no commissions</span>', '<span><b>Wholesalers</b>Post a deal, keep your source</span>', '<span><b>Agents</b>Bring a buyer or a seller, terms in writing</span>', '<span><b>Augusta</b>Richmond &middot; Columbia &middot; Aiken</span>'];
    var run = items.join('');
    $('sbTick').innerHTML = run + run;
  }
  function countUp(el, n){
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce || n === 0){ el.textContent = n; return; }
    var t0 = null; function step(t){ if(!t0) t0 = t; var k = Math.min(1, (t - t0) / 700); el.textContent = Math.round(n * k); if(k < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }

  var amap = null;
  function openDeal(id, push){
    var d = byId[id]; if(!d) return;
    if(push !== false) history.replaceState(null, '', '#deal-' + id);
    $('sbdId').textContent = d.id + ' · ' + (d.status || '');
    var sp = spread(d);
    var board = [['Asking', money(d.price) || 'Call'], ['ARV', money(d.arv) || 'Ask'], ['Repairs', money(d.repairs) || 'Ask'], sp !== null ? ['Spread', money(sp)] : ['County value', money(d.countyValue) || 'n/a']];
    var facts = [['Property type', d.propertyType], ['Beds / baths', (d.beds != null ? d.beds : '?') + ' / ' + (d.baths != null ? d.baths : '?')], ['Living area', d.sqft ? Number(d.sqft).toLocaleString('en-US') + ' sq ft' : null], ['Year built', d.yearBuilt], ['Lot', d.lotAcres ? d.lotAcres + ' acres' : null], ['Zoning', d.zoning], ['Condition', d.condition], ['Occupancy', d.occupancy], ['Rent (est.)', money(d.rent)], ['Close by', d.closeBy], ['Earnest money', money(d.emd)], ['Access', d.access]];
    var gal = (d.photos && d.photos.length) ? '<img src="' + esc(d.photos[0]) + '" alt="Property photo">' : '<div>' + HOUSE.replace('<svg', '<svg style="width:60px;height:60px;display:block;margin:0 auto 6px"') + 'Photos shared with verified buyers</div>';
    var common = '<input class="hp" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '<div><label>Full name <span class="req">*</span></label><input name="Name" required></div>' +
      '<div><label>Mobile phone <span class="req">*</span></label><input name="Phone" type="tel" required></div>' +
      '<div><label>Email <span class="req">*</span></label><input name="Email" type="email" required></div>' +
      '<div><label>Company / LLC</label><input name="Company"></div>';
    var consent = '<label class="ck full"><input type="checkbox" name="Non-circumvent" value="Agreed" required> I agree not to contact the owner, seller, or deal source directly, and to work this deal through Smith Asset Group. <span class="req">*</span></label>' +
      '<label class="ck full"><input type="checkbox" name="SMS consent" value="Yes"> (Optional) Smith Asset Group LLC may call or text me at this number about deals, including by automated means. Consent is not a condition of purchase. Msg &amp; data rates may apply. Reply STOP to opt out.</label>';
    $('sbdBody').innerHTML = '<div class="gal">' + gal + '</div>' +
      '<h3>' + esc(d.headline || (d.street + ', ' + d.city)) + '</h3>' +
      '<div class="mut">' + esc([d.street, d.area].filter(Boolean).join(' · ')) + ' &middot; ' + esc(d.city) + ', ' + esc(d.state) + ' ' + esc(d.zip) + ' &middot; <b style="color:#fff">Full address after verification</b></div>' +
      '<div class="board">' + board.map(function(n){ return '<div><span>' + esc(n[0]) + '</span><b>' + esc(n[1]) + '</b></div>'; }).join('') + '</div>' +
      (d.summary ? '<p class="mut">' + esc(d.summary) + '</p>' : '') +
      '<h4>Property facts</h4><table>' + facts.map(function(r){ return '<tr><th>' + esc(r[0]) + '</th><td>' + (r[1] == null || r[1] === '' ? '<span class="mut">Ask</span>' : esc(r[1])) + '</td></tr>'; }).join('') + '</table>' +
      '<h4>General area</h4><div class="amap" id="sbdMap"></div><p class="fine" style="margin-top:6px">Circle shows the general area only, not the lot.</p>' +
      '<div class="tabs2"><button type="button" class="on" data-t="req">Request details</button><button type="button" data-t="offer">Make an offer</button></div>' +
      '<form data-k="req" novalidate><div class="g2">' + common +
        '<div><label>Buyer type <span class="req">*</span></label><select name="Buyer type" required><option value="" disabled selected>Select</option><option>Cash buyer / flipper</option><option>Landlord / buy-and-hold</option><option>Wholesaler</option><option>Agent with a buyer</option></select></div>' +
        '<div><label>Proof of funds</label><select name="Proof of funds"><option>Can send POF now</option><option>Hard money / lender letter</option><option>Not yet</option></select></div>' +
        '<div class="full"><label>Anything else?</label><textarea name="Message" placeholder="Questions, timeline, walkthrough request"></textarea></div>' + consent +
      '</div><button class="btn" type="submit">Request address &amp; access</button><p class="note">Verified buyers get the full address, photos, and access, usually same day.</p></form>' +
      '<form data-k="offer" novalidate hidden><div class="g2">' + common +
        '<div><label>Offer price <span class="req">*</span></label><input name="Offer price" inputmode="numeric" placeholder="$" required></div>' +
        '<div><label>Earnest money</label><input name="EMD" inputmode="numeric" placeholder="$"></div>' +
        '<div><label>Close by</label><input name="Close by" placeholder="Date"></div>' +
        '<div><label>Funding</label><select name="Funding"><option>Cash</option><option>Hard money</option><option>Private money</option><option>Other</option></select></div>' +
        '<div class="full"><label>Terms or notes</label><textarea name="Message"></textarea></div>' + consent +
      '</div><button class="btn lime" type="submit">Send offer</button><p class="note">Offers go to Smith Asset Group only. We answer with an acceptance, a counter, or questions.</p></form>' +
      '<p class="fine">Smith Asset Group LLC is marketing its contract position (or a partner\'s, with permission). All inquiries and offers are handled by Smith Asset Group. Info from county records and the deal source; buyer to verify everything.</p>';
    drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
    var body = $('sbdBody');
    body.querySelectorAll('.tabs2 button').forEach(function(b){ b.addEventListener('click', function(){
      body.querySelectorAll('.tabs2 button').forEach(function(x){ x.classList.toggle('on', x === b); });
      body.querySelectorAll('form').forEach(function(fm){ fm.hidden = fm.getAttribute('data-k') !== b.getAttribute('data-t'); });
    }); });
    body.querySelectorAll('form').forEach(function(fm){ fm.addEventListener('submit', function(e){
      e.preventDefault(); var k = fm.getAttribute('data-k');
      send(fm, (k === 'offer' ? 'OFFER on ' : 'Details request: ') + d.id + ' (' + d.street + ')', {'Deal ID': d.id, 'Deal': d.street + ', ' + d.city + ' ' + d.zip}, k === 'offer' ? 'Offer received. We will respond shortly.' : 'Request received. We will verify you and send full details, usually same day.');
    }); });
    setTimeout(function(){
      if(!window.L || !d.approxLat) return;
      if(amap){ amap.remove(); amap = null; }
      amap = L.map('sbdMap', {center:[d.approxLat, d.approxLng], zoom:14, scrollWheelZoom:false});
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {maxZoom:17, subdomains:'abcd', attribution:'&copy; OpenStreetMap &copy; CARTO'}).addTo(amap);
      L.circle([d.approxLat, d.approxLng], {radius:450, color:'#f2c14e', weight:2, fillColor:'#f2c14e', fillOpacity:.14}).addTo(amap);
    }, 80);
  }
  function closeDeal(){ drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; if(/^#deal-/.test(location.hash)) history.replaceState(null, '', location.pathname + location.search + '#deals'); }

  function send(form, subject, extra, okText){
    var note = form.querySelector('.note');
    if(!form.checkValidity()){ form.reportValidity(); return; }
    if(form.querySelector('[name="_honey"]').value) return;
    var data = {};
    Array.prototype.forEach.call(form.elements, function(el){
      if(!el.name || el.name === '_honey') return;
      if(el.type === 'checkbox'){ data[el.name] = el.checked ? (el.value || 'Yes') : 'No'; return; }
      if((el.value || '').trim()) data[el.name] = el.value.trim();
    });
    for(var k in extra) data[k] = extra[k];
    data._subject = subject; data._template = 'table'; data._captcha = 'false'; data['Submitted from'] = location.href;
    var btn = form.querySelector('button[type="submit"]'), label = btn.textContent;
    btn.disabled = true; btn.textContent = 'Sending...';
    fetch(FORM_URL, {method:'POST', headers:{'Content-Type':'application/json', 'Accept':'application/json'}, body:JSON.stringify(data)})
      .then(function(r){ return r.json(); })
      .then(function(res){ if(res && String(res.success) === 'true'){ form.reset(); btn.textContent = 'Sent!'; note.textContent = okText; note.classList.add('ok'); } else throw new Error('x'); })
      .catch(function(){ btn.disabled = false; btn.textContent = label; note.innerHTML = 'Our form hit a snag. Call or text <a href="tel:+17622154466" style="color:#f2c14e">(762) 215-4466</a>.'; });
  }

  function showPane(p){
    mount.querySelectorAll('.tabs button').forEach(function(b){ var on = b.getAttribute('data-p') === p; b.classList.toggle('on', on); b.setAttribute('aria-selected', on ? 'true' : 'false'); });
    mount.querySelectorAll('.pane').forEach(function(x){ x.classList.toggle('on', x.getAttribute('data-pane') === p); });
  }
  mount.addEventListener('click', function(e){
    var t = e.target.closest('.tabs button'); if(t){ showPane(t.getAttribute('data-p')); return; }
    var g = e.target.closest('[data-go]'); if(g){ showPane(g.getAttribute('data-go')); return; }
    var c = e.target.closest('.dc'); if(c) openDeal(c.getAttribute('data-id'));
  });
  mount.addEventListener('keydown', function(e){ if((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('dc')){ e.preventDefault(); openDeal(e.target.getAttribute('data-id')); } });
  drawer.addEventListener('click', function(e){ if(e.target.closest('[data-x]')) closeDeal(); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && drawer.classList.contains('open')) closeDeal(); });
  Object.keys(F).forEach(function(k){ F[k].addEventListener('change', render); });
  $('sbPost').addEventListener('submit', function(e){ e.preventDefault(); send(this, 'NEW DEAL SUBMISSION: ' + (this.querySelector('[name="Street and area (public)"]').value || ''), {'Submission type': 'Deal for the board'}, 'Thanks! We review every deal and reach out before anything posts.'); });
  if(location.hash === '#post-a-deal'){ showPane('post'); }

  render();
  fetch('deals.json?v=' + Date.now()).then(function(r){ return r.json(); }).then(function(j){
    deals = ((j && j.deals) || []).filter(function(d){ return d && d.id && d.status; });
    deals.forEach(function(d){ byId[d.id] = d; });
    var types = {}; deals.forEach(function(d){ if(d.propertyType) types[d.propertyType] = 1; });
    Object.keys(types).forEach(function(t){ var o = document.createElement('option'); o.textContent = t; F.t.appendChild(o); });
    render();
    var m = location.hash.match(/^#deal-(.+)$/); if(m && byId[m[1]]) openDeal(m[1], false);
  }).catch(function(){ render(); });
})();
