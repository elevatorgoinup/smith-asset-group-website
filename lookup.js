/* Smith Asset Group: Richmond County address -> parcel lookup.
   Order: county parcel records (exact number + street) -> same house number, closest street spelling
   -> county address locator -> nothing. Returns {pin} for one parcel or {pins:[...]} for a short list. */
(function (root) {
  var ABBR = {STREET:'ST', STR:'ST', AVENUE:'AVE', AV:'AVE', DRIVE:'DR', ROAD:'RD', LANE:'LN', COURT:'CT', CIRCLE:'CIR', PLACE:'PL',
    BOULEVARD:'BLVD', TERRACE:'TER', PARKWAY:'PKWY', HIGHWAY:'HWY', TRAIL:'TRL', CROSSING:'XING', POINT:'PT', SQUARE:'SQ', COVE:'CV',
    BEND:'BND', RIDGE:'RDG', EXTENSION:'EXT', HILL:'HL', HILLS:'HLS', CREEK:'CRK', GLEN:'GLN', CRESCENT:'CRES', TRACE:'TRCE', VIEW:'VW',
    VISTA:'VIS', LANDING:'LNDG', MANOR:'MNR', ESTATES:'ESTS', HEIGHTS:'HTS', PLAZA:'PLZ', COMMON:'CMN', GREEN:'GRN', ALLEY:'ALY',
    NORTH:'N', SOUTH:'S', EAST:'E', WEST:'W', NORTHEAST:'NE', NORTHWEST:'NW', SOUTHEAST:'SE', SOUTHWEST:'SW', APARTMENT:'APT', SUITE:'STE'};
  var TYPES = {}; 'ST AVE DR RD LN CT CIR PL BLVD TER PKWY HWY TRL WAY LOOP RUN PATH XING PT SQ CV BND RDG PASS WALK ROW EXT HL HLS CRK GLN CRES PIKE TRCE VW VIS LNDG CRSE MNR ESTS HTS PARK PLZ CMN GRN CLB ALY SPUR'.split(' ').forEach(function (t) { TYPES[t] = 1; });
  var DIRS = {N:1, S:1, E:1, W:1, NE:1, NW:1, SE:1, SW:1};
  var CITY = /^(AUGUSTA|HEPHZIBAH|BLYTHE)$/, STATE = /^(GA|GEORGIA)$/;
  function key(s) { return String(s == null ? '' : s).toUpperCase().replace(/[^A-Z0-9]/g, ''); }
  function isType(w) { return !!TYPES[ABBR[w] || w]; }
  function lev(a, b) {
    if (a === b) return 0; var m = a.length, n = b.length; if (!m || !n) return m || n;
    var p = [], i, k; for (k = 0; k <= n; k++) p[k] = k;
    for (i = 1; i <= m; i++) { var c = [i]; for (k = 1; k <= n; k++) c[k] = Math.min(p[k] + 1, c[k - 1] + 1, p[k - 1] + (a[i - 1] === b[k - 1] ? 0 : 1)); p = c; }
    return p[n];
  }
  function parse(raw) {
    var w = String(raw || '').toUpperCase().replace(/[.#]/g, ' ').split(',')[0].replace(/\s+/g, ' ').trim().split(' ');
    // Only trailing city / state / ZIP are dropped, so streets like "Georgia Rd" or "Hephzibah McBean Rd" survive.
    if (w.length > 2 && /^\d{5}(-\d{4})?$/.test(w[w.length - 1])) w.pop();
    if (w.length > 2 && STATE.test(w[w.length - 1]) && (isType(w[w.length - 2]) || CITY.test(w[w.length - 2]))) w.pop();
    if (w.length > 2 && CITY.test(w[w.length - 1]) && isType(w[w.length - 2])) w.pop();
    var m = w.join(' ').match(/^(\d+)-?([A-Z])?\s+(.+)$/); if (!m) return null;
    var t = m[3].split(' ').filter(Boolean), unit = null, dir = null, type = null, i;
    function ab(x) { return ABBR[x] || x; }
    for (i = 0; i < t.length; i++) if (/^(APT|APARTMENT|UNIT|STE|SUITE|LOT|BLDG)$/.test(t[i])) { unit = t.slice(i + 1).join(' ') || null; t = t.slice(0, i); break; }
    var ti = -1; for (i = t.length - 1; i > 0; i--) if (TYPES[ab(t[i])]) { ti = i; break; }
    if (ti > 0) { type = ab(t[ti]); var rest = t.slice(ti + 1); if (rest.length && DIRS[ab(rest[0])]) dir = ab(rest.shift()); if (!unit && rest.length) unit = rest.join(' '); t = t.slice(0, ti); }
    if (t.length > 1 && DIRS[ab(t[0])] && !dir) dir = ab(t.shift());
    if (!t.length) return null;
    return {num: +m[1], ext: m[2] || null, name: t.join(' '), type: type, dir: dir, unit: unit};
  }
  function narrow(f, p) {
    function by(test) { if (f.length > 1) { var g = f.filter(test); if (g.length) f = g; } }
    if (p.ext) by(function (a) { return key(a.extension) === p.ext; }); else by(function (a) { return !key(a.extension); });
    if (p.type) by(function (a) { return key(a.sttype) === p.type; });
    if (p.dir) by(function (a) { return key(a.stdirect) === p.dir; });
    if (p.unit) by(function (a) { return key(a.unit) === key(p.unit) || key(a.siteaddress).slice(-key(p.unit).length) === key(p.unit); });
    else by(function (a) { return !key(a.unit); });
    return f;
  }
  var OF = 'pin,siteaddress,street_nam,sttype,stdirect,unit,house_no,extension';
  function make(layer, geo, getJSON) {
    function rec(where, n) { return getJSON(layer + '/query?where=' + encodeURIComponent(where) + '&outFields=' + OF + '&returnGeometry=false' + (n ? '&resultRecordCount=' + n : '') + '&f=json').then(function (j) { return ((j && j.features) || []).map(function (x) { return x.attributes; }); }); }
    function sq(s) { return String(s).replace(/'/g, "''"); }
    function done(f, how) { return f.length === 1 ? {pin: f[0].pin, how: how, rows: f} : (f.length ? {pins: f.map(function (a) { return a.pin; }), how: how + '-multi', rows: f} : null); }
    return function find(raw) {
      var p = parse(raw); if (!p) return Promise.resolve({how: 'noparse'});
      var nm = sq(p.name);
      return rec("house_no = " + p.num + " AND UPPER(street_nam) = '" + nm + "'").then(function (f) {
        if (f.length) return f;
        // "4458 A Forest Rd": a lone letter after the number is the county's house-number extension.
        var em = p.name.match(/^([A-Z]) (.+)$/);
        if (em && !p.ext) return rec("house_no = " + p.num + " AND UPPER(street_nam) = '" + sq(em[2]) + "'").then(function (g) {
          if (g.length) { p.ext = em[1]; p.name = em[2]; nm = sq(em[2]); }
          return g;
        });
        return f;
      }).then(function (f) {
        return f.length ? f : rec("house_no = " + p.num + " AND UPPER(street_nam) LIKE '" + nm + "%'");
      }).then(function (f) {
        if (f.length) return done(narrow(f, p), 'records');
        // Same house number anywhere in the county; pick the closest street spelling.
        return rec("house_no = " + p.num, 2000).then(function (all) {
          var want = key(p.name);
          var sc = all.map(function (a) { var k = key(a.street_nam), d = lev(want, k); return {a: a, s: 1 - d / Math.max(want.length, k.length, 1) + (p.type && key(a.sttype) === p.type ? 0.05 : 0)}; })
            .sort(function (x, y) { return y.s - x.s; });
          if (!sc.length) return null;
          var best = sc[0].s, second = 0, i;
          for (i = 1; i < sc.length; i++) if (key(sc[i].a.street_nam) !== key(sc[0].a.street_nam)) { second = sc[i].s; break; }
          if (best >= 0.6 || (best >= 0.45 && best - second >= 0.15)) return done(narrow(sc.filter(function (x) { return key(x.a.street_nam) === key(sc[0].a.street_nam); }).map(function (x) { return x.a; }), p), 'fuzzy');
          return null;
        });
      }).then(function (r) {
        if (r) return r;
        var single = String(raw).replace(/,?\s*\b(GA|GEORGIA)\b\.?\s*$/i, '').trim();
        return getJSON(geo + '?SingleLine=' + encodeURIComponent(single) + '&outSR=4326&maxLocations=6&outFields=Addr_type&f=json').then(function (j) {
          var c = ((j && j.candidates) || []).filter(function (x) { return x.score >= 85 && x.location; });
          if (!c.length) return {how: 'none'};
          var m2 = parse(c[0].address), loc = {lat: c[0].location.y, lon: c[0].location.x};
          var step = m2 ? rec("house_no = " + m2.num + " AND UPPER(street_nam) = '" + sq(m2.name) + "'").then(function (g) { g = narrow(g, {type: m2.type, dir: m2.dir, unit: p.unit}); return g.length === 1 ? {pin: g[0].pin, how: 'locator', rows: g, at: loc} : null; }) : Promise.resolve(null);
          return step.then(function (r2) {
            if (r2) return r2;
            return getJSON(layer + '/query?geometry=' + loc.lon + ',' + loc.lat + '&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=' + OF + '&returnGeometry=false&f=json').then(function (pp) {
              var a = pp && pp.features && pp.features[0] && pp.features[0].attributes;
              return a ? {pin: a.pin, how: 'locator-point', rows: [a], at: loc} : {how: 'locator-nopar', at: loc, label: c[0].address};
            });
          });
        });
      });
    };
  }
  root.SAGLookup = {parse: parse, make: make, key: key};
})(typeof window !== 'undefined' ? window : globalThis);
