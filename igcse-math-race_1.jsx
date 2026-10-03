import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Clock, Zap, Check, X, Play, RotateCcw, Award, Car, ChevronRight, ListOrdered, Medal, Flag } from 'lucide-react';

const QUESTION_TIME = 25;
const RACE_DISTANCE = 100;

const TOPICS = [
  { id: 'number', label: 'Number', color: '#F2A93B' },
  { id: 'algebra', label: 'Algebra', color: '#E85D4C' },
  { id: 'geometry', label: 'Geometry & Measures', color: '#3FBFAE' },
  { id: 'stats', label: 'Statistics & Probability', color: '#9B7BD6' },
  { id: 'ratio', label: 'Ratio & Proportion', color: '#5B8DEF' },
];

const RACERS_TEMPLATE = [
  { id: 'player', name: 'You', color: '#F2A93B', isPlayer: true },
  { id: 'zayed', name: 'Zayed', color: '#E85D4C', isPlayer: false },
  { id: 'mei', name: 'Mei', color: '#3FBFAE', isPlayer: false },
  { id: 'lucas', name: 'Lucas', color: '#9B7BD6', isPlayer: false },
];

const QUESTIONS = [
  { id: 'n1', topic: 'number', q: 'Rationalise: 1 / (√5 − 2)', options: ['√5 + 2', '√5 − 2', '5 + 2√5', '1/√5'], answer: 0 },
  { id: 'n2', topic: 'number', q: 'Write the recurring decimal 0.4̇5̇ as a fraction', options: ['5/11', '9/20', '4/9', '45/100'], answer: 0 },
  { id: 'n3', topic: 'number', q: 'A length is 3.6 cm, correct to 1 d.p. Find the upper bound', options: ['3.65 cm', '3.64 cm', '3.649 cm', '3.6 cm'], answer: 0 },
  { id: 'n4', topic: 'number', q: 'Simplify (2x⁻³)⁻²', options: ['x⁶/4', '4x⁶', 'x⁶/2', '2x⁻⁶'], answer: 0 },
  { id: 'n5', topic: 'number', q: 'Evaluate 8^(2/3)', options: ['4', '16', '2', '64/3'], answer: 0 },
  { id: 'n6', topic: 'number', q: '$2000 is invested at 5% compound interest for 3 years. Find the total (nearest $)', options: ['$2315', '$2300', '$2100', '$2400'], answer: 0 },
  { id: 'n7', topic: 'number', q: 'Find the LCM of 18 and 24', options: ['72', '36', '144', '6'], answer: 0 },
  { id: 'n8', topic: 'number', q: 'Simplify √48 − √12', options: ['2√3', '√36', '6√3', '2√6'], answer: 0 },
  { id: 'n9', topic: 'number', q: 'Work out (5.2 × 10⁴) ÷ (2 × 10⁻²), in standard form', options: ['2.6 × 10⁶', '2.6 × 10⁻²', '1.04 × 10²', '2.6 × 10⁻⁶'], answer: 0 },
  { id: 'n10', topic: 'number', q: 'A quantity increases from 80 to 92. Find the percentage increase', options: ['15%', '12%', '16.67%', '13%'], answer: 0 },

  { id: 'a1', topic: 'algebra', q: 'Solve using the quadratic formula: 2x² − 3x − 5 = 0', options: ['x = 2.5 or x = −1', 'x = 1 or x = −2.5', 'x = 5 or x = −2', 'x = −2.5 or x = 1'], answer: 0 },
  { id: 'a2', topic: 'algebra', q: 'Simplify (x² − 9) / (x² + x − 6)', options: ['(x−3)/(x−2)', '(x+3)/(x−2)', '(x−3)/(x+2)', 'x − 3'], answer: 0 },
  { id: 'a3', topic: 'algebra', q: 'Solve: y = x² − 1 and y = 2x + 2 simultaneously', options: ['(3,8) and (−1,0)', '(3,8) and (1,4)', '(−3,−4) and (1,4)', '(3,8) only'], answer: 0 },
  { id: 'a4', topic: 'algebra', q: 'Expand and simplify (2x − 3)²', options: ['4x² − 12x + 9', '4x² − 9', '4x² + 12x + 9', '2x² − 12x + 9'], answer: 0 },
  { id: 'a5', topic: 'algebra', q: 'Solve the inequality: 3(x − 2) > 2x + 1', options: ['x > 7', 'x > 1', 'x < 7', 'x > −7'], answer: 0 },
  { id: 'a6', topic: 'algebra', q: 'Find the equation of the line perpendicular to y = 2x + 1, through (0, 3)', options: ['y = −½x + 3', 'y = 2x + 3', 'y = −2x + 3', 'y = ½x + 3'], answer: 0 },
  { id: 'a7', topic: 'algebra', q: 'Factorise fully: 6x² − 11x − 10', options: ['(2x − 5)(3x + 2)', '(2x + 5)(3x − 2)', '(6x − 5)(x + 2)', '(3x − 5)(2x + 2)'], answer: 0 },
  { id: 'a8', topic: 'algebra', q: 'The nth term of a quadratic sequence is n² + 2n. Find the 6th term', options: ['48', '38', '44', '40'], answer: 0 },
  { id: 'a9', topic: 'algebra', q: 'Solve: (x+1)/3 − (x−2)/4 = 1', options: ['x = 2', 'x = 1', 'x = 4', 'x = −2'], answer: 0 },
  { id: 'a10', topic: 'algebra', q: 'f(x) = 2x − 5, g(x) = x². Find fg(3)', options: ['13', '1', '4', '31'], answer: 0 },

  { id: 'g1', topic: 'geometry', q: 'Two similar triangles have sides in ratio 2:5. The smaller area is 8 cm². Find the larger area', options: ['50 cm²', '20 cm²', '40 cm²', '32 cm²'], answer: 0 },
  { id: 'g2', topic: 'geometry', q: 'Triangle ABC: a=8, b=10, angle C=60°. Find side c (cosine rule, 1 d.p.)', options: ['9.2', '8.4', '10.5', '7.7'], answer: 0 },
  { id: 'g3', topic: 'geometry', q: 'A sector has radius 6 cm and angle 120°. Find its area (π ≈ 3.14, nearest whole)', options: ['38 cm²', '24 cm²', '75 cm²', '12 cm²'], answer: 0 },
  { id: 'g4', topic: 'geometry', q: 'Circle theorem: the angle in a semicircle is', options: ['90°', '180°', '45°', '60°'], answer: 0 },
  { id: 'g5', topic: 'geometry', q: 'Find the volume of a cone: radius 3 cm, height 8 cm (π ≈ 3.14, nearest whole)', options: ['75 cm³', '226 cm³', '113 cm³', '24 cm³'], answer: 0 },
  { id: 'g6', topic: 'geometry', q: 'The angle of elevation to a tower from 40 m away is 35°. Find the height (1 d.p.)', options: ['28.0 m', '32.8 m', '22.9 m', '40.0 m'], answer: 0 },
  { id: 'g7', topic: 'geometry', q: 'A cylinder has r = 4 cm, h = 10 cm. Find the total surface area (π ≈ 3.14, nearest whole)', options: ['352 cm²', '251 cm²', '100 cm²', '502 cm²'], answer: 0 },
  { id: 'g8', topic: 'geometry', q: 'Two chords intersect inside a circle, split into 3 & 8 and 4 & x. Find x', options: ['6', '8', '24', '12'], answer: 0 },
  { id: 'g9', topic: 'geometry', q: 'A 5 m ladder leans against a wall, reaching 4.8 m up. Find the angle with the ground (1 d.p.)', options: ['73.7°', '67.0°', '16.3°', '78.5°'], answer: 0 },
  { id: 'g10', topic: 'geometry', q: 'Find the arc length: radius 9 cm, angle 80° (π ≈ 3.14, 1 d.p.)', options: ['12.6 cm', '6.3 cm', '25.1 cm', '18.8 cm'], answer: 0 },

  { id: 's1', topic: 'stats', q: 'P(A)=0.4, P(B)=0.5, P(A and B)=0.2. Find P(A or B)', options: ['0.7', '0.9', '0.2', '1.0'], answer: 0 },
  { id: 's2', topic: 'stats', q: 'A box has 4 red, 6 blue balls. Two are drawn without replacement. Find P(both red)', options: ['2/15', '4/25', '1/5', '3/10'], answer: 0 },
  { id: 's3', topic: 'stats', q: 'The variance of a dataset is 16. Find the standard deviation', options: ['4', '8', '16', '2'], answer: 0 },
  { id: 's4', topic: 'stats', q: 'A spinner: P(red)=0.3, P(blue)=0.25, P(green)=x, P(yellow)=0.2. Find x', options: ['0.25', '0.2', '0.15', '0.3'], answer: 0 },
  { id: 's5', topic: 'stats', q: 'P(passes Maths)=0.7, P(passes English)=0.6, independent. Find P(passes both)', options: ['0.42', '0.7', '1.3', '0.1'], answer: 0 },
  { id: 's6', topic: 'stats', q: '60 of 200 students scored below 40 marks. Estimate the percentile rank of a score of 40', options: ['30th percentile', '60th percentile', '40th percentile', '20th percentile'], answer: 0 },
  { id: 's7', topic: 'stats', q: 'Find the IQR of: 5, 7, 8, 9, 11, 12, 15, 18', options: ['6', '5', '8', '13.5'], answer: 0 },
  { id: 's8', topic: 'stats', q: 'A biased coin, P(head)=0.6, is tossed twice. Find P(exactly one head)', options: ['0.48', '0.36', '0.6', '0.24'], answer: 0 },
  { id: 's9', topic: 'stats', q: 'The mean of 5 numbers is 12. A sixth number, 24, is added. Find the new mean', options: ['14', '12', '18', '16'], answer: 0 },
  { id: 's10', topic: 'stats', q: '45 of 150 students prefer online learning. Express this as a ratio in simplest form', options: ['3:10', '9:30', '1:3', '45:150'], answer: 0 },

  { id: 'r1', topic: 'ratio', q: 'y is inversely proportional to x². When x=2, y=9. Find y when x=3', options: ['4', '6', '2', '36'], answer: 0 },
  { id: 'r2', topic: 'ratio', q: 'A car worth $20,000 depreciates 15% per year. Find its value after 2 years (nearest $)', options: ['$14,450', '$17,000', '$14,000', '$15,300'], answer: 0 },
  { id: 'r3', topic: 'ratio', q: 'Two similar solids have volumes 27 cm³ and 64 cm³. Find the ratio of their surface areas', options: ['9:16', '3:4', '27:64', '6:8'], answer: 0 },
  { id: 'r4', topic: 'ratio', q: 'Flour:sugar:butter = 2:3:5, totalling 900 g. Find the mass of sugar', options: ['270 g', '300 g', '180 g', '450 g'], answer: 0 },
  { id: 'r5', topic: 'ratio', q: 'p is directly proportional to q³. When q=2, p=40. Find p when q=5', options: ['625', '500', '200', '1000'], answer: 0 },
  { id: 'r6', topic: 'ratio', q: 'Map scale 1:25,000. Two towns are 8.4 cm apart on the map. Find the real distance', options: ['2.1 km', '21 km', '0.21 km', '210 km'], answer: 0 },
  { id: 'r7', topic: 'ratio', q: '6 taps fill a tank in 4 hours. How long would 8 taps take?', options: ['3 hours', '4.5 hours', '2 hours', '5 hours'], answer: 0 },
  { id: 'r8', topic: 'ratio', q: 'A jacket is reduced by 20% in a sale to $64. Find the original price', options: ['$80', '$76.80', '$84', '$77'], answer: 0 },
  { id: 'r9', topic: 'ratio', q: 'Divide $2400 in the ratio 1:2:5', options: ['$300, $600, $1500', '$400, $800, $1200', '$200, $700, $1500', '$300, $900, $1200'], answer: 0 },
  { id: 'r10', topic: 'ratio', q: 'Boys:girls = 5:7 in a school of 240 students. Find the number of girls', options: ['140', '100', '120', '160'], answer: 0 },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffleOptions(q) {
  const paired = q.options.map((opt, i) => ({ opt, correct: i === q.answer }));
  const shuffled = shuffle(paired);
  return { ...q, options: shuffled.map(o => o.opt), answer: shuffled.findIndex(o => o.correct) };
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = (seconds % 60).toFixed(1);
  return `${m}:${s.padStart(4, '0')}`;
}

const FONT_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
  .fd { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.03em; }
  .fb { font-family: 'Inter', sans-serif; }
  .fm { font-family: 'JetBrains Mono', monospace; }
  @keyframes flash { 0% { opacity: 0.9; } 100% { opacity: 0; } }
  @keyframes popIn { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
  @keyframes shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
  @keyframes dashMove { to { background-position: -40px 0; } }
  .track-lane { background-image: repeating-linear-gradient(90deg, rgba(244,241,234,0.18) 0 16px, transparent 16px 40px); animation: dashMove 1.2s linear infinite; }
  .checker { background-image: conic-gradient(#12182B 90deg, #F4F1EA 90deg 180deg, #12182B 180deg 270deg, #F4F1EA 270deg); background-size: 10px 10px; }
  .pop { animation: popIn 0.35s ease-out; }
  .shakeit { animation: shake 0.4s ease-in-out; }
`;

export default function MathRaceGame() {
  const [screen, setScreen] = useState('setup');
  const [selectedTopics, setSelectedTopics] = useState(['number', 'algebra', 'geometry', 'stats', 'ratio']);
  const [pool, setPool] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [racers, setRacers] = useState(RACERS_TEMPLATE.map(r => ({ ...r, progress: 0 })));
  const [stats, setStats] = useState({ correct: 0, total: 0, totalTime: 0 });
  const [standings, setStandings] = useState([]);
  const [raceStartTime, setRaceStartTime] = useState(null);
  const [raceEndTime, setRaceEndTime] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [saved, setSaved] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [lbLoading, setLbLoading] = useState(false);
  const timeoutRef = useRef(null);

  const toggleTopic = (id) => {
    setSelectedTopics(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const startRace = () => {
    const filtered = shuffle(QUESTIONS.filter(q => selectedTopics.includes(q.topic)).map(shuffleOptions));
    setPool(filtered);
    setQIndex(0);
    setCurrentQuestion(filtered[0]);
    setRacers(RACERS_TEMPLATE.map(r => ({ ...r, progress: 0 })));
    setStats({ correct: 0, total: 0, totalTime: 0 });
    setAnswered(false);
    setSelectedOption(null);
    setIsCorrect(null);
    setTimeLeft(QUESTION_TIME);
    setRaceStartTime(Date.now());
    setRaceEndTime(null);
    setSaved(false);
    setPlayerName('');
    setScreen('racing');
  };

  // countdown timer
  useEffect(() => {
    if (screen !== 'racing' || answered) return;
    if (timeLeft <= 0) {
      handleAnswer(-1);
      return;
    }
    const t = setTimeout(() => setTimeLeft(prev => +(prev - 0.1).toFixed(1)), 100);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, answered, screen]);

  const nextQuestion = (nextIdx) => {
    const idx = nextIdx % pool.length;
    setQIndex(nextIdx);
    setCurrentQuestion(pool[idx]);
    setAnswered(false);
    setSelectedOption(null);
    setIsCorrect(null);
    setTimeLeft(QUESTION_TIME);
  };

  const endRace = (finalRacers) => {
    const sorted = [...finalRacers].sort((a, b) => b.progress - a.progress);
    setStandings(sorted);
    setRaceEndTime(Date.now());
    setScreen('results');
  };

  const handleAnswer = (idx) => {
    if (answered || !currentQuestion) return;
    setAnswered(true);
    setSelectedOption(idx);
    const correct = idx === currentQuestion.answer;
    setIsCorrect(correct);
    const timeUsed = QUESTION_TIME - Math.max(timeLeft, 0);
    setStats(prev => ({ correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1, totalTime: prev.totalTime + timeUsed }));

    const playerBoost = correct ? 12 + Math.round((Math.max(timeLeft, 0) / QUESTION_TIME) * 8) : 3;
    const newRacers = racers.map(r => r.isPlayer
      ? { ...r, progress: Math.min(100, r.progress + playerBoost) }
      : { ...r, progress: Math.min(100, r.progress + 6 + Math.floor(Math.random() * 11)) }
    );

    timeoutRef.current = setTimeout(() => {
      setRacers(newRacers);
      const finished = newRacers.some(r => r.progress >= 100);
      setTimeout(() => {
        if (finished) {
          endRace(newRacers);
        } else {
          nextQuestion(qIndex + 1);
        }
      }, 900);
    }, 500);
  };

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const fetchLeaderboard = async () => {
    setLbLoading(true);
    try {
      const res = await window.storage.get('mathrace-leaderboard', true);
      const data = res ? JSON.parse(res.value) : [];
      setLeaderboard(Array.isArray(data) ? data : []);
    } catch (e) {
      setLeaderboard([]);
    }
    setLbLoading(false);
  };

  const goToLeaderboard = () => {
    setScreen('leaderboard');
    fetchLeaderboard();
  };

  const saveScore = async () => {
    if (!playerName.trim() || saved) return;
    const place = standings.findIndex(r => r.isPlayer) + 1;
    const totalTime = raceEndTime && raceStartTime ? (raceEndTime - raceStartTime) / 1000 : 0;
    const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    const entry = {
      name: playerName.trim().slice(0, 24),
      place,
      accuracy,
      totalTime: +totalTime.toFixed(1),
      topics: selectedTopics.length,
      date: new Date().toISOString(),
    };
    try {
      const res = await window.storage.get('mathrace-leaderboard', true);
      const existing = res ? JSON.parse(res.value) : [];
      const updated = [...(Array.isArray(existing) ? existing : []), entry]
        .sort((a, b) => a.place - b.place || a.totalTime - b.totalTime)
        .slice(0, 50);
      await window.storage.set('mathrace-leaderboard', JSON.stringify(updated), true);
      setSaved(true);
    } catch (e) {
      // ignore storage errors gracefully
      setSaved(true);
    }
  };

  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
  const avgTime = stats.total > 0 ? (stats.totalTime / stats.total).toFixed(1) : '0.0';
  const totalRaceTime = raceEndTime && raceStartTime ? (raceEndTime - raceStartTime) / 1000 : 0;

  return (
    <div className="fb min-h-screen w-full flex flex-col items-center justify-start p-4" style={{ background: '#12182B', color: '#F4F1EA' }}>
      <style>{FONT_STYLE}</style>
      <div className="w-full max-w-3xl">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6 pt-2">
          <div className="flex items-center gap-2">
            <Flag_ />
            <h1 className="fd text-4xl tracking-wide" style={{ color: '#F2A93B' }}>PHOTO FINISH</h1>
          </div>
          <div className="fm text-xs opacity-60 uppercase tracking-widest">IGCSE Maths Sprint</div>
        </div>

        {screen === 'setup' && (
          <SetupScreen
            selectedTopics={selectedTopics}
            toggleTopic={toggleTopic}
            startRace={startRace}
            goToLeaderboard={goToLeaderboard}
          />
        )}

        {screen === 'racing' && currentQuestion && (
          <RacingScreen
            racers={racers}
            currentQuestion={currentQuestion}
            timeLeft={timeLeft}
            answered={answered}
            selectedOption={selectedOption}
            isCorrect={isCorrect}
            handleAnswer={handleAnswer}
            stats={stats}
          />
        )}

        {screen === 'results' && (
          <ResultsScreen
            standings={standings}
            accuracy={accuracy}
            avgTime={avgTime}
            totalRaceTime={totalRaceTime}
            playerName={playerName}
            setPlayerName={setPlayerName}
            saveScore={saveScore}
            saved={saved}
            startRace={startRace}
            goToLeaderboard={goToLeaderboard}
          />
        )}

        {screen === 'leaderboard' && (
          <LeaderboardScreen
            leaderboard={leaderboard}
            loading={lbLoading}
            backToSetup={() => setScreen('setup')}
          />
        )}
      </div>
    </div>
  );
}

function Flag_() {
  return <Flag size={30} color="#F2A93B" strokeWidth={2.4} />;
}

function SetupScreen({ selectedTopics, toggleTopic, startRace, goToLeaderboard }) {
  return (
    <div className="pop">
      <p className="fb text-sm opacity-70 mb-5 leading-relaxed">
        Pick your topics, then race three rivals to the finish line. Answer fast and correctly to pull ahead —
        every question moves the pack.
      </p>

      <div className="fd text-xl mb-3 tracking-wide opacity-90">CHOOSE YOUR GRID</div>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {TOPICS.map(t => {
          const active = selectedTopics.includes(t.id);
          return (
            <button
              key={t.id}
              onClick={() => toggleTopic(t.id)}
              className="fb text-left rounded-lg px-4 py-3 transition-all"
              style={{
                border: `2px solid ${active ? t.color : 'rgba(244,241,234,0.15)'}`,
                background: active ? `${t.color}22` : 'transparent',
                color: active ? '#F4F1EA' : 'rgba(244,241,234,0.55)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">{t.label}</span>
                {active && <Check size={16} color={t.color} />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={startRace}
          disabled={selectedTopics.length === 0}
          className="fd flex-1 flex items-center justify-center gap-2 rounded-lg py-4 text-2xl tracking-wide transition-opacity"
          style={{
            background: selectedTopics.length ? '#F2A93B' : 'rgba(244,241,234,0.15)',
            color: '#12182B',
            opacity: selectedTopics.length ? 1 : 0.5,
            cursor: selectedTopics.length ? 'pointer' : 'not-allowed',
          }}
        >
          <Play size={22} fill="#12182B" /> START RACE
        </button>
        <button
          onClick={goToLeaderboard}
          className="fb rounded-lg px-4 py-4 text-sm font-semibold flex items-center gap-2"
          style={{ border: '2px solid rgba(244,241,234,0.15)', color: '#F4F1EA' }}
        >
          <ListOrdered size={18} /> Leaderboard
        </button>
      </div>
    </div>
  );
}

function RacingScreen({ racers, currentQuestion, timeLeft, answered, selectedOption, isCorrect, handleAnswer, stats }) {
  const timerPct = Math.max(0, (timeLeft / QUESTION_TIME) * 100);
  const timerColor = timerPct > 50 ? '#3FBFAE' : timerPct > 20 ? '#F2A93B' : '#E85D4C';
  const topicMeta = TOPICS.find(t => t.id === currentQuestion.topic);

  return (
    <div>
      {/* TRACK */}
      <div className="rounded-xl p-4 mb-5" style={{ background: '#1A2138', border: '1px solid rgba(244,241,234,0.08)' }}>
        {racers.map(r => (
          <div key={r.id} className="relative h-9 mb-2 last:mb-0 rounded-md overflow-hidden track-lane" style={{ background: 'rgba(244,241,234,0.04)' }}>
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-out flex items-center gap-1"
              style={{ left: `calc(${Math.min(r.progress, 96)}% - 2px)` }}
            >
              <Car size={20} color={r.color} fill={r.color} style={{ transform: 'scaleX(-1)' }} />
            </div>
            <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2 h-6 rounded-sm checker" />
            <div className="absolute left-2 top-1/2 -translate-y-1/2 fm text-[10px] opacity-50">{r.name}</div>
          </div>
        ))}
      </div>

      {/* STATS BAR */}
      <div className="flex items-center justify-between mb-4 fm text-xs opacity-60">
        <span>SCORE {stats.correct}/{stats.total}</span>
        <span>Q{stats.total + 1}</span>
      </div>

      {/* TIMER */}
      <div className="h-2 rounded-full overflow-hidden mb-4" style={{ background: 'rgba(244,241,234,0.1)' }}>
        <div className="h-full transition-all duration-100 linear" style={{ width: `${timerPct}%`, background: timerColor }} />
      </div>

      {/* QUESTION CARD */}
      <div className={`rounded-xl p-6 mb-5 ${answered && !isCorrect ? 'shakeit' : ''}`} style={{ background: '#1A2138', border: '1px solid rgba(244,241,234,0.08)' }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="fm text-[10px] uppercase tracking-widest px-2 py-1 rounded" style={{ background: `${topicMeta.color}22`, color: topicMeta.color }}>
            {topicMeta.label}
          </span>
        </div>
        <div className="fd text-2xl tracking-wide leading-snug">{currentQuestion.q}</div>
      </div>

      {/* OPTIONS */}
      <div className="grid grid-cols-2 gap-3">
        {currentQuestion.options.map((opt, i) => {
          let bg = '#1A2138';
          let border = 'rgba(244,241,234,0.12)';
          let textColor = '#F4F1EA';
          if (answered) {
            if (i === currentQuestion.answer) { bg = '#3FBFAE22'; border = '#3FBFAE'; }
            else if (i === selectedOption) { bg = '#E85D4C22'; border = '#E85D4C'; }
          }
          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={answered}
              className="fb text-left rounded-lg px-4 py-4 text-sm font-semibold flex items-center justify-between transition-colors"
              style={{ background: bg, border: `2px solid ${border}`, color: textColor }}
            >
              <span>{opt}</span>
              {answered && i === currentQuestion.answer && <Check size={18} color="#3FBFAE" />}
              {answered && i === selectedOption && i !== currentQuestion.answer && <X size={18} color="#E85D4C" />}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-4 flex items-center gap-2 fb text-sm pop" style={{ color: isCorrect ? '#3FBFAE' : '#E85D4C' }}>
          <Zap size={16} />
          {isCorrect ? 'Correct — nice acceleration!' : 'Not quite — small step forward anyway.'}
        </div>
      )}
    </div>
  );
}

function ResultsScreen({ standings, accuracy, avgTime, totalRaceTime, playerName, setPlayerName, saveScore, saved, startRace, goToLeaderboard }) {
  const medalColor = ['#F2C94C', '#C4C9D4', '#C97B4A', null];
  return (
    <div className="pop">
      <div className="relative mb-6 rounded-xl p-6 text-center overflow-hidden" style={{ background: '#1A2138', border: '1px solid rgba(244,241,234,0.08)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ animation: 'flash 0.8s ease-out', background: '#F4F1EA' }} />
        <Trophy size={36} color="#F2A93B" className="mx-auto mb-2" />
        <div className="fd text-3xl tracking-wide">RACE COMPLETE</div>
      </div>

      <div className="mb-6">
        {standings.map((r, i) => (
          <div
            key={r.id}
            className="flex items-center justify-between rounded-lg px-4 py-3 mb-2"
            style={{
              background: r.isPlayer ? '#F2A93B18' : '#1A2138',
              border: `1px solid ${r.isPlayer ? '#F2A93B' : 'rgba(244,241,234,0.08)'}`,
            }}
          >
            <div className="flex items-center gap-3">
              <span className="fd text-xl w-6 text-center" style={{ color: medalColor[i] || 'rgba(244,241,234,0.5)' }}>{i + 1}</span>
              {i < 3 ? <Medal size={16} color={medalColor[i]} /> : <span className="w-4" />}
              <span className="fb text-sm font-semibold" style={{ color: r.color }}>{r.name}</span>
            </div>
            <span className="fm text-xs opacity-60">{Math.round(r.progress)}m</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatBox label="Accuracy" value={`${accuracy}%`} />
        <StatBox label="Avg / Q" value={`${avgTime}s`} />
        <StatBox label="Race Time" value={formatTime(totalRaceTime)} />
      </div>

      {!saved ? (
        <div className="flex items-center gap-2 mb-6">
          <input
            value={playerName}
            onChange={e => setPlayerName(e.target.value)}
            placeholder="Enter your name for the leaderboard"
            className="fb flex-1 rounded-lg px-4 py-3 text-sm outline-none"
            style={{ background: '#1A2138', border: '1px solid rgba(244,241,234,0.15)', color: '#F4F1EA' }}
            maxLength={24}
          />
          <button
            onClick={saveScore}
            disabled={!playerName.trim()}
            className="fb rounded-lg px-4 py-3 text-sm font-semibold"
            style={{ background: playerName.trim() ? '#3FBFAE' : 'rgba(244,241,234,0.15)', color: '#12182B' }}
          >
            Save
          </button>
        </div>
      ) : (
        <div className="fb text-sm mb-6 flex items-center gap-2" style={{ color: '#3FBFAE' }}>
          <Check size={16} /> Saved to the leaderboard.
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={startRace}
          className="fd flex-1 flex items-center justify-center gap-2 rounded-lg py-4 text-xl tracking-wide"
          style={{ background: '#F2A93B', color: '#12182B' }}
        >
          <RotateCcw size={18} /> RACE AGAIN
        </button>
        <button
          onClick={goToLeaderboard}
          className="fb rounded-lg px-4 py-4 text-sm font-semibold flex items-center gap-2"
          style={{ border: '2px solid rgba(244,241,234,0.15)', color: '#F4F1EA' }}
        >
          <ListOrdered size={18} /> Leaderboard
        </button>
      </div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="rounded-lg p-3 text-center" style={{ background: '#1A2138', border: '1px solid rgba(244,241,234,0.08)' }}>
      <div className="fm text-lg" style={{ color: '#F2A93B' }}>{value}</div>
      <div className="fb text-[10px] uppercase tracking-widest opacity-50 mt-1">{label}</div>
    </div>
  );
}

function LeaderboardScreen({ leaderboard, loading, backToSetup }) {
  return (
    <div className="pop">
      <div className="flex items-center gap-2 mb-5">
        <Award size={22} color="#F2A93B" />
        <div className="fd text-2xl tracking-wide">TOP RACERS</div>
      </div>

      {loading && <div className="fb text-sm opacity-60">Loading results…</div>}

      {!loading && leaderboard.length === 0 && (
        <div className="fb text-sm opacity-60 mb-6">No races saved yet — be the first to finish and add your name.</div>
      )}

      {!loading && leaderboard.length > 0 && (
        <div className="mb-6">
          {leaderboard.map((e, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg px-4 py-3 mb-2" style={{ background: '#1A2138', border: '1px solid rgba(244,241,234,0.08)' }}>
              <div className="flex items-center gap-3">
                <span className="fd text-lg w-6 text-center opacity-70">{i + 1}</span>
                <span className="fb text-sm font-semibold">{e.name}</span>
              </div>
              <div className="flex items-center gap-4 fm text-xs opacity-70">
                <span>P{e.place}</span>
                <span>{e.accuracy}%</span>
                <span>{e.totalTime}s</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={backToSetup}
        className="fd w-full flex items-center justify-center gap-2 rounded-lg py-4 text-xl tracking-wide"
        style={{ background: '#F2A93B', color: '#12182B' }}
      >
        <ChevronRight size={18} /> BACK TO SETUP
      </button>
    </div>
  );
}
