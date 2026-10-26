"""Zoek de maten in een MuseScore-PDF (eenlijnige slagwerknotenbalk).

Gebruik: python3 tools/pdfmaten.py partituur.pdf [verwacht_aantal]
Geeft per maat [pagina, x0, y0, x1, y1] terug als fractie van de paginabreedte/-hoogte.
"""
import json, sys, collections, pdfplumber

def measures(path):
    out = []
    with pdfplumber.open(path) as pdf:
        for pi, pg in enumerate(pdf.pages):
            W, H = pg.width, pg.height
            vt = [l for l in pg.lines if abs(l['x0'] - l['x1']) < .5]
            if not vt: continue
            h = collections.Counter(round(l['bottom'] - l['top'], 1) for l in vt)
            # maatstrepen: de langste verticale lijnen die minstens 6 keer voorkomen
            bar_h = max(k for k, c in h.items() if c >= 6)
            rows = collections.defaultdict(list)
            for l in vt:
                if abs((l['bottom'] - l['top']) - bar_h) < .3:
                    rows[round(l['top'], 1)].append((l['x0'], l.get('linewidth', 1)))
            for top in sorted(rows):
                xs = sorted(rows[top])
                # dubbele strepen (dun + dik) samenvoegen tot de dunne streep
                b = []
                for x, w in xs:
                    if b and x - b[-1][0] < 6:
                        if w < b[-1][1]: b[-1] = (x, w)
                        continue
                    b.append((x, w))
                xs = [x for x, _ in b]
                y0, y1 = top - 26, top + bar_h + 18
                for a, c in zip(xs, xs[1:]):
                    out.append([pi, round(a / W, 4), round(y0 / H, 4), round(c / W, 4), round(y1 / H, 4)])
    return out

if __name__ == '__main__':
    m = measures(sys.argv[1])
    if len(sys.argv) > 2 and len(m) != int(sys.argv[2]):
        sys.exit(f'{sys.argv[1]}: {len(m)} maten gevonden, {sys.argv[2]} verwacht')
    print(json.dumps(m, separators=(',', ':')))
