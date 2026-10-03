import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Check, X, Play, RotateCcw, Award, Mountain, ChevronRight, ListOrdered, Medal, BookOpen, MessageSquare, Send } from 'lucide-react';

const TOPICS = [
  { id: 'numbers', label: 'Ch.1 Numbers', color: '#9BC6F5', source: 'Y10 • T1 Wk1 • Edexcel 4MA1 Past Papers' },
  { id: 'accuracy', label: 'Ch.2 Degree of Accuracy', color: '#F5A3C7', source: 'Y10 • T1 Wk2 • Edexcel 4MA1 Past Papers' },
  { id: 'factorising', label: 'Ch.3 Brackets & Factorising', color: '#A8E0C9', source: 'Y10 • T1 Wk2-3 • Edexcel 4MA1 Past Papers' },
  { id: 'algfrac', label: 'Ch.4 Algebraic Fractions', color: '#F2C879', source: 'Y10 • T1 Wk3-4 • Edexcel 4MA1 Past Papers' },
  { id: 'equations', label: 'Ch.5 Equations (Changing the Subject)', color: '#C9A8F0', source: 'Y10 • T1 Wk4-5 • Edexcel 4MA1 Past Papers' },
  { id: 'units', label: 'Ch.6 Units', color: '#9BC6F5', source: 'Y10 • T1 Wk5 • Edexcel 4MA1 Past Papers' },
  { id: 'indices', label: 'Ch.7 Indices & Surds', color: '#F5A3C7', source: 'Y10 • T1 Wk5 • Edexcel 4MA1 Past Papers' },
  { id: 'pythagoras', label: 'Ch.8 Lines & Pythagoras', color: '#A8E0C9', source: 'Y10 • T1 Wk6 • Edexcel 4MA1 Past Papers' },
  { id: 'quad', label: 'Ch.9 Quadrilaterals', color: '#F2C879', source: 'Y10 • T1 Wk8 • Edexcel 4MA1 Past Papers' },
  { id: 'circles', label: 'Ch.10 Circles (Sectors & Arcs)', color: '#C9A8F0', source: 'Y10 • T1 Wk9 • Edexcel 4MA1 Past Papers' },
  { id: 'coordgeo', label: 'Ch.11 Coordinate Geometry', color: '#9BC6F5', source: 'Y10 • T1 Wk10 • Edexcel 4MA1 Past Papers' },
  { id: 'graphs', label: 'Ch.12 Graphs & Transformations', color: '#F5A3C7', source: 'Y10 • T1 Wk11-12 • Edexcel 4MA1 Past Papers' },
  { id: 'rates', label: 'Ch.13 Rates & Kinematics', color: '#A8E0C9', source: 'Y10 • T1 Wk13 • Edexcel 4MA1 Past Papers' },
  { id: 'sets', label: 'Ch.14 Sets & Venn Diagrams', color: '#F2C879', source: 'Y10 • T2 Wk16-17 • Edexcel 4MA1 Past Papers' },
  { id: 'trig', label: 'Ch.15-16 Trigonometry, Sine/Cosine Rule & Bearings', color: '#C9A8F0', source: 'Y10 • T2 Wk18-21 • Edexcel 4MA1 Past Papers' },
  { id: 'probability', label: 'Ch.17 Probability (Conditional/Tree)', color: '#9BC6F5', source: 'Y10 • T2 Wk22-23 • Edexcel 4MA1 Past Papers' },
  { id: 'histograms', label: 'Ch.18 Histograms & Statistics', color: '#F5A3C7', source: 'Y10 • T2 Wk24 • Edexcel 4MA1 Past Papers' },
];

const CLIMBERS_TEMPLATE = [
  { id: 'player', name: 'You', color: '#9BC6F5', isPlayer: true },
  { id: 'rana', name: 'Rana', color: '#F5A3C7', isPlayer: false },
  { id: 'kai', name: 'Kai', color: '#A8E0C9', isPlayer: false },
  { id: 'omar', name: 'Omar', color: '#F2C879', isPlayer: false },
];

// time = seconds allowed, scaled 180-240s by complexity. ref = verified real Edexcel 4MA1 citation.
const QUESTIONS = [
  // Ch numbers — 50 questions (2 from real Edexcel 4MA1 past papers, 48 practice questions in the same style)
  { id: "nu1", topic: "numbers", ref: "Jan 2023 2H Q16", time: 210, q: "Write the recurring decimal 0.4̇38̇ (digits 438 recurring) as a fraction in its simplest form", options: ["217/495", "438/999", "219/500", "146/333"], answer: 0 },
  { id: "nu2", topic: "numbers", ref: "Nov 2023 2H Q15", time: 210, q: "(√125 + √80) / √3 = √n. Find the value of n", options: ["135", "45", "15", "205"], answer: 0 },
  { id: "h_rec5989", topic: "numbers", time: 200, q: "Write the recurring decimal 0.79 recurring (both digits repeat) as a fraction in its simplest form", options: ["79/100", "79/99", "79/9", "80/99"], answer: 1 },
  { id: "h_sf5990", topic: "numbers", time: 207, q: "Work out (7.78 × 10^-1) ÷ (7.17 × 10^-6), giving your answer in standard form", options: ["1.09 × 10^5", "10.85 × 10^4", "1.09 × 10^6", "1.09 × 10^4"], answer: 0 },
  { id: "h_rec5991", topic: "numbers", time: 196, q: "Write the recurring decimal 0.89 recurring (both digits repeat) as a fraction in its simplest form", options: ["89/99", "10/11", "89/9", "89/100"], answer: 0 },
  { id: "h_sf5992", topic: "numbers", time: 212, q: "Work out (2.93 × 10^3) × (8.43 × 10^-6), giving your answer in standard form", options: ["24.7 × 10^-3", "2.47 × 10^-2", "2.47 × 10^-1", "2.47 × 10^-3"], answer: 1 },
  { id: "h_surd5993", topic: "numbers", time: 191, q: "Rationalise the denominator of 7/√10", options: ["7/10√10", "7√10", "7√10/10", "70√10"], answer: 2 },
  { id: "h_rec5994", topic: "numbers", time: 220, q: "Write the recurring decimal 0.92 recurring (both digits repeat) as a fraction in its simplest form", options: ["31/33", "23/25", "92/9", "92/99"], answer: 3 },
  { id: "h_surd5995", topic: "numbers", time: 218, q: "Rationalise the denominator of 7/√3", options: ["21√3", "7√3/3", "7√3", "7/3√3"], answer: 1 },
  { id: "h_rec5996", topic: "numbers", time: 212, q: "Write the recurring decimal 0.43 recurring (both digits repeat) as a fraction in its simplest form", options: ["4/9", "43/100", "43/9", "43/99"], answer: 3 },
  { id: "h_surd5997", topic: "numbers", time: 205, q: "Rationalise the denominator of 2/√5", options: ["2√5", "10√5", "2/5√5", "2√5/5"], answer: 3 },
  { id: "h_sf5998", topic: "numbers", time: 210, q: "Work out (1.07 × 10^-5) × (4.46 × 10^3), giving your answer in standard form", options: ["4.77 × 10^-2", "4.77 × 10^-1", "47.72 × 10^-3", "4.77 × 10^-3"], answer: 0 },
  { id: "h_rec5999", topic: "numbers", time: 203, q: "Write the recurring decimal 0.66 recurring (both digits repeat) as a fraction in its simplest form", options: ["33/50", "67/99", "2/3", "22/3"], answer: 2 },
  { id: "h_rec6000", topic: "numbers", time: 202, q: "Write the recurring decimal 0.19 recurring (both digits repeat) as a fraction in its simplest form", options: ["19/99", "19/9", "19/100", "20/99"], answer: 0 },
  { id: "h_sf6001", topic: "numbers", time: 228, q: "Work out (1.11 × 10^-2) ÷ (8.94 × 10^7), giving your answer in standard form", options: ["1.24 × 10^-9", "12.42 × 10^-11", "1.24 × 10^-10", "1.24 × 10^-11"], answer: 2 },
  { id: "h_rec6002", topic: "numbers", time: 212, q: "Write the recurring decimal 0.28 recurring (both digits repeat) as a fraction in its simplest form", options: ["28/9", "29/99", "7/25", "28/99"], answer: 3 },
  { id: "h_sf6003", topic: "numbers", time: 204, q: "Work out (9.87 × 10^-2) ÷ (4.08 × 10^-2), giving your answer in standard form", options: ["24.19 × 10^-1", "2.42 × 10^1", "2.42 × 10^0", "2.42 × 10^-1"], answer: 2 },
  { id: "h_surd6004", topic: "numbers", time: 209, q: "Rationalise the denominator of 7/√2", options: ["7/2√2", "7√2", "14√2", "7√2/2"], answer: 3 },
  { id: "h_rec6005", topic: "numbers", time: 217, q: "Write the recurring decimal 0.82 recurring (both digits repeat) as a fraction in its simplest form", options: ["83/99", "82/99", "41/50", "82/9"], answer: 1 },
  { id: "h_rec6006", topic: "numbers", time: 195, q: "Write the recurring decimal 0.29 recurring (both digits repeat) as a fraction in its simplest form", options: ["29/99", "10/33", "29/9", "29/100"], answer: 0 },
  { id: "h_surd6007", topic: "numbers", time: 204, q: "Rationalise the denominator of 4/√5", options: ["4/5√5", "4√5/5", "4√5", "20√5"], answer: 1 },
  { id: "h_surd6009", topic: "numbers", time: 209, q: "Rationalise the denominator of 2/√6", options: ["2√6/6", "12√6", "2/6√6", "2√6"], answer: 0 },
  { id: "h_sf6010", topic: "numbers", time: 220, q: "Work out (9.28 × 10^5) ÷ (2.86 × 10^-4), giving your answer in standard form", options: ["3.24 × 10^10", "32.45 × 10^8", "3.24 × 10^9", "3.24 × 10^8"], answer: 2 },
  { id: "h_surd6011", topic: "numbers", time: 200, q: "Rationalise the denominator of 9/√6", options: ["9√6/6", "9/6√6", "54√6", "9√6"], answer: 0 },
  { id: "h_surd6012", topic: "numbers", time: 197, q: "Rationalise the denominator of 7/√7", options: ["7√7", "49√7", "1√7", "7/7√7"], answer: 2 },
  { id: "h_rec6013", topic: "numbers", time: 194, q: "Write the recurring decimal 0.25 recurring (both digits repeat) as a fraction in its simplest form", options: ["25/9", "26/99", "25/99", "1/4"], answer: 2 },
  { id: "h_rec6014", topic: "numbers", time: 215, q: "Write the recurring decimal 0.27 recurring (both digits repeat) as a fraction in its simplest form", options: ["3/11", "27/100", "3", "28/99"], answer: 0 },
  { id: "h_surd6015", topic: "numbers", time: 210, q: "Rationalise the denominator of 8/√3", options: ["8√3/3", "8√3", "24√3", "8/3√3"], answer: 0 },
  { id: "h_surd6016", topic: "numbers", time: 196, q: "Rationalise the denominator of 9/√7", options: ["63√7", "9√7/7", "9√7", "9/7√7"], answer: 1 },
  { id: "h_surd6017", topic: "numbers", time: 208, q: "Rationalise the denominator of 6/√10", options: ["6√10", "6/10√10", "6√10/10", "60√10"], answer: 2 },
  { id: "h_rec6018", topic: "numbers", time: 212, q: "Write the recurring decimal 0.52 recurring (both digits repeat) as a fraction in its simplest form", options: ["52/9", "52/99", "53/99", "13/25"], answer: 1 },
  { id: "h_rec6019", topic: "numbers", time: 207, q: "Write the recurring decimal 0.57 recurring (both digits repeat) as a fraction in its simplest form", options: ["57/100", "19/33", "19/3", "58/99"], answer: 1 },
  { id: "h_sf6020", topic: "numbers", time: 226, q: "Work out (1.28 × 10^6) × (6.53 × 10^-6), giving your answer in standard form", options: ["8.36 × 10^0", "83.58 × 10^-1", "8.36 × 10^-1", "8.36 × 10^1"], answer: 0 },
  { id: "h_surd6021", topic: "numbers", time: 205, q: "Rationalise the denominator of 5/√2", options: ["5√2/2", "5/2√2", "10√2", "5√2"], answer: 0 },
  { id: "h_surd6022", topic: "numbers", time: 208, q: "Rationalise the denominator of 5/√7", options: ["5√7/7", "35√7", "5/7√7", "5√7"], answer: 0 },
  { id: "h_sf6024", topic: "numbers", time: 209, q: "Work out (6.77 × 10^4) × (6.41 × 10^-4), giving your answer in standard form", options: ["4.34 × 10^2", "4.34 × 10^1", "43.4 × 10^0", "4.34 × 10^0"], answer: 1 },
  { id: "h_sf6025", topic: "numbers", time: 210, q: "Work out (5.01 × 10^7) × (7.19 × 10^-4), giving your answer in standard form", options: ["36.02 × 10^3", "3.6 × 10^4", "3.6 × 10^3", "3.6 × 10^5"], answer: 1 },
  { id: "h_surd6027", topic: "numbers", time: 209, q: "Rationalise the denominator of 9/√3", options: ["9√3", "27√3", "9/3√3", "3√3"], answer: 3 },
  { id: "h_surd6028", topic: "numbers", time: 209, q: "Rationalise the denominator of 4/√7", options: ["28√7", "4√7/7", "4/7√7", "4√7"], answer: 1 },
  { id: "h_sf6029", topic: "numbers", time: 228, q: "Work out (4.72 × 10^7) ÷ (8.28 × 10^7), giving your answer in standard form", options: ["57 × 10^-2", "5.7 × 10^0", "5.7 × 10^-2", "5.7 × 10^-1"], answer: 3 },
  { id: "h_surd6030", topic: "numbers", time: 203, q: "Rationalise the denominator of 2/√3", options: ["2/3√3", "2√3", "6√3", "2√3/3"], answer: 3 },
  { id: "h_rec6031", topic: "numbers", time: 196, q: "Write the recurring decimal 0.22 recurring (both digits repeat) as a fraction in its simplest form", options: ["23/99", "2/9", "11/50", "22/9"], answer: 1 },
  { id: "h_sf6033", topic: "numbers", time: 206, q: "Work out (1.67 × 10^5) × (2.61 × 10^5), giving your answer in standard form", options: ["4.36 × 10^11", "4.36 × 10^9", "43.59 × 10^9", "4.36 × 10^10"], answer: 3 },
  { id: "h_sf6034", topic: "numbers", time: 227, q: "Work out (8.87 × 10^-4) ÷ (3.34 × 10^-2), giving your answer in standard form", options: ["2.66 × 10^-2", "2.66 × 10^-1", "2.66 × 10^-3", "26.56 × 10^-3"], answer: 0 },
  { id: "h_sf6035", topic: "numbers", time: 222, q: "Work out (1.07 × 10^-8) × (6.77 × 10^8), giving your answer in standard form", options: ["72.44 × 10^-1", "7.24 × 10^1", "7.24 × 10^0", "7.24 × 10^-1"], answer: 2 },
  { id: "h_sf6037", topic: "numbers", time: 206, q: "Work out (5.66 × 10^-1) ÷ (7.24 × 10^6), giving your answer in standard form", options: ["7.82 × 10^-8", "78.18 × 10^-9", "7.82 × 10^-9", "7.82 × 10^-7"], answer: 0 },
  { id: "h_rec6038", topic: "numbers", time: 214, q: "Write the recurring decimal 0.18 recurring (both digits repeat) as a fraction in its simplest form", options: ["9/50", "2", "2/11", "19/99"], answer: 2 },
  { id: "h_sf6042", topic: "numbers", time: 229, q: "Work out (7.29 × 10^2) × (2.12 × 10^-4), giving your answer in standard form", options: ["15.45 × 10^-2", "1.55 × 10^0", "1.55 × 10^-1", "1.55 × 10^-2"], answer: 2 },
  { id: "h_rec6043", topic: "numbers", time: 192, q: "Write the recurring decimal 0.40 recurring (both digits repeat) as a fraction in its simplest form", options: ["2/5", "40/9", "40/99", "41/99"], answer: 2 },
  { id: "h_rec6045", topic: "numbers", time: 199, q: "Write the recurring decimal 0.85 recurring (both digits repeat) as a fraction in its simplest form", options: ["85/9", "86/99", "17/20", "85/99"], answer: 3 },
  // Ch accuracy — 50 questions (0 from real Edexcel 4MA1 past papers, 50 practice questions in the same style)
  { id: "h_bnd6079", topic: "accuracy", time: 218, q: "x = 46.97 and y = 8.48, both correct to 2 d.p. Find the upper bound of x × y, correct to 3 d.p.", options: ["398.583", "398.306", "398.028", "399.083"], answer: 0 },
  { id: "h_bnd6080", topic: "accuracy", time: 227, q: "x = 38 and y = 11.91, both correct to 2 d.p. Find the lower bound of x ÷ y, correct to 3 d.p.", options: ["3.189", "3.192", "452.58", "3.689"], answer: 0 },
  { id: "h_bnd6081", topic: "accuracy", time: 232, q: "x = 41.78 and y = 13.81, both correct to 2 d.p. Find the lower bound of x ÷ y, correct to 3 d.p.", options: ["3.024", "3.027", "576.982", "3.524"], answer: 0 },
  { id: "h_bnd6082", topic: "accuracy", time: 233, q: "x = 18.74 and y = 3.33, both correct to 2 d.p. Find the lower bound of x ÷ y, correct to 3 d.p.", options: ["62.404", "6.118", "5.618", "5.638"], answer: 2 },
  { id: "h_bnd6083", topic: "accuracy", time: 212, q: "x = 23.03 and y = 8.71, both correct to 2 d.p. Find the upper bound of x × y, correct to 3 d.p.", options: ["200.591", "201.25", "200.75", "200.433"], answer: 2 },
  { id: "h_bnd6084", topic: "accuracy", time: 233, q: "x = 32.63 and y = 8.69, both correct to 2 d.p. Find the upper bound of x × y, correct to 3 d.p.", options: ["283.348", "283.761", "284.261", "283.555"], answer: 1 },
  { id: "h_bnd6085", topic: "accuracy", time: 212, q: "x = 40.84 and y = 14.29, both correct to 2 d.p. Find the upper bound of x × y, correct to 3 d.p.", options: ["583.604", "583.879", "584.379", "583.328"], answer: 1 },
  { id: "h_bnd6086", topic: "accuracy", time: 223, q: "x = 13.64 and y = 7.46, both correct to 2 d.p. Find the upper bound of x × y, correct to 3 d.p.", options: ["101.754", "101.86", "102.36", "101.649"], answer: 1 },
  { id: "h_bnd6087", topic: "accuracy", time: 237, q: "x = 47.95 and y = 5.48, both correct to 2 d.p. Find the upper bound of x × y, correct to 3 d.p.", options: ["262.499", "262.766", "263.033", "263.533"], answer: 2 },
  { id: "h_bnd6088", topic: "accuracy", time: 228, q: "x = 6.06 and y = 2.26, both correct to 2 d.p. Find the lower bound of x ÷ y, correct to 3 d.p.", options: ["2.69", "2.673", "3.173", "13.696"], answer: 1 },
  { id: "h_bnd6089", topic: "accuracy", time: 229, q: "x = 32.42 and y = 3.47, both correct to 2 d.p. Find the upper bound of x × y, correct to 3 d.p.", options: ["112.497", "112.677", "112.318", "113.177"], answer: 1 },
  { id: "h_bnd6090", topic: "accuracy", time: 212, q: "x = 32.98 and y = 13.97, both correct to 2 d.p. Find the upper bound of x × y, correct to 3 d.p.", options: ["460.731", "461.465", "460.496", "460.965"], answer: 3 },
  { id: "h_bnd6091", topic: "accuracy", time: 228, q: "x = 9.32 and y = 14.28, both correct to 2 d.p. Find the lower bound of x ÷ y, correct to 3 d.p.", options: ["1.152", "133.09", "0.653", "0.652"], answer: 3 },
  { id: "h_bnd6092", topic: "accuracy", time: 211, q: "x = 45.37 and y = 10.67, both correct to 2 d.p. Find the upper bound of x ÷ y, correct to 3 d.p.", options: ["484.098", "4.255", "4.755", "4.25"], answer: 1 },
  { id: "h_bnd6093", topic: "accuracy", time: 236, q: "x = 49.56 and y = 13.78, both correct to 2 d.p. Find the lower bound of x ÷ y, correct to 3 d.p.", options: ["3.598", "3.595", "682.937", "4.095"], answer: 1 },
  { id: "h_bnd6094", topic: "accuracy", time: 238, q: "x = 14.28 and y = 9.65, both correct to 2 d.p. Find the upper bound of x × y, correct to 3 d.p.", options: ["138.422", "137.802", "137.682", "137.922"], answer: 3 },
  { id: "h_bnd6095", topic: "accuracy", time: 240, q: "x = 20.25 and y = 2.55, both correct to 2 d.p. Find the lower bound of x × y, correct to 3 d.p.", options: ["51.524", "51.752", "52.024", "51.637"], answer: 0 },
  { id: "h_bnd6096", topic: "accuracy", time: 214, q: "x = 44.95 and y = 11.32, both correct to 2 d.p. Find the upper bound of x ÷ y, correct to 3 d.p.", options: ["4.473", "3.969", "508.834", "3.973"], answer: 3 },
  { id: "h_bnd6097", topic: "accuracy", time: 229, q: "x = 45.57 and y = 4.14, both correct to 2 d.p. Find the lower bound of x ÷ y, correct to 3 d.p.", options: ["11.493", "11.022", "10.993", "188.66"], answer: 2 },
  { id: "h_bnd6098", topic: "accuracy", time: 231, q: "x = 11.68 and y = 12.1, both correct to 2 d.p. Find the upper bound of x × y, correct to 3 d.p.", options: ["141.947", "141.447", "141.328", "141.209"], answer: 1 },
  { id: "h_bnd6099", topic: "accuracy", time: 220, q: "x = 19.66 and y = 4.97, both correct to 2 d.p. Find the lower bound of x ÷ y, correct to 3 d.p.", options: ["3.951", "4.451", "3.961", "97.71"], answer: 0 },
  { id: "h_bnd6100", topic: "accuracy", time: 228, q: "x = 9.14 and y = 6.84, both correct to 2 d.p. Find the lower bound of x × y, correct to 3 d.p.", options: ["62.518", "62.598", "62.438", "62.938"], answer: 2 },
  { id: "h_bnd6101", topic: "accuracy", time: 228, q: "x = 21.81 and y = 10.16, both correct to 2 d.p. Find the upper bound of x × y, correct to 3 d.p.", options: ["222.249", "221.59", "221.43", "221.749"], answer: 3 },
  { id: "h_bnd6102", topic: "accuracy", time: 222, q: "x = 6.75 and y = 6.8, both correct to 2 d.p. Find the upper bound of x × y, correct to 3 d.p.", options: ["45.832", "45.968", "46.468", "45.9"], answer: 1 },
  { id: "h_bnd6103", topic: "accuracy", time: 225, q: "x = 43.61 and y = 4.05, both correct to 2 d.p. Find the upper bound of x ÷ y, correct to 3 d.p.", options: ["10.782", "11.282", "10.753", "176.62"], answer: 0 },
  { id: "h_bnd6104", topic: "accuracy", time: 238, q: "x = 22.99 and y = 4.54, both correct to 2 d.p. Find the upper bound of x ÷ y, correct to 3 d.p.", options: ["5.571", "5.057", "104.375", "5.071"], answer: 3 },
  { id: "h_bnd6105", topic: "accuracy", time: 227, q: "x = 40.13 and y = 14.76, both correct to 2 d.p. Find the upper bound of x × y, correct to 3 d.p.", options: ["593.093", "592.044", "592.593", "592.319"], answer: 2 },
  { id: "h_bnd6106", topic: "accuracy", time: 228, q: "x = 39.59 and y = 7.22, both correct to 2 d.p. Find the lower bound of x ÷ y, correct to 3 d.p.", options: ["5.479", "5.979", "285.84", "5.488"], answer: 0 },
  { id: "h_bnd6107", topic: "accuracy", time: 227, q: "x = 9.21 and y = 2.55, both correct to 2 d.p. Find the lower bound of x ÷ y, correct to 3 d.p.", options: ["4.103", "3.603", "23.486", "3.621"], answer: 1 },
  { id: "h_bnd6108", topic: "accuracy", time: 214, q: "x = 9.38 and y = 8.15, both correct to 2 d.p. Find the lower bound of x ÷ y, correct to 3 d.p.", options: ["76.447", "1.15", "1.152", "1.65"], answer: 1 },
  { id: "h_bnd6109", topic: "accuracy", time: 225, q: "x = 37.67 and y = 3.11, both correct to 2 d.p. Find the lower bound of x ÷ y, correct to 3 d.p.", options: ["12.134", "12.591", "12.091", "117.154"], answer: 2 },
  { id: "h_bnd6110", topic: "accuracy", time: 210, q: "x = 32.35 and y = 9.9, both correct to 2 d.p. Find the upper bound of x × y, correct to 3 d.p.", options: ["320.476", "320.976", "320.265", "320.054"], answer: 0 },
  { id: "h_bnd6111", topic: "accuracy", time: 232, q: "x = 20.39 and y = 13.04, both correct to 2 d.p. Find the lower bound of x × y, correct to 3 d.p.", options: ["266.053", "266.218", "265.886", "265.718"], answer: 3 },
  { id: "h_bnd6112", topic: "accuracy", time: 213, q: "x = 11.87 and y = 4.73, both correct to 2 d.p. Find the upper bound of x × y, correct to 3 d.p.", options: ["56.728", "56.145", "56.062", "56.228"], answer: 3 },
  { id: "h_bnd6113", topic: "accuracy", time: 235, q: "x = 43.66 and y = 3.62, both correct to 2 d.p. Find the lower bound of x ÷ y, correct to 3 d.p.", options: ["12.079", "12.543", "12.043", "158.049"], answer: 2 },
  { id: "h_bnd6114", topic: "accuracy", time: 229, q: "x = 27.83 and y = 3.5, both correct to 2 d.p. Find the lower bound of x ÷ y, correct to 3 d.p.", options: ["8.439", "7.964", "7.939", "97.405"], answer: 2 },
  { id: "h_bnd6115", topic: "accuracy", time: 239, q: "x = 11.89 and y = 14.19, both correct to 2 d.p. Find the upper bound of x × y, correct to 3 d.p.", options: ["168.85", "168.589", "168.719", "169.35"], answer: 0 },
  { id: "h_bnd6116", topic: "accuracy", time: 215, q: "x = 46.84 and y = 8.51, both correct to 2 d.p. Find the upper bound of x × y, correct to 3 d.p.", options: ["398.608", "398.332", "398.885", "399.385"], answer: 2 },
  { id: "h_bnd6117", topic: "accuracy", time: 233, q: "x = 19.31 and y = 5.95, both correct to 2 d.p. Find the upper bound of x ÷ y, correct to 3 d.p.", options: ["3.242", "3.749", "3.249", "114.894"], answer: 2 },
  { id: "h_bnd6118", topic: "accuracy", time: 223, q: "x = 26.42 and y = 2.12, both correct to 2 d.p. Find the upper bound of x ÷ y, correct to 3 d.p.", options: ["56.01", "12.994", "12.431", "12.494"], answer: 3 },
  { id: "h_bnd6119", topic: "accuracy", time: 215, q: "x = 14.54 and y = 2.03, both correct to 2 d.p. Find the lower bound of x × y, correct to 3 d.p.", options: ["29.933", "29.516", "29.599", "29.433"], answer: 3 },
  { id: "h_bnd6120", topic: "accuracy", time: 211, q: "x = 42.18 and y = 8.38, both correct to 2 d.p. Find the lower bound of x ÷ y, correct to 3 d.p.", options: ["5.037", "5.03", "353.468", "5.53"], answer: 1 },
  { id: "h_bnd6121", topic: "accuracy", time: 235, q: "x = 26.15 and y = 14.3, both correct to 2 d.p. Find the lower bound of x × y, correct to 3 d.p.", options: ["374.147", "373.945", "373.743", "374.243"], answer: 2 },
  { id: "h_bnd6122", topic: "accuracy", time: 238, q: "x = 24.08 and y = 6.93, both correct to 2 d.p. Find the upper bound of x × y, correct to 3 d.p.", options: ["167.529", "167.029", "166.719", "166.874"], answer: 1 },
  { id: "h_bnd6123", topic: "accuracy", time: 229, q: "x = 40.35 and y = 12.6, both correct to 2 d.p. Find the lower bound of x ÷ y, correct to 3 d.p.", options: ["3.204", "508.41", "3.201", "3.701"], answer: 2 },
  { id: "h_bnd6124", topic: "accuracy", time: 235, q: "x = 41.52 and y = 3.6, both correct to 2 d.p. Find the upper bound of x ÷ y, correct to 3 d.p.", options: ["12.051", "149.472", "11.551", "11.516"], answer: 2 },
  { id: "h_bnd6125", topic: "accuracy", time: 240, q: "x = 47.1 and y = 13.52, both correct to 2 d.p. Find the lower bound of x ÷ y, correct to 3 d.p.", options: ["3.982", "636.792", "3.485", "3.482"], answer: 3 },
  { id: "h_bnd6126", topic: "accuracy", time: 235, q: "x = 20.29 and y = 6.7, both correct to 2 d.p. Find the lower bound of x × y, correct to 3 d.p.", options: ["136.308", "136.078", "135.808", "135.943"], answer: 2 },
  { id: "h_bnd6127", topic: "accuracy", time: 218, q: "x = 24.15 and y = 14.21, both correct to 2 d.p. Find the upper bound of x × y, correct to 3 d.p.", options: ["343.863", "342.98", "343.363", "343.171"], answer: 2 },
  { id: "h_bnd6128", topic: "accuracy", time: 214, q: "x = 27.77 and y = 2, both correct to 2 d.p. Find the lower bound of x × y, correct to 3 d.p.", options: ["55.391", "55.689", "55.891", "55.54"], answer: 0 },
  // Ch factorising — 50 questions (7 from real Edexcel 4MA1 past papers, 43 practice questions in the same style)
  { id: "fa1", topic: "factorising", ref: "Nov 2025 1H Q21", time: 200, q: "Express 5x² − 20x + 23 in the form a(x − b)² + c", options: ["5(x − 2)² + 3", "5(x − 4)² + 23", "5(x − 2)² − 3", "5(x − 10)² + 23"], answer: 0 },
  { id: "fa2", topic: "factorising", ref: "June 2025 2H Q12", time: 220, q: "Expand and simplify 3x(2x + 5)(7x − 4)", options: ["42x³ + 81x² − 60x", "42x³ + 29x² − 60x", "42x³ + 81x² + 60x", "14x³ + 81x² − 60x"], answer: 0 },
  { id: "fa3", topic: "factorising", ref: "Nov 2023 2H Q16", time: 220, q: "Expand and simplify (2x + 3)(x − 5)(x + 4)", options: ["2x³ + x² − 43x − 60", "2x³ − x² − 43x − 60", "2x³ + x² + 43x − 60", "2x³ + 13x² − 43x − 60"], answer: 0 },
  { id: "fa4", topic: "factorising", ref: "June 2023 1H Q14", time: 200, q: "Factorise fully 50g² − 18", options: ["2(5g − 3)(5g + 3)", "2(5g − 3)²", "(10g − 6)(5g + 3)", "2(25g² − 9)"], answer: 0 },
  { id: "fa5", topic: "factorising", ref: "June 2023 2H Q19", time: 200, q: "Express 3x² − 6x + 5 in the form a(x − b)² + c", options: ["3(x − 1)² + 2", "3(x − 2)² + 5", "3(x − 1)² − 2", "3(x − 3)² + 5"], answer: 0 },
  { id: "fa6", topic: "factorising", ref: "Jan 2022 2H Q1", time: 190, q: "Expand and simplify (y + 4)(2 − y)", options: ["−y² − 2y + 8", "y² − 2y + 8", "−y² + 2y + 8", "−y² − 6y + 8"], answer: 0 },
  { id: "fa7", topic: "factorising", ref: "Jan 2022 2H Q1", time: 210, q: "Factorise fully 15b⁵c − 35b³c⁹", options: ["5b³c(3b² − 7c⁸)", "5bc(3b⁴ − 7c⁸)", "5b³c(3b² − 7c⁹)", "5b³(3b²c − 7c⁹)"], answer: 0 },
  { id: "h_cs6159", topic: "factorising", time: 233, q: "Express 5x² − 90x + 409 in the form a(x − b)² + c", options: ["5(x + 9)² − 4", "5(x + 9)² + 409", "5(x + 9)² + 4", "5(x − 9)² + 4"], answer: 2 },
  { id: "h_dos6160", topic: "factorising", time: 222, q: "Factorise fully 100x² − 16", options: ["4(5x − 2)²", "4x(5x − 2)(5x + 2)", "(20x − 2)(5x + 2)", "4(5x − 2)(5x + 2)"], answer: 3 },
  { id: "h_exp36161", topic: "factorising", time: 233, q: "Expand and simplify (x − 4)(x − 1)(x + 1)", options: ["x³ + 4x² − x + 4", "x³ − 4x² − x + 4", "x³ − 4x² − x − 4", "x³ − 4x² + x + 4"], answer: 1 },
  { id: "h_cs6162", topic: "factorising", time: 244, q: "Express x² + 14x + 62 in the form a(x − b)² + c", options: ["1(x − 7)² + 62", "1(x − 7)² + 13", "1(x − 7)² − 13", "1(x + 7)² + 13"], answer: 1 },
  { id: "h_exp36163", topic: "factorising", time: 230, q: "Expand and simplify (x − 1)(x + 3)(x − 1)", options: ["x³ + x² − 5x − 3", "x³ + x² + 5x + 3", "x³ − x² − 5x + 3", "x³ + x² − 5x + 3"], answer: 3 },
  { id: "h_exp36164", topic: "factorising", time: 228, q: "Expand and simplify (x − 4)(x − 4)(x + 4)", options: ["x³ − 4x² + 16x + 64", "x³ − 4x² − 16x − 64", "x³ − 4x² − 16x + 64", "x³ + 4x² − 16x + 64"], answer: 2 },
  { id: "h_exp36165", topic: "factorising", time: 223, q: "Expand and simplify (x + 4)(x − 1)(x + 1)", options: ["x³ + 4x² + x − 4", "x³ − 4x² − x − 4", "x³ + 4x² − x + 4", "x³ + 4x² − x − 4"], answer: 3 },
  { id: "h_cs6166", topic: "factorising", time: 246, q: "Express 5x² + 60x + 176 in the form a(x − b)² + c", options: ["5(x − 6)² + 176", "5(x + 6)² − 4", "5(x − 6)² + 4", "5(x − 6)² − 4"], answer: 3 },
  { id: "h_exp36167", topic: "factorising", time: 236, q: "Expand and simplify (x − 3)(x − 2)(x − 5)", options: ["x³ + 10x² + 31x − 30", "x³ − 10x² + 31x + 30", "x³ − 10x² + 31x − 30", "x³ − 10x² − 31x − 30"], answer: 2 },
  { id: "h_dos6168", topic: "factorising", time: 218, q: "Factorise fully 200x² − 128", options: ["2(10x − 8)²", "2x(10x − 8)(10x + 8)", "(20x − 8)(10x + 8)", "2(10x − 8)(10x + 8)"], answer: 3 },
  { id: "h_exp36169", topic: "factorising", time: 242, q: "Expand and simplify (x − 2)(x + 6)(x + 6)", options: ["x³ − 10x² + 12x − 72", "x³ + 10x² − 12x − 72", "x³ + 10x² + 12x + 72", "x³ + 10x² + 12x − 72"], answer: 3 },
  { id: "h_cs6170", topic: "factorising", time: 237, q: "Express 2x² + 24x + 61 in the form a(x − b)² + c", options: ["2(x − 6)² + 11", "2(x − 6)² + 61", "2(x − 6)² − 11", "2(x + 6)² − 11"], answer: 2 },
  { id: "h_exp36172", topic: "factorising", time: 234, q: "Expand and simplify (x − 2)(x − 3)(x − 5)", options: ["x³ − 10x² − 31x − 30", "x³ − 10x² + 31x − 30", "x³ − 10x² + 31x + 30", "x³ + 10x² + 31x − 30"], answer: 1 },
  { id: "h_dos6173", topic: "factorising", time: 204, q: "Factorise fully 28x² − 112", options: ["7x(2x − 4)(2x + 4)", "(14x − 4)(2x + 4)", "7(2x − 4)²", "7(2x − 4)(2x + 4)"], answer: 3 },
  { id: "h_dos6174", topic: "factorising", time: 217, q: "Factorise fully 100x² − 100", options: ["4x(5x − 5)(5x + 5)", "4(5x − 5)²", "4(5x − 5)(5x + 5)", "(20x − 5)(5x + 5)"], answer: 2 },
  { id: "h_exp36175", topic: "factorising", time: 224, q: "Expand and simplify (x + 4)(x − 6)(x + 5)", options: ["x³ + 3x² + 34x − 120", "x³ + 3x² − 34x + 120", "x³ − 3x² − 34x − 120", "x³ + 3x² − 34x − 120"], answer: 3 },
  { id: "h_dos6176", topic: "factorising", time: 204, q: "Factorise fully 18x² − 72", options: ["2x(3x − 6)(3x + 6)", "2(3x − 6)(3x + 6)", "(6x − 6)(3x + 6)", "2(3x − 6)²"], answer: 1 },
  { id: "h_exp36177", topic: "factorising", time: 238, q: "Expand and simplify (x − 3)(x − 2)(x + 2)", options: ["x³ + 3x² − 4x + 12", "x³ − 3x² − 4x + 12", "x³ − 3x² − 4x − 12", "x³ − 3x² + 4x + 12"], answer: 1 },
  { id: "h_cs6178", topic: "factorising", time: 244, q: "Express 2x² + 20x + 63 in the form a(x − b)² + c", options: ["2(x + 5)² + 13", "2(x − 5)² − 13", "2(x − 5)² + 13", "2(x − 5)² + 63"], answer: 2 },
  { id: "h_dos6179", topic: "factorising", time: 221, q: "Factorise fully 147x² − 108", options: ["3(7x − 6)(7x + 6)", "(21x − 6)(7x + 6)", "3(7x − 6)²", "3x(7x − 6)(7x + 6)"], answer: 0 },
  { id: "h_dos6180", topic: "factorising", time: 200, q: "Factorise fully 567x² − 567", options: ["7(9x − 9)²", "7x(9x − 9)(9x + 9)", "(63x − 9)(9x + 9)", "7(9x − 9)(9x + 9)"], answer: 3 },
  { id: "h_cs6181", topic: "factorising", time: 248, q: "Express 2x² + 32x + 133 in the form a(x − b)² + c", options: ["2(x − 8)² + 133", "2(x − 8)² + 5", "2(x + 8)² + 5", "2(x − 8)² − 5"], answer: 1 },
  { id: "h_dos6182", topic: "factorising", time: 202, q: "Factorise fully 400x² − 4", options: ["4(10x − 1)(10x + 1)", "4(10x − 1)²", "(40x − 1)(10x + 1)", "4x(10x − 1)(10x + 1)"], answer: 0 },
  { id: "h_cs6184", topic: "factorising", time: 239, q: "Express 3x² + 12x + 13 in the form a(x − b)² + c", options: ["3(x − 2)² − 1", "3(x − 2)² + 1", "3(x + 2)² + 1", "3(x − 2)² + 13"], answer: 1 },
  { id: "h_cs6185", topic: "factorising", time: 225, q: "Express x² + 18x + 70 in the form a(x − b)² + c", options: ["1(x − 9)² + 70", "1(x − 9)² − 11", "1(x − 9)² + 11", "1(x + 9)² − 11"], answer: 1 },
  { id: "h_cs6186", topic: "factorising", time: 250, q: "Express 2x² + 36x + 175 in the form a(x − b)² + c", options: ["2(x − 9)² − 13", "2(x − 9)² + 175", "2(x − 9)² + 13", "2(x + 9)² + 13"], answer: 2 },
  { id: "h_exp36187", topic: "factorising", time: 248, q: "Expand and simplify (x − 2)(x + 1)(x − 5)", options: ["x³ − 6x² + 3x + 10", "x³ − 6x² + 3x − 10", "x³ + 6x² + 3x + 10", "x³ − 6x² − 3x + 10"], answer: 0 },
  { id: "h_dos6188", topic: "factorising", time: 207, q: "Factorise fully 32x² − 2", options: ["2(4x − 1)²", "(8x − 1)(4x + 1)", "2x(4x − 1)(4x + 1)", "2(4x − 1)(4x + 1)"], answer: 3 },
  { id: "h_cs6189", topic: "factorising", time: 246, q: "Express 3x² − 54x + 250 in the form a(x − b)² + c", options: ["3(x − 9)² + 7", "3(x + 9)² − 7", "3(x + 9)² + 7", "3(x + 9)² + 250"], answer: 2 },
  { id: "h_exp36190", topic: "factorising", time: 222, q: "Expand and simplify (x − 1)(x + 4)(x + 1)", options: ["x³ + 4x² + x − 4", "x³ − 4x² − x − 4", "x³ + 4x² − x − 4", "x³ + 4x² − x + 4"], answer: 2 },
  { id: "h_dos6191", topic: "factorising", time: 207, q: "Factorise fully 96x² − 6", options: ["6(4x − 1)(4x + 1)", "6(4x − 1)²", "(24x − 1)(4x + 1)", "6x(4x − 1)(4x + 1)"], answer: 0 },
  { id: "h_dos6192", topic: "factorising", time: 204, q: "Factorise fully 245x² − 5", options: ["5(7x − 1)²", "(35x − 1)(7x + 1)", "5x(7x − 1)(7x + 1)", "5(7x − 1)(7x + 1)"], answer: 3 },
  { id: "h_cs6193", topic: "factorising", time: 225, q: "Express x² + 10x + 10 in the form a(x − b)² + c", options: ["1(x − 5)² + 10", "1(x − 5)² + 15", "1(x + 5)² − 15", "1(x − 5)² − 15"], answer: 3 },
  { id: "h_exp36194", topic: "factorising", time: 247, q: "Expand and simplify (x + 1)(x − 6)(x − 1)", options: ["x³ − 6x² − x − 6", "x³ − 6x² + x + 6", "x³ + 6x² − x + 6", "x³ − 6x² − x + 6"], answer: 3 },
  { id: "h_exp36195", topic: "factorising", time: 239, q: "Expand and simplify (x − 1)(x − 4)(x − 1)", options: ["x³ + 6x² + 9x − 4", "x³ − 6x² + 9x + 4", "x³ − 6x² − 9x − 4", "x³ − 6x² + 9x − 4"], answer: 3 },
  { id: "h_cs6196", topic: "factorising", time: 237, q: "Express 3x² − 6x − 9 in the form a(x − b)² + c", options: ["3(x + 1)² − 9", "3(x + 1)² − 12", "3(x + 1)² + 12", "3(x − 1)² − 12"], answer: 1 },
  { id: "h_exp36197", topic: "factorising", time: 227, q: "Expand and simplify (x − 3)(x + 5)(x − 5)", options: ["x³ − 3x² − 25x − 75", "x³ + 3x² − 25x + 75", "x³ − 3x² + 25x + 75", "x³ − 3x² − 25x + 75"], answer: 3 },
  { id: "h_exp36198", topic: "factorising", time: 233, q: "Expand and simplify (x + 4)(x − 5)(x + 5)", options: ["x³ + 4x² + 25x − 100", "x³ − 4x² − 25x − 100", "x³ + 4x² − 25x − 100", "x³ + 4x² − 25x + 100"], answer: 2 },
  { id: "h_dos6199", topic: "factorising", time: 218, q: "Factorise fully 72x² − 2", options: ["2x(6x − 1)(6x + 1)", "2(6x − 1)²", "2(6x − 1)(6x + 1)", "(12x − 1)(6x + 1)"], answer: 2 },
  { id: "h_cs6200", topic: "factorising", time: 228, q: "Express 5x² − 40x + 93 in the form a(x − b)² + c", options: ["5(x + 4)² + 93", "5(x + 4)² + 13", "5(x − 4)² + 13", "5(x + 4)² − 13"], answer: 1 },
  { id: "h_cs6201", topic: "factorising", time: 246, q: "Express 3x² + 6x in the form a(x − b)² + c", options: ["3(x − 1)² + 3", "3(x − 1)² − 3", "3(x + 1)² − 3", "3(x − 1)² "], answer: 1 },
  { id: "h_exp36202", topic: "factorising", time: 223, q: "Expand and simplify (x − 2)(x − 3)(x + 1)", options: ["x³ − 4x² + x + 6", "x³ − 4x² − x + 6", "x³ + 4x² + x + 6", "x³ − 4x² + x − 6"], answer: 0 },
  { id: "h_dos6203", topic: "factorising", time: 226, q: "Factorise fully 196x² − 36", options: ["4(7x − 3)²", "4(7x − 3)(7x + 3)", "(28x − 3)(7x + 3)", "4x(7x − 3)(7x + 3)"], answer: 1 },
  // Ch algfrac — 50 questions (0 from real Edexcel 4MA1 past papers, 50 practice questions in the same style)
  { id: "h_saf6236", topic: "algfrac", time: 219, q: "Simplify (x² − 2x − 35) / (x² − 3x − 28)", options: ["(x + 5)/(x + 4)", "(x + 5)/(x − 7)", "(x − 7)/(x + 4)", "(x − 5)/(x − 4)"], answer: 0 },
  { id: "h_saf6237", topic: "algfrac", time: 232, q: "Simplify (x² + 3x − 18) / (x² − 12x + 27)", options: ["(x − 6)/(x + 9)", "(x + 6)/(x − 3)", "(x − 3)/(x − 9)", "(x + 6)/(x − 9)"], answer: 3 },
  { id: "h_saf6238", topic: "algfrac", time: 222, q: "Simplify (x² + 3x − 28) / (x² − 11x + 28)", options: ["(x − 4)/(x − 7)", "(x + 7)/(x − 4)", "(x + 7)/(x − 7)", "(x − 7)/(x + 7)"], answer: 2 },
  { id: "h_saf6239", topic: "algfrac", time: 210, q: "Simplify (x² − x − 20) / (x² − 13x + 40)", options: ["(x − 5)/(x − 8)", "(x + 4)/(x − 5)", "(x − 4)/(x + 8)", "(x + 4)/(x − 8)"], answer: 3 },
  { id: "h_saf6240", topic: "algfrac", time: 230, q: "Simplify (x² − 3x − 40) / (x² − x − 56)", options: ["(x − 8)/(x + 7)", "(x + 5)/(x + 7)", "(x − 5)/(x − 7)", "(x + 5)/(x − 8)"], answer: 1 },
  { id: "h_saf6241", topic: "algfrac", time: 233, q: "Simplify (x² − 2x − 24) / (x² − 10x + 24)", options: ["(x − 6)/(x − 4)", "(x + 4)/(x − 6)", "(x − 4)/(x + 4)", "(x + 4)/(x − 4)"], answer: 3 },
  { id: "h_saf6242", topic: "algfrac", time: 215, q: "Simplify (x² − 4x − 21) / (x² − 12x + 35)", options: ["(x − 7)/(x − 5)", "(x − 3)/(x + 5)", "(x + 3)/(x − 5)", "(x + 3)/(x − 7)"], answer: 2 },
  { id: "h_saf6243", topic: "algfrac", time: 233, q: "Simplify (x² − 5x − 14) / (x² − 11x + 28)", options: ["(x + 2)/(x − 4)", "(x − 2)/(x + 4)", "(x − 7)/(x − 4)", "(x + 2)/(x − 7)"], answer: 0 },
  { id: "h_saf6244", topic: "algfrac", time: 225, q: "Simplify (x² + 3x − 40) / (x² − 14x + 45)", options: ["(x − 8)/(x + 9)", "(x + 8)/(x − 5)", "(x − 5)/(x − 9)", "(x + 8)/(x − 9)"], answer: 3 },
  { id: "h_saf6245", topic: "algfrac", time: 221, q: "Simplify (x² − 2x − 24) / (x² − 9x + 18)", options: ["(x + 4)/(x − 3)", "(x − 6)/(x − 3)", "(x − 4)/(x + 3)", "(x + 4)/(x − 6)"], answer: 0 },
  { id: "h_saf6246", topic: "algfrac", time: 218, q: "Simplify (x² − 3x − 10) / (x² − x − 20)", options: ["(x − 5)/(x + 4)", "(x + 2)/(x − 5)", "(x − 2)/(x − 4)", "(x + 2)/(x + 4)"], answer: 3 },
  { id: "h_saf6247", topic: "algfrac", time: 234, q: "Simplify (x² − x − 6) / (x² − 9x + 18)", options: ["(x − 3)/(x − 6)", "(x + 2)/(x − 3)", "(x + 2)/(x − 6)", "(x − 2)/(x + 6)"], answer: 2 },
  { id: "h_saf6248", topic: "algfrac", time: 215, q: "Simplify (x² − 2x − 24) / (x² − 13x + 42)", options: ["(x + 4)/(x − 6)", "(x + 4)/(x − 7)", "(x − 4)/(x + 7)", "(x − 6)/(x − 7)"], answer: 1 },
  { id: "h_saf6249", topic: "algfrac", time: 215, q: "Simplify (x² + 2x − 35) / (x² − 25)", options: ["(x − 7)/(x − 5)", "(x + 7)/(x + 5)", "(x + 7)/(x − 5)", "(x − 5)/(x + 5)"], answer: 1 },
  { id: "h_saf6250", topic: "algfrac", time: 221, q: "Simplify (x² + x − 6) / (x² − 3x + 2)", options: ["(x − 3)/(x + 1)", "(x − 2)/(x − 1)", "(x + 3)/(x − 1)", "(x + 3)/(x − 2)"], answer: 2 },
  { id: "h_saf6251", topic: "algfrac", time: 219, q: "Simplify (x² + 4x − 12) / (x² + 5x − 14)", options: ["(x + 6)/(x + 7)", "(x + 6)/(x − 2)", "(x − 2)/(x + 7)", "(x − 6)/(x − 7)"], answer: 0 },
  { id: "h_saf6252", topic: "algfrac", time: 213, q: "Simplify (x² − 2x − 15) / (x² − 14x + 45)", options: ["(x − 5)/(x − 9)", "(x + 3)/(x − 5)", "(x + 3)/(x − 9)", "(x − 3)/(x + 9)"], answer: 2 },
  { id: "h_saf6253", topic: "algfrac", time: 229, q: "Simplify (x² − 49) / (x² − 13x + 42)", options: ["(x − 7)/(x + 6)", "(x + 7)/(x − 7)", "(x − 7)/(x − 6)", "(x + 7)/(x − 6)"], answer: 3 },
  { id: "h_saf6254", topic: "algfrac", time: 222, q: "Simplify (x² − x − 56) / (x² − 5x − 24)", options: ["(x − 8)/(x + 3)", "(x + 7)/(x − 8)", "(x + 7)/(x + 3)", "(x − 7)/(x − 3)"], answer: 2 },
  { id: "h_saf6255", topic: "algfrac", time: 210, q: "Simplify (x² + 3x − 40) / (x² − 9x + 20)", options: ["(x + 8)/(x − 5)", "(x − 8)/(x + 4)", "(x − 5)/(x − 4)", "(x + 8)/(x − 4)"], answer: 3 },
  { id: "h_saf6256", topic: "algfrac", time: 210, q: "Simplify (x² − x − 6) / (x² − 8x + 15)", options: ["(x − 2)/(x + 5)", "(x + 2)/(x − 5)", "(x + 2)/(x − 3)", "(x − 3)/(x − 5)"], answer: 1 },
  { id: "h_saf6257", topic: "algfrac", time: 221, q: "Simplify (x² − 49) / (x² − 11x + 28)", options: ["(x − 7)/(x − 4)", "(x + 7)/(x − 4)", "(x − 7)/(x + 4)", "(x + 7)/(x − 7)"], answer: 1 },
  { id: "h_saf6258", topic: "algfrac", time: 211, q: "Simplify (x² + 3x − 28) / (x² − 3x − 4)", options: ["(x − 4)/(x + 1)", "(x + 7)/(x − 4)", "(x − 7)/(x − 1)", "(x + 7)/(x + 1)"], answer: 3 },
  { id: "h_saf6259", topic: "algfrac", time: 219, q: "Simplify (x² + 2x − 48) / (x² − 11x + 30)", options: ["(x − 8)/(x + 5)", "(x + 8)/(x − 6)", "(x + 8)/(x − 5)", "(x − 6)/(x − 5)"], answer: 2 },
  { id: "h_saf6260", topic: "algfrac", time: 235, q: "Simplify (x² + 5x − 14) / (x² − 8x + 12)", options: ["(x + 7)/(x − 6)", "(x − 2)/(x − 6)", "(x + 7)/(x − 2)", "(x − 7)/(x + 6)"], answer: 0 },
  { id: "h_saf6261", topic: "algfrac", time: 219, q: "Simplify (x² + x − 12) / (x² − x − 6)", options: ["(x + 4)/(x + 2)", "(x − 3)/(x + 2)", "(x + 4)/(x − 3)", "(x − 4)/(x − 2)"], answer: 0 },
  { id: "h_saf6262", topic: "algfrac", time: 224, q: "Simplify (x² − 2x − 15) / (x² − 9x + 20)", options: ["(x + 3)/(x − 4)", "(x − 5)/(x − 4)", "(x − 3)/(x + 4)", "(x + 3)/(x − 5)"], answer: 0 },
  { id: "h_saf6263", topic: "algfrac", time: 214, q: "Simplify (x² + 3x − 10) / (x² − 6x + 8)", options: ["(x − 5)/(x + 4)", "(x − 2)/(x − 4)", "(x + 5)/(x − 2)", "(x + 5)/(x − 4)"], answer: 3 },
  { id: "h_saf6264", topic: "algfrac", time: 237, q: "Simplify (x² − x − 12) / (x² − 2x − 8)", options: ["(x − 3)/(x − 2)", "(x + 3)/(x − 4)", "(x − 4)/(x + 2)", "(x + 3)/(x + 2)"], answer: 3 },
  { id: "h_saf6265", topic: "algfrac", time: 223, q: "Simplify (x² − 4x − 32) / (x² − 11x + 24)", options: ["(x + 4)/(x − 8)", "(x + 4)/(x − 3)", "(x − 4)/(x + 3)", "(x − 8)/(x − 3)"], answer: 1 },
  { id: "h_saf6266", topic: "algfrac", time: 228, q: "Simplify (x² + 6x − 16) / (x² − 6x + 8)", options: ["(x − 2)/(x − 4)", "(x − 8)/(x + 4)", "(x + 8)/(x − 2)", "(x + 8)/(x − 4)"], answer: 3 },
  { id: "h_saf6267", topic: "algfrac", time: 229, q: "Simplify (x² + 4x − 32) / (x² + 5x − 36)", options: ["(x + 8)/(x − 4)", "(x + 8)/(x + 9)", "(x − 8)/(x − 9)", "(x − 4)/(x + 9)"], answer: 1 },
  { id: "h_saf6269", topic: "algfrac", time: 227, q: "Simplify (x² − x − 6) / (x² − 10x + 21)", options: ["(x + 2)/(x − 3)", "(x + 2)/(x − 7)", "(x − 3)/(x − 7)", "(x − 2)/(x + 7)"], answer: 1 },
  { id: "h_saf6270", topic: "algfrac", time: 240, q: "Simplify (x² − 2x − 48) / (x² − 6x − 16)", options: ["(x + 6)/(x − 8)", "(x + 6)/(x + 2)", "(x − 8)/(x + 2)", "(x − 6)/(x − 2)"], answer: 1 },
  { id: "h_saf6271", topic: "algfrac", time: 231, q: "Simplify (x² + 3x − 10) / (x² + 5x − 14)", options: ["(x + 5)/(x + 7)", "(x − 5)/(x − 7)", "(x − 2)/(x + 7)", "(x + 5)/(x − 2)"], answer: 0 },
  { id: "h_saf6272", topic: "algfrac", time: 224, q: "Simplify (x² + 5x − 14) / (x² − 7x + 10)", options: ["(x − 2)/(x − 5)", "(x + 7)/(x − 2)", "(x + 7)/(x − 5)", "(x − 7)/(x + 5)"], answer: 2 },
  { id: "h_saf6273", topic: "algfrac", time: 219, q: "Simplify (x² + 5x − 24) / (x² − x − 6)", options: ["(x − 8)/(x − 2)", "(x + 8)/(x − 3)", "(x − 3)/(x + 2)", "(x + 8)/(x + 2)"], answer: 3 },
  { id: "h_saf6274", topic: "algfrac", time: 230, q: "Simplify (x² − 25) / (x² − 7x + 10)", options: ["(x + 5)/(x − 5)", "(x − 5)/(x − 2)", "(x − 5)/(x + 2)", "(x + 5)/(x − 2)"], answer: 3 },
  { id: "h_saf6275", topic: "algfrac", time: 225, q: "Simplify (x² − 2x − 15) / (x² − 3x − 10)", options: ["(x − 3)/(x − 2)", "(x + 3)/(x + 2)", "(x + 3)/(x − 5)", "(x − 5)/(x + 2)"], answer: 1 },
  { id: "h_saf6276", topic: "algfrac", time: 231, q: "Simplify (x² + 2x − 35) / (x² − 6x + 5)", options: ["(x − 7)/(x + 1)", "(x + 7)/(x − 5)", "(x − 5)/(x − 1)", "(x + 7)/(x − 1)"], answer: 3 },
  { id: "h_saf6277", topic: "algfrac", time: 234, q: "Simplify (x² − 3x − 10) / (x² − 25)", options: ["(x + 2)/(x + 5)", "(x − 5)/(x + 5)", "(x − 2)/(x − 5)", "(x + 2)/(x − 5)"], answer: 0 },
  { id: "h_saf6278", topic: "algfrac", time: 234, q: "Simplify (x² + 4x − 12) / (x² + 6x − 16)", options: ["(x − 6)/(x − 8)", "(x + 6)/(x − 2)", "(x + 6)/(x + 8)", "(x − 2)/(x + 8)"], answer: 2 },
  { id: "h_saf6279", topic: "algfrac", time: 234, q: "Simplify (x² − 5x − 24) / (x² − 12x + 32)", options: ["(x − 3)/(x + 4)", "(x + 3)/(x − 8)", "(x − 8)/(x − 4)", "(x + 3)/(x − 4)"], answer: 3 },
  { id: "h_saf6280", topic: "algfrac", time: 226, q: "Simplify (x² − 64) / (x² − 4x − 32)", options: ["(x + 8)/(x + 4)", "(x − 8)/(x − 4)", "(x − 8)/(x + 4)", "(x + 8)/(x − 8)"], answer: 0 },
  { id: "h_saf6281", topic: "algfrac", time: 218, q: "Simplify (x² − 2x − 48) / (x² − 4x − 32)", options: ["(x − 6)/(x − 4)", "(x − 8)/(x + 4)", "(x + 6)/(x − 8)", "(x + 6)/(x + 4)"], answer: 3 },
  { id: "h_saf6282", topic: "algfrac", time: 224, q: "Simplify (x² − 64) / (x² − 14x + 48)", options: ["(x − 8)/(x − 6)", "(x − 8)/(x + 6)", "(x + 8)/(x − 8)", "(x + 8)/(x − 6)"], answer: 3 },
  { id: "h_saf6283", topic: "algfrac", time: 215, q: "Simplify (x² − 5x − 24) / (x² − 14x + 48)", options: ["(x + 3)/(x − 6)", "(x + 3)/(x − 8)", "(x − 3)/(x + 6)", "(x − 8)/(x − 6)"], answer: 0 },
  { id: "h_saf6284", topic: "algfrac", time: 230, q: "Simplify (x² − x − 12) / (x² − 16)", options: ["(x − 3)/(x − 4)", "(x + 3)/(x + 4)", "(x − 4)/(x + 4)", "(x + 3)/(x − 4)"], answer: 1 },
  { id: "h_saf6285", topic: "algfrac", time: 237, q: "Simplify (x² + 2x − 8) / (x² − 6x + 8)", options: ["(x − 4)/(x + 4)", "(x + 4)/(x − 4)", "(x + 4)/(x − 2)", "(x − 2)/(x − 4)"], answer: 1 },
  { id: "h_saf6286", topic: "algfrac", time: 234, q: "Simplify (x² + 2x − 15) / (x² − 11x + 24)", options: ["(x + 5)/(x − 3)", "(x − 3)/(x − 8)", "(x − 5)/(x + 8)", "(x + 5)/(x − 8)"], answer: 3 },
  // Ch equations — 50 questions (2 from real Edexcel 4MA1 past papers, 48 practice questions in the same style)
  { id: "eq2", topic: "equations", ref: "June 2025 2H Q16", time: 230, q: "Make t the subject: c = (t² + 3)/(7 − 8t²)", options: ["t = √((7c − 3)/(1 + 8c))", "t = √((7c + 3)/(1 − 8c))", "t = (7c − 3)/(1 + 8c)", "t = √((3 − 7c)/(8c − 1))"], answer: 0 },
  { id: "eq3", topic: "equations", ref: "Nov 2023 1H Q15", time: 230, q: "Make n the subject: x = (3p + n)/(3n − 4)", options: ["n = (3p + 4x)/(3x − 1)", "n = (4x − 3p)/(3x − 1)", "n = (3p − 4x)/(1 − 3x)", "n = (3p + 4x)/(1 − 3x)"], answer: 0 },
  { id: "h_cos6317", topic: "equations", time: 232, q: "Make p the subject: x = (8p + 6) / (3p − 6)", options: ["p = (6 + 6x) / (3x + 8)", "p = (6 + 6x) / (3x − 8)", "p = (6x − 6) / (8 − 3x)", "p = (6 − 6x) / (3x − 8)"], answer: 1 },
  { id: "h_cosq6318", topic: "equations", time: 229, q: "Make x the subject: y = (3x² + 7) / 6", options: ["x = √((6y − 7) / 3)", "x = √(6y − 7) / 3", "x = √((6y + 7) / 3)", "x = (6y − 7) / 3"], answer: 0 },
  { id: "h_cosq6319", topic: "equations", time: 227, q: "Make x the subject: y = (5x² + 3) / 5", options: ["x = √((5y − 3) / 5)", "x = √(5y − 3) / 5", "x = (5y − 3) / 5", "x = √((5y + 3) / 5)"], answer: 0 },
  { id: "h_cos6320", topic: "equations", time: 241, q: "Make p the subject: x = (5p + 2) / (3p − 8)", options: ["p = (2 − 8x) / (3x − 5)", "p = (2 + 8x) / (3x − 5)", "p = (2 + 8x) / (3x + 5)", "p = (8x − 2) / (5 − 3x)"], answer: 1 },
  { id: "h_cos6321", topic: "equations", time: 248, q: "Make p the subject: x = (2p + 5) / (7p − 2)", options: ["p = (5 + 2x) / (7x − 2)", "p = (5 + 2x) / (7x + 2)", "p = (5 − 2x) / (7x − 2)", "p = (2x − 5) / (2 − 7x)"], answer: 0 },
  { id: "h_cosq6322", topic: "equations", time: 227, q: "Make x the subject: y = (6x² + 6) / 9", options: ["x = √((9y − 6) / 6)", "x = √(9y − 6) / 6", "x = (9y − 6) / 6", "x = √((9y + 6) / 6)"], answer: 0 },
  { id: "h_cos6323", topic: "equations", time: 248, q: "Make p the subject: x = (7p + 7) / (2p − 2)", options: ["p = (2x − 7) / (7 − 2x)", "p = (7 + 2x) / (2x + 7)", "p = (7 − 2x) / (2x − 7)", "p = (7 + 2x) / (2x − 7)"], answer: 3 },
  { id: "h_cos6324", topic: "equations", time: 241, q: "Make p the subject: x = (4p + 4) / (2p − 3)", options: ["p = (3x − 4) / (4 − 2x)", "p = (4 − 3x) / (2x − 4)", "p = (4 + 3x) / (2x + 4)", "p = (4 + 3x) / (2x − 4)"], answer: 3 },
  { id: "h_cos6325", topic: "equations", time: 240, q: "Make p the subject: x = (4p + 9) / (3p − 2)", options: ["p = (9 − 2x) / (3x − 4)", "p = (2x − 9) / (4 − 3x)", "p = (9 + 2x) / (3x + 4)", "p = (9 + 2x) / (3x − 4)"], answer: 3 },
  { id: "h_cosq6326", topic: "equations", time: 229, q: "Make x the subject: y = (3x² + 2) / 3", options: ["x = (3y − 2) / 3", "x = √(3y − 2) / 3", "x = √((3y + 2) / 3)", "x = √((3y − 2) / 3)"], answer: 3 },
  { id: "h_cosq6327", topic: "equations", time: 228, q: "Make x the subject: y = (3x² + 7) / 7", options: ["x = √((7y + 7) / 3)", "x = √((7y − 7) / 3)", "x = √(7y − 7) / 3", "x = (7y − 7) / 3"], answer: 1 },
  { id: "h_cosq6328", topic: "equations", time: 223, q: "Make x the subject: y = (3x² + 4) / 7", options: ["x = √((7y + 4) / 3)", "x = √((7y − 4) / 3)", "x = (7y − 4) / 3", "x = √(7y − 4) / 3"], answer: 1 },
  { id: "h_cosq6329", topic: "equations", time: 234, q: "Make x the subject: y = (7x² + 7) / 5", options: ["x = √(5y − 7) / 7", "x = (5y − 7) / 7", "x = √((5y + 7) / 7)", "x = √((5y − 7) / 7)"], answer: 3 },
  { id: "h_cos6330", topic: "equations", time: 249, q: "Make p the subject: x = (2p + 3) / (2p − 6)", options: ["p = (3 + 6x) / (2x − 2)", "p = (3 + 6x) / (2x + 2)", "p = (3 − 6x) / (2x − 2)", "p = (6x − 3) / (2 − 2x)"], answer: 0 },
  { id: "h_cosq6331", topic: "equations", time: 223, q: "Make x the subject: y = (5x² + 4) / 2", options: ["x = √(2y − 4) / 5", "x = (2y − 4) / 5", "x = √((2y − 4) / 5)", "x = √((2y + 4) / 5)"], answer: 2 },
  { id: "h_cos6332", topic: "equations", time: 250, q: "Make p the subject: x = (6p + 3) / (2p − 8)", options: ["p = (8x − 3) / (6 − 2x)", "p = (3 + 8x) / (2x + 6)", "p = (3 + 8x) / (2x − 6)", "p = (3 − 8x) / (2x − 6)"], answer: 2 },
  { id: "h_cos6333", topic: "equations", time: 223, q: "Make p the subject: x = (4p + 2) / (7p − 3)", options: ["p = (2 − 3x) / (7x − 4)", "p = (2 + 3x) / (7x − 4)", "p = (2 + 3x) / (7x + 4)", "p = (3x − 2) / (4 − 7x)"], answer: 1 },
  { id: "h_cosq6334", topic: "equations", time: 246, q: "Make x the subject: y = (4x² + 3) / 3", options: ["x = (3y − 3) / 4", "x = √((3y − 3) / 4)", "x = √(3y − 3) / 4", "x = √((3y + 3) / 4)"], answer: 1 },
  { id: "h_cos6335", topic: "equations", time: 230, q: "Make p the subject: x = (9p + 1) / (2p − 8)", options: ["p = (1 + 8x) / (2x + 9)", "p = (1 + 8x) / (2x − 9)", "p = (1 − 8x) / (2x − 9)", "p = (8x − 1) / (9 − 2x)"], answer: 1 },
  { id: "h_cosq6336", topic: "equations", time: 248, q: "Make x the subject: y = (6x² + 2) / 5", options: ["x = (5y − 2) / 6", "x = √((5y − 2) / 6)", "x = √((5y + 2) / 6)", "x = √(5y − 2) / 6"], answer: 1 },
  { id: "h_cos6337", topic: "equations", time: 226, q: "Make p the subject: x = (8p + 3) / (8p − 6)", options: ["p = (6x − 3) / (8 − 8x)", "p = (3 + 6x) / (8x + 8)", "p = (3 + 6x) / (8x − 8)", "p = (3 − 6x) / (8x − 8)"], answer: 2 },
  { id: "h_cos6338", topic: "equations", time: 246, q: "Make p the subject: x = (8p + 9) / (8p − 9)", options: ["p = (9 + 9x) / (8x + 8)", "p = (9x − 9) / (8 − 8x)", "p = (9 − 9x) / (8x − 8)", "p = (9 + 9x) / (8x − 8)"], answer: 3 },
  { id: "h_cos6339", topic: "equations", time: 241, q: "Make p the subject: x = (4p + 2) / (4p − 7)", options: ["p = (2 + 7x) / (4x − 4)", "p = (7x − 2) / (4 − 4x)", "p = (2 + 7x) / (4x + 4)", "p = (2 − 7x) / (4x − 4)"], answer: 0 },
  { id: "h_cosq6340", topic: "equations", time: 236, q: "Make x the subject: y = (2x² + 6) / 7", options: ["x = √(7y − 6) / 2", "x = (7y − 6) / 2", "x = √((7y + 6) / 2)", "x = √((7y − 6) / 2)"], answer: 3 },
  { id: "h_cosq6341", topic: "equations", time: 249, q: "Make x the subject: y = (3x² + 3) / 5", options: ["x = (5y − 3) / 3", "x = √(5y − 3) / 3", "x = √((5y − 3) / 3)", "x = √((5y + 3) / 3)"], answer: 2 },
  { id: "h_cos6342", topic: "equations", time: 232, q: "Make p the subject: x = (5p + 8) / (4p − 5)", options: ["p = (5x − 8) / (5 − 4x)", "p = (8 + 5x) / (4x − 5)", "p = (8 + 5x) / (4x + 5)", "p = (8 − 5x) / (4x − 5)"], answer: 1 },
  { id: "h_cosq6343", topic: "equations", time: 248, q: "Make x the subject: y = (3x² + 7) / 8", options: ["x = √((8y + 7) / 3)", "x = (8y − 7) / 3", "x = √((8y − 7) / 3)", "x = √(8y − 7) / 3"], answer: 2 },
  { id: "h_cos6344", topic: "equations", time: 232, q: "Make p the subject: x = (8p + 3) / (5p − 9)", options: ["p = (3 + 9x) / (5x − 8)", "p = (3 + 9x) / (5x + 8)", "p = (9x − 3) / (8 − 5x)", "p = (3 − 9x) / (5x − 8)"], answer: 0 },
  { id: "h_cosq6346", topic: "equations", time: 220, q: "Make x the subject: y = (7x² + 6) / 4", options: ["x = √((4y + 6) / 7)", "x = √((4y − 6) / 7)", "x = √(4y − 6) / 7", "x = (4y − 6) / 7"], answer: 1 },
  { id: "h_cos6347", topic: "equations", time: 224, q: "Make p the subject: x = (3p + 8) / (4p − 3)", options: ["p = (8 + 3x) / (4x − 3)", "p = (3x − 8) / (3 − 4x)", "p = (8 − 3x) / (4x − 3)", "p = (8 + 3x) / (4x + 3)"], answer: 0 },
  { id: "h_cos6348", topic: "equations", time: 247, q: "Make p the subject: x = (9p + 8) / (5p − 4)", options: ["p = (8 + 4x) / (5x + 9)", "p = (4x − 8) / (9 − 5x)", "p = (8 − 4x) / (5x − 9)", "p = (8 + 4x) / (5x − 9)"], answer: 3 },
  { id: "h_cos6349", topic: "equations", time: 248, q: "Make p the subject: x = (2p + 9) / (5p − 5)", options: ["p = (9 − 5x) / (5x − 2)", "p = (5x − 9) / (2 − 5x)", "p = (9 + 5x) / (5x − 2)", "p = (9 + 5x) / (5x + 2)"], answer: 2 },
  { id: "h_cosq6350", topic: "equations", time: 246, q: "Make x the subject: y = (2x² + 7) / 5", options: ["x = √((5y − 7) / 2)", "x = √((5y + 7) / 2)", "x = (5y − 7) / 2", "x = √(5y − 7) / 2"], answer: 0 },
  { id: "h_cos6351", topic: "equations", time: 222, q: "Make p the subject: x = (4p + 2) / (4p − 5)", options: ["p = (2 + 5x) / (4x + 4)", "p = (5x − 2) / (4 − 4x)", "p = (2 + 5x) / (4x − 4)", "p = (2 − 5x) / (4x − 4)"], answer: 2 },
  { id: "h_cosq6352", topic: "equations", time: 243, q: "Make x the subject: y = (5x² + 4) / 3", options: ["x = (3y − 4) / 5", "x = √((3y − 4) / 5)", "x = √((3y + 4) / 5)", "x = √(3y − 4) / 5"], answer: 1 },
  { id: "h_cos6353", topic: "equations", time: 233, q: "Make p the subject: x = (4p + 4) / (3p − 8)", options: ["p = (4 − 8x) / (3x − 4)", "p = (4 + 8x) / (3x + 4)", "p = (4 + 8x) / (3x − 4)", "p = (8x − 4) / (4 − 3x)"], answer: 2 },
  { id: "h_cosq6354", topic: "equations", time: 237, q: "Make x the subject: y = (6x² + 5) / 4", options: ["x = (4y − 5) / 6", "x = √(4y − 5) / 6", "x = √((4y − 5) / 6)", "x = √((4y + 5) / 6)"], answer: 2 },
  { id: "h_cos6355", topic: "equations", time: 235, q: "Make p the subject: x = (5p + 6) / (7p − 9)", options: ["p = (6 − 9x) / (7x − 5)", "p = (9x − 6) / (5 − 7x)", "p = (6 + 9x) / (7x − 5)", "p = (6 + 9x) / (7x + 5)"], answer: 2 },
  { id: "h_cos6356", topic: "equations", time: 223, q: "Make p the subject: x = (4p + 2) / (9p − 6)", options: ["p = (6x − 2) / (4 − 9x)", "p = (2 − 6x) / (9x − 4)", "p = (2 + 6x) / (9x + 4)", "p = (2 + 6x) / (9x − 4)"], answer: 3 },
  { id: "h_cos6357", topic: "equations", time: 222, q: "Make p the subject: x = (2p + 7) / (7p − 3)", options: ["p = (3x − 7) / (2 − 7x)", "p = (7 − 3x) / (7x − 2)", "p = (7 + 3x) / (7x − 2)", "p = (7 + 3x) / (7x + 2)"], answer: 2 },
  { id: "h_cos6358", topic: "equations", time: 248, q: "Make p the subject: x = (5p + 7) / (8p − 4)", options: ["p = (7 + 4x) / (8x − 5)", "p = (4x − 7) / (5 − 8x)", "p = (7 + 4x) / (8x + 5)", "p = (7 − 4x) / (8x − 5)"], answer: 0 },
  { id: "h_cos6359", topic: "equations", time: 245, q: "Make p the subject: x = (2p + 1) / (6p − 5)", options: ["p = (1 − 5x) / (6x − 2)", "p = (5x − 1) / (2 − 6x)", "p = (1 + 5x) / (6x − 2)", "p = (1 + 5x) / (6x + 2)"], answer: 2 },
  { id: "h_cos6360", topic: "equations", time: 229, q: "Make p the subject: x = (9p + 6) / (3p − 4)", options: ["p = (6 + 4x) / (3x − 9)", "p = (6 − 4x) / (3x − 9)", "p = (6 + 4x) / (3x + 9)", "p = (4x − 6) / (9 − 3x)"], answer: 0 },
  { id: "h_cosq6361", topic: "equations", time: 221, q: "Make x the subject: y = (2x² + 6) / 9", options: ["x = √(9y − 6) / 2", "x = √((9y + 6) / 2)", "x = √((9y − 6) / 2)", "x = (9y − 6) / 2"], answer: 2 },
  { id: "h_cos6362", topic: "equations", time: 243, q: "Make p the subject: x = (4p + 7) / (4p − 9)", options: ["p = (7 + 9x) / (4x + 4)", "p = (7 − 9x) / (4x − 4)", "p = (9x − 7) / (4 − 4x)", "p = (7 + 9x) / (4x − 4)"], answer: 3 },
  { id: "h_cos6363", topic: "equations", time: 228, q: "Make p the subject: x = (2p + 7) / (4p − 6)", options: ["p = (7 + 6x) / (4x − 2)", "p = (7 − 6x) / (4x − 2)", "p = (7 + 6x) / (4x + 2)", "p = (6x − 7) / (2 − 4x)"], answer: 0 },
  { id: "h_cos6364", topic: "equations", time: 246, q: "Make p the subject: x = (5p + 3) / (6p − 6)", options: ["p = (6x − 3) / (5 − 6x)", "p = (3 + 6x) / (6x − 5)", "p = (3 − 6x) / (6x − 5)", "p = (3 + 6x) / (6x + 5)"], answer: 1 },
  { id: "h_cosq6365", topic: "equations", time: 228, q: "Make x the subject: y = (4x² + 7) / 4", options: ["x = √((4y − 7) / 4)", "x = √(4y − 7) / 4", "x = √((4y + 7) / 4)", "x = (4y − 7) / 4"], answer: 0 },
  // Ch units — 50 questions (0 from real Edexcel 4MA1 past papers, 50 practice questions in the same style)
  { id: "h_sim26397", topic: "units", time: 213, diagram: {"type":"similarShapes","r1":5,"r2":7}, q: "Two similar shapes have corresponding lengths in ratio 5:7. Find the ratio of their areas", options: ["5/7", "25/7", "25/49", "125/343"], answer: 2 },
  { id: "h_sim6398", topic: "units", time: 216, diagram: {"type":"similarShapes","r1":2,"r2":5}, q: "Two similar solids have corresponding lengths in ratio 2:5. Find the ratio of their volumes", options: ["8/125", "2/5", "8/25", "4/25"], answer: 0 },
  { id: "h_dens6399", topic: "units", time: 201, q: "A metal has density 6.9 g/cm³. Find the mass of 163 cm³ of this metal", options: ["23.6 g", "169.9 g", "1237.2 g", "1124.7 g"], answer: 3 },
  { id: "h_sim26400", topic: "units", time: 206, diagram: {"type":"similarShapes","r1":4,"r2":10}, q: "Two similar shapes have corresponding lengths in ratio 4:10. Find the ratio of their areas", options: ["4/25", "8/5", "2/5", "8/125"], answer: 0 },
  { id: "h_dens26401", topic: "units", time: 228, q: "A metal has density 7.4 g/cm³ and mass 166 g. Find its volume, correct to 1 d.p.", options: ["1228.4 cm³", "22.4 cm³", "0.0446 cm³", "24.6 cm³"], answer: 1 },
  { id: "h_sim26402", topic: "units", time: 205, diagram: {"type":"similarShapes","r1":4,"r2":6}, q: "Two similar shapes have corresponding lengths in ratio 4:6. Find the ratio of their areas", options: ["8/27", "4/9", "2/3", "8/3"], answer: 1 },
  { id: "h_sim6403", topic: "units", time: 215, diagram: {"type":"similarShapes","r1":4,"r2":5}, q: "Two similar solids have corresponding lengths in ratio 4:5. Find the ratio of their volumes", options: ["4/5", "16/25", "64/25", "64/125"], answer: 3 },
  { id: "h_sim6404", topic: "units", time: 205, diagram: {"type":"similarShapes","r1":4,"r2":7}, q: "Two similar solids have corresponding lengths in ratio 4:7. Find the ratio of their volumes", options: ["4/7", "16/49", "64/343", "64/49"], answer: 2 },
  { id: "h_sim26405", topic: "units", time: 202, diagram: {"type":"similarShapes","r1":2,"r2":5}, q: "Two similar shapes have corresponding lengths in ratio 2:5. Find the ratio of their areas", options: ["4/25", "2/5", "8/125", "4/5"], answer: 0 },
  { id: "h_dens26406", topic: "units", time: 216, q: "A metal has density 1.8 g/cm³ and mass 1553 g. Find its volume, correct to 1 d.p.", options: ["2795.4 cm³", "949.1 cm³", "862.8 cm³", "0.0012 cm³"], answer: 2 },
  { id: "h_sim6407", topic: "units", time: 215, diagram: {"type":"similarShapes","r1":4,"r2":9}, q: "Two similar solids have corresponding lengths in ratio 4:9. Find the ratio of their volumes", options: ["64/81", "64/729", "16/81", "4/9"], answer: 1 },
  { id: "h_sim26408", topic: "units", time: 218, diagram: {"type":"similarShapes","r1":3,"r2":10}, q: "Two similar shapes have corresponding lengths in ratio 3:10. Find the ratio of their areas", options: ["9/10", "27/1000", "9/100", "3/10"], answer: 2 },
  { id: "h_sim26410", topic: "units", time: 218, diagram: {"type":"similarShapes","r1":2,"r2":8}, q: "Two similar shapes have corresponding lengths in ratio 2:8. Find the ratio of their areas", options: ["1/2", "1/64", "1/16", "1/4"], answer: 2 },
  { id: "h_sim26411", topic: "units", time: 224, diagram: {"type":"similarShapes","r1":2,"r2":4}, q: "Two similar shapes have corresponding lengths in ratio 2:4. Find the ratio of their areas", options: ["1/8", "1", "1/2", "1/4"], answer: 3 },
  { id: "h_dens26413", topic: "units", time: 209, q: "A metal has density 3.5 g/cm³ and mass 1943 g. Find its volume, correct to 1 d.p.", options: ["555.1 cm³", "6800.5 cm³", "0.0018 cm³", "610.6 cm³"], answer: 0 },
  { id: "h_dens26414", topic: "units", time: 205, q: "A metal has density 2.9 g/cm³ and mass 319 g. Find its volume, correct to 1 d.p.", options: ["0.0091 cm³", "121 cm³", "925.1 cm³", "110 cm³"], answer: 3 },
  { id: "h_sim26415", topic: "units", time: 229, diagram: {"type":"similarShapes","r1":6,"r2":8}, q: "Two similar shapes have corresponding lengths in ratio 6:8. Find the ratio of their areas", options: ["27/64", "9/16", "9/2", "3/4"], answer: 1 },
  { id: "h_dens26416", topic: "units", time: 208, q: "A metal has density 8.5 g/cm³ and mass 1996 g. Find its volume, correct to 1 d.p.", options: ["258.3 cm³", "0.0043 cm³", "234.8 cm³", "16966 cm³"], answer: 2 },
  { id: "h_sim6417", topic: "units", time: 222, diagram: {"type":"similarShapes","r1":3,"r2":6}, q: "Two similar solids have corresponding lengths in ratio 3:6. Find the ratio of their volumes", options: ["1/4", "1/8", "3/4", "1/2"], answer: 1 },
  { id: "h_dens26418", topic: "units", time: 205, q: "A metal has density 3.9 g/cm³ and mass 433 g. Find its volume, correct to 1 d.p.", options: ["0.009 cm³", "111 cm³", "122.1 cm³", "1688.7 cm³"], answer: 1 },
  { id: "h_dens26419", topic: "units", time: 207, q: "A metal has density 4 g/cm³ and mass 222 g. Find its volume, correct to 1 d.p.", options: ["888 cm³", "61.1 cm³", "0.018 cm³", "55.5 cm³"], answer: 3 },
  { id: "h_dens6420", topic: "units", time: 221, q: "A metal has density 1.7 g/cm³. Find the mass of 117 cm³ of this metal", options: ["118.7 g", "68.8 g", "218.8 g", "198.9 g"], answer: 3 },
  { id: "h_dens26421", topic: "units", time: 228, q: "A metal has density 1.5 g/cm³ and mass 179 g. Find its volume, correct to 1 d.p.", options: ["131.2 cm³", "119.3 cm³", "268.5 cm³", "0.0084 cm³"], answer: 1 },
  { id: "h_dens26422", topic: "units", time: 206, q: "A metal has density 3 g/cm³ and mass 69 g. Find its volume, correct to 1 d.p.", options: ["207 cm³", "0.0435 cm³", "23 cm³", "25.3 cm³"], answer: 2 },
  { id: "h_dens26423", topic: "units", time: 218, q: "A metal has density 3.3 g/cm³ and mass 635 g. Find its volume, correct to 1 d.p.", options: ["2095.5 cm³", "0.0052 cm³", "192.4 cm³", "211.6 cm³"], answer: 2 },
  { id: "h_dens26424", topic: "units", time: 224, q: "A metal has density 6.1 g/cm³ and mass 404 g. Find its volume, correct to 1 d.p.", options: ["2464.4 cm³", "66.2 cm³", "72.8 cm³", "0.0151 cm³"], answer: 1 },
  { id: "h_sim6425", topic: "units", time: 218, diagram: {"type":"similarShapes","r1":6,"r2":10}, q: "Two similar solids have corresponding lengths in ratio 6:10. Find the ratio of their volumes", options: ["54/25", "3/5", "9/25", "27/125"], answer: 3 },
  { id: "h_dens6426", topic: "units", time: 205, q: "A metal has density 4.7 g/cm³. Find the mass of 88 cm³ of this metal", options: ["455 g", "413.6 g", "92.7 g", "18.7 g"], answer: 1 },
  { id: "h_dens6427", topic: "units", time: 202, q: "A metal has density 9.8 g/cm³. Find the mass of 115 cm³ of this metal", options: ["124.8 g", "11.7 g", "1239.7 g", "1127 g"], answer: 3 },
  { id: "h_sim26429", topic: "units", time: 206, diagram: {"type":"similarShapes","r1":5,"r2":8}, q: "Two similar shapes have corresponding lengths in ratio 5:8. Find the ratio of their areas", options: ["125/512", "25/8", "5/8", "25/64"], answer: 3 },
  { id: "h_dens26430", topic: "units", time: 206, q: "A metal has density 10.8 g/cm³ and mass 680 g. Find its volume, correct to 1 d.p.", options: ["63 cm³", "7344 cm³", "0.0159 cm³", "69.3 cm³"], answer: 0 },
  { id: "h_sim6431", topic: "units", time: 201, diagram: {"type":"similarShapes","r1":4,"r2":8}, q: "Two similar solids have corresponding lengths in ratio 4:8. Find the ratio of their volumes", options: ["1", "1/8", "1/4", "1/2"], answer: 1 },
  { id: "h_dens26432", topic: "units", time: 209, q: "A metal has density 7.4 g/cm³ and mass 1914 g. Find its volume, correct to 1 d.p.", options: ["14163.6 cm³", "284.5 cm³", "0.0039 cm³", "258.6 cm³"], answer: 3 },
  { id: "h_dens26436", topic: "units", time: 230, q: "A metal has density 6.5 g/cm³ and mass 471 g. Find its volume, correct to 1 d.p.", options: ["0.0138 cm³", "3061.5 cm³", "79.8 cm³", "72.5 cm³"], answer: 3 },
  { id: "h_dens26438", topic: "units", time: 227, q: "A metal has density 5.8 g/cm³ and mass 262 g. Find its volume, correct to 1 d.p.", options: ["49.7 cm³", "0.0221 cm³", "45.2 cm³", "1519.6 cm³"], answer: 2 },
  { id: "h_dens26439", topic: "units", time: 208, q: "A metal has density 9.7 g/cm³ and mass 1999 g. Find its volume, correct to 1 d.p.", options: ["206.1 cm³", "0.0049 cm³", "19390.3 cm³", "226.7 cm³"], answer: 0 },
  { id: "h_sim6440", topic: "units", time: 216, diagram: {"type":"similarShapes","r1":5,"r2":8}, q: "Two similar solids have corresponding lengths in ratio 5:8. Find the ratio of their volumes", options: ["5/8", "25/64", "125/512", "125/64"], answer: 2 },
  { id: "h_dens6441", topic: "units", time: 213, q: "A metal has density 9.7 g/cm³. Find the mass of 172 cm³ of this metal", options: ["1835.2 g", "1668.4 g", "17.7 g", "181.7 g"], answer: 1 },
  { id: "h_dens26442", topic: "units", time: 224, q: "A metal has density 5.1 g/cm³ and mass 1179 g. Find its volume, correct to 1 d.p.", options: ["6012.9 cm³", "231.2 cm³", "254.3 cm³", "0.0043 cm³"], answer: 1 },
  { id: "h_dens26443", topic: "units", time: 227, q: "A metal has density 6.5 g/cm³ and mass 180 g. Find its volume, correct to 1 d.p.", options: ["0.0361 cm³", "30.5 cm³", "1170 cm³", "27.7 cm³"], answer: 3 },
  { id: "h_sim26444", topic: "units", time: 228, diagram: {"type":"similarShapes","r1":4,"r2":9}, q: "Two similar shapes have corresponding lengths in ratio 4:9. Find the ratio of their areas", options: ["4/9", "16/81", "64/729", "16/9"], answer: 1 },
  { id: "h_sim6446", topic: "units", time: 228, diagram: {"type":"similarShapes","r1":4,"r2":10}, q: "Two similar solids have corresponding lengths in ratio 4:10. Find the ratio of their volumes", options: ["4/25", "16/25", "2/5", "8/125"], answer: 3 },
  { id: "h_sim6447", topic: "units", time: 216, diagram: {"type":"similarShapes","r1":5,"r2":9}, q: "Two similar solids have corresponding lengths in ratio 5:9. Find the ratio of their volumes", options: ["125/729", "5/9", "125/81", "25/81"], answer: 0 },
  { id: "h_dens26448", topic: "units", time: 217, q: "A metal has density 10.7 g/cm³ and mass 246 g. Find its volume, correct to 1 d.p.", options: ["23 cm³", "25.3 cm³", "2632.2 cm³", "0.0435 cm³"], answer: 0 },
  { id: "h_dens26449", topic: "units", time: 216, q: "A metal has density 3.4 g/cm³ and mass 926 g. Find its volume, correct to 1 d.p.", options: ["299.6 cm³", "272.4 cm³", "0.0037 cm³", "3148.4 cm³"], answer: 1 },
  { id: "h_dens6450", topic: "units", time: 214, q: "A metal has density 7.8 g/cm³. Find the mass of 81 cm³ of this metal", options: ["88.8 g", "695 g", "631.8 g", "10.4 g"], answer: 2 },
  { id: "h_sim26451", topic: "units", time: 204, diagram: {"type":"similarShapes","r1":6,"r2":7}, q: "Two similar shapes have corresponding lengths in ratio 6:7. Find the ratio of their areas", options: ["36/7", "36/49", "216/343", "6/7"], answer: 1 },
  { id: "h_sim6454", topic: "units", time: 225, diagram: {"type":"similarShapes","r1":6,"r2":9}, q: "Two similar solids have corresponding lengths in ratio 6:9. Find the ratio of their volumes", options: ["8/3", "2/3", "4/9", "8/27"], answer: 3 },
  { id: "h_sim26456", topic: "units", time: 204, diagram: {"type":"similarShapes","r1":5,"r2":6}, q: "Two similar shapes have corresponding lengths in ratio 5:6. Find the ratio of their areas", options: ["125/216", "25/36", "5/6", "25/6"], answer: 1 },
  { id: "h_sim26457", topic: "units", time: 227, diagram: {"type":"similarShapes","r1":5,"r2":9}, q: "Two similar shapes have corresponding lengths in ratio 5:9. Find the ratio of their areas", options: ["125/729", "25/81", "5/9", "25/9"], answer: 1 },
  // Ch indices — 50 questions (0 from real Edexcel 4MA1 past papers, 50 practice questions in the same style)
  { id: "h_ni6500", topic: "indices", time: 203, q: "Work out 6^(−2)", options: ["1/6", "1/36", "1/12", "-36"], answer: 1 },
  { id: "h_ni6503", topic: "indices", time: 214, q: "Work out 6^(−4)", options: ["1/1296", "1/216", "-1296", "1/24"], answer: 0 },
  { id: "h_sm6504", topic: "indices", time: 220, q: "Simplify 5√3 × 3√3", options: ["46√1", "8√9", "15√9", "45"], answer: 3 },
  { id: "h_ni6506", topic: "indices", time: 218, q: "Work out 3^(−4)", options: ["1/81", "1/12", "-81", "1/27"], answer: 0 },
  { id: "h_fi6507", topic: "indices", time: 205, q: "Work out 16^(2/2)", options: ["8", "16", "12", "32"], answer: 1 },
  { id: "h_fi6509", topic: "indices", time: 204, q: "Work out 64^(2/2)", options: ["64", "32", "75", "128"], answer: 0 },
  { id: "h_ni6510", topic: "indices", time: 196, q: "Work out 5^(−3)", options: ["1/125", "-125", "1/15", "1/25"], answer: 0 },
  { id: "h_sm6512", topic: "indices", time: 223, q: "Simplify 6√5 × 5√5", options: ["151√1", "150", "30√25", "11√25"], answer: 1 },
  { id: "h_sm6513", topic: "indices", time: 200, q: "Simplify 3√3 × 4√3", options: ["7√9", "12√9", "36", "37√1"], answer: 2 },
  { id: "h_fi6515", topic: "indices", time: 217, q: "Work out 8^(2/2)", options: ["4", "10", "16", "9"], answer: 3 },
  { id: "h_fi6517", topic: "indices", time: 215, q: "Work out 4^(1/2)", options: ["4", "2", "-1", "3"], answer: 1 },
  { id: "h_ni6518", topic: "indices", time: 191, q: "Work out 6^(−3)", options: ["-216", "1/36", "1/18", "1/216"], answer: 3 },
  { id: "h_sm6521", topic: "indices", time: 204, q: "Simplify 2√5 × 4√5", options: ["6√25", "41√1", "8√25", "40"], answer: 3 },
  { id: "h_ni6522", topic: "indices", time: 213, q: "Work out 4^(−2)", options: ["1/8", "-16", "1/16", "1/4"], answer: 2 },
  { id: "h_ni6523", topic: "indices", time: 212, q: "Work out 5^(−2)", options: ["1/5", "1/25", "1/10", "-25"], answer: 1 },
  { id: "h_ni6524", topic: "indices", time: 206, q: "Work out 2^(−3)", options: ["1/6", "-8", "1/8", "1/4"], answer: 2 },
  { id: "h_fi6527", topic: "indices", time: 208, q: "Work out 27^(2/3)", options: ["13", "9", "27", "54"], answer: 1 },
  { id: "h_fi6528", topic: "indices", time: 230, q: "Work out 25^(1/2)", options: ["10", "13", "25", "5"], answer: 3 },
  { id: "h_sm6529", topic: "indices", time: 201, q: "Simplify 3√2 × 5√2", options: ["15√4", "30", "8√4", "31√1"], answer: 1 },
  { id: "h_fi6532", topic: "indices", time: 222, q: "Work out 9^(1/2)", options: ["5", "3", "6", "9"], answer: 1 },
  { id: "h_fi6535", topic: "indices", time: 221, q: "Work out 25^(2/2)", options: ["13", "29", "50", "25"], answer: 3 },
  { id: "h_fi6536", topic: "indices", time: 209, q: "Work out 8^(1/2)", options: ["4", "8", "6", "3"], answer: 3 },
  { id: "h_fi6542", topic: "indices", time: 211, q: "Work out 27^(1/3)", options: ["3", "9", "27", "4"], answer: 0 },
  { id: "h_fi6546", topic: "indices", time: 203, q: "Work out 4^(2/2)", options: ["2", "1", "4", "8"], answer: 2 },
  { id: "h_ni6550", topic: "indices", time: 206, q: "Work out 3^(−2)", options: ["1/3", "1/9", "-9", "1/6"], answer: 1 },
  { id: "h_ni6553", topic: "indices", time: 208, q: "Work out 4^(−4)", options: ["1/256", "1/16", "-256", "1/64"], answer: 0 },
  { id: "h_sm6559", topic: "indices", time: 210, q: "Simplify 5√2 × 3√2", options: ["31√1", "8√4", "15√4", "30"], answer: 3 },
  { id: "h_fi6568", topic: "indices", time: 221, q: "Work out 64^(1/2)", options: ["8", "32", "16", "64"], answer: 0 },
  { id: "h_ni6569", topic: "indices", time: 214, q: "Work out 5^(−4)", options: ["1/125", "-625", "1/625", "1/20"], answer: 2 },
  { id: "h_fi6572", topic: "indices", time: 230, q: "Work out 16^(1/2)", options: ["16", "4", "5", "8"], answer: 1 },
  { id: "h_sm6581", topic: "indices", time: 225, q: "Simplify 4√3 × 2√3", options: ["8√9", "25√1", "24", "6√9"], answer: 2 },
  { id: "h_sm6582", topic: "indices", time: 224, q: "Simplify 3√5 × 6√5", options: ["18√25", "90", "91√1", "9√25"], answer: 1 },
  { id: "h_sm6601", topic: "indices", time: 218, q: "Simplify 4√2 × 4√2", options: ["33√1", "32", "8√4", "16√4"], answer: 1 },
  { id: "h_ni6602", topic: "indices", time: 206, q: "Work out 4^(−3)", options: ["1/16", "1/64", "-64", "1/12"], answer: 1 },
  { id: "h_fi6604", topic: "indices", time: 208, q: "Work out 32^(1/5)", options: ["6", "32", "2", "10"], answer: 2 },
  { id: "h_fi6618", topic: "indices", time: 230, q: "Work out 9^(2/2)", options: ["5", "12", "9", "18"], answer: 2 },
  { id: "h_sm6645", topic: "indices", time: 211, q: "Simplify 4√5 × 3√5", options: ["61√1", "60", "7√25", "12√25"], answer: 1 },
  { id: "h_sm6647", topic: "indices", time: 204, q: "Simplify 3√3 × 6√3", options: ["18√9", "9√9", "54", "55√1"], answer: 2 },
  { id: "h_sm6650", topic: "indices", time: 219, q: "Simplify 3√5 × 2√5", options: ["30", "31√1", "5√25", "6√25"], answer: 0 },
  { id: "h_sm6652", topic: "indices", time: 201, q: "Simplify 4√5 × 2√5", options: ["6√25", "41√1", "40", "8√25"], answer: 2 },
  { id: "h_sm6656", topic: "indices", time: 218, q: "Simplify 6√2 × 4√2", options: ["10√4", "49√1", "48", "24√4"], answer: 2 },
  { id: "h_fi6663", topic: "indices", time: 223, q: "Work out 32^(2/5)", options: ["6", "4", "64", "20"], answer: 1 },
  { id: "h_sm6664", topic: "indices", time: 217, q: "Simplify 5√3 × 2√3", options: ["31√1", "10√9", "7√9", "30"], answer: 3 },
  { id: "h_sm6669", topic: "indices", time: 223, q: "Simplify 2√3 × 3√3", options: ["18", "19√1", "6√9", "5√9"], answer: 0 },
  { id: "h_sm6670", topic: "indices", time: 207, q: "Simplify 6√2 × 2√2", options: ["12√4", "24", "25√1", "8√4"], answer: 1 },
  { id: "h_sm6672", topic: "indices", time: 214, q: "Simplify 3√5 × 5√5", options: ["76√1", "15√25", "75", "8√25"], answer: 2 },
  { id: "h_sm6677", topic: "indices", time: 226, q: "Simplify 5√5 × 3√5", options: ["15√25", "75", "8√25", "76√1"], answer: 1 },
  { id: "h_sm6689", topic: "indices", time: 221, q: "Simplify 4√3 × 3√3", options: ["12√9", "36", "7√9", "37√1"], answer: 1 },
  { id: "h_sm6693", topic: "indices", time: 215, q: "Simplify 3√5 × 3√5", options: ["46√1", "6√25", "45", "9√25"], answer: 2 },
  { id: "h_sm6698", topic: "indices", time: 224, q: "Simplify 2√2 × 3√2", options: ["5√4", "6√4", "12", "13√1"], answer: 2 },
  // Ch pythagoras — 50 questions (0 from real Edexcel 4MA1 past papers, 50 practice questions in the same style)
  { id: "h_3dp7214", topic: "pythagoras", time: 240, diagram: {"type":"cuboid","l":13,"w":8,"h":6}, q: "A cuboid has dimensions 13 cm × 8 cm × 6 cm. Find the length of its space diagonal, correct to 1 d.p.", options: ["27 cm", "15.3 cm", "17.4 cm", "16.4 cm"], answer: 3 },
  { id: "h_lad7215", topic: "pythagoras", time: 217, diagram: {"type":"rightTriangle","base":"13.2 m","height":"5.5 m","hyp":"14.3 m","unknownSide":"base"}, q: "A ladder 14.3 m long leans against a wall, reaching 5.5 m up the wall. Find the distance from the foot of the ladder to the wall", options: ["8.8 m", "13.2 m", "14.2 m", "5.5 m"], answer: 1 },
  { id: "h_lad7216", topic: "pythagoras", time: 229, diagram: {"type":"rightTriangle","base":"16.8 m","height":"7 m","hyp":"18.2 m","unknownSide":"height"}, q: "A ladder 18.2 m long has its foot 16.8 m from a wall. Find how far up the wall it reaches", options: ["7 m", "8 m", "16.8 m", "1.4 m"], answer: 0 },
  { id: "h_3dp7217", topic: "pythagoras", time: 223, diagram: {"type":"cuboid","l":9,"w":10,"h":5}, q: "A cuboid has dimensions 9 cm × 10 cm × 5 cm. Find the length of its space diagonal, correct to 1 d.p.", options: ["14.4 cm", "13.5 cm", "15.4 cm", "24 cm"], answer: 0 },
  { id: "h_3dp7218", topic: "pythagoras", time: 229, diagram: {"type":"cuboid","l":12,"w":15,"h":3}, q: "A cuboid has dimensions 12 cm × 15 cm × 3 cm. Find the length of its space diagonal, correct to 1 d.p.", options: ["19.2 cm", "19.4 cm", "20.4 cm", "30 cm"], answer: 1 },
  { id: "h_3dp7219", topic: "pythagoras", time: 237, diagram: {"type":"cuboid","l":7,"w":9,"h":10}, q: "A cuboid has dimensions 7 cm × 9 cm × 10 cm. Find the length of its space diagonal, correct to 1 d.p.", options: ["11.4 cm", "16.2 cm", "26 cm", "15.2 cm"], answer: 3 },
  { id: "h_lad7220", topic: "pythagoras", time: 212, diagram: {"type":"rightTriangle","base":"21.6 m","height":"6.3 m","hyp":"22.5 m","unknownSide":"base"}, q: "A ladder 22.5 m long leans against a wall, reaching 6.3 m up the wall. Find the distance from the foot of the ladder to the wall", options: ["21.6 m", "6.3 m", "16.2 m", "22.6 m"], answer: 0 },
  { id: "h_3dp7221", topic: "pythagoras", time: 239, diagram: {"type":"cuboid","l":14,"w":15,"h":11}, q: "A cuboid has dimensions 14 cm × 15 cm × 11 cm. Find the length of its space diagonal, correct to 1 d.p.", options: ["40 cm", "20.5 cm", "23.3 cm", "24.3 cm"], answer: 2 },
  { id: "h_3dp7222", topic: "pythagoras", time: 237, diagram: {"type":"cuboid","l":9,"w":11,"h":9}, q: "A cuboid has dimensions 9 cm × 11 cm × 9 cm. Find the length of its space diagonal, correct to 1 d.p.", options: ["16.8 cm", "17.8 cm", "14.2 cm", "29 cm"], answer: 0 },
  { id: "h_lad7223", topic: "pythagoras", time: 219, diagram: {"type":"rightTriangle","base":"9 m","height":"4.8 m","hyp":"10.2 m","unknownSide":"base"}, q: "A ladder 10.2 m long leans against a wall, reaching 4.8 m up the wall. Find the distance from the foot of the ladder to the wall", options: ["10 m", "4.8 m", "9 m", "5.4 m"], answer: 2 },
  { id: "h_3dp7224", topic: "pythagoras", time: 216, diagram: {"type":"cuboid","l":10,"w":15,"h":9}, q: "A cuboid has dimensions 10 cm × 15 cm × 9 cm. Find the length of its space diagonal, correct to 1 d.p.", options: ["34 cm", "18 cm", "21.1 cm", "20.1 cm"], answer: 3 },
  { id: "h_3dp7225", topic: "pythagoras", time: 224, diagram: {"type":"cuboid","l":10,"w":12,"h":12}, q: "A cuboid has dimensions 10 cm × 12 cm × 12 cm. Find the length of its space diagonal, correct to 1 d.p.", options: ["34 cm", "15.6 cm", "20.7 cm", "19.7 cm"], answer: 3 },
  { id: "h_lad7226", topic: "pythagoras", time: 212, diagram: {"type":"rightTriangle","base":"33.6 m","height":"9.8 m","hyp":"35 m","unknownSide":"height"}, q: "A ladder 35 m long has its foot 33.6 m from a wall. Find how far up the wall it reaches", options: ["33.6 m", "9.8 m", "1.4 m", "10.8 m"], answer: 1 },
  { id: "h_lad7227", topic: "pythagoras", time: 220, diagram: {"type":"rightTriangle","base":"56 m","height":"12.6 m","hyp":"57.4 m","unknownSide":"height"}, q: "A ladder 57.4 m long has its foot 56 m from a wall. Find how far up the wall it reaches", options: ["56 m", "12.6 m", "13.6 m", "1.4 m"], answer: 1 },
  { id: "h_3dp7228", topic: "pythagoras", time: 215, diagram: {"type":"cuboid","l":5,"w":13,"h":6}, q: "A cuboid has dimensions 5 cm × 13 cm × 6 cm. Find the length of its space diagonal, correct to 1 d.p.", options: ["16.2 cm", "13.9 cm", "15.2 cm", "24 cm"], answer: 2 },
  { id: "h_lad7229", topic: "pythagoras", time: 230, diagram: {"type":"rightTriangle","base":"24 m","height":"7 m","hyp":"25 m","unknownSide":"base"}, q: "A ladder 25 m long leans against a wall, reaching 7 m up the wall. Find the distance from the foot of the ladder to the wall", options: ["24 m", "25 m", "7 m", "18 m"], answer: 0 },
  { id: "h_lad7230", topic: "pythagoras", time: 231, diagram: {"type":"rightTriangle","base":"22.5 m","height":"12 m","hyp":"25.5 m","unknownSide":"base"}, q: "A ladder 25.5 m long leans against a wall, reaching 12 m up the wall. Find the distance from the foot of the ladder to the wall", options: ["22.5 m", "23.5 m", "12 m", "13.5 m"], answer: 0 },
  { id: "h_3dp7231", topic: "pythagoras", time: 240, diagram: {"type":"cuboid","l":7,"w":8,"h":10}, q: "A cuboid has dimensions 7 cm × 8 cm × 10 cm. Find the length of its space diagonal, correct to 1 d.p.", options: ["15.6 cm", "14.6 cm", "25 cm", "10.6 cm"], answer: 1 },
  { id: "h_3dp7232", topic: "pythagoras", time: 240, diagram: {"type":"cuboid","l":6,"w":13,"h":7}, q: "A cuboid has dimensions 6 cm × 13 cm × 7 cm. Find the length of its space diagonal, correct to 1 d.p.", options: ["15.9 cm", "16.9 cm", "14.3 cm", "26 cm"], answer: 0 },
  { id: "h_lad7233", topic: "pythagoras", time: 240, diagram: {"type":"rightTriangle","base":"2.8 m","height":"2.1 m","hyp":"3.5 m","unknownSide":"base"}, q: "A ladder 3.5 m long leans against a wall, reaching 2.1 m up the wall. Find the distance from the foot of the ladder to the wall", options: ["3.8 m", "1.4 m", "2.1 m", "2.8 m"], answer: 3 },
  { id: "h_3dp7234", topic: "pythagoras", time: 228, diagram: {"type":"cuboid","l":13,"w":11,"h":4}, q: "A cuboid has dimensions 13 cm × 11 cm × 4 cm. Find the length of its space diagonal, correct to 1 d.p.", options: ["17 cm", "18.5 cm", "28 cm", "17.5 cm"], answer: 3 },
  { id: "h_3dp7235", topic: "pythagoras", time: 210, diagram: {"type":"cuboid","l":12,"w":11,"h":6}, q: "A cuboid has dimensions 12 cm × 11 cm × 6 cm. Find the length of its space diagonal, correct to 1 d.p.", options: ["18.3 cm", "16.3 cm", "29 cm", "17.3 cm"], answer: 3 },
  { id: "h_lad7236", topic: "pythagoras", time: 227, diagram: {"type":"rightTriangle","base":"20.4 m","height":"8.5 m","hyp":"22.1 m","unknownSide":"base"}, q: "A ladder 22.1 m long leans against a wall, reaching 8.5 m up the wall. Find the distance from the foot of the ladder to the wall", options: ["21.4 m", "8.5 m", "20.4 m", "13.6 m"], answer: 2 },
  { id: "h_3dp7237", topic: "pythagoras", time: 212, diagram: {"type":"cuboid","l":3,"w":3,"h":3}, q: "A cuboid has dimensions 3 cm × 3 cm × 3 cm. Find the length of its space diagonal, correct to 1 d.p.", options: ["6.2 cm", "5.2 cm", "9 cm", "4.2 cm"], answer: 1 },
  { id: "h_lad7238", topic: "pythagoras", time: 226, diagram: {"type":"rightTriangle","base":"15 m","height":"8 m","hyp":"17 m","unknownSide":"base"}, q: "A ladder 17 m long leans against a wall, reaching 8 m up the wall. Find the distance from the foot of the ladder to the wall", options: ["8 m", "16 m", "9 m", "15 m"], answer: 3 },
  { id: "h_3dp7239", topic: "pythagoras", time: 238, diagram: {"type":"cuboid","l":8,"w":8,"h":8}, q: "A cuboid has dimensions 8 cm × 8 cm × 8 cm. Find the length of its space diagonal, correct to 1 d.p.", options: ["13.9 cm", "14.9 cm", "11.3 cm", "24 cm"], answer: 0 },
  { id: "h_3dp7240", topic: "pythagoras", time: 229, diagram: {"type":"cuboid","l":15,"w":7,"h":15}, q: "A cuboid has dimensions 15 cm × 7 cm × 15 cm. Find the length of its space diagonal, correct to 1 d.p.", options: ["22.3 cm", "16.6 cm", "23.3 cm", "37 cm"], answer: 0 },
  { id: "h_3dp7241", topic: "pythagoras", time: 227, diagram: {"type":"cuboid","l":15,"w":11,"h":8}, q: "A cuboid has dimensions 15 cm × 11 cm × 8 cm. Find the length of its space diagonal, correct to 1 d.p.", options: ["18.6 cm", "34 cm", "21.2 cm", "20.2 cm"], answer: 3 },
  { id: "h_3dp7242", topic: "pythagoras", time: 234, diagram: {"type":"cuboid","l":14,"w":8,"h":15}, q: "A cuboid has dimensions 14 cm × 8 cm × 15 cm. Find the length of its space diagonal, correct to 1 d.p.", options: ["22 cm", "37 cm", "23 cm", "16.1 cm"], answer: 0 },
  { id: "h_lad7243", topic: "pythagoras", time: 223, diagram: {"type":"rightTriangle","base":"12 m","height":"6.4 m","hyp":"13.6 m","unknownSide":"base"}, q: "A ladder 13.6 m long leans against a wall, reaching 6.4 m up the wall. Find the distance from the foot of the ladder to the wall", options: ["7.2 m", "12 m", "13 m", "6.4 m"], answer: 1 },
  { id: "h_3dp7244", topic: "pythagoras", time: 224, diagram: {"type":"cuboid","l":15,"w":13,"h":5}, q: "A cuboid has dimensions 15 cm × 13 cm × 5 cm. Find the length of its space diagonal, correct to 1 d.p.", options: ["20.5 cm", "33 cm", "21.5 cm", "19.8 cm"], answer: 0 },
  { id: "h_3dp7245", topic: "pythagoras", time: 218, diagram: {"type":"cuboid","l":10,"w":13,"h":10}, q: "A cuboid has dimensions 10 cm × 13 cm × 10 cm. Find the length of its space diagonal, correct to 1 d.p.", options: ["16.4 cm", "33 cm", "20.2 cm", "19.2 cm"], answer: 3 },
  { id: "h_3dp7246", topic: "pythagoras", time: 227, diagram: {"type":"cuboid","l":10,"w":9,"h":5}, q: "A cuboid has dimensions 10 cm × 9 cm × 5 cm. Find the length of its space diagonal, correct to 1 d.p.", options: ["15.4 cm", "14.4 cm", "24 cm", "13.5 cm"], answer: 1 },
  { id: "h_lad7247", topic: "pythagoras", time: 210, diagram: {"type":"rightTriangle","base":"25.2 m","height":"24 m","hyp":"34.8 m","unknownSide":"height"}, q: "A ladder 34.8 m long has its foot 25.2 m from a wall. Find how far up the wall it reaches", options: ["24 m", "25 m", "9.6 m", "25.2 m"], answer: 0 },
  { id: "h_lad7248", topic: "pythagoras", time: 214, diagram: {"type":"rightTriangle","base":"44 m","height":"9.9 m","hyp":"45.1 m","unknownSide":"base"}, q: "A ladder 45.1 m long leans against a wall, reaching 9.9 m up the wall. Find the distance from the foot of the ladder to the wall", options: ["44 m", "35.2 m", "45 m", "9.9 m"], answer: 0 },
  { id: "h_3dp7249", topic: "pythagoras", time: 237, diagram: {"type":"cuboid","l":14,"w":10,"h":5}, q: "A cuboid has dimensions 14 cm × 10 cm × 5 cm. Find the length of its space diagonal, correct to 1 d.p.", options: ["17.2 cm", "29 cm", "17.9 cm", "18.9 cm"], answer: 2 },
  { id: "h_lad7250", topic: "pythagoras", time: 216, diagram: {"type":"rightTriangle","base":"48 m","height":"10.8 m","hyp":"49.2 m","unknownSide":"height"}, q: "A ladder 49.2 m long has its foot 48 m from a wall. Find how far up the wall it reaches", options: ["1.2 m", "10.8 m", "48 m", "11.8 m"], answer: 1 },
  { id: "h_3dp7251", topic: "pythagoras", time: 228, diagram: {"type":"cuboid","l":3,"w":14,"h":5}, q: "A cuboid has dimensions 3 cm × 14 cm × 5 cm. Find the length of its space diagonal, correct to 1 d.p.", options: ["22 cm", "14.3 cm", "15.2 cm", "16.2 cm"], answer: 2 },
  { id: "h_3dp7252", topic: "pythagoras", time: 225, diagram: {"type":"cuboid","l":12,"w":9,"h":9}, q: "A cuboid has dimensions 12 cm × 9 cm × 9 cm. Find the length of its space diagonal, correct to 1 d.p.", options: ["18.5 cm", "30 cm", "17.5 cm", "15 cm"], answer: 2 },
  { id: "h_3dp7253", topic: "pythagoras", time: 238, diagram: {"type":"cuboid","l":8,"w":8,"h":6}, q: "A cuboid has dimensions 8 cm × 8 cm × 6 cm. Find the length of its space diagonal, correct to 1 d.p.", options: ["22 cm", "13.8 cm", "12.8 cm", "11.3 cm"], answer: 2 },
  { id: "h_3dp7254", topic: "pythagoras", time: 214, diagram: {"type":"cuboid","l":11,"w":6,"h":13}, q: "A cuboid has dimensions 11 cm × 6 cm × 13 cm. Find the length of its space diagonal, correct to 1 d.p.", options: ["18.1 cm", "30 cm", "12.5 cm", "19.1 cm"], answer: 0 },
  { id: "h_lad7255", topic: "pythagoras", time: 225, diagram: {"type":"rightTriangle","base":"68 m","height":"15.3 m","hyp":"69.7 m","unknownSide":"base"}, q: "A ladder 69.7 m long leans against a wall, reaching 15.3 m up the wall. Find the distance from the foot of the ladder to the wall", options: ["15.3 m", "54.4 m", "68 m", "69 m"], answer: 2 },
  { id: "h_lad7256", topic: "pythagoras", time: 235, diagram: {"type":"rightTriangle","base":"38.4 m","height":"11.2 m","hyp":"40 m","unknownSide":"height"}, q: "A ladder 40 m long has its foot 38.4 m from a wall. Find how far up the wall it reaches", options: ["12.2 m", "11.2 m", "1.6 m", "38.4 m"], answer: 1 },
  { id: "h_lad7257", topic: "pythagoras", time: 230, diagram: {"type":"rightTriangle","base":"37.8 m","height":"36 m","hyp":"52.2 m","unknownSide":"height"}, q: "A ladder 52.2 m long has its foot 37.8 m from a wall. Find how far up the wall it reaches", options: ["37.8 m", "36 m", "14.4 m", "37 m"], answer: 1 },
  { id: "h_lad7258", topic: "pythagoras", time: 222, diagram: {"type":"rightTriangle","base":"31.5 m","height":"30 m","hyp":"43.5 m","unknownSide":"base"}, q: "A ladder 43.5 m long leans against a wall, reaching 30 m up the wall. Find the distance from the foot of the ladder to the wall", options: ["13.5 m", "30 m", "31.5 m", "32.5 m"], answer: 2 },
  { id: "h_3dp7259", topic: "pythagoras", time: 221, diagram: {"type":"cuboid","l":7,"w":13,"h":15}, q: "A cuboid has dimensions 7 cm × 13 cm × 15 cm. Find the length of its space diagonal, correct to 1 d.p.", options: ["14.8 cm", "35 cm", "21 cm", "22 cm"], answer: 2 },
  { id: "h_lad7260", topic: "pythagoras", time: 210, diagram: {"type":"rightTriangle","base":"4.4 m","height":"3.3 m","hyp":"5.5 m","unknownSide":"base"}, q: "A ladder 5.5 m long leans against a wall, reaching 3.3 m up the wall. Find the distance from the foot of the ladder to the wall", options: ["5.4 m", "2.2 m", "3.3 m", "4.4 m"], answer: 3 },
  { id: "h_3dp7261", topic: "pythagoras", time: 211, diagram: {"type":"cuboid","l":4,"w":9,"h":4}, q: "A cuboid has dimensions 4 cm × 9 cm × 4 cm. Find the length of its space diagonal, correct to 1 d.p.", options: ["9.8 cm", "10.6 cm", "17 cm", "11.6 cm"], answer: 1 },
  { id: "h_lad7262", topic: "pythagoras", time: 217, diagram: {"type":"rightTriangle","base":"31.2 m","height":"9.1 m","hyp":"32.5 m","unknownSide":"base"}, q: "A ladder 32.5 m long leans against a wall, reaching 9.1 m up the wall. Find the distance from the foot of the ladder to the wall", options: ["9.1 m", "32.2 m", "23.4 m", "31.2 m"], answer: 3 },
  { id: "h_3dp7263", topic: "pythagoras", time: 239, diagram: {"type":"cuboid","l":4,"w":6,"h":12}, q: "A cuboid has dimensions 4 cm × 6 cm × 12 cm. Find the length of its space diagonal, correct to 1 d.p.", options: ["15 cm", "14 cm", "22 cm", "7.2 cm"], answer: 1 },
  // Ch quad — 50 questions (0 from real Edexcel 4MA1 past papers, 50 practice questions in the same style)
  { id: "h_sim27297", topic: "quad", time: 204, diagram: {"type":"similarShapes","r1":5,"r2":10}, q: "Two similar shapes have corresponding lengths in ratio 5:10. Find the ratio of their areas", options: ["5/2", "1/8", "1/2", "1/4"], answer: 3 },
  { id: "h_sim7298", topic: "quad", time: 224, diagram: {"type":"similarShapes","r1":3,"r2":8}, q: "Two similar solids have corresponding lengths in ratio 3:8. Find the ratio of their volumes", options: ["9/64", "3/8", "27/64", "27/512"], answer: 3 },
  { id: "h_pext7300", topic: "quad", time: 213, diagram: {"type":"polygon","n":15}, q: "Find the exterior angle of a regular 15-sided polygon", options: ["34°", "156°", "15°", "24°"], answer: 3 },
  { id: "h_sim27301", topic: "quad", time: 210, diagram: {"type":"similarShapes","r1":2,"r2":5}, q: "Two similar shapes have corresponding lengths in ratio 2:5. Find the ratio of their areas", options: ["4/25", "4/5", "2/5", "8/125"], answer: 0 },
  { id: "h_pext7302", topic: "quad", time: 219, diagram: {"type":"polygon","n":10}, q: "Find the exterior angle of a regular 10-sided polygon", options: ["46°", "36°", "144°", "10°"], answer: 1 },
  { id: "h_pext7303", topic: "quad", time: 193, diagram: {"type":"polygon","n":36}, q: "Find the exterior angle of a regular 36-sided polygon", options: ["10°", "20°", "36°", "170°"], answer: 0 },
  { id: "h_psides7304", topic: "quad", time: 207, diagram: {"type":"polygon","n":72}, q: "A regular polygon has an exterior angle of 5°. How many sides does it have?", options: ["5", "74", "355", "72"], answer: 3 },
  { id: "h_pext7306", topic: "quad", time: 205, diagram: {"type":"polygon","n":9}, q: "Find the exterior angle of a regular 9-sided polygon", options: ["140°", "50°", "40°", "9°"], answer: 2 },
  { id: "h_sim27307", topic: "quad", time: 213, diagram: {"type":"similarShapes","r1":2,"r2":8}, q: "Two similar shapes have corresponding lengths in ratio 2:8. Find the ratio of their areas", options: ["1/4", "1/16", "1/64", "1/2"], answer: 1 },
  { id: "h_pext7308", topic: "quad", time: 205, diagram: {"type":"polygon","n":18}, q: "Find the exterior angle of a regular 18-sided polygon", options: ["160°", "30°", "18°", "20°"], answer: 3 },
  { id: "h_sim27309", topic: "quad", time: 224, diagram: {"type":"similarShapes","r1":3,"r2":8}, q: "Two similar shapes have corresponding lengths in ratio 3:8. Find the ratio of their areas", options: ["9/64", "27/512", "3/8", "9/8"], answer: 0 },
  { id: "h_sim7310", topic: "quad", time: 215, diagram: {"type":"similarShapes","r1":6,"r2":9}, q: "Two similar solids have corresponding lengths in ratio 6:9. Find the ratio of their volumes", options: ["8/3", "2/3", "8/27", "4/9"], answer: 2 },
  { id: "h_sim7311", topic: "quad", time: 227, diagram: {"type":"similarShapes","r1":5,"r2":9}, q: "Two similar solids have corresponding lengths in ratio 5:9. Find the ratio of their volumes", options: ["5/9", "25/81", "125/81", "125/729"], answer: 3 },
  { id: "h_sim7312", topic: "quad", time: 227, diagram: {"type":"similarShapes","r1":2,"r2":3}, q: "Two similar solids have corresponding lengths in ratio 2:3. Find the ratio of their volumes", options: ["8/9", "2/3", "8/27", "4/9"], answer: 2 },
  { id: "h_sim27313", topic: "quad", time: 228, diagram: {"type":"similarShapes","r1":3,"r2":5}, q: "Two similar shapes have corresponding lengths in ratio 3:5. Find the ratio of their areas", options: ["9/25", "3/5", "9/5", "27/125"], answer: 0 },
  { id: "h_sim7314", topic: "quad", time: 216, diagram: {"type":"similarShapes","r1":4,"r2":5}, q: "Two similar solids have corresponding lengths in ratio 4:5. Find the ratio of their volumes", options: ["64/125", "4/5", "64/25", "16/25"], answer: 0 },
  { id: "h_pext7316", topic: "quad", time: 218, diagram: {"type":"polygon","n":24}, q: "Find the exterior angle of a regular 24-sided polygon", options: ["165°", "25°", "15°", "24°"], answer: 2 },
  { id: "h_sim27317", topic: "quad", time: 223, diagram: {"type":"similarShapes","r1":3,"r2":6}, q: "Two similar shapes have corresponding lengths in ratio 3:6. Find the ratio of their areas", options: ["1/2", "1/8", "3/2", "1/4"], answer: 3 },
  { id: "h_psides7321", topic: "quad", time: 224, diagram: {"type":"polygon","n":60}, q: "A regular polygon has an exterior angle of 6°. How many sides does it have?", options: ["354", "6", "60", "62"], answer: 2 },
  { id: "h_sim27322", topic: "quad", time: 202, diagram: {"type":"similarShapes","r1":6,"r2":8}, q: "Two similar shapes have corresponding lengths in ratio 6:8. Find the ratio of their areas", options: ["27/64", "9/2", "3/4", "9/16"], answer: 3 },
  { id: "h_psides7324", topic: "quad", time: 220, diagram: {"type":"polygon","n":18}, q: "A regular polygon has an exterior angle of 20°. How many sides does it have?", options: ["340", "20", "18.2", "18"], answer: 3 },
  { id: "h_psides7326", topic: "quad", time: 200, diagram: {"type":"polygon","n":30}, q: "A regular polygon has an exterior angle of 12°. How many sides does it have?", options: ["12", "348", "30", "32"], answer: 2 },
  { id: "h_sim7327", topic: "quad", time: 217, diagram: {"type":"similarShapes","r1":4,"r2":10}, q: "Two similar solids have corresponding lengths in ratio 4:10. Find the ratio of their volumes", options: ["16/25", "4/25", "8/125", "2/5"], answer: 2 },
  { id: "h_sim27328", topic: "quad", time: 200, diagram: {"type":"similarShapes","r1":4,"r2":7}, q: "Two similar shapes have corresponding lengths in ratio 4:7. Find the ratio of their areas", options: ["4/7", "64/343", "16/49", "16/7"], answer: 2 },
  { id: "h_psides7330", topic: "quad", time: 215, diagram: {"type":"polygon","n":36}, q: "A regular polygon has an exterior angle of 10°. How many sides does it have?", options: ["38", "350", "36", "10"], answer: 2 },
  { id: "h_psides7334", topic: "quad", time: 211, diagram: {"type":"polygon","n":45}, q: "A regular polygon has an exterior angle of 8°. How many sides does it have?", options: ["8", "45", "352", "47"], answer: 1 },
  { id: "h_sim27335", topic: "quad", time: 220, diagram: {"type":"similarShapes","r1":6,"r2":10}, q: "Two similar shapes have corresponding lengths in ratio 6:10. Find the ratio of their areas", options: ["18/5", "9/25", "27/125", "3/5"], answer: 1 },
  { id: "h_pext7340", topic: "quad", time: 218, diagram: {"type":"polygon","n":30}, q: "Find the exterior angle of a regular 30-sided polygon", options: ["12°", "30°", "168°", "22°"], answer: 0 },
  { id: "h_psides7341", topic: "quad", time: 228, diagram: {"type":"polygon","n":24}, q: "A regular polygon has an exterior angle of 15°. How many sides does it have?", options: ["24", "26", "345", "15"], answer: 0 },
  { id: "h_sim7342", topic: "quad", time: 200, diagram: {"type":"similarShapes","r1":6,"r2":7}, q: "Two similar solids have corresponding lengths in ratio 6:7. Find the ratio of their volumes", options: ["216/343", "36/49", "6/7", "216/49"], answer: 0 },
  { id: "h_sim27343", topic: "quad", time: 210, diagram: {"type":"similarShapes","r1":6,"r2":9}, q: "Two similar shapes have corresponding lengths in ratio 6:9. Find the ratio of their areas", options: ["2/3", "8/27", "4/9", "4"], answer: 2 },
  { id: "h_psides7346", topic: "quad", time: 211, diagram: {"type":"polygon","n":40}, q: "A regular polygon has an exterior angle of 9°. How many sides does it have?", options: ["9", "40", "42", "351"], answer: 1 },
  { id: "h_sim27349", topic: "quad", time: 226, diagram: {"type":"similarShapes","r1":4,"r2":9}, q: "Two similar shapes have corresponding lengths in ratio 4:9. Find the ratio of their areas", options: ["4/9", "64/729", "16/9", "16/81"], answer: 3 },
  { id: "h_sim7351", topic: "quad", time: 224, diagram: {"type":"similarShapes","r1":6,"r2":10}, q: "Two similar solids have corresponding lengths in ratio 6:10. Find the ratio of their volumes", options: ["3/5", "27/125", "54/25", "9/25"], answer: 1 },
  { id: "h_sim27353", topic: "quad", time: 205, diagram: {"type":"similarShapes","r1":3,"r2":10}, q: "Two similar shapes have corresponding lengths in ratio 3:10. Find the ratio of their areas", options: ["9/100", "3/10", "27/1000", "9/10"], answer: 0 },
  { id: "h_sim7354", topic: "quad", time: 211, diagram: {"type":"similarShapes","r1":5,"r2":6}, q: "Two similar solids have corresponding lengths in ratio 5:6. Find the ratio of their volumes", options: ["125/216", "5/6", "125/36", "25/36"], answer: 0 },
  { id: "h_sim27356", topic: "quad", time: 200, diagram: {"type":"similarShapes","r1":5,"r2":9}, q: "Two similar shapes have corresponding lengths in ratio 5:9. Find the ratio of their areas", options: ["125/729", "25/9", "25/81", "5/9"], answer: 2 },
  { id: "h_psides7357", topic: "quad", time: 215, diagram: {"type":"polygon","n":15}, q: "A regular polygon has an exterior angle of 24°. How many sides does it have?", options: ["336", "24", "17", "15"], answer: 3 },
  { id: "h_sim27358", topic: "quad", time: 218, diagram: {"type":"similarShapes","r1":6,"r2":7}, q: "Two similar shapes have corresponding lengths in ratio 6:7. Find the ratio of their areas", options: ["36/7", "216/343", "6/7", "36/49"], answer: 3 },
  { id: "h_pext7359", topic: "quad", time: 213, diagram: {"type":"polygon","n":20}, q: "Find the exterior angle of a regular 20-sided polygon", options: ["18°", "20°", "162°", "28°"], answer: 0 },
  { id: "h_sim7365", topic: "quad", time: 219, diagram: {"type":"similarShapes","r1":2,"r2":9}, q: "Two similar solids have corresponding lengths in ratio 2:9. Find the ratio of their volumes", options: ["8/729", "2/9", "8/81", "4/81"], answer: 0 },
  { id: "h_sim27368", topic: "quad", time: 210, diagram: {"type":"similarShapes","r1":4,"r2":6}, q: "Two similar shapes have corresponding lengths in ratio 4:6. Find the ratio of their areas", options: ["8/27", "8/3", "2/3", "4/9"], answer: 3 },
  { id: "h_psides7375", topic: "quad", time: 212, diagram: {"type":"polygon","n":20}, q: "A regular polygon has an exterior angle of 18°. How many sides does it have?", options: ["20", "18", "22", "342"], answer: 0 },
  { id: "h_sim27380", topic: "quad", time: 222, diagram: {"type":"similarShapes","r1":4,"r2":5}, q: "Two similar shapes have corresponding lengths in ratio 4:5. Find the ratio of their areas", options: ["4/5", "64/125", "16/5", "16/25"], answer: 3 },
  { id: "h_psides7386", topic: "quad", time: 219, diagram: {"type":"polygon","n":10}, q: "A regular polygon has an exterior angle of 36°. How many sides does it have?", options: ["36", "10", "12", "324"], answer: 1 },
  { id: "h_sim27396", topic: "quad", time: 227, diagram: {"type":"similarShapes","r1":5,"r2":7}, q: "Two similar shapes have corresponding lengths in ratio 5:7. Find the ratio of their areas", options: ["125/343", "25/49", "5/7", "25/7"], answer: 1 },
  { id: "h_sim27404", topic: "quad", time: 228, diagram: {"type":"similarShapes","r1":3,"r2":9}, q: "Two similar shapes have corresponding lengths in ratio 3:9. Find the ratio of their areas", options: ["1", "1/27", "1/9", "1/3"], answer: 2 },
  { id: "h_sim7412", topic: "quad", time: 220, diagram: {"type":"similarShapes","r1":5,"r2":8}, q: "Two similar solids have corresponding lengths in ratio 5:8. Find the ratio of their volumes", options: ["125/64", "5/8", "25/64", "125/512"], answer: 3 },
  { id: "h_sim27417", topic: "quad", time: 204, diagram: {"type":"similarShapes","r1":4,"r2":10}, q: "Two similar shapes have corresponding lengths in ratio 4:10. Find the ratio of their areas", options: ["4/25", "2/5", "8/5", "8/125"], answer: 0 },
  { id: "h_sim7424", topic: "quad", time: 206, diagram: {"type":"similarShapes","r1":3,"r2":7}, q: "Two similar solids have corresponding lengths in ratio 3:7. Find the ratio of their volumes", options: ["3/7", "27/49", "27/343", "9/49"], answer: 2 },
  // Ch circles — 50 questions (2 from real Edexcel 4MA1 past papers, 48 practice questions in the same style)
  { id: "ci1", topic: "circles", ref: "Nov 2025 1H Q15", time: 210, diagram: {"type":"sector","r":12,"angle":75}, q: "A sector has radius 12 cm and angle 75°. Find its area, to 3 s.f.", options: ["94.2 cm²", "15.7 cm²", "452 cm²", "31.4 cm²"], answer: 0 },
  { id: "ci2", topic: "circles", ref: "June 2025 1H Q11", time: 210, diagram: {"type":"sector","r":16,"angle":140}, q: "Sector OABC has radius 16 cm and angle 140°. Find its area, to 3 s.f.", options: ["313 cm²", "201 cm²", "804 cm²", "35.1 cm²"], answer: 0 },
  { id: "h_afa10497", topic: "circles", time: 216, diagram: {"type":"sector","r":15,"angle":30,"showArc":true}, q: "A sector of radius 15 cm has arc length 7.85 cm. Find the angle at the centre, correct to the nearest degree", options: ["30°", "0.5°", "40°", "330°"], answer: 0 },
  { id: "h_arc10498", topic: "circles", time: 223, diagram: {"type":"sector","r":13,"angle":135}, q: "A sector has radius 13 cm and angle 135°. Find its arc length, correct to 3 s.f.", options: ["81.7 cm", "30.6 cm", "199 cm", "61.3 cm"], answer: 1 },
  { id: "h_arc10499", topic: "circles", time: 232, diagram: {"type":"sector","r":20,"angle":30}, q: "A sector has radius 20 cm and angle 30°. Find its arc length, correct to 3 s.f.", options: ["20.9 cm", "126 cm", "105 cm", "10.5 cm"], answer: 3 },
  { id: "h_sec10500", topic: "circles", time: 215, diagram: {"type":"sector","r":9,"angle":150}, q: "A sector has radius 9 cm and angle 150°. Find its area, correct to 3 s.f.", options: ["106 cm²", "23.6 cm²", "254 cm²", "212 cm²"], answer: 0 },
  { id: "h_sec10501", topic: "circles", time: 237, diagram: {"type":"sector","r":4,"angle":45}, q: "A sector has radius 4 cm and angle 45°. Find its area, correct to 3 s.f.", options: ["6.28 cm²", "12.6 cm²", "50.3 cm²", "3.14 cm²"], answer: 0 },
  { id: "h_sec10502", topic: "circles", time: 218, diagram: {"type":"sector","r":13,"angle":72}, q: "A sector has radius 13 cm and angle 72°. Find its area, correct to 3 s.f.", options: ["531 cm²", "16.3 cm²", "212 cm²", "106 cm²"], answer: 3 },
  { id: "h_afa10503", topic: "circles", time: 226, diagram: {"type":"sector","r":7,"angle":90,"showArc":true}, q: "A sector of radius 7 cm has arc length 11 cm. Find the angle at the centre, correct to the nearest degree", options: ["1.6°", "270°", "90°", "100°"], answer: 2 },
  { id: "h_arc10504", topic: "circles", time: 238, diagram: {"type":"sector","r":11,"angle":160}, q: "A sector has radius 11 cm and angle 160°. Find its arc length, correct to 3 s.f.", options: ["61.4 cm", "69.1 cm", "30.7 cm", "169 cm"], answer: 2 },
  { id: "h_sec10505", topic: "circles", time: 222, diagram: {"type":"sector","r":23,"angle":160}, q: "A sector has radius 23 cm and angle 160°. Find its area, correct to 3 s.f.", options: ["739 cm²", "64.2 cm²", "1660 cm²", "1480 cm²"], answer: 0 },
  { id: "h_sec10506", topic: "circles", time: 216, diagram: {"type":"sector","r":22,"angle":120}, q: "A sector has radius 22 cm and angle 120°. Find its area, correct to 3 s.f.", options: ["1010 cm²", "1520 cm²", "46.1 cm²", "507 cm²"], answer: 3 },
  { id: "h_arc10507", topic: "circles", time: 229, diagram: {"type":"sector","r":21,"angle":90}, q: "A sector has radius 21 cm and angle 90°. Find its arc length, correct to 3 s.f.", options: ["66 cm", "33 cm", "346 cm", "132 cm"], answer: 1 },
  { id: "h_arc10508", topic: "circles", time: 210, diagram: {"type":"sector","r":10,"angle":100}, q: "A sector has radius 10 cm and angle 100°. Find its arc length, correct to 3 s.f.", options: ["34.9 cm", "87.3 cm", "62.8 cm", "17.5 cm"], answer: 3 },
  { id: "h_afa10509", topic: "circles", time: 236, diagram: {"type":"sector","r":20,"angle":60,"showArc":true}, q: "A sector of radius 20 cm has arc length 20.94 cm. Find the angle at the centre, correct to the nearest degree", options: ["1°", "60°", "300°", "70°"], answer: 1 },
  { id: "h_sec10510", topic: "circles", time: 215, diagram: {"type":"sector","r":23,"angle":150}, q: "A sector has radius 23 cm and angle 150°. Find its area, correct to 3 s.f.", options: ["692 cm²", "1380 cm²", "60.2 cm²", "1660 cm²"], answer: 0 },
  { id: "h_arc10511", topic: "circles", time: 222, diagram: {"type":"sector","r":24,"angle":60}, q: "A sector has radius 24 cm and angle 60°. Find its arc length, correct to 3 s.f.", options: ["50.3 cm", "25.1 cm", "151 cm", "302 cm"], answer: 1 },
  { id: "h_sec10512", topic: "circles", time: 210, diagram: {"type":"sector","r":10,"angle":135}, q: "A sector has radius 10 cm and angle 135°. Find its area, correct to 3 s.f.", options: ["314 cm²", "23.6 cm²", "236 cm²", "118 cm²"], answer: 3 },
  { id: "h_arc10513", topic: "circles", time: 230, diagram: {"type":"sector","r":20,"angle":72}, q: "A sector has radius 20 cm and angle 72°. Find its arc length, correct to 3 s.f.", options: ["50.3 cm", "251 cm", "126 cm", "25.1 cm"], answer: 3 },
  { id: "h_arc10514", topic: "circles", time: 236, diagram: {"type":"sector","r":23,"angle":140}, q: "A sector has radius 23 cm and angle 140°. Find its arc length, correct to 3 s.f.", options: ["56.2 cm", "112 cm", "145 cm", "646 cm"], answer: 0 },
  { id: "h_sec10515", topic: "circles", time: 226, diagram: {"type":"sector","r":8,"angle":100}, q: "A sector has radius 8 cm and angle 100°. Find its area, correct to 3 s.f.", options: ["112 cm²", "14 cm²", "201 cm²", "55.9 cm²"], answer: 3 },
  { id: "h_afa10516", topic: "circles", time: 236, diagram: {"type":"sector","r":14,"angle":30,"showArc":true}, q: "A sector of radius 14 cm has arc length 7.33 cm. Find the angle at the centre, correct to the nearest degree", options: ["330°", "30°", "40°", "0.5°"], answer: 1 },
  { id: "h_afa10518", topic: "circles", time: 234, diagram: {"type":"sector","r":15,"angle":120,"showArc":true}, q: "A sector of radius 15 cm has arc length 31.42 cm. Find the angle at the centre, correct to the nearest degree", options: ["240°", "130°", "120°", "2.1°"], answer: 2 },
  { id: "h_sec10519", topic: "circles", time: 235, diagram: {"type":"sector","r":10,"angle":90}, q: "A sector has radius 10 cm and angle 90°. Find its area, correct to 3 s.f.", options: ["157 cm²", "78.5 cm²", "15.7 cm²", "314 cm²"], answer: 1 },
  { id: "h_afa10520", topic: "circles", time: 220, diagram: {"type":"sector","r":14,"angle":100,"showArc":true}, q: "A sector of radius 14 cm has arc length 24.43 cm. Find the angle at the centre, correct to the nearest degree", options: ["110°", "260°", "1.7°", "100°"], answer: 3 },
  { id: "h_arc10521", topic: "circles", time: 218, diagram: {"type":"sector","r":5,"angle":60}, q: "A sector has radius 5 cm and angle 60°. Find its arc length, correct to 3 s.f.", options: ["13.1 cm", "31.4 cm", "10.5 cm", "5.24 cm"], answer: 3 },
  { id: "h_afa10522", topic: "circles", time: 217, diagram: {"type":"sector","r":5,"angle":72,"showArc":true}, q: "A sector of radius 5 cm has arc length 6.28 cm. Find the angle at the centre, correct to the nearest degree", options: ["82°", "1.3°", "72°", "288°"], answer: 2 },
  { id: "h_arc10523", topic: "circles", time: 240, diagram: {"type":"sector","r":17,"angle":140}, q: "A sector has radius 17 cm and angle 140°. Find its arc length, correct to 3 s.f.", options: ["83.1 cm", "353 cm", "41.5 cm", "107 cm"], answer: 2 },
  { id: "h_sec10524", topic: "circles", time: 223, diagram: {"type":"sector","r":8,"angle":30}, q: "A sector has radius 8 cm and angle 30°. Find its area, correct to 3 s.f.", options: ["33.5 cm²", "201 cm²", "4.19 cm²", "16.8 cm²"], answer: 3 },
  { id: "h_arc10525", topic: "circles", time: 212, diagram: {"type":"sector","r":7,"angle":100}, q: "A sector has radius 7 cm and angle 100°. Find its arc length, correct to 3 s.f.", options: ["24.4 cm", "44 cm", "12.2 cm", "42.8 cm"], answer: 2 },
  { id: "h_sec10526", topic: "circles", time: 221, diagram: {"type":"sector","r":9,"angle":120}, q: "A sector has radius 9 cm and angle 120°. Find its area, correct to 3 s.f.", options: ["84.8 cm²", "18.9 cm²", "170 cm²", "254 cm²"], answer: 0 },
  { id: "h_afa10527", topic: "circles", time: 236, diagram: {"type":"sector","r":10,"angle":90,"showArc":true}, q: "A sector of radius 10 cm has arc length 15.71 cm. Find the angle at the centre, correct to the nearest degree", options: ["1.6°", "100°", "90°", "270°"], answer: 2 },
  { id: "h_sec10528", topic: "circles", time: 220, diagram: {"type":"sector","r":8,"angle":60}, q: "A sector has radius 8 cm and angle 60°. Find its area, correct to 3 s.f.", options: ["201 cm²", "8.38 cm²", "67 cm²", "33.5 cm²"], answer: 3 },
  { id: "h_arc10529", topic: "circles", time: 232, diagram: {"type":"sector","r":16,"angle":120}, q: "A sector has radius 16 cm and angle 120°. Find its arc length, correct to 3 s.f.", options: ["33.5 cm", "101 cm", "268 cm", "67 cm"], answer: 0 },
  { id: "h_afa10530", topic: "circles", time: 238, diagram: {"type":"sector","r":11,"angle":100,"showArc":true}, q: "A sector of radius 11 cm has arc length 19.2 cm. Find the angle at the centre, correct to the nearest degree", options: ["1.7°", "260°", "100°", "110°"], answer: 2 },
  { id: "h_afa10531", topic: "circles", time: 240, diagram: {"type":"sector","r":16,"angle":100,"showArc":true}, q: "A sector of radius 16 cm has arc length 27.93 cm. Find the angle at the centre, correct to the nearest degree", options: ["1.7°", "260°", "100°", "110°"], answer: 2 },
  { id: "h_sec10532", topic: "circles", time: 234, diagram: {"type":"sector","r":25,"angle":100}, q: "A sector has radius 25 cm and angle 100°. Find its area, correct to 3 s.f.", options: ["1090 cm²", "545 cm²", "1960 cm²", "43.6 cm²"], answer: 1 },
  { id: "h_arc10533", topic: "circles", time: 215, diagram: {"type":"sector","r":10,"angle":140}, q: "A sector has radius 10 cm and angle 140°. Find its arc length, correct to 3 s.f.", options: ["24.4 cm", "48.9 cm", "62.8 cm", "122 cm"], answer: 0 },
  { id: "h_afa10534", topic: "circles", time: 232, diagram: {"type":"sector","r":19,"angle":90,"showArc":true}, q: "A sector of radius 19 cm has arc length 29.85 cm. Find the angle at the centre, correct to the nearest degree", options: ["1.6°", "100°", "270°", "90°"], answer: 3 },
  { id: "h_arc10535", topic: "circles", time: 219, diagram: {"type":"sector","r":10,"angle":60}, q: "A sector has radius 10 cm and angle 60°. Find its arc length, correct to 3 s.f.", options: ["10.5 cm", "62.8 cm", "20.9 cm", "52.4 cm"], answer: 0 },
  { id: "h_arc10536", topic: "circles", time: 234, diagram: {"type":"sector","r":25,"angle":150}, q: "A sector has radius 25 cm and angle 150°. Find its arc length, correct to 3 s.f.", options: ["157 cm", "131 cm", "818 cm", "65.5 cm"], answer: 3 },
  { id: "h_sec10537", topic: "circles", time: 238, diagram: {"type":"sector","r":4,"angle":150}, q: "A sector has radius 4 cm and angle 150°. Find its area, correct to 3 s.f.", options: ["50.3 cm²", "20.9 cm²", "41.9 cm²", "10.5 cm²"], answer: 1 },
  { id: "h_sec10538", topic: "circles", time: 234, diagram: {"type":"sector","r":6,"angle":120}, q: "A sector has radius 6 cm and angle 120°. Find its area, correct to 3 s.f.", options: ["113 cm²", "37.7 cm²", "75.4 cm²", "12.6 cm²"], answer: 1 },
  { id: "h_arc10539", topic: "circles", time: 237, diagram: {"type":"sector","r":23,"angle":100}, q: "A sector has radius 23 cm and angle 100°. Find its arc length, correct to 3 s.f.", options: ["145 cm", "80.3 cm", "40.1 cm", "462 cm"], answer: 2 },
  { id: "h_arc10541", topic: "circles", time: 212, diagram: {"type":"sector","r":23,"angle":30}, q: "A sector has radius 23 cm and angle 30°. Find its arc length, correct to 3 s.f.", options: ["24.1 cm", "138 cm", "145 cm", "12 cm"], answer: 3 },
  { id: "h_sec10542", topic: "circles", time: 236, diagram: {"type":"sector","r":18,"angle":72}, q: "A sector has radius 18 cm and angle 72°. Find its area, correct to 3 s.f.", options: ["1020 cm²", "407 cm²", "22.6 cm²", "204 cm²"], answer: 3 },
  { id: "h_arc10543", topic: "circles", time: 216, diagram: {"type":"sector","r":7,"angle":60}, q: "A sector has radius 7 cm and angle 60°. Find its arc length, correct to 3 s.f.", options: ["25.7 cm", "7.33 cm", "14.7 cm", "44 cm"], answer: 1 },
  { id: "h_afa10544", topic: "circles", time: 215, diagram: {"type":"sector","r":11,"angle":120,"showArc":true}, q: "A sector of radius 11 cm has arc length 23.04 cm. Find the angle at the centre, correct to the nearest degree", options: ["130°", "240°", "2.1°", "120°"], answer: 3 },
  { id: "h_sec10545", topic: "circles", time: 233, diagram: {"type":"sector","r":4,"angle":72}, q: "A sector has radius 4 cm and angle 72°. Find its area, correct to 3 s.f.", options: ["20.1 cm²", "10.1 cm²", "5.03 cm²", "50.3 cm²"], answer: 1 },
  { id: "h_arc10546", topic: "circles", time: 218, diagram: {"type":"sector","r":24,"angle":90}, q: "A sector has radius 24 cm and angle 90°. Find its arc length, correct to 3 s.f.", options: ["37.7 cm", "151 cm", "75.4 cm", "452 cm"], answer: 0 },
  // Ch coordgeo — 50 questions (0 from real Edexcel 4MA1 past papers, 50 practice questions in the same style)
  { id: "h_pb10581", topic: "coordgeo", time: 228, diagram: {"type":"coordPlot","points":[{"x":-5,"y":-2,"label":"A"},{"x":-11,"y":-6,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (-5, -2) and (-11, -6)", options: ["y = 1.5x − 16", "y = 0.67x − 16", "y = -1.5x − 16", "y = -1.5x + 16"], answer: 2 },
  { id: "h_pb10582", topic: "coordgeo", time: 242, diagram: {"type":"coordPlot","points":[{"x":-3,"y":-2,"label":"A"},{"x":-5,"y":-8,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (-3, -2) and (-5, -8)", options: ["y = 3x − 6.33", "y = -0.33x − 6.33", "y = -0.33x + 6.33", "y = 0.33x − 6.33"], answer: 1 },
  { id: "h_pb10583", topic: "coordgeo", time: 245, diagram: {"type":"coordPlot","points":[{"x":3,"y":2,"label":"A"},{"x":9,"y":-2,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (3, 2) and (9, -2)", options: ["y = 1.5x − 9", "y = -0.67x − 9", "y = -1.5x − 9", "y = 1.5x + 9"], answer: 0 },
  { id: "h_pb10584", topic: "coordgeo", time: 233, diagram: {"type":"coordPlot","points":[{"x":-2,"y":1,"label":"A"},{"x":0,"y":5,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (-2, 1) and (0, 5)", options: ["y = -0.5x − 2.5", "y = 2x + 2.5", "y = -0.5x + 2.5", "y = 0.5x + 2.5"], answer: 2 },
  { id: "h_pb10585", topic: "coordgeo", time: 250, diagram: {"type":"coordPlot","points":[{"x":-3,"y":2,"label":"A"},{"x":-1,"y":6,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (-3, 2) and (-1, 6)", options: ["y = -0.5x + 3", "y = -0.5x − 3", "y = 2x + 3", "y = 0.5x + 3"], answer: 0 },
  { id: "h_pb10586", topic: "coordgeo", time: 234, diagram: {"type":"coordPlot","points":[{"x":1,"y":0,"label":"A"},{"x":5,"y":-6,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (1, 0) and (5, -6)", options: ["y = -1.5x − 5", "y = -0.67x − 5", "y = 0.67x − 5", "y = 0.67x + 5"], answer: 2 },
  { id: "h_pb10587", topic: "coordgeo", time: 224, diagram: {"type":"coordPlot","points":[{"x":3,"y":-3,"label":"A"},{"x":1,"y":3,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (3, -3) and (1, 3)", options: ["y = -3x − 0.67", "y = 0.33x − 0.67", "y = 0.33x + 0.67", "y = -0.33x − 0.67"], answer: 1 },
  { id: "h_pb10588", topic: "coordgeo", time: 237, diagram: {"type":"coordPlot","points":[{"x":4,"y":1,"label":"A"},{"x":0,"y":-1,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (4, 1) and (0, -1)", options: ["y = 2x + 4", "y = 0.5x + 4", "y = -2x + 4", "y = -2x − 4"], answer: 2 },
  { id: "h_pb10589", topic: "coordgeo", time: 239, diagram: {"type":"coordPlot","points":[{"x":-2,"y":1,"label":"A"},{"x":-8,"y":5,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (-2, 1) and (-8, 5)", options: ["y = 1.5x + 10.5", "y = -0.67x + 10.5", "y = -1.5x + 10.5", "y = 1.5x − 10.5"], answer: 0 },
  { id: "h_pb10590", topic: "coordgeo", time: 243, diagram: {"type":"coordPlot","points":[{"x":2,"y":6,"label":"A"},{"x":0,"y":0,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (2, 6) and (0, 0)", options: ["y = -0.33x + 3.33", "y = 0.33x + 3.33", "y = 3x + 3.33", "y = -0.33x − 3.33"], answer: 0 },
  { id: "h_pb10591", topic: "coordgeo", time: 228, diagram: {"type":"coordPlot","points":[{"x":2,"y":-2,"label":"A"},{"x":-2,"y":-8,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (2, -2) and (-2, -8)", options: ["y = -0.67x + 5", "y = 1.5x − 5", "y = -0.67x − 5", "y = 0.67x − 5"], answer: 2 },
  { id: "h_pb10593", topic: "coordgeo", time: 249, diagram: {"type":"coordPlot","points":[{"x":-5,"y":6,"label":"A"},{"x":-3,"y":2,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (-5, 6) and (-3, 2)", options: ["y = -2x + 6", "y = 0.5x − 6", "y = -0.5x + 6", "y = 0.5x + 6"], answer: 3 },
  { id: "h_pb10595", topic: "coordgeo", time: 224, diagram: {"type":"coordPlot","points":[{"x":3,"y":-6,"label":"A"},{"x":7,"y":-8,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (3, -6) and (7, -8)", options: ["y = -2x − 17", "y = 2x + 17", "y = 2x − 17", "y = -0.5x − 17"], answer: 2 },
  { id: "h_pb10597", topic: "coordgeo", time: 230, diagram: {"type":"coordPlot","points":[{"x":-4,"y":-6,"label":"A"},{"x":0,"y":-4,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (-4, -6) and (0, -4)", options: ["y = -2x + 9", "y = 2x − 9", "y = 0.5x − 9", "y = -2x − 9"], answer: 3 },
  { id: "h_pb10598", topic: "coordgeo", time: 237, diagram: {"type":"coordPlot","points":[{"x":0,"y":-6,"label":"A"},{"x":6,"y":-4,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (0, -6) and (6, -4)", options: ["y = -3x − 4", "y = -3x + 4", "y = 0.33x + 4", "y = 3x + 4"], answer: 1 },
  { id: "h_pb10599", topic: "coordgeo", time: 227, diagram: {"type":"coordPlot","points":[{"x":-4,"y":-6,"label":"A"},{"x":2,"y":-4,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (-4, -6) and (2, -4)", options: ["y = 3x − 8", "y = -3x − 8", "y = -3x + 8", "y = 0.33x − 8"], answer: 1 },
  { id: "h_pb10601", topic: "coordgeo", time: 240, diagram: {"type":"coordPlot","points":[{"x":-1,"y":-2,"label":"A"},{"x":-3,"y":-8,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (-1, -2) and (-3, -8)", options: ["y = -0.33x + 5.67", "y = -0.33x − 5.67", "y = 3x − 5.67", "y = 0.33x − 5.67"], answer: 1 },
  { id: "h_pb10602", topic: "coordgeo", time: 227, diagram: {"type":"coordPlot","points":[{"x":2,"y":-4,"label":"A"},{"x":4,"y":-10,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (2, -4) and (4, -10)", options: ["y = 0.33x − 8", "y = 0.33x + 8", "y = -0.33x − 8", "y = -3x − 8"], answer: 0 },
  { id: "h_pb10603", topic: "coordgeo", time: 246, diagram: {"type":"coordPlot","points":[{"x":4,"y":-5,"label":"A"},{"x":10,"y":-9,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (4, -5) and (10, -9)", options: ["y = -1.5x − 17.5", "y = -0.67x − 17.5", "y = 1.5x + 17.5", "y = 1.5x − 17.5"], answer: 3 },
  { id: "h_pb10604", topic: "coordgeo", time: 229, diagram: {"type":"coordPlot","points":[{"x":1,"y":0,"label":"A"},{"x":-1,"y":-4,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (1, 0) and (-1, -4)", options: ["y = -0.5x − 2", "y = 2x − 2", "y = 0.5x − 2", "y = -0.5x + 2"], answer: 0 },
  { id: "h_pb10608", topic: "coordgeo", time: 223, diagram: {"type":"coordPlot","points":[{"x":6,"y":-2,"label":"A"},{"x":0,"y":0,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (6, -2) and (0, 0)", options: ["y = -3x − 10", "y = -0.33x − 10", "y = 3x − 10", "y = 3x + 10"], answer: 2 },
  { id: "h_pb10609", topic: "coordgeo", time: 223, diagram: {"type":"coordPlot","points":[{"x":4,"y":-3,"label":"A"},{"x":2,"y":3,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (4, -3) and (2, 3)", options: ["y = 0.33x + 1", "y = 0.33x − 1", "y = -0.33x − 1", "y = -3x − 1"], answer: 1 },
  { id: "h_pb10611", topic: "coordgeo", time: 243, diagram: {"type":"coordPlot","points":[{"x":-1,"y":3,"label":"A"},{"x":1,"y":-3,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (-1, 3) and (1, -3)", options: ["y = 0.33x − 0.5", "y = -3x + 0.5", "y = 0.33x + 0.5", "y = -0.33x + 0.5"], answer: 2 },
  { id: "h_pb10612", topic: "coordgeo", time: 248, diagram: {"type":"coordPlot","points":[{"x":-2,"y":4,"label":"A"},{"x":-8,"y":0,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (-2, 4) and (-8, 0)", options: ["y = -1.5x + 5.5", "y = 1.5x − 5.5", "y = 0.67x − 5.5", "y = -1.5x − 5.5"], answer: 3 },
  { id: "h_pb10613", topic: "coordgeo", time: 241, diagram: {"type":"coordPlot","points":[{"x":3,"y":2,"label":"A"},{"x":5,"y":6,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (3, 2) and (5, 6)", options: ["y = 2x + 6", "y = -0.5x − 6", "y = 0.5x + 6", "y = -0.5x + 6"], answer: 3 },
  { id: "h_pb10616", topic: "coordgeo", time: 240, diagram: {"type":"coordPlot","points":[{"x":2,"y":5,"label":"A"},{"x":8,"y":1,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (2, 5) and (8, 1)", options: ["y = -1.5x − 4.5", "y = 1.5x + 4.5", "y = -0.67x − 4.5", "y = 1.5x − 4.5"], answer: 3 },
  { id: "h_pb10617", topic: "coordgeo", time: 224, diagram: {"type":"coordPlot","points":[{"x":0,"y":2,"label":"A"},{"x":-2,"y":-4,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (0, 2) and (-2, -4)", options: ["y = -0.33x + 1.33", "y = 3x − 1.33", "y = -0.33x − 1.33", "y = 0.33x − 1.33"], answer: 2 },
  { id: "h_pb10619", topic: "coordgeo", time: 250, diagram: {"type":"coordPlot","points":[{"x":-6,"y":2,"label":"A"},{"x":-12,"y":0,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (-6, 2) and (-12, 0)", options: ["y = -3x + 26", "y = 0.33x − 26", "y = -3x − 26", "y = 3x − 26"], answer: 2 },
  { id: "h_pb10621", topic: "coordgeo", time: 248, diagram: {"type":"coordPlot","points":[{"x":-1,"y":1,"label":"A"},{"x":-3,"y":-5,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (-1, 1) and (-3, -5)", options: ["y = 3x − 2.67", "y = -0.33x − 2.67", "y = 0.33x − 2.67", "y = -0.33x + 2.67"], answer: 1 },
  { id: "h_pb10622", topic: "coordgeo", time: 242, diagram: {"type":"coordPlot","points":[{"x":0,"y":0,"label":"A"},{"x":4,"y":2,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (0, 0) and (4, 2)", options: ["y = -2x + 5", "y = -2x − 5", "y = 2x + 5", "y = 0.5x + 5"], answer: 0 },
  { id: "h_pb10623", topic: "coordgeo", time: 235, diagram: {"type":"coordPlot","points":[{"x":6,"y":3,"label":"A"},{"x":2,"y":5,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (6, 3) and (2, 5)", options: ["y = 2x − 4", "y = 2x + 4", "y = -0.5x − 4", "y = -2x − 4"], answer: 0 },
  { id: "h_pb10624", topic: "coordgeo", time: 231, diagram: {"type":"coordPlot","points":[{"x":4,"y":2,"label":"A"},{"x":0,"y":8,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (4, 2) and (0, 8)", options: ["y = -0.67x + 3.67", "y = 0.67x + 3.67", "y = 0.67x − 3.67", "y = -1.5x + 3.67"], answer: 1 },
  { id: "h_pb10629", topic: "coordgeo", time: 221, diagram: {"type":"coordPlot","points":[{"x":6,"y":2,"label":"A"},{"x":8,"y":-4,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (6, 2) and (8, -4)", options: ["y = 0.33x + 3.33", "y = 0.33x − 3.33", "y = -3x − 3.33", "y = -0.33x − 3.33"], answer: 1 },
  { id: "h_pb10630", topic: "coordgeo", time: 224, diagram: {"type":"coordPlot","points":[{"x":-6,"y":6,"label":"A"},{"x":-2,"y":12,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (-6, 6) and (-2, 12)", options: ["y = -0.67x − 6.33", "y = -0.67x + 6.33", "y = 1.5x + 6.33", "y = 0.67x + 6.33"], answer: 1 },
  { id: "h_pb10631", topic: "coordgeo", time: 246, diagram: {"type":"coordPlot","points":[{"x":-6,"y":2,"label":"A"},{"x":-10,"y":-4,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (-6, 2) and (-10, -4)", options: ["y = -0.67x − 6.33", "y = 0.67x − 6.33", "y = 1.5x − 6.33", "y = -0.67x + 6.33"], answer: 0 },
  { id: "h_pb10632", topic: "coordgeo", time: 236, diagram: {"type":"coordPlot","points":[{"x":-3,"y":6,"label":"A"},{"x":-9,"y":2,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (-3, 6) and (-9, 2)", options: ["y = 0.67x − 5", "y = 1.5x − 5", "y = -1.5x + 5", "y = -1.5x − 5"], answer: 3 },
  { id: "h_pb10634", topic: "coordgeo", time: 221, diagram: {"type":"coordPlot","points":[{"x":-5,"y":1,"label":"A"},{"x":1,"y":5,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (-5, 1) and (1, 5)", options: ["y = 0.67x + 0.5", "y = -1.5x − 0.5", "y = -1.5x + 0.5", "y = 1.5x + 0.5"], answer: 2 },
  { id: "h_pb10637", topic: "coordgeo", time: 247, diagram: {"type":"coordPlot","points":[{"x":-1,"y":-4,"label":"A"},{"x":-3,"y":0,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (-1, -4) and (-3, 0)", options: ["y = -2x − 1", "y = 0.5x + 1", "y = -0.5x − 1", "y = 0.5x − 1"], answer: 3 },
  { id: "h_pb10639", topic: "coordgeo", time: 247, diagram: {"type":"coordPlot","points":[{"x":1,"y":-4,"label":"A"},{"x":3,"y":2,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (1, -4) and (3, 2)", options: ["y = 3x − 0.33", "y = -0.33x + 0.33", "y = 0.33x − 0.33", "y = -0.33x − 0.33"], answer: 3 },
  { id: "h_pb10640", topic: "coordgeo", time: 227, diagram: {"type":"coordPlot","points":[{"x":-1,"y":0,"label":"A"},{"x":-5,"y":-2,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (-1, 0) and (-5, -2)", options: ["y = -2x − 7", "y = -2x + 7", "y = 2x − 7", "y = 0.5x − 7"], answer: 0 },
  { id: "h_pb10641", topic: "coordgeo", time: 224, diagram: {"type":"coordPlot","points":[{"x":0,"y":5,"label":"A"},{"x":-4,"y":7,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (0, 5) and (-4, 7)", options: ["y = -2x + 10", "y = -0.5x + 10", "y = 2x − 10", "y = 2x + 10"], answer: 3 },
  { id: "h_pb10642", topic: "coordgeo", time: 238, diagram: {"type":"coordPlot","points":[{"x":3,"y":2,"label":"A"},{"x":5,"y":8,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (3, 2) and (5, 8)", options: ["y = -0.33x + 6.33", "y = 0.33x + 6.33", "y = -0.33x − 6.33", "y = 3x + 6.33"], answer: 0 },
  { id: "h_pb10644", topic: "coordgeo", time: 248, diagram: {"type":"coordPlot","points":[{"x":-2,"y":-5,"label":"A"},{"x":2,"y":1,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (-2, -5) and (2, 1)", options: ["y = -0.67x − 2", "y = 1.5x − 2", "y = 0.67x − 2", "y = -0.67x + 2"], answer: 0 },
  { id: "h_pb10645", topic: "coordgeo", time: 221, diagram: {"type":"coordPlot","points":[{"x":-5,"y":0,"label":"A"},{"x":-7,"y":4,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (-5, 0) and (-7, 4)", options: ["y = 0.5x + 5", "y = -0.5x + 5", "y = -2x + 5", "y = 0.5x − 5"], answer: 0 },
  { id: "h_pb10646", topic: "coordgeo", time: 244, diagram: {"type":"coordPlot","points":[{"x":0,"y":2,"label":"A"},{"x":6,"y":4,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (0, 2) and (6, 4)", options: ["y = -3x − 12", "y = -3x + 12", "y = 0.33x + 12", "y = 3x + 12"], answer: 1 },
  { id: "h_pb10648", topic: "coordgeo", time: 241, diagram: {"type":"coordPlot","points":[{"x":-2,"y":4,"label":"A"},{"x":-8,"y":8,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (-2, 4) and (-8, 8)", options: ["y = 1.5x − 13.5", "y = -1.5x + 13.5", "y = 1.5x + 13.5", "y = -0.67x + 13.5"], answer: 2 },
  { id: "h_pb10650", topic: "coordgeo", time: 223, diagram: {"type":"coordPlot","points":[{"x":3,"y":-5,"label":"A"},{"x":-3,"y":-3,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (3, -5) and (-3, -3)", options: ["y = -0.33x − 4", "y = -3x − 4", "y = 3x + 4", "y = 3x − 4"], answer: 3 },
  { id: "h_pb10652", topic: "coordgeo", time: 245, diagram: {"type":"coordPlot","points":[{"x":-6,"y":-2,"label":"A"},{"x":0,"y":2,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (-6, -2) and (0, 2)", options: ["y = -1.5x + 4.5", "y = 0.67x − 4.5", "y = 1.5x − 4.5", "y = -1.5x − 4.5"], answer: 3 },
  { id: "h_pb10653", topic: "coordgeo", time: 239, diagram: {"type":"coordPlot","points":[{"x":5,"y":1,"label":"A"},{"x":9,"y":7,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (5, 1) and (9, 7)", options: ["y = -0.67x + 8.67", "y = -0.67x − 8.67", "y = 1.5x + 8.67", "y = 0.67x + 8.67"], answer: 0 },
  { id: "h_pb10655", topic: "coordgeo", time: 220, diagram: {"type":"coordPlot","points":[{"x":-6,"y":1,"label":"A"},{"x":-4,"y":-5,"label":"B"}],"showLine":true,"showMidpoint":true}, q: "Find the equation of the perpendicular bisector of the line segment joining (-6, 1) and (-4, -5)", options: ["y = -0.33x − 0.33", "y = 0.33x − 0.33", "y = -3x − 0.33", "y = 0.33x + 0.33"], answer: 1 },
  // Ch graphs — 50 questions (0 from real Edexcel 4MA1 past papers, 50 practice questions in the same style)
  { id: "h_tp10696", topic: "graphs", time: 228, diagram: {"type":"quadGraph","a":1,"c":12,"h":2}, q: "Find the turning point of y = x² − 4x + 16", options: ["(2, 16)", "(-2, 12)", "(2, -12)", "(2, 12)"], answer: 3 },
  { id: "h_qi10697", topic: "graphs", time: 224, diagram: {"type":"quadGraph","a":1,"c":-12.25,"h":2.5,"roots":[-1,6]}, q: "Solve x² − 5x − 6 ≤ 0", options: ["x ≤ -1 or x ≥ 6", "1 ≤ x ≤ -6", "6 ≤ x ≤ -1", "-1 ≤ x ≤ 6"], answer: 3 },
  { id: "h_qi10698", topic: "graphs", time: 237, diagram: {"type":"quadGraph","a":1,"c":-20.25,"h":2.5,"roots":[-2,7]}, q: "Solve x² − 5x − 14 ≤ 0", options: ["2 ≤ x ≤ -7", "-2 ≤ x ≤ 7", "7 ≤ x ≤ -2", "x ≤ -2 or x ≥ 7"], answer: 1 },
  { id: "h_tp10699", topic: "graphs", time: 238, diagram: {"type":"quadGraph","a":1,"c":-12,"h":5}, q: "Find the turning point of y = x² − 10x + 13", options: ["(-5, -12)", "(5, -12)", "(5, 13)", "(5, 12)"], answer: 1 },
  { id: "h_qi10700", topic: "graphs", time: 239, diagram: {"type":"quadGraph","a":1,"c":-49,"h":2,"roots":[-5,9]}, q: "Solve x² − 4x − 45 < 0", options: ["x < -5 or x > 9", "9 < x < -5", "-5 < x < 9", "5 < x < -9"], answer: 2 },
  { id: "h_qi10701", topic: "graphs", time: 234, diagram: {"type":"quadGraph","a":1,"c":-30.25,"h":-3.5,"roots":[-9,2]}, q: "Solve x² + 7x − 18 < 0", options: ["x < -9 or x > 2", "-9 < x < 2", "2 < x < -9", "9 < x < -2"], answer: 1 },
  { id: "h_tp10702", topic: "graphs", time: 230, diagram: {"type":"quadGraph","a":1,"c":-6,"h":-5}, q: "Find the turning point of y = x² + 10x + 19", options: ["(-5, 19)", "(-5, 6)", "(5, -6)", "(-5, -6)"], answer: 3 },
  { id: "h_tp10703", topic: "graphs", time: 226, diagram: {"type":"quadGraph","a":1,"c":-12,"h":-3}, q: "Find the turning point of y = x² + 6x − 3", options: ["(-3, 12)", "(-3, -12)", "(3, -12)", "(-3, -3)"], answer: 1 },
  { id: "h_tp10704", topic: "graphs", time: 230, diagram: {"type":"quadGraph","a":1,"c":-5,"h":-7}, q: "Find the turning point of y = x² + 14x + 44", options: ["(7, -5)", "(-7, 44)", "(-7, -5)", "(-7, 5)"], answer: 2 },
  { id: "h_tp10705", topic: "graphs", time: 245, diagram: {"type":"quadGraph","a":1,"c":-6,"h":-3}, q: "Find the turning point of y = x² + 6x + 3", options: ["(3, -6)", "(-3, 3)", "(-3, 6)", "(-3, -6)"], answer: 3 },
  { id: "h_qi10706", topic: "graphs", time: 226, diagram: {"type":"quadGraph","a":1,"c":-16,"h":1,"roots":[-3,5]}, q: "Solve x² − 2x − 15 ≤ 0", options: ["x ≤ -3 or x ≥ 5", "3 ≤ x ≤ -5", "5 ≤ x ≤ -3", "-3 ≤ x ≤ 5"], answer: 3 },
  { id: "h_qi10707", topic: "graphs", time: 238, diagram: {"type":"quadGraph","a":1,"c":-30.25,"h":0.5,"roots":[-5,6]}, q: "Solve x² − x − 30 < 0", options: ["5 < x < -6", "x < -5 or x > 6", "-5 < x < 6", "6 < x < -5"], answer: 2 },
  { id: "h_qi10708", topic: "graphs", time: 231, diagram: {"type":"quadGraph","a":1,"c":-36,"h":-3,"roots":[-9,3]}, q: "Solve x² + 6x − 27 ≤ 0", options: ["9 ≤ x ≤ -3", "x ≤ -9 or x ≥ 3", "-9 ≤ x ≤ 3", "3 ≤ x ≤ -9"], answer: 2 },
  { id: "h_qi10709", topic: "graphs", time: 241, diagram: {"type":"quadGraph","a":1,"c":-6.25,"h":-1.5,"roots":[-4,1]}, q: "Solve x² + 3x − 4 < 0", options: ["x < -4 or x > 1", "4 < x < -1", "-4 < x < 1", "1 < x < -4"], answer: 2 },
  { id: "h_qi10710", topic: "graphs", time: 249, diagram: {"type":"quadGraph","a":1,"c":-42.25,"h":1.5,"roots":[-5,8]}, q: "Solve x² − 3x − 40 ≤ 0", options: ["5 ≤ x ≤ -8", "-5 ≤ x ≤ 8", "x ≤ -5 or x ≥ 8", "8 ≤ x ≤ -5"], answer: 1 },
  { id: "h_tp10711", topic: "graphs", time: 222, diagram: {"type":"quadGraph","a":1,"c":-15,"h":4}, q: "Find the turning point of y = x² − 8x + 1", options: ["(4, -15)", "(-4, -15)", "(4, 15)", "(4, 1)"], answer: 0 },
  { id: "h_qi10712", topic: "graphs", time: 226, diagram: {"type":"quadGraph","a":1,"c":-25,"h":-2,"roots":[-7,3]}, q: "Solve x² + 4x − 21 < 0", options: ["7 < x < -3", "3 < x < -7", "-7 < x < 3", "x < -7 or x > 3"], answer: 2 },
  { id: "h_qi10713", topic: "graphs", time: 233, diagram: {"type":"quadGraph","a":1,"c":-4,"h":-1,"roots":[-3,1]}, q: "Solve x² + 2x − 3 ≤ 0", options: ["1 ≤ x ≤ -3", "-3 ≤ x ≤ 1", "3 ≤ x ≤ -1", "x ≤ -3 or x ≥ 1"], answer: 1 },
  { id: "h_tp10714", topic: "graphs", time: 229, diagram: {"type":"quadGraph","a":1,"c":-7,"h":-2}, q: "Find the turning point of y = x² + 4x − 3", options: ["(-2, 7)", "(-2, -7)", "(2, -7)", "(-2, -3)"], answer: 1 },
  { id: "h_qi10715", topic: "graphs", time: 250, diagram: {"type":"quadGraph","a":1,"c":-64,"h":-1,"roots":[-9,7]}, q: "Solve x² + 2x − 63 ≤ 0", options: ["-9 ≤ x ≤ 7", "9 ≤ x ≤ -7", "7 ≤ x ≤ -9", "x ≤ -9 or x ≥ 7"], answer: 0 },
  { id: "h_qi10716", topic: "graphs", time: 225, diagram: {"type":"quadGraph","a":1,"c":-30.25,"h":-0.5,"roots":[-6,5]}, q: "Solve x² + x − 30 ≤ 0", options: ["5 ≤ x ≤ -6", "-6 ≤ x ≤ 5", "6 ≤ x ≤ -5", "x ≤ -6 or x ≥ 5"], answer: 1 },
  { id: "h_tp10717", topic: "graphs", time: 232, diagram: {"type":"quadGraph","a":1,"c":-14,"h":5}, q: "Find the turning point of y = x² − 10x + 11", options: ["(5, 14)", "(5, 11)", "(-5, -14)", "(5, -14)"], answer: 3 },
  { id: "h_tp10718", topic: "graphs", time: 233, diagram: {"type":"quadGraph","a":1,"c":-4,"h":-2}, q: "Find the turning point of y = x² + 4x", options: ["(-2, 4)", "(-2, 0)", "(2, -4)", "(-2, -4)"], answer: 3 },
  { id: "h_tp10719", topic: "graphs", time: 223, diagram: {"type":"quadGraph","a":1,"c":-1,"h":-6}, q: "Find the turning point of y = x² + 12x + 35", options: ["(-6, -1)", "(-6, 1)", "(6, -1)", "(-6, 35)"], answer: 0 },
  { id: "h_tp10720", topic: "graphs", time: 233, diagram: {"type":"quadGraph","a":1,"c":6,"h":1}, q: "Find the turning point of y = x² − 2x + 7", options: ["(1, -6)", "(1, 7)", "(-1, 6)", "(1, 6)"], answer: 3 },
  { id: "h_qi10721", topic: "graphs", time: 231, diagram: {"type":"quadGraph","a":1,"c":-2.25,"h":0.5,"roots":[-1,2]}, q: "Solve x² − x − 2 ≤ 0", options: ["1 ≤ x ≤ -2", "x ≤ -1 or x ≥ 2", "2 ≤ x ≤ -1", "-1 ≤ x ≤ 2"], answer: 3 },
  { id: "h_qi10722", topic: "graphs", time: 241, diagram: {"type":"quadGraph","a":1,"c":-2.25,"h":-0.5,"roots":[-2,1]}, q: "Solve x² + x − 2 ≤ 0", options: ["1 ≤ x ≤ -2", "2 ≤ x ≤ -1", "-2 ≤ x ≤ 1", "x ≤ -2 or x ≥ 1"], answer: 2 },
  { id: "h_tp10724", topic: "graphs", time: 235, diagram: {"type":"quadGraph","a":1,"c":8,"h":7}, q: "Find the turning point of y = x² − 14x + 57", options: ["(7, -8)", "(7, 8)", "(-7, 8)", "(7, 57)"], answer: 1 },
  { id: "h_qi10725", topic: "graphs", time: 244, diagram: {"type":"quadGraph","a":1,"c":-16,"h":1,"roots":[-3,5]}, q: "Solve x² − 2x − 15 < 0", options: ["-3 < x < 5", "3 < x < -5", "5 < x < -3", "x < -3 or x > 5"], answer: 0 },
  { id: "h_qi10726", topic: "graphs", time: 228, diagram: {"type":"quadGraph","a":1,"c":-30.25,"h":-3.5,"roots":[-9,2]}, q: "Solve x² + 7x − 18 ≤ 0", options: ["2 ≤ x ≤ -9", "9 ≤ x ≤ -2", "x ≤ -9 or x ≥ 2", "-9 ≤ x ≤ 2"], answer: 3 },
  { id: "h_tp10727", topic: "graphs", time: 250, diagram: {"type":"quadGraph","a":1,"c":5,"h":1}, q: "Find the turning point of y = x² − 2x + 6", options: ["(1, 6)", "(1, 5)", "(-1, 5)", "(1, -5)"], answer: 1 },
  { id: "h_qi10728", topic: "graphs", time: 245, diagram: {"type":"quadGraph","a":1,"c":-64,"h":1,"roots":[-7,9]}, q: "Solve x² − 2x − 63 ≤ 0", options: ["x ≤ -7 or x ≥ 9", "-7 ≤ x ≤ 9", "7 ≤ x ≤ -9", "9 ≤ x ≤ -7"], answer: 1 },
  { id: "h_qi10729", topic: "graphs", time: 226, diagram: {"type":"quadGraph","a":1,"c":-30.25,"h":2.5,"roots":[-3,8]}, q: "Solve x² − 5x − 24 < 0", options: ["x < -3 or x > 8", "-3 < x < 8", "3 < x < -8", "8 < x < -3"], answer: 1 },
  { id: "h_qi10730", topic: "graphs", time: 233, diagram: {"type":"quadGraph","a":1,"c":-20.25,"h":3.5,"roots":[-1,8]}, q: "Solve x² − 7x − 8 ≤ 0", options: ["8 ≤ x ≤ -1", "-1 ≤ x ≤ 8", "x ≤ -1 or x ≥ 8", "1 ≤ x ≤ -8"], answer: 1 },
  { id: "h_tp10731", topic: "graphs", time: 220, diagram: {"type":"quadGraph","a":1,"c":5,"h":7}, q: "Find the turning point of y = x² − 14x + 54", options: ["(7, 5)", "(7, -5)", "(-7, 5)", "(7, 54)"], answer: 0 },
  { id: "h_tp10733", topic: "graphs", time: 221, diagram: {"type":"quadGraph","a":1,"c":-15,"h":8}, q: "Find the turning point of y = x² − 16x + 49", options: ["(8, 49)", "(8, -15)", "(8, 15)", "(-8, -15)"], answer: 1 },
  { id: "h_tp10734", topic: "graphs", time: 234, diagram: {"type":"quadGraph","a":1,"c":-11,"h":-1}, q: "Find the turning point of y = x² + 2x − 10", options: ["(-1, -11)", "(1, -11)", "(-1, 11)", "(-1, -10)"], answer: 0 },
  { id: "h_qi10735", topic: "graphs", time: 229, diagram: {"type":"quadGraph","a":1,"c":-12.25,"h":1.5,"roots":[-2,5]}, q: "Solve x² − 3x − 10 ≤ 0", options: ["2 ≤ x ≤ -5", "x ≤ -2 or x ≥ 5", "-2 ≤ x ≤ 5", "5 ≤ x ≤ -2"], answer: 2 },
  { id: "h_qi10736", topic: "graphs", time: 249, diagram: {"type":"quadGraph","a":1,"c":-25,"h":-2,"roots":[-7,3]}, q: "Solve x² + 4x − 21 ≤ 0", options: ["3 ≤ x ≤ -7", "x ≤ -7 or x ≥ 3", "-7 ≤ x ≤ 3", "7 ≤ x ≤ -3"], answer: 2 },
  { id: "h_qi10737", topic: "graphs", time: 229, diagram: {"type":"quadGraph","a":1,"c":-12.25,"h":-1.5,"roots":[-5,2]}, q: "Solve x² + 3x − 10 ≤ 0", options: ["x ≤ -5 or x ≥ 2", "-5 ≤ x ≤ 2", "5 ≤ x ≤ -2", "2 ≤ x ≤ -5"], answer: 1 },
  { id: "h_qi10738", topic: "graphs", time: 237, diagram: {"type":"quadGraph","a":1,"c":-4,"h":1,"roots":[-1,3]}, q: "Solve x² − 2x − 3 ≤ 0", options: ["x ≤ -1 or x ≥ 3", "1 ≤ x ≤ -3", "-1 ≤ x ≤ 3", "3 ≤ x ≤ -1"], answer: 2 },
  { id: "h_qi10739", topic: "graphs", time: 236, diagram: {"type":"quadGraph","a":1,"c":-20.25,"h":0.5,"roots":[-4,5]}, q: "Solve x² − x − 20 < 0", options: ["x < -4 or x > 5", "5 < x < -4", "4 < x < -5", "-4 < x < 5"], answer: 3 },
  { id: "h_tp10740", topic: "graphs", time: 234, diagram: {"type":"quadGraph","a":1,"c":6,"h":-6}, q: "Find the turning point of y = x² + 12x + 42", options: ["(6, 6)", "(-6, -6)", "(-6, 6)", "(-6, 42)"], answer: 2 },
  { id: "h_tp10741", topic: "graphs", time: 228, diagram: {"type":"quadGraph","a":1,"c":-9,"h":2}, q: "Find the turning point of y = x² − 4x − 5", options: ["(2, -5)", "(2, -9)", "(2, 9)", "(-2, -9)"], answer: 1 },
  { id: "h_qi10742", topic: "graphs", time: 250, diagram: {"type":"quadGraph","a":1,"c":-42.25,"h":-2.5,"roots":[-9,4]}, q: "Solve x² + 5x − 36 ≤ 0", options: ["x ≤ -9 or x ≥ 4", "9 ≤ x ≤ -4", "-9 ≤ x ≤ 4", "4 ≤ x ≤ -9"], answer: 2 },
  { id: "h_tp10744", topic: "graphs", time: 232, diagram: {"type":"quadGraph","a":1,"c":-8,"h":1}, q: "Find the turning point of y = x² − 2x − 7", options: ["(1, -8)", "(-1, -8)", "(1, 8)", "(1, -7)"], answer: 0 },
  { id: "h_tp10745", topic: "graphs", time: 225, diagram: {"type":"quadGraph","a":1,"c":-15,"h":5}, q: "Find the turning point of y = x² − 10x + 10", options: ["(5, 15)", "(-5, -15)", "(5, -15)", "(5, 10)"], answer: 2 },
  { id: "h_tp10746", topic: "graphs", time: 247, diagram: {"type":"quadGraph","a":1,"c":8,"h":3}, q: "Find the turning point of y = x² − 6x + 17", options: ["(3, -8)", "(3, 8)", "(3, 17)", "(-3, 8)"], answer: 1 },
  { id: "h_tp10747", topic: "graphs", time: 220, diagram: {"type":"quadGraph","a":1,"c":-8,"h":2}, q: "Find the turning point of y = x² − 4x − 4", options: ["(2, -8)", "(-2, -8)", "(2, 8)", "(2, -4)"], answer: 0 },
  { id: "h_qi10748", topic: "graphs", time: 220, diagram: {"type":"quadGraph","a":1,"c":-30.25,"h":-1.5,"roots":[-7,4]}, q: "Solve x² + 3x − 28 < 0", options: ["4 < x < -7", "x < -7 or x > 4", "7 < x < -4", "-7 < x < 4"], answer: 3 },
  // Ch rates — 50 questions (0 from real Edexcel 4MA1 past papers, 50 practice questions in the same style)
  { id: "h_tank10786", topic: "rates", time: 230, q: "A tank drains at a constant rate of 2 litres/min from 395 litres. Find the time for it to empty", options: ["197.5 min", "790 min", "0.005 min", "199.5 min"], answer: 0 },
  { id: "h_tank10787", topic: "rates", time: 200, q: "A tank drains at a constant rate of 7 litres/min from 198 litres. Find the time for it to empty", options: ["0.035 min", "28.3 min", "35.3 min", "1386 min"], answer: 1 },
  { id: "h_kin10788", topic: "rates", time: 237, q: "A particle has velocity v = 4t² − 1t (m/s). Find its acceleration when t = 2", options: ["17 m/s²", "15 m/s²", "14 m/s²", "7 m/s²"], answer: 1 },
  { id: "h_kin10789", topic: "rates", time: 220, q: "A particle has velocity v = 2t² − 5t (m/s). Find its acceleration when t = 4", options: ["3 m/s²", "21 m/s²", "11 m/s²", "12 m/s²"], answer: 2 },
  { id: "h_tank10790", topic: "rates", time: 223, q: "A tank drains at a constant rate of 3 litres/min from 348 litres. Find the time for it to empty", options: ["0.009 min", "116 min", "1044 min", "119 min"], answer: 1 },
  { id: "h_kin10791", topic: "rates", time: 242, q: "A particle has velocity v = 4t² − 4t (m/s). Find its acceleration when t = 4", options: ["48 m/s²", "28 m/s²", "12 m/s²", "36 m/s²"], answer: 1 },
  { id: "h_kin10792", topic: "rates", time: 245, q: "A particle has velocity v = 3t² − 2t (m/s). Find its acceleration when t = 6", options: ["16 m/s²", "38 m/s²", "96 m/s²", "34 m/s²"], answer: 3 },
  { id: "h_kin10793", topic: "rates", time: 225, q: "A particle has velocity v = 5t² − 2t (m/s). Find its acceleration when t = 1", options: ["4.6 m/s²", "8 m/s²", "12 m/s²", "3 m/s²"], answer: 1 },
  { id: "h_tank10794", topic: "rates", time: 229, q: "A tank drains at a constant rate of 7 litres/min from 173 litres. Find the time for it to empty", options: ["1211 min", "31.7 min", "0.04 min", "24.7 min"], answer: 3 },
  { id: "h_tank10795", topic: "rates", time: 224, q: "A tank drains at a constant rate of 7 litres/min from 206 litres. Find the time for it to empty", options: ["29.4 min", "0.034 min", "1442 min", "36.4 min"], answer: 0 },
  { id: "h_tank10796", topic: "rates", time: 220, q: "A tank drains at a constant rate of 2 litres/min from 379 litres. Find the time for it to empty", options: ["189.5 min", "758 min", "191.5 min", "0.005 min"], answer: 0 },
  { id: "h_tank10797", topic: "rates", time: 200, q: "A tank drains at a constant rate of 7 litres/min from 240 litres. Find the time for it to empty", options: ["0.029 min", "41.3 min", "34.3 min", "1680 min"], answer: 2 },
  { id: "h_tank10798", topic: "rates", time: 228, q: "A tank drains at a constant rate of 9 litres/min from 261 litres. Find the time for it to empty", options: ["2349 min", "0.034 min", "38 min", "29 min"], answer: 3 },
  { id: "h_kin10800", topic: "rates", time: 245, q: "A particle has velocity v = 5t² − 5t (m/s). Find its acceleration when t = 4", options: ["15 m/s²", "45 m/s²", "60 m/s²", "35 m/s²"], answer: 3 },
  { id: "h_kin10801", topic: "rates", time: 223, q: "A particle has velocity v = 4t² − 1t (m/s). Find its acceleration when t = 7", options: ["57 m/s²", "55 m/s²", "189 m/s²", "27 m/s²"], answer: 1 },
  { id: "h_kin10802", topic: "rates", time: 242, q: "A particle has velocity v = 3t² − 4t (m/s). Find its acceleration when t = 1", options: ["-1 m/s²", "2 m/s²", "10 m/s²", "3.2 m/s²"], answer: 1 },
  { id: "h_tank10803", topic: "rates", time: 225, q: "A tank drains at a constant rate of 5 litres/min from 227 litres. Find the time for it to empty", options: ["50.4 min", "45.4 min", "0.022 min", "1135 min"], answer: 1 },
  { id: "h_kin10804", topic: "rates", time: 223, q: "A particle has velocity v = 3t² − 4t (m/s). Find its acceleration when t = 3", options: ["5 m/s²", "22 m/s²", "15 m/s²", "14 m/s²"], answer: 3 },
  { id: "h_kin10805", topic: "rates", time: 243, q: "A particle has velocity v = 3t² − 1t (m/s). Find its acceleration when t = 2", options: ["11 m/s²", "13 m/s²", "5 m/s²", "10 m/s²"], answer: 0 },
  { id: "h_tank10806", topic: "rates", time: 208, q: "A tank drains at a constant rate of 9 litres/min from 242 litres. Find the time for it to empty", options: ["0.037 min", "2178 min", "26.9 min", "35.9 min"], answer: 2 },
  { id: "h_tank10807", topic: "rates", time: 221, q: "A tank drains at a constant rate of 8 litres/min from 269 litres. Find the time for it to empty", options: ["33.6 min", "0.03 min", "41.6 min", "2152 min"], answer: 0 },
  { id: "h_tank10808", topic: "rates", time: 202, q: "A tank drains at a constant rate of 5 litres/min from 356 litres. Find the time for it to empty", options: ["1780 min", "0.014 min", "71.2 min", "76.2 min"], answer: 2 },
  { id: "h_tank10809", topic: "rates", time: 214, q: "A tank drains at a constant rate of 4 litres/min from 390 litres. Find the time for it to empty", options: ["101.5 min", "1560 min", "0.01 min", "97.5 min"], answer: 3 },
  { id: "h_tank10810", topic: "rates", time: 223, q: "A tank drains at a constant rate of 10 litres/min from 119 litres. Find the time for it to empty", options: ["1190 min", "21.9 min", "11.9 min", "0.084 min"], answer: 2 },
  { id: "h_kin10811", topic: "rates", time: 235, q: "A particle has velocity v = 3t² − 1t (m/s). Find its acceleration when t = 8", options: ["184 m/s²", "47 m/s²", "23 m/s²", "49 m/s²"], answer: 1 },
  { id: "h_tank10812", topic: "rates", time: 216, q: "A tank drains at a constant rate of 9 litres/min from 334 litres. Find the time for it to empty", options: ["3006 min", "46.1 min", "37.1 min", "0.027 min"], answer: 2 },
  { id: "h_tank10813", topic: "rates", time: 224, q: "A tank drains at a constant rate of 2 litres/min from 274 litres. Find the time for it to empty", options: ["139 min", "0.007 min", "137 min", "548 min"], answer: 2 },
  { id: "h_kin10814", topic: "rates", time: 232, q: "A particle has velocity v = 4t² − 6t (m/s). Find its acceleration when t = 8", options: ["26 m/s²", "58 m/s²", "208 m/s²", "70 m/s²"], answer: 1 },
  { id: "h_tank10815", topic: "rates", time: 210, q: "A tank drains at a constant rate of 4 litres/min from 126 litres. Find the time for it to empty", options: ["35.5 min", "0.032 min", "31.5 min", "504 min"], answer: 2 },
  { id: "h_kin10816", topic: "rates", time: 229, q: "A particle has velocity v = 3t² − 3t (m/s). Find its acceleration when t = 8", options: ["51 m/s²", "168 m/s²", "21 m/s²", "45 m/s²"], answer: 3 },
  { id: "h_tank10817", topic: "rates", time: 207, q: "A tank drains at a constant rate of 3 litres/min from 219 litres. Find the time for it to empty", options: ["76 min", "73 min", "0.014 min", "657 min"], answer: 1 },
  { id: "h_kin10818", topic: "rates", time: 225, q: "A particle has velocity v = 4t² − 2t (m/s). Find its acceleration when t = 2", options: ["12 m/s²", "6 m/s²", "18 m/s²", "14 m/s²"], answer: 3 },
  { id: "h_kin10819", topic: "rates", time: 245, q: "A particle has velocity v = 5t² − 6t (m/s). Find its acceleration when t = 4", options: ["46 m/s²", "34 m/s²", "14 m/s²", "56 m/s²"], answer: 1 },
  { id: "h_tank10820", topic: "rates", time: 228, q: "A tank drains at a constant rate of 8 litres/min from 127 litres. Find the time for it to empty", options: ["0.063 min", "1016 min", "23.9 min", "15.9 min"], answer: 3 },
  { id: "h_tank10821", topic: "rates", time: 218, q: "A tank drains at a constant rate of 8 litres/min from 354 litres. Find the time for it to empty", options: ["52.3 min", "2832 min", "44.3 min", "0.023 min"], answer: 2 },
  { id: "h_tank10822", topic: "rates", time: 202, q: "A tank drains at a constant rate of 2 litres/min from 126 litres. Find the time for it to empty", options: ["63 min", "65 min", "0.016 min", "252 min"], answer: 0 },
  { id: "h_kin10823", topic: "rates", time: 229, q: "A particle has velocity v = 2t² − 2t (m/s). Find its acceleration when t = 4", options: ["18 m/s²", "24 m/s²", "14 m/s²", "6 m/s²"], answer: 2 },
  { id: "h_kin10825", topic: "rates", time: 244, q: "A particle has velocity v = 2t² − 4t (m/s). Find its acceleration when t = 4", options: ["20 m/s²", "16 m/s²", "4 m/s²", "12 m/s²"], answer: 3 },
  { id: "h_kin10826", topic: "rates", time: 233, q: "A particle has velocity v = 2t² − 1t (m/s). Find its acceleration when t = 3", options: ["13 m/s²", "15 m/s²", "5 m/s²", "11 m/s²"], answer: 3 },
  { id: "h_tank10828", topic: "rates", time: 206, q: "A tank drains at a constant rate of 2 litres/min from 357 litres. Find the time for it to empty", options: ["714 min", "180.5 min", "0.006 min", "178.5 min"], answer: 3 },
  { id: "h_kin10829", topic: "rates", time: 238, q: "A particle has velocity v = 5t² − 2t (m/s). Find its acceleration when t = 2", options: ["18 m/s²", "8 m/s²", "22 m/s²", "16 m/s²"], answer: 0 },
  { id: "h_tank10830", topic: "rates", time: 201, q: "A tank drains at a constant rate of 6 litres/min from 113 litres. Find the time for it to empty", options: ["0.053 min", "18.8 min", "678 min", "24.8 min"], answer: 1 },
  { id: "h_tank10831", topic: "rates", time: 229, q: "A tank drains at a constant rate of 4 litres/min from 112 litres. Find the time for it to empty", options: ["32 min", "28 min", "448 min", "0.036 min"], answer: 1 },
  { id: "h_tank10832", topic: "rates", time: 209, q: "A tank drains at a constant rate of 8 litres/min from 273 litres. Find the time for it to empty", options: ["34.1 min", "0.029 min", "42.1 min", "2184 min"], answer: 0 },
  { id: "h_kin10833", topic: "rates", time: 245, q: "A particle has velocity v = 3t² − 5t (m/s). Find its acceleration when t = 8", options: ["43 m/s²", "19 m/s²", "53 m/s²", "152 m/s²"], answer: 0 },
  { id: "h_tank10834", topic: "rates", time: 208, q: "A tank drains at a constant rate of 4 litres/min from 398 litres. Find the time for it to empty", options: ["1592 min", "99.5 min", "103.5 min", "0.01 min"], answer: 1 },
  { id: "h_kin10835", topic: "rates", time: 247, q: "A particle has velocity v = 2t² − 4t (m/s). Find its acceleration when t = 2", options: ["12 m/s²", "5.6 m/s²", "0 m/s²", "4 m/s²"], answer: 3 },
  { id: "h_kin10836", topic: "rates", time: 249, q: "A particle has velocity v = 2t² − 6t (m/s). Find its acceleration when t = 7", options: ["56 m/s²", "8 m/s²", "22 m/s²", "34 m/s²"], answer: 2 },
  { id: "h_tank10837", topic: "rates", time: 214, q: "A tank drains at a constant rate of 4 litres/min from 357 litres. Find the time for it to empty", options: ["89.3 min", "93.3 min", "0.011 min", "1428 min"], answer: 0 },
  { id: "h_kin10838", topic: "rates", time: 233, q: "A particle has velocity v = 2t² − 3t (m/s). Find its acceleration when t = 7", options: ["77 m/s²", "11 m/s²", "25 m/s²", "31 m/s²"], answer: 2 },
  // Ch sets — 50 questions (0 from real Edexcel 4MA1 past papers, 50 practice questions in the same style)
  { id: "h_setc10869", topic: "sets", time: 217, diagram: {"type":"venn2Counts","aOnly":9,"bOnly":28,"both":10,"outside":-1,"labelA":"A","labelB":"B"}, q: "n(ξ) = 46, n(A) = 19, n(B) = 38, n(A ∩ B) = 10. Find the number in neither A nor B", options: ["-1", "-11", "47", "57"], answer: 0 },
  { id: "h_setc10870", topic: "sets", time: 206, diagram: {"type":"venn2Counts","aOnly":14,"bOnly":20,"both":12,"outside":41,"labelA":"A","labelB":"B"}, q: "n(ξ) = 87, n(A) = 26, n(B) = 32, n(A ∩ B) = 12. Find n(A ∪ B)", options: ["41", "58", "29", "46"], answer: 3 },
  { id: "h_setc10871", topic: "sets", time: 209, diagram: {"type":"venn2Counts","aOnly":15,"bOnly":26,"both":9,"outside":19,"labelA":"A","labelB":"B"}, q: "n(ξ) = 69, n(A) = 24, n(B) = 35, n(A ∩ B) = 9. Find n(A ∪ B)", options: ["50", "19", "10", "59"], answer: 0 },
  { id: "h_setc10872", topic: "sets", time: 224, diagram: {"type":"venn2Counts","aOnly":21,"bOnly":9,"both":17,"outside":-3,"labelA":"A","labelB":"B"}, q: "n(ξ) = 44, n(A) = 38, n(B) = 26, n(A ∩ B) = 17. Find the number in neither A nor B", options: ["64", "-20", "47", "-3"], answer: 3 },
  { id: "h_setc10873", topic: "sets", time: 220, diagram: {"type":"venn2Counts","aOnly":14,"bOnly":2,"both":20,"outside":40,"labelA":"A","labelB":"B"}, q: "n(ξ) = 76, n(A) = 34, n(B) = 22, n(A ∩ B) = 20. Find the number in neither A nor B", options: ["40", "36", "56", "20"], answer: 0 },
  { id: "h_setc10874", topic: "sets", time: 212, diagram: {"type":"venn2Counts","aOnly":1,"bOnly":2,"both":17,"outside":77,"labelA":"A","labelB":"B"}, q: "n(ξ) = 97, n(A) = 18, n(B) = 19, n(A ∩ B) = 17. Find n(A ∪ B)", options: ["60", "77", "37", "20"], answer: 3 },
  { id: "h_setc10875", topic: "sets", time: 214, diagram: {"type":"venn2Counts","aOnly":6,"bOnly":19,"both":9,"outside":23,"labelA":"A","labelB":"B"}, q: "n(ξ) = 57, n(A) = 15, n(B) = 28, n(A ∩ B) = 9. Find n(A ∪ B)", options: ["34", "14", "23", "43"], answer: 0 },
  { id: "h_setc10876", topic: "sets", time: 204, diagram: {"type":"venn2Counts","aOnly":12,"bOnly":13,"both":23,"outside":-3,"labelA":"A","labelB":"B"}, q: "n(ξ) = 45, n(A) = 35, n(B) = 36, n(A ∩ B) = 23. Find n(A ∪ B)", options: ["-26", "48", "71", "-3"], answer: 1 },
  { id: "h_setc10877", topic: "sets", time: 209, diagram: {"type":"venn2Counts","aOnly":22,"bOnly":17,"both":5,"outside":47,"labelA":"A","labelB":"B"}, q: "n(ξ) = 91, n(A) = 27, n(B) = 22, n(A ∩ B) = 5. Find the number in neither A nor B", options: ["42", "44", "49", "47"], answer: 3 },
  { id: "h_setc10878", topic: "sets", time: 210, diagram: {"type":"venn2Counts","aOnly":13,"bOnly":14,"both":21,"outside":42,"labelA":"A","labelB":"B"}, q: "n(ξ) = 90, n(A) = 34, n(B) = 35, n(A ∩ B) = 21. Find the number in neither A nor B", options: ["21", "69", "48", "42"], answer: 3 },
  { id: "h_setc10879", topic: "sets", time: 215, diagram: {"type":"venn2Counts","aOnly":17,"bOnly":24,"both":9,"outside":6,"labelA":"A","labelB":"B"}, q: "n(ξ) = 56, n(A) = 26, n(B) = 33, n(A ∩ B) = 9. Find the number in neither A nor B", options: ["59", "50", "6", "-3"], answer: 2 },
  { id: "h_setc10880", topic: "sets", time: 209, diagram: {"type":"venn2Counts","aOnly":1,"bOnly":3,"both":35,"outside":43,"labelA":"A","labelB":"B"}, q: "n(ξ) = 82, n(A) = 36, n(B) = 38, n(A ∩ B) = 35. Find n(A ∪ B)", options: ["74", "43", "39", "8"], answer: 2 },
  { id: "h_setc10881", topic: "sets", time: 203, diagram: {"type":"venn2Counts","aOnly":8,"bOnly":5,"both":15,"outside":63,"labelA":"A","labelB":"B"}, q: "n(ξ) = 91, n(A) = 23, n(B) = 20, n(A ∩ B) = 15. Find n(A ∪ B)", options: ["28", "43", "63", "48"], answer: 0 },
  { id: "h_setc10882", topic: "sets", time: 224, diagram: {"type":"venn2Counts","aOnly":21,"bOnly":23,"both":7,"outside":40,"labelA":"A","labelB":"B"}, q: "n(ξ) = 91, n(A) = 28, n(B) = 30, n(A ∩ B) = 7. Find the number in neither A nor B", options: ["33", "58", "51", "40"], answer: 3 },
  { id: "h_setc10883", topic: "sets", time: 205, diagram: {"type":"venn2Counts","aOnly":22,"bOnly":4,"both":15,"outside":23,"labelA":"A","labelB":"B"}, q: "n(ξ) = 64, n(A) = 37, n(B) = 19, n(A ∩ B) = 15. Find the number in neither A nor B", options: ["8", "56", "41", "23"], answer: 3 },
  { id: "h_setc10884", topic: "sets", time: 228, diagram: {"type":"venn2Counts","aOnly":15,"bOnly":28,"both":7,"outside":24,"labelA":"A","labelB":"B"}, q: "n(ξ) = 74, n(A) = 22, n(B) = 35, n(A ∩ B) = 7. Find the number in neither A nor B", options: ["50", "24", "57", "17"], answer: 1 },
  { id: "h_setc10885", topic: "sets", time: 217, diagram: {"type":"venn2Counts","aOnly":14,"bOnly":20,"both":16,"outside":24,"labelA":"A","labelB":"B"}, q: "n(ξ) = 74, n(A) = 30, n(B) = 36, n(A ∩ B) = 16. Find n(A ∪ B)", options: ["66", "8", "24", "50"], answer: 3 },
  { id: "h_setc10886", topic: "sets", time: 226, diagram: {"type":"venn2Counts","aOnly":11,"bOnly":24,"both":8,"outside":39,"labelA":"A","labelB":"B"}, q: "n(ξ) = 82, n(A) = 19, n(B) = 32, n(A ∩ B) = 8. Find the number in neither A nor B", options: ["43", "31", "39", "51"], answer: 2 },
  { id: "h_setc10887", topic: "sets", time: 212, diagram: {"type":"venn2Counts","aOnly":8,"bOnly":7,"both":17,"outside":62,"labelA":"A","labelB":"B"}, q: "n(ξ) = 94, n(A) = 25, n(B) = 24, n(A ∩ B) = 17. Find the number in neither A nor B", options: ["45", "32", "62", "49"], answer: 2 },
  { id: "h_setc10888", topic: "sets", time: 220, diagram: {"type":"venn2Counts","aOnly":22,"bOnly":34,"both":6,"outside":36,"labelA":"A","labelB":"B"}, q: "n(ξ) = 98, n(A) = 28, n(B) = 40, n(A ∩ B) = 6. Find the number in neither A nor B", options: ["36", "68", "30", "62"], answer: 0 },
  { id: "h_setc10889", topic: "sets", time: 201, diagram: {"type":"venn2Counts","aOnly":16,"bOnly":16,"both":13,"outside":0,"labelA":"A","labelB":"B"}, q: "n(ξ) = 45, n(A) = 29, n(B) = 29, n(A ∩ B) = 13. Find the number in neither A nor B", options: ["-13", "58", "45", "0"], answer: 3 },
  { id: "h_setc10890", topic: "sets", time: 205, diagram: {"type":"venn2Counts","aOnly":15,"bOnly":4,"both":25,"outside":4,"labelA":"A","labelB":"B"}, q: "n(ξ) = 48, n(A) = 40, n(B) = 29, n(A ∩ B) = 25. Find the number in neither A nor B", options: ["-21", "4", "44", "69"], answer: 1 },
  { id: "h_setc10891", topic: "sets", time: 212, diagram: {"type":"venn2Counts","aOnly":16,"bOnly":13,"both":7,"outside":17,"labelA":"A","labelB":"B"}, q: "n(ξ) = 53, n(A) = 23, n(B) = 20, n(A ∩ B) = 7. Find n(A ∪ B)", options: ["43", "10", "17", "36"], answer: 3 },
  { id: "h_setc10892", topic: "sets", time: 220, diagram: {"type":"venn2Counts","aOnly":21,"bOnly":2,"both":13,"outside":33,"labelA":"A","labelB":"B"}, q: "n(ξ) = 69, n(A) = 34, n(B) = 15, n(A ∩ B) = 13. Find n(A ∪ B)", options: ["20", "36", "33", "49"], answer: 1 },
  { id: "h_setc10893", topic: "sets", time: 200, diagram: {"type":"venn2Counts","aOnly":24,"bOnly":4,"both":15,"outside":42,"labelA":"A","labelB":"B"}, q: "n(ξ) = 85, n(A) = 39, n(B) = 19, n(A ∩ B) = 15. Find n(A ∪ B)", options: ["58", "43", "27", "42"], answer: 1 },
  { id: "h_setc10894", topic: "sets", time: 226, diagram: {"type":"venn2Counts","aOnly":7,"bOnly":5,"both":10,"outside":54,"labelA":"A","labelB":"B"}, q: "n(ξ) = 76, n(A) = 17, n(B) = 15, n(A ∩ B) = 10. Find the number in neither A nor B", options: ["44", "22", "54", "32"], answer: 2 },
  { id: "h_setc10895", topic: "sets", time: 201, diagram: {"type":"venn2Counts","aOnly":1,"bOnly":7,"both":19,"outside":61,"labelA":"A","labelB":"B"}, q: "n(ξ) = 88, n(A) = 20, n(B) = 26, n(A ∩ B) = 19. Find n(A ∪ B)", options: ["46", "27", "42", "61"], answer: 1 },
  { id: "h_setc10896", topic: "sets", time: 206, diagram: {"type":"venn2Counts","aOnly":15,"bOnly":8,"both":20,"outside":49,"labelA":"A","labelB":"B"}, q: "n(ξ) = 92, n(A) = 35, n(B) = 28, n(A ∩ B) = 20. Find n(A ∪ B)", options: ["43", "63", "29", "49"], answer: 0 },
  { id: "h_setc10897", topic: "sets", time: 201, diagram: {"type":"venn2Counts","aOnly":5,"bOnly":14,"both":25,"outside":24,"labelA":"A","labelB":"B"}, q: "n(ξ) = 68, n(A) = 30, n(B) = 39, n(A ∩ B) = 25. Find the number in neither A nor B", options: ["24", "69", "44", "-1"], answer: 0 },
  { id: "h_setc10898", topic: "sets", time: 227, diagram: {"type":"venn2Counts","aOnly":18,"bOnly":28,"both":10,"outside":4,"labelA":"A","labelB":"B"}, q: "n(ξ) = 60, n(A) = 28, n(B) = 38, n(A ∩ B) = 10. Find the number in neither A nor B", options: ["4", "56", "-6", "66"], answer: 0 },
  { id: "h_setc10899", topic: "sets", time: 202, diagram: {"type":"venn2Counts","aOnly":2,"bOnly":2,"both":37,"outside":13,"labelA":"A","labelB":"B"}, q: "n(ξ) = 54, n(A) = 39, n(B) = 39, n(A ∩ B) = 37. Find the number in neither A nor B", options: ["78", "13", "-24", "41"], answer: 1 },
  { id: "h_setc10900", topic: "sets", time: 219, diagram: {"type":"venn2Counts","aOnly":17,"bOnly":9,"both":22,"outside":24,"labelA":"A","labelB":"B"}, q: "n(ξ) = 72, n(A) = 39, n(B) = 31, n(A ∩ B) = 22. Find the number in neither A nor B", options: ["2", "24", "48", "70"], answer: 1 },
  { id: "h_setc10901", topic: "sets", time: 216, diagram: {"type":"venn2Counts","aOnly":10,"bOnly":18,"both":11,"outside":43,"labelA":"A","labelB":"B"}, q: "n(ξ) = 82, n(A) = 21, n(B) = 29, n(A ∩ B) = 11. Find n(A ∪ B)", options: ["43", "32", "39", "50"], answer: 2 },
  { id: "h_setc10902", topic: "sets", time: 230, diagram: {"type":"venn2Counts","aOnly":4,"bOnly":10,"both":14,"outside":32,"labelA":"A","labelB":"B"}, q: "n(ξ) = 60, n(A) = 18, n(B) = 24, n(A ∩ B) = 14. Find n(A ∪ B)", options: ["42", "32", "28", "18"], answer: 2 },
  { id: "h_setc10903", topic: "sets", time: 201, diagram: {"type":"venn2Counts","aOnly":19,"bOnly":4,"both":20,"outside":41,"labelA":"A","labelB":"B"}, q: "n(ξ) = 84, n(A) = 39, n(B) = 24, n(A ∩ B) = 20. Find the number in neither A nor B", options: ["63", "41", "21", "43"], answer: 1 },
  { id: "h_setc10904", topic: "sets", time: 209, diagram: {"type":"venn2Counts","aOnly":3,"bOnly":8,"both":31,"outside":34,"labelA":"A","labelB":"B"}, q: "n(ξ) = 76, n(A) = 34, n(B) = 39, n(A ∩ B) = 31. Find the number in neither A nor B", options: ["42", "73", "34", "3"], answer: 2 },
  { id: "h_setc10905", topic: "sets", time: 230, diagram: {"type":"venn2Counts","aOnly":9,"bOnly":2,"both":26,"outside":49,"labelA":"A","labelB":"B"}, q: "n(ξ) = 86, n(A) = 35, n(B) = 28, n(A ∩ B) = 26. Find n(A ∪ B)", options: ["49", "23", "63", "37"], answer: 3 },
  { id: "h_setc10906", topic: "sets", time: 213, diagram: {"type":"venn2Counts","aOnly":4,"bOnly":21,"both":11,"outside":45,"labelA":"A","labelB":"B"}, q: "n(ξ) = 81, n(A) = 15, n(B) = 32, n(A ∩ B) = 11. Find n(A ∪ B)", options: ["47", "36", "34", "45"], answer: 1 },
  { id: "h_setc10907", topic: "sets", time: 212, diagram: {"type":"venn2Counts","aOnly":13,"bOnly":8,"both":20,"outside":57,"labelA":"A","labelB":"B"}, q: "n(ξ) = 98, n(A) = 33, n(B) = 28, n(A ∩ B) = 20. Find n(A ∪ B)", options: ["57", "41", "61", "37"], answer: 1 },
  { id: "h_setc10908", topic: "sets", time: 224, diagram: {"type":"venn2Counts","aOnly":13,"bOnly":11,"both":24,"outside":42,"labelA":"A","labelB":"B"}, q: "n(ξ) = 90, n(A) = 37, n(B) = 35, n(A ∩ B) = 24. Find the number in neither A nor B", options: ["18", "48", "42", "72"], answer: 2 },
  { id: "h_setc10909", topic: "sets", time: 209, diagram: {"type":"venn2Counts","aOnly":4,"bOnly":10,"both":19,"outside":15,"labelA":"A","labelB":"B"}, q: "n(ξ) = 48, n(A) = 23, n(B) = 29, n(A ∩ B) = 19. Find the number in neither A nor B", options: ["52", "15", "-4", "33"], answer: 1 },
  { id: "h_setc10910", topic: "sets", time: 201, diagram: {"type":"venn2Counts","aOnly":21,"bOnly":16,"both":15,"outside":34,"labelA":"A","labelB":"B"}, q: "n(ξ) = 86, n(A) = 36, n(B) = 31, n(A ∩ B) = 15. Find n(A ∪ B)", options: ["34", "67", "19", "52"], answer: 3 },
  { id: "h_setc10911", topic: "sets", time: 230, diagram: {"type":"venn2Counts","aOnly":21,"bOnly":20,"both":18,"outside":-18,"labelA":"A","labelB":"B"}, q: "n(ξ) = 41, n(A) = 39, n(B) = 38, n(A ∩ B) = 18. Find n(A ∪ B)", options: ["77", "-18", "-36", "59"], answer: 3 },
  { id: "h_setc10912", topic: "sets", time: 227, diagram: {"type":"venn2Counts","aOnly":20,"bOnly":3,"both":15,"outside":26,"labelA":"A","labelB":"B"}, q: "n(ξ) = 64, n(A) = 35, n(B) = 18, n(A ∩ B) = 15. Find the number in neither A nor B", options: ["26", "11", "53", "38"], answer: 0 },
  { id: "h_setc10913", topic: "sets", time: 210, diagram: {"type":"venn2Counts","aOnly":28,"bOnly":21,"both":11,"outside":8,"labelA":"A","labelB":"B"}, q: "n(ξ) = 68, n(A) = 39, n(B) = 32, n(A ∩ B) = 11. Find n(A ∪ B)", options: ["71", "-3", "8", "60"], answer: 3 },
  { id: "h_setc10914", topic: "sets", time: 202, diagram: {"type":"venn2Counts","aOnly":10,"bOnly":10,"both":20,"outside":21,"labelA":"A","labelB":"B"}, q: "n(ξ) = 61, n(A) = 30, n(B) = 30, n(A ∩ B) = 20. Find n(A ∪ B)", options: ["60", "40", "1", "21"], answer: 1 },
  { id: "h_setc10915", topic: "sets", time: 200, diagram: {"type":"venn2Counts","aOnly":26,"bOnly":13,"both":7,"outside":36,"labelA":"A","labelB":"B"}, q: "n(ξ) = 82, n(A) = 33, n(B) = 20, n(A ∩ B) = 7. Find the number in neither A nor B", options: ["29", "46", "53", "36"], answer: 3 },
  { id: "h_setc10916", topic: "sets", time: 225, diagram: {"type":"venn2Counts","aOnly":3,"bOnly":10,"both":19,"outside":62,"labelA":"A","labelB":"B"}, q: "n(ξ) = 94, n(A) = 22, n(B) = 29, n(A ∩ B) = 19. Find the number in neither A nor B", options: ["43", "51", "32", "62"], answer: 3 },
  { id: "h_setc10917", topic: "sets", time: 209, diagram: {"type":"venn2Counts","aOnly":21,"bOnly":1,"both":17,"outside":16,"labelA":"A","labelB":"B"}, q: "n(ξ) = 55, n(A) = 38, n(B) = 18, n(A ∩ B) = 17. Find the number in neither A nor B", options: ["39", "56", "-1", "16"], answer: 3 },
  { id: "h_setc10918", topic: "sets", time: 212, diagram: {"type":"venn2Counts","aOnly":24,"bOnly":23,"both":16,"outside":-1,"labelA":"A","labelB":"B"}, q: "n(ξ) = 62, n(A) = 40, n(B) = 39, n(A ∩ B) = 16. Find n(A ∪ B)", options: ["63", "-1", "79", "-17"], answer: 0 },
  // Ch trig — 50 questions (3 from real Edexcel 4MA1 past papers, 47 practice questions in the same style)
  { id: "tr1", topic: "trig", ref: "June 2026 1H Q16", time: 230, diagram: {"type":"triangleSAS","sideB":"25","sideC":"73","angleA":65}, q: "Triangle ABC: AB = 25, AC = 73, angle A = 65°. Find BC, to 3 s.f. (cosine rule)", options: ["66.4", "58.2", "70.1", "48.9"], answer: 0 },
  { id: "tr2", topic: "trig", ref: "June 2026 1H Q16", time: 220, diagram: {"type":"triangleSAS","sideB":"25","sideC":"73","angleA":65}, q: "Using the same triangle (AB=25, AC=73, angle A=65°), find its area, to 3 s.f.", options: ["827 cm²", "913 cm²", "1655 cm²", "450 cm²"], answer: 0 },
  { id: "tr3", topic: "trig", ref: "Nov 2025 1H Q19", time: 220, diagram: {"type":"triangleSSS","sideAB":"8","sideBC":"10","sideCA":"9"}, q: "Triangle ABC: AB = 8, BC = 10, CA = 9. Find angle BAC, to 1 d.p. (cosine rule)", options: ["71.8°", "56.3°", "63.9°", "82.4°"], answer: 0 },
  { id: "h_cosa10949", topic: "trig", time: 227, diagram: {"type":"triangleSSS","sideAB":"8","sideBC":"10","sideCA":"13"}, q: "Triangle ABC: AB = 8, BC = 10, CA = 13. Find angle BAC, correct to 1 d.p.", options: ["38°", "48°", "19°", "142°"], answer: 0 },
  { id: "h_area_sas10950", topic: "trig", time: 216, diagram: {"type":"triangleSAS","sideB":"21 cm","sideC":"8 cm","angleA":65}, q: "Triangle ABC: AB = 21 cm, AC = 8 cm, angle A = 65°. Find its area, correct to 3 s.f.", options: ["84 cm²", "76.1 cm²", "35.5 cm²", "152.3 cm²"], answer: 1 },
  { id: "h_bearadv10951", topic: "trig", time: 234, diagram: {"type":"bearing","bearingDeg":90,"dist":"32 km"}, q: "A ship sails on a bearing of 090° for 32 km. Find how far south of its start it now is, correct to 1 d.p.", options: ["0 km", "32 km", "2 km", "-2 km"], answer: 0 },
  { id: "h_bearadv10952", topic: "trig", time: 223, diagram: {"type":"bearing","bearingDeg":102,"dist":"14 km"}, q: "A ship sails on a bearing of 102° for 14 km. Find how far east of its start it now is, correct to 1 d.p.", options: ["13.7 km", "14 km", "2.9 km", "15.7 km"], answer: 0 },
  { id: "h_cosr10953", topic: "trig", time: 230, diagram: {"type":"triangleSAS","sideB":"19","sideC":"20","angleA":95}, q: "Triangle ABC: AB = 19, AC = 20, angle A = 95°. Find BC, correct to 3 s.f. (cosine rule)", options: ["42.4", "27.6", "31.8", "28.8"], answer: 3 },
  { id: "h_cosr10954", topic: "trig", time: 240, diagram: {"type":"triangleSAS","sideB":"18","sideC":"17","angleA":70}, q: "Triangle ABC: AB = 18, AC = 17, angle A = 70°. Find BC, correct to 3 s.f. (cosine rule)", options: ["23.1", "20.1", "24.8", "23"], answer: 1 },
  { id: "h_bearadv10956", topic: "trig", time: 228, diagram: {"type":"bearing","bearingDeg":130,"dist":"47 km"}, q: "A ship sails on a bearing of 130° for 47 km. Find how far south of its start it now is, correct to 1 d.p.", options: ["32.2 km", "47 km", "30.2 km", "36 km"], answer: 2 },
  { id: "h_area_sas10957", topic: "trig", time: 227, diagram: {"type":"triangleSAS","sideB":"5 cm","sideC":"18 cm","angleA":30}, q: "Triangle ABC: AB = 5 cm, AC = 18 cm, angle A = 30°. Find its area, correct to 3 s.f.", options: ["39 cm²", "19 cm²", "45 cm²", "22.5 cm²"], answer: 3 },
  { id: "h_cosa10958", topic: "trig", time: 247, diagram: {"type":"triangleSSS","sideAB":"7","sideBC":"8","sideCA":"9"}, q: "Triangle ABC: AB = 7, BC = 8, CA = 9. Find angle BAC, correct to 1 d.p.", options: ["48.2°", "131.8°", "58.2°", "24.1°"], answer: 0 },
  { id: "h_cosa10959", topic: "trig", time: 238, diagram: {"type":"triangleSSS","sideAB":"5","sideBC":"7","sideCA":"9"}, q: "Triangle ABC: AB = 5, BC = 7, CA = 9. Find angle BAC, correct to 1 d.p.", options: ["33.6°", "43.6°", "16.8°", "146.4°"], answer: 0 },
  { id: "h_area_sas10960", topic: "trig", time: 222, diagram: {"type":"triangleSAS","sideB":"21 cm","sideC":"17 cm","angleA":45}, q: "Triangle ABC: AB = 21 cm, AC = 17 cm, angle A = 45°. Find its area, correct to 3 s.f.", options: ["150.44 cm²", "252.4 cm²", "126.2 cm²", "178.5 cm²"], answer: 2 },
  { id: "h_bearadv10961", topic: "trig", time: 232, diagram: {"type":"bearing","bearingDeg":102,"dist":"19 km"}, q: "A ship sails on a bearing of 102° for 19 km. Find how far east of its start it now is, correct to 1 d.p.", options: ["19 km", "20.6 km", "18.6 km", "4 km"], answer: 2 },
  { id: "h_bearadv10962", topic: "trig", time: 223, diagram: {"type":"bearing","bearingDeg":146,"dist":"46 km"}, q: "A ship sails on a bearing of 146° for 46 km. Find how far south of its start it now is, correct to 1 d.p.", options: ["40.1 km", "38.1 km", "25.7 km", "46 km"], answer: 1 },
  { id: "h_area_sas10963", topic: "trig", time: 223, diagram: {"type":"triangleSAS","sideB":"25 cm","sideC":"12 cm","angleA":45}, q: "Triangle ABC: AB = 25 cm, AC = 12 cm, angle A = 45°. Find its area, correct to 3 s.f.", options: ["97.49 cm²", "212.1 cm²", "106.1 cm²", "150 cm²"], answer: 2 },
  { id: "h_bearadv10965", topic: "trig", time: 229, diagram: {"type":"bearing","bearingDeg":56,"dist":"51 km"}, q: "A ship sails on a bearing of 056° for 51 km. Find how far south of its start it now is, correct to 1 d.p.", options: ["28.5 km", "30.5 km", "42.3 km", "51 km"], answer: 0 },
  { id: "h_area_sas10966", topic: "trig", time: 228, diagram: {"type":"triangleSAS","sideB":"12 cm","sideC":"5 cm","angleA":80}, q: "Triangle ABC: AB = 12 cm, AC = 5 cm, angle A = 80°. Find its area, correct to 3 s.f.", options: ["59.1 cm²", "30 cm²", "29.5 cm²", "5.2 cm²"], answer: 2 },
  { id: "h_area_sas10967", topic: "trig", time: 229, diagram: {"type":"triangleSAS","sideB":"17 cm","sideC":"6 cm","angleA":75}, q: "Triangle ABC: AB = 17 cm, AC = 6 cm, angle A = 75°. Find its area, correct to 3 s.f.", options: ["49.3 cm²", "98.5 cm²", "13.2 cm²", "51 cm²"], answer: 0 },
  { id: "h_cosr10968", topic: "trig", time: 244, diagram: {"type":"triangleSAS","sideB":"7","sideC":"24","angleA":45}, q: "Triangle ABC: AB = 7, AC = 24, angle A = 45°. Find BC, correct to 3 s.f. (cosine rule)", options: ["22.7", "25", "12.7", "19.7"], answer: 3 },
  { id: "h_cosr10969", topic: "trig", time: 223, diagram: {"type":"triangleSAS","sideB":"28","sideC":"18","angleA":50}, q: "Triangle ABC: AB = 28, AC = 18, angle A = 50°. Find BC, correct to 3 s.f. (cosine rule)", options: ["17.1", "24.4", "21.4", "33.3"], answer: 2 },
  { id: "h_cosa10970", topic: "trig", time: 244, diagram: {"type":"triangleSSS","sideAB":"6","sideBC":"8","sideCA":"11"}, q: "Triangle ABC: AB = 6, BC = 8, CA = 11. Find angle BAC, correct to 1 d.p.", options: ["32.2°", "147.8°", "16.1°", "42.2°"], answer: 0 },
  { id: "h_bearadv10971", topic: "trig", time: 224, diagram: {"type":"bearing","bearingDeg":49,"dist":"41 km"}, q: "A ship sails on a bearing of 049° for 41 km. Find how far east of its start it now is, correct to 1 d.p.", options: ["32.9 km", "30.9 km", "41 km", "26.9 km"], answer: 1 },
  { id: "h_sinr10972", topic: "trig", time: 240, diagram: {"type":"triangleASA","angleA":45,"angleB":80,"sideA":"8 cm"}, q: "Triangle: angle A = 45°, angle B = 80°, side a = 8 cm. Find side b, correct to 3 s.f. (sine rule)", options: ["11.14 cm", "5.74 cm", "7.88 cm", "13.14 cm"], answer: 0 },
  { id: "h_sinr10973", topic: "trig", time: 223, diagram: {"type":"triangleASA","angleA":30,"angleB":75,"sideA":"8 cm"}, q: "Triangle: angle A = 30°, angle B = 75°, side a = 8 cm. Find side b, correct to 3 s.f. (sine rule)", options: ["7.73 cm", "4.14 cm", "17.45 cm", "15.45 cm"], answer: 3 },
  { id: "h_cosa10974", topic: "trig", time: 237, diagram: {"type":"triangleSSS","sideAB":"9","sideBC":"11","sideCA":"14"}, q: "Triangle ABC: AB = 9, BC = 11, CA = 14. Find angle BAC, correct to 1 d.p.", options: ["140°", "20°", "50°", "40°"], answer: 3 },
  { id: "h_cosr10976", topic: "trig", time: 250, diagram: {"type":"triangleSAS","sideB":"21","sideC":"16","angleA":110}, q: "Triangle ABC: AB = 21, AC = 16, angle A = 110°. Find BC, correct to 3 s.f. (cosine rule)", options: ["30.4", "49.5", "33.4", "26.4"], answer: 0 },
  { id: "h_area_sas10977", topic: "trig", time: 231, diagram: {"type":"triangleSAS","sideB":"20 cm","sideC":"22 cm","angleA":30}, q: "Triangle ABC: AB = 20 cm, AC = 22 cm, angle A = 30°. Find its area, correct to 3 s.f.", options: ["110 cm²", "134 cm²", "190.5 cm²", "220 cm²"], answer: 0 },
  { id: "h_cosr10978", topic: "trig", time: 231, diagram: {"type":"triangleSAS","sideB":"26","sideC":"16","angleA":100}, q: "Triangle ABC: AB = 26, AC = 16, angle A = 100°. Find BC, correct to 3 s.f. (cosine rule)", options: ["49.1", "35.8", "30.5", "32.8"], answer: 3 },
  { id: "h_area_sas10980", topic: "trig", time: 226, diagram: {"type":"triangleSAS","sideB":"8 cm","sideC":"23 cm","angleA":75}, q: "Triangle ABC: AB = 8 cm, AC = 23 cm, angle A = 75°. Find its area, correct to 3 s.f.", options: ["23.8 cm²", "92 cm²", "177.7 cm²", "88.9 cm²"], answer: 3 },
  { id: "h_sinr10981", topic: "trig", time: 230, diagram: {"type":"triangleASA","angleA":55,"angleB":75,"sideA":"6 cm"}, q: "Triangle: angle A = 55°, angle B = 75°, side a = 6 cm. Find side b, correct to 3 s.f. (sine rule)", options: ["5.8 cm", "7.08 cm", "9.08 cm", "5.09 cm"], answer: 1 },
  { id: "h_sinr10982", topic: "trig", time: 226, diagram: {"type":"triangleASA","angleA":55,"angleB":80,"sideA":"12 cm"}, q: "Triangle: angle A = 55°, angle B = 80°, side a = 12 cm. Find side b, correct to 3 s.f. (sine rule)", options: ["16.43 cm", "14.43 cm", "11.82 cm", "9.98 cm"], answer: 1 },
  { id: "h_sinr10983", topic: "trig", time: 244, diagram: {"type":"triangleASA","angleA":40,"angleB":75,"sideA":"13 cm"}, q: "Triangle: angle A = 40°, angle B = 75°, side a = 13 cm. Find side b, correct to 3 s.f. (sine rule)", options: ["8.65 cm", "12.56 cm", "19.54 cm", "21.54 cm"], answer: 2 },
  { id: "h_sinr10984", topic: "trig", time: 240, diagram: {"type":"triangleASA","angleA":35,"angleB":70,"sideA":"9 cm"}, q: "Triangle: angle A = 35°, angle B = 70°, side a = 9 cm. Find side b, correct to 3 s.f. (sine rule)", options: ["14.74 cm", "5.49 cm", "8.46 cm", "16.740000000000002 cm"], answer: 0 },
  { id: "h_sinr10985", topic: "trig", time: 234, diagram: {"type":"triangleASA","angleA":30,"angleB":80,"sideA":"14 cm"}, q: "Triangle: angle A = 30°, angle B = 80°, side a = 14 cm. Find side b, correct to 3 s.f. (sine rule)", options: ["7.11 cm", "29.57 cm", "27.57 cm", "13.79 cm"], answer: 2 },
  { id: "h_sinr10986", topic: "trig", time: 240, diagram: {"type":"triangleASA","angleA":35,"angleB":65,"sideA":"6 cm"}, q: "Triangle: angle A = 35°, angle B = 65°, side a = 6 cm. Find side b, correct to 3 s.f. (sine rule)", options: ["11.48 cm", "5.44 cm", "9.48 cm", "3.8 cm"], answer: 2 },
  { id: "h_sinr10988", topic: "trig", time: 245, diagram: {"type":"triangleASA","angleA":60,"angleB":65,"sideA":"10 cm"}, q: "Triangle: angle A = 60°, angle B = 65°, side a = 10 cm. Find side b, correct to 3 s.f. (sine rule)", options: ["9.06 cm", "12.47 cm", "9.56 cm", "10.47 cm"], answer: 3 },
  { id: "h_bearadv10989", topic: "trig", time: 220, diagram: {"type":"bearing","bearingDeg":169,"dist":"18 km"}, q: "A ship sails on a bearing of 169° for 18 km. Find how far south of its start it now is, correct to 1 d.p.", options: ["18 km", "3.4 km", "19.7 km", "17.7 km"], answer: 3 },
  { id: "h_cosa10990", topic: "trig", time: 232, diagram: {"type":"triangleSSS","sideAB":"6","sideBC":"9","sideCA":"11"}, q: "Triangle ABC: AB = 6, BC = 9, CA = 11. Find angle BAC, correct to 1 d.p.", options: ["16.5°", "147°", "43°", "33°"], answer: 3 },
  { id: "h_cosr10991", topic: "trig", time: 248, diagram: {"type":"triangleSAS","sideB":"29","sideC":"19","angleA":65}, q: "Triangle ABC: AB = 29, AC = 19, angle A = 65°. Find BC, correct to 3 s.f. (cosine rule)", options: ["28.2", "30.1", "27.1", "34.7"], answer: 2 },
  { id: "h_bearadv10993", topic: "trig", time: 213, diagram: {"type":"bearing","bearingDeg":102,"dist":"35 km"}, q: "A ship sails on a bearing of 102° for 35 km. Find how far south of its start it now is, correct to 1 d.p.", options: ["34.2 km", "7.3 km", "35 km", "9.3 km"], answer: 1 },
  { id: "h_bearadv10994", topic: "trig", time: 223, diagram: {"type":"bearing","bearingDeg":123,"dist":"49 km"}, q: "A ship sails on a bearing of 123° for 49 km. Find how far east of its start it now is, correct to 1 d.p.", options: ["49 km", "41.1 km", "26.7 km", "43.1 km"], answer: 1 },
  { id: "h_cosr10996", topic: "trig", time: 248, diagram: {"type":"triangleSAS","sideB":"9","sideC":"8","angleA":40}, q: "Triangle ABC: AB = 9, AC = 8, angle A = 40°. Find BC, correct to 3 s.f. (cosine rule)", options: ["4", "8.9", "5.9", "12"], answer: 2 },
  { id: "h_sinr10997", topic: "trig", time: 232, diagram: {"type":"triangleASA","angleA":30,"angleB":70,"sideA":"10 cm"}, q: "Triangle: angle A = 30°, angle B = 70°, side a = 10 cm. Find side b, correct to 3 s.f. (sine rule)", options: ["9.4 cm", "20.79 cm", "5.32 cm", "18.79 cm"], answer: 3 },
  { id: "h_sinr10999", topic: "trig", time: 222, diagram: {"type":"triangleASA","angleA":35,"angleB":60,"sideA":"7 cm"}, q: "Triangle: angle A = 35°, angle B = 60°, side a = 7 cm. Find side b, correct to 3 s.f. (sine rule)", options: ["12.57 cm", "10.57 cm", "6.06 cm", "4.64 cm"], answer: 1 },
  { id: "h_cosr11000", topic: "trig", time: 249, diagram: {"type":"triangleSAS","sideB":"12","sideC":"14","angleA":110}, q: "Triangle ABC: AB = 12, AC = 14, angle A = 110°. Find BC, correct to 3 s.f. (cosine rule)", options: ["18.4", "24.3", "21.3", "34.9"], answer: 2 },
  { id: "h_sinr11001", topic: "trig", time: 230, diagram: {"type":"triangleASA","angleA":55,"angleB":75,"sideA":"13 cm"}, q: "Triangle: angle A = 55°, angle B = 75°, side a = 13 cm. Find side b, correct to 3 s.f. (sine rule)", options: ["15.33 cm", "12.56 cm", "17.33 cm", "11.02 cm"], answer: 0 },
  { id: "h_sinr11002", topic: "trig", time: 248, diagram: {"type":"triangleASA","angleA":45,"angleB":60,"sideA":"5 cm"}, q: "Triangle: angle A = 45°, angle B = 60°, side a = 5 cm. Find side b, correct to 3 s.f. (sine rule)", options: ["6.12 cm", "8.120000000000001 cm", "4.08 cm", "4.33 cm"], answer: 0 },
  { id: "h_cosr11003", topic: "trig", time: 246, diagram: {"type":"triangleSAS","sideB":"20","sideC":"28","angleA":80}, q: "Triangle ABC: AB = 20, AC = 28, angle A = 80°. Find BC, correct to 3 s.f. (cosine rule)", options: ["34.5", "34.4", "31.5", "39.8"], answer: 2 },
  // Ch probability — 50 questions (2 from real Edexcel 4MA1 past papers, 48 practice questions in the same style)
  { id: "pr1", topic: "probability", ref: "June 2026 1H Q13", time: 220, q: "P(rain) = 0.15. If it rains, P(Paulo walks) = 0.2. Find P(rain AND Paulo walks)", options: ["0.03", "0.35", "0.3", "0.0225"], answer: 0 },
  { id: "pr2", topic: "probability", ref: "June 2026 2H Q20", time: 220, q: "A bag has red and other balls; two are drawn with replacement. P(at least one red) = 39/64. Find P(exactly one red)", options: ["15/32", "39/64", "25/64", "7/16"], answer: 0 },
  { id: "h_noRep11040", topic: "probability", time: 232, q: "A bag has 8 red balls out of 15 total. Two balls are drawn without replacement. Find P(both red)", options: ["64/225", "4/15", "8/15", "8/15²"], answer: 1 },
  { id: "h_tree11041", topic: "probability", time: 249, q: "Independent events: P(A) = 0.44, P(B) = 0.46. Find P(both A and B happen)", options: ["0.2024", "-0.86", "0.3024", "0.9"], answer: 0 },
  { id: "h_tree11042", topic: "probability", time: 249, q: "Independent events: P(A) = 0.35, P(B) = 0.38. Find P(exactly one of A, B happens)", options: ["0.73", "0.464", "0.133", "0.403"], answer: 1 },
  { id: "h_noRep11043", topic: "probability", time: 240, q: "A bag has 8 red balls out of 13 total. Two balls are drawn without replacement. Find P(both red)", options: ["8/13", "64/169", "8/13²", "14/39"], answer: 3 },
  { id: "h_tree11044", topic: "probability", time: 220, q: "Independent events: P(A) = 0.56, P(B) = 0.35. Find P(at least one of A, B happens)", options: ["0.286", "0.91", "0.196", "0.714"], answer: 3 },
  { id: "h_tree11045", topic: "probability", time: 227, q: "Independent events: P(A) = 0.59, P(B) = 0.33. Find P(at least one of A, B happens)", options: ["0.2747", "0.1947", "0.7253", "0.92"], answer: 2 },
  { id: "h_tree11046", topic: "probability", time: 228, q: "Independent events: P(A) = 0.25, P(B) = 0.69. Find P(exactly one of A, B happens)", options: ["0.595", "0.1725", "0.2325", "0.94"], answer: 0 },
  { id: "h_cond11047", topic: "probability", time: 215, q: "P(A) = 0.25. If A happens, P(B) = 0.46. Find P(A and B)", options: ["0.71", "0.5435", "0.165", "0.115"], answer: 3 },
  { id: "h_tree11048", topic: "probability", time: 220, q: "Independent events: P(A) = 0.62, P(B) = 0.48. Find P(both A and B happen)", options: ["0.1976", "1.1", "2.33", "0.2976"], answer: 3 },
  { id: "h_cond11049", topic: "probability", time: 210, q: "P(A) = 0.47. If A happens, P(B) = 0.2. Find P(A and B)", options: ["0.094", "0.67", "2.35", "0.144"], answer: 0 },
  { id: "h_tree11050", topic: "probability", time: 235, q: "Independent events: P(A) = 0.63, P(B) = 0.43. Find P(exactly one of A, B happens)", options: ["0.2109", "0.2709", "0.5182", "1.06"], answer: 2 },
  { id: "h_tree11051", topic: "probability", time: 250, q: "Independent events: P(A) = 0.51, P(B) = 0.7. Find P(both A and B happen)", options: ["1.21", "0.147", "0.357", "-1.57"], answer: 2 },
  { id: "h_noRep11052", topic: "probability", time: 239, q: "A bag has 6 red balls out of 12 total. Two balls are drawn without replacement. Find P(both red)", options: ["1/2", "5/22", "1/4", "1/2²"], answer: 1 },
  { id: "h_tree11053", topic: "probability", time: 245, q: "Independent events: P(A) = 0.6, P(B) = 0.59. Find P(at least one of A, B happens)", options: ["0.354", "0.836", "0.164", "1.19"], answer: 1 },
  { id: "h_noRep11054", topic: "probability", time: 236, q: "A bag has 3 red balls out of 6 total. Two balls are drawn without replacement. Find P(both red)", options: ["1/4", "1/5", "1/2", "1/2²"], answer: 1 },
  { id: "h_tree11055", topic: "probability", time: 237, q: "Independent events: P(A) = 0.52, P(B) = 0.39. Find P(both A and B happen)", options: ["0.2928", "0.2028", "2.26", "0.91"], answer: 1 },
  { id: "h_tree11056", topic: "probability", time: 230, q: "Independent events: P(A) = 0.68, P(B) = 0.51. Find P(exactly one of A, B happens)", options: ["0.3468", "1.19", "0.4964", "0.1568"], answer: 2 },
  { id: "h_cond11057", topic: "probability", time: 239, q: "P(A) = 0.47. If A happens, P(B) = 0.23. Find P(A and B)", options: ["2.0435", "0.7", "0.1581", "0.1081"], answer: 3 },
  { id: "h_cond11058", topic: "probability", time: 228, q: "P(A) = 0.5. If A happens, P(B) = 0.27. Find P(A and B)", options: ["0.135", "1.8519", "0.77", "0.185"], answer: 0 },
  { id: "h_noRep11059", topic: "probability", time: 249, q: "A bag has 6 red balls out of 9 total. Two balls are drawn without replacement. Find P(both red)", options: ["5/12", "2/3", "2/3²", "4/9"], answer: 0 },
  { id: "h_cond11060", topic: "probability", time: 227, q: "P(A) = 0.3. If A happens, P(B) = 0.18. Find P(A and B)", options: ["1.6667", "0.104", "0.48", "0.054"], answer: 3 },
  { id: "h_cond11061", topic: "probability", time: 230, q: "P(A) = 0.34. If A happens, P(B) = 0.47. Find P(A and B)", options: ["0.1598", "0.2098", "0.7234", "0.81"], answer: 0 },
  { id: "h_tree11062", topic: "probability", time: 233, q: "Independent events: P(A) = 0.4, P(B) = 0.58. Find P(both A and B happen)", options: ["-0.74", "0.232", "0.252", "0.98"], answer: 1 },
  { id: "h_tree11063", topic: "probability", time: 236, q: "Independent events: P(A) = 0.37, P(B) = 0.38. Find P(at least one of A, B happens)", options: ["0.3906", "0.75", "0.6094", "0.1406"], answer: 2 },
  { id: "h_noRep11064", topic: "probability", time: 229, q: "A bag has 8 red balls out of 16 total. Two balls are drawn without replacement. Find P(both red)", options: ["1/2", "7/30", "1/2²", "1/4"], answer: 1 },
  { id: "h_cond11065", topic: "probability", time: 233, q: "P(A) = 0.31. If A happens, P(B) = 0.28. Find P(A and B)", options: ["0.0868", "0.1368", "1.1071", "0.59"], answer: 0 },
  { id: "h_cond11066", topic: "probability", time: 236, q: "P(A) = 0.31. If A happens, P(B) = 0.48. Find P(A and B)", options: ["0.79", "0.1488", "0.6458", "0.1988"], answer: 1 },
  { id: "h_cond11067", topic: "probability", time: 230, q: "P(A) = 0.31. If A happens, P(B) = 0.37. Find P(A and B)", options: ["0.1647", "0.1147", "0.68", "0.8378"], answer: 1 },
  { id: "h_tree11068", topic: "probability", time: 228, q: "Independent events: P(A) = 0.55, P(B) = 0.28. Find P(exactly one of A, B happens)", options: ["0.324", "0.83", "0.522", "0.154"], answer: 2 },
  { id: "h_cond11069", topic: "probability", time: 230, q: "P(A) = 0.36. If A happens, P(B) = 0.49. Find P(A and B)", options: ["0.1764", "0.85", "0.7347", "0.2264"], answer: 0 },
  { id: "h_cond11070", topic: "probability", time: 217, q: "P(A) = 0.39. If A happens, P(B) = 0.27. Find P(A and B)", options: ["0.1553", "1.4444", "0.66", "0.1053"], answer: 3 },
  { id: "h_noRep11071", topic: "probability", time: 221, q: "A bag has 3 red balls out of 10 total. Two balls are drawn without replacement. Find P(both red)", options: ["3/10²", "3/10", "1/15", "9/100"], answer: 2 },
  { id: "h_noRep11072", topic: "probability", time: 243, q: "A bag has 4 red balls out of 10 total. Two balls are drawn without replacement. Find P(both red)", options: ["2/5²", "2/5", "4/25", "2/15"], answer: 3 },
  { id: "h_cond11073", topic: "probability", time: 234, q: "P(A) = 0.49. If A happens, P(B) = 0.23. Find P(A and B)", options: ["0.72", "2.1304", "0.1627", "0.1127"], answer: 3 },
  { id: "h_tree11074", topic: "probability", time: 223, q: "Independent events: P(A) = 0.65, P(B) = 0.64. Find P(at least one of A, B happens)", options: ["1.29", "0.126", "0.874", "0.416"], answer: 2 },
  { id: "h_tree11075", topic: "probability", time: 241, q: "Independent events: P(A) = 0.42, P(B) = 0.27. Find P(exactly one of A, B happens)", options: ["0.69", "0.4234", "0.4632", "0.1134"], answer: 2 },
  { id: "h_noRep11076", topic: "probability", time: 246, q: "A bag has 5 red balls out of 11 total. Two balls are drawn without replacement. Find P(both red)", options: ["5/11", "25/121", "2/11", "5/11²"], answer: 2 },
  { id: "h_cond11077", topic: "probability", time: 236, q: "P(A) = 0.47. If A happens, P(B) = 0.11. Find P(A and B)", options: ["0.0517", "0.58", "4.2727", "0.1017"], answer: 0 },
  { id: "h_noRep11078", topic: "probability", time: 222, q: "A bag has 5 red balls out of 12 total. Two balls are drawn without replacement. Find P(both red)", options: ["25/144", "5/12²", "5/12", "5/33"], answer: 3 },
  { id: "h_noRep11079", topic: "probability", time: 225, q: "A bag has 4 red balls out of 8 total. Two balls are drawn without replacement. Find P(both red)", options: ["3/14", "1/4", "1/2²", "1/2"], answer: 0 },
  { id: "h_cond11080", topic: "probability", time: 228, q: "P(A) = 0.53. If A happens, P(B) = 0.45. Find P(A and B)", options: ["1.1778", "0.98", "0.2885", "0.2385"], answer: 3 },
  { id: "h_cond11081", topic: "probability", time: 227, q: "P(A) = 0.26. If A happens, P(B) = 0.37. Find P(A and B)", options: ["0.0962", "0.63", "0.1462", "0.7027"], answer: 0 },
  { id: "h_cond11082", topic: "probability", time: 235, q: "P(A) = 0.22. If A happens, P(B) = 0.41. Find P(A and B)", options: ["0.1402", "0.0902", "0.63", "0.5366"], answer: 1 },
  { id: "h_noRep11083", topic: "probability", time: 221, q: "A bag has 6 red balls out of 13 total. Two balls are drawn without replacement. Find P(both red)", options: ["6/13²", "5/26", "6/13", "36/169"], answer: 1 },
  { id: "h_cond11084", topic: "probability", time: 236, q: "P(A) = 0.41. If A happens, P(B) = 0.18. Find P(A and B)", options: ["2.2778", "0.0738", "0.1238", "0.59"], answer: 1 },
  { id: "h_noRep11085", topic: "probability", time: 225, q: "A bag has 4 red balls out of 11 total. Two balls are drawn without replacement. Find P(both red)", options: ["16/121", "6/55", "4/11²", "4/11"], answer: 1 },
  { id: "h_cond11086", topic: "probability", time: 214, q: "P(A) = 0.52. If A happens, P(B) = 0.23. Find P(A and B)", options: ["0.75", "0.1696", "2.2609", "0.1196"], answer: 3 },
  { id: "h_noRep11087", topic: "probability", time: 225, q: "A bag has 3 red balls out of 8 total. Two balls are drawn without replacement. Find P(both red)", options: ["3/28", "9/64", "3/8", "3/8²"], answer: 0 },
  // Ch histograms — 50 questions (0 from real Edexcel 4MA1 past papers, 50 practice questions in the same style)
  { id: "h_mean11128", topic: "histograms", time: 240, diagram: {"type":"groupedBar","classes":[{"lo":0,"hi":10,"freq":14},{"lo":10,"hi":20,"freq":9},{"lo":20,"hi":30,"freq":8},{"lo":30,"hi":40,"freq":13}]}, q: "Estimate the mean from this grouped data: 0-10 (freq 14), 10-20 (freq 9), 20-30 (freq 8), 30-40 (freq 13)", options: ["215", "21.55", "19.55", "44"], answer: 2 },
  { id: "h_fda11129", topic: "histograms", time: 208, diagram: {"type":"histBar","width":15,"fd":0.68}, q: "A histogram bar covers a class of width 15 with frequency density 0.68. Find the frequency, correct to 1 d.p.", options: ["0.045", "10.2", "15.7", "25.2"], answer: 1 },
  { id: "h_mean11130", topic: "histograms", time: 228, diagram: {"type":"groupedBar","classes":[{"lo":0,"hi":10,"freq":2},{"lo":10,"hi":20,"freq":13},{"lo":20,"hi":30,"freq":12},{"lo":30,"hi":40,"freq":6}]}, q: "Estimate the mean from this grouped data: 0-10 (freq 2), 10-20 (freq 13), 20-30 (freq 12), 30-40 (freq 6)", options: ["21.67", "33", "178.75", "23.67"], answer: 0 },
  { id: "h_mean11131", topic: "histograms", time: 236, diagram: {"type":"groupedBar","classes":[{"lo":0,"hi":10,"freq":14},{"lo":10,"hi":20,"freq":9},{"lo":20,"hi":30,"freq":3},{"lo":30,"hi":40,"freq":5}]}, q: "Estimate the mean from this grouped data: 0-10 (freq 14), 10-20 (freq 9), 20-30 (freq 3), 30-40 (freq 5)", options: ["113.75", "14.68", "31", "16.68"], answer: 1 },
  { id: "h_mean11132", topic: "histograms", time: 250, diagram: {"type":"groupedBar","classes":[{"lo":0,"hi":10,"freq":8},{"lo":10,"hi":20,"freq":8},{"lo":20,"hi":30,"freq":12},{"lo":30,"hi":40,"freq":6}]}, q: "Estimate the mean from this grouped data: 0-10 (freq 8), 10-20 (freq 8), 20-30 (freq 12), 30-40 (freq 6)", options: ["167.5", "34", "19.71", "21.71"], answer: 2 },
  { id: "h_mean11133", topic: "histograms", time: 246, diagram: {"type":"groupedBar","classes":[{"lo":0,"hi":10,"freq":7},{"lo":10,"hi":20,"freq":2},{"lo":20,"hi":30,"freq":2},{"lo":30,"hi":40,"freq":5}]}, q: "Estimate the mean from this grouped data: 0-10 (freq 7), 10-20 (freq 2), 20-30 (freq 2), 30-40 (freq 5)", options: ["16", "20.13", "18.13", "72.5"], answer: 2 },
  { id: "h_mean11134", topic: "histograms", time: 235, diagram: {"type":"groupedBar","classes":[{"lo":0,"hi":10,"freq":13},{"lo":10,"hi":20,"freq":3},{"lo":20,"hi":30,"freq":8},{"lo":30,"hi":40,"freq":2}]}, q: "Estimate the mean from this grouped data: 0-10 (freq 13), 10-20 (freq 3), 20-30 (freq 8), 30-40 (freq 2)", options: ["16.62", "14.62", "95", "26"], answer: 1 },
  { id: "h_fda11135", topic: "histograms", time: 211, diagram: {"type":"histBar","width":7,"fd":8.41}, q: "A histogram bar covers a class of width 7 with frequency density 8.41. Find the frequency, correct to 1 d.p.", options: ["65.9", "15.4", "1.201", "58.9"], answer: 3 },
  { id: "h_fda11136", topic: "histograms", time: 204, diagram: {"type":"histBar","width":12,"fd":1.91}, q: "A histogram bar covers a class of width 12 with frequency density 1.91. Find the frequency, correct to 1 d.p.", options: ["0.159", "22.9", "34.9", "13.9"], answer: 1 },
  { id: "h_mean11137", topic: "histograms", time: 231, diagram: {"type":"groupedBar","classes":[{"lo":0,"hi":10,"freq":14},{"lo":10,"hi":20,"freq":5},{"lo":20,"hi":30,"freq":9},{"lo":30,"hi":40,"freq":4}]}, q: "Estimate the mean from this grouped data: 0-10 (freq 14), 10-20 (freq 5), 20-30 (freq 9), 30-40 (freq 4)", options: ["15.94", "32", "17.94", "127.5"], answer: 0 },
  { id: "h_fda11138", topic: "histograms", time: 223, diagram: {"type":"histBar","width":3,"fd":5.12}, q: "A histogram bar covers a class of width 3 with frequency density 5.12. Find the frequency, correct to 1 d.p.", options: ["8.1", "15.4", "1.707", "18.4"], answer: 1 },
  { id: "h_mean11139", topic: "histograms", time: 240, diagram: {"type":"groupedBar","classes":[{"lo":0,"hi":10,"freq":8},{"lo":10,"hi":20,"freq":9},{"lo":20,"hi":30,"freq":6},{"lo":30,"hi":40,"freq":11}]}, q: "Estimate the mean from this grouped data: 0-10 (freq 8), 10-20 (freq 9), 20-30 (freq 6), 30-40 (freq 11)", options: ["20.88", "34", "22.88", "177.5"], answer: 0 },
  { id: "h_mean11140", topic: "histograms", time: 248, diagram: {"type":"groupedBar","classes":[{"lo":0,"hi":10,"freq":7},{"lo":10,"hi":20,"freq":13},{"lo":20,"hi":30,"freq":8},{"lo":30,"hi":40,"freq":7}]}, q: "Estimate the mean from this grouped data: 0-10 (freq 7), 10-20 (freq 13), 20-30 (freq 8), 30-40 (freq 7)", options: ["168.75", "35", "19.29", "21.29"], answer: 2 },
  { id: "h_mean11141", topic: "histograms", time: 237, diagram: {"type":"groupedBar","classes":[{"lo":0,"hi":10,"freq":11},{"lo":10,"hi":20,"freq":14},{"lo":20,"hi":30,"freq":11},{"lo":30,"hi":40,"freq":7}]}, q: "Estimate the mean from this grouped data: 0-10 (freq 11), 10-20 (freq 14), 20-30 (freq 11), 30-40 (freq 7)", options: ["196.25", "43", "18.26", "20.26"], answer: 2 },
  { id: "h_mean11142", topic: "histograms", time: 233, diagram: {"type":"groupedBar","classes":[{"lo":0,"hi":10,"freq":11},{"lo":10,"hi":20,"freq":6},{"lo":20,"hi":30,"freq":6},{"lo":30,"hi":40,"freq":15}]}, q: "Estimate the mean from this grouped data: 0-10 (freq 11), 10-20 (freq 6), 20-30 (freq 6), 30-40 (freq 15)", options: ["23.58", "21.58", "205", "38"], answer: 1 },
  { id: "h_fda11143", topic: "histograms", time: 224, diagram: {"type":"histBar","width":7,"fd":6.82}, q: "A histogram bar covers a class of width 7 with frequency density 6.82. Find the frequency, correct to 1 d.p.", options: ["0.974", "13.8", "47.7", "54.7"], answer: 2 },
  { id: "h_fda11144", topic: "histograms", time: 209, diagram: {"type":"histBar","width":25,"fd":7.32}, q: "A histogram bar covers a class of width 25 with frequency density 7.32. Find the frequency, correct to 1 d.p.", options: ["32.3", "183", "208", "0.293"], answer: 1 },
  { id: "h_mean11145", topic: "histograms", time: 248, diagram: {"type":"groupedBar","classes":[{"lo":0,"hi":10,"freq":13},{"lo":10,"hi":20,"freq":9},{"lo":20,"hi":30,"freq":6},{"lo":30,"hi":40,"freq":6}]}, q: "Estimate the mean from this grouped data: 0-10 (freq 13), 10-20 (freq 9), 20-30 (freq 6), 30-40 (freq 6)", options: ["34", "16.47", "18.47", "140"], answer: 1 },
  { id: "h_mean11146", topic: "histograms", time: 240, diagram: {"type":"groupedBar","classes":[{"lo":0,"hi":10,"freq":12},{"lo":10,"hi":20,"freq":2},{"lo":20,"hi":30,"freq":2},{"lo":30,"hi":40,"freq":14}]}, q: "Estimate the mean from this grouped data: 0-10 (freq 12), 10-20 (freq 2), 20-30 (freq 2), 30-40 (freq 14)", options: ["21", "157.5", "30", "23"], answer: 0 },
  { id: "h_mean11147", topic: "histograms", time: 239, diagram: {"type":"groupedBar","classes":[{"lo":0,"hi":10,"freq":9},{"lo":10,"hi":20,"freq":3},{"lo":20,"hi":30,"freq":12},{"lo":30,"hi":40,"freq":9}]}, q: "Estimate the mean from this grouped data: 0-10 (freq 9), 10-20 (freq 3), 20-30 (freq 12), 30-40 (freq 9)", options: ["176.25", "33", "23.36", "21.36"], answer: 3 },
  { id: "h_mean11148", topic: "histograms", time: 241, diagram: {"type":"groupedBar","classes":[{"lo":0,"hi":10,"freq":5},{"lo":10,"hi":20,"freq":9},{"lo":20,"hi":30,"freq":12},{"lo":30,"hi":40,"freq":13}]}, q: "Estimate the mean from this grouped data: 0-10 (freq 5), 10-20 (freq 9), 20-30 (freq 12), 30-40 (freq 13)", options: ["39", "25.46", "228.75", "23.46"], answer: 3 },
  { id: "h_fda11149", topic: "histograms", time: 230, diagram: {"type":"histBar","width":15,"fd":2.41}, q: "A histogram bar covers a class of width 15 with frequency density 2.41. Find the frequency, correct to 1 d.p.", options: ["36.2", "17.4", "0.161", "51.2"], answer: 0 },
  { id: "h_mean11150", topic: "histograms", time: 234, diagram: {"type":"groupedBar","classes":[{"lo":0,"hi":10,"freq":7},{"lo":10,"hi":20,"freq":8},{"lo":20,"hi":30,"freq":11},{"lo":30,"hi":40,"freq":10}]}, q: "Estimate the mean from this grouped data: 0-10 (freq 7), 10-20 (freq 8), 20-30 (freq 11), 30-40 (freq 10)", options: ["195", "36", "23.67", "21.67"], answer: 3 },
  { id: "h_mean11151", topic: "histograms", time: 239, diagram: {"type":"groupedBar","classes":[{"lo":0,"hi":10,"freq":15},{"lo":10,"hi":20,"freq":14},{"lo":20,"hi":30,"freq":14},{"lo":30,"hi":40,"freq":6}]}, q: "Estimate the mean from this grouped data: 0-10 (freq 15), 10-20 (freq 14), 20-30 (freq 14), 30-40 (freq 6)", options: ["49", "211.25", "17.24", "19.24"], answer: 2 },
  { id: "h_fda11152", topic: "histograms", time: 214, diagram: {"type":"histBar","width":12,"fd":8.4}, q: "A histogram bar covers a class of width 12 with frequency density 8.4. Find the frequency, correct to 1 d.p.", options: ["0.7", "112.8", "100.8", "20.4"], answer: 2 },
  { id: "h_mean11153", topic: "histograms", time: 245, diagram: {"type":"groupedBar","classes":[{"lo":0,"hi":10,"freq":11},{"lo":10,"hi":20,"freq":6},{"lo":20,"hi":30,"freq":9},{"lo":30,"hi":40,"freq":8}]}, q: "Estimate the mean from this grouped data: 0-10 (freq 11), 10-20 (freq 6), 20-30 (freq 9), 30-40 (freq 8)", options: ["162.5", "34", "19.12", "21.12"], answer: 2 },
  { id: "h_mean11154", topic: "histograms", time: 249, diagram: {"type":"groupedBar","classes":[{"lo":0,"hi":10,"freq":11},{"lo":10,"hi":20,"freq":11},{"lo":20,"hi":30,"freq":13},{"lo":30,"hi":40,"freq":11}]}, q: "Estimate the mean from this grouped data: 0-10 (freq 11), 10-20 (freq 11), 20-30 (freq 13), 30-40 (freq 11)", options: ["232.5", "22.22", "46", "20.22"], answer: 3 },
  { id: "h_fda11155", topic: "histograms", time: 218, diagram: {"type":"histBar","width":12,"fd":5.98}, q: "A histogram bar covers a class of width 12 with frequency density 5.98. Find the frequency, correct to 1 d.p.", options: ["83.8", "71.8", "0.498", "18"], answer: 1 },
  { id: "h_mean11156", topic: "histograms", time: 244, diagram: {"type":"groupedBar","classes":[{"lo":0,"hi":10,"freq":2},{"lo":10,"hi":20,"freq":15},{"lo":20,"hi":30,"freq":15},{"lo":30,"hi":40,"freq":7}]}, q: "Estimate the mean from this grouped data: 0-10 (freq 2), 10-20 (freq 15), 20-30 (freq 15), 30-40 (freq 7)", options: ["21.92", "39", "23.92", "213.75"], answer: 0 },
  { id: "h_mean11157", topic: "histograms", time: 249, diagram: {"type":"groupedBar","classes":[{"lo":0,"hi":10,"freq":9},{"lo":10,"hi":20,"freq":4},{"lo":20,"hi":30,"freq":9},{"lo":30,"hi":40,"freq":8}]}, q: "Estimate the mean from this grouped data: 0-10 (freq 9), 10-20 (freq 4), 20-30 (freq 9), 30-40 (freq 8)", options: ["152.5", "20.33", "30", "22.33"], answer: 1 },
  { id: "h_fda11158", topic: "histograms", time: 207, diagram: {"type":"histBar","width":25,"fd":4.49}, q: "A histogram bar covers a class of width 25 with frequency density 4.49. Find the frequency, correct to 1 d.p.", options: ["29.5", "137.3", "0.18", "112.3"], answer: 3 },
  { id: "h_mean11159", topic: "histograms", time: 220, diagram: {"type":"groupedBar","classes":[{"lo":0,"hi":10,"freq":5},{"lo":10,"hi":20,"freq":15},{"lo":20,"hi":30,"freq":7},{"lo":30,"hi":40,"freq":8}]}, q: "Estimate the mean from this grouped data: 0-10 (freq 5), 10-20 (freq 15), 20-30 (freq 7), 30-40 (freq 8)", options: ["176.25", "20.14", "35", "22.14"], answer: 1 },
  { id: "h_fda11160", topic: "histograms", time: 224, diagram: {"type":"histBar","width":15,"fd":8.79}, q: "A histogram bar covers a class of width 15 with frequency density 8.79. Find the frequency, correct to 1 d.p.", options: ["0.586", "146.8", "23.8", "131.8"], answer: 3 },
  { id: "h_fda11161", topic: "histograms", time: 218, diagram: {"type":"histBar","width":7,"fd":8.98}, q: "A histogram bar covers a class of width 7 with frequency density 8.98. Find the frequency, correct to 1 d.p.", options: ["69.9", "62.9", "1.283", "16"], answer: 1 },
  { id: "h_mean11162", topic: "histograms", time: 242, diagram: {"type":"groupedBar","classes":[{"lo":0,"hi":10,"freq":5},{"lo":10,"hi":20,"freq":2},{"lo":20,"hi":30,"freq":14},{"lo":30,"hi":40,"freq":4}]}, q: "Estimate the mean from this grouped data: 0-10 (freq 5), 10-20 (freq 2), 20-30 (freq 14), 30-40 (freq 4)", options: ["136.25", "23.8", "25", "21.8"], answer: 3 },
  { id: "h_fda11163", topic: "histograms", time: 212, diagram: {"type":"histBar","width":12,"fd":5.18}, q: "A histogram bar covers a class of width 12 with frequency density 5.18. Find the frequency, correct to 1 d.p.", options: ["74.2", "62.2", "17.2", "0.432"], answer: 1 },
  { id: "h_mean11164", topic: "histograms", time: 239, diagram: {"type":"groupedBar","classes":[{"lo":0,"hi":10,"freq":4},{"lo":10,"hi":20,"freq":6},{"lo":20,"hi":30,"freq":2},{"lo":30,"hi":40,"freq":15}]}, q: "Estimate the mean from this grouped data: 0-10 (freq 4), 10-20 (freq 6), 20-30 (freq 2), 30-40 (freq 15)", options: ["27.37", "25.37", "171.25", "27"], answer: 1 },
  { id: "h_fda11165", topic: "histograms", time: 201, diagram: {"type":"histBar","width":15,"fd":8.78}, q: "A histogram bar covers a class of width 15 with frequency density 8.78. Find the frequency, correct to 1 d.p.", options: ["23.8", "0.585", "146.7", "131.7"], answer: 3 },
  { id: "h_mean11166", topic: "histograms", time: 250, diagram: {"type":"groupedBar","classes":[{"lo":0,"hi":10,"freq":11},{"lo":10,"hi":20,"freq":6},{"lo":20,"hi":30,"freq":2},{"lo":30,"hi":40,"freq":10}]}, q: "Estimate the mean from this grouped data: 0-10 (freq 11), 10-20 (freq 6), 20-30 (freq 2), 30-40 (freq 10)", options: ["29", "136.25", "18.79", "20.79"], answer: 2 },
  { id: "h_mean11167", topic: "histograms", time: 228, diagram: {"type":"groupedBar","classes":[{"lo":0,"hi":10,"freq":4},{"lo":10,"hi":20,"freq":2},{"lo":20,"hi":30,"freq":2},{"lo":30,"hi":40,"freq":13}]}, q: "Estimate the mean from this grouped data: 0-10 (freq 4), 10-20 (freq 2), 20-30 (freq 2), 30-40 (freq 13)", options: ["21", "138.75", "26.43", "28.43"], answer: 2 },
  { id: "h_fda11168", topic: "histograms", time: 211, diagram: {"type":"histBar","width":3,"fd":6.11}, q: "A histogram bar covers a class of width 3 with frequency density 6.11. Find the frequency, correct to 1 d.p.", options: ["21.3", "2.037", "9.1", "18.3"], answer: 3 },
  { id: "h_mean11169", topic: "histograms", time: 249, diagram: {"type":"groupedBar","classes":[{"lo":0,"hi":10,"freq":3},{"lo":10,"hi":20,"freq":14},{"lo":20,"hi":30,"freq":9},{"lo":30,"hi":40,"freq":14}]}, q: "Estimate the mean from this grouped data: 0-10 (freq 3), 10-20 (freq 14), 20-30 (freq 9), 30-40 (freq 14)", options: ["23.5", "235", "25.5", "40"], answer: 0 },
  { id: "h_fda11170", topic: "histograms", time: 209, diagram: {"type":"histBar","width":3,"fd":1.24}, q: "A histogram bar covers a class of width 3 with frequency density 1.24. Find the frequency, correct to 1 d.p.", options: ["4.2", "0.413", "3.7", "6.7"], answer: 2 },
  { id: "h_mean11171", topic: "histograms", time: 238, diagram: {"type":"groupedBar","classes":[{"lo":0,"hi":10,"freq":13},{"lo":10,"hi":20,"freq":3},{"lo":20,"hi":30,"freq":15},{"lo":30,"hi":40,"freq":10}]}, q: "Estimate the mean from this grouped data: 0-10 (freq 13), 10-20 (freq 3), 20-30 (freq 15), 30-40 (freq 10)", options: ["208.75", "41", "22.37", "20.37"], answer: 3 },
  { id: "h_mean11172", topic: "histograms", time: 220, diagram: {"type":"groupedBar","classes":[{"lo":0,"hi":10,"freq":5},{"lo":10,"hi":20,"freq":6},{"lo":20,"hi":30,"freq":6},{"lo":30,"hi":40,"freq":14}]}, q: "Estimate the mean from this grouped data: 0-10 (freq 5), 10-20 (freq 6), 20-30 (freq 6), 30-40 (freq 14)", options: ["31", "24.35", "188.75", "26.35"], answer: 1 },
  { id: "h_mean11173", topic: "histograms", time: 245, diagram: {"type":"groupedBar","classes":[{"lo":0,"hi":10,"freq":15},{"lo":10,"hi":20,"freq":14},{"lo":20,"hi":30,"freq":9},{"lo":30,"hi":40,"freq":4}]}, q: "Estimate the mean from this grouped data: 0-10 (freq 15), 10-20 (freq 14), 20-30 (freq 9), 30-40 (freq 4)", options: ["15.48", "17.48", "162.5", "42"], answer: 0 },
  { id: "h_mean11174", topic: "histograms", time: 230, diagram: {"type":"groupedBar","classes":[{"lo":0,"hi":10,"freq":3},{"lo":10,"hi":20,"freq":4},{"lo":20,"hi":30,"freq":13},{"lo":30,"hi":40,"freq":15}]}, q: "Estimate the mean from this grouped data: 0-10 (freq 3), 10-20 (freq 4), 20-30 (freq 13), 30-40 (freq 15)", options: ["26.43", "28.43", "231.25", "35"], answer: 0 },
  { id: "h_fda11175", topic: "histograms", time: 208, diagram: {"type":"histBar","width":25,"fd":6.69}, q: "A histogram bar covers a class of width 25 with frequency density 6.69. Find the frequency, correct to 1 d.p.", options: ["167.3", "31.7", "192.3", "0.268"], answer: 0 },
  { id: "h_fda11176", topic: "histograms", time: 207, diagram: {"type":"histBar","width":3,"fd":6.84}, q: "A histogram bar covers a class of width 3 with frequency density 6.84. Find the frequency, correct to 1 d.p.", options: ["2.28", "20.5", "23.5", "9.8"], answer: 1 },
  { id: "h_fda11177", topic: "histograms", time: 211, diagram: {"type":"histBar","width":3,"fd":3.53}, q: "A histogram bar covers a class of width 3 with frequency density 3.53. Find the frequency, correct to 1 d.p.", options: ["10.6", "6.5", "13.6", "1.177"], answer: 0 },
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

const SEEN_KEY = 'y10higher-seen-v1';

// Tracks which questions this student/browser has already been given, so repeat plays
// serve fresh questions first instead of the same set every time. Stored locally (not
// shared across students). Falls back to localStorage, then to memory-only if neither
// storage API is available in this environment.
async function loadSeenIds() {
  try {
    const res = await window.storage.get(SEEN_KEY, false);
    const data = res ? JSON.parse(res.value) : [];
    return Array.isArray(data) ? data : [];
  } catch (e) {
    try {
      const raw = localStorage.getItem(SEEN_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e2) {
      return [];
    }
  }
}

async function saveSeenIds(ids) {
  try {
    await window.storage.set(SEEN_KEY, JSON.stringify(ids), false);
  } catch (e) {
    try {
      localStorage.setItem(SEEN_KEY, JSON.stringify(ids));
    } catch (e2) { /* memory-only for this session */ }
  }
}

const FEEDBACK_KEY = 'y10higher-feedback-v1';

// Shared across all students (true = shared storage), so Mr. Al-Daboubi can review
// flagged questions from the Feedback screen.
async function loadFeedback() {
  try {
    const res = await window.storage.get(FEEDBACK_KEY, true);
    const data = res ? JSON.parse(res.value) : [];
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}

async function submitFeedback(entry) {
  try {
    const existing = await loadFeedback();
    const updated = [entry, ...existing].slice(0, 300);
    await window.storage.set(FEEDBACK_KEY, JSON.stringify(updated), true);
    return true;
  } catch (e) {
    return false;
  }
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
  .mountain-bg { background-image: linear-gradient(rgba(244,241,234,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(244,241,234,0.06) 1px, transparent 1px); background-size: 24px 24px; }
  .pop { animation: popIn 0.35s ease-out; }
  .shakeit { animation: shake 0.4s ease-in-out; }
  .topic-scroll::-webkit-scrollbar { width: 8px; }
  .topic-scroll::-webkit-scrollbar-track { background: rgba(244,241,234,0.04); border-radius: 8px; }
  .topic-scroll::-webkit-scrollbar-thumb { background: rgba(244,241,234,0.25); border-radius: 8px; }
  .topic-scroll::-webkit-scrollbar-thumb:hover { background: rgba(244,241,234,0.4); }
  .peak-climb { transition: bottom 0.7s ease-out; }
`;

export default function Y10HigherSummit() {
  const [screen, setScreen] = useState('setup');
  const [selectedTopics, setSelectedTopics] = useState(TOPICS.map(t => t.id));
  const [numQuestions, setNumQuestions] = useState(10);
  const [pool, setPool] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(210);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [climbers, setClimbers] = useState(CLIMBERS_TEMPLATE.map(r => ({ ...r, progress: 0 })));
  const [stats, setStats] = useState({ correct: 0, total: 0, totalTime: 0 });
  const [standings, setStandings] = useState([]);
  const [raceStartTime, setRaceStartTime] = useState(null);
  const [raceEndTime, setRaceEndTime] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [saved, setSaved] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [lbLoading, setLbLoading] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);
  const [fbLoading, setFbLoading] = useState(false);
  const [fbOpenFor, setFbOpenFor] = useState(null);
  const [fbText, setFbText] = useState('');
  const [fbSentIds, setFbSentIds] = useState([]);
  const timeoutRef = useRef(null);

  const toggleTopic = (id) => {
    setSelectedTopics(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const startClimb = async () => {
    const filteredAll = shuffle(QUESTIONS.filter(q => selectedTopics.includes(q.topic)));
    const seen = await loadSeenIds();
    let unseen = filteredAll.filter(q => !seen.includes(q.id));
    const wanted = Math.max(1, Math.min(numQuestions, filteredAll.length));
    let cycleReset = false;
    if (unseen.length < wanted) {
      cycleReset = true;
      unseen = filteredAll;
    }
    const chosen = unseen.slice(0, wanted).map(shuffleOptions);
    const newSeen = cycleReset ? chosen.map(q => q.id) : [...new Set([...seen, ...chosen.map(q => q.id)])];
    saveSeenIds(newSeen);

    setPool(chosen);
    setQIndex(0);
    setCurrentQuestion(chosen[0]);
    setClimbers(CLIMBERS_TEMPLATE.map(r => ({ ...r, progress: 0 })));
    setStats({ correct: 0, total: 0, totalTime: 0 });
    setAnswered(false);
    setSelectedOption(null);
    setIsCorrect(null);
    setTimeLeft(chosen[0] ? chosen[0].time : 210);
    setRaceStartTime(Date.now());
    setRaceEndTime(null);
    setSaved(false);
    setPlayerName('');
    setScreen('climbing');
  };

  useEffect(() => {
    if (screen !== 'climbing' || answered) return;
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
    const q = pool[idx];
    setQIndex(nextIdx);
    setCurrentQuestion(q);
    setAnswered(false);
    setSelectedOption(null);
    setIsCorrect(null);
    setTimeLeft(q.time);
  };

  const endClimb = (finalClimbers) => {
    const sorted = [...finalClimbers].sort((a, b) => b.progress - a.progress);
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
    const timeUsed = currentQuestion.time - Math.max(timeLeft, 0);
    setStats(prev => ({ correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1, totalTime: prev.totalTime + timeUsed }));

    const playerBoost = correct ? 12 + Math.round((Math.max(timeLeft, 0) / currentQuestion.time) * 8) : 3;
    const newClimbers = climbers.map(r => r.isPlayer
      ? { ...r, progress: Math.min(100, r.progress + playerBoost) }
      : { ...r, progress: Math.min(100, r.progress + 6 + Math.floor(Math.random() * 11)) }
    );

    timeoutRef.current = setTimeout(() => {
      setClimbers(newClimbers);
      const finished = newClimbers.some(r => r.progress >= 100);
      const outOfQuestions = (qIndex + 1) >= pool.length;
      setTimeout(() => {
        if (finished || outOfQuestions) {
          endClimb(newClimbers);
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
      const res = await window.storage.get('y10higher-leaderboard', true);
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

  const goToFeedback = async () => {
    setScreen('feedback');
    setFbLoading(true);
    const data = await loadFeedback();
    setFeedbackList(data);
    setFbLoading(false);
  };

  const openFeedbackFor = (questionId) => {
    setFbOpenFor(fbOpenFor === questionId ? null : questionId);
    setFbText('');
  };

  const sendFeedback = async (question) => {
    if (!fbText.trim()) return;
    const topicMeta = TOPICS.find(t => t.id === question.topic);
    const entry = {
      questionId: question.id,
      topic: question.topic,
      chapter: topicMeta ? topicMeta.label : question.topic,
      question: question.q,
      text: fbText.trim().slice(0, 500),
      date: new Date().toISOString(),
    };
    const ok = await submitFeedback(entry);
    if (ok) {
      setFbSentIds(prev => [...prev, question.id]);
      setFbOpenFor(null);
      setFbText('');
    }
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
      const res = await window.storage.get('y10higher-leaderboard', true);
      const existing = res ? JSON.parse(res.value) : [];
      const updated = [...(Array.isArray(existing) ? existing : []), entry]
        .sort((a, b) => a.place - b.place || a.totalTime - b.totalTime)
        .slice(0, 50);
      await window.storage.set('y10higher-leaderboard', JSON.stringify(updated), true);
      setSaved(true);
    } catch (e) {
      setSaved(true);
    }
  };

  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
  const avgTime = stats.total > 0 ? (stats.totalTime / stats.total).toFixed(1) : '0.0';
  const totalClimbTime = raceEndTime && raceStartTime ? (raceEndTime - raceStartTime) / 1000 : 0;

  return (
    <div className="fb mountain-bg min-h-screen w-full flex flex-col items-center justify-start p-4" style={{ background: '#1B1E2B', color: '#F4F1EA' }}>
      <style>{FONT_STYLE}</style>
      <div className="w-full max-w-3xl">

        <div className="flex items-center justify-between mb-1 pt-2">
          <div className="flex items-center gap-2">
            <Mountain size={30} color="#9BC6F5" strokeWidth={2.4} />
            <h1 className="fd text-4xl tracking-wide" style={{ color: '#9BC6F5' }}>Y10 SUMMIT CLIMB</h1>
          </div>
          <div className="fm text-xs opacity-60 uppercase tracking-widest text-right">Higher • 3-4 min/Q<br/>Edexcel IGCSE Maths A</div>
        </div>
        <div className="fb text-xs opacity-45 mb-6">Created by Amer Al-Daboubi</div>

        {screen === 'setup' && (
          <SetupScreen selectedTopics={selectedTopics} toggleTopic={toggleTopic} numQuestions={numQuestions} setNumQuestions={setNumQuestions} startClimb={startClimb} goToLeaderboard={goToLeaderboard} goToFeedback={goToFeedback} />
        )}

        {screen === 'climbing' && currentQuestion && (
          <ClimbingScreen climbers={climbers} currentQuestion={currentQuestion} timeLeft={timeLeft} answered={answered} selectedOption={selectedOption} isCorrect={isCorrect} handleAnswer={handleAnswer} stats={stats} fbOpenFor={fbOpenFor} openFeedbackFor={openFeedbackFor} fbText={fbText} setFbText={setFbText} sendFeedback={sendFeedback} fbSentIds={fbSentIds} />
        )}

        {screen === 'results' && (
          <ResultsScreen standings={standings} accuracy={accuracy} avgTime={avgTime} totalClimbTime={totalClimbTime} playerName={playerName} setPlayerName={setPlayerName} saveScore={saveScore} saved={saved} startClimb={startClimb} goToLeaderboard={goToLeaderboard} />
        )}

        {screen === 'leaderboard' && (
          <LeaderboardScreen leaderboard={leaderboard} loading={lbLoading} backToSetup={() => setScreen('setup')} />
        )}

        {screen === 'feedback' && (
          <FeedbackScreen feedbackList={feedbackList} loading={fbLoading} backToSetup={() => setScreen('setup')} />
        )}

        <div className="fb text-[10px] opacity-30 text-center mt-8 pb-4">Created by Amer Al-Daboubi — Edexcel IGCSE Mathematics A revision tools</div>
      </div>
    </div>
  );
}

function SetupScreen({ selectedTopics, toggleTopic, numQuestions, setNumQuestions, startClimb, goToLeaderboard, goToFeedback }) {
  const selectAll = () => {
    TOPICS.forEach(t => { if (!selectedTopics.includes(t.id)) toggleTopic(t.id); });
  };
  const clearAll = () => {
    [...selectedTopics].forEach(id => toggleTopic(id));
  };

  const totalAvailable = QUESTIONS.filter(q => selectedTopics.includes(q.topic)).length;
  const presets = [5, 10, 15, 20];
  const clamp = (n) => Math.max(1, Math.min(n, Math.max(totalAvailable, 1)));

  return (
    <div className="pop">
      <p className="fb text-sm opacity-70 mb-4 leading-relaxed">
        Higher-tier Edexcel 4MA1 past-paper questions, sorted by chapter from the Y10 Unit 1H long-term plan.
        Scroll to see all 17 chapters. Each replay serves fresh questions you haven't seen yet before repeating any —
        each question gets 3-4 minutes depending on difficulty, and you choose how many to answer before you start.
      </p>

      <div className="flex items-center justify-between mb-3">
        <div className="fd text-xl tracking-wide opacity-90">CHOOSE YOUR CHAPTERS</div>
        <div className="flex items-center gap-2 fm text-[10px]">
          <button onClick={selectAll} className="px-2 py-1 rounded" style={{ border: '1px solid rgba(244,241,234,0.25)', opacity: 0.8 }}>All</button>
          <button onClick={clearAll} className="px-2 py-1 rounded" style={{ border: '1px solid rgba(244,241,234,0.25)', opacity: 0.8 }}>None</button>
        </div>
      </div>

      <div
        className="topic-scroll grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2 overflow-y-auto pr-1"
        style={{ maxHeight: '360px', border: '1px solid rgba(244,241,234,0.08)', borderRadius: '12px', padding: '12px', background: 'rgba(0,0,0,0.12)' }}
      >
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
              <div className="fm text-[10px] opacity-50 mt-1">{t.source}</div>
            </button>
          );
        })}
      </div>
      <div className="fm text-[10px] opacity-40 mb-6 text-center">{TOPICS.length} chapters • scroll for more ▲▼</div>

      <div className="mb-6">
        <div className="fd text-xl tracking-wide opacity-90 mb-3">HOW MANY QUESTIONS WILL YOU ANSWER?</div>
        <div className="flex items-center gap-2 flex-wrap">
          {presets.map(p => (
            <button
              key={p}
              onClick={() => setNumQuestions(clamp(p))}
              className="fb rounded-lg px-4 py-2 text-sm font-semibold"
              style={{
                border: `2px solid ${numQuestions === clamp(p) ? '#9BC6F5' : 'rgba(244,241,234,0.15)'}`,
                background: numQuestions === clamp(p) ? '#9BC6F522' : 'transparent',
                color: '#F4F1EA',
              }}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setNumQuestions(totalAvailable)}
            className="fb rounded-lg px-4 py-2 text-sm font-semibold"
            style={{
              border: `2px solid ${numQuestions === totalAvailable ? '#9BC6F5' : 'rgba(244,241,234,0.15)'}`,
              background: numQuestions === totalAvailable ? '#9BC6F522' : 'transparent',
              color: '#F4F1EA',
            }}
          >
            All ({totalAvailable})
          </button>
          <input
            type="number"
            min={1}
            max={Math.max(totalAvailable, 1)}
            value={numQuestions}
            onChange={e => setNumQuestions(clamp(parseInt(e.target.value, 10) || 1))}
            className="fm rounded-lg px-3 py-2 text-sm w-20 outline-none"
            style={{ background: '#242840', border: '1px solid rgba(244,241,234,0.2)', color: '#F4F1EA' }}
          />
        </div>
        <div className="fm text-[10px] opacity-40 mt-2">{totalAvailable} questions available in the chapters you've selected</div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={startClimb}
          disabled={selectedTopics.length === 0}
          className="fd flex-1 flex items-center justify-center gap-2 rounded-lg py-4 text-2xl tracking-wide transition-opacity"
          style={{
            background: selectedTopics.length ? '#9BC6F5' : 'rgba(244,241,234,0.15)',
            color: '#1B1E2B',
            opacity: selectedTopics.length ? 1 : 0.5,
            cursor: selectedTopics.length ? 'pointer' : 'not-allowed',
          }}
        >
          <Play size={22} fill="#1B1E2B" /> START CLIMB
        </button>
        <button
          onClick={goToLeaderboard}
          className="fb rounded-lg px-4 py-4 text-sm font-semibold flex items-center gap-2"
          style={{ border: '2px solid rgba(244,241,234,0.15)', color: '#F4F1EA' }}
        >
          <ListOrdered size={18} /> Leaderboard
        </button>
        <button
          onClick={goToFeedback}
          className="fb rounded-lg px-4 py-4 text-sm font-semibold flex items-center gap-2"
          style={{ border: '2px solid rgba(244,241,234,0.15)', color: '#F4F1EA' }}
          title="Mr. Al-Daboubi: review flagged questions"
        >
          <MessageSquare size={18} /> Feedback
        </button>
      </div>
    </div>
  );
}

function QuestionDiagram({ diagram, accent }) {
  if (!diagram) return null;
  const line = 'rgba(244,241,234,0.55)';
  const line2 = 'rgba(244,241,234,0.85)';
  const txt = '#F4F1EA';
  const fill = `${accent}26`;
  const W = 240, H = 150;

  const Wrap = ({ children, w = W, h = H }) => (
    <div className="flex justify-center my-3">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ maxWidth: '100%' }}>{children}</svg>
    </div>
  );

  switch (diagram.type) {
    case 'venn2':
    case 'venn2Counts': {
      const cx1 = 95, cx2 = 145, cy = 75, r = 55;
      const aOnlyTxt = diagram.aOnly !== undefined ? (Array.isArray(diagram.aOnly) ? diagram.aOnly.join(', ') : diagram.aOnly) : '';
      const bothTxt = diagram.both !== undefined ? (Array.isArray(diagram.both) ? diagram.both.join(', ') : diagram.both) : '';
      const bOnlyTxt = diagram.bOnly !== undefined ? (Array.isArray(diagram.bOnly) ? diagram.bOnly.join(', ') : diagram.bOnly) : '';
      return (
        <Wrap>
          <rect x={10} y={15} width={220} height={120} fill="none" stroke={line} strokeWidth="1.5" rx="6" />
          <text x={18} y={30} fill={txt} fontSize="11" opacity="0.6">ξ</text>
          <circle cx={cx1} cy={cy} r={r} fill={fill} stroke={accent} strokeWidth="2" />
          <circle cx={cx2} cy={cy} r={r} fill={fill} stroke={accent} strokeWidth="2" />
          <text x={cx1 - 35} y={cy - r - 6} fill={accent} fontSize="13" fontWeight="700">{diagram.labelA || 'A'}</text>
          <text x={cx2 + 28} y={cy - r - 6} fill={accent} fontSize="13" fontWeight="700">{diagram.labelB || 'B'}</text>
          <text x={cx1 - 22} y={cy} fill={txt} fontSize="12" textAnchor="middle">{aOnlyTxt}</text>
          <text x={(cx1 + cx2) / 2} y={cy} fill={txt} fontSize="12" textAnchor="middle">{bothTxt}</text>
          <text x={cx2 + 22} y={cy} fill={txt} fontSize="12" textAnchor="middle">{bOnlyTxt}</text>
          {diagram.outside !== undefined && <text x={120} y={122} fill={txt} fontSize="11" textAnchor="middle" opacity="0.75">outside: {diagram.outside}</text>}
        </Wrap>
      );
    }
    case 'rightTriangle': {
      const x0 = 35, y0 = 120, x1 = 200, y1 = 120, x2 = 35, y2 = 25;
      return (
        <Wrap>
          <polygon points={`${x0},${y0} ${x1},${y1} ${x2},${y2}`} fill={fill} stroke={accent} strokeWidth="2" />
          <rect x={x0} y={y0 - 12} width={12} height={12} fill="none" stroke={line2} strokeWidth="1.5" />
          {diagram.angle !== undefined && diagram.angleAt !== 'top' && (
            <text x={x1 - 38} y={y1 - 10} fill={txt} fontSize="12">{diagram.angle}°</text>
          )}
          {diagram.base && <text x={(x0 + x1) / 2} y={y1 + 18} fill={txt} fontSize="12" textAnchor="middle">{diagram.base}</text>}
          {diagram.height && <text x={x0 - 8} y={(y0 + y2) / 2} fill={txt} fontSize="12" textAnchor="end">{diagram.height}</text>}
          {diagram.hyp && <text x={(x1 + x2) / 2 + 12} y={(y1 + y2) / 2 - 6} fill={txt} fontSize="12">{diagram.hyp}</text>}
          {diagram.opposite && !diagram.base && <text x={x0 - 8} y={(y0 + y2) / 2} fill={txt} fontSize="12" textAnchor="end">{diagram.opposite}</text>}
          {diagram.unknownSide && (
            <text x={110} y={140} fill={accent} fontSize="11" textAnchor="middle" fontWeight="700">? = {diagram.unknownSide}</text>
          )}
        </Wrap>
      );
    }
    case 'triangleSAS': {
      const A = { x: 120, y: 20 }, B = { x: 35, y: 125 }, C = { x: 205, y: 125 };
      return (
        <Wrap>
          <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill={fill} stroke={accent} strokeWidth="2" />
          <text x={A.x} y={A.y - 6} fill={txt} fontSize="12" textAnchor="middle">A ({diagram.angleA}°)</text>
          <text x={B.x - 10} y={B.y + 14} fill={txt} fontSize="12" textAnchor="middle">B</text>
          <text x={C.x + 10} y={C.y + 14} fill={txt} fontSize="12" textAnchor="middle">C</text>
          <text x={(A.x + B.x) / 2 - 18} y={(A.y + B.y) / 2} fill={txt} fontSize="12">{diagram.sideB}</text>
          <text x={(A.x + C.x) / 2 + 6} y={(A.y + C.y) / 2} fill={txt} fontSize="12">{diagram.sideC}</text>
        </Wrap>
      );
    }
    case 'triangleSSS': {
      const A = { x: 120, y: 20 }, B = { x: 35, y: 125 }, C = { x: 205, y: 125 };
      return (
        <Wrap>
          <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill={fill} stroke={accent} strokeWidth="2" />
          <text x={A.x} y={A.y - 6} fill={txt} fontSize="12" textAnchor="middle">A</text>
          <text x={B.x - 10} y={B.y + 14} fill={txt} fontSize="12" textAnchor="middle">B</text>
          <text x={C.x + 10} y={C.y + 14} fill={txt} fontSize="12" textAnchor="middle">C</text>
          <text x={(A.x + B.x) / 2 - 18} y={(A.y + B.y) / 2} fill={txt} fontSize="12">{diagram.sideAB}</text>
          <text x={(B.x + C.x) / 2} y={B.y + 14} fill={txt} fontSize="12" textAnchor="middle">{diagram.sideBC}</text>
          <text x={(A.x + C.x) / 2 + 6} y={(A.y + C.y) / 2} fill={txt} fontSize="12">{diagram.sideCA}</text>
        </Wrap>
      );
    }
    case 'triangleASA': {
      const A = { x: 35, y: 120 }, B = { x: 205, y: 120 }, C = { x: 150, y: 25 };
      return (
        <Wrap>
          <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill={fill} stroke={accent} strokeWidth="2" />
          <text x={A.x - 8} y={A.y + 14} fill={txt} fontSize="12">A ({diagram.angleA}°)</text>
          <text x={B.x - 20} y={B.y + 14} fill={txt} fontSize="12">B ({diagram.angleB}°)</text>
          <text x={C.x} y={C.y - 8} fill={txt} fontSize="12" textAnchor="middle">C</text>
          <text x={(A.x + B.x) / 2} y={A.y + 18} fill={txt} fontSize="12" textAnchor="middle">{diagram.sideA}</text>
        </Wrap>
      );
    }
    case 'straightLineAngles': {
      const cx = 120, cy = 100;
      return (
        <Wrap>
          <line x1={15} y1={cy} x2={225} y2={cy} stroke={line2} strokeWidth="2" />
          <line x1={cx} y1={cy} x2={cx - 35} y2={30} stroke={accent} strokeWidth="2" />
          <text x={cx - 60} y={cy - 12} fill={txt} fontSize="13">{diagram.aLabel || `${diagram.a}°`}</text>
          <text x={cx + 18} y={cy - 12} fill={txt} fontSize="13">{diagram.bLabel || (diagram.b != null ? `${diagram.b}°` : '?')}</text>
        </Wrap>
      );
    }
    case 'triangleAngles': {
      const A = { x: 120, y: 20 }, B = { x: 30, y: 125 }, C = { x: 210, y: 125 };
      return (
        <Wrap>
          <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill={fill} stroke={accent} strokeWidth="2" />
          <text x={B.x + 12} y={B.y - 8} fill={txt} fontSize="12">{diagram.a}°</text>
          <text x={C.x - 28} y={C.y - 8} fill={txt} fontSize="12">{diagram.b}°</text>
          <text x={A.x} y={A.y + 20} fill={accent} fontSize="12" textAnchor="middle" fontWeight="700">{diagram.c != null ? `${diagram.c}°` : '?'}</text>
        </Wrap>
      );
    }
    case 'polygon': {
      const n = diagram.n, cx = 120, cy = 75, r = 50;
      const pts = Array.from({ length: n }, (_, i) => {
        const a = (Math.PI * 2 * i) / n - Math.PI / 2;
        return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
      }).join(' ');
      return (
        <Wrap>
          <polygon points={pts} fill={fill} stroke={accent} strokeWidth="2" />
          <text x={cx} y={cy + 4} fill={txt} fontSize="12" textAnchor="middle" opacity="0.8">{n}-gon</text>
        </Wrap>
      );
    }
    case 'similarShapes': {
      const r1 = diagram.r1, r2 = diagram.r2, s1 = 28, s2 = s1 * (r2 / r1);
      return (
        <Wrap h={130}>
          <rect x={30} y={65 - s1 / 2} width={s1} height={s1} fill={fill} stroke={accent} strokeWidth="2" />
          <text x={30 + s1 / 2} y={65 + s1 / 2 + 16} fill={txt} fontSize="12" textAnchor="middle">{r1}</text>
          <rect x={130} y={65 - s2 / 2} width={s2} height={s2} fill={fill} stroke={accent} strokeWidth="2" />
          <text x={130 + s2 / 2} y={65 + s2 / 2 + 16} fill={txt} fontSize="12" textAnchor="middle">{r2}</text>
          <text x={120} y={20} fill={txt} fontSize="11" textAnchor="middle" opacity="0.7">similar shapes (ratio {r1}:{r2})</text>
        </Wrap>
      );
    }
    case 'areaShape': {
      const bw = Math.min(170, 60 + diagram.base * 4), bh = Math.min(90, 30 + diagram.height * 4);
      const x0 = (W - bw) / 2, y0 = 115;
      const isPara = diagram.shape === 'parallelogram';
      const skew = isPara ? bh * 0.4 : 0;
      const pts = isPara
        ? `${x0 + skew},${y0 - bh} ${x0 + bw + skew},${y0 - bh} ${x0 + bw},${y0} ${x0},${y0}`
        : `${x0},${y0} ${x0 + bw},${y0} ${x0 + bw},${y0 - bh} ${x0},${y0 - bh}`;
      return (
        <Wrap>
          <polygon points={pts} fill={fill} stroke={accent} strokeWidth="2" />
          <text x={x0 + bw / 2} y={y0 + 16} fill={txt} fontSize="12" textAnchor="middle">base = {diagram.base} cm</text>
          <text x={x0 - 8} y={y0 - bh / 2} fill={txt} fontSize="12" textAnchor="end">h = {diagram.height} cm</text>
        </Wrap>
      );
    }
    case 'circle': {
      const r = 45;
      return (
        <Wrap h={130}>
          <circle cx={120} cy={65} r={r} fill={fill} stroke={accent} strokeWidth="2" />
          <line x1={120} y1={65} x2={120 + r} y2={65} stroke={line2} strokeWidth="1.5" />
          <text x={120 + r / 2} y={58} fill={txt} fontSize="11" textAnchor="middle">{diagram.label || `r = ${diagram.r}`}</text>
        </Wrap>
      );
    }
    case 'sector': {
      const r = 50, cx = 120, cy = 90, a0 = -90, a1 = -90 + diagram.angle;
      const toXY = (deg) => { const rad = (deg * Math.PI) / 180; return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]; };
      const [x0, y0] = toXY(a0), [x1, y1] = toXY(a1);
      const large = diagram.angle > 180 ? 1 : 0;
      return (
        <Wrap>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={line} strokeWidth="1" strokeDasharray="3,3" />
          <path d={`M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`} fill={fill} stroke={accent} strokeWidth="2" />
          <text x={cx} y={cy - 8} fill={txt} fontSize="12" textAnchor="middle">{diagram.angle}°</text>
          <text x={(cx + x0) / 2 - 10} y={(cy + y0) / 2} fill={txt} fontSize="11">r={diagram.r}</text>
          {diagram.showArc && <text x={cx} y={cy + 18} fill={accent} fontSize="10" textAnchor="middle">arc</text>}
        </Wrap>
      );
    }
    case 'bearing': {
      const cx = 120, cy = 80, r = 48, rad = (diagram.bearingDeg * Math.PI) / 180;
      const px = cx + r * Math.sin(rad), py = cy - r * Math.cos(rad);
      return (
        <Wrap>
          <line x1={cx} y1={cy + r} x2={cx} y2={cy - r} stroke={line} strokeWidth="1" strokeDasharray="3,3" />
          <text x={cx} y={cy - r - 6} fill={txt} fontSize="11" textAnchor="middle">N</text>
          <line x1={cx} y1={cy} x2={px} y2={py} stroke={accent} strokeWidth="2.5" markerEnd="url(#arrow)" />
          <circle cx={cx} cy={cy} r={3} fill={txt} />
          <text x={cx + 10} y={cy - 6} fill={txt} fontSize="11">{diagram.bearingDeg}°</text>
          {diagram.dist && <text x={(cx + px) / 2 + 10} y={(cy + py) / 2} fill={txt} fontSize="11">{diagram.dist}</text>}
        </Wrap>
      );
    }
    case 'coordPlot': {
      const pad = 22, gw = W - pad * 2, gh = H - pad * 2;
      const xs = diagram.points.map(p => p.x), ys = diagram.points.map(p => p.y);
      const minX = Math.min(0, ...xs) - 1, maxX = Math.max(0, ...xs) + 1;
      const minY = Math.min(0, ...ys) - 1, maxY = Math.max(0, ...ys) + 1;
      const toX = (x) => pad + ((x - minX) / (maxX - minX)) * gw;
      const toY = (y) => H - pad - ((y - minY) / (maxY - minY)) * gh;
      const mid = diagram.showMidpoint ? { x: (diagram.points[0].x + diagram.points[1].x) / 2, y: (diagram.points[0].y + diagram.points[1].y) / 2 } : null;
      return (
        <Wrap>
          <line x1={toX(minX)} y1={toY(0)} x2={toX(maxX)} y2={toY(0)} stroke={line} strokeWidth="1" />
          <line x1={toX(0)} y1={toY(minY)} x2={toX(0)} y2={toY(maxY)} stroke={line} strokeWidth="1" />
          {diagram.showLine && <line x1={toX(diagram.points[0].x)} y1={toY(diagram.points[0].y)} x2={toX(diagram.points[1].x)} y2={toY(diagram.points[1].y)} stroke={accent} strokeWidth="2" />}
          {diagram.points.map((p, i) => (
            <g key={i}>
              <circle cx={toX(p.x)} cy={toY(p.y)} r={4} fill={accent} />
              <text x={toX(p.x) + 7} y={toY(p.y) - 6} fill={txt} fontSize="11">{p.label} ({p.x},{p.y})</text>
            </g>
          ))}
          {mid && <circle cx={toX(mid.x)} cy={toY(mid.y)} r={3} fill={txt} opacity="0.7" />}
        </Wrap>
      );
    }
    case 'linearGraph': {
      const pad = 24, gw = W - pad * 2, gh = H - pad * 2;
      const minX = -6, maxX = 6;
      const toX = (x) => pad + ((x - minX) / (maxX - minX)) * gw;
      const yAt = (x) => diagram.m * x + diagram.c;
      const ys = [yAt(minX), yAt(maxX)];
      const minY = Math.min(-6, ...ys), maxY = Math.max(6, ...ys);
      const toY = (y) => H - pad - ((y - minY) / (maxY - minY)) * gh;
      return (
        <Wrap>
          <line x1={toX(minX)} y1={toY(0)} x2={toX(maxX)} y2={toY(0)} stroke={line} strokeWidth="1" />
          <line x1={toX(0)} y1={toY(minY)} x2={toX(0)} y2={toY(maxY)} stroke={line} strokeWidth="1" />
          <line x1={toX(minX)} y1={toY(yAt(minX))} x2={toX(maxX)} y2={toY(yAt(maxX))} stroke={accent} strokeWidth="2.5" />
          <text x={W - 36} y={20} fill={txt} fontSize="12">y = {diagram.m}x {diagram.c >= 0 ? '+' : '−'} {Math.abs(diagram.c)}</text>
        </Wrap>
      );
    }
    case 'quadGraph': {
      const pad = 24, gw = W - pad * 2, gh = H - pad * 2;
      const h = diagram.h || 0, a = diagram.a || 1, c = diagram.c || 0;
      const yAt = (x) => a * (x - h) * (x - h) + c;
      const minX = h - 6, maxX = h + 6;
      const pts = [];
      for (let x = minX; x <= maxX; x += 0.5) pts.push([x, yAt(x)]);
      const ys = pts.map(p => p[1]);
      const minY = Math.min(...ys), maxY = Math.max(...ys);
      const toX = (x) => pad + ((x - minX) / (maxX - minX)) * gw;
      const toY = (y) => H - pad - ((y - minY) / ((maxY - minY) || 1)) * gh;
      const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p[0])} ${toY(p[1])}`).join(' ');
      return (
        <Wrap>
          <line x1={pad} y1={toY(0)} x2={W - pad} y2={toY(0)} stroke={line} strokeWidth="1" />
          <line x1={toX(0)} y1={pad} x2={toX(0)} y2={H - pad} stroke={line} strokeWidth="1" />
          <path d={path} fill="none" stroke={accent} strokeWidth="2.5" />
          {diagram.roots && diagram.roots.map((rt, i) => (
            <circle key={i} cx={toX(rt)} cy={toY(0)} r={3.5} fill={txt} />
          ))}
        </Wrap>
      );
    }
    case 'cuboid': {
      const ox = 55, oy = 110, fw = 100, fh = 65, dx = 35, dy = -28;
      const scale = (v) => Math.max(0.5, Math.min(1.6, v / 10));
      const w = fw * scale(diagram.w), h = fh * scale(diagram.h), d = dx * scale(diagram.l), dyy = dy * scale(diagram.l);
      return (
        <Wrap>
          <polygon points={`${ox},${oy} ${ox + w},${oy} ${ox + w},${oy - h} ${ox},${oy - h}`} fill={fill} stroke={accent} strokeWidth="2" />
          <polygon points={`${ox},${oy - h} ${ox + d},${oy - h + dyy} ${ox + w + d},${oy - h + dyy} ${ox + w},${oy - h}`} fill={`${accent}15`} stroke={accent} strokeWidth="1.5" />
          <polygon points={`${ox + w},${oy} ${ox + w + d},${oy + dyy} ${ox + w + d},${oy - h + dyy} ${ox + w},${oy - h}`} fill={`${accent}30`} stroke={accent} strokeWidth="1.5" />
          <line x1={ox} y1={oy} x2={ox + w + d} y2={oy + dyy} stroke={line2} strokeWidth="1.5" strokeDasharray="3,2" />
          <text x={ox + w / 2} y={oy + 16} fill={txt} fontSize="11" textAnchor="middle">{diagram.w} cm</text>
          <text x={ox - 6} y={oy - h / 2} fill={txt} fontSize="11" textAnchor="end">{diagram.h} cm</text>
          <text x={ox + w + d / 2 + 6} y={oy + dyy / 2 - 4} fill={txt} fontSize="11">{diagram.l} cm</text>
        </Wrap>
      );
    }
    case 'dataBar': {
      const data = diagram.data, pad = 20, bw = (W - pad * 2) / data.length - 6;
      const maxV = Math.max(...data);
      return (
        <Wrap h={120}>
          {data.map((v, i) => {
            const bh = (v / maxV) * 75;
            const x = pad + i * (bw + 6);
            return (
              <g key={i}>
                <rect x={x} y={100 - bh} width={bw} height={bh} fill={fill} stroke={accent} strokeWidth="1.5" />
                <text x={x + bw / 2} y={113} fill={txt} fontSize="9" textAnchor="middle">{v}</text>
              </g>
            );
          })}
        </Wrap>
      );
    }
    case 'histBar': {
      const w = diagram.width, fd = diagram.fd !== undefined ? diagram.fd : round2(diagram.freq / diagram.width);
      const bw = Math.min(140, 30 + w * 4), bh = Math.min(90, 20 + fd * 8);
      return (
        <Wrap h={130}>
          <line x1={20} y1={115} x2={220} y2={115} stroke={line} strokeWidth="1" />
          <line x1={20} y1={115} x2={20} y2={15} stroke={line} strokeWidth="1" />
          <rect x={40} y={115 - bh} width={bw} height={bh} fill={fill} stroke={accent} strokeWidth="2" />
          <text x={40 + bw / 2} y={128} fill={txt} fontSize="10" textAnchor="middle">class width {w}</text>
          <text x={10} y={12} fill={txt} fontSize="9" opacity="0.7">freq density</text>
        </Wrap>
      );
    }
    case 'groupedBar': {
      const classes = diagram.classes, pad = 20, bw = (W - pad * 2) / classes.length - 4;
      const maxF = Math.max(...classes.map(c => c.freq));
      return (
        <Wrap h={130}>
          {classes.map((c, i) => {
            const bh = (c.freq / maxF) * 85;
            const x = pad + i * (bw + 4);
            return (
              <g key={i}>
                <rect x={x} y={110 - bh} width={bw} height={bh} fill={fill} stroke={accent} strokeWidth="1.5" />
                <text x={x + bw / 2} y={122} fill={txt} fontSize="8" textAnchor="middle">{c.lo}-{c.hi}</text>
              </g>
            );
          })}
        </Wrap>
      );
    }
    default:
      return null;
  }
}
function round2(n) { return Math.round(n * 100) / 100; }

function ClimbingScreen({ climbers, currentQuestion, timeLeft, answered, selectedOption, isCorrect, handleAnswer, stats, fbOpenFor, openFeedbackFor, fbText, setFbText, sendFeedback, fbSentIds }) {
  const timerPct = Math.max(0, (timeLeft / currentQuestion.time) * 100);
  const timerColor = timerPct > 50 ? '#9BC6F5' : timerPct > 20 ? '#F2C879' : '#F5A3C7';
  const topicMeta = TOPICS.find(t => t.id === currentQuestion.topic);

  return (
    <div>
      <div className="relative rounded-xl p-4 mb-5 h-40" style={{ background: '#242840', border: '1px solid rgba(244,241,234,0.08)' }}>
        <Mountain size={100} color="rgba(244,241,234,0.08)" className="absolute right-4 bottom-0" />
        {climbers.map((r, i) => (
          <div key={r.id} className="absolute peak-climb" style={{ left: `${10 + i * 22}%`, bottom: `${8 + r.progress * 0.8}%` }}>
            <div className="w-4 h-4 rounded-full" style={{ background: r.color, boxShadow: `0 0 8px ${r.color}` }} />
            <div className="fm text-[9px] opacity-60 text-center mt-1">{r.name}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4 fm text-xs opacity-60">
        <span>SCORE {stats.correct}/{stats.total}</span>
        <span>Q{stats.total + 1}</span>
      </div>

      <div className="h-2 rounded-full overflow-hidden mb-4" style={{ background: 'rgba(244,241,234,0.1)' }}>
        <div className="h-full transition-all duration-100 linear" style={{ width: `${timerPct}%`, background: timerColor }} />
      </div>

      <div className={`rounded-xl p-6 mb-5 ${answered && !isCorrect ? 'shakeit' : ''}`} style={{ background: '#242840', border: '1px solid rgba(244,241,234,0.08)' }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="fm text-[10px] uppercase tracking-widest px-2 py-1 rounded" style={{ background: `${topicMeta.color}22`, color: topicMeta.color }}>
            {topicMeta.label}
          </span>
          {currentQuestion.ref && (
            <span className="fm text-[10px] px-2 py-1 rounded opacity-60" style={{ border: '1px solid rgba(244,241,234,0.2)' }}>
              Edexcel 4MA1 • {currentQuestion.ref}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 fm text-[10px] opacity-45">
            <BookOpen size={11} /> {topicMeta.source}
          </div>
          {fbSentIds.includes(currentQuestion.id) ? (
            <span className="fb text-[10px] opacity-50 flex items-center gap-1"><Check size={11} /> Feedback sent</span>
          ) : (
            <button onClick={() => openFeedbackFor(currentQuestion.id)} className="fb text-[10px] opacity-50 hover:opacity-90 flex items-center gap-1" style={{ color: '#F4F1EA' }}>
              <MessageSquare size={11} /> Flag this question
            </button>
          )}
        </div>
        <div className="fd text-2xl tracking-wide leading-snug">{currentQuestion.q}</div>
        {currentQuestion.diagram && <QuestionDiagram diagram={currentQuestion.diagram} accent="#9BC6F5" />}
        {fbOpenFor === currentQuestion.id && (
          <div className="mt-4 pop">
            <textarea
              value={fbText}
              onChange={e => setFbText(e.target.value)}
              placeholder="What's wrong with this question? (e.g. wrong answer, confusing wording, typo)"
              className="fb w-full rounded-lg px-3 py-2 text-sm outline-none"
              rows={2}
              style={{ background: '#1B1E2B', border: '1px solid rgba(244,241,234,0.2)', color: '#F4F1EA' }}
            />
            <div className="flex justify-end mt-2">
              <button onClick={() => sendFeedback(currentQuestion)} disabled={!fbText.trim()} className="fb rounded-lg px-3 py-2 text-xs font-semibold flex items-center gap-1" style={{ background: fbText.trim() ? '#9BC6F5' : 'rgba(244,241,234,0.15)', color: '#1B1E2B' }}>
                <Send size={13} /> Send to Mr. Al-Daboubi
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {currentQuestion.options.map((opt, i) => {
          let bg = '#242840';
          let border = 'rgba(244,241,234,0.12)';
          let textColor = '#F4F1EA';
          if (answered) {
            if (i === currentQuestion.answer) { bg = '#9BC6F522'; border = '#9BC6F5'; }
            else if (i === selectedOption) { bg = '#F5A3C722'; border = '#F5A3C7'; }
          }
          return (
            <button key={i} onClick={() => handleAnswer(i)} disabled={answered} className="fb text-left rounded-lg px-4 py-4 text-sm font-semibold flex items-center justify-between transition-colors" style={{ background: bg, border: `2px solid ${border}`, color: textColor }}>
              <span>{opt}</span>
              {answered && i === currentQuestion.answer && <Check size={18} color="#9BC6F5" />}
              {answered && i === selectedOption && i !== currentQuestion.answer && <X size={18} color="#F5A3C7" />}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-4 flex items-center gap-2 fb text-sm pop" style={{ color: isCorrect ? '#9BC6F5' : '#F5A3C7' }}>
          {isCorrect ? 'Correct — higher ground gained!' : 'Not quite — hold your footing and climb on.'}
        </div>
      )}
    </div>
  );
}

function ResultsScreen({ standings, accuracy, avgTime, totalClimbTime, playerName, setPlayerName, saveScore, saved, startClimb, goToLeaderboard }) {
  const medalColor = ['#F2C94C', '#C4C9D4', '#C97B4A', null];
  return (
    <div className="pop">
      <div className="relative mb-6 rounded-xl p-6 text-center overflow-hidden" style={{ background: '#242840', border: '1px solid rgba(244,241,234,0.08)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ animation: 'flash 0.8s ease-out', background: '#F4F1EA' }} />
        <Trophy size={36} color="#9BC6F5" className="mx-auto mb-2" />
        <div className="fd text-3xl tracking-wide">CLIMB COMPLETE</div>
      </div>

      <div className="mb-6">
        {standings.map((r, i) => (
          <div key={r.id} className="flex items-center justify-between rounded-lg px-4 py-3 mb-2" style={{ background: r.isPlayer ? '#9BC6F518' : '#242840', border: `1px solid ${r.isPlayer ? '#9BC6F5' : 'rgba(244,241,234,0.08)'}` }}>
            <div className="flex items-center gap-3">
              <span className="fd text-xl w-6 text-center" style={{ color: medalColor[i] || 'rgba(244,241,234,0.5)' }}>{i + 1}</span>
              {i < 3 ? <Medal size={16} color={medalColor[i]} /> : <span className="w-4" />}
              <span className="fb text-sm font-semibold" style={{ color: r.color }}>{r.name}</span>
            </div>
            <span className="fm text-xs opacity-60">{Math.round(r.progress)}% ascent</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatBox label="Accuracy" value={`${accuracy}%`} />
        <StatBox label="Avg / Q" value={`${avgTime}s`} />
        <StatBox label="Climb Time" value={formatTime(totalClimbTime)} />
      </div>

      {!saved ? (
        <div className="flex items-center gap-2 mb-6">
          <input value={playerName} onChange={e => setPlayerName(e.target.value)} placeholder="Enter your name for the leaderboard" className="fb flex-1 rounded-lg px-4 py-3 text-sm outline-none" style={{ background: '#242840', border: '1px solid rgba(244,241,234,0.15)', color: '#F4F1EA' }} maxLength={24} />
          <button onClick={saveScore} disabled={!playerName.trim()} className="fb rounded-lg px-4 py-3 text-sm font-semibold" style={{ background: playerName.trim() ? '#9BC6F5' : 'rgba(244,241,234,0.15)', color: '#1B1E2B' }}>Save</button>
        </div>
      ) : (
        <div className="fb text-sm mb-6 flex items-center gap-2" style={{ color: '#9BC6F5' }}>
          <Check size={16} /> Saved to the leaderboard.
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={startClimb} className="fd flex-1 flex items-center justify-center gap-2 rounded-lg py-4 text-xl tracking-wide" style={{ background: '#9BC6F5', color: '#1B1E2B' }}>
          <RotateCcw size={18} /> CLIMB AGAIN
        </button>
        <button onClick={goToLeaderboard} className="fb rounded-lg px-4 py-4 text-sm font-semibold flex items-center gap-2" style={{ border: '2px solid rgba(244,241,234,0.15)', color: '#F4F1EA' }}>
          <ListOrdered size={18} /> Leaderboard
        </button>
      </div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="rounded-lg p-3 text-center" style={{ background: '#242840', border: '1px solid rgba(244,241,234,0.08)' }}>
      <div className="fm text-lg" style={{ color: '#9BC6F5' }}>{value}</div>
      <div className="fb text-[10px] uppercase tracking-widest opacity-50 mt-1">{label}</div>
    </div>
  );
}

function LeaderboardScreen({ leaderboard, loading, backToSetup }) {
  return (
    <div className="pop">
      <div className="flex items-center gap-2 mb-5">
        <Award size={22} color="#9BC6F5" />
        <div className="fd text-2xl tracking-wide">TOP CLIMBERS</div>
      </div>

      {loading && <div className="fb text-sm opacity-60">Loading results…</div>}
      {!loading && leaderboard.length === 0 && (
        <div className="fb text-sm opacity-60 mb-6">No climbs saved yet — be the first to reach the summit and add your name.</div>
      )}
      {!loading && leaderboard.length > 0 && (
        <div className="mb-6">
          {leaderboard.map((e, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg px-4 py-3 mb-2" style={{ background: '#242840', border: '1px solid rgba(244,241,234,0.08)' }}>
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
      <button onClick={backToSetup} className="fd w-full flex items-center justify-center gap-2 rounded-lg py-4 text-xl tracking-wide" style={{ background: '#9BC6F5', color: '#1B1E2B' }}>
        <ChevronRight size={18} /> BACK TO SETUP
      </button>
    </div>
  );
}

function FeedbackScreen({ feedbackList, loading, backToSetup }) {
  return (
    <div className="pop">
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare size={22} color="#9BC6F5" />
        <div className="fd text-2xl tracking-wide">QUESTION FEEDBACK</div>
      </div>
      <div className="fb text-xs opacity-50 mb-5">Flagged by students • visible only to Mr. Al-Daboubi</div>

      {loading && <div className="fb text-sm opacity-60">Loading feedback…</div>}
      {!loading && feedbackList.length === 0 && (
        <div className="fb text-sm opacity-60 mb-6">No feedback submitted yet.</div>
      )}
      {!loading && feedbackList.length > 0 && (
        <div className="mb-6 flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1 topic-scroll">
          {feedbackList.map((e, i) => (
            <div key={i} className="rounded-lg px-4 py-3" style={{ background: '#242840', border: '1px solid rgba(244,241,234,0.08)' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="fm text-[10px] uppercase tracking-widest opacity-60">{e.chapter}</span>
                <span className="fm text-[10px] opacity-40">{new Date(e.date).toLocaleString()}</span>
              </div>
              <div className="fb text-xs opacity-70 mb-1 italic">"{e.question}"</div>
              <div className="fb text-sm">{e.text}</div>
            </div>
          ))}
        </div>
      )}
      <button onClick={backToSetup} className="fd w-full flex items-center justify-center gap-2 rounded-lg py-4 text-xl tracking-wide" style={{ background: '#9BC6F5', color: '#1B1E2B' }}>
        <ChevronRight size={18} /> BACK TO SETUP
      </button>
    </div>
  );
}
