import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, SafeAreaView,
  Clipboard, Alert, StatusBar, Modal
} from 'react-native';

// ══════════════════════════════════════════
// KNOWLEDGE BASE
// ══════════════════════════════════════════
const KB = {
  instruments: {
    'bass':            { dark:'[bass: sustained root notes, deep sub, slow movement, mono]', melancholic:'[bass: slow walking, warm tone, melodic movement]', neutral:'[bass: groove locked to kick, medium attack]', tense:'[bass: rhythmic staccato, sharp attack, sub pressure]', uplifting:'[bass: walking melodic, forward motion]', euphoric:'[bass: full sub, active movement, maximum pressure]', ethereal:'[bass: sub only, sustained root, minimal]' },
    'drums':           { dark:'[drums: sparse minimal hits, no fills, wide spacing]', melancholic:'[drums: brush light, soft attack, sparse]', neutral:'[drums: tight groove, no fills, locked in]', tense:'[drums: sharp transients, building tension]', uplifting:'[drums: full groove with fills, driving]', euphoric:'[drums: full groove maximum energy, peak intensity]', ethereal:'[drums: no drums]' },
    'pad':             { dark:'[pad: slow attack, dark texture, wide, low register]', melancholic:'[pad: slow attack, warm filter, sustained chord]', neutral:'[pad: medium attack, neutral tone, background]', tense:'[pad: dissonant texture, high register, tension held]', uplifting:'[pad: bright tone, slow attack, wide stereo]', euphoric:'[pad: full bright chord, wide, high energy]', ethereal:'[pad: very slow attack, high register, spacious]' },
    'piano':           { dark:'[piano: sparse single notes, low register, wide gaps]', melancholic:'[piano: sparse chords, soft attack, breathing phrasing]', neutral:'[piano: chord clusters, medium attack, balanced]', tense:'[piano: staccato notes, tight attack, no sustain]', uplifting:'[piano: arpeggios ascending, bright, forward motion]', euphoric:'[piano: full voicing, strong attack, driving rhythm]', ethereal:'[piano: single notes high register, soft attack, sparse]' },
    'strings':         { dark:'[strings: sustained chords, dark tone, slow bow]', melancholic:'[strings: sustained chords, arco slow, emotional]', neutral:'[strings: sustained chords, arco medium, balanced]', tense:'[strings: tremolo, high register, dissonance]', uplifting:'[strings: arco medium, ascending phrases]', euphoric:'[strings: full orchestra, fast bow, high energy]', ethereal:'[strings: slow bow, high register, sustained harmonics]' },
    'synthesizer':     { dark:'[synthesizer: sustained drone, dark texture, slow movement]', melancholic:'[synthesizer: texture layer, warm filter, slow modulation]', neutral:'[synthesizer: rhythmic sequences, medium attack]', tense:'[synthesizer: stabs rhythmic, sharp attack, dissonant]', uplifting:'[synthesizer: lead melody, bright tone, forward]', euphoric:'[synthesizer: lead melody full, high energy, wide stereo]', ethereal:'[synthesizer: pad-like drone, very slow attack, spacious]' },
    'acoustic guitar': { dark:'[acoustic guitar: sparse single notes, low register, no brightness]', melancholic:'[acoustic guitar: fingerpicking sparse, soft attack, wide gaps]', neutral:'[acoustic guitar: fingerpicking medium, balanced, steady]', tense:'[acoustic guitar: muted picking, rhythmic, tight attack]', uplifting:'[acoustic guitar: arpeggios medium, bright, forward]', euphoric:'[acoustic guitar: strumming driving, full chord, energetic]', ethereal:'[acoustic guitar: single notes sparse, high register]' },
    'electric guitar': { dark:'[electric guitar: clean single notes, dark tone, slow phrases]', melancholic:'[electric guitar: clean arpeggios, warm tone, slow attack]', neutral:'[electric guitar: clean chord stabs, medium attack]', tense:'[electric guitar: muted rhythmic, tight, no sustain]', uplifting:'[electric guitar: clean lead, forward phrases]', euphoric:'[electric guitar: distorted riffs, full attack, driving]', ethereal:'[electric guitar: clean harmonics, high register, long decay]' },
    'sub bass':        { dark:'[sub bass: 808 style, long decay, heavy weight]', melancholic:'[sub bass: slow movement, warm low end]', neutral:'[sub bass: locked to kick, tight]', tense:'[sub bass: short stabs, rhythmic pressure]', uplifting:'[sub bass: melodic movement, medium decay]', euphoric:'[sub bass: full weight, maximum low end]', ethereal:'[sub bass: sustained drone, minimal]' },
    'hi-hats':         { dark:'[hi-hats: sparse, wide spacing, dark tone]', melancholic:'[hi-hats: soft open hats, slow rhythm]', neutral:'[hi-hats: steady closed hats, consistent]', tense:'[hi-hats: rolling 16th, building pressure]', uplifting:'[hi-hats: driving open hats, forward motion]', euphoric:'[hi-hats: rolling triplets, maximum energy]', ethereal:'[hi-hats: no hi-hats]' },
    'brass':           { dark:'[brass: muted, low register, sparse phrases]', melancholic:'[brass: muted, slow phrases, warm tone]', neutral:'[brass: medium phrases, clear tone]', tense:'[brass: short stabs, sharp attack]', uplifting:'[brass: bright melodic phrases, forward]', euphoric:'[brass: fanfare bold, full tone, high register]', ethereal:'[brass: very sparse high notes, distant]' },
    'voice':           { dark:'[voice: spoken whisper, dark tone, sparse]', melancholic:'[voice: breathy tone, slow phrases, intimate]', neutral:'[voice: balanced tone, medium phrases, clear]', tense:'[voice: spoken tight, no vibrato, tense]', uplifting:'[voice: warm tone, ascending phrases]', euphoric:'[voice: full tone, high energy, wide range]', ethereal:'[voice: whisper high register, very sparse, breathy]' },
  },

  harmony: {
    'D minor':  { static:'Dm', slow:'Dm — C — Bb', medium:'Dm — Gm — Bb — A', active:'Dm — C — Bb — A7 — Dm' },
    'A minor':  { static:'Am', slow:'Am — G — F', medium:'Am — Em — F — G', active:'Am — G — F — E7 — Am' },
    'E minor':  { static:'Em', slow:'Em — D — C', medium:'Em — Bm — C — D', active:'Em — D — C — B7 — Em' },
    'G minor':  { static:'Gm', slow:'Gm — F — Eb', medium:'Gm — Dm — Eb — F', active:'Gm — F — Eb — D7 — Gm' },
    'C minor':  { static:'Cm', slow:'Cm — Bb — Ab', medium:'Cm — Gm — Ab — Bb', active:'Cm — Bb — Ab — G7 — Cm' },
    'B minor':  { static:'Bm', slow:'Bm — A — G', medium:'Bm — F#m — G — A', active:'Bm — A — G — F#7 — Bm' },
    'F minor':  { static:'Fm', slow:'Fm — Eb — Db', medium:'Fm — Cm — Db — Eb', active:'Fm — Eb — Db — C7 — Fm' },
    'C major':  { static:'C', slow:'C — G — Am', medium:'C — Am — F — G', active:'C — G — Am — F — C' },
    'G major':  { static:'G', slow:'G — D — Em', medium:'G — Em — C — D', active:'G — D — Em — C — G' },
    'D major':  { static:'D', slow:'D — A — Bm', medium:'D — Bm — G — A', active:'D — A — Bm — G — D' },
    'A major':  { static:'A', slow:'A — E — F#m', medium:'A — F#m — D — E', active:'A — E — F#m — D — A' },
    'E major':  { static:'E', slow:'E — B — C#m', medium:'E — C#m — A — B', active:'E — B — C#m — A — E' },
    'F major':  { static:'F', slow:'F — C — Dm', medium:'F — Dm — Bb — C', active:'F — C — Dm — Bb — F' },
  },

  dynamic: { 1:'pp', 2:'p', 3:'mp', 4:'mf', 5:'f' },

  genres: {
    dnb:       { name:'DRUM & BASS',   bpm:174, key:'A minor', color:'#2060e0', secs:[{n:'INTRO',e:1,d:1,m:'dark',h:'slow',bars:16,inst:['pad']},{n:'VERSE',e:3,d:3,m:'dark',h:'medium',bars:32,inst:['bass','drums']},{n:'CHORUS',e:5,d:5,m:'dark',h:'medium',bars:32,inst:['bass','drums','pad']},{n:'BREAK',e:1,d:1,m:'tense',h:'static',bars:16,inst:['pad']},{n:'CHORUS',e:5,d:5,m:'dark',h:'active',bars:32,inst:['bass','drums','pad']},{n:'OUTRO',e:2,d:2,m:'dark',h:'slow',bars:16,inst:['bass','pad']}]},
    neurofunk: { name:'NEUROFUNK',     bpm:174, key:'A minor', color:'#c83030', secs:[{n:'INTRO',e:1,d:1,m:'dark',h:'static',bars:8,inst:['pad']},{n:'VERSE',e:4,d:4,m:'dark',h:'medium',bars:32,inst:['bass','drums']},{n:'CHORUS',e:5,d:5,m:'tense',h:'active',bars:32,inst:['bass','drums','synthesizer']},{n:'BREAK',e:1,d:2,m:'dark',h:'static',bars:16,inst:['synthesizer']},{n:'CHORUS',e:5,d:5,m:'tense',h:'active',bars:32,inst:['bass','drums','synthesizer']},{n:'OUTRO',e:1,d:1,m:'dark',h:'static',bars:16,inst:['bass']}]},
    liquid:    { name:'LIQUID DnB',    bpm:174, key:'D minor', color:'#10b0c8', secs:[{n:'INTRO',e:1,d:1,m:'melancholic',h:'slow',bars:16,inst:['pad','piano']},{n:'VERSE',e:3,d:3,m:'melancholic',h:'medium',bars:32,inst:['bass','drums']},{n:'CHORUS',e:4,d:4,m:'uplifting',h:'medium',bars:32,inst:['bass','drums','strings']},{n:'BREAK',e:2,d:2,m:'melancholic',h:'slow',bars:32,inst:['piano','pad']},{n:'OUTRO',e:2,d:2,m:'melancholic',h:'slow',bars:16,inst:['pad','bass']}]},
    house:     { name:'DEEP HOUSE',    bpm:124, key:'G minor', color:'#7030c8', secs:[{n:'INTRO',e:2,d:2,m:'neutral',h:'slow',bars:16,inst:['pad']},{n:'VERSE',e:3,d:3,m:'uplifting',h:'medium',bars:32,inst:['bass','drums']},{n:'CHORUS',e:4,d:4,m:'euphoric',h:'medium',bars:32,inst:['bass','drums','pad']},{n:'BREAK',e:2,d:1,m:'neutral',h:'static',bars:16,inst:['pad']},{n:'OUTRO',e:3,d:3,m:'uplifting',h:'slow',bars:16,inst:['bass','pad']}]},
    techno:    { name:'TECHNO',        bpm:140, key:'A minor', color:'#d88020', secs:[{n:'INTRO',e:2,d:2,m:'dark',h:'static',bars:16,inst:['drums']},{n:'VERSE',e:4,d:4,m:'dark',h:'slow',bars:32,inst:['bass','drums']},{n:'CHORUS',e:5,d:5,m:'tense',h:'medium',bars:32,inst:['bass','drums','synthesizer']},{n:'BREAK',e:2,d:2,m:'dark',h:'static',bars:16,inst:['synthesizer']},{n:'OUTRO',e:3,d:3,m:'dark',h:'slow',bars:16,inst:['bass','drums']}]},
    hiphop:    { name:'HIP HOP',       bpm:90,  key:'C minor', color:'#18c868', secs:[{n:'INTRO',e:1,d:1,m:'neutral',h:'slow',bars:8,inst:['pad']},{n:'VERSE',e:3,d:3,m:'neutral',h:'medium',bars:16,inst:['bass','drums']},{n:'CHORUS',e:4,d:4,m:'uplifting',h:'medium',bars:16,inst:['bass','drums','synthesizer']},{n:'VERSE',e:3,d:3,m:'neutral',h:'medium',bars:16,inst:['bass','drums']},{n:'OUTRO',e:2,d:2,m:'neutral',h:'slow',bars:8,inst:['bass','pad']}]},
    trap:      { name:'TRAP',          bpm:140, key:'C minor', color:'#c83030', secs:[{n:'INTRO',e:1,d:1,m:'dark',h:'static',bars:8,inst:['pad']},{n:'VERSE',e:3,d:3,m:'dark',h:'slow',bars:16,inst:['sub bass','drums']},{n:'CHORUS',e:5,d:5,m:'tense',h:'medium',bars:16,inst:['sub bass','drums','synthesizer']},{n:'BREAK',e:1,d:1,m:'dark',h:'static',bars:8,inst:['pad']},{n:'OUTRO',e:2,d:2,m:'dark',h:'slow',bars:8,inst:['sub bass','pad']}]},
    lofi:      { name:'LO-FI',         bpm:85,  key:'D minor', color:'#d88020', secs:[{n:'INTRO',e:1,d:1,m:'melancholic',h:'slow',bars:8,inst:['piano']},{n:'VERSE',e:2,d:2,m:'melancholic',h:'medium',bars:32,inst:['piano','drums','bass']},{n:'CHORUS',e:3,d:3,m:'melancholic',h:'medium',bars:16,inst:['piano','drums','bass']},{n:'OUTRO',e:1,d:1,m:'melancholic',h:'slow',bars:8,inst:['piano']}]},
    ambient:   { name:'AMBIENT',       bpm:70,  key:'E minor', color:'#10b0c8', secs:[{n:'INTRO',e:1,d:1,m:'ethereal',h:'static',bars:16,inst:['pad']},{n:'VERSE',e:2,d:2,m:'ethereal',h:'slow',bars:64,inst:['pad','synthesizer']},{n:'CHORUS',e:3,d:3,m:'ethereal',h:'slow',bars:32,inst:['pad','strings','synthesizer']},{n:'OUTRO',e:1,d:1,m:'ethereal',h:'static',bars:16,inst:['pad']}]},
    cinematic: { name:'CINEMATIC',     bpm:90,  key:'D minor', color:'#7030c8', secs:[{n:'INTRO',e:1,d:1,m:'melancholic',h:'slow',bars:16,inst:['piano']},{n:'VERSE',e:3,d:3,m:'tense',h:'medium',bars:32,inst:['strings','piano']},{n:'CHORUS',e:5,d:5,m:'uplifting',h:'active',bars:32,inst:['strings','drums','piano']},{n:'BREAK',e:2,d:2,m:'melancholic',h:'slow',bars:16,inst:['piano','pad']},{n:'OUTRO',e:3,d:2,m:'melancholic',h:'slow',bars:16,inst:['strings','pad']}]},
    dubstep:   { name:'DUBSTEP',       bpm:140, key:'A minor', color:'#18c868', secs:[{n:'INTRO',e:1,d:1,m:'dark',h:'static',bars:8,inst:['pad']},{n:'VERSE',e:3,d:3,m:'dark',h:'slow',bars:16,inst:['bass','drums']},{n:'CHORUS',e:5,d:5,m:'tense',h:'medium',bars:32,inst:['bass','drums','synthesizer']},{n:'BREAK',e:1,d:1,m:'dark',h:'static',bars:16,inst:['pad']},{n:'CHORUS',e:5,d:5,m:'tense',h:'active',bars:32,inst:['bass','drums','synthesizer']},{n:'OUTRO',e:2,d:2,m:'dark',h:'slow',bars:16,inst:['bass']}]},
    piano:     { name:'SOLO PIANO',    bpm:63,  key:'D minor', color:'#9ab0c8', secs:[{n:'INTRO',e:1,d:1,m:'melancholic',h:'slow',bars:8,inst:['piano']},{n:'VERSE',e:2,d:2,m:'melancholic',h:'medium',bars:16,inst:['piano']},{n:'CHORUS',e:3,d:3,m:'melancholic',h:'medium',bars:16,inst:['piano']},{n:'OUTRO',e:1,d:1,m:'melancholic',h:'slow',bars:8,inst:['piano']}]},
  },
};

const ALL_INSTS = ['bass','drums','pad','piano','strings','synthesizer','acoustic guitar','electric guitar','sub bass','hi-hats','brass','voice'];
const MOODS = ['dark','melancholic','neutral','tense','uplifting','euphoric','ethereal'];
const HARMONIES = ['static','slow','medium','active'];
const BARS_OPTIONS = [8,16,32,64];
const KEYS = ['D minor','A minor','E minor','G minor','C minor','B minor','F minor','C major','G major','D major','A major','E major','F major'];
const SEC_COLORS = { INTRO:'#18c868', VERSE:'#2060e0', CHORUS:'#c83030', BRIDGE:'#d88020', BREAK:'#10b0c8', OUTRO:'#7030c8' };
const SEC_NAMES = ['INTRO','VERSE','CHORUS','BRIDGE','BREAK','OUTRO'];

// ══════════════════════════════════════════
// OFFLINE PROMPT BUILDER
// ══════════════════════════════════════════
function buildPrompt(sections, bpm, key, vocals) {
  const chords = KB.harmony[key] || KB.harmony['D minor'];
  const instAll = [...new Set(sections.flatMap(s => s.instruments))];
  const isInstr = vocals === 'instrumental';

  const styleParts = [
    `${bpm} BPM`, key,
    isInstr ? 'no vocals, no singing, instrumental only' : 'vocal track',
    instAll.join(', '),
    sections[0]?.mood || 'melancholic',
    'controlled structure', 'no randomness', 'professional mix',
  ];
  const style = styleParts.join(', ').slice(0, 1000);

  let ctrl = '';
  if (isInstr) ctrl += '[INSTRUMENTAL ONLY]\n[NO VOCALS]\n[NO SINGING]\n\n';

  sections.forEach(sec => {
    ctrl += `[${sec.name}]\n`;
    sec.instruments.forEach(inst => {
      const beh = sec.behaviors?.[inst]?.trim();
      if (beh) {
        ctrl += `[${inst}: ${beh}]\n`;
      } else {
        const line = KB.instruments[inst]?.[sec.mood] || `[${inst}: ${sec.mood} character]`;
        ctrl += line + '\n';
      }
    });
    const harmChords = chords[sec.harmony] || chords.medium;
    ctrl += `[harmony: ${harmChords}]\n`;
    ctrl += `[dynamic: ${KB.dynamic[sec.energy] || 'mp'}]\n\n`;
  });

  return { style, ctrl: ctrl.trim() };
}

// ══════════════════════════════════════════
// APP
// ══════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState('home');
  const [bpm, setBpm] = useState('174');
  const [key, setKey] = useState('D minor');
  const [vocals, setVocals] = useState('instrumental');
  const [sections, setSections] = useState([]);
  const [expandedSec, setExpandedSec] = useState(null);
  const [output, setOutput] = useState(null);
  const [step, setStep] = useState(1);
  const [apiKey, setApiKey] = useState('');
  const [showApiModal, setShowApiModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');

  const applyGenre = useCallback((gid) => {
    const tmpl = KB.genres[gid];
    if (!tmpl) return;
    setBpm(String(tmpl.bpm));
    setKey(tmpl.key);
    const newSecs = tmpl.secs.map(s => ({
      name: s.n, energy: s.e, density: s.d, mood: s.m,
      harmony: s.h, bars: s.bars,
      instruments: s.inst.slice(0, 3),
      behaviors: {},
    }));
    setSections(newSecs);
    setExpandedSec(null);
    setStep(2);
    setScreen('build');
  }, []);

  const toggleInst = useCallback((secIdx, inst) => {
    setSections(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const sec = next[secIdx];
      if (sec.instruments.includes(inst)) {
        sec.instruments = sec.instruments.filter(i => i !== inst);
        delete sec.behaviors[inst];
      } else {
        if (sec.instruments.length >= 3) {
          Alert.alert('Max 3 instruments per section');
          return prev;
        }
        sec.instruments.push(inst);
      }
      return next;
    });
    setStep(s => Math.max(s, 3));
  }, []);

  const updateBeh = useCallback((secIdx, inst, text) => {
    setSections(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      next[secIdx].behaviors[inst] = text;
      return next;
    });
  }, []);

  const updateSec = useCallback((secIdx, field, value) => {
    setSections(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      next[secIdx][field] = value;
      return next;
    });
  }, []);

  const addSection = useCallback((name) => {
    setSections(prev => [...prev, {
      name, energy: 3, density: 2, mood: 'melancholic',
      harmony: 'medium', bars: 16, instruments: [], behaviors: {}
    }]);
    setStep(s => Math.max(s, 2));
  }, []);

  const delSection = useCallback((idx) => {
    setSections(prev => prev.filter((_, i) => i !== idx));
    setExpandedSec(null);
  }, []);

  const generate = useCallback(() => {
    if (!sections.length) { Alert.alert('Add sections first'); return; }
    if (sections.some(s => !s.instruments.length)) {
      Alert.alert('Each section needs at least one instrument');
      return;
    }
    const result = buildPrompt(sections, bpm, key, vocals);
    setOutput(result);
    setStep(4);
    setScreen('output');
  }, [sections, bpm, key, vocals]);

  const copyText = useCallback((text, label) => {
    Clipboard.setString(text);
    Alert.alert(`✓ ${label} copied to clipboard`);
  }, []);

  const saveApiKey = useCallback(() => {
    setApiKey(apiKeyInput.trim());
    setShowApiModal(false);
    Alert.alert('API key saved');
  }, [apiKeyInput]);

  if (screen === 'home') {
    return (
      <HomeScreen
        onSelect={applyGenre}
        apiKey={apiKey}
        onApiKey={() => { setApiKeyInput(apiKey); setShowApiModal(true); }}
        showApiModal={showApiModal}
        apiKeyInput={apiKeyInput}
        onApiKeyChange={setApiKeyInput}
        onSaveApiKey={saveApiKey}
        onCloseApiModal={() => setShowApiModal(false)}
      />
    );
  }

  if (screen === 'output') {
    return (
      <OutputScreen
        output={output}
        onCopy={copyText}
        onBack={() => setScreen('build')}
        onNew={() => { setSections([]); setOutput(null); setStep(1); setScreen('home'); }}
      />
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#10131a" />

      {/* HEADER */}
      <View style={s.hdr}>
        <TouchableOpacity onPress={() => setScreen('home')} style={s.backBtn}>
          <Text style={s.backTxt}>← HOME</Text>
        </TouchableOpacity>
        <Text style={s.hdrInfo}>{bpm} BPM · {key}</Text>
        <TouchableOpacity onPress={generate} style={s.genBtn}>
          <Text style={s.genTxt}>GENERATE ›</Text>
        </TouchableOpacity>
      </View>

      {/* GUIDE */}
      <View style={s.guide}>
        {[{n:1,l:'TEMPLATE'},{n:2,l:'SECTIONS'},{n:3,l:'INSTRUMENTS'},{n:4,l:'GENERATE'}].map((gs, i) => (
          <React.Fragment key={gs.n}>
            <View style={s.gsWrap}>
              <View style={[s.gsNum, step > gs.n && s.gsDone, step === gs.n && s.gsActive]}>
                <Text style={[s.gsNTxt, step >= gs.n && s.gsNTxtOn]}>
                  {step > gs.n ? '✓' : gs.n}
                </Text>
              </View>
              <Text style={[s.gsLbl, step === gs.n && s.gsLblActive, step > gs.n && s.gsLblDone]}>
                {gs.l}
              </Text>
            </View>
            {i < 3 && <Text style={s.gsArr}>›</Text>}
          </React.Fragment>
        ))}
      </View>

      <ScrollView style={s.scroll} keyboardShouldPersistTaps="handled">

        {/* GLOBAL */}
        <View style={s.blk}>
          <Text style={s.blkT}>GLOBAL SETTINGS</Text>

          <Text style={s.fldL}>BPM</Text>
          <TextInput
            style={s.bpmInput}
            value={bpm}
            onChangeText={setBpm}
            keyboardType="number-pad"
            placeholderTextColor="#3a4a5e"
          />

          <Text style={s.fldL}>KEY</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={s.chipRow}>
              {KEYS.map(k => (
                <TouchableOpacity key={k} style={[s.chip, key === k && s.chipOn]} onPress={() => setKey(k)}>
                  <Text style={[s.chipT, key === k && s.chipTOn]}>{k}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <Text style={s.fldL}>VOCALS</Text>
          <View style={s.chipRow}>
            <TouchableOpacity style={[s.chip, vocals === 'instrumental' && s.chipOn]} onPress={() => setVocals('instrumental')}>
              <Text style={[s.chipT, vocals === 'instrumental' && s.chipTOn]}>INSTRUMENTAL</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.chip, vocals === 'vocal' && s.chipOn]} onPress={() => setVocals('vocal')}>
              <Text style={[s.chipT, vocals === 'vocal' && s.chipTOn]}>VOCAL</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ADD SECTIONS */}
        <View style={s.blk}>
          <Text style={s.blkT}>ADD SECTION</Text>
          <View style={s.secGrid}>
            {SEC_NAMES.map(name => (
              <TouchableOpacity
                key={name}
                style={[s.secTypeBtn, { borderColor: (SEC_COLORS[name] || '#888') + '55' }]}
                onPress={() => addSection(name)}
              >
                <Text style={[s.secTypeT, { color: SEC_COLORS[name] || '#888' }]}>{name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* SECTION CARDS */}
        {sections.length === 0 && (
          <View style={s.empty}>
            <Text style={s.emptyT}>Tap section type above to add it{'\n'}or go back and choose a template</Text>
          </View>
        )}

        {sections.map((sec, idx) => (
          <SectionCard
            key={idx}
            sec={sec}
            idx={idx}
            expanded={expandedSec === idx}
            onToggle={() => setExpandedSec(expandedSec === idx ? null : idx)}
            onUpdate={(f, v) => updateSec(idx, f, v)}
            onToggleInst={inst => toggleInst(idx, inst)}
            onUpdateBeh={(inst, text) => updateBeh(idx, inst, text)}
            onDelete={() => delSection(idx)}
          />
        ))}

        {/* GENERATE BUTTON (bottom) */}
        {sections.length > 0 && (
          <View style={s.blk}>
            <TouchableOpacity style={s.bigGenBtn} onPress={generate}>
              <Text style={s.bigGenT}>GENERATE PROMPT →</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ══════════════════════════════════════════
// HOME SCREEN
// ══════════════════════════════════════════
function HomeScreen({ onSelect, apiKey, onApiKey, showApiModal, apiKeyInput, onApiKeyChange, onSaveApiKey, onCloseApiModal }) {
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#10131a" />

      <View style={s.homeHdr}>
        <View>
          <Text style={s.logo}>PAUSE</Text>
          <Text style={s.logoSub}>STUDIO</Text>
        </View>
        <TouchableOpacity style={s.apiBtn} onPress={onApiKey}>
          <Text style={s.apiBtnT}>{apiKey ? '⚙ API ✓' : '⚙ API KEY'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={s.homeHint}>Choose a genre template to start ↓</Text>

      <ScrollView style={s.scroll}>
        <View style={s.tmplGrid}>
          {Object.entries(KB.genres).map(([id, tmpl]) => (
            <TouchableOpacity
              key={id}
              style={[s.tmplCard, { borderLeftColor: tmpl.color, borderLeftWidth: 3 }]}
              onPress={() => onSelect(id)}
              activeOpacity={0.7}
            >
              <Text style={[s.tmplName, { color: tmpl.color }]}>{tmpl.name}</Text>
              <Text style={s.tmplMeta}>{tmpl.bpm} BPM · {tmpl.key}</Text>
              <Text style={s.tmplSecs}>{tmpl.secs.length} sections</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* API KEY MODAL */}
      <Modal visible={showApiModal} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <Text style={s.modalTitle}>API KEY</Text>
            <Text style={s.modalDesc}>
              Optional. Enables AI-powered behavior translation.{'\n'}
              Free key at aistudio.google.com (Gemini){'\n'}
              or console.anthropic.com (Claude)
            </Text>
            <TextInput
              style={s.modalInput}
              value={apiKeyInput}
              onChangeText={onApiKeyChange}
              placeholder="Paste your API key here..."
              placeholderTextColor="#3a4a5e"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={s.modalBtns}>
              <TouchableOpacity style={s.modalBtnSave} onPress={onSaveApiKey}>
                <Text style={s.modalBtnSaveT}>SAVE</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.modalBtnCancel} onPress={onCloseApiModal}>
                <Text style={s.modalBtnCancelT}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ══════════════════════════════════════════
// SECTION CARD
// ══════════════════════════════════════════
function SectionCard({ sec, idx, expanded, onToggle, onUpdate, onToggleInst, onUpdateBeh, onDelete }) {
  const col = SEC_COLORS[sec.name] || '#888';
  return (
    <View style={[s.secCard, expanded && { borderLeftColor: col, borderLeftWidth: 3 }]}>
      <TouchableOpacity style={s.secHdr} onPress={onToggle}>
        <View style={[s.secDot, { backgroundColor: col }]} />
        <Text style={[s.secName, { color: col }]}>{sec.name}</Text>
        <Text style={s.secMeta}>E{sec.energy} · {sec.bars}b · {sec.instruments.join('+') || '—'}</Text>
        <Text style={s.secCaret}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={s.secBody}>

          {/* ENERGY */}
          <Text style={s.fldL}>ENERGY</Text>
          <View style={s.row5}>
            {[1,2,3,4,5].map(n => (
              <TouchableOpacity key={n} style={[s.btn5, sec.energy === n && s.btn5On]} onPress={() => onUpdate('energy', n)}>
                <Text style={[s.btn5T, sec.energy === n && s.btn5TOn]}>{n}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* MOOD */}
          <Text style={s.fldL}>MOOD</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={s.chipRow}>
              {MOODS.map(m => (
                <TouchableOpacity key={m} style={[s.chip, sec.mood === m && s.chipOn]} onPress={() => onUpdate('mood', m)}>
                  <Text style={[s.chipT, sec.mood === m && s.chipTOn]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* HARMONY */}
          <Text style={s.fldL}>CHORD MOVEMENT</Text>
          <View style={s.chipRow}>
            {HARMONIES.map(h => (
              <TouchableOpacity key={h} style={[s.chip, sec.harmony === h && s.chipOn]} onPress={() => onUpdate('harmony', h)}>
                <Text style={[s.chipT, sec.harmony === h && s.chipTOn]}>{h}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* BARS */}
          <Text style={s.fldL}>BARS</Text>
          <View style={s.chipRow}>
            {BARS_OPTIONS.map(b => (
              <TouchableOpacity key={b} style={[s.chip, sec.bars === b && s.chipOn]} onPress={() => onUpdate('bars', b)}>
                <Text style={[s.chipT, sec.bars === b && s.chipTOn]}>{b}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* INSTRUMENTS */}
          <Text style={s.fldL}>INSTRUMENTS ({sec.instruments.length}/3)</Text>
          <View style={s.instGrid}>
            {ALL_INSTS.map(inst => {
              const on = sec.instruments.includes(inst);
              const dis = !on && sec.instruments.length >= 3;
              return (
                <TouchableOpacity
                  key={inst}
                  style={[s.instChip, on && s.instChipOn, dis && s.instChipDis]}
                  onPress={() => !dis && onToggleInst(inst)}
                >
                  <Text style={[s.instT, on && s.instTOn]}>{inst}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* BEHAVIORS */}
          {sec.instruments.length > 0 && (
            <>
              <Text style={s.fldL}>INSTRUMENT BEHAVIOR</Text>
              {sec.instruments.map(inst => (
                <View key={inst} style={s.behBlk}>
                  <Text style={s.behInst}>{inst.toUpperCase()}</Text>
                  <TextInput
                    style={s.behInput}
                    value={sec.behaviors[inst] || ''}
                    onChangeText={text => onUpdateBeh(inst, text)}
                    placeholder="Describe in your words, or leave empty for auto..."
                    placeholderTextColor="#3a4a5e"
                    multiline
                    numberOfLines={2}
                  />
                </View>
              ))}
            </>
          )}

          <TouchableOpacity style={s.delBtn} onPress={onDelete}>
            <Text style={s.delT}>✕ DELETE SECTION</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ══════════════════════════════════════════
// OUTPUT SCREEN
// ══════════════════════════════════════════
function OutputScreen({ output, onCopy, onBack, onNew }) {
  const [rated, setRated] = useState(null);

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#10131a" />

      <View style={s.hdr}>
        <TouchableOpacity onPress={onBack} style={s.backBtn}>
          <Text style={s.backTxt}>← EDIT</Text>
        </TouchableOpacity>
        <Text style={s.hdrInfo}>OUTPUT</Text>
        <TouchableOpacity onPress={onNew} style={s.newBtn}>
          <Text style={s.newBtnT}>NEW TRACK</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={s.scroll}>

        {/* STYLE */}
        <View style={s.outBlk}>
          <View style={s.outHdr}>
            <Text style={s.outTitle}>STYLE WINDOW</Text>
            <Text style={[s.outCnt, output.style.length > 1000 && s.outCntOver]}>
              {output.style.length}/1000
            </Text>
            <TouchableOpacity style={s.copyBtn} onPress={() => onCopy(output.style, 'Style Window')}>
              <Text style={s.copyBtnT}>COPY ↗</Text>
            </TouchableOpacity>
          </View>
          <View style={s.outBox}>
            <Text style={s.outStyleT} selectable>{output.style}</Text>
          </View>
        </View>

        {/* CONTROL */}
        <View style={s.outBlk}>
          <View style={s.outHdr}>
            <Text style={s.outTitle}>CONTROL WINDOW</Text>
            <TouchableOpacity style={[s.copyBtn, s.copyBtnBlue]} onPress={() => onCopy(output.ctrl, 'Control Window')}>
              <Text style={[s.copyBtnT, { color: '#2060e0' }]}>COPY ↗</Text>
            </TouchableOpacity>
          </View>
          <View style={s.outBox}>
            <Text style={s.outCtrlT} selectable>{output.ctrl}</Text>
          </View>
        </View>

        {/* RATE */}
        <View style={s.rateBlk}>
          <Text style={s.rateTitle}>DID THIS WORK IN SUNO?</Text>
          <Text style={s.rateDesc}>Rate after listening to help build your knowledge base</Text>
          <View style={s.rateRow}>
            {[
              { label: '✓ YES', key: 'yes', color: '#18c868', bg: 'rgba(24,200,104,.08)' },
              { label: '~ PARTIAL', key: 'partial', color: '#d88020', bg: 'rgba(216,128,32,.08)' },
              { label: '✗ NO', key: 'no', color: '#c83030', bg: 'rgba(200,48,48,.08)' },
            ].map(r => (
              <TouchableOpacity
                key={r.key}
                style={[s.rateBtn, { borderColor: r.color + '66', backgroundColor: rated === r.key ? r.bg : 'transparent' }]}
                onPress={() => setRated(r.key)}
              >
                <Text style={[s.rateBtnT, { color: r.color }]}>{r.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {rated && (
            <Text style={s.ratedMsg}>
              {rated === 'yes' ? '✓ Great — saved to working patterns' : rated === 'partial' ? '~ Noted — partial match' : '✗ Noted — will avoid this combination'}
            </Text>
          )}
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ══════════════════════════════════════════
// STYLES
// ══════════════════════════════════════════
const C = {
  bg:'#10131a', bg2:'#141820', bg3:'#191e28', bg4:'#1e2430',
  b1:'#242c3a', b2:'#2c3648',
  text:'#7a90a8', bright:'#ccdaea', dim:'#3a4a5e',
  acc:'#2060e0', grn:'#18c868', amb:'#d88020', red:'#c83030',
};

const s = StyleSheet.create({
  safe:   { flex:1, backgroundColor:C.bg },
  scroll: { flex:1 },

  // HOME
  homeHdr: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:16, paddingTop:24, paddingBottom:12 },
  logo:    { fontSize:28, fontWeight:'900', color:C.acc, letterSpacing:8, fontFamily:'monospace' },
  logoSub: { fontSize:9, color:C.dim, letterSpacing:6, fontFamily:'monospace' },
  homeHint:{ textAlign:'center', color:C.dim, fontSize:12, marginBottom:14, fontFamily:'monospace', fontWeight:'600' },
  apiBtn:  { borderWidth:1, borderColor:'rgba(24,200,104,.4)', paddingHorizontal:12, paddingVertical:8 },
  apiBtnT: { color:C.grn, fontSize:10, fontFamily:'monospace', fontWeight:'700' },
  tmplGrid:{ flexDirection:'row', flexWrap:'wrap', paddingHorizontal:12, gap:8, paddingTop:4 },
  tmplCard:{ width:'47%', backgroundColor:C.bg2, borderWidth:1, borderColor:C.b1, padding:14, borderRadius:2 },
  tmplName:{ fontSize:12, fontWeight:'700', fontFamily:'monospace', marginBottom:5, letterSpacing:1 },
  tmplMeta:{ color:C.text, fontSize:10, fontFamily:'monospace', marginBottom:3 },
  tmplSecs:{ color:C.dim, fontSize:9, fontFamily:'monospace' },

  // HEADER
  hdr:     { flexDirection:'row', alignItems:'center', backgroundColor:C.bg2, borderBottomWidth:1, borderBottomColor:C.b1, paddingHorizontal:14, paddingVertical:11 },
  backBtn: { paddingRight:12 },
  backTxt: { color:C.dim, fontSize:10, fontFamily:'monospace', fontWeight:'700', letterSpacing:1 },
  hdrInfo: { flex:1, textAlign:'center', color:C.bright, fontSize:11, fontFamily:'monospace', fontWeight:'700' },
  genBtn:  { backgroundColor:'rgba(32,96,224,.15)', borderWidth:1, borderColor:'rgba(32,96,224,.5)', paddingHorizontal:12, paddingVertical:7 },
  genTxt:  { color:C.acc, fontSize:10, fontFamily:'monospace', fontWeight:'700' },
  newBtn:  { borderWidth:1, borderColor:C.b2, paddingHorizontal:10, paddingVertical:6 },
  newBtnT: { color:C.dim, fontSize:9, fontFamily:'monospace', fontWeight:'700' },

  // GUIDE
  guide:    { flexDirection:'row', alignItems:'center', justifyContent:'center', backgroundColor:C.bg2, borderBottomWidth:1, borderBottomColor:C.b1, paddingHorizontal:8, paddingVertical:9, gap:4 },
  gsWrap:   { alignItems:'center', gap:3 },
  gsNum:    { width:20, height:20, borderRadius:10, borderWidth:1, borderColor:C.b2, alignItems:'center', justifyContent:'center' },
  gsActive: { backgroundColor:C.acc, borderColor:C.acc },
  gsDone:   { backgroundColor:C.grn, borderColor:C.grn },
  gsNTxt:   { color:C.dim, fontSize:8, fontWeight:'700', fontFamily:'monospace' },
  gsNTxtOn: { color:'#fff' },
  gsLbl:    { color:C.dim, fontSize:7, fontFamily:'monospace', fontWeight:'700', letterSpacing:.5 },
  gsLblActive:{ color:C.bright },
  gsLblDone:{ color:C.grn },
  gsArr:    { color:C.b2, fontSize:14, marginHorizontal:3 },

  // BLOCKS
  blk:    { backgroundColor:C.bg2, borderBottomWidth:1, borderBottomColor:C.b1, padding:14 },
  blkT:   { color:C.dim, fontSize:8, fontFamily:'monospace', fontWeight:'700', letterSpacing:3, marginBottom:12, textTransform:'uppercase' },
  fldL:   { color:C.dim, fontSize:8, fontFamily:'monospace', fontWeight:'700', letterSpacing:2, marginBottom:7, marginTop:10, textTransform:'uppercase' },

  // BPM
  bpmInput:{ backgroundColor:C.bg4, borderWidth:1, borderColor:C.b1, color:C.bright, fontFamily:'monospace', fontSize:16, fontWeight:'700', padding:8, width:90, textAlign:'center', marginBottom:4 },

  // CHIPS
  chipRow: { flexDirection:'row', flexWrap:'wrap', gap:6, marginBottom:4 },
  chip:    { paddingHorizontal:11, paddingVertical:7, borderWidth:1, borderColor:C.b2, borderRadius:2 },
  chipOn:  { borderColor:C.acc, backgroundColor:'rgba(32,96,224,.1)' },
  chipT:   { color:C.dim, fontSize:10, fontFamily:'monospace', fontWeight:'700' },
  chipTOn: { color:C.acc },

  // ENERGY 1-5
  row5:   { flexDirection:'row', gap:6, marginBottom:4 },
  btn5:   { flex:1, paddingVertical:10, borderWidth:1, borderColor:C.b2, alignItems:'center', borderRadius:2 },
  btn5On: { borderColor:C.acc, backgroundColor:'rgba(32,96,224,.1)' },
  btn5T:  { color:C.dim, fontSize:13, fontFamily:'monospace', fontWeight:'700' },
  btn5TOn:{ color:C.acc },

  // SECTIONS
  secGrid:    { flexDirection:'row', flexWrap:'wrap', gap:6 },
  secTypeBtn: { paddingHorizontal:14, paddingVertical:10, borderWidth:1, borderRadius:2, minWidth:'30%', alignItems:'center' },
  secTypeT:   { fontSize:10, fontFamily:'monospace', fontWeight:'700', letterSpacing:1 },
  secCard:    { backgroundColor:C.bg2, borderBottomWidth:1, borderBottomColor:C.b1 },
  secHdr:     { flexDirection:'row', alignItems:'center', padding:14, gap:9 },
  secDot:     { width:9, height:9, borderRadius:5 },
  secName:    { fontSize:12, fontFamily:'monospace', fontWeight:'700', letterSpacing:2, flex:1 },
  secMeta:    { color:C.dim, fontSize:9, fontFamily:'monospace', fontWeight:'600' },
  secCaret:   { color:C.dim, fontSize:11 },
  secBody:    { padding:14, paddingTop:4 },

  // INSTRUMENTS
  instGrid:   { flexDirection:'row', flexWrap:'wrap', gap:6, marginBottom:10 },
  instChip:   { paddingHorizontal:10, paddingVertical:7, borderWidth:1, borderColor:C.b2, borderRadius:2 },
  instChipOn: { borderColor:C.acc, backgroundColor:'rgba(32,96,224,.08)' },
  instChipDis:{ opacity:.25 },
  instT:      { color:C.dim, fontSize:10, fontFamily:'monospace', fontWeight:'700' },
  instTOn:    { color:C.acc },

  // BEHAVIOR
  behBlk:  { backgroundColor:C.bg4, borderWidth:1, borderColor:C.b1, padding:10, marginBottom:6, borderRadius:2 },
  behInst: { color:C.acc, fontSize:8, fontFamily:'monospace', fontWeight:'700', letterSpacing:2, marginBottom:5 },
  behInput:{ color:C.bright, fontSize:11, fontFamily:'monospace', borderBottomWidth:1, borderBottomColor:C.b1, paddingVertical:5, minHeight:36 },

  // DELETE
  delBtn:  { borderWidth:1, borderColor:'rgba(200,48,48,.3)', padding:10, alignItems:'center', marginTop:12, borderRadius:2 },
  delT:    { color:C.red, fontSize:10, fontFamily:'monospace', fontWeight:'700', letterSpacing:1 },

  // BIG GENERATE
  bigGenBtn: { backgroundColor:'rgba(32,96,224,.12)', borderWidth:1, borderColor:'rgba(32,96,224,.5)', padding:16, alignItems:'center', borderRadius:2 },
  bigGenT:   { color:C.acc, fontSize:14, fontFamily:'monospace', fontWeight:'700', letterSpacing:3 },

  // EMPTY
  empty:  { padding:40, alignItems:'center' },
  emptyT: { color:C.dim, fontSize:11, fontFamily:'monospace', textAlign:'center', lineHeight:22 },

  // OUTPUT
  outBlk:  { margin:12, marginBottom:8 },
  outHdr:  { flexDirection:'row', alignItems:'center', marginBottom:7, gap:8 },
  outTitle:{ color:C.dim, fontSize:8, fontFamily:'monospace', fontWeight:'700', letterSpacing:3, flex:1 },
  outCnt:  { color:C.grn, fontSize:9, fontFamily:'monospace', fontWeight:'700' },
  outCntOver:{ color:C.red },
  copyBtn: { borderWidth:1, borderColor:'rgba(24,200,104,.4)', paddingHorizontal:11, paddingVertical:5, borderRadius:2 },
  copyBtnBlue:{ borderColor:'rgba(32,96,224,.4)' },
  copyBtnT:{ color:C.grn, fontSize:9, fontFamily:'monospace', fontWeight:'700' },
  outBox:  { backgroundColor:C.bg3, borderWidth:1, borderColor:C.b1, padding:12, borderRadius:2 },
  outStyleT:{ color:'#5ae890', fontSize:10, fontFamily:'monospace', lineHeight:18 },
  outCtrlT: { color:'#7ab4ff', fontSize:10, fontFamily:'monospace', lineHeight:18 },

  // RATE
  rateBlk:  { margin:12, backgroundColor:C.bg2, borderWidth:1, borderColor:C.b1, padding:16, borderRadius:2 },
  rateTitle:{ color:C.bright, fontSize:12, fontFamily:'monospace', fontWeight:'700', marginBottom:5, textAlign:'center' },
  rateDesc: { color:C.dim, fontSize:9, fontFamily:'monospace', textAlign:'center', marginBottom:12 },
  rateRow:  { flexDirection:'row', gap:8 },
  rateBtn:  { flex:1, paddingVertical:12, borderWidth:1, alignItems:'center', borderRadius:2 },
  rateBtnT: { fontSize:10, fontFamily:'monospace', fontWeight:'700' },
  ratedMsg: { color:C.text, fontSize:9, fontFamily:'monospace', textAlign:'center', marginTop:10 },

  // MODAL
  modalOverlay: { flex:1, backgroundColor:'rgba(0,0,0,.8)', justifyContent:'flex-end' },
  modalSheet:   { backgroundColor:C.bg2, padding:20, paddingBottom:36, borderTopWidth:1, borderTopColor:C.b3 },
  modalTitle:   { color:C.bright, fontSize:14, fontFamily:'monospace', fontWeight:'700', letterSpacing:3, marginBottom:10 },
  modalDesc:    { color:C.dim, fontSize:10, fontFamily:'monospace', lineHeight:18, marginBottom:14 },
  modalInput:   { backgroundColor:C.bg4, borderWidth:1, borderColor:C.b1, color:C.bright, fontFamily:'monospace', fontSize:12, padding:12, marginBottom:14, borderRadius:2 },
  modalBtns:    { flexDirection:'row', gap:8 },
  modalBtnSave: { flex:1, backgroundColor:'rgba(32,96,224,.12)', borderWidth:1, borderColor:'rgba(32,96,224,.5)', padding:12, alignItems:'center', borderRadius:2 },
  modalBtnSaveT:{ color:C.acc, fontSize:11, fontFamily:'monospace', fontWeight:'700' },
  modalBtnCancel:{ flex:1, borderWidth:1, borderColor:C.b1, padding:12, alignItems:'center', borderRadius:2 },
  modalBtnCancelT:{ color:C.dim, fontSize:11, fontFamily:'monospace', fontWeight:'700' },
});
