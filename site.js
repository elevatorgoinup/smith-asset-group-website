/* Smith Asset Group shared site script: frame protection + mobile menu */
// Refuse to run inside another site's frame (clickjacking protection; GitHub Pages can't send frame headers).
if (window.top !== window.self) { try { window.top.location.replace(window.self.location.href); } catch (e) { document.documentElement.style.visibility = 'hidden'; } }
(function(){
  var st = document.createElement('style'); st.id = 'mnav-css';
  st.textContent = ".mnav-btn{display:none; align-items:center; justify-content:center; width:44px; height:44px; margin-left:6px; border-radius:10px; border:1px solid var(--border); background:transparent; color:var(--text); cursor:pointer; font-size:22px; line-height:1;}\n.mnav-panel{position:fixed; inset:0; z-index:3000; background:rgba(8,10,6,.55); display:none;}\n.mnav-panel.open{display:block;}\n.mnav-sheet{position:absolute; top:0; right:0; width:min(320px,86vw); height:100%; background:var(--surface,#1a1d15); border-left:1px solid var(--border); padding:18px 16px 28px; display:flex; flex-direction:column; gap:2px; overflow:auto; box-shadow:-10px 0 30px rgba(0,0,0,.25);}\n.mnav-top{display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;}\n.mnav-top strong{font-size:17px; color:var(--text);}\n.mnav-close{width:44px; height:44px; border-radius:10px; border:1px solid var(--border); background:transparent; color:var(--text); font-size:22px; cursor:pointer;}\n.mnav-sheet a.mnav-link{display:block; padding:14px 12px; font-size:17px; color:var(--text); border-radius:10px; text-decoration:none;}\n.mnav-sheet a.mnav-link:hover,.mnav-sheet a.mnav-link:focus-visible{background:rgba(127,127,127,.12);}\n.mnav-sheet a.mnav-link.is-here{color:var(--lime); font-weight:600;}\n.mnav-cta{margin-top:14px; display:block; text-align:center; padding:14px; border-radius:10px; font-weight:700; background:var(--lime); color:var(--lime-ink) !important; text-decoration:none;}\n.mnav-call{margin-top:8px; display:block; text-align:center; padding:13px; border-radius:10px; border:1px solid var(--border); color:var(--text) !important; text-decoration:none;}\n@media (max-width:760px){\n  header.site nav.links > a:not(:last-child){display:none !important;}\n  header.site nav.links{gap:8px !important; flex-wrap:nowrap;}\n  .mnav-btn{display:inline-flex;}\n}\n";
  document.head.appendChild(st);
})();
(function(){
  var nav = document.querySelector('header.site nav.links');
  if(!nav) return;
  var path = location.pathname.split('/').pop() || 'index.html';
  var onHome = (path === 'index.html' || path === '');
  var H = onHome ? '' : 'index.html';
  var items = [
    ['Home', onHome ? '#top' : 'index.html'],
    ['Property Map Lookup', H + '#parcelLookup'],
    ['Sell My House', H + '#sell'],
    ["I'm a Buyer", H + '#buy'],
    ["I'm an Agent", 'agents.html'],
    ['Seller FAQ', H + '#faq'],
    ['Deal Board', H + '#deals'],
    ['Contract Vault', 'vault.html'],
    ['Academy', 'academy.html'],
    ['Member Grade', 'grade.html']
  ];
  if(onHome && !document.getElementById('top')){ document.body.id = document.body.id || 'top'; }
  var btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'mnav-btn'; btn.setAttribute('aria-label', 'Open menu'); btn.setAttribute('aria-expanded', 'false'); btn.innerHTML = '&#9776;';
  nav.appendChild(btn);
  var panel = document.createElement('div');
  panel.className = 'mnav-panel'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Site menu');
  var html = '<div class="mnav-sheet"><div class="mnav-top"><strong>Smith Asset Group</strong><button type="button" class="mnav-close" aria-label="Close menu">&times;</button></div>';
  items.forEach(function(it){
    var here = (it[1] === path) ? ' is-here' : '';
    html += '<a class="mnav-link' + here + '" href="' + it[1] + '">' + it[0] + '</a>';
  });
  html += '<a class="mnav-cta" href="' + H + '#sell">Get My Cash Offer</a><a class="mnav-call" href="tel:+17622154466">Call or text (762) 215-4466</a></div>';
  panel.innerHTML = html;
  document.body.appendChild(panel);
  function open(){ panel.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; }
  function close(){ panel.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }
  btn.addEventListener('click', open);
  panel.addEventListener('click', function(e){ if(e.target === panel || e.target.closest('.mnav-close') || e.target.closest('a')) close(); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') close(); });
})();
/* Installable app: register the service worker (works on https only). */
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', function () { navigator.serviceWorker.register('/sw.js').catch(function () {}); });
}
