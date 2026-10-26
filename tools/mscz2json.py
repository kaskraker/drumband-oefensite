"""Zet MuseScore-partijen (.mscz) om naar speeldata voor de oefensite.

Gebruik: python3 tools/mscz2json.py uitvoer.json naam=bestand.mscz[:notenbalk] ...
Voorbeeld:
  python3 tools/mscz2json.py score/marsvaardig-junior.json \
     snare=MARSVAARDIG.mscz bas=MARSVAARDIG_basdrum.mscz:1 tenor=MARSVAARDIG_basdrum.mscz:2
"""
import json, sys, zipfile, xml.etree.ElementTree as ET

DUR = {'whole': 4, 'half': 2, 'quarter': 1, 'eighth': .5, '16th': .25, '32nd': .125, '64th': .0625}
DYN = {'ppp': .22, 'pp': .3, 'p': .42, 'mp': .55, 'mf': .68, 'f': .82, 'ff': .92, 'fff': 1}
ACCENTS = ('articAccentAbove', 'articAccentBelow', 'articMarcatoAbove', 'articMarcatoBelow')

def load(path):
    with zipfile.ZipFile(path) as z:
        name = [n for n in z.namelist() if n.endswith('.mscx') and '/' not in n][0]
        return ET.fromstring(z.read(name)).find('Score')

def staff_data(score, idx):
    st = score.findall('Staff')[idx - 1]
    beats, measures, seq_marks, level = 2, [], [], .82
    for m in st.findall('Measure'):
        mlen = None
        if m.get('len'):
            a, b = m.get('len').split('/'); mlen = int(a) * 4 / int(b)
        notes, info = [], {'start': m.find('startRepeat') is not None,
                           'end': int(m.findtext('endRepeat') or 0)}
        for v in m.findall('voice'):
            t, sfz = 0.0, False
            for e in v:
                if e.tag == 'TimeSig':
                    beats = int(e.findtext('sigN')) * 4 / int(e.findtext('sigD'))
                elif e.tag == 'RehearsalMark':
                    info['mark'] = (e.findtext('text') or '').strip()
                elif e.tag == 'Dynamic':
                    sub = e.findtext('subtype')
                    if sub in DYN: level = DYN[sub]
                    elif sub in ('sfz', 'sf', 'fz', 'sffz'): sfz = True
                elif e.tag in ('Chord', 'Rest'):
                    dt = e.findtext('durationType')
                    d = (mlen or beats) if dt == 'measure' else DUR[dt] * (1.5 if e.findtext('dots') == '1' else 1.75 if e.findtext('dots') == '2' else 1)
                    if e.tag == 'Chord':
                        acc = any(a.findtext('subtype') in ACCENTS for a in e.findall('Articulation'))
                        vel = 1.0 if sfz else min(1.0, level + (.18 if acc else 0))
                        sfz = False
                        for n in e.findall('Note'):
                            kind = 'r' if n.findtext('pitch') == '37' else 's'
                            notes.append([round(t, 4), round(vel, 2), kind, 1 if acc else 0])
                    t += d
        info['len'] = mlen or beats
        info['notes'] = sorted(notes)
        measures.append(info)
    return measures

def build_seq(measures):
    seq, i, start, done = [], 0, 0, {}
    while i < len(measures):
        m = measures[i]
        if m['start']: start = i
        seq.append(i)
        if m['end'] and done.get(i, 1) < m['end']:
            done[i] = done.get(i, 1) + 1; i = start; continue
        i += 1
    return seq

def main():
    out, specs = sys.argv[1], sys.argv[2:]
    parts, ref = {}, None
    for s in specs:
        name, f = s.split('=', 1)
        path, _, idx = f.partition(':')
        ms = staff_data(load(path), int(idx or 1))
        if ref is None: ref = ms
        assert len(ms) == len(ref), f'{name}: {len(ms)} maten i.p.v. {len(ref)}'
        parts[name] = [m['notes'] for m in ms]
    data = {
        'measures': [{'len': m['len'], **({'mark': m['mark']} if 'mark' in m else {})} for m in ref],
        'seq': build_seq(ref),
        'parts': parts,
    }
    with open(out, 'w') as fh: json.dump(data, fh, separators=(',', ':'))
    print(out, len(ref), 'maten,', len(data['seq']), 'gespeelde maten,', {k: sum(len(x) for x in v) for k, v in parts.items()})

if __name__ == '__main__':
    main()
