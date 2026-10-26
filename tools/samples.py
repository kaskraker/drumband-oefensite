"""Bouwt audio/drums.wav (+ audio/drums.json) uit CC0-opnames van de
Versilian Community Sample Library (VCSL, github.com/sgossner/VCSL).
Gebruik: python3 tools/samples.py /pad/naar/VCSL
"""
import json, subprocess, sys, numpy as np
SR = 32000
BASE = sys.argv[1].rstrip('/') + '/Membranophones/Struck Membranophones/'
SN = 'Legacy Snares/drum3_marching/snare3_'
RO = 'Snare Drum, Rope Tension/Low/RopeSnare_low_ns_Main_'      # zonder snaren: tenor/veldtrommel
BD = 'Bass Drum 1/BDrumNew_hit_'
# naam: (bestand, lengte in s, instrument). Per instrument een gezamenlijke versterking,
# zodat zachte lagen hun natuurlijke niveau houden en hun ruis niet opgeblazen wordt.
LIST = {
    'snare2a': (SN + 'mp_rr1.wav', .45, 'snare'),
    'snare3a': (SN + 'f_rr1.wav', .5, 'snare'), 'snare3b': (SN + 'f_rr2.wav', .5, 'snare'),
    'rim':     (SN + 'click_rr1.wav', .22, 'rim'),
    'tenor1a': (RO + 'vl2_rr1.wav', .8, 'tenor'),
    'tenor2a': (RO + 'vl3_rr1.wav', .85, 'tenor'), 'tenor2b': (RO + 'vl3_rr2.wav', .85, 'tenor'),
    'bass1a':  (BD + 'v3_rr1_Sum.wav', 1.3, 'bass'), 'bass2a': (BD + 'v5_rr1_Sum.wav', 1.4, 'bass'),
    'bass3a':  (BD + 'v7_rr1_Sum.wav', 1.5, 'bass'),
}

def load(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(SR),
                          '-af', 'highpass=f=35', '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).copy()

def shape(x, length):
    on = int(np.argmax(np.abs(x) > np.abs(x).max() * .05))      # begin van de aanslag
    x = x[max(0, on - int(SR * .002)):][:int(SR * length)].copy()
    # ruispoort: zodra de omhullende onder -46 dB t.o.v. de piek zakt, zacht uitdoven
    env = np.convolve(np.abs(x), np.ones(int(SR * .01)) / int(SR * .01), 'same')
    below = np.where(env < np.abs(x).max() * 10 ** (-46 / 20))[0]
    below = below[below > int(SR * .03)]
    if len(below): x = x[:below[0]]
    n = len(x); fade = max(int(n * .35), int(SR * .02))
    x[-fade:] *= np.linspace(1, 0, fade) ** 2
    return x

raw = {k: shape(load(BASE + f), L) for k, (f, L, g) in LIST.items()}
peak = {}
for k, (f, L, g) in LIST.items(): peak[g] = max(peak.get(g, 0), np.abs(raw[k]).max())
out, meta, pos = [], {}, 0
gap = np.zeros(int(SR * .05), np.float32)
for k, (f, L, g) in LIST.items():
    x = raw[k] * (.89 / peak[g])
    meta[k] = [round(pos / SR, 5), round(len(x) / SR, 5)]
    print(k, 'piek %.1f dB' % (20 * np.log10(np.abs(x).max())))
    out += [x, gap]; pos += len(x) + len(gap)
pcm = (np.concatenate(out) * 32767).astype('<i2')
import wave
with wave.open('audio/drums.wav', 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
json.dump(meta, open('audio/drums.json', 'w'), separators=(',', ':'))
print(len(pcm) / SR, 's', meta)
