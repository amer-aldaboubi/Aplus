import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Clock, Zap, Check, X, Play, RotateCcw, Award, Car, ChevronRight, ListOrdered, Medal, Flag } from 'lucide-react';

const QUESTION_TIME = 25;
const RACE_DISTANCE = 100;

const TOPICS = [
  { id: 'gradient', label: 'Gradient (Rise/Run)', color: '#F5D76E' },
  { id: 'requation', label: 'Equation of a Line', color: '#F2789F' },
  { id: 'parallel', label: 'Parallel & Perpendicular', color: '#6EC6F5' },
  { id: 'twopoints', label: 'Equation Through 2 Points', color: '#F2A65A' },
  { id: 'distance', label: 'Distance Between Points', color: '#8FD694' },
  { id: 'midpoint', label: 'Midpoint of a Line', color: '#C99BE8' },
];

const RACERS_TEMPLATE = [
  { id: 'player', name: 'You', color: '#F5D76E', isPlayer: true },
  { id: 'zayed', name: 'Zayed', color: '#F2789F', isPlayer: false },
  { id: 'mei', name: 'Mei', color: '#6EC6F5', isPlayer: false },
  { id: 'lucas', name: 'Lucas', color: '#F2A65A', isPlayer: false },
];

const QUESTIONS = [
  { id: 'gr1', topic: 'gradient', q: 'Find the gradient of the line through (2, 3) and (6, 11)', options: ['2', '4', '1/2', '8'], answer: 0 },
  { id: 'gr2', topic: 'gradient', q: 'Find the gradient of the line through (−1, 4) and (3, −4)', options: ['−2', '2', '−4', '4'], answer: 0 },
  { id: 'gr3', topic: 'gradient', q: 'A line rises 6 units for every 3 units it runs. Find its gradient', options: ['2', '3', '1/2', '6'], answer: 0 },
  { id: 'gr4', topic: 'gradient', q: 'Find the gradient of the line 2y = 4x − 6', options: ['2', '4', '−3', '−6'], answer: 0 },
  { id: 'gr5', topic: 'gradient', q: 'Find the gradient of the line through (0, 5) and (5, 0)', options: ['−1', '1', '5', '−5'], answer: 0 },
  { id: 'gr6', topic: 'gradient', q: 'A line has gradient −3/4. If the run is 8, find the rise', options: ['−6', '6', '−24', '24'], answer: 0 },
  { id: 'gr7', topic: 'gradient', q: 'Find the gradient of a horizontal line', options: ['0', '1', 'undefined', 'infinite'], answer: 0 },
  { id: 'gr8', topic: 'gradient', q: 'Find the gradient of a vertical line', options: ['undefined', '0', '1', '−1'], answer: 0 },
  { id: 'gr9', topic: 'gradient', q: 'Find the gradient of the line 3x + 2y = 12', options: ['−3/2', '3/2', '−2/3', '2/3'], answer: 0 },
  { id: 'gr10', topic: 'gradient', q: 'A line passes through (1, 2) and (1, 9). Find its gradient', options: ['undefined', '7', '0', '1/7'], answer: 0 },

  { id: 're1', topic: 'requation', q: 'Write the equation of a line with gradient 3 and y-intercept −2', options: ['y = 3x − 2', 'y = −2x + 3', 'y = 3x + 2', 'y = −3x − 2'], answer: 0 },
  { id: 're2', topic: 'requation', q: 'A line has gradient −1/2 and passes through (0, 4). Write its equation', options: ['y = −½x + 4', 'y = ½x + 4', 'y = −½x − 4', 'y = 4x − ½'], answer: 0 },
  { id: 're3', topic: 'requation', q: 'Find the y-intercept of the line y = 5x − 7', options: ['−7', '5', '7', '−5'], answer: 0 },
  { id: 're4', topic: 'requation', q: 'Find the gradient of the line y = −4x + 9', options: ['−4', '9', '4', '−9'], answer: 0 },
  { id: 're5', topic: 'requation', q: 'Rearrange 4x + y = 8 into the form y = mx + c', options: ['y = −4x + 8', 'y = 4x + 8', 'y = −4x − 8', 'y = 4x − 8'], answer: 0 },
  { id: 're6', topic: 'requation', q: 'A line crosses the y-axis at (0, −3) and has gradient 2. Find its equation', options: ['y = 2x − 3', 'y = −2x + 3', 'y = 2x + 3', 'y = 3x − 2'], answer: 0 },
  { id: 're7', topic: 'requation', q: 'Rearrange 2y − 6x = 10 into the form y = mx + c', options: ['y = 3x + 5', 'y = 3x − 5', 'y = 6x + 10', 'y = −3x + 5'], answer: 0 },
  { id: 're8', topic: 'requation', q: 'Which point lies on the line y = 2x − 1?', options: ['(3, 5)', '(3, 6)', '(2, 2)', '(1, 0)'], answer: 0 },
  { id: 're9', topic: 'requation', q: 'Find the x-intercept of the line y = 3x − 12', options: ['(4, 0)', '(0, 4)', '(−4, 0)', '(12, 0)'], answer: 0 },
  { id: 're10', topic: 'requation', q: 'Line y = −x + 6. Find where it crosses the y-axis and the x-axis', options: ['(0,6) and (6,0)', '(0,−6) and (−6,0)', '(6,0) and (0,−6)', '(0,6) and (−6,0)'], answer: 0 },

  { id: 'pp1', topic: 'parallel', q: 'Which line is parallel to y = 3x + 5?', options: ['y = 3x − 2', 'y = −3x + 5', 'y = 1/3x + 5', 'y = 5x + 3'], answer: 0 },
  { id: 'pp2', topic: 'parallel', q: 'Line A: y = 2x + 1. Line B: y = 2x − 7. These two lines are:', options: ['Parallel', 'Perpendicular', 'The same line', 'Neither'], answer: 0 },
  { id: 'pp3', topic: 'parallel', q: 'Find the gradient of a line perpendicular to y = 4x − 1', options: ['−1/4', '4', '1/4', '−4'], answer: 0 },
  { id: 'pp4', topic: 'parallel', q: 'Which line is perpendicular to y = −2x + 3?', options: ['y = ½x − 1', 'y = −2x + 1', 'y = 2x + 3', 'y = −½x + 3'], answer: 0 },
  { id: 'pp5', topic: 'parallel', q: 'Two lines are parallel. Line 1 has gradient 5. Find the gradient of line 2', options: ['5', '−5', '1/5', '−1/5'], answer: 0 },
  { id: 'pp6', topic: 'parallel', q: 'Find the equation of the line parallel to y = −3x + 2, through (0, 7)', options: ['y = −3x + 7', 'y = 3x + 7', 'y = −3x − 7', 'y = 7x − 3'], answer: 0 },
  { id: 'pp7', topic: 'parallel', q: 'Lines y = 6x + 1 and 2y = 12x − 4 are:', options: ['Parallel', 'Perpendicular', 'The same line', 'Neither'], answer: 0 },
  { id: 'pp8', topic: 'parallel', q: 'Find the gradient of a line perpendicular to a vertical line', options: ['0', 'undefined', '1', '−1'], answer: 0 },
  { id: 'pp9', topic: 'parallel', q: 'Line A has gradient 2/3. Which gradient makes line B perpendicular to A?', options: ['−3/2', '3/2', '−2/3', '2/3'], answer: 0 },
  { id: 'pp10', topic: 'parallel', q: 'Find the equation of the line perpendicular to y = x − 4, through (0, 2)', options: ['y = −x + 2', 'y = x + 2', 'y = −x − 2', 'y = 2x − 4'], answer: 0 },

  { id: 'tp1', topic: 'twopoints', q: 'Find the equation of the line through (1, 4) and (3, 10)', options: ['y = 3x + 1', 'y = 3x − 1', 'y = 3x + 4', 'y = 6x + 1'], answer: 0 },
  { id: 'tp2', topic: 'twopoints', q: 'Find the equation of the line through (0, 2) and (4, 10)', options: ['y = 2x + 2', 'y = 2x + 8', 'y = 4x + 2', 'y = 2x − 2'], answer: 0 },
  { id: 'tp3', topic: 'twopoints', q: 'Find the equation of the line through (−2, 1) and (2, 9)', options: ['y = 2x + 5', 'y = 2x + 1', 'y = 2x − 5', 'y = 4x + 5'], answer: 0 },
  { id: 'tp4', topic: 'twopoints', q: 'Find the equation of the line through (3, 7) and (3, −2)', options: ['x = 3', 'y = 3', 'x = 7', 'y = 7x'], answer: 0 },
  { id: 'tp5', topic: 'twopoints', q: 'Find the equation of the line through (5, 2) and (−1, 2)', options: ['y = 2', 'x = 2', 'y = 5x + 2', 'x = 5'], answer: 0 },
  { id: 'tp6', topic: 'twopoints', q: 'Find the equation of the line through (1, −1) and (4, 8)', options: ['y = 3x − 4', 'y = 3x + 4', 'y = 3x − 1', 'y = 9x − 4'], answer: 0 },
  { id: 'tp7', topic: 'twopoints', q: 'Find the equation of the line through (−3, 5) and (1, −3)', options: ['y = −2x − 1', 'y = −2x + 1', 'y = 2x − 1', 'y = −2x − 5'], answer: 0 },
  { id: 'tp8', topic: 'twopoints', q: 'Find the equation of the line through (2, 6) and (6, 6)', options: ['y = 6', 'x = 6', 'y = 2x + 6', 'x = 2'], answer: 0 },
  { id: 'tp9', topic: 'twopoints', q: 'Find the equation of the line through (0, −4) and (2, 0)', options: ['y = 2x − 4', 'y = 2x + 4', 'y = 4x − 4', 'y = −2x − 4'], answer: 0 },
  { id: 'tp10', topic: 'twopoints', q: 'Find the equation of the line through (−4, −1) and (2, 5)', options: ['y = x + 3', 'y = x − 3', 'y = 2x + 3', 'y = x + 1'], answer: 0 },

  { id: 'ds1', topic: 'distance', q: 'Find the distance between (0, 0) and (3, 4)', options: ['5', '7', '3.5', '12'], answer: 0 },
  { id: 'ds2', topic: 'distance', q: 'Find the distance between (1, 2) and (4, 6)', options: ['5', '7', '4', '6'], answer: 0 },
  { id: 'ds3', topic: 'distance', q: 'Find the distance between (−2, 1) and (3, 1)', options: ['5', '1', '4', '6'], answer: 0 },
  { id: 'ds4', topic: 'distance', q: 'Find the distance between (2, −3) and (2, 5)', options: ['8', '2', '6', '10'], answer: 0 },
  { id: 'ds5', topic: 'distance', q: 'Find the distance between (0, 0) and (5, 12)', options: ['13', '17', '12.5', '7'], answer: 0 },
  { id: 'ds6', topic: 'distance', q: 'Find the distance between (−1, −1) and (2, 3)', options: ['5', '4', '6', '√13'], answer: 0 },
  { id: 'ds7', topic: 'distance', q: 'Find the distance between (0, 0) and (2, 3), to 1 d.p.', options: ['3.6', '5', '13', '2.5'], answer: 0 },
  { id: 'ds8', topic: 'distance', q: 'Find the distance between (−3, 2) and (1, −1)', options: ['5', '4', '3', '7'], answer: 0 },
  { id: 'ds9', topic: 'distance', q: 'Find the distance between (6, 8) and (0, 0)', options: ['10', '14', '8', '6'], answer: 0 },
  { id: 'ds10', topic: 'distance', q: 'Points A(1, 3) and B(7, 11). Find the distance AB', options: ['10', '8', '14', '12'], answer: 0 },

  { id: 'mp1', topic: 'midpoint', q: 'Find the midpoint of (2, 4) and (6, 10)', options: ['(4, 7)', '(4, 3)', '(8, 14)', '(2, 3)'], answer: 0 },
  { id: 'mp2', topic: 'midpoint', q: 'Find the midpoint of (−3, 5) and (7, −1)', options: ['(2, 2)', '(2, 3)', '(−2, 2)', '(5, 2)'], answer: 0 },
  { id: 'mp3', topic: 'midpoint', q: 'Find the midpoint of (0, 0) and (8, −6)', options: ['(4, −3)', '(4, 3)', '(8, −6)', '(−4, 3)'], answer: 0 },
  { id: 'mp4', topic: 'midpoint', q: 'The midpoint of A(1, 2) and B(x, 8) is (4, 5). Find x', options: ['7', '8', '3', '6'], answer: 0 },
  { id: 'mp5', topic: 'midpoint', q: 'Find the midpoint of (−5, −3) and (−1, 7)', options: ['(−3, 2)', '(3, 2)', '(−3, −2)', '(−6, 4)'], answer: 0 },
  { id: 'mp6', topic: 'midpoint', q: 'The midpoint of P(2, y) and Q(10, −4) is (6, 1). Find y', options: ['6', '−2', '2', '−6'], answer: 0 },
  { id: 'mp7', topic: 'midpoint', q: 'Find the midpoint of (4.5, 2) and (7.5, 6)', options: ['(6, 4)', '(6, 3)', '(12, 8)', '(3, 2)'], answer: 0 },
  { id: 'mp8', topic: 'midpoint', q: 'A line segment has endpoints (−6, 3) and (4, 3). Find its midpoint', options: ['(−1, 3)', '(−1, 0)', '(5, 3)', '(−1, 6)'], answer: 0 },
  { id: 'mp9', topic: 'midpoint', q: 'Find the midpoint of (9, −2) and (−3, −8)', options: ['(3, −5)', '(3, 5)', '(6, −10)', '(−3, −5)'], answer: 0 },
  { id: 'mp10', topic: 'midpoint', q: 'M is the midpoint of A(−2, −4) and B(6, 2). Find M', options: ['(2, −1)', '(2, 1)', '(4, −1)', '(−2, 1)'], answer: 0 },
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
  @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
  .fd { font-family: 'Kalam', cursive; letter-spacing: 0.01em; }
  .fb { font-family: 'Inter', sans-serif; }
  .fm { font-family: 'JetBrains Mono', monospace; }
  @keyframes flash { 0% { opacity: 0.9; } 100% { opacity: 0; } }
  @keyframes popIn { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
  @keyframes shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
  @keyframes dashMove { to { background-position: -20px 0; } }
  .track-lane { background-image: repeating-linear-gradient(90deg, rgba(244,241,234,0.14) 0 1px, transparent 1px 20px); animation: dashMove 3s linear infinite; }
  .checker { background-image: conic-gradient(#1B241E 90deg, #F4F1EA 90deg 180deg, #1B241E 180deg 270deg, #F4F1EA 270deg); background-size: 10px 10px; }
  .graph-bg { background-image: linear-gradient(rgba(244,241,234,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(244,241,234,0.06) 1px, transparent 1px); background-size: 24px 24px; }
  .pop { animation: popIn 0.35s ease-out; }
  .shakeit { animation: shake 0.4s ease-in-out; }
`;

export default function LinearEquationsGame() {
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
      const res = await window.storage.get('lineraces-leaderboard', true);
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
      const res = await window.storage.get('lineraces-leaderboard', true);
      const existing = res ? JSON.parse(res.value) : [];
      const updated = [...(Array.isArray(existing) ? existing : []), entry]
        .sort((a, b) => a.place - b.place || a.totalTime - b.totalTime)
        .slice(0, 50);
      await window.storage.set('lineraces-leaderboard', JSON.stringify(updated), true);
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
    <div className="fb graph-bg min-h-screen w-full flex flex-col items-center justify-start p-4" style={{ background: '#1B241E', color: '#F4F1EA' }}>
      <style>{FONT_STYLE}</style>
      <div className="w-full max-w-3xl">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6 pt-2">
          <div className="flex items-center gap-2">
            <Flag_ />
            <h1 className="fd text-4xl tracking-wide" style={{ color: '#F5D76E' }}>SLOPE SPRINT</h1>
          </div>
          <div className="fm text-xs opacity-60 uppercase tracking-widest">Linear Equations Grand Prix</div>
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
  return <Flag size={30} color="#F5D76E" strokeWidth={2.4} />;
}

function SetupScreen({ selectedTopics, toggleTopic, startRace, goToLeaderboard }) {
  return (
    <div className="pop">
      <p className="fb text-sm opacity-70 mb-5 leading-relaxed">
        Pick your strands, then race three rivals along the number line. Nail the gradient, the equation, or the
        distance fast and correctly to pull ahead — every question moves the pack.
      </p>

      <div className="fd text-xl mb-3 tracking-wide opacity-90">CHOOSE YOUR CHALLENGE</div>
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
            background: selectedTopics.length ? '#F5D76E' : 'rgba(244,241,234,0.15)',
            color: '#1B241E',
            opacity: selectedTopics.length ? 1 : 0.5,
            cursor: selectedTopics.length ? 'pointer' : 'not-allowed',
          }}
        >
          <Play size={22} fill="#1B241E" /> START RACE
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
  const timerColor = timerPct > 50 ? '#6EC6F5' : timerPct > 20 ? '#F5D76E' : '#F2789F';
  const topicMeta = TOPICS.find(t => t.id === currentQuestion.topic);

  return (
    <div>
      {/* TRACK */}
      <div className="rounded-xl p-4 mb-5" style={{ background: '#25332B', border: '1px solid rgba(244,241,234,0.08)' }}>
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
      <div className={`rounded-xl p-6 mb-5 ${answered && !isCorrect ? 'shakeit' : ''}`} style={{ background: '#25332B', border: '1px solid rgba(244,241,234,0.08)' }}>
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
          let bg = '#25332B';
          let border = 'rgba(244,241,234,0.12)';
          let textColor = '#F4F1EA';
          if (answered) {
            if (i === currentQuestion.answer) { bg = '#6EC6F522'; border = '#6EC6F5'; }
            else if (i === selectedOption) { bg = '#F2789F22'; border = '#F2789F'; }
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
              {answered && i === currentQuestion.answer && <Check size={18} color="#6EC6F5" />}
              {answered && i === selectedOption && i !== currentQuestion.answer && <X size={18} color="#F2789F" />}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-4 flex items-center gap-2 fb text-sm pop" style={{ color: isCorrect ? '#6EC6F5' : '#F2789F' }}>
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
      <div className="relative mb-6 rounded-xl p-6 text-center overflow-hidden" style={{ background: '#25332B', border: '1px solid rgba(244,241,234,0.08)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ animation: 'flash 0.8s ease-out', background: '#F4F1EA' }} />
        <Trophy size={36} color="#F5D76E" className="mx-auto mb-2" />
        <div className="fd text-3xl tracking-wide">RACE COMPLETE</div>
      </div>

      <div className="mb-6">
        {standings.map((r, i) => (
          <div
            key={r.id}
            className="flex items-center justify-between rounded-lg px-4 py-3 mb-2"
            style={{
              background: r.isPlayer ? '#F5D76E18' : '#25332B',
              border: `1px solid ${r.isPlayer ? '#F5D76E' : 'rgba(244,241,234,0.08)'}`,
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
            style={{ background: '#25332B', border: '1px solid rgba(244,241,234,0.15)', color: '#F4F1EA' }}
            maxLength={24}
          />
          <button
            onClick={saveScore}
            disabled={!playerName.trim()}
            className="fb rounded-lg px-4 py-3 text-sm font-semibold"
            style={{ background: playerName.trim() ? '#6EC6F5' : 'rgba(244,241,234,0.15)', color: '#1B241E' }}
          >
            Save
          </button>
        </div>
      ) : (
        <div className="fb text-sm mb-6 flex items-center gap-2" style={{ color: '#6EC6F5' }}>
          <Check size={16} /> Saved to the leaderboard.
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={startRace}
          className="fd flex-1 flex items-center justify-center gap-2 rounded-lg py-4 text-xl tracking-wide"
          style={{ background: '#F5D76E', color: '#1B241E' }}
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
    <div className="rounded-lg p-3 text-center" style={{ background: '#25332B', border: '1px solid rgba(244,241,234,0.08)' }}>
      <div className="fm text-lg" style={{ color: '#F5D76E' }}>{value}</div>
      <div className="fb text-[10px] uppercase tracking-widest opacity-50 mt-1">{label}</div>
    </div>
  );
}

function LeaderboardScreen({ leaderboard, loading, backToSetup }) {
  return (
    <div className="pop">
      <div className="flex items-center gap-2 mb-5">
        <Award size={22} color="#F5D76E" />
        <div className="fd text-2xl tracking-wide">TOP RACERS</div>
      </div>

      {loading && <div className="fb text-sm opacity-60">Loading results…</div>}

      {!loading && leaderboard.length === 0 && (
        <div className="fb text-sm opacity-60 mb-6">No races saved yet — be the first to finish and add your name.</div>
      )}

      {!loading && leaderboard.length > 0 && (
        <div className="mb-6">
          {leaderboard.map((e, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg px-4 py-3 mb-2" style={{ background: '#25332B', border: '1px solid rgba(244,241,234,0.08)' }}>
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
        style={{ background: '#F5D76E', color: '#1B241E' }}
      >
        <ChevronRight size={18} /> BACK TO SETUP
      </button>
    </div>
  );
}
