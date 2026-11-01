"""Builds one page per Richmond County neighborhood plus a hub page, from data/neighborhoods.json
(pulled from Augusta-Richmond County GIS). Re-run after refreshing the data:  python3 tools/build_neighborhoods.py"""
import json, re, math, html, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = json.load(open(os.path.join(ROOT, 'data', 'neighborhoods.json')))
TEMPLATE = open(os.path.join(ROOT, 'we-buy-houses-richmond-county-ga.html')).read()
COUNTY_MEDIAN = 186900  # county-wide median, qualified residential sales, same 12-month window
SITE = 'https://smithassetgrp.com/'

DISPLAY = {'Academy Baker Ave': 'Academy-Baker', 'Central Business District': 'Downtown Augusta', 'Forrest Hills': 'Forest Hills',
           'Pendelton King': 'Pendleton King', 'Laney Walker': 'Laney-Walker'}
SKIP = {'Hephzibah': 'sell-my-house-fast-hephzibah-ga.html'}  # already has its own city page
esc = lambda s: html.escape(str(s), quote=True)
money = lambda n: '${:,.0f}'.format(n)


def disp(n): return DISPLAY.get(n, n)
def slug(n): return re.sub(r'[^a-z0-9]+', '-', disp(n).lower()).strip('-')
def url(n): return SKIP.get(n) or 'sell-my-house-' + slug(n) + '-richmond-county-ga.html'


def street_title(s):
    s = s.title()
    return re.sub(r'\b(Ii|Iii|Jr)\b', lambda m: {'Ii': 'II', 'Iii': 'III', 'Jr': 'Jr'}[m.group(1)], s)


rows = D['neighborhoods']


def nearest(r, k=4):
    def dist(o): return math.hypot((o['lat'] - r['lat']) * 69, (o['lon'] - r['lon']) * 57.6)
    return sorted([o for o in rows if o is not r], key=dist)[:k]


def numbers(r):
    n = r['sales12'] or 0
    if n >= 5:
        rel = 'above' if r['median'] > COUNTY_MEDIAN else 'below'
        p = (f"In the 12 months through October 2026, Augusta-Richmond County recorded <strong>{n} qualified home sales</strong> in {esc(disp(r['name']))} "
             f"(sales the county marks as normal market sales). The <strong>median price was {money(r['median'])}</strong>, {rel} the county-wide median of {money(COUNTY_MEDIAN)}, "
             f"and the middle half of sales fell between {money(r['p25'])} and {money(r['p75'])}.")
        if r.get('medianYearBuiltSold'):
            p += f" The typical home that sold was built around {r['medianYearBuiltSold']}."
        return p
    if n > 0:
        return (f"Augusta-Richmond County recorded only {n} qualified home sale{'s' if n != 1 else ''} in {esc(disp(r['name']))} in the 12 months through October 2026, "
                "too few to give a reliable typical price. Values here vary a lot from one property to the next, so a house-by-house look matters.")
    return (f"Augusta-Richmond County recorded no qualified home sales in {esc(disp(r['name']))} in the 12 months through October 2026. "
            "With no recent market sales to compare, pricing a house here takes a closer look at the property itself and sales in nearby neighborhoods.")


def context(r):
    out, n, y, m = [], r['sales12'] or 0, r.get('medianYearBuiltSold'), r.get('median')
    if y and y < 1950:
        out.append(f"Many homes here date from before 1950. Older houses often need a roof, wiring, plumbing, or foundation work that a buyer's lender won't accept, which narrows who can buy them.")
    elif y and y >= 2000 and n >= 5:
        out.append(f"Much of what sells here is newer construction. If your house is in good shape and you have time, listing with a real estate agent will often get you the most money. A cash sale makes more sense when the house needs work, has tenants, or you need a firm closing date.")
    if n >= 5 and m and m < 100000:
        out.append("Half of recent sales here were under $100,000, a range where many buyers are investors paying cash.")
    if n >= 5 and r['p75'] and r['p25'] and r['p75'] >= 2.5 * r['p25']:
        out.append("Prices here swing widely from street to street and house to house, so an offer should be based on the closest comparable sales, not a neighborhood average.")
    return ''.join('<p>' + esc(x) + '</p>' for x in out)


def page(r):
    name, dn = r['name'], disp(r['name'])
    u = SITE + url(name)
    title = f"Sell My House Fast in {dn}, Augusta GA | Smith Asset"
    if len(title) > 62: title = f"Sell My House in {dn}, Augusta GA | Smith Asset"
    if len(title) > 62: title = f"Sell My House {dn} GA | Smith Asset"
    desc = (f"Sell your {dn} house for cash, as-is. {r['sales12'] or 'No'} market sales here in the last 12 months"
            + (f", median {money(r['median'])}" if (r['sales12'] or 0) >= 5 else '') + ". Free county property lookup. Call or text (762) 215-4466.")
    faq = [
        (f"Do you buy houses in {dn}?", f"Yes. Smith Asset Group buys houses for cash in {dn} and every other Richmond County neighborhood, in any condition. No repairs, no showings, and you pick the closing date."),
        (f"What are homes in {dn} selling for?", re.sub('<[^>]+>', '', html.unescape(numbers(r)))),
        ("How do you make a cash offer?", "We pull recent sales of similar houses nearby from county records, estimate what the house needs, and walk you through the math in writing. A cash offer is usually below full retail value; in exchange you skip repairs, showings, and waiting on a buyer's loan."),
    ]
    ld = [
        {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE},
            {"@type": "ListItem", "position": 2, "name": "Richmond County neighborhoods", "item": SITE + "richmond-county-neighborhoods.html"},
            {"@type": "ListItem", "position": 3, "name": dn, "item": u}]},
        {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq]},
    ]
    keep = [s for s in r['streetSample'] if not re.search(r'SAVANNAH RIVER|INTERSTATE|SWAMP', s)]
    streets = ''.join('<li>' + esc(street_title(s)) + '</li>' for s in keep)
    near = ''.join(f'<a class="inline" href="{url(o["name"])}">{esc(disp(o["name"]))}</a>' for o in nearest(r))
    maplink = 'index.html?hood=' + esc(name.replace(' ', '+')) + '#parcelLookup'
    body = f'''<div class="wrap">
  <div class="area-hero">
    <p class="eyebrow">Richmond County neighborhood &middot; Cash home buyer</p>
    <h1>Sell your house in {esc(dn)}</h1>
    <p class="lede">Smith Asset Group buys houses for cash in {esc(dn)}, one of Richmond County's official neighborhoods, in any condition. No repairs, no cleaning, no showings, and you pick the closing date.</p>
    <div class="cta-row">
      <a class="btn-a pri" href="index.html#sell">Get my cash offer</a>
      <a class="btn-a sec" href="tel:+17622154466">Call (762) 215-4466</a>
      <a class="btn-a sec" href="{maplink}">See {esc(dn)} on the map</a>
    </div>
  </div>
  <main>
    <section>
      <h2>{esc(dn)} home sales, by the numbers</h2>
      <p>{numbers(r)}</p>
      {context(r)}
      <ul class="chips"><li>About {r['parcels']:,} parcels</li><li>{r['streetCount']} streets with addresses</li>{f"<li>{r['sales12']} sales in 12 months</li>" if r['sales12'] else ''}</ul>
      <p style="font-size:.88rem">Source: Augusta-Richmond County GIS neighborhood boundary, parcel, and sales records, pulled October 31, 2026. Not an appraisal.</p>
    </section>
    <section>
      <h2>Look up your house</h2>
      <p>See what the county has on file for any {esc(dn)} property, free: owner of record, assessed value, last sale, beds, baths, square feet, year built, lot size, zoning, and flood zone, plus recent sales nearby. <a class="inline" href="{maplink}">Browse every street in {esc(dn)} on our map</a>.</p>
      <p>Streets in {esc(dn)} include:</p>
      <ul class="chips">{streets}</ul>
    </section>
    <section>
      <h2>How selling for cash works</h2>
      <div class="steps"><div class="step"><b>1. Tell us about the house</b><p>Fill out the short form or call or text (762) 215-4466. The address and a few details are enough to start.</p></div><div class="step"><b>2. Get a written offer</b><p>We compare recent sales near you, estimate repairs, and show you how we got our number.</p></div><div class="step"><b>3. Close with an attorney</b><p>A Georgia closing attorney handles title, payoffs, and the deed. You choose the date.</p></div></div>
    </section>
    <section class="qa">
      <h2>{esc(dn)} seller questions</h2>
      {''.join(f'<details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>' for q, a in faq)}
    </section>
    <section class="cta-box">
      <h2>Get a no-obligation cash offer</h2>
      <p>Tell us about the house in two minutes, or just call or text. No pressure and no obligation.</p>
      <div class="cta-row" style="margin-top:12px">
        <a class="btn-a pri" href="index.html#sell">Start my offer</a>
        <a class="btn-a sec" href="tel:+17622154466">(762) 215-4466</a>
      </div>
    </section>
    <section class="other-areas">
      <h2>Nearby neighborhoods</h2>
      <p>{near}</p>
      <p><a class="inline" href="richmond-county-neighborhoods.html">All Richmond County neighborhoods</a><a class="inline" href="we-buy-houses-richmond-county-ga.html">We buy houses in Richmond County</a></p>
    </section>
  </main>
</div>
'''
    return fill(title, desc, u, ld, body)


def fill(title, desc, u, ld, body):
    t = TEMPLATE
    t = re.sub(r'<title>[^<]*</title>', '<title>' + esc(title) + '</title>', t)
    t = re.sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="' + esc(desc) + '">', t)
    t = re.sub(r'<meta property="og:description" content="[^"]*">', '<meta property="og:description" content="' + esc(desc) + '">', t)
    t = re.sub(r'<meta property="og:title" content="[^"]*">', '<meta property="og:title" content="' + esc(title) + '">', t)
    t = t.replace('https://smithassetgrp.com/we-buy-houses-richmond-county-ga.html', u)
    t = re.sub(r'(<script type="application/ld\+json">.*?</script>\n?)+', lambda m: ''.join('<script type="application/ld+json">' + json.dumps(x, ensure_ascii=False) + '</script>\n' for x in ld), t, count=1, flags=re.S)
    i, j = t.index('<div class="wrap">'), t.index('<footer class="site">')
    return t[:i] + body + t[j:]


def hub():
    u = SITE + 'richmond-county-neighborhoods.html'
    trs = ''.join(
        f'<tr><td><a class="inline" href="{url(r["name"])}">{esc(disp(r["name"]))}</a></td><td>{r["sales12"] or 0}</td>'
        f'<td>{money(r["median"]) if (r["sales12"] or 0) >= 5 else "Too few sales"}</td><td>{r.get("medianYearBuiltSold") or "-"}</td><td>{r["parcels"]:,}</td></tr>'
        for r in sorted(rows, key=lambda r: disp(r['name'])))
    ld = [{"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE},
        {"@type": "ListItem", "position": 2, "name": "Richmond County neighborhoods", "item": u}]}]
    body = f'''<div class="wrap">
  <div class="area-hero">
    <p class="eyebrow">Richmond County, GA &middot; Neighborhood home sales</p>
    <h1>Richmond County neighborhoods: what homes are selling for</h1>
    <p class="lede">Home sales for every official Augusta-Richmond County neighborhood over the last 12 months, straight from county records. Tap a neighborhood for its streets, numbers, and a free property lookup.</p>
    <div class="cta-row"><a class="btn-a pri" href="index.html#sell">Get my cash offer</a><a class="btn-a sec" href="index.html#parcelLookup">Open the property map</a></div>
  </div>
  <main>
    <section>
      <p>Across the whole county, the median qualified home sale in the 12 months through October 2026 was {money(COUNTY_MEDIAN)}. "Qualified" means the county marks the sale as a normal market sale, so family transfers and foreclosure deeds are left out. Medians are shown only where there were at least 5 sales.</p>
      <div style="overflow-x:auto"><table class="hood-t">
        <thead><tr><th>Neighborhood</th><th>Sales (12 mo)</th><th>Median price</th><th>Typical year built</th><th>Parcels</th></tr></thead>
        <tbody>{trs}</tbody></table></div>
      <p style="font-size:.88rem">Source: Augusta-Richmond County GIS neighborhood boundaries, parcels, and qualified residential sales, pulled October 31, 2026. "Typical year built" is the median for homes that sold. Not an appraisal.</p>
    </section>
  </main>
</div>
'''
    t = fill('Richmond County GA Neighborhoods: Home Sales & Prices', 'Home sales and median prices for every Augusta-Richmond County neighborhood over the last 12 months, from county records. Free property lookup and cash offers.', u, ld, body)
    return t.replace('</style>\n</head>', '.hood-t{width:100%;border-collapse:collapse;font-size:.92rem;margin:14px 0;font-family:"IBM Plex Sans",system-ui,sans-serif;}.hood-t th,.hood-t td{text-align:left;padding:9px 10px;border-bottom:1px solid var(--border);white-space:nowrap;}.hood-t th{font-weight:600;color:var(--text);}\n</style>\n</head>', 1)


made = []
for r in rows:
    if r['name'] in SKIP: continue
    f = url(r['name'])
    open(os.path.join(ROOT, f), 'w').write(page(r)); made.append(f)
open(os.path.join(ROOT, 'richmond-county-neighborhoods.html'), 'w').write(hub())
made.append('richmond-county-neighborhoods.html')

sm = open(os.path.join(ROOT, 'sitemap.xml')).read()
for f in made:
    if SITE + f not in sm:
        sm = sm.replace('</urlset>', f'  <url><loc>{SITE}{f}</loc><lastmod>2026-10-31</lastmod></url>\n</urlset>')
open(os.path.join(ROOT, 'sitemap.xml'), 'w').write(sm)
print(len(made), 'pages')
