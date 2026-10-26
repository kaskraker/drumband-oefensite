"""Bouwt audio/drums.wav (+ audio/drums.json) uit CC0-opnames van de
Versilian Community Sample Library (VCSL, github.com/sgossner/VCSL).
Gebruik: python3 tools/samples.py /pad/naar/VCSL
"""
import json, subprocess, sys, numpy as np
SR = 32000
BASE = sys.argv[1].rstrip('/') + '/Membranophones/Struck Membranophones/'
SN = 'Legacy Snares/drum3_marching/snare3_'
RO = 'Snare Drum, Rope Tension/Low/RopeSnare_low_sn_Main_'
BD = 'Bass Drum 1/BDrumNew_hit_'
# naam: (bestand, lengte in s, relatief niveau)
LIST = {
    'snare1a': (SN + 'p_rr1.wav', .45), 'snare1b': (SN + 'p_rr2.wav', .45),
    'snare2a': (SN + 'mp_rr1.wav', .5),
    'snare3a': (SN + 'f_rr1.wav', .55), 'snare3b': (SN + 'f_rr2.wav', .55),
    'rim':     (SN + 'click_rr1.wav', .25),
    'tenor1a': (RO + 'vl2_rr1.wav', .9), 'tenor2a': (RO + 'vl3_rr1.wav', .9), 'tenor2b': (RO + 'vl3_rr3.wav', .9),
    'bass1a':  (BD + 'v3_rr1_Sum.wav', 1.4), 'bass2a': (BD + 'v5_rr1_Sum.wav', 1.5), 'bass3a': (BD + 'v7_rr1_Sum.wav', 1.6),
}

def load(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).copy()

out, meta, pos = [], {}, 0
gap = np.zeros(int(SR * .05), np.float32)
for name, (f, length) in LIST.items():
    x = load(BASE + f)
    on = int(np.argmax(np.abs(x) > np.abs(x).max() * .05))      # begin van de aanslag
    x = x[max(0, on - int(SR * .002)):][:int(SR * length)]
    n = len(x); fade = int(n * .35)
    x[-fade:] *= np.linspace(1, 0, fade) ** 2                   # zachte uitsterving
    x *= .89 / np.abs(x).max()                                  # normaliseren
    meta[name] = [round(pos / SR, 5), round(n / SR, 5)]
    out += [x, gap]; pos += n + len(gap)
pcm = (np.concatenate(out) * 32767).astype('<i2')
import wave
with wave.open('audio/drums.wav', 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
json.dump(meta, open('audio/drums.json', 'w'), separators=(',', ':'))
print(len(pcm) / SR, 's', meta)
