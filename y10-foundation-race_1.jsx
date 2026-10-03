import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Check, X, Play, RotateCcw, Award, Car, ChevronRight, ListOrdered, Medal, Flag, BookOpen, MessageSquare, Send } from 'lucide-react';

const QUESTION_TIME = 60; // 1 minute per question, Foundation tier

const TOPICS = [
  { id: 'numbers', label: 'Ch.1 Numbers', color: '#F5D76E', source: 'Y10 • T1 Wk1 • Edexcel 4MA1 Past Papers' },
  { id: 'accuracy', label: 'Ch.2 Degree of Accuracy', color: '#F2789F', source: 'Y10 • T1 Wk2 • Edexcel 4MA1 Past Papers' },
  { id: 'factorising', label: 'Ch.3 Brackets & Factorising', color: '#6EC6F5', source: 'Y10 • T1 Wk2-3 • Edexcel 4MA1 Past Papers' },
  { id: 'algfrac', label: 'Ch.4 Algebraic Fractions', color: '#F2A65A', source: 'Y10 • T1 Wk3-4 • Edexcel 4MA1 Past Papers' },
  { id: 'equations', label: 'Ch.5 Equations', color: '#8FD694', source: 'Y10 • T1 Wk4-5 • Edexcel 4MA1 Past Papers' },
  { id: 'units', label: 'Ch.6 Units', color: '#C99BE8', source: 'Y10 • T1 Wk5 • Edexcel 4MA1 Past Papers' },
  { id: 'indices', label: 'Ch.7 Indices & Surds', color: '#F5D76E', source: 'Y10 • T1 Wk5 • Edexcel 4MA1 Past Papers' },
  { id: 'pythagoras', label: 'Ch.8 Lines & Pythagoras', color: '#F2789F', source: 'Y10 • T1 Wk6 • Edexcel 4MA1 Past Papers' },
  { id: 'quad', label: 'Ch.9 Quadrilaterals', color: '#6EC6F5', source: 'Y10 • T1 Wk8 • Edexcel 4MA1 Past Papers' },
  { id: 'circles', label: 'Ch.10 Circles', color: '#F2A65A', source: 'Y10 • T1 Wk9 • Edexcel 4MA1 Past Papers' },
  { id: 'coordgeo', label: 'Ch.11 Coordinate Geometry', color: '#8FD694', source: 'Y10 • T1 Wk10 • Edexcel 4MA1 Past Papers' },
  { id: 'graphs', label: 'Ch.12 Graphs & Transformations', color: '#C99BE8', source: 'Y10 • T1 Wk11-12 • Edexcel 4MA1 Past Papers' },
  { id: 'rates', label: 'Ch.13 Rates & Kinematics', color: '#F5D76E', source: 'Y10 • T1 Wk13 • Edexcel 4MA1 Past Papers' },
  { id: 'sets', label: 'Ch.14 Sets & Venn Diagrams', color: '#F2789F', source: 'Y10 • T2 Wk16-17 • Edexcel 4MA1 Past Papers' },
  { id: 'trig', label: 'Ch.15-16 Trigonometry & Bearings', color: '#6EC6F5', source: 'Y10 • T2 Wk18-21 • Edexcel 4MA1 Past Papers' },
  { id: 'probability', label: 'Ch.17 Probability', color: '#F2A65A', source: 'Y10 • T2 Wk22-23 • Edexcel 4MA1 Past Papers' },
  { id: 'histograms', label: 'Ch.18 Histograms & Statistics', color: '#8FD694', source: 'Y10 • T2 Wk24 • Edexcel 4MA1 Past Papers' },
];

const RACERS_TEMPLATE = [
  { id: 'player', name: 'You', color: '#F5D76E', isPlayer: true },
  { id: 'zayed', name: 'Zayed', color: '#F2789F', isPlayer: false },
  { id: 'mei', name: 'Mei', color: '#6EC6F5', isPlayer: false },
  { id: 'lucas', name: 'Lucas', color: '#F2A65A', isPlayer: false },
];

// ref = real Edexcel 4MA1 paper citation where verified from the department's past-paper topic
// compilations; questions without a ref are written to match that same Foundation style/difficulty.
const QUESTIONS = [
  // Ch numbers — 50 questions (8 from real Edexcel 4MA1 past papers, 42 practice questions in the same style)
  { id: "nu1", topic: "numbers", ref: "June 2026 1F Q4", q: "Write 9547 correct to the nearest hundred", options: ["9500", "9600", "9550", "9000"], answer: 0 },
  { id: "nu2", topic: "numbers", ref: "June 2026 1F Q4", q: "In the number 1.487, what is the value of the digit 8?", options: ["8 hundredths", "8 tenths", "8 tens", "8 thousandths"], answer: 0 },
  { id: "nu3", topic: "numbers", ref: "June 2026 1F Q4", q: "Which of these is smallest? 3.6, 3.006, 3.61, 3.601, 3.06", options: ["3.006", "3.06", "3.6", "3.601"], answer: 0 },
  { id: "nu4", topic: "numbers", ref: "June 2026 2F Q4", q: "Which of these fractions gives a terminating decimal? 2/3, 5/9, 11/16, 9/17", options: ["11/16", "2/3", "5/9", "9/17"], answer: 0 },
  { id: "nu5", topic: "numbers", ref: "June 2026 2F Q4", q: "A number machine: input → ÷6 → +7 → output. Find the output when the input is 48", options: ["15", "8", "14", "55"], answer: 0 },
  { id: "nu6", topic: "numbers", ref: "Jan 2023 1F Q4", q: "Find the square root of 1296", options: ["36", "34", "38", "46"], answer: 0 },
  { id: "nu7", topic: "numbers", ref: "Jan 2023 1F Q4", q: "Which of these is smallest? 0.204, 0.24, 0.04, 0.2, 0.042", options: ["0.04", "0.042", "0.204", "0.2"], answer: 0 },
  { id: "nu8", topic: "numbers", ref: "Jan 2023 1F Q4", q: "Write 25.78621 correct to 2 decimal places", options: ["25.79", "25.78", "25.8", "25.786"], answer: 0 },
  { id: "nu_sq1", topic: "numbers", q: "Work out 9²", options: ["81", "18", "100", "64"], answer: 0 },
  { id: "nu_ord2", topic: "numbers", q: "Which of these is smallest? 2.009, 4.195, 7.959, 4.444, 0.242", options: ["4.195", "7.959", "2.009", "0.242"], answer: 3 },
  { id: "nu_sf3", topic: "numbers", q: "Round 156.274 to 1 significant figure", options: ["160", "156.3", "200", "241"], answer: 2 },
  { id: "nu_ord4", topic: "numbers", q: "Which of these is largest? 1.588, 5.712, 1.266, 2.87, 5.591", options: ["5.712", "1.266", "2.87", "5.591"], answer: 0 },
  { id: "nu_r5", topic: "numbers", q: "Write 232 correct to the nearest ten", options: ["250", "220", "230", "240"], answer: 2 },
  { id: "nu_ord6", topic: "numbers", q: "Which of these is smallest? 2.847, 5.741, 0.434, 8.688, 2.095", options: ["2.847", "0.434", "2.095", "8.688"], answer: 1 },
  { id: "nu_r7", topic: "numbers", q: "Write 8866 correct to the nearest hundred", options: ["7119", "8800", "9000", "8900"], answer: 3 },
  { id: "nu_sf8", topic: "numbers", q: "Round 634.24 to 1 significant figure", options: ["539", "634.2", "630", "600"], answer: 3 },
  { id: "nu_sq9", topic: "numbers", q: "Work out 16²", options: ["256", "32", "225", "289"], answer: 0 },
  { id: "nu_r10", topic: "numbers", q: "Write 701 correct to the nearest ten", options: ["710", "700", "690", "720"], answer: 1 },
  { id: "nu_sf11", topic: "numbers", q: "Round 594.246 to 1 significant figure", options: ["600", "661", "594.2", "590"], answer: 0 },
  { id: "nu_ord12", topic: "numbers", q: "Which of these is smallest? 9.527, 2.851, 9.445, 2.812, 8.733", options: ["9.527", "2.851", "8.733", "2.812"], answer: 3 },
  { id: "nu_sq13", topic: "numbers", q: "Work out 7²", options: ["64", "36", "49", "14"], answer: 2 },
  { id: "nu_r14", topic: "numbers", q: "Write 35458 correct to the nearest thousand", options: ["37000", "36000", "35000", "34000"], answer: 2 },
  { id: "nu_sf15", topic: "numbers", q: "Round 84.536 to 2 significant figures", options: ["85", "80", "84.5", "84.54"], answer: 0 },
  { id: "nu_r16", topic: "numbers", q: "Write 19449 correct to the nearest thousand", options: ["21000", "18000", "19000", "20000"], answer: 2 },
  { id: "nu_ord17", topic: "numbers", q: "Which of these is smallest? 9.567, 0.749, 3.429, 1.874, 9.623", options: ["1.874", "9.623", "0.749", "3.429"], answer: 2 },
  { id: "nu_sf18", topic: "numbers", q: "Round 336.64 to 3 significant figures", options: ["336.6", "340", "336.64", "337"], answer: 3 },
  { id: "nu_sf19", topic: "numbers", q: "Round 199.611 to 3 significant figures", options: ["199.6", "200", "261", "199.611"], answer: 1 },
  { id: "nu_r20", topic: "numbers", q: "Write 9384 correct to the nearest hundred", options: ["9300", "11282", "9400", "9500"], answer: 2 },
  { id: "nu_cb21", topic: "numbers", q: "Work out 2³", options: ["6", "8", "4", "27"], answer: 1 },
  { id: "nu_r22", topic: "numbers", q: "Write 9593 correct to the nearest hundred", options: ["9600", "9700", "6722", "9500"], answer: 0 },
  { id: "nu_r23", topic: "numbers", q: "Write 31409 correct to the nearest thousand", options: ["33000", "30000", "31000", "32000"], answer: 2 },
  { id: "nu_cb24", topic: "numbers", q: "Work out 12³", options: ["36", "2197", "1728", "144"], answer: 2 },
  { id: "nu_ord25", topic: "numbers", q: "Which of these is largest? 6.131, 4.855, 5.822, 5.795, 2.782", options: ["5.822", "2.782", "6.131", "5.795"], answer: 2 },
  { id: "nu_cb26", topic: "numbers", q: "Work out 3³", options: ["27", "64", "9", "33.4"], answer: 0 },
  { id: "nu_r27", topic: "numbers", q: "Write 16451 correct to the nearest thousand", options: ["15000", "17000", "16000", "18000"], answer: 2 },
  { id: "nu_sf28", topic: "numbers", q: "Round 844.152 to 3 significant figures", options: ["844.152", "844.2", "844", "840"], answer: 2 },
  { id: "nu_ord29", topic: "numbers", q: "Which of these is largest? 5.82, 7.949, 2, 4.445, 5.069", options: ["7.949", "5.82", "2", "5.069"], answer: 0 },
  { id: "nu_sf30", topic: "numbers", q: "Round 407.261 to 1 significant figure", options: ["407.3", "400", "518", "410"], answer: 1 },
  { id: "nu_r31", topic: "numbers", q: "Write 7442 correct to the nearest hundred", options: ["7300", "7400", "7600", "7500"], answer: 1 },
  { id: "nu_cb32", topic: "numbers", q: "Work out 10³", options: ["1000", "100", "30", "1331"], answer: 0 },
  { id: "nu_ord33", topic: "numbers", q: "Which of these is largest? 1.624, 7.837, 3.598, 2.899, 3.304", options: ["7.837", "3.304", "1.624", "3.598"], answer: 0 },
  { id: "nu_r34", topic: "numbers", q: "Write 36500 correct to the nearest thousand", options: ["37000", "36000", "44398", "38000"], answer: 0 },
  { id: "nu_sf35", topic: "numbers", q: "Round 801.42 to 3 significant figures", options: ["801", "801.42", "800", "801.4"], answer: 0 },
  { id: "nu_r36", topic: "numbers", q: "Write 97137 correct to the nearest thousand", options: ["97000", "98000", "96000", "99000"], answer: 0 },
  { id: "nu_ord37", topic: "numbers", q: "Which of these is smallest? 7.041, 9.159, 8.073, 8.925, 4.507", options: ["9.159", "8.073", "4.507", "7.041"], answer: 2 },
  { id: "nu_sf38", topic: "numbers", q: "Round 445.38 to 1 significant figure", options: ["450", "445.4", "400", "478"], answer: 2 },
  { id: "nu_sq39", topic: "numbers", q: "Work out 8²", options: ["64", "16", "49", "81"], answer: 0 },
  { id: "nu_r40", topic: "numbers", q: "Write 791 correct to the nearest ten", options: ["790", "800", "810", "780"], answer: 0 },
  { id: "nu_sf41", topic: "numbers", q: "Round 838.665 to 1 significant figure", options: ["840", "838.7", "879", "800"], answer: 3 },
  { id: "nu_r42", topic: "numbers", q: "Write 7344 correct to the nearest hundred", options: ["7400", "7200", "7300", "7500"], answer: 2 },
  // Ch accuracy — 50 questions (6 from real Edexcel 4MA1 past papers, 44 practice questions in the same style)
  { id: "ac1", topic: "accuracy", ref: "June 2026 1F Q11", q: "Work out 12.5/1.4 − √10, correct to 2 significant figures", options: ["5.8", "5.7", "9.1", "5.77"], answer: 0 },
  { id: "ac2", topic: "accuracy", ref: "Nov 2025 1F Q24", q: "A bag of apples weighs 475 g correct to the nearest g. Find the lower bound", options: ["474.5 g", "475.5 g", "470 g", "474 g"], answer: 0 },
  { id: "ac3", topic: "accuracy", ref: "Nov 2025 1F Q24", q: "A box has height 120 cm correct to the nearest 10 cm. Find the upper bound", options: ["125 cm", "130 cm", "121 cm", "115 cm"], answer: 0 },
  { id: "ac4", topic: "accuracy", ref: "Nov 2024 2F Q18", q: "A table has length 1.4 m, correct to 1 d.p. Find the upper bound", options: ["1.45 m", "1.4 m", "1.44 m", "1.5 m"], answer: 0 },
  { id: "ac5", topic: "accuracy", ref: "Nov 2024 2F Q18", q: "A table has length 1.4 m, correct to 1 d.p. Find the lower bound", options: ["1.35 m", "1.3 m", "1.39 m", "1.4 m"], answer: 0 },
  { id: "ac6", topic: "accuracy", ref: "June 2023 1F Q14", q: "Work out 9/12.4 + (5.3 × 2.8)/9.64, correct to 3 significant figures", options: ["2.27", "2.26", "2.3", "15.56"], answer: 0 },
  { id: "ac_ei73", topic: "accuracy", q: "A length x = 127, correct to the nearest 1. Write the error interval for x", options: ["125.5 ≤ x < 126.5", "126 ≤ x < 128", "126.5 ≤ x < 127.5", "126.5 < x ≤ 127.5"], answer: 2 },
  { id: "ac_b74", topic: "accuracy", q: "A quantity measures 255 ml, correct to the nearest 1 ml. Find the upper bound", options: ["260 ml", "265 ml", "245 ml", "250 ml"], answer: 0 },
  { id: "ac_c75", topic: "accuracy", q: "x = 19.9 and y = 3.9, both correct to 1 d.p. Find the upper bound of the sum of x and y, correct to 2 d.p.", options: ["23.8", "26.29", "23.9", "23.7"], answer: 2 },
  { id: "ac_ei76", topic: "accuracy", q: "A length x = 181, correct to the nearest 10. Write the error interval for x", options: ["176 < x ≤ 186", "176 ≤ x < 186", "171 ≤ x < 191", "166 ≤ x < 176"], answer: 1 },
  { id: "ac_ei77", topic: "accuracy", q: "A length x = 170, correct to the nearest 1. Write the error interval for x", options: ["168.5 ≤ x < 169.5", "169.5 ≤ x < 170.5", "169.5 < x ≤ 170.5", "169 ≤ x < 171"], answer: 1 },
  { id: "ac_b78", topic: "accuracy", q: "A quantity measures 176 ml, correct to the nearest 1 ml. Find the lower bound", options: ["186 ml", "181 ml", "166 ml", "171 ml"], answer: 3 },
  { id: "ac_c79", topic: "accuracy", q: "x = 29 and y = 2.6, both correct to 1 d.p. Find the upper bound of the product of x and y, correct to 2 d.p.", options: ["76.98", "31.6", "73.82", "84.68"], answer: 0 },
  { id: "ac_ei80", topic: "accuracy", q: "A length x = 10, correct to the nearest 1. Write the error interval for x", options: ["9.5 < x ≤ 10.5", "9 ≤ x < 11", "8.5 ≤ x < 9.5", "9.5 ≤ x < 10.5"], answer: 3 },
  { id: "ac_c81", topic: "accuracy", q: "x = 38 and y = 9.6, both correct to 1 d.p. Find the lower bound of the quotient of x and y, correct to 2 d.p.", options: ["4.32", "47.6", "3.98", "3.93"], answer: 3 },
  { id: "ac_b82", topic: "accuracy", q: "A quantity measures 10.2 kg, correct to the nearest 0.1 kg. Find the upper bound", options: ["10.25 kg", "10.15 kg", "10.3 kg", "10.1 kg"], answer: 0 },
  { id: "ac_b83", topic: "accuracy", q: "A quantity measures 29 kg, correct to the nearest 0.1 kg. Find the lower bound", options: ["29.1 kg", "29.05 kg", "28.95 kg", "28.9 kg"], answer: 2 },
  { id: "ac_b84", topic: "accuracy", q: "A quantity measures 143 ml, correct to the nearest 1 ml. Find the lower bound", options: ["138 ml", "133 ml", "148 ml", "153 ml"], answer: 0 },
  { id: "ac_b85", topic: "accuracy", q: "A quantity measures 30.9 kg, correct to the nearest 0.1 kg. Find the upper bound", options: ["30.8 kg", "31 kg", "30.95 kg", "30.85 kg"], answer: 2 },
  { id: "ac_c86", topic: "accuracy", q: "x = 34.9 and y = 5.4, both correct to 1 d.p. Find the upper bound of the product of x and y, correct to 2 d.p.", options: ["40.3", "186.45", "190.48", "209.53"], answer: 2 },
  { id: "ac_b87", topic: "accuracy", q: "A quantity measures 95 cm, correct to the nearest 1 cm. Find the upper bound", options: ["95.5 cm", "96 cm", "94.5 cm", "94 cm"], answer: 0 },
  { id: "ac_ei88", topic: "accuracy", q: "A length x = 99, correct to the nearest 1. Write the error interval for x", options: ["97.5 ≤ x < 98.5", "98.5 ≤ x < 99.5", "98 ≤ x < 100", "98.5 < x ≤ 99.5"], answer: 1 },
  { id: "ac_c89", topic: "accuracy", q: "x = 24.7 and y = 6.2, both correct to 1 d.p. Find the lower bound of the quotient of x and y, correct to 2 d.p.", options: ["4.33", "30.9", "4.02", "3.94"], answer: 3 },
  { id: "ac_c90", topic: "accuracy", q: "x = 39.9 and y = 2.3, both correct to 1 d.p. Find the lower bound of the quotient of x and y, correct to 2 d.p.", options: ["18.66", "16.96", "42.2", "17.76"], answer: 1 },
  { id: "ac_b91", topic: "accuracy", q: "A quantity measures 252 cm, correct to the nearest 1 cm. Find the lower bound", options: ["252.5 cm", "251 cm", "253 cm", "251.5 cm"], answer: 3 },
  { id: "ac_b92", topic: "accuracy", q: "A quantity measures 381 ml, correct to the nearest 1 ml. Find the upper bound", options: ["376 ml", "386 ml", "371 ml", "391 ml"], answer: 1 },
  { id: "ac_ei93", topic: "accuracy", q: "A length x = 88, correct to the nearest 10. Write the error interval for x", options: ["73 ≤ x < 83", "83 < x ≤ 93", "83 ≤ x < 93", "78 ≤ x < 98"], answer: 2 },
  { id: "ac_b94", topic: "accuracy", q: "A quantity measures 21.3 kg, correct to the nearest 0.1 kg. Find the upper bound", options: ["21.4 kg", "21.2 kg", "21.35 kg", "21.25 kg"], answer: 2 },
  { id: "ac_ei95", topic: "accuracy", q: "A length x = 119, correct to the nearest 10. Write the error interval for x", options: ["109 ≤ x < 129", "114 < x ≤ 124", "114 ≤ x < 124", "104 ≤ x < 114"], answer: 2 },
  { id: "ac_b96", topic: "accuracy", q: "A quantity measures 46 cm, correct to the nearest 1 cm. Find the lower bound", options: ["47 cm", "45.5 cm", "46.5 cm", "45 cm"], answer: 1 },
  { id: "ac_ei97", topic: "accuracy", q: "A length x = 177, correct to the nearest 10. Write the error interval for x", options: ["167 ≤ x < 187", "172 ≤ x < 182", "172 < x ≤ 182", "162 ≤ x < 172"], answer: 1 },
  { id: "ac_ei98", topic: "accuracy", q: "A length x = 14, correct to the nearest 1. Write the error interval for x", options: ["12.5 ≤ x < 13.5", "13.5 ≤ x < 14.5", "13.5 < x ≤ 14.5", "13 ≤ x < 15"], answer: 1 },
  { id: "ac_b99", topic: "accuracy", q: "A quantity measures 17 kg, correct to the nearest 0.1 kg. Find the lower bound", options: ["17.05 kg", "16.95 kg", "16.9 kg", "17.1 kg"], answer: 1 },
  { id: "ac_c100", topic: "accuracy", q: "x = 32.3 and y = 5.1, both correct to 1 d.p. Find the lower bound of the quotient of x and y, correct to 2 d.p.", options: ["6.89", "6.41", "6.26", "37.4"], answer: 2 },
  { id: "ac_c101", topic: "accuracy", q: "x = 21.3 and y = 7.9, both correct to 1 d.p. Find the lower bound of the quotient of x and y, correct to 2 d.p.", options: ["29.2", "2.94", "2.72", "2.67"], answer: 3 },
  { id: "ac_ei102", topic: "accuracy", q: "A length x = 96, correct to the nearest 10. Write the error interval for x", options: ["91 ≤ x < 101", "81 ≤ x < 91", "86 ≤ x < 106", "91 < x ≤ 101"], answer: 0 },
  { id: "ac_ei103", topic: "accuracy", q: "A length x = 8, correct to the nearest 10. Write the error interval for x", options: ["-7 ≤ x < 3", "-2 ≤ x < 18", "3 ≤ x < 13", "3 < x ≤ 13"], answer: 2 },
  { id: "ac_c104", topic: "accuracy", q: "x = 11.8 and y = 10, both correct to 1 d.p. Find the upper bound of the quotient of x and y, correct to 2 d.p.", options: ["21.8", "1.19", "1.31", "1.17"], answer: 1 },
  { id: "ac_b105", topic: "accuracy", q: "A quantity measures 8 kg, correct to the nearest 0.1 kg. Find the upper bound", options: ["8.1 kg", "8.05 kg", "7.9 kg", "7.95 kg"], answer: 1 },
  { id: "ac_b106", topic: "accuracy", q: "A quantity measures 333 ml, correct to the nearest 1 ml. Find the upper bound", options: ["343 ml", "323 ml", "328 ml", "338 ml"], answer: 3 },
  { id: "ac_ei107", topic: "accuracy", q: "A length x = 115, correct to the nearest 1. Write the error interval for x", options: ["113.5 ≤ x < 114.5", "114.5 ≤ x < 115.5", "114 ≤ x < 116", "114.5 < x ≤ 115.5"], answer: 1 },
  { id: "ac_b108", topic: "accuracy", q: "A quantity measures 37.5 kg, correct to the nearest 0.1 kg. Find the upper bound", options: ["37.55 kg", "37.6 kg", "37.4 kg", "37.45 kg"], answer: 0 },
  { id: "ac_b109", topic: "accuracy", q: "A quantity measures 256 cm, correct to the nearest 1 cm. Find the lower bound", options: ["255 cm", "255.5 cm", "257 cm", "256.5 cm"], answer: 1 },
  { id: "ac_b110", topic: "accuracy", q: "A quantity measures 25.8 kg, correct to the nearest 0.1 kg. Find the lower bound", options: ["25.85 kg", "25.9 kg", "25.75 kg", "25.7 kg"], answer: 2 },
  { id: "ac_b111", topic: "accuracy", q: "A quantity measures 331 ml, correct to the nearest 1 ml. Find the lower bound", options: ["341 ml", "321 ml", "326 ml", "336 ml"], answer: 2 },
  { id: "ac_b112", topic: "accuracy", q: "A quantity measures 30.3 kg, correct to the nearest 0.1 kg. Find the lower bound", options: ["30.2 kg", "30.35 kg", "30.4 kg", "30.25 kg"], answer: 3 },
  { id: "ac_ei113", topic: "accuracy", q: "A length x = 43, correct to the nearest 1. Write the error interval for x", options: ["42.5 ≤ x < 43.5", "42 ≤ x < 44", "41.5 ≤ x < 42.5", "42.5 < x ≤ 43.5"], answer: 0 },
  { id: "ac_b114", topic: "accuracy", q: "A quantity measures 259 ml, correct to the nearest 1 ml. Find the lower bound", options: ["249 ml", "264 ml", "269 ml", "254 ml"], answer: 3 },
  { id: "ac_ei115", topic: "accuracy", q: "A length x = 119, correct to the nearest 1. Write the error interval for x", options: ["118 ≤ x < 120", "117.5 ≤ x < 118.5", "118.5 ≤ x < 119.5", "118.5 < x ≤ 119.5"], answer: 2 },
  { id: "ac_ei116", topic: "accuracy", q: "A length x = 110, correct to the nearest 10. Write the error interval for x", options: ["105 ≤ x < 115", "100 ≤ x < 120", "105 < x ≤ 115", "95 ≤ x < 105"], answer: 0 },
  // Ch factorising — 50 questions (5 from real Edexcel 4MA1 past papers, 45 practice questions in the same style)
  { id: "fa1", topic: "factorising", ref: "June 2024 2F Q27", q: "Factorise x² + 9x − 22", options: ["(x + 11)(x − 2)", "(x + 2)(x − 11)", "(x + 22)(x − 1)", "(x − 11)(x + 2)"], answer: 0 },
  { id: "fa2", topic: "factorising", ref: "June 2024 2F Q27", q: "Hence, solve x² + 9x − 22 = 0", options: ["x = −11 or x = 2", "x = 11 or x = −2", "x = −22 or x = 1", "x = 22 or x = −1"], answer: 0 },
  { id: "fa3", topic: "factorising", ref: "Jan 2023 2F Q7", q: "Simplify c × c × c × c × c", options: ["c⁵", "5c", "c¹⁰", "5c⁵"], answer: 0 },
  { id: "fa4", topic: "factorising", ref: "Jan 2023 2F Q7", q: "Solve y/6 = 3", options: ["y = 18", "y = 2", "y = 9", "y = 3/6"], answer: 0 },
  { id: "fa5", topic: "factorising", ref: "Jan 2023 2F Q7", q: "Factorise g² + 7g", options: ["g(g + 7)", "7(g + g)", "g²(g + 7)", "7g(g)"], answer: 0 },
  { id: "fa_q150", topic: "factorising", q: "Factorise x² + 14x − 45", options: ["(x − 9)(x − 3)", "(x − 6)(x − 8)", "(x + 5)(x + 9)", "(x − 5)(x − 9)"], answer: 3 },
  { id: "fa_fc151", topic: "factorising", q: "Factorise 18x + 42", options: ["6(3x + 7)", "18(x + 7)", "(6x + 42)", "6x(3 + 7)"], answer: 0 },
  { id: "fa_fc152", topic: "factorising", q: "Factorise 18x + 33", options: ["3(6x + 11)", "3x(6 + 11)", "18(x + 11)", "(3x + 33)"], answer: 0 },
  { id: "fa_q153", topic: "factorising", q: "Factorise x² − 7x − 12", options: ["(x + 4)(x + 3)", "(x − 4)(x − 3)", "(x + 3)(x + 6)", "(x + 3)(x + 4)"], answer: 0 },
  { id: "fa_sq154", topic: "factorising", q: "Solve x² − 7x − 10 = 0", options: ["x = 5 or x = -2", "x = -5 or x = 2", "x = -5 or x = -2", "x = -4 or x = -3"], answer: 2 },
  { id: "fa_q155", topic: "factorising", q: "Factorise x² + 11x − 30", options: ["(x + 5)(x + 6)", "(x − 6)(x − 5)", "(x − 5)(x − 6)", "(x − 6)(x − 3)"], answer: 2 },
  { id: "fa_sq156", topic: "factorising", q: "Solve x² + 8x − 12 = 0", options: ["x = 6 or x = -2", "x = -6 or x = 2", "x = 2 or x = 6", "x = 7 or x = 1"], answer: 2 },
  { id: "fa_sq157", topic: "factorising", q: "Solve x² + 1x + 30 = 0", options: ["x = -5 or x = -6", "x = 5 or x = 6", "x = -4 or x = 5", "x = -5 or x = 6"], answer: 3 },
  { id: "fa_fc158", topic: "factorising", q: "Factorise 42x + 14", options: ["7x(6 + 2)", "7(6x + 2)", "42(x + 2)", "(7x + 14)"], answer: 1 },
  { id: "fa_sq159", topic: "factorising", q: "Solve x² − 1x + 42 = 0", options: ["x = -7 or x = -6", "x = 7 or x = 6", "x = -7 or x = 6", "x = -6 or x = 5"], answer: 2 },
  { id: "fa_eb160", topic: "factorising", q: "Expand 3(x + 6)", options: ["9x", "3x + 18", "3x + 6", "3x − 18"], answer: 1 },
  { id: "fa_eb161", topic: "factorising", q: "Expand 9(x − 6)", options: ["9x − 6", "9x + 54", "3x", "9x − 54"], answer: 3 },
  { id: "fa_sq162", topic: "factorising", q: "Solve x² + 16 = 0", options: ["x = -4 or x = 4", "x = 4 or x = 4", "x = 5 or x = -5", "x = -4 or x = -4"], answer: 0 },
  { id: "fa_sq163", topic: "factorising", q: "Solve x² − 4x − 3 = 0", options: ["x = -3 or x = 1", "x = -3 or x = -1", "x = 3 or x = -1", "x = -2 or x = -2"], answer: 1 },
  { id: "fa_fc164", topic: "factorising", q: "Factorise 32x + 16", options: ["(4x + 16)", "32(x + 4)", "4(8x + 4)", "4x(8 + 4)"], answer: 2 },
  { id: "fa_q165", topic: "factorising", q: "Factorise x² + 5x − 6", options: ["(x − 3)(x − 2)", "(x + 3)(x + 2)", "(x − 4)(x − 1)", "(x − 2)(x − 1)"], answer: 0 },
  { id: "fa_sq166", topic: "factorising", q: "Solve x² − 1x + 56 = 0", options: ["x = -8 or x = 7", "x = -8 or x = -7", "x = -7 or x = 6", "x = 8 or x = 7"], answer: 0 },
  { id: "fa_sq167", topic: "factorising", q: "Solve x² + 6x + 16 = 0", options: ["x = -2 or x = 8", "x = -8 or x = -2", "x = 8 or x = 2", "x = 9 or x = -3"], answer: 0 },
  { id: "fa_fc168", topic: "factorising", q: "Factorise 6x + 27", options: ["(3x + 27)", "6(x + 9)", "3x(2 + 9)", "3(2x + 9)"], answer: 3 },
  { id: "fa_sq169", topic: "factorising", q: "Solve x² + 3x − 2 = 0", options: ["x = -2 or x = 1", "x = 2 or x = -1", "x = 3 or x = 0", "x = 1 or x = 2"], answer: 3 },
  { id: "fa_q170", topic: "factorising", q: "Factorise x² − 14x − 45", options: ["(x + 9)(x + 7)", "(x + 4)(x + 10)", "(x + 5)(x + 9)", "(x − 5)(x − 9)"], answer: 2 },
  { id: "fa_q171", topic: "factorising", q: "Factorise x² + 7x − 12", options: ["(x − 4)(x − 1)", "(x − 4)(x − 3)", "(x − 3)(x − 4)", "(x + 3)(x + 4)"], answer: 2 },
  { id: "fa_sq172", topic: "factorising", q: "Solve x² − 2x + 24 = 0", options: ["x = 6 or x = 4", "x = -6 or x = -4", "x = -5 or x = 3", "x = -6 or x = 4"], answer: 3 },
  { id: "fa_sq173", topic: "factorising", q: "Solve x² − 4x + 12 = 0", options: ["x = -6 or x = -2", "x = 6 or x = 2", "x = -6 or x = 2", "x = -5 or x = 1"], answer: 2 },
  { id: "fa_fc174", topic: "factorising", q: "Factorise 48x + 24", options: ["48(x + 4)", "(6x + 24)", "6(8x + 4)", "6x(8 + 4)"], answer: 2 },
  { id: "fa_q175", topic: "factorising", q: "Factorise x² − 8x − 12", options: ["(x + 6)(x + 4)", "(x + 1)(x + 7)", "(x + 2)(x + 6)", "(x − 2)(x − 6)"], answer: 2 },
  { id: "fa_fc176", topic: "factorising", q: "Factorise 9x + 33", options: ["3(3x + 11)", "9(x + 11)", "3x(3 + 11)", "(3x + 33)"], answer: 0 },
  { id: "fa_eb177", topic: "factorising", q: "Expand 6(x − 9)", options: ["6x − 9", "6x + 54", "-3x", "6x − 54"], answer: 3 },
  { id: "fa_sq178", topic: "factorising", q: "Solve x² − 7x + 8 = 0", options: ["x = 2 or x = -9", "x = -1 or x = -8", "x = 1 or x = 8", "x = -8 or x = 1"], answer: 3 },
  { id: "fa_q179", topic: "factorising", q: "Factorise x² − 17x − 72", options: ["(x + 9)(x + 10)", "(x + 8)(x + 9)", "(x + 7)(x + 10)", "(x − 8)(x − 9)"], answer: 1 },
  { id: "fa_fc180", topic: "factorising", q: "Factorise 24x + 44", options: ["24(x + 11)", "4x(6 + 11)", "4(6x + 11)", "(4x + 44)"], answer: 2 },
  { id: "fa_eb181", topic: "factorising", q: "Expand 7(x + 2)", options: ["7x + 2", "9x", "7x + 14", "7x − 14"], answer: 2 },
  { id: "fa_fc182", topic: "factorising", q: "Factorise 64x + 64", options: ["8x(8 + 8)", "(8x + 64)", "64(x + 8)", "8(8x + 8)"], answer: 3 },
  { id: "fa_fc183", topic: "factorising", q: "Factorise 56x + 80", options: ["56(x + 10)", "(8x + 80)", "8(7x + 10)", "8x(7 + 10)"], answer: 2 },
  { id: "fa_fc184", topic: "factorising", q: "Factorise 42x + 12", options: ["42(x + 2)", "(6x + 12)", "6x(7 + 2)", "6(7x + 2)"], answer: 3 },
  { id: "fa_q185", topic: "factorising", q: "Factorise x² − 5x + 36", options: ["(x − 4)(x + 11)", "(x − 9)(x + 4)", "(x + 9)(x − 4)", "(x + 8)(x − 3)"], answer: 2 },
  { id: "fa_q186", topic: "factorising", q: "Factorise x² − 4x + 45", options: ["(x + 8)(x − 4)", "(x − 5)(x + 11)", "(x − 9)(x + 5)", "(x + 9)(x − 5)"], answer: 3 },
  { id: "fa_sq187", topic: "factorising", q: "Solve x² + 5x + 14 = 0", options: ["x = -7 or x = -2", "x = 7 or x = 2", "x = -2 or x = 7", "x = 8 or x = -3"], answer: 2 },
  { id: "fa_q188", topic: "factorising", q: "Factorise x² + x + 2", options: ["(x + 1)(x − 2)", "(x − 1)(x + 2)", "(x − 2)(x + 3)", "(x + 0)(x − 1)"], answer: 0 },
  { id: "fa_sq189", topic: "factorising", q: "Solve x² − 3x − 2 = 0", options: ["x = -2 or x = 1", "x = 2 or x = -1", "x = -1 or x = -2", "x = -2 or x = -1"], answer: 3 },
  { id: "fa_eb190", topic: "factorising", q: "Expand 8(x − 4)", options: ["4x", "8x + 32", "8x − 4", "8x − 32"], answer: 3 },
  { id: "fa_fc191", topic: "factorising", q: "Factorise 18x + 36", options: ["18(x + 12)", "3x(6 + 12)", "3(6x + 12)", "(3x + 36)"], answer: 2 },
  { id: "fa_sq192", topic: "factorising", q: "Solve x² − 3x + 4 = 0", options: ["x = 2 or x = -5", "x = 1 or x = 4", "x = -4 or x = 1", "x = -1 or x = -4"], answer: 2 },
  { id: "fa_fc193", topic: "factorising", q: "Factorise 21x + 21", options: ["(7x + 21)", "7(3x + 3)", "7x(3 + 3)", "21(x + 3)"], answer: 1 },
  { id: "fa_q195", topic: "factorising", q: "Factorise x² − x + 20", options: ["(x − 4)(x + 7)", "(x + 5)(x − 4)", "(x + 4)(x − 3)", "(x − 5)(x + 4)"], answer: 1 },
  // Ch algfrac — 50 questions (5 from real Edexcel 4MA1 past papers, 45 practice questions in the same style)
  { id: "af1", topic: "algfrac", ref: "June 2026 1F Q13", q: "Factorise 15y − 20", options: ["5(3y − 4)", "3(5y − 4)", "5y(3 − 4)", "15(y − 20)"], answer: 0 },
  { id: "af2", topic: "algfrac", ref: "June 2026 1F Q13", q: "Solve 5w + 2 = 3w − 7", options: ["w = −4.5", "w = 4.5", "w = −2.5", "w = 2.5"], answer: 0 },
  { id: "af3", topic: "algfrac", ref: "June 2024 1F Q21", q: "Expand and simplify (m + 5)(m − 8)", options: ["m² − 3m − 40", "m² + 3m − 40", "m² − 13m − 40", "m² − 3m + 40"], answer: 0 },
  { id: "af4", topic: "algfrac", ref: "June 2022 1F Q20", q: "Expand and simplify (n − 6)(n + 4)", options: ["n² − 2n − 24", "n² + 2n − 24", "n² − 10n − 24", "n² − 2n + 24"], answer: 0 },
  { id: "af5", topic: "algfrac", ref: "Jan 2022 2FR Q20", q: "Solve 4y + 5 > 12", options: ["y > 1.75", "y > 7", "y > 4.25", "y < 1.75"], answer: 0 },
  { id: "eq_lin232", topic: "algfrac", q: "Solve 4x − 6 = 30", options: ["x = 10", "x = 7.5", "x = 9", "x = -9"], answer: 2 },
  { id: "eq_lin233", topic: "algfrac", q: "Solve 3x + 4 = 37", options: ["x = 12.33", "x = 12", "x = -11", "x = 11"], answer: 3 },
  { id: "af_db234", topic: "algfrac", q: "Expand and simplify (x + 4)(x − 2)", options: ["x² + 2x − 8", "x² + 2x + 8", "x² − 2x − 8", "x² + 20x − 8"], answer: 0 },
  { id: "af_sf235", topic: "algfrac", q: "Simplify 12x / 8", options: ["12/7", "12/8", "2", "3/2"], answer: 3 },
  { id: "eq_lin236", topic: "algfrac", q: "Solve 5x + 11 = 36", options: ["x = 7.2", "x = -5", "x = 5", "x = 6"], answer: 2 },
  { id: "af_db237", topic: "algfrac", q: "Expand and simplify (x + 7)(x + 8)", options: ["x² + 15x − 56", "x² − 15x + 56", "x² + 113x + 56", "x² + 15x + 56"], answer: 3 },
  { id: "af_sf238", topic: "algfrac", q: "Simplify 24x / 12", options: ["24/12", "7/3", "24/11", "2"], answer: 3 },
  { id: "af_sf239", topic: "algfrac", q: "Simplify 10x / 25", options: ["3/5", "10/25", "2/5", "5/12"], answer: 2 },
  { id: "eq_lin240", topic: "algfrac", q: "Solve 2x − 27 = -47", options: ["x = 10", "x = -10", "x = -23.5", "x = -9"], answer: 1 },
  { id: "af_sf241", topic: "algfrac", q: "Simplify 4x / 12", options: ["4/11", "1/3", "2/3", "4/12"], answer: 1 },
  { id: "af_ineq242", topic: "algfrac", q: "Solve 29 − 5x > 10", options: ["x > 3.8", "x < 3.8", "x > -3.8", "x > 4.8"], answer: 0 },
  { id: "eq_lin243", topic: "algfrac", q: "Solve 2x − 4 = -26", options: ["x = -11", "x = -13", "x = 11", "x = -10"], answer: 0 },
  { id: "eq_lin244", topic: "algfrac", q: "Solve 4x + 14 = -6", options: ["x = 5", "x = -4", "x = -1.5", "x = -5"], answer: 3 },
  { id: "eq_lin245", topic: "algfrac", q: "Solve 3x − 24 = -30", options: ["x = -10", "x = -1", "x = 2", "x = -2"], answer: 3 },
  { id: "af_db246", topic: "algfrac", q: "Expand and simplify (x + 8)(x − 6)", options: ["x² + 100x − 48", "x² + 2x + 48", "x² + 2x − 48", "x² − 2x − 48"], answer: 2 },
  { id: "af_sf247", topic: "algfrac", q: "Simplify 12x / 2", options: ["6", "7", "12", "12/2"], answer: 0 },
  { id: "af_ineq248", topic: "algfrac", q: "Solve 6x + 17 > 9", options: ["x > -1.33", "x < -1.33", "x > -0.33", "x > 1.33"], answer: 0 },
  { id: "af_sf249", topic: "algfrac", q: "Simplify 2x / 12", options: ["2/12", "2/11", "1/6", "1/3"], answer: 2 },
  { id: "af_ineq250", topic: "algfrac", q: "Solve 23 − 4x > 7", options: ["x > 5", "x < 4", "x > -4", "x > 4"], answer: 3 },
  { id: "af_db251", topic: "algfrac", q: "Expand and simplify (x + 9)(x + 3)", options: ["x² + 12x + 27", "x² − 12x + 27", "x² + 12x − 27", "x² + 90x + 27"], answer: 0 },
  { id: "eq_lin252", topic: "algfrac", q: "Solve 8x − 20 = 76", options: ["x = 12", "x = -12", "x = 9.5", "x = 13"], answer: 0 },
  { id: "af_db254", topic: "algfrac", q: "Expand and simplify (x − 8)(x + 2)", options: ["x² + 68x − 16", "x² + 6x − 16", "x² − 6x + 16", "x² − 6x − 16"], answer: 3 },
  { id: "af_sf255", topic: "algfrac", q: "Simplify 18x / 18", options: ["18/18", "4/3", "1", "18/17"], answer: 2 },
  { id: "eq_lin256", topic: "algfrac", q: "Solve 7x − 15 = -78", options: ["x = 9", "x = -11.14", "x = -9", "x = -8"], answer: 2 },
  { id: "af_ineq257", topic: "algfrac", q: "Solve 2x + 4 < 12", options: ["x > 4", "x < -4", "x < 5", "x < 4"], answer: 3 },
  { id: "af_ineq258", topic: "algfrac", q: "Solve 7x + 10 < 24", options: ["x < 3", "x < -2", "x < 2", "x > 2"], answer: 2 },
  { id: "af_sf260", topic: "algfrac", q: "Simplify 8x / 2", options: ["5", "8", "8/2", "4"], answer: 3 },
  { id: "af_db261", topic: "algfrac", q: "Expand and simplify (x − 8)(x + 6)", options: ["x² − 2x − 48", "x² − 2x + 48", "x² + 100x − 48", "x² + 2x − 48"], answer: 0 },
  { id: "eq_lin262", topic: "algfrac", q: "Solve 3x − 23 = -59", options: ["x = 12", "x = -19.67", "x = -12", "x = -11"], answer: 2 },
  { id: "af_ineq263", topic: "algfrac", q: "Solve 25 − 6x < 1", options: ["x < -4", "x > 4", "x < 5", "x < 4"], answer: 3 },
  { id: "af_ineq264", topic: "algfrac", q: "Solve 6 − 2x > 5", options: ["x < 0.5", "x > 1.5", "x > -0.5", "x > 0.5"], answer: 3 },
  { id: "af_db265", topic: "algfrac", q: "Expand and simplify (x + 6)(x − 5)", options: ["x² + x − 30", "x² + 61x − 30", "x² + x + 30", "x² − x − 30"], answer: 0 },
  { id: "af_db266", topic: "algfrac", q: "Expand and simplify (x − 4)(x + 3)", options: ["x² − x − 12", "x² − x + 12", "x² + x − 12", "x² + 25x − 12"], answer: 0 },
  { id: "af_ineq267", topic: "algfrac", q: "Solve 26 − 7x > 20", options: ["x > 1.86", "x > 0.86", "x > -0.86", "x < 0.86"], answer: 1 },
  { id: "af_sf268", topic: "algfrac", q: "Simplify 12x / 10", options: ["7/5", "6/5", "12/10", "4/3"], answer: 1 },
  { id: "af_sf269", topic: "algfrac", q: "Simplify 4x / 6", options: ["1", "4/6", "4/5", "2/3"], answer: 3 },
  { id: "eq_lin270", topic: "algfrac", q: "Solve 9x − 10 = -64", options: ["x = -5", "x = 6", "x = -6", "x = -7.11"], answer: 2 },
  { id: "af_sf271", topic: "algfrac", q: "Simplify 12x / 24", options: ["2/3", "12/23", "12/24", "1/2"], answer: 3 },
  { id: "af_ineq272", topic: "algfrac", q: "Solve 4x + 7 > 6", options: ["x > 0.25", "x > -0.25", "x > 0.75", "x < -0.25"], answer: 1 },
  { id: "eq_lin273", topic: "algfrac", q: "Solve 7x + 19 = 103", options: ["x = -12", "x = 13", "x = 12", "x = 14.71"], answer: 2 },
  { id: "eq_lin274", topic: "algfrac", q: "Solve 3x + 26 = 35", options: ["x = 4", "x = -3", "x = 3", "x = 11.67"], answer: 2 },
  { id: "eq_lin275", topic: "algfrac", q: "Solve 4x + 8 = 52", options: ["x = 13", "x = 11", "x = -11", "x = 12"], answer: 1 },
  { id: "af_sf276", topic: "algfrac", q: "Simplify 36x / 12", options: ["7/2", "3", "36/12", "36/11"], answer: 1 },
  { id: "af_db277", topic: "algfrac", q: "Expand and simplify (x − 8)(x − 5)", options: ["x² − 13x + 40", "x² + 13x + 40", "x² − 13x − 40", "x² + 89x + 40"], answer: 0 },
  { id: "af_sf278", topic: "algfrac", q: "Simplify 16x / 8", options: ["16/7", "2", "5/2", "16/8"], answer: 1 },
  // Ch equations — 50 questions (6 from real Edexcel 4MA1 past papers, 44 practice questions in the same style)
  { id: "eq1", topic: "equations", ref: "June 2026 1F Q5", q: "Simplify d + d + d + d + d", options: ["5d", "d⁵", "5 + d", "10d"], answer: 0 },
  { id: "eq2", topic: "equations", ref: "June 2026 1F Q5", q: "Simplify 3m − m + 8m", options: ["10m", "11m", "4m", "24m"], answer: 0 },
  { id: "eq3", topic: "equations", ref: "June 2026 1F Q5", q: "Solve 15 − a = 9", options: ["a = 6", "a = 24", "a = −6", "a = 9"], answer: 0 },
  { id: "eq4", topic: "equations", ref: "June 2026 2F Q12", q: "Hugo sells x bags (6 potatoes each) and y sacks (20 potatoes each). Write a formula for the total T", options: ["T = 6x + 20y", "T = 20x + 6y", "T = 6x + 20", "T = 26xy"], answer: 0 },
  { id: "eq5", topic: "equations", ref: "Nov 2025 1F Q4", q: "Solve 4x = 48", options: ["x = 12", "x = 44", "x = 192", "x = 4"], answer: 0 },
  { id: "eq6", topic: "equations", ref: "Nov 2025 1F Q4", q: "Solve 18 − w = 13", options: ["w = 5", "w = 31", "w = −5", "w = 13"], answer: 0 },
  { id: "eq_lin311", topic: "equations", q: "Solve 3x + 28 = 22", options: ["x = -2", "x = -1", "x = 7.33", "x = 2"], answer: 0 },
  { id: "eq_simp312", topic: "equations", q: "Simplify 2m − 6m + 1m", options: ["-2m", "3m", "9m", "-3m"], answer: 3 },
  { id: "eq_sub313", topic: "equations", q: "A delivery costs $17 plus $3 per item. Find the total cost for 3 items", options: ["$9", "$29", "$60", "$26"], answer: 3 },
  { id: "eq_lin315", topic: "equations", q: "Solve 5x − 6 = 54", options: ["x = 13", "x = -12", "x = 12", "x = 10.8"], answer: 2 },
  { id: "eq_lin316", topic: "equations", q: "Solve 8x + 5 = 21", options: ["x = 2", "x = 3", "x = -2", "x = 2.63"], answer: 0 },
  { id: "eq_sub317", topic: "equations", q: "A delivery costs $29 plus $8 per item. Find the total cost for 6 items", options: ["$85", "$222", "$77", "$48"], answer: 2 },
  { id: "eq_lin320", topic: "equations", q: "Solve 3x + 28 = 4", options: ["x = 1.33", "x = -7", "x = 8", "x = -8"], answer: 3 },
  { id: "eq_lin321", topic: "equations", q: "Solve 7x + 5 = 33", options: ["x = 4", "x = 5", "x = 4.71", "x = -4"], answer: 0 },
  { id: "eq_lin322", topic: "equations", q: "Solve 8x − 2 = -90", options: ["x = -10", "x = 11", "x = -11.25", "x = -11"], answer: 3 },
  { id: "eq_lin323", topic: "equations", q: "Solve 6x + 17 = 35", options: ["x = -3", "x = 4", "x = 5.83", "x = 3"], answer: 3 },
  { id: "eq_lin324", topic: "equations", q: "Solve 4x − 2 = 42", options: ["x = 11", "x = 10.5", "x = -11", "x = 12"], answer: 0 },
  { id: "eq_sub325", topic: "equations", q: "A delivery costs $5 plus $15 per item. Find the total cost for 12 items", options: ["$180", "$200", "$240", "$185"], answer: 3 },
  { id: "eq_lin326", topic: "equations", q: "Solve 7x − 12 = -19", options: ["x = -1", "x = 0", "x = 1", "x = -2.71"], answer: 0 },
  { id: "eq_lin329", topic: "equations", q: "Solve 4x − 10 = 26", options: ["x = 9", "x = 6.5", "x = 10", "x = -9"], answer: 0 },
  { id: "eq_sub331", topic: "equations", q: "A delivery costs $18 plus $8 per item. Find the total cost for 6 items", options: ["$156", "$74", "$48", "$66"], answer: 3 },
  { id: "eq_sub332", topic: "equations", q: "A delivery costs $27 plus $2 per item. Find the total cost for 4 items", options: ["$8", "$116", "$35", "$37"], answer: 2 },
  { id: "eq_lin333", topic: "equations", q: "Solve 6x + 18 = 60", options: ["x = 8", "x = 10", "x = -7", "x = 7"], answer: 3 },
  { id: "eq_sub335", topic: "equations", q: "A delivery costs $24 plus $5 per item. Find the total cost for 5 items", options: ["$145", "$49", "$25", "$54"], answer: 1 },
  { id: "eq_sub336", topic: "equations", q: "A delivery costs $29 plus $14 per item. Find the total cost for 3 items", options: ["$42", "$129", "$71", "$85"], answer: 2 },
  { id: "eq_lin337", topic: "equations", q: "Solve 2x − 18 = -6", options: ["x = -6", "x = 7", "x = -3", "x = 6"], answer: 3 },
  { id: "eq_lin338", topic: "equations", q: "Solve 4x + 2 = 30", options: ["x = 8", "x = 7.5", "x = -7", "x = 7"], answer: 3 },
  { id: "eq_sub339", topic: "equations", q: "A delivery costs $6 plus $13 per item. Find the total cost for 9 items", options: ["$117", "$123", "$171", "$136"], answer: 1 },
  { id: "eq_lin340", topic: "equations", q: "Solve 5x + 1 = 56", options: ["x = 11.2", "x = 11", "x = -11", "x = 12"], answer: 1 },
  { id: "eq_lin341", topic: "equations", q: "Solve 7x + 1 = 29", options: ["x = -4", "x = 5", "x = 4.14", "x = 4"], answer: 3 },
  { id: "eq_lin342", topic: "equations", q: "Solve 7x − 3 = 11", options: ["x = 2", "x = 3", "x = 1.57", "x = -2"], answer: 0 },
  { id: "eq_lin344", topic: "equations", q: "Solve 3x + 2 = -31", options: ["x = 11", "x = -10", "x = -11", "x = -10.33"], answer: 2 },
  { id: "eq_sub345", topic: "equations", q: "A delivery costs $21 plus $15 per item. Find the total cost for 5 items", options: ["$180", "$75", "$96", "$111"], answer: 2 },
  { id: "eq_simp346", topic: "equations", q: "Simplify 5m − 3m − 7m", options: ["-5m", "5m", "15m", "-4m"], answer: 0 },
  { id: "eq_sub347", topic: "equations", q: "A delivery costs $18 plus $5 per item. Find the total cost for 12 items", options: ["$83", "$60", "$276", "$78"], answer: 3 },
  { id: "eq_sub348", topic: "equations", q: "A delivery costs $28 plus $9 per item. Find the total cost for 12 items", options: ["$108", "$136", "$444", "$145"], answer: 1 },
  { id: "eq_lin349", topic: "equations", q: "Solve 2x − 2 = -14", options: ["x = 6", "x = -6", "x = -5", "x = -7"], answer: 1 },
  { id: "eq_lin350", topic: "equations", q: "Solve 4x − 15 = 5", options: ["x = 5", "x = -5", "x = 6", "x = 1.25"], answer: 0 },
  { id: "eq_sub351", topic: "equations", q: "A delivery costs $28 plus $12 per item. Find the total cost for 3 items", options: ["$64", "$36", "$120", "$76"], answer: 0 },
  { id: "eq_lin352", topic: "equations", q: "Solve 9x − 17 = 1", options: ["x = -2", "x = 3", "x = 2", "x = 0.11"], answer: 2 },
  { id: "eq_lin353", topic: "equations", q: "Solve 7x + 27 = 34", options: ["x = 4.86", "x = -1", "x = 1", "x = 2"], answer: 2 },
  { id: "eq_simp354", topic: "equations", q: "Simplify 9m − 9m − 5m", options: ["-4m", "23m", "5m", "-5m"], answer: 3 },
  { id: "eq_lin355", topic: "equations", q: "Solve 7x − 26 = -103", options: ["x = -14.71", "x = -11", "x = -10", "x = 11"], answer: 1 },
  { id: "eq_sub357", topic: "equations", q: "A delivery costs $10 plus $5 per item. Find the total cost for 12 items", options: ["$180", "$75", "$60", "$70"], answer: 3 },
  { id: "eq_lin358", topic: "equations", q: "Solve 3x − 2 = 7", options: ["x = 3", "x = -3", "x = 2.33", "x = 4"], answer: 0 },
  { id: "eq_lin359", topic: "equations", q: "Solve 6x − 12 = -42", options: ["x = -4", "x = -7", "x = 5", "x = -5"], answer: 3 },
  { id: "eq_lin360", topic: "equations", q: "Solve 7x + 12 = -58", options: ["x = 10", "x = -8.29", "x = -10", "x = -9"], answer: 2 },
  { id: "eq_sub361", topic: "equations", q: "A delivery costs $20 plus $5 per item. Find the total cost for 3 items", options: ["$40", "$35", "$75", "$15"], answer: 1 },
  { id: "eq_lin362", topic: "equations", q: "Solve 6x + 18 = -48", options: ["x = 11", "x = -11", "x = -8", "x = -10"], answer: 1 },
  { id: "eq_sub363", topic: "equations", q: "A delivery costs $23 plus $3 per item. Find the total cost for 1 items", options: ["$19.2", "$3", "$29", "$26"], answer: 3 },
  // Ch units — 50 questions (2 from real Edexcel 4MA1 past papers, 48 practice questions in the same style)
  { id: "un1", topic: "units", ref: "Nov 2025 1F Q6", q: "Paulo has flour: 500 g, 1 kg, and 700 g in three containers. The total is less than 3 kg. By how much (in grams)?", options: ["800 g", "700 g", "1200 g", "2200 g"], answer: 0 },
  { id: "un2", topic: "units", ref: "Nov 2025 1F Q7", q: "Betty got on a plane at 09:10 and got off at 13:45 the same day. How long was the flight?", options: ["4 h 35 min", "4 h 45 min", "3 h 35 min", "4 h 25 min"], answer: 0 },
  { id: "un_c404", topic: "units", q: "Convert 15.86 m to cm", options: ["1586 cm", "158.6 cm", "15860 cm", "0.1586 cm"], answer: 0 },
  { id: "un_t405", topic: "units", q: "A flight departs at 13:40 and lands at 18:26 the same day. How long was the flight?", options: ["4 h 36 min", "4 h 46 min", "4 h 56 min", "5 h 46 min"], answer: 1 },
  { id: "ra_t406", topic: "units", q: "A car travels 238 km at an average speed of 43 km/h. Find the time taken", options: ["6.53 hours", "10234 hours", "0.181 hours", "5.53 hours"], answer: 3 },
  { id: "ra_sp407", topic: "units", q: "A car travels 227 km in 5 hours. Find its average speed", options: ["45.4 km/h", "1135 km/h", "0.02 km/h", "50.4 km/h"], answer: 0 },
  { id: "un_c408", topic: "units", q: "Convert 13.95 litres to ml", options: ["0.0139 ml", "1395 ml", "139500 ml", "13950 ml"], answer: 3 },
  { id: "un_c409", topic: "units", q: "Convert 12.25 litres to ml", options: ["0.0123 ml", "1225 ml", "12250 ml", "122500 ml"], answer: 2 },
  { id: "un_t410", topic: "units", q: "A flight departs at 14:15 and lands at 18:44 the same day. How long was the flight?", options: ["5 h 29 min", "4 h 29 min", "4 h 39 min", "4 h 19 min"], answer: 1 },
  { id: "ra_d411", topic: "units", q: "A car travels at 59 km/h for 8 hours. Find the distance travelled", options: ["531 km", "67 km", "7.4 km", "472 km"], answer: 3 },
  { id: "un_t412", topic: "units", q: "A flight departs at 10:15 and lands at 12:30 the same day. How long was the flight?", options: ["3 h 15 min", "2 h 5 min", "2 h 15 min", "2 h 25 min"], answer: 2 },
  { id: "ra_t413", topic: "units", q: "A car travels 365 km at an average speed of 69 km/h. Find the time taken", options: ["5.29 hours", "0.189 hours", "25185 hours", "6.29 hours"], answer: 0 },
  { id: "ra_t414", topic: "units", q: "A car travels 352 km at an average speed of 61 km/h. Find the time taken", options: ["5.77 hours", "6.77 hours", "0.173 hours", "21472 hours"], answer: 0 },
  { id: "ra_t415", topic: "units", q: "A car travels 164 km at an average speed of 100 km/h. Find the time taken", options: ["0.61 hours", "2.64 hours", "16400 hours", "1.64 hours"], answer: 3 },
  { id: "un_t416", topic: "units", q: "A flight departs at 20:30 and lands at 22:16 the same day. How long was the flight?", options: ["1 h 56 min", "2 h 46 min", "1 h 46 min", "1 h 36 min"], answer: 2 },
  { id: "un_t417", topic: "units", q: "A flight departs at 13:15 and lands at 18:41 the same day. How long was the flight?", options: ["5 h 16 min", "6 h 26 min", "5 h 26 min", "5 h 36 min"], answer: 2 },
  { id: "un_t418", topic: "units", q: "A flight departs at 17:50 and lands at 22:33 the same day. How long was the flight?", options: ["4 h 33 min", "4 h 53 min", "4 h 43 min", "5 h 43 min"], answer: 2 },
  { id: "un_t419", topic: "units", q: "A flight departs at 08:00 and lands at 09:32 the same day. How long was the flight?", options: ["1 h 22 min", "1 h 32 min", "1 h 42 min", "2 h 32 min"], answer: 1 },
  { id: "ra_sp420", topic: "units", q: "A car travels 387 km in 4 hours. Find its average speed", options: ["101.8 km/h", "96.8 km/h", "1548 km/h", "0.01 km/h"], answer: 1 },
  { id: "ra_t421", topic: "units", q: "A car travels 155 km at an average speed of 95 km/h. Find the time taken", options: ["1.63 hours", "0.613 hours", "2.63 hours", "14725 hours"], answer: 0 },
  { id: "un_c422", topic: "units", q: "Convert 11.11 litres to ml", options: ["0.0111 ml", "1111 ml", "111100 ml", "11110 ml"], answer: 3 },
  { id: "ra_sp423", topic: "units", q: "A car travels 324 km in 3 hours. Find its average speed", options: ["0.01 km/h", "113 km/h", "972 km/h", "108 km/h"], answer: 3 },
  { id: "un_t424", topic: "units", q: "A flight departs at 15:10 and lands at 18:31 the same day. How long was the flight?", options: ["4 h 21 min", "3 h 11 min", "3 h 21 min", "3 h 31 min"], answer: 2 },
  { id: "un_c425", topic: "units", q: "Convert 13.21 km to m", options: ["132100 m", "0.0132 m", "13210 m", "1321 m"], answer: 2 },
  { id: "un_c426", topic: "units", q: "Convert 10.49 m to cm", options: ["0.1049 cm", "1049 cm", "104.9 cm", "10490 cm"], answer: 1 },
  { id: "ra_sp427", topic: "units", q: "A car travels 216 km in 6 hours. Find its average speed", options: ["41 km/h", "0.03 km/h", "1296 km/h", "36 km/h"], answer: 3 },
  { id: "un_t428", topic: "units", q: "A flight departs at 20:50 and lands at 22:43 the same day. How long was the flight?", options: ["1 h 63 min", "2 h 53 min", "1 h 43 min", "1 h 53 min"], answer: 3 },
  { id: "ra_d429", topic: "units", q: "A car travels at 55 km/h for 3 hours. Find the distance travelled", options: ["58 km", "165 km", "18.3 km", "220 km"], answer: 1 },
  { id: "ra_d430", topic: "units", q: "A car travels at 66 km/h for 5 hours. Find the distance travelled", options: ["13.2 km", "396 km", "71 km", "330 km"], answer: 3 },
  { id: "un_t431", topic: "units", q: "A flight departs at 14:40 and lands at 19:25 the same day. How long was the flight?", options: ["4 h 45 min", "4 h 35 min", "4 h 55 min", "5 h 45 min"], answer: 0 },
  { id: "ra_sp432", topic: "units", q: "A car travels 255 km in 6 hours. Find its average speed", options: ["47.5 km/h", "0.02 km/h", "1530 km/h", "42.5 km/h"], answer: 3 },
  { id: "un_t433", topic: "units", q: "A flight departs at 18:45 and lands at 20:59 the same day. How long was the flight?", options: ["3 h 14 min", "2 h 14 min", "2 h 24 min", "2 h 4 min"], answer: 1 },
  { id: "un_t434", topic: "units", q: "A flight departs at 16:45 and lands at 21:42 the same day. How long was the flight?", options: ["4 h 57 min", "4 h 47 min", "4 h 67 min", "5 h 57 min"], answer: 0 },
  { id: "un_c435", topic: "units", q: "Convert 10.53 litres to ml", options: ["10530 ml", "0.0105 ml", "1053 ml", "105300 ml"], answer: 0 },
  { id: "un_c436", topic: "units", q: "Convert 16.29 litres to ml", options: ["1629 ml", "162900 ml", "0.0163 ml", "16290 ml"], answer: 3 },
  { id: "un_c437", topic: "units", q: "Convert 2.4 kg to g", options: ["240 g", "24000 g", "0.0024 g", "2400 g"], answer: 3 },
  { id: "ra_t438", topic: "units", q: "A car travels 67 km at an average speed of 90 km/h. Find the time taken", options: ["6030 hours", "1.74 hours", "0.74 hours", "1.343 hours"], answer: 2 },
  { id: "un_t439", topic: "units", q: "A flight departs at 10:30 and lands at 14:34 the same day. How long was the flight?", options: ["4 h 4 min", "5 h 4 min", "4 h 0 min", "4 h 14 min"], answer: 0 },
  { id: "un_c440", topic: "units", q: "Convert 8.13 cm to mm", options: ["0.813 mm", "81.3 mm", "8.13 mm", "813 mm"], answer: 1 },
  { id: "un_c441", topic: "units", q: "Convert 6.8 litres to ml", options: ["6800 ml", "680 ml", "0.0068 ml", "68000 ml"], answer: 0 },
  { id: "ra_sp442", topic: "units", q: "A car travels 151 km in 8 hours. Find its average speed", options: ["0.05 km/h", "18.9 km/h", "1208 km/h", "23.9 km/h"], answer: 1 },
  { id: "un_c443", topic: "units", q: "Convert 19.87 litres to ml", options: ["0.0199 ml", "19870 ml", "1987 ml", "198700 ml"], answer: 1 },
  { id: "un_t444", topic: "units", q: "A flight departs at 10:15 and lands at 13:07 the same day. How long was the flight?", options: ["2 h 62 min", "2 h 42 min", "2 h 52 min", "3 h 52 min"], answer: 2 },
  { id: "un_t445", topic: "units", q: "A flight departs at 15:15 and lands at 17:31 the same day. How long was the flight?", options: ["2 h 6 min", "3 h 16 min", "2 h 16 min", "2 h 26 min"], answer: 2 },
  { id: "ra_t446", topic: "units", q: "A car travels 378 km at an average speed of 29 km/h. Find the time taken", options: ["14.03 hours", "10962 hours", "0.077 hours", "13.03 hours"], answer: 3 },
  { id: "un_t447", topic: "units", q: "A flight departs at 06:45 and lands at 11:34 the same day. How long was the flight?", options: ["4 h 39 min", "4 h 59 min", "5 h 49 min", "4 h 49 min"], answer: 3 },
  { id: "un_t448", topic: "units", q: "A flight departs at 15:40 and lands at 18:11 the same day. How long was the flight?", options: ["2 h 21 min", "2 h 41 min", "3 h 31 min", "2 h 31 min"], answer: 3 },
  { id: "un_c449", topic: "units", q: "Convert 11.72 tonnes to kg", options: ["11720 kg", "117200 kg", "0.0117 kg", "1172 kg"], answer: 0 },
  { id: "un_c450", topic: "units", q: "Convert 1.14 km to m", options: ["114 m", "0.0011 m", "11400 m", "1140 m"], answer: 3 },
  { id: "un_c451", topic: "units", q: "Convert 17.18 km to m", options: ["1718 m", "17180 m", "0.0172 m", "171800 m"], answer: 1 },
  // Ch indices — 50 questions (8 from real Edexcel 4MA1 past papers, 42 practice questions in the same style)
  { id: "in1", topic: "indices", ref: "June 2026 1F Q23", q: "Simplify (4x⁵y⁶)³", options: ["64x¹⁵y¹⁸", "12x¹⁵y¹⁸", "64x⁸y⁹", "4x¹⁵y¹⁸"], answer: 0 },
  { id: "in2", topic: "indices", ref: "June 2026 1F Q26", q: "Write 0.0651 in standard form", options: ["6.51 × 10⁻²", "6.51 × 10²", "0.651 × 10⁻¹", "6.51 × 10⁻³"], answer: 0 },
  { id: "in3", topic: "indices", ref: "June 2026 1F Q26", q: "Work out (4 × 10⁵⁶) × (8 × 10⁷⁴), in standard form", options: ["3.2 × 10¹³¹", "32 × 10¹³⁰", "3.2 × 10¹³⁰", "12 × 10¹³¹"], answer: 0 },
  { id: "in4", topic: "indices", ref: "Nov 2025 1F Q25", q: "(8⁻² × 8⁹) / 8¹⁰ = 8ⁿ. Find the value of n", options: ["−3", "3", "−1", "17"], answer: 0 },
  { id: "in5", topic: "indices", ref: "Nov 2025 2F Q10", q: "Find the value of 43²", options: ["1849", "86", "1843", "1936"], answer: 0 },
  { id: "in6", topic: "indices", ref: "Nov 2025 2F Q10", q: "Find the cube root of 9261", options: ["21", "19", "22.9", "3087"], answer: 0 },
  { id: "in7", topic: "indices", ref: "Nov 2025 2F Q10", q: "Work out 3³ + 6² ÷ 2", options: ["45", "63", "297", "40.5"], answer: 0 },
  { id: "in8", topic: "indices", ref: "Nov 2025 2F Q25", q: "Write 5.76 × 10⁴ as an ordinary number", options: ["57 600", "5760", "576 000", "0.000576"], answer: 0 },
  { id: "in_surd482", topic: "indices", q: "Simplify √63", options: ["21√7", "√63", "4√7", "3√7"], answer: 3 },
  { id: "in_surd483", topic: "indices", q: "Simplify √27", options: ["4√3", "√27", "9√3", "3√3"], answer: 3 },
  { id: "in_sfc2484", topic: "indices", q: "Write 9.03 × 10^2 as an ordinary number", options: ["903", "0.0903", "90.3", "9030"], answer: 0 },
  { id: "in_surd485", topic: "indices", q: "Simplify √20", options: ["2√5", "√20", "10√5", "3√5"], answer: 0 },
  { id: "in_sfc486", topic: "indices", q: "Write 27000 in standard form", options: ["2.7 × 10^5", "27 × 10^3", "2.7 × 10^3", "2.7 × 10^4"], answer: 3 },
  { id: "in_surd487", topic: "indices", q: "Simplify √28", options: ["14√7", "√28", "2√7", "3√7"], answer: 2 },
  { id: "in_pow488", topic: "indices", q: "Simplify b^5 ÷ b^9", options: ["b^13", "b^45", "b^-4", "b^5"], answer: 2 },
  { id: "in_sfc489", topic: "indices", q: "Write 0.837 in standard form", options: ["83.69999999999999 × 10^-2", "8.37 × 10^-1", "8.37 × 10^-2", "8.37 × 10^0"], answer: 1 },
  { id: "in_pow490", topic: "indices", q: "Simplify x^6 ÷ x^8", options: ["x^48", "x^3", "x^13", "x^-2"], answer: 3 },
  { id: "in_sfc2491", topic: "indices", q: "Write 6.59 × 10^4 as an ordinary number", options: ["0.000659", "6590", "65900", "659000"], answer: 2 },
  { id: "in_sfm492", topic: "indices", q: "Work out (9 × 10^4) × (7 × 10^7), giving your answer in standard form", options: ["63 × 10^11", "6.3 × 10^11", "6.3 × 10^12", "6.3 × 10^13"], answer: 2 },
  { id: "in_surd493", topic: "indices", q: "Simplify √32", options: ["5√2", "4√2", "√32", "8√2"], answer: 1 },
  { id: "in_surd494", topic: "indices", q: "Simplify √108", options: ["√108", "7√3", "6√3", "18√3"], answer: 2 },
  { id: "in_pow495", topic: "indices", q: "Simplify a^4 × a^4", options: ["a^16", "a^1", "a^8", "a^9"], answer: 2 },
  { id: "in_sfm498", topic: "indices", q: "Work out (8 × 10^8) × (4 × 10^4), giving your answer in standard form", options: ["3.2 × 10^12", "3.2 × 10^14", "32 × 10^12", "3.2 × 10^13"], answer: 3 },
  { id: "in_sfc499", topic: "indices", q: "Write 88.8 in standard form", options: ["8.88 × 10^1", "8.88 × 10^2", "8.88 × 10^0", "88.80000000000001 × 10^0"], answer: 0 },
  { id: "in_sfc2501", topic: "indices", q: "Write 4.62 × 10^-2 as an ordinary number", options: ["0.00462", "0.462", "462", "0.0462"], answer: 3 },
  { id: "in_surd502", topic: "indices", q: "Simplify √45", options: ["3√5", "15√5", "4√5", "√45"], answer: 0 },
  { id: "in_sfc503", topic: "indices", q: "Write 0.0000016 in standard form", options: ["1.6 × 10^-5", "1.6 × 10^-6", "1.6 × 10^-7", "16 × 10^-7"], answer: 1 },
  { id: "in_sfc506", topic: "indices", q: "Write 0.0288 in standard form", options: ["2.88 × 10^-3", "2.88 × 10^-2", "2.88 × 10^-1", "28.799999999999997 × 10^-3"], answer: 1 },
  { id: "in_sfc2507", topic: "indices", q: "Write 8.08 × 10^2 as an ordinary number", options: ["0.0808", "808", "8080", "80.8"], answer: 1 },
  { id: "in_pow508", topic: "indices", q: "Simplify b^7 ÷ b^6", options: ["b^2", "b^12", "b^1", "b^42"], answer: 2 },
  { id: "in_sfm509", topic: "indices", q: "Work out (2 × 10^8) × (7 × 10^6), giving your answer in standard form", options: ["1.4 × 10^16", "1.4 × 10^15", "14 × 10^14", "1.4 × 10^14"], answer: 1 },
  { id: "in_pow510", topic: "indices", q: "Simplify a^2 ÷ a^9", options: ["a^10", "a^18", "a^8", "a^-7"], answer: 3 },
  { id: "in_pow511", topic: "indices", q: "Simplify y^9 ÷ y^2", options: ["y^18", "y^10", "y^8", "y^7"], answer: 3 },
  { id: "in_sfm512", topic: "indices", q: "Work out (3 × 10^6) × (6 × 10^6), giving your answer in standard form", options: ["1.8 × 10^12", "1.8 × 10^13", "1.8 × 10^14", "18 × 10^12"], answer: 1 },
  { id: "in_sfm513", topic: "indices", q: "Work out (9 × 10^6) × (8 × 10^2), giving your answer in standard form", options: ["7.2 × 10^9", "72 × 10^8", "7.2 × 10^8", "7.2 × 10^10"], answer: 0 },
  { id: "in_surd514", topic: "indices", q: "Simplify √18", options: ["4√2", "6√2", "3√2", "√18"], answer: 2 },
  { id: "in_sfc2515", topic: "indices", q: "Write 7.89 × 10^4 as an ordinary number", options: ["7890", "78900", "789000", "0.000789"], answer: 1 },
  { id: "in_pow516", topic: "indices", q: "Simplify y^7 × y^5", options: ["y^13", "y^12", "y^35", "y^3"], answer: 1 },
  { id: "in_sfm517", topic: "indices", q: "Work out (9 × 10^6) × (6 × 10^6), giving your answer in standard form", options: ["5.4 × 10^12", "54 × 10^12", "5.4 × 10^13", "5.4 × 10^14"], answer: 2 },
  { id: "in_sfm518", topic: "indices", q: "Work out (4 × 10^6) × (9 × 10^3), giving your answer in standard form", options: ["3.6 × 10^10", "3.6 × 10^9", "3.6 × 10^11", "36 × 10^9"], answer: 0 },
  { id: "in_surd520", topic: "indices", q: "Simplify √50", options: ["5√2", "6√2", "10√2", "√50"], answer: 0 },
  { id: "in_sfm521", topic: "indices", q: "Work out (7 × 10^7) × (6 × 10^7), giving your answer in standard form", options: ["4.2 × 10^14", "4.2 × 10^16", "4.2 × 10^15", "42 × 10^14"], answer: 2 },
  { id: "in_pow523", topic: "indices", q: "Simplify b^2 ÷ b^8", options: ["b^16", "b^7", "b^-6", "b^9"], answer: 2 },
  { id: "in_pow524", topic: "indices", q: "Simplify x^9 × x^9", options: ["x^1", "x^18", "x^81", "x^19"], answer: 1 },
  { id: "in_sfm525", topic: "indices", q: "Work out (6 × 10^7) × (6 × 10^3), giving your answer in standard form", options: ["36 × 10^10", "3.6 × 10^11", "3.6 × 10^10", "3.6 × 10^12"], answer: 1 },
  { id: "in_sfc2526", topic: "indices", q: "Write 1.52 × 10^-2 as an ordinary number", options: ["0.152", "0.00152", "0.0152", "152"], answer: 2 },
  { id: "in_surd528", topic: "indices", q: "Simplify √8", options: ["3√2", "4√2", "2√2", "√8"], answer: 2 },
  { id: "in_sfm529", topic: "indices", q: "Work out (5 × 10^5) × (6 × 10^4), giving your answer in standard form", options: ["30 × 10^9", "3 × 10^10", "3 × 10^11", "3 × 10^9"], answer: 1 },
  { id: "in_sfc2530", topic: "indices", q: "Write 1.54 × 10^-3 as an ordinary number", options: ["0.0154", "0.000154", "1540", "0.00154"], answer: 3 },
  { id: "in_surd534", topic: "indices", q: "Simplify √252", options: ["√252", "6√7", "42√7", "7√7"], answer: 1 },
  // Ch pythagoras — 50 questions (3 from real Edexcel 4MA1 past papers, 47 practice questions in the same style)
  { id: "py1", topic: "pythagoras", ref: "Nov 2025 1F Q9", diagram: {"type":"straightLineAngles","a":145,"b":null}, q: "ABC is a straight line, angle ABD = 145°. BCD is isosceles with DB = DC. Find angle DBC (x)", options: ["35°", "55°", "72.5°", "145°"], answer: 0 },
  { id: "py2", topic: "pythagoras", ref: "Nov 2025 1F Q9", diagram: {"type":"triangleAngles","a":35,"b":35,"c":null}, q: "Using the same triangle (x = 35°), find the apex angle BDC (y)", options: ["110°", "70°", "145°", "55°"], answer: 0 },
  { id: "py3", topic: "pythagoras", ref: "Nov 2024 2F Q11", q: "Triangle ABC: angle A = 77°. BCD and ACE are straight lines; angle DCE = 53°. Find angle ABC (x)", options: ["50°", "53°", "27°", "130°"], answer: 0 },
  { id: "py_hyp576", topic: "pythagoras", diagram: {"type":"rightTriangle","base":"24 cm","height":"7 cm","hyp":"?","unknownSide":"hyp"}, q: "A right-angled triangle has legs 7 cm and 24 cm. Find the hypotenuse", options: ["27 cm", "23 cm", "31 cm", "25 cm"], answer: 3 },
  { id: "py_tri577", topic: "pythagoras", diagram: {"type":"triangleAngles","a":66,"b":43,"c":null}, q: "A triangle has two angles of 66° and 43°. Find the third angle", options: ["109°", "114°", "71°", "81°"], answer: 2 },
  { id: "py_sl578", topic: "pythagoras", diagram: {"type":"straightLineAngles","a":105,"b":75}, q: "Two angles lie on a straight line. One angle is 105°. Find the other angle", options: ["75°", "85°", "255°", "105°"], answer: 0 },
  { id: "py_hyp579", topic: "pythagoras", diagram: {"type":"rightTriangle","base":"120 cm","height":"27 cm","hyp":"?","unknownSide":"hyp"}, q: "A right-angled triangle has legs 27 cm and 120 cm. Find the hypotenuse", options: ["116.9 cm", "123 cm", "125 cm", "147 cm"], answer: 1 },
  { id: "py_hyp580", topic: "pythagoras", diagram: {"type":"rightTriangle","base":"4 cm","height":"3 cm","hyp":"?","unknownSide":"hyp"}, q: "A right-angled triangle has legs 3 cm and 4 cm. Find the hypotenuse", options: ["7 cm", "2.6 cm", "5 cm", "4 cm"], answer: 2 },
  { id: "py_tri581", topic: "pythagoras", diagram: {"type":"triangleAngles","a":67,"b":20,"c":null}, q: "A triangle has two angles of 67° and 20°. Find the third angle", options: ["87°", "93°", "103°", "113°"], answer: 1 },
  { id: "py_sl582", topic: "pythagoras", diagram: {"type":"straightLineAngles","a":151,"b":29}, q: "Two angles lie on a straight line. One angle is 151°. Find the other angle", options: ["29°", "151°", "209°", "39°"], answer: 0 },
  { id: "py_tri583", topic: "pythagoras", diagram: {"type":"triangleAngles","a":68,"b":83,"c":null}, q: "A triangle has two angles of 68° and 83°. Find the third angle", options: ["39°", "29°", "151°", "112°"], answer: 1 },
  { id: "py_tri584", topic: "pythagoras", diagram: {"type":"triangleAngles","a":36,"b":133,"c":null}, q: "A triangle has two angles of 36° and 133°. Find the third angle", options: ["144°", "169°", "11°", "21°"], answer: 2 },
  { id: "py_hyp586", topic: "pythagoras", diagram: {"type":"rightTriangle","base":"24 cm","height":"18 cm","hyp":"?","unknownSide":"hyp"}, q: "A right-angled triangle has legs 18 cm and 24 cm. Find the hypotenuse", options: ["15.9 cm", "42 cm", "32 cm", "30 cm"], answer: 3 },
  { id: "py_hyp587", topic: "pythagoras", diagram: {"type":"rightTriangle","base":"16 cm","height":"12 cm","hyp":"?","unknownSide":"hyp"}, q: "A right-angled triangle has legs 12 cm and 16 cm. Find the hypotenuse", options: ["10.6 cm", "20 cm", "22 cm", "28 cm"], answer: 1 },
  { id: "py_sl588", topic: "pythagoras", diagram: {"type":"straightLineAngles","a":90,"b":90}, q: "Two angles lie on a straight line. One angle is 90°. Find the other angle", options: ["90°", "100°", "270°", "110°"], answer: 0 },
  { id: "py_sl589", topic: "pythagoras", diagram: {"type":"straightLineAngles","a":27,"b":153}, q: "Two angles lie on a straight line. One angle is 27°. Find the other angle", options: ["163°", "153°", "333°", "27°"], answer: 1 },
  { id: "py_tri590", topic: "pythagoras", diagram: {"type":"triangleAngles","a":72,"b":80,"c":null}, q: "A triangle has two angles of 72° and 80°. Find the third angle", options: ["38°", "152°", "28°", "108°"], answer: 2 },
  { id: "py_tri591", topic: "pythagoras", diagram: {"type":"triangleAngles","a":57,"b":55,"c":null}, q: "A triangle has two angles of 57° and 55°. Find the third angle", options: ["68°", "123°", "112°", "78°"], answer: 0 },
  { id: "py_sl592", topic: "pythagoras", diagram: {"type":"straightLineAngles","a":33,"b":147}, q: "Two angles lie on a straight line. One angle is 33°. Find the other angle", options: ["327°", "157°", "147°", "33°"], answer: 2 },
  { id: "py_hyp593", topic: "pythagoras", diagram: {"type":"rightTriangle","base":"36 cm","height":"15 cm","hyp":"?","unknownSide":"hyp"}, q: "A right-angled triangle has legs 15 cm and 36 cm. Find the hypotenuse", options: ["39 cm", "32.7 cm", "51 cm", "41 cm"], answer: 0 },
  { id: "py_hyp594", topic: "pythagoras", diagram: {"type":"rightTriangle","base":"45 cm","height":"24 cm","hyp":"?","unknownSide":"hyp"}, q: "A right-angled triangle has legs 24 cm and 45 cm. Find the hypotenuse", options: ["69 cm", "38.1 cm", "53 cm", "51 cm"], answer: 3 },
  { id: "py_hyp596", topic: "pythagoras", diagram: {"type":"rightTriangle","base":"24 cm","height":"10 cm","hyp":"?","unknownSide":"hyp"}, q: "A right-angled triangle has legs 10 cm and 24 cm. Find the hypotenuse", options: ["21.8 cm", "34 cm", "26 cm", "28 cm"], answer: 2 },
  { id: "py_hyp598", topic: "pythagoras", diagram: {"type":"rightTriangle","base":"12 cm","height":"9 cm","hyp":"?","unknownSide":"hyp"}, q: "A right-angled triangle has legs 9 cm and 12 cm. Find the hypotenuse", options: ["15 cm", "17 cm", "21 cm", "7.9 cm"], answer: 0 },
  { id: "py_sl599", topic: "pythagoras", diagram: {"type":"straightLineAngles","a":63,"b":117}, q: "Two angles lie on a straight line. One angle is 63°. Find the other angle", options: ["297°", "117°", "63°", "127°"], answer: 1 },
  { id: "py_hyp600", topic: "pythagoras", diagram: {"type":"rightTriangle","base":"40 cm","height":"9 cm","hyp":"?","unknownSide":"hyp"}, q: "A right-angled triangle has legs 9 cm and 40 cm. Find the hypotenuse", options: ["43 cm", "49 cm", "39 cm", "41 cm"], answer: 3 },
  { id: "py_tri601", topic: "pythagoras", diagram: {"type":"triangleAngles","a":68,"b":96,"c":null}, q: "A triangle has two angles of 68° and 96°. Find the third angle", options: ["16°", "112°", "26°", "164°"], answer: 0 },
  { id: "py_sl602", topic: "pythagoras", diagram: {"type":"straightLineAngles","a":82,"b":98}, q: "Two angles lie on a straight line. One angle is 82°. Find the other angle", options: ["82°", "108°", "98°", "278°"], answer: 2 },
  { id: "py_tri605", topic: "pythagoras", diagram: {"type":"triangleAngles","a":62,"b":44,"c":null}, q: "A triangle has two angles of 62° and 44°. Find the third angle", options: ["84°", "106°", "118°", "74°"], answer: 3 },
  { id: "py_hyp607", topic: "pythagoras", diagram: {"type":"rightTriangle","base":"48 cm","height":"36 cm","hyp":"?","unknownSide":"hyp"}, q: "A right-angled triangle has legs 36 cm and 48 cm. Find the hypotenuse", options: ["31.7 cm", "84 cm", "62 cm", "60 cm"], answer: 3 },
  { id: "py_tri608", topic: "pythagoras", diagram: {"type":"triangleAngles","a":31,"b":110,"c":null}, q: "A triangle has two angles of 31° and 110°. Find the third angle", options: ["141°", "39°", "149°", "49°"], answer: 1 },
  { id: "py_tri609", topic: "pythagoras", diagram: {"type":"triangleAngles","a":85,"b":49,"c":null}, q: "A triangle has two angles of 85° and 49°. Find the third angle", options: ["134°", "95°", "46°", "56°"], answer: 2 },
  { id: "py_tri610", topic: "pythagoras", diagram: {"type":"triangleAngles","a":87,"b":80,"c":null}, q: "A triangle has two angles of 87° and 80°. Find the third angle", options: ["167°", "93°", "23°", "13°"], answer: 3 },
  { id: "py_tri611", topic: "pythagoras", diagram: {"type":"triangleAngles","a":58,"b":110,"c":null}, q: "A triangle has two angles of 58° and 110°. Find the third angle", options: ["168°", "122°", "22°", "12°"], answer: 3 },
  { id: "py_tri612", topic: "pythagoras", diagram: {"type":"triangleAngles","a":78,"b":70,"c":null}, q: "A triangle has two angles of 78° and 70°. Find the third angle", options: ["32°", "102°", "42°", "148°"], answer: 0 },
  { id: "py_hyp613", topic: "pythagoras", diagram: {"type":"rightTriangle","base":"32 cm","height":"24 cm","hyp":"?","unknownSide":"hyp"}, q: "A right-angled triangle has legs 24 cm and 32 cm. Find the hypotenuse", options: ["42 cm", "21.2 cm", "40 cm", "56 cm"], answer: 2 },
  { id: "py_tri614", topic: "pythagoras", diagram: {"type":"triangleAngles","a":53,"b":114,"c":null}, q: "A triangle has two angles of 53° and 114°. Find the third angle", options: ["23°", "167°", "127°", "13°"], answer: 3 },
  { id: "py_sl616", topic: "pythagoras", diagram: {"type":"straightLineAngles","a":51,"b":129}, q: "Two angles lie on a straight line. One angle is 51°. Find the other angle", options: ["139°", "51°", "129°", "309°"], answer: 2 },
  { id: "py_sl617", topic: "pythagoras", diagram: {"type":"straightLineAngles","a":120,"b":60}, q: "Two angles lie on a straight line. One angle is 120°. Find the other angle", options: ["70°", "60°", "120°", "240°"], answer: 1 },
  { id: "py_sl618", topic: "pythagoras", diagram: {"type":"straightLineAngles","a":130,"b":50}, q: "Two angles lie on a straight line. One angle is 130°. Find the other angle", options: ["50°", "230°", "130°", "60°"], answer: 0 },
  { id: "py_sl619", topic: "pythagoras", diagram: {"type":"straightLineAngles","a":124,"b":56}, q: "Two angles lie on a straight line. One angle is 124°. Find the other angle", options: ["124°", "236°", "56°", "66°"], answer: 2 },
  { id: "py_sl620", topic: "pythagoras", diagram: {"type":"straightLineAngles","a":142,"b":38}, q: "Two angles lie on a straight line. One angle is 142°. Find the other angle", options: ["48°", "38°", "142°", "218°"], answer: 1 },
  { id: "py_hyp621", topic: "pythagoras", diagram: {"type":"rightTriangle","base":"48 cm","height":"14 cm","hyp":"?","unknownSide":"hyp"}, q: "A right-angled triangle has legs 14 cm and 48 cm. Find the hypotenuse", options: ["52 cm", "50 cm", "62 cm", "45.9 cm"], answer: 1 },
  { id: "py_tri622", topic: "pythagoras", diagram: {"type":"triangleAngles","a":50,"b":44,"c":null}, q: "A triangle has two angles of 50° and 44°. Find the third angle", options: ["86°", "94°", "130°", "96°"], answer: 0 },
  { id: "py_hyp623", topic: "pythagoras", diagram: {"type":"rightTriangle","base":"8 cm","height":"6 cm","hyp":"?","unknownSide":"hyp"}, q: "A right-angled triangle has legs 6 cm and 8 cm. Find the hypotenuse", options: ["12 cm", "14 cm", "10 cm", "5.3 cm"], answer: 2 },
  { id: "py_tri624", topic: "pythagoras", diagram: {"type":"triangleAngles","a":74,"b":33,"c":null}, q: "A triangle has two angles of 74° and 33°. Find the third angle", options: ["107°", "83°", "73°", "106°"], answer: 2 },
  { id: "py_sl625", topic: "pythagoras", diagram: {"type":"straightLineAngles","a":134,"b":46}, q: "Two angles lie on a straight line. One angle is 134°. Find the other angle", options: ["56°", "226°", "46°", "134°"], answer: 2 },
  { id: "py_sl626", topic: "pythagoras", diagram: {"type":"straightLineAngles","a":29,"b":151}, q: "Two angles lie on a straight line. One angle is 29°. Find the other angle", options: ["331°", "29°", "161°", "151°"], answer: 3 },
  { id: "py_tri627", topic: "pythagoras", diagram: {"type":"triangleAngles","a":57,"b":50,"c":null}, q: "A triangle has two angles of 57° and 50°. Find the third angle", options: ["123°", "107°", "73°", "83°"], answer: 2 },
  { id: "py_tri629", topic: "pythagoras", diagram: {"type":"triangleAngles","a":98,"b":53,"c":null}, q: "A triangle has two angles of 98° and 53°. Find the third angle", options: ["82°", "29°", "151°", "39°"], answer: 1 },
  { id: "py_sl631", topic: "pythagoras", diagram: {"type":"straightLineAngles","a":136,"b":44}, q: "Two angles lie on a straight line. One angle is 136°. Find the other angle", options: ["224°", "54°", "136°", "44°"], answer: 3 },
  // Ch quad — 50 questions (2 from real Edexcel 4MA1 past papers, 48 practice questions in the same style)
  { id: "qu1", topic: "quad", ref: "Nov 2025 2F Q4", diagram: {"type":"polygon","n":6}, q: "Find the order of rotational symmetry of a regular hexagon", options: ["6", "3", "1", "12"], answer: 0 },
  { id: "qu2", topic: "quad", ref: "Nov 2025 2F Q4", q: "Name a quadrilateral with all 4 sides of equal length", options: ["Rhombus", "Rectangle", "Trapezium", "Kite"], answer: 0 },
  { id: "qu_area684", topic: "quad", diagram: {"type":"areaShape","shape":"rectangle","base":11,"height":10}, q: "Find the area of a rectangle 11 cm by 10 cm", options: ["21 cm²", "42 cm²", "110 cm²", "220 cm²"], answer: 2 },
  { id: "qu_area685", topic: "quad", diagram: {"type":"areaShape","shape":"parallelogram","base":13,"height":14}, q: "Find the area of a parallelogram with base 13 cm and perpendicular height 14 cm", options: ["364 cm²", "54 cm²", "27 cm²", "182 cm²"], answer: 3 },
  { id: "qu_area686", topic: "quad", diagram: {"type":"areaShape","shape":"triangle","base":12,"height":8}, q: "Find the area of a triangle with base 12 cm and height 8 cm", options: ["40 cm²", "20 cm²", "48 cm²", "96 cm²"], answer: 2 },
  { id: "qu_area687", topic: "quad", diagram: {"type":"areaShape","shape":"triangle","base":13,"height":9}, q: "Find the area of a triangle with base 13 cm and height 9 cm", options: ["58.5 cm²", "22 cm²", "117 cm²", "44 cm²"], answer: 0 },
  { id: "qu_int688", topic: "quad", diagram: {"type":"polygon","n":6}, q: "Find the size of one interior angle of a regular 6-sided polygon", options: ["120°", "180°", "130°", "60°"], answer: 0 },
  { id: "qu_int690", topic: "quad", diagram: {"type":"polygon","n":9}, q: "Find the size of one interior angle of a regular 9-sided polygon", options: ["180°", "40°", "140°", "150°"], answer: 2 },
  { id: "qu_area691", topic: "quad", diagram: {"type":"areaShape","shape":"rectangle","base":12,"height":5}, q: "Find the area of a rectangle 12 cm by 5 cm", options: ["17 cm²", "120 cm²", "60 cm²", "34 cm²"], answer: 2 },
  { id: "qu_area692", topic: "quad", diagram: {"type":"areaShape","shape":"rectangle","base":15,"height":13}, q: "Find the area of a rectangle 15 cm by 13 cm", options: ["195 cm²", "390 cm²", "28 cm²", "56 cm²"], answer: 0 },
  { id: "qu_int693", topic: "quad", diagram: {"type":"polygon","n":8}, q: "Find the size of one interior angle of a regular 8-sided polygon", options: ["145°", "180°", "45°", "135°"], answer: 3 },
  { id: "qu_area694", topic: "quad", diagram: {"type":"areaShape","shape":"parallelogram","base":9,"height":12}, q: "Find the area of a parallelogram with base 9 cm and perpendicular height 12 cm", options: ["42 cm²", "216 cm²", "21 cm²", "108 cm²"], answer: 3 },
  { id: "qu_area695", topic: "quad", diagram: {"type":"areaShape","shape":"parallelogram","base":17,"height":12}, q: "Find the area of a parallelogram with base 17 cm and perpendicular height 12 cm", options: ["58 cm²", "204 cm²", "408 cm²", "29 cm²"], answer: 1 },
  { id: "qu_int696", topic: "quad", diagram: {"type":"polygon","n":7}, q: "Find the size of one interior angle of a regular 7-sided polygon", options: ["128.6°", "51.4°", "180°", "138.6°"], answer: 0 },
  { id: "qu_int697", topic: "quad", diagram: {"type":"polygon","n":5}, q: "Find the size of one interior angle of a regular 5-sided polygon", options: ["180°", "108°", "72°", "118°"], answer: 1 },
  { id: "qu_area698", topic: "quad", diagram: {"type":"areaShape","shape":"rectangle","base":13,"height":8}, q: "Find the area of a rectangle 13 cm by 8 cm", options: ["208 cm²", "104 cm²", "42 cm²", "21 cm²"], answer: 1 },
  { id: "qu_area700", topic: "quad", diagram: {"type":"areaShape","shape":"triangle","base":5,"height":9}, q: "Find the area of a triangle with base 5 cm and height 9 cm", options: ["14 cm²", "28 cm²", "22.5 cm²", "45 cm²"], answer: 2 },
  { id: "qu_int703", topic: "quad", diagram: {"type":"polygon","n":10}, q: "Find the size of one interior angle of a regular 10-sided polygon", options: ["144°", "180°", "36°", "154°"], answer: 0 },
  { id: "qu_area706", topic: "quad", diagram: {"type":"areaShape","shape":"parallelogram","base":5,"height":12}, q: "Find the area of a parallelogram with base 5 cm and perpendicular height 12 cm", options: ["120 cm²", "34 cm²", "17 cm²", "60 cm²"], answer: 3 },
  { id: "qu_area709", topic: "quad", diagram: {"type":"areaShape","shape":"parallelogram","base":19,"height":8}, q: "Find the area of a parallelogram with base 19 cm and perpendicular height 8 cm", options: ["304 cm²", "27 cm²", "152 cm²", "54 cm²"], answer: 2 },
  { id: "qu_area711", topic: "quad", diagram: {"type":"areaShape","shape":"rectangle","base":7,"height":7}, q: "Find the area of a rectangle 7 cm by 7 cm", options: ["28 cm²", "98 cm²", "49 cm²", "14 cm²"], answer: 2 },
  { id: "qu_area714", topic: "quad", diagram: {"type":"areaShape","shape":"parallelogram","base":5,"height":6}, q: "Find the area of a parallelogram with base 5 cm and perpendicular height 6 cm", options: ["60 cm²", "30 cm²", "22 cm²", "11 cm²"], answer: 1 },
  { id: "qu_int715", topic: "quad", diagram: {"type":"polygon","n":12}, q: "Find the size of one interior angle of a regular 12-sided polygon", options: ["160°", "30°", "150°", "180°"], answer: 2 },
  { id: "qu_area716", topic: "quad", diagram: {"type":"areaShape","shape":"rectangle","base":10,"height":5}, q: "Find the area of a rectangle 10 cm by 5 cm", options: ["30 cm²", "15 cm²", "50 cm²", "100 cm²"], answer: 2 },
  { id: "qu_area718", topic: "quad", diagram: {"type":"areaShape","shape":"triangle","base":8,"height":10}, q: "Find the area of a triangle with base 8 cm and height 10 cm", options: ["40 cm²", "80 cm²", "18 cm²", "36 cm²"], answer: 0 },
  { id: "qu_area719", topic: "quad", diagram: {"type":"areaShape","shape":"triangle","base":20,"height":5}, q: "Find the area of a triangle with base 20 cm and height 5 cm", options: ["50 cm²", "54 cm²", "25 cm²", "100 cm²"], answer: 0 },
  { id: "qu_area720", topic: "quad", diagram: {"type":"areaShape","shape":"rectangle","base":16,"height":5}, q: "Find the area of a rectangle 16 cm by 5 cm", options: ["80 cm²", "160 cm²", "21 cm²", "42 cm²"], answer: 0 },
  { id: "qu_area721", topic: "quad", diagram: {"type":"areaShape","shape":"rectangle","base":9,"height":9}, q: "Find the area of a rectangle 9 cm by 9 cm", options: ["36 cm²", "18 cm²", "81 cm²", "162 cm²"], answer: 2 },
  { id: "qu_area724", topic: "quad", diagram: {"type":"areaShape","shape":"rectangle","base":10,"height":3}, q: "Find the area of a rectangle 10 cm by 3 cm", options: ["26 cm²", "30 cm²", "60 cm²", "13 cm²"], answer: 1 },
  { id: "qu_area725", topic: "quad", diagram: {"type":"areaShape","shape":"triangle","base":18,"height":14}, q: "Find the area of a triangle with base 18 cm and height 14 cm", options: ["32 cm²", "126 cm²", "64 cm²", "252 cm²"], answer: 1 },
  { id: "qu_area726", topic: "quad", diagram: {"type":"areaShape","shape":"parallelogram","base":14,"height":6}, q: "Find the area of a parallelogram with base 14 cm and perpendicular height 6 cm", options: ["40 cm²", "168 cm²", "20 cm²", "84 cm²"], answer: 3 },
  { id: "qu_area730", topic: "quad", diagram: {"type":"areaShape","shape":"triangle","base":9,"height":15}, q: "Find the area of a triangle with base 9 cm and height 15 cm", options: ["67.5 cm²", "135 cm²", "24 cm²", "48 cm²"], answer: 0 },
  { id: "qu_area733", topic: "quad", diagram: {"type":"areaShape","shape":"rectangle","base":5,"height":5}, q: "Find the area of a rectangle 5 cm by 5 cm", options: ["20 cm²", "10 cm²", "25 cm²", "50 cm²"], answer: 2 },
  { id: "qu_area734", topic: "quad", diagram: {"type":"areaShape","shape":"triangle","base":6,"height":3}, q: "Find the area of a triangle with base 6 cm and height 3 cm", options: ["9 cm²", "8.2 cm²", "4.3 cm²", "18 cm²"], answer: 0 },
  { id: "qu_area739", topic: "quad", diagram: {"type":"areaShape","shape":"parallelogram","base":5,"height":3}, q: "Find the area of a parallelogram with base 5 cm and perpendicular height 3 cm", options: ["15 cm²", "30 cm²", "8 cm²", "16 cm²"], answer: 0 },
  { id: "qu_area745", topic: "quad", diagram: {"type":"areaShape","shape":"parallelogram","base":14,"height":15}, q: "Find the area of a parallelogram with base 14 cm and perpendicular height 15 cm", options: ["210 cm²", "29 cm²", "58 cm²", "420 cm²"], answer: 0 },
  { id: "qu_area747", topic: "quad", diagram: {"type":"areaShape","shape":"triangle","base":8,"height":14}, q: "Find the area of a triangle with base 8 cm and height 14 cm", options: ["44 cm²", "112 cm²", "22 cm²", "56 cm²"], answer: 3 },
  { id: "qu_area752", topic: "quad", diagram: {"type":"areaShape","shape":"parallelogram","base":12,"height":4}, q: "Find the area of a parallelogram with base 12 cm and perpendicular height 4 cm", options: ["32 cm²", "16 cm²", "48 cm²", "96 cm²"], answer: 2 },
  { id: "qu_area754", topic: "quad", diagram: {"type":"areaShape","shape":"rectangle","base":18,"height":6}, q: "Find the area of a rectangle 18 cm by 6 cm", options: ["24 cm²", "108 cm²", "48 cm²", "216 cm²"], answer: 1 },
  { id: "qu_area757", topic: "quad", diagram: {"type":"areaShape","shape":"triangle","base":19,"height":8}, q: "Find the area of a triangle with base 19 cm and height 8 cm", options: ["27 cm²", "76 cm²", "152 cm²", "54 cm²"], answer: 1 },
  { id: "qu_area762", topic: "quad", diagram: {"type":"areaShape","shape":"triangle","base":14,"height":9}, q: "Find the area of a triangle with base 14 cm and height 9 cm", options: ["126 cm²", "23 cm²", "63 cm²", "46 cm²"], answer: 2 },
  { id: "qu_area763", topic: "quad", diagram: {"type":"areaShape","shape":"triangle","base":13,"height":8}, q: "Find the area of a triangle with base 13 cm and height 8 cm", options: ["21 cm²", "104 cm²", "52 cm²", "42 cm²"], answer: 2 },
  { id: "qu_area764", topic: "quad", diagram: {"type":"areaShape","shape":"rectangle","base":14,"height":5}, q: "Find the area of a rectangle 14 cm by 5 cm", options: ["70 cm²", "19 cm²", "38 cm²", "140 cm²"], answer: 0 },
  { id: "qu_area768", topic: "quad", diagram: {"type":"areaShape","shape":"parallelogram","base":10,"height":10}, q: "Find the area of a parallelogram with base 10 cm and perpendicular height 10 cm", options: ["200 cm²", "20 cm²", "100 cm²", "40 cm²"], answer: 2 },
  { id: "qu_area770", topic: "quad", diagram: {"type":"areaShape","shape":"rectangle","base":15,"height":6}, q: "Find the area of a rectangle 15 cm by 6 cm", options: ["21 cm²", "90 cm²", "42 cm²", "180 cm²"], answer: 1 },
  { id: "qu_area771", topic: "quad", diagram: {"type":"areaShape","shape":"parallelogram","base":12,"height":9}, q: "Find the area of a parallelogram with base 12 cm and perpendicular height 9 cm", options: ["216 cm²", "21 cm²", "108 cm²", "42 cm²"], answer: 2 },
  { id: "qu_area772", topic: "quad", diagram: {"type":"areaShape","shape":"triangle","base":5,"height":4}, q: "Find the area of a triangle with base 5 cm and height 4 cm", options: ["10 cm²", "20 cm²", "18 cm²", "9 cm²"], answer: 0 },
  { id: "qu_area774", topic: "quad", diagram: {"type":"areaShape","shape":"triangle","base":8,"height":3}, q: "Find the area of a triangle with base 8 cm and height 3 cm", options: ["24 cm²", "22 cm²", "12 cm²", "11 cm²"], answer: 2 },
  { id: "qu_area782", topic: "quad", diagram: {"type":"areaShape","shape":"parallelogram","base":13,"height":9}, q: "Find the area of a parallelogram with base 13 cm and perpendicular height 9 cm", options: ["22 cm²", "117 cm²", "234 cm²", "44 cm²"], answer: 1 },
  { id: "qu_area783", topic: "quad", diagram: {"type":"areaShape","shape":"rectangle","base":19,"height":14}, q: "Find the area of a rectangle 19 cm by 14 cm", options: ["66 cm²", "532 cm²", "33 cm²", "266 cm²"], answer: 3 },
  // Ch circles — 50 questions (4 from real Edexcel 4MA1 past papers, 46 practice questions in the same style)
  { id: "ci1", topic: "circles", ref: "June 2025 2F Q15", diagram: {"type":"circle","r":16,"label":"16 cm"}, q: "A circle has radius 16 cm. Find its circumference, correct to 3 s.f.", options: ["101 cm", "50.3 cm", "804 cm", "201 cm"], answer: 0 },
  { id: "ci2", topic: "circles", ref: "Nov 2024 2F Q16", diagram: {"type":"circle","r":9,"label":"9 cm"}, q: "A circle has radius 9 cm. Find its area, correct to 3 s.f.", options: ["254 cm²", "56.5 cm²", "28.3 cm²", "509 cm²"], answer: 0 },
  { id: "ci3", topic: "circles", ref: "June 2023 2F Q12", diagram: {"type":"circle","r":8.5,"label":"8.5 cm"}, q: "A circle has radius 8.5 cm. Find its circumference, correct to 3 s.f.", options: ["53.4 cm", "26.7 cm", "227 cm", "17 cm"], answer: 0 },
  { id: "ci4", topic: "circles", ref: "June 2022 2F Q7", diagram: {"type":"circle","r":6.5,"label":"6.5 cm"}, q: "A circle has radius 6.5 cm. Find its circumference, correct to 3 s.f.", options: ["40.8 cm", "20.4 cm", "132.7 cm", "13 cm"], answer: 0 },
  { id: "ci_a855", topic: "circles", diagram: {"type":"circle","r":14,"label":"14 cm"}, q: "A circle has radius 14 cm. Find its area, correct to 3 s.f.", options: ["88 cm²", "616 cm²", "44 cm²", "1230 cm²"], answer: 1 },
  { id: "ci_d856", topic: "circles", diagram: {"type":"circle","r":14,"label":"C = 88 cm"}, q: "A circle has circumference 88 cm. Find its diameter, correct to the nearest cm", options: ["14 cm", "28 cm", "30 cm", "32.6 cm"], answer: 1 },
  { id: "ci_d857", topic: "circles", diagram: {"type":"circle","r":23,"label":"C = 144.5 cm"}, q: "A circle has circumference 144.5 cm. Find its diameter, correct to the nearest cm", options: ["48 cm", "23 cm", "51.6 cm", "46 cm"], answer: 3 },
  { id: "ci_d858", topic: "circles", diagram: {"type":"circle","r":18,"label":"C = 113.1 cm"}, q: "A circle has circumference 113.1 cm. Find its diameter, correct to the nearest cm", options: ["36 cm", "18 cm", "24.2 cm", "38 cm"], answer: 0 },
  { id: "ci_a859", topic: "circles", diagram: {"type":"circle","r":20,"label":"20 cm"}, q: "A circle has radius 20 cm. Find its area, correct to 3 s.f.", options: ["126 cm²", "1260 cm²", "2510 cm²", "62.8 cm²"], answer: 1 },
  { id: "ci_a860", topic: "circles", diagram: {"type":"circle","r":24,"label":"24 cm"}, q: "A circle has radius 24 cm. Find its area, correct to 3 s.f.", options: ["151 cm²", "75.4 cm²", "3620 cm²", "1810 cm²"], answer: 3 },
  { id: "ci_d861", topic: "circles", diagram: {"type":"circle","r":24,"label":"C = 150.8 cm"}, q: "A circle has circumference 150.8 cm. Find its diameter, correct to the nearest cm", options: ["55.6 cm", "24 cm", "50 cm", "48 cm"], answer: 3 },
  { id: "ci_d862", topic: "circles", diagram: {"type":"circle","r":13,"label":"C = 81.7 cm"}, q: "A circle has circumference 81.7 cm. Find its diameter, correct to the nearest cm", options: ["19.2 cm", "26 cm", "28 cm", "13 cm"], answer: 1 },
  { id: "ci_a863", topic: "circles", diagram: {"type":"circle","r":22,"label":"22 cm"}, q: "A circle has radius 22 cm. Find its area, correct to 3 s.f.", options: ["69.1 cm²", "1520 cm²", "3040 cm²", "138 cm²"], answer: 1 },
  { id: "ci_c864", topic: "circles", diagram: {"type":"circle","r":22,"label":"22 cm"}, q: "A circle has radius 22 cm. Find its circumference, correct to 3 s.f.", options: ["1520 cm", "3040 cm", "138 cm", "69.1 cm"], answer: 2 },
  { id: "ci_c865", topic: "circles", diagram: {"type":"circle","r":25,"label":"25 cm"}, q: "A circle has radius 25 cm. Find its circumference, correct to 3 s.f.", options: ["3930 cm", "157 cm", "78.5 cm", "1960 cm"], answer: 1 },
  { id: "ci_c866", topic: "circles", diagram: {"type":"circle","r":7,"label":"7 cm"}, q: "A circle has radius 7 cm. Find its circumference, correct to 3 s.f.", options: ["154 cm", "44 cm", "22 cm", "308 cm"], answer: 1 },
  { id: "ci_d868", topic: "circles", diagram: {"type":"circle","r":12,"label":"C = 75.4 cm"}, q: "A circle has circumference 75.4 cm. Find its diameter, correct to the nearest cm", options: ["24 cm", "14.8 cm", "12 cm", "26 cm"], answer: 0 },
  { id: "ci_c869", topic: "circles", diagram: {"type":"circle","r":18,"label":"18 cm"}, q: "A circle has radius 18 cm. Find its circumference, correct to 3 s.f.", options: ["113 cm", "56.5 cm", "2040 cm", "1020 cm"], answer: 0 },
  { id: "ci_c870", topic: "circles", diagram: {"type":"circle","r":10,"label":"10 cm"}, q: "A circle has radius 10 cm. Find its circumference, correct to 3 s.f.", options: ["628 cm", "31.4 cm", "62.8 cm", "314 cm"], answer: 2 },
  { id: "ci_a872", topic: "circles", diagram: {"type":"circle","r":11,"label":"11 cm"}, q: "A circle has radius 11 cm. Find its area, correct to 3 s.f.", options: ["34.6 cm²", "69.1 cm²", "380 cm²", "760 cm²"], answer: 2 },
  { id: "ci_a873", topic: "circles", diagram: {"type":"circle","r":16,"label":"16 cm"}, q: "A circle has radius 16 cm. Find its area, correct to 3 s.f.", options: ["1610 cm²", "101 cm²", "50.3 cm²", "804 cm²"], answer: 3 },
  { id: "ci_c874", topic: "circles", diagram: {"type":"circle","r":17,"label":"17 cm"}, q: "A circle has radius 17 cm. Find its circumference, correct to 3 s.f.", options: ["53.4 cm", "1820 cm", "908 cm", "107 cm"], answer: 3 },
  { id: "ci_d878", topic: "circles", diagram: {"type":"circle","r":3,"label":"C = 18.8 cm"}, q: "A circle has circumference 18.8 cm. Find its diameter, correct to the nearest cm", options: ["3 cm", "8.6 cm", "8 cm", "6 cm"], answer: 3 },
  { id: "ci_a879", topic: "circles", diagram: {"type":"circle","r":25,"label":"25 cm"}, q: "A circle has radius 25 cm. Find its area, correct to 3 s.f.", options: ["1960 cm²", "157 cm²", "3930 cm²", "78.5 cm²"], answer: 0 },
  { id: "ci_d881", topic: "circles", diagram: {"type":"circle","r":8,"label":"C = 50.3 cm"}, q: "A circle has circumference 50.3 cm. Find its diameter, correct to the nearest cm", options: ["9.2 cm", "16 cm", "18 cm", "8 cm"], answer: 1 },
  { id: "ci_d883", topic: "circles", diagram: {"type":"circle","r":7,"label":"C = 44 cm"}, q: "A circle has circumference 44 cm. Find its diameter, correct to the nearest cm", options: ["7 cm", "16 cm", "16.4 cm", "14 cm"], answer: 3 },
  { id: "ci_c884", topic: "circles", diagram: {"type":"circle","r":6,"label":"6 cm"}, q: "A circle has radius 6 cm. Find its circumference, correct to 3 s.f.", options: ["226 cm", "18.9 cm", "37.7 cm", "113 cm"], answer: 2 },
  { id: "ci_a887", topic: "circles", diagram: {"type":"circle","r":7,"label":"7 cm"}, q: "A circle has radius 7 cm. Find its area, correct to 3 s.f.", options: ["44 cm²", "308 cm²", "22 cm²", "154 cm²"], answer: 3 },
  { id: "ci_a888", topic: "circles", diagram: {"type":"circle","r":5,"label":"5 cm"}, q: "A circle has radius 5 cm. Find its area, correct to 3 s.f.", options: ["31.4 cm²", "15.7 cm²", "78.5 cm²", "157 cm²"], answer: 2 },
  { id: "ci_c889", topic: "circles", diagram: {"type":"circle","r":16,"label":"16 cm"}, q: "A circle has radius 16 cm. Find its circumference, correct to 3 s.f.", options: ["1610 cm", "804 cm", "50.3 cm", "101 cm"], answer: 3 },
  { id: "ci_a891", topic: "circles", diagram: {"type":"circle","r":9,"label":"9 cm"}, q: "A circle has radius 9 cm. Find its area, correct to 3 s.f.", options: ["56.5 cm²", "254 cm²", "509 cm²", "28.3 cm²"], answer: 1 },
  { id: "ci_d896", topic: "circles", diagram: {"type":"circle","r":6,"label":"C = 37.7 cm"}, q: "A circle has circumference 37.7 cm. Find its diameter, correct to the nearest cm", options: ["14 cm", "6 cm", "12 cm", "9.8 cm"], answer: 2 },
  { id: "ci_c897", topic: "circles", diagram: {"type":"circle","r":11,"label":"11 cm"}, q: "A circle has radius 11 cm. Find its circumference, correct to 3 s.f.", options: ["34.6 cm", "69.1 cm", "760 cm", "380 cm"], answer: 1 },
  { id: "ci_a901", topic: "circles", diagram: {"type":"circle","r":12,"label":"12 cm"}, q: "A circle has radius 12 cm. Find its area, correct to 3 s.f.", options: ["905 cm²", "37.7 cm²", "75.4 cm²", "452 cm²"], answer: 3 },
  { id: "ci_a903", topic: "circles", diagram: {"type":"circle","r":13,"label":"13 cm"}, q: "A circle has radius 13 cm. Find its area, correct to 3 s.f.", options: ["531 cm²", "1060 cm²", "81.7 cm²", "40.8 cm²"], answer: 0 },
  { id: "ci_a905", topic: "circles", diagram: {"type":"circle","r":8,"label":"8 cm"}, q: "A circle has radius 8 cm. Find its area, correct to 3 s.f.", options: ["25.1 cm²", "50.3 cm²", "402 cm²", "201 cm²"], answer: 3 },
  { id: "ci_c907", topic: "circles", diagram: {"type":"circle","r":20,"label":"20 cm"}, q: "A circle has radius 20 cm. Find its circumference, correct to 3 s.f.", options: ["1260 cm", "62.8 cm", "126 cm", "2510 cm"], answer: 2 },
  { id: "ci_c910", topic: "circles", diagram: {"type":"circle","r":3,"label":"3 cm"}, q: "A circle has radius 3 cm. Find its circumference, correct to 3 s.f.", options: ["56.5 cm", "28.3 cm", "9.43 cm", "18.9 cm"], answer: 3 },
  { id: "ci_c911", topic: "circles", diagram: {"type":"circle","r":12,"label":"12 cm"}, q: "A circle has radius 12 cm. Find its circumference, correct to 3 s.f.", options: ["905 cm", "452 cm", "37.7 cm", "75.4 cm"], answer: 3 },
  { id: "ci_a913", topic: "circles", diagram: {"type":"circle","r":10,"label":"10 cm"}, q: "A circle has radius 10 cm. Find its area, correct to 3 s.f.", options: ["62.8 cm²", "31.4 cm²", "314 cm²", "628 cm²"], answer: 2 },
  { id: "ci_d915", topic: "circles", diagram: {"type":"circle","r":5,"label":"C = 31.4 cm"}, q: "A circle has circumference 31.4 cm. Find its diameter, correct to the nearest cm", options: ["14 cm", "12 cm", "5 cm", "10 cm"], answer: 3 },
  { id: "ci_d917", topic: "circles", diagram: {"type":"circle","r":15,"label":"C = 94.2 cm"}, q: "A circle has circumference 94.2 cm. Find its diameter, correct to the nearest cm", options: ["20 cm", "15 cm", "32 cm", "30 cm"], answer: 3 },
  { id: "ci_a918", topic: "circles", diagram: {"type":"circle","r":3,"label":"3 cm"}, q: "A circle has radius 3 cm. Find its area, correct to 3 s.f.", options: ["28.3 cm²", "56.5 cm²", "18.9 cm²", "9.43 cm²"], answer: 0 },
  { id: "ci_c919", topic: "circles", diagram: {"type":"circle","r":5,"label":"5 cm"}, q: "A circle has radius 5 cm. Find its circumference, correct to 3 s.f.", options: ["78.5 cm", "157 cm", "31.4 cm", "15.7 cm"], answer: 2 },
  { id: "ci_d920", topic: "circles", diagram: {"type":"circle","r":9,"label":"C = 56.5 cm"}, q: "A circle has circumference 56.5 cm. Find its diameter, correct to the nearest cm", options: ["20 cm", "9 cm", "15.4 cm", "18 cm"], answer: 3 },
  { id: "ci_d921", topic: "circles", diagram: {"type":"circle","r":20,"label":"C = 125.7 cm"}, q: "A circle has circumference 125.7 cm. Find its diameter, correct to the nearest cm", options: ["42 cm", "40 cm", "20 cm", "30 cm"], answer: 1 },
  { id: "ci_a923", topic: "circles", diagram: {"type":"circle","r":15,"label":"15 cm"}, q: "A circle has radius 15 cm. Find its area, correct to 3 s.f.", options: ["94.2 cm²", "47.1 cm²", "707 cm²", "1410 cm²"], answer: 2 },
  { id: "ci_d924", topic: "circles", diagram: {"type":"circle","r":25,"label":"C = 157.1 cm"}, q: "A circle has circumference 157.1 cm. Find its diameter, correct to the nearest cm", options: ["50 cm", "54 cm", "52 cm", "25 cm"], answer: 0 },
  { id: "ci_a925", topic: "circles", diagram: {"type":"circle","r":18,"label":"18 cm"}, q: "A circle has radius 18 cm. Find its area, correct to 3 s.f.", options: ["1020 cm²", "2040 cm²", "56.5 cm²", "113 cm²"], answer: 0 },
  { id: "ci_a928", topic: "circles", diagram: {"type":"circle","r":2,"label":"2 cm"}, q: "A circle has radius 2 cm. Find its area, correct to 3 s.f.", options: ["13.3 cm²", "25.1 cm²", "12.6 cm²", "6.28 cm²"], answer: 2 },
  // Ch coordgeo — 50 questions (2 from real Edexcel 4MA1 past papers, 48 practice questions in the same style)
  { id: "cg1", topic: "coordgeo", ref: "June 2026 1F Q16", q: "For the line y = 5 − 2x, find the gradient", options: ["−2", "5", "2", "−5"], answer: 0 },
  { id: "cg2", topic: "coordgeo", ref: "June 2026 1F Q16", q: "For the line y = 5 − 2x, find the y-intercept", options: ["5", "−2", "0", "2.5"], answer: 0 },
  { id: "cg_grad3135", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":8,"y":-4,"label":"A"},{"x":3,"y":-14,"label":"B"}],"showLine":true}, q: "Find the gradient of the line through (8, -4) and (3, -14)", options: ["-10/11", "18/5", "1/2", "2"], answer: 3 },
  { id: "cg_dist3136", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":5,"y":4,"label":"A"},{"x":10,"y":16,"label":"B"}],"showLine":true}, q: "Find the distance between (5, 4) and (10, 16)", options: ["15", "5", "13", "17"], answer: 2 },
  { id: "cg_dist3137", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":1,"y":1,"label":"A"},{"x":4,"y":5,"label":"B"}],"showLine":true}, q: "Find the distance between (1, 1) and (4, 5)", options: ["7", "5", "7.5", "3"], answer: 1 },
  { id: "cg_mid3138", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":5,"y":-7,"label":"A"},{"x":-5,"y":-7,"label":"B"}],"showLine":true}, q: "Find the midpoint of (5, -7) and (-5, -7)", options: ["(1, -7)", "(0, -7)", "(0, -6)", "(0, -14)"], answer: 1 },
  { id: "cg_mid3141", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":10,"y":-9,"label":"A"},{"x":-5,"y":-4,"label":"B"}],"showLine":true}, q: "Find the midpoint of (10, -9) and (-5, -4)", options: ["(5, -13)", "(2.5, -5.5)", "(3.5, -6.5)", "(2.5, -6.5)"], answer: 3 },
  { id: "cg_eq3142", topic: "coordgeo", q: "For the line y = −x + 8, find the gradient", options: ["1", "8", "0", "-1"], answer: 3 },
  { id: "cg_mid3143", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":-9,"y":-1,"label":"A"},{"x":6,"y":-4,"label":"B"}],"showLine":true}, q: "Find the midpoint of (-9, -1) and (6, -4)", options: ["(-1.5, -2.5)", "(-0.5, -2.5)", "(-3, -5)", "(-1.5, -1.5)"], answer: 0 },
  { id: "cg_grad3144", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":-4,"y":0,"label":"A"},{"x":-7,"y":-3,"label":"B"}],"showLine":true}, q: "Find the gradient of the line through (-4, 0) and (-7, -3)", options: ["9/8", "3/11", "1", "1/2"], answer: 2 },
  { id: "cg_dist3145", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":-5,"y":1,"label":"A"},{"x":0,"y":13,"label":"B"}],"showLine":true}, q: "Find the distance between (-5, 1) and (0, 13)", options: ["15", "13", "5", "17"], answer: 1 },
  { id: "cg_eq3146", topic: "coordgeo", q: "For the line y = -2x + 9, find the gradient", options: ["-1", "2", "-2", "9"], answer: 2 },
  { id: "cg_dist3147", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":-1,"y":4,"label":"A"},{"x":2,"y":8,"label":"B"}],"showLine":true}, q: "Find the distance between (-1, 4) and (2, 8)", options: ["7.5", "3", "5", "7"], answer: 2 },
  { id: "cg_grad3149", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":-4,"y":4,"label":"A"},{"x":-6,"y":14,"label":"B"}],"showLine":true}, q: "Find the gradient of the line through (-4, 4) and (-6, 14)", options: ["-9", "-5", "-1", "-1/5"], answer: 1 },
  { id: "cg_mid3150", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":-1,"y":-10,"label":"A"},{"x":-8,"y":-9,"label":"B"}],"showLine":true}, q: "Find the midpoint of (-1, -10) and (-8, -9)", options: ["(-3.5, -9.5)", "(-4.5, -9.5)", "(-9, -19)", "(-4.5, -8.5)"], answer: 1 },
  { id: "cg_dist3151", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":3,"y":-5,"label":"A"},{"x":6,"y":-1,"label":"B"}],"showLine":true}, q: "Find the distance between (3, -5) and (6, -1)", options: ["7", "5.5", "3", "5"], answer: 3 },
  { id: "cg_dist3152", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":-1,"y":-2,"label":"A"},{"x":4,"y":10,"label":"B"}],"showLine":true}, q: "Find the distance between (-1, -2) and (4, 10)", options: ["17", "5", "13", "15"], answer: 2 },
  { id: "cg_mid3153", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":2,"y":4,"label":"A"},{"x":-1,"y":-1,"label":"B"}],"showLine":true}, q: "Find the midpoint of (2, 4) and (-1, -1)", options: ["(1, 3)", "(0.5, 1.5)", "(1.5, 1.5)", "(0.5, 2.5)"], answer: 1 },
  { id: "cg_dist3154", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":2,"y":5,"label":"A"},{"x":7,"y":17,"label":"B"}],"showLine":true}, q: "Find the distance between (2, 5) and (7, 17)", options: ["15", "5", "13", "17"], answer: 2 },
  { id: "cg_eq3155", topic: "coordgeo", q: "For the line y = 5x − 4, find the gradient", options: ["-5", "-4", "6", "5"], answer: 3 },
  { id: "cg_eq3156", topic: "coordgeo", q: "For the line y = -3x − 8, find the gradient", options: ["3", "-3", "-2", "-8"], answer: 1 },
  { id: "cg_mid3157", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":-1,"y":7,"label":"A"},{"x":10,"y":4,"label":"B"}],"showLine":true}, q: "Find the midpoint of (-1, 7) and (10, 4)", options: ["(9, 11)", "(4.5, 6.5)", "(4.5, 5.5)", "(5.5, 5.5)"], answer: 2 },
  { id: "cg_dist3158", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":6,"y":-3,"label":"A"},{"x":9,"y":1,"label":"B"}],"showLine":true}, q: "Find the distance between (6, -3) and (9, 1)", options: ["3", "7", "5", "4.5"], answer: 2 },
  { id: "cg_dist3159", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":2,"y":2,"label":"A"},{"x":8,"y":10,"label":"B"}],"showLine":true}, q: "Find the distance between (2, 2) and (8, 10)", options: ["6", "10", "14", "12"], answer: 1 },
  { id: "cg_mid3160", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":-7,"y":8,"label":"A"},{"x":1,"y":10,"label":"B"}],"showLine":true}, q: "Find the midpoint of (-7, 8) and (1, 10)", options: ["(-6, 18)", "(-2, 9)", "(-3, 9)", "(-3, 10)"], answer: 2 },
  { id: "cg_dist3161", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":-1,"y":2,"label":"A"},{"x":5,"y":10,"label":"B"}],"showLine":true}, q: "Find the distance between (-1, 2) and (5, 10)", options: ["14", "12", "10", "6"], answer: 2 },
  { id: "cg_grad3162", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":0,"y":5,"label":"A"},{"x":8,"y":37,"label":"B"}],"showLine":true}, q: "Find the gradient of the line through (0, 5) and (8, 37)", options: ["1/4", "4", "21/4", "5/7"], answer: 1 },
  { id: "cg_mid3163", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":0,"y":-1,"label":"A"},{"x":-5,"y":1,"label":"B"}],"showLine":true}, q: "Find the midpoint of (0, -1) and (-5, 1)", options: ["(-5, 0)", "(-2.5, 1)", "(-2.5, 0)", "(-1.5, 0)"], answer: 2 },
  { id: "cg_mid3164", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":1,"y":-10,"label":"A"},{"x":7,"y":-2,"label":"B"}],"showLine":true}, q: "Find the midpoint of (1, -10) and (7, -2)", options: ["(4, -6)", "(8, -12)", "(4, -5)", "(5, -6)"], answer: 0 },
  { id: "cg_mid3165", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":-4,"y":-4,"label":"A"},{"x":7,"y":7,"label":"B"}],"showLine":true}, q: "Find the midpoint of (-4, -4) and (7, 7)", options: ["(2.5, 1.5)", "(1.5, 2.5)", "(3, 3)", "(1.5, 1.5)"], answer: 3 },
  { id: "cg_eq3166", topic: "coordgeo", q: "For the line y = 4x + 10, find the gradient", options: ["4", "-4", "10", "5"], answer: 0 },
  { id: "cg_grad3167", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":0,"y":-5,"label":"A"},{"x":8,"y":27,"label":"B"}],"showLine":true}, q: "Find the gradient of the line through (0, -5) and (8, 27)", options: ["3/7", "11/4", "4", "1/4"], answer: 2 },
  { id: "cg_grad3168", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":8,"y":-1,"label":"A"},{"x":-7,"y":-16,"label":"B"}],"showLine":true}, q: "Find the gradient of the line through (8, -1) and (-7, -16)", options: ["4/9", "-15", "17/15", "1"], answer: 3 },
  { id: "cg_eq3169", topic: "coordgeo", q: "For the line y = −x − 5, find the gradient", options: ["1", "-5", "-1", "0"], answer: 2 },
  { id: "cg_dist3171", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":6,"y":-5,"label":"A"},{"x":9,"y":-1,"label":"B"}],"showLine":true}, q: "Find the distance between (6, -5) and (9, -1)", options: ["4.5", "3", "5", "7"], answer: 2 },
  { id: "cg_grad3172", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":-4,"y":8,"label":"A"},{"x":-5,"y":5,"label":"B"}],"showLine":true}, q: "Find the gradient of the line through (-4, 8) and (-5, 5)", options: ["-13", "3", "9", "1/3"], answer: 1 },
  { id: "cg_mid3173", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":7,"y":9,"label":"A"},{"x":10,"y":2,"label":"B"}],"showLine":true}, q: "Find the midpoint of (7, 9) and (10, 2)", options: ["(8.5, 5.5)", "(9.5, 5.5)", "(17, 11)", "(8.5, 6.5)"], answer: 0 },
  { id: "cg_dist3174", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":5,"y":0,"label":"A"},{"x":13,"y":15,"label":"B"}],"showLine":true}, q: "Find the distance between (5, 0) and (13, 15)", options: ["19", "8", "17", "23"], answer: 2 },
  { id: "cg_dist3175", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":-3,"y":2,"label":"A"},{"x":0,"y":6,"label":"B"}],"showLine":true}, q: "Find the distance between (-3, 2) and (0, 6)", options: ["3", "7.5", "5", "7"], answer: 2 },
  { id: "cg_dist3176", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":-2,"y":4,"label":"A"},{"x":6,"y":19,"label":"B"}],"showLine":true}, q: "Find the distance between (-2, 4) and (6, 19)", options: ["19", "23", "17", "8"], answer: 2 },
  { id: "cg_eq3177", topic: "coordgeo", q: "For the line y = x − 9, find the gradient", options: ["2", "1", "-9", "-1"], answer: 1 },
  { id: "cg_dist3178", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":5,"y":-3,"label":"A"},{"x":10,"y":9,"label":"B"}],"showLine":true}, q: "Find the distance between (5, -3) and (10, 9)", options: ["13", "17", "5", "15"], answer: 0 },
  { id: "cg_mid3179", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":9,"y":5,"label":"A"},{"x":2,"y":6,"label":"B"}],"showLine":true}, q: "Find the midpoint of (9, 5) and (2, 6)", options: ["(6.5, 5.5)", "(5.5, 5.5)", "(5.5, 6.5)", "(11, 11)"], answer: 1 },
  { id: "cg_eq3180", topic: "coordgeo", q: "For the line y = -6x + 3, find the gradient", options: ["-5", "-6", "6", "3"], answer: 1 },
  { id: "cg_mid3182", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":-10,"y":7,"label":"A"},{"x":-4,"y":5,"label":"B"}],"showLine":true}, q: "Find the midpoint of (-10, 7) and (-4, 5)", options: ["(-14, 12)", "(-6, 6)", "(-7, 7)", "(-7, 6)"], answer: 3 },
  { id: "cg_mid3183", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":-2,"y":2,"label":"A"},{"x":6,"y":-6,"label":"B"}],"showLine":true}, q: "Find the midpoint of (-2, 2) and (6, -6)", options: ["(3, -2)", "(2, -1)", "(2, -2)", "(4, -4)"], answer: 2 },
  { id: "cg_dist3184", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":1,"y":1,"label":"A"},{"x":7,"y":9,"label":"B"}],"showLine":true}, q: "Find the distance between (1, 1) and (7, 9)", options: ["6", "10", "14", "12"], answer: 1 },
  { id: "cg_mid3185", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":9,"y":3,"label":"A"},{"x":10,"y":-6,"label":"B"}],"showLine":true}, q: "Find the midpoint of (9, 3) and (10, -6)", options: ["(10.5, -1.5)", "(9.5, -0.5)", "(19, -3)", "(9.5, -1.5)"], answer: 3 },
  { id: "cg_grad3186", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":-4,"y":-1,"label":"A"},{"x":-2,"y":1,"label":"B"}],"showLine":true}, q: "Find the gradient of the line through (-4, -1) and (-2, 1)", options: ["-1/3", "1", "5/8", "0"], answer: 1 },
  { id: "cg_mid3187", topic: "coordgeo", diagram: {"type":"coordPlot","points":[{"x":-3,"y":6,"label":"A"},{"x":3,"y":6,"label":"B"}],"showLine":true}, q: "Find the midpoint of (-3, 6) and (3, 6)", options: ["(1, 6)", "(0, 12)", "(0, 6)", "(0, 7)"], answer: 2 },
  // Ch graphs — 50 questions (3 from real Edexcel 4MA1 past papers, 47 practice questions in the same style)
  { id: "gr1", topic: "graphs", ref: "June 2025 1F Q8", diagram: {"type":"linearGraph","m":2,"c":-1}, q: "For y = 2x − 1, find y when x = −2", options: ["−5", "−3", "3", "5"], answer: 0 },
  { id: "gr2", topic: "graphs", ref: "June 2025 1F Q8", diagram: {"type":"linearGraph","m":2,"c":-1}, q: "For y = 2x − 1, find y when x = −1", options: ["−3", "−5", "1", "3"], answer: 0 },
  { id: "gr3", topic: "graphs", ref: "June 2025 1F Q8", diagram: {"type":"linearGraph","m":2,"c":-1}, q: "For y = 2x − 1, find y when x = 2", options: ["3", "5", "−3", "1"], answer: 0 },
  { id: "gr_lin3221", topic: "graphs", diagram: {"type":"linearGraph","m":2,"c":2}, q: "For y = 2x + 2, find y when x = 5", options: ["14", "8", "12", "9"], answer: 2 },
  { id: "gr_quad3222", topic: "graphs", diagram: {"type":"quadGraph","a":1,"c":5}, q: "For y = x² + 5, find y when x = -1", options: ["6", "-4", "8", "4"], answer: 0 },
  { id: "gr_quad3223", topic: "graphs", diagram: {"type":"quadGraph","a":2,"c":5}, q: "For y = 2x² + 5, find y when x = -1", options: ["-3", "9", "7", "3"], answer: 2 },
  { id: "gr_quad3224", topic: "graphs", diagram: {"type":"quadGraph","a":-1,"c":6}, q: "For y = −x² + 6, find y when x = 1", options: ["5", "6.5", "7", "-7"], answer: 0 },
  { id: "gr_quad3225", topic: "graphs", diagram: {"type":"quadGraph","a":1,"c":4}, q: "For y = x² + 4, find y when x = 1", options: ["-3", "7", "5", "6.5"], answer: 2 },
  { id: "gr_lin3226", topic: "graphs", diagram: {"type":"linearGraph","m":-2,"c":8}, q: "For y = -2x + 8, find y when x = 3", options: ["-14", "0", "9", "2"], answer: 3 },
  { id: "gr_quad3227", topic: "graphs", diagram: {"type":"quadGraph","a":1,"c":-4}, q: "For y = x² − 4, find y when x = -5", options: ["29", "-9", "23", "21"], answer: 3 },
  { id: "gr_quad3228", topic: "graphs", diagram: {"type":"quadGraph","a":2,"c":10}, q: "For y = 2x² + 10, find y when x = 5", options: ["62", "60", "40", "20"], answer: 1 },
  { id: "gr_lin3229", topic: "graphs", diagram: {"type":"linearGraph","m":4,"c":-2}, q: "For y = 4x − 2, find y when x = -5", options: ["-18", "-20.8", "-22", "-3"], answer: 2 },
  { id: "gr_lin3230", topic: "graphs", diagram: {"type":"linearGraph","m":3,"c":-7}, q: "For y = 3x − 7, find y when x = 0", options: ["-4", "-5.7", "7", "-7"], answer: 3 },
  { id: "gr_quad3231", topic: "graphs", diagram: {"type":"quadGraph","a":-1,"c":-5}, q: "For y = −x² − 5, find y when x = 0", options: ["-6.5", "5", "-3", "-5"], answer: 3 },
  { id: "gr_quad3232", topic: "graphs", diagram: {"type":"quadGraph","a":2,"c":-5}, q: "For y = 2x² − 5, find y when x = -2", options: ["-9", "5", "3", "13"], answer: 2 },
  { id: "gr_lin3233", topic: "graphs", diagram: {"type":"linearGraph","m":-4,"c":-3}, q: "For y = -4x − 3, find y when x = 1", options: ["-11", "-1", "-7", "-6"], answer: 2 },
  { id: "gr_quad3234", topic: "graphs", diagram: {"type":"quadGraph","a":2,"c":-8}, q: "For y = 2x² − 8, find y when x = -2", options: ["16", "2", "0", "-12"], answer: 2 },
  { id: "gr_lin3235", topic: "graphs", diagram: {"type":"linearGraph","m":1,"c":5}, q: "For y = x + 5, find y when x = 2", options: ["5.7", "7", "8", "-3"], answer: 1 },
  { id: "gr_quad3236", topic: "graphs", diagram: {"type":"quadGraph","a":1,"c":10}, q: "For y = x² + 10, find y when x = -5", options: ["5", "15", "35", "37"], answer: 2 },
  { id: "gr_lin3237", topic: "graphs", diagram: {"type":"linearGraph","m":3,"c":-4}, q: "For y = 3x − 4, find y when x = 0", options: ["4", "-4", "-1", "-3.2"], answer: 1 },
  { id: "gr_lin3238", topic: "graphs", diagram: {"type":"linearGraph","m":5,"c":1}, q: "For y = 5x + 1, find y when x = -4", options: ["2", "-19", "-21", "-14"], answer: 1 },
  { id: "gr_quad3239", topic: "graphs", diagram: {"type":"quadGraph","a":2,"c":-9}, q: "For y = 2x² − 9, find y when x = 1", options: ["-7", "-7.6", "-5", "11"], answer: 0 },
  { id: "gr_lin3240", topic: "graphs", diagram: {"type":"linearGraph","m":-4,"c":-9}, q: "For y = -4x − 9, find y when x = -3", options: ["-1", "21", "-16", "3"], answer: 3 },
  { id: "gr_lin3241", topic: "graphs", diagram: {"type":"linearGraph","m":-5,"c":6}, q: "For y = -5x + 6, find y when x = 5", options: ["6", "-19", "-31", "-24"], answer: 1 },
  { id: "gr_quad3242", topic: "graphs", diagram: {"type":"quadGraph","a":1,"c":4}, q: "For y = x² + 4, find y when x = 3", options: ["7", "15", "5", "13"], answer: 3 },
  { id: "gr_lin3243", topic: "graphs", diagram: {"type":"linearGraph","m":3,"c":-10}, q: "For y = 3x − 10, find y when x = -4", options: ["-2", "-22", "-19", "-11"], answer: 1 },
  { id: "gr_lin3244", topic: "graphs", diagram: {"type":"linearGraph","m":-4,"c":-3}, q: "For y = -4x − 3, find y when x = 3", options: ["-15", "-9", "-4", "-19"], answer: 0 },
  { id: "gr_lin3245", topic: "graphs", diagram: {"type":"linearGraph","m":5,"c":4}, q: "For y = 5x + 4, find y when x = 5", options: ["14", "29", "34", "21"], answer: 1 },
  { id: "gr_lin3246", topic: "graphs", diagram: {"type":"linearGraph","m":-3,"c":-5}, q: "For y = -3x − 5, find y when x = -5", options: ["20", "7", "-13", "10"], answer: 3 },
  { id: "gr_quad3247", topic: "graphs", diagram: {"type":"quadGraph","a":1,"c":1}, q: "For y = x² + 1, find y when x = 5", options: ["28", "26", "6", "24"], answer: 1 },
  { id: "gr_quad3248", topic: "graphs", diagram: {"type":"quadGraph","a":1,"c":9}, q: "For y = x² + 9, find y when x = 1", options: ["12", "10", "-8", "11"], answer: 1 },
  { id: "gr_lin3249", topic: "graphs", diagram: {"type":"linearGraph","m":-1,"c":-1}, q: "For y = −x − 1, find y when x = 4", options: ["-6", "-3", "-5", "2"], answer: 2 },
  { id: "gr_quad3250", topic: "graphs", diagram: {"type":"quadGraph","a":1,"c":7}, q: "For y = x² + 7, find y when x = -5", options: ["2", "34", "18", "32"], answer: 3 },
  { id: "gr_quad3251", topic: "graphs", diagram: {"type":"quadGraph","a":1,"c":-1}, q: "For y = x² − 1, find y when x = 3", options: ["10", "7.6", "8", "2"], answer: 2 },
  { id: "gr_quad3252", topic: "graphs", diagram: {"type":"quadGraph","a":2,"c":-6}, q: "For y = 2x² − 6, find y when x = 0", options: ["-4", "-6", "6", "-3.4"], answer: 1 },
  { id: "gr_lin3253", topic: "graphs", diagram: {"type":"linearGraph","m":2,"c":-2}, q: "For y = 2x − 2, find y when x = -2", options: ["-4", "-8.2", "-6", "-2"], answer: 2 },
  { id: "gr_lin3254", topic: "graphs", diagram: {"type":"linearGraph","m":-6,"c":3}, q: "For y = -6x + 3, find y when x = 0", options: ["3.4", "-3", "3", "5.6"], answer: 2 },
  { id: "gr_quad3255", topic: "graphs", diagram: {"type":"quadGraph","a":1,"c":-3}, q: "For y = x² − 3, find y when x = 4", options: ["19", "1", "15", "13"], answer: 3 },
  { id: "gr_quad3256", topic: "graphs", diagram: {"type":"quadGraph","a":2,"c":3}, q: "For y = 2x² + 3, find y when x = 4", options: ["37", "35", "29", "11"], answer: 1 },
  { id: "gr_lin3257", topic: "graphs", diagram: {"type":"linearGraph","m":3,"c":-1}, q: "For y = 3x − 1, find y when x = -5", options: ["-13", "-16", "-3", "-14"], answer: 1 },
  { id: "gr_lin3258", topic: "graphs", diagram: {"type":"linearGraph","m":-4,"c":-4}, q: "For y = -4x − 4, find y when x = 6", options: ["-32", "-2", "-28", "-20"], answer: 2 },
  { id: "gr_lin3259", topic: "graphs", diagram: {"type":"linearGraph","m":-6,"c":-1}, q: "For y = -6x − 1, find y when x = -4", options: ["23", "-11", "17", "25"], answer: 0 },
  { id: "gr_quad3260", topic: "graphs", diagram: {"type":"quadGraph","a":-1,"c":-9}, q: "For y = −x² − 9, find y when x = 4", options: ["-13", "-7", "-25", "-23"], answer: 2 },
  { id: "gr_lin3261", topic: "graphs", diagram: {"type":"linearGraph","m":-1,"c":4}, q: "For y = −x + 4, find y when x = -6", options: ["10", "9", "-3", "2"], answer: 0 },
  { id: "gr_lin3262", topic: "graphs", diagram: {"type":"linearGraph","m":-1,"c":7}, q: "For y = −x + 7, find y when x = 2", options: ["8", "4", "5", "-9"], answer: 2 },
  { id: "gr_lin3263", topic: "graphs", diagram: {"type":"linearGraph","m":4,"c":-6}, q: "For y = 4x − 6, find y when x = 4", options: ["10", "14", "2", "22"], answer: 0 },
  { id: "gr_quad3264", topic: "graphs", diagram: {"type":"quadGraph","a":2,"c":-2}, q: "For y = 2x² − 2, find y when x = 5", options: ["52", "8", "50", "48"], answer: 3 },
  { id: "gr_quad3265", topic: "graphs", diagram: {"type":"quadGraph","a":-1,"c":-7}, q: "For y = −x² − 7, find y when x = 2", options: ["-11", "-16.3", "3", "-9"], answer: 0 },
  { id: "gr_lin3266", topic: "graphs", diagram: {"type":"linearGraph","m":2,"c":-6}, q: "For y = 2x − 6, find y when x = 2", options: ["-2", "0", "-0.6", "10"], answer: 0 },
  { id: "gr_quad3267", topic: "graphs", diagram: {"type":"quadGraph","a":-1,"c":3}, q: "For y = −x² + 3, find y when x = 2", options: ["-1", "-1.8", "1", "-7"], answer: 0 },
  // Ch rates — 50 questions (0 from real Edexcel 4MA1 past papers, 50 practice questions in the same style)
  { id: "ra_d3300", topic: "rates", q: "A car travels at 47 km/h for 6 hours. Find the distance travelled", options: ["329 km", "7.8 km", "282 km", "53 km"], answer: 2 },
  { id: "ra_t3301", topic: "rates", q: "A car travels 315 km at an average speed of 89 km/h. Find the time taken", options: ["4.54 hours", "0.283 hours", "28035 hours", "3.54 hours"], answer: 3 },
  { id: "ra_t3302", topic: "rates", q: "A car travels 45 km at an average speed of 93 km/h. Find the time taken", options: ["1.48 hours", "2.067 hours", "0.48 hours", "4185 hours"], answer: 2 },
  { id: "ra_sp3303", topic: "rates", q: "A car travels 291 km in 1 hours. Find its average speed", options: ["296 km/h", "318.1 km/h", "0 km/h", "291 km/h"], answer: 3 },
  { id: "ra_sp3304", topic: "rates", q: "A car travels 222 km in 6 hours. Find its average speed", options: ["37 km/h", "1332 km/h", "42 km/h", "0.03 km/h"], answer: 0 },
  { id: "ra_d3305", topic: "rates", q: "A car travels at 39 km/h for 2 hours. Find the distance travelled", options: ["19.5 km", "78 km", "41 km", "117 km"], answer: 1 },
  { id: "ra_t3306", topic: "rates", q: "A car travels 341 km at an average speed of 80 km/h. Find the time taken", options: ["4.26 hours", "0.235 hours", "27280 hours", "5.26 hours"], answer: 0 },
  { id: "ra_t3307", topic: "rates", q: "A car travels 371 km at an average speed of 78 km/h. Find the time taken", options: ["0.21 hours", "4.76 hours", "5.76 hours", "28938 hours"], answer: 1 },
  { id: "ra_d3308", topic: "rates", q: "A car travels at 88 km/h for 2 hours. Find the distance travelled", options: ["176 km", "44 km", "90 km", "264 km"], answer: 0 },
  { id: "ra_sp3309", topic: "rates", q: "A car travels 225 km in 6 hours. Find its average speed", options: ["1350 km/h", "37.5 km/h", "0.03 km/h", "42.5 km/h"], answer: 1 },
  { id: "ra_t3310", topic: "rates", q: "A car travels 293 km at an average speed of 23 km/h. Find the time taken", options: ["12.74 hours", "0.078 hours", "6739 hours", "13.74 hours"], answer: 0 },
  { id: "ra_d3311", topic: "rates", q: "A car travels at 89 km/h for 8 hours. Find the distance travelled", options: ["11.1 km", "712 km", "801 km", "97 km"], answer: 1 },
  { id: "ra_t3312", topic: "rates", q: "A car travels 78 km at an average speed of 80 km/h. Find the time taken", options: ["1.97 hours", "6240 hours", "0.97 hours", "1.026 hours"], answer: 2 },
  { id: "ra_sp3313", topic: "rates", q: "A car travels 116 km in 8 hours. Find its average speed", options: ["928 km/h", "0.07 km/h", "14.5 km/h", "19.5 km/h"], answer: 2 },
  { id: "ra_t3314", topic: "rates", q: "A car travels 201 km at an average speed of 28 km/h. Find the time taken", options: ["7.18 hours", "8.18 hours", "5628 hours", "0.139 hours"], answer: 0 },
  { id: "ra_d3315", topic: "rates", q: "A car travels at 68 km/h for 8 hours. Find the distance travelled", options: ["612 km", "76 km", "8.5 km", "544 km"], answer: 3 },
  { id: "ra_t3316", topic: "rates", q: "A car travels 312 km at an average speed of 61 km/h. Find the time taken", options: ["0.196 hours", "5.11 hours", "19032 hours", "6.11 hours"], answer: 1 },
  { id: "ra_t3317", topic: "rates", q: "A car travels 374 km at an average speed of 94 km/h. Find the time taken", options: ["35156 hours", "4.98 hours", "0.251 hours", "3.98 hours"], answer: 3 },
  { id: "ra_sp3318", topic: "rates", q: "A car travels 368 km in 6 hours. Find its average speed", options: ["0.02 km/h", "2208 km/h", "66.3 km/h", "61.3 km/h"], answer: 3 },
  { id: "ra_sp3319", topic: "rates", q: "A car travels 125 km in 6 hours. Find its average speed", options: ["25.8 km/h", "0.05 km/h", "20.8 km/h", "750 km/h"], answer: 2 },
  { id: "ra_d3320", topic: "rates", q: "A car travels at 28 km/h for 8 hours. Find the distance travelled", options: ["252 km", "3.5 km", "224 km", "36 km"], answer: 2 },
  { id: "ra_t3321", topic: "rates", q: "A car travels 307 km at an average speed of 48 km/h. Find the time taken", options: ["7.4 hours", "0.156 hours", "14736 hours", "6.4 hours"], answer: 3 },
  { id: "ra_t3322", topic: "rates", q: "A car travels 195 km at an average speed of 68 km/h. Find the time taken", options: ["0.349 hours", "3.87 hours", "13260 hours", "2.87 hours"], answer: 3 },
  { id: "ra_t3323", topic: "rates", q: "A car travels 248 km at an average speed of 96 km/h. Find the time taken", options: ["23808 hours", "2.58 hours", "3.58 hours", "0.387 hours"], answer: 1 },
  { id: "ra_t3324", topic: "rates", q: "A car travels 323 km at an average speed of 98 km/h. Find the time taken", options: ["4.3 hours", "0.303 hours", "31654 hours", "3.3 hours"], answer: 3 },
  { id: "ra_d3325", topic: "rates", q: "A car travels at 45 km/h for 8 hours. Find the distance travelled", options: ["5.6 km", "405 km", "53 km", "360 km"], answer: 3 },
  { id: "ra_t3326", topic: "rates", q: "A car travels 239 km at an average speed of 77 km/h. Find the time taken", options: ["4.1 hours", "18403 hours", "0.322 hours", "3.1 hours"], answer: 3 },
  { id: "ra_t3327", topic: "rates", q: "A car travels 310 km at an average speed of 43 km/h. Find the time taken", options: ["8.21 hours", "0.139 hours", "7.21 hours", "13330 hours"], answer: 2 },
  { id: "ra_sp3328", topic: "rates", q: "A car travels 326 km in 3 hours. Find its average speed", options: ["978 km/h", "0.01 km/h", "108.7 km/h", "113.7 km/h"], answer: 2 },
  { id: "ra_t3329", topic: "rates", q: "A car travels 93 km at an average speed of 56 km/h. Find the time taken", options: ["5208 hours", "2.66 hours", "1.66 hours", "0.602 hours"], answer: 2 },
  { id: "ra_d3330", topic: "rates", q: "A car travels at 51 km/h for 8 hours. Find the distance travelled", options: ["459 km", "59 km", "408 km", "6.4 km"], answer: 2 },
  { id: "ra_d3331", topic: "rates", q: "A car travels at 42 km/h for 5 hours. Find the distance travelled", options: ["210 km", "252 km", "47 km", "8.4 km"], answer: 0 },
  { id: "ra_sp3332", topic: "rates", q: "A car travels 315 km in 1 hours. Find its average speed", options: ["315 km/h", "0 km/h", "408.5 km/h", "320 km/h"], answer: 0 },
  { id: "ra_sp3333", topic: "rates", q: "A car travels 205 km in 3 hours. Find its average speed", options: ["0.01 km/h", "68.3 km/h", "73.3 km/h", "615 km/h"], answer: 1 },
  { id: "ra_sp3334", topic: "rates", q: "A car travels 255 km in 8 hours. Find its average speed", options: ["36.9 km/h", "0.03 km/h", "2040 km/h", "31.9 km/h"], answer: 3 },
  { id: "ra_sp3335", topic: "rates", q: "A car travels 65 km in 4 hours. Find its average speed", options: ["21.3 km/h", "260 km/h", "16.3 km/h", "0.06 km/h"], answer: 2 },
  { id: "ra_sp3336", topic: "rates", q: "A car travels 48 km in 6 hours. Find its average speed", options: ["0.13 km/h", "8 km/h", "288 km/h", "13 km/h"], answer: 1 },
  { id: "ra_t3337", topic: "rates", q: "A car travels 142 km at an average speed of 21 km/h. Find the time taken", options: ["7.76 hours", "6.76 hours", "2982 hours", "0.148 hours"], answer: 1 },
  { id: "ra_t3338", topic: "rates", q: "A car travels 66 km at an average speed of 38 km/h. Find the time taken", options: ["2.74 hours", "0.576 hours", "2508 hours", "1.74 hours"], answer: 3 },
  { id: "ra_t3339", topic: "rates", q: "A car travels 282 km at an average speed of 52 km/h. Find the time taken", options: ["6.42 hours", "5.42 hours", "14664 hours", "0.184 hours"], answer: 1 },
  { id: "ra_sp3340", topic: "rates", q: "A car travels 57 km in 6 hours. Find its average speed", options: ["342 km/h", "9.5 km/h", "0.11 km/h", "14.5 km/h"], answer: 1 },
  { id: "ra_sp3341", topic: "rates", q: "A car travels 307 km in 3 hours. Find its average speed", options: ["102.3 km/h", "921 km/h", "107.3 km/h", "0.01 km/h"], answer: 0 },
  { id: "ra_t3342", topic: "rates", q: "A car travels 305 km at an average speed of 36 km/h. Find the time taken", options: ["9.47 hours", "10980 hours", "8.47 hours", "0.118 hours"], answer: 2 },
  { id: "ra_d3343", topic: "rates", q: "A car travels at 100 km/h for 7 hours. Find the distance travelled", options: ["14.3 km", "700 km", "107 km", "800 km"], answer: 1 },
  { id: "ra_d3344", topic: "rates", q: "A car travels at 48 km/h for 3 hours. Find the distance travelled", options: ["192 km", "51 km", "144 km", "16 km"], answer: 2 },
  { id: "ra_d3345", topic: "rates", q: "A car travels at 99 km/h for 4 hours. Find the distance travelled", options: ["396 km", "495 km", "103 km", "24.8 km"], answer: 0 },
  { id: "ra_sp3346", topic: "rates", q: "A car travels 162 km in 5 hours. Find its average speed", options: ["810 km/h", "32.4 km/h", "37.4 km/h", "0.03 km/h"], answer: 1 },
  { id: "ra_sp3347", topic: "rates", q: "A car travels 368 km in 1 hours. Find its average speed", options: ["293.4 km/h", "368 km/h", "0 km/h", "373 km/h"], answer: 1 },
  { id: "ra_t3348", topic: "rates", q: "A car travels 363 km at an average speed of 100 km/h. Find the time taken", options: ["0.275 hours", "3.63 hours", "4.63 hours", "36300 hours"], answer: 1 },
  { id: "ra_sp3349", topic: "rates", q: "A car travels 126 km in 3 hours. Find its average speed", options: ["47 km/h", "0.02 km/h", "42 km/h", "378 km/h"], answer: 2 },
  // Ch sets — 50 questions (1 from real Edexcel 4MA1 past papers, 49 practice questions in the same style)
  { id: "se1", topic: "sets", ref: "Nov 2025 1F Q13", diagram: {"type":"venn2","aOnly":[11,13,17,19],"bOnly":[10,20],"both":[15],"labelA":"A","labelB":"B"}, q: "ξ = {10, 11, ..., 20}. A = {odd numbers}, B = {multiples of 5}. Find A ∩ B", options: ["{15}", "{10, 15, 20}", "{11, 13, 15, 17, 19}", "{5, 15}"], answer: 0 },
  { id: "se_u3380", topic: "sets", diagram: {"type":"venn2","aOnly":[4,7,9],"bOnly":[10,11,12],"both":[3,8],"labelA":"A","labelB":"B"}, q: "A = {3, 4, 7, 8, 9}, B = {3, 8, 10, 11, 12}. Find A ∪ B", options: ["{3, 4, 7, 8, 9}", "{3, 4, 7, 8, 9, 10, 11, 12}", "{3, 8}", "{3, 8, 10, 11, 12}"], answer: 1 },
  { id: "se_u3381", topic: "sets", diagram: {"type":"venn2","aOnly":[3,6,7],"bOnly":[1,11,12],"both":[4,5],"labelA":"A","labelB":"B"}, q: "A = {3, 4, 5, 6, 7}, B = {1, 4, 5, 11, 12}. Find A ∩ B", options: ["{4, 5}", "{1, 3, 4, 5, 6, 7, 11, 12}", "{3, 4, 5, 6, 7}", "{1, 4, 5, 11, 12}"], answer: 0 },
  { id: "se_u3382", topic: "sets", diagram: {"type":"venn2","aOnly":[2,4],"bOnly":[1,8],"both":[5,6,10],"labelA":"A","labelB":"B"}, q: "A = {2, 4, 5, 6, 10}, B = {1, 5, 6, 8, 10}. Find A ∪ B", options: ["{1, 5, 6, 8, 10}", "{1, 2, 4, 5, 6, 8, 10}", "{5, 6, 10}", "{2, 4, 5, 6, 10}"], answer: 1 },
  { id: "se_u3383", topic: "sets", diagram: {"type":"venn2","aOnly":[7,9,10,12],"bOnly":[1,4,6,8],"both":[11],"labelA":"A","labelB":"B"}, q: "A = {7, 9, 10, 11, 12}, B = {1, 4, 6, 8, 11}. Find A ∩ B", options: ["{7, 9, 10, 11, 12}", "{1, 4, 6, 8, 11}", "{1, 4, 6, 7, 8, 9, 10, 11, 12}", "{11}"], answer: 3 },
  { id: "se_u3384", topic: "sets", diagram: {"type":"venn2","aOnly":[2,4,6,7],"bOnly":[5,8,11,12],"both":[9],"labelA":"A","labelB":"B"}, q: "A = {2, 4, 6, 7, 9}, B = {5, 8, 9, 11, 12}. Find A ∩ B", options: ["{9}", "{5, 8, 9, 11, 12}", "{2, 4, 5, 6, 7, 8, 9, 11, 12}", "{2, 4, 6, 7, 9}"], answer: 0 },
  { id: "se_u3385", topic: "sets", diagram: {"type":"venn2","aOnly":[1,3,12],"bOnly":[4,6,11],"both":[5,9],"labelA":"A","labelB":"B"}, q: "A = {1, 3, 5, 9, 12}, B = {4, 5, 6, 9, 11}. Find A ∪ B", options: ["{5, 9}", "{1, 3, 5, 9, 12}", "{4, 5, 6, 9, 11}", "{1, 3, 4, 5, 6, 9, 11, 12}"], answer: 3 },
  { id: "se_u3386", topic: "sets", diagram: {"type":"venn2","aOnly":[3,4,5,8],"bOnly":[1,6,7,10],"both":[12],"labelA":"A","labelB":"B"}, q: "A = {3, 4, 5, 8, 12}, B = {1, 6, 7, 10, 12}. Find A ∪ B", options: ["{3, 4, 5, 8, 12}", "{1, 6, 7, 10, 12}", "{1, 3, 4, 5, 6, 7, 8, 10, 12}", "{12}"], answer: 2 },
  { id: "se_u3387", topic: "sets", diagram: {"type":"venn2","aOnly":[3,8,11,12],"bOnly":[4,7,9,10],"both":[2],"labelA":"A","labelB":"B"}, q: "A = {2, 3, 8, 11, 12}, B = {2, 4, 7, 9, 10}. Find A ∩ B", options: ["{2, 3, 4, 7, 8, 9, 10, 11, 12}", "{2}", "{2, 3, 8, 11, 12}", "{2, 4, 7, 9, 10}"], answer: 1 },
  { id: "se_u3388", topic: "sets", diagram: {"type":"venn2","aOnly":[2,4,8,9],"bOnly":[1,3,7,11],"both":[6],"labelA":"A","labelB":"B"}, q: "A = {2, 4, 6, 8, 9}, B = {1, 3, 6, 7, 11}. Find A ∪ B", options: ["{6}", "{1, 3, 6, 7, 11}", "{1, 2, 3, 4, 6, 7, 8, 9, 11}", "{2, 4, 6, 8, 9}"], answer: 2 },
  { id: "se_u3389", topic: "sets", diagram: {"type":"venn2","aOnly":[2,3],"bOnly":[1,7],"both":[6,8,9],"labelA":"A","labelB":"B"}, q: "A = {2, 3, 6, 8, 9}, B = {1, 6, 7, 8, 9}. Find A ∪ B", options: ["{2, 3, 6, 8, 9}", "{6, 8, 9}", "{1, 6, 7, 8, 9}", "{1, 2, 3, 6, 7, 8, 9}"], answer: 3 },
  { id: "se_u3390", topic: "sets", diagram: {"type":"venn2","aOnly":[1,5,6,11],"bOnly":[4,8,9,10],"both":[2],"labelA":"A","labelB":"B"}, q: "A = {1, 2, 5, 6, 11}, B = {2, 4, 8, 9, 10}. Find A ∩ B", options: ["{1, 2, 4, 5, 6, 8, 9, 10, 11}", "{1, 2, 5, 6, 11}", "{2}", "{2, 4, 8, 9, 10}"], answer: 2 },
  { id: "se_u3391", topic: "sets", diagram: {"type":"venn2","aOnly":[6,8,9,10],"bOnly":[1,3,5,11],"both":[4],"labelA":"A","labelB":"B"}, q: "A = {4, 6, 8, 9, 10}, B = {1, 3, 4, 5, 11}. Find A ∪ B", options: ["{4}", "{1, 3, 4, 5, 6, 8, 9, 10, 11}", "{1, 3, 4, 5, 11}", "{4, 6, 8, 9, 10}"], answer: 1 },
  { id: "se_u3392", topic: "sets", diagram: {"type":"venn2","aOnly":[6,8,11,12],"bOnly":[3,4,7,10],"both":[2],"labelA":"A","labelB":"B"}, q: "A = {2, 6, 8, 11, 12}, B = {2, 3, 4, 7, 10}. Find A ∩ B", options: ["{2}", "{2, 6, 8, 11, 12}", "{2, 3, 4, 6, 7, 8, 10, 11, 12}", "{2, 3, 4, 7, 10}"], answer: 0 },
  { id: "se_u3393", topic: "sets", diagram: {"type":"venn2","aOnly":[2,5,6],"bOnly":[3,10,12],"both":[8,9],"labelA":"A","labelB":"B"}, q: "A = {2, 5, 6, 8, 9}, B = {3, 8, 9, 10, 12}. Find A ∩ B", options: ["{3, 8, 9, 10, 12}", "{2, 5, 6, 8, 9}", "{8, 9}", "{2, 3, 5, 6, 8, 9, 10, 12}"], answer: 2 },
  { id: "se_u3394", topic: "sets", diagram: {"type":"venn2","aOnly":[2,4],"bOnly":[6,12],"both":[1,9,11],"labelA":"A","labelB":"B"}, q: "A = {1, 2, 4, 9, 11}, B = {1, 6, 9, 11, 12}. Find A ∩ B", options: ["{1, 2, 4, 6, 9, 11, 12}", "{1, 9, 11}", "{1, 6, 9, 11, 12}", "{1, 2, 4, 9, 11}"], answer: 1 },
  { id: "se_u3395", topic: "sets", diagram: {"type":"venn2","aOnly":[4,7,8],"bOnly":[3,9,11],"both":[6,10],"labelA":"A","labelB":"B"}, q: "A = {4, 6, 7, 8, 10}, B = {3, 6, 9, 10, 11}. Find A ∪ B", options: ["{4, 6, 7, 8, 10}", "{3, 6, 9, 10, 11}", "{3, 4, 6, 7, 8, 9, 10, 11}", "{6, 10}"], answer: 2 },
  { id: "se_u3396", topic: "sets", diagram: {"type":"venn2","aOnly":[1,2,4],"bOnly":[5,10,11],"both":[8,9],"labelA":"A","labelB":"B"}, q: "A = {1, 2, 4, 8, 9}, B = {5, 8, 9, 10, 11}. Find A ∩ B", options: ["{8, 9}", "{1, 2, 4, 5, 8, 9, 10, 11}", "{1, 2, 4, 8, 9}", "{5, 8, 9, 10, 11}"], answer: 0 },
  { id: "se_u3397", topic: "sets", diagram: {"type":"venn2","aOnly":[6,9,11,12],"bOnly":[1,2,4,5],"both":[3],"labelA":"A","labelB":"B"}, q: "A = {3, 6, 9, 11, 12}, B = {1, 2, 3, 4, 5}. Find A ∩ B", options: ["{3, 6, 9, 11, 12}", "{3}", "{1, 2, 3, 4, 5, 6, 9, 11, 12}", "{1, 2, 3, 4, 5}"], answer: 1 },
  { id: "se_u3398", topic: "sets", diagram: {"type":"venn2","aOnly":[1,7,11],"bOnly":[3,5,12],"both":[2,8],"labelA":"A","labelB":"B"}, q: "A = {1, 2, 7, 8, 11}, B = {2, 3, 5, 8, 12}. Find A ∪ B", options: ["{2, 8}", "{2, 3, 5, 8, 12}", "{1, 2, 7, 8, 11}", "{1, 2, 3, 5, 7, 8, 11, 12}"], answer: 3 },
  { id: "se_u3399", topic: "sets", diagram: {"type":"venn2","aOnly":[3,6,12],"bOnly":[1,9,10],"both":[2,7],"labelA":"A","labelB":"B"}, q: "A = {2, 3, 6, 7, 12}, B = {1, 2, 7, 9, 10}. Find A ∪ B", options: ["{1, 2, 7, 9, 10}", "{1, 2, 3, 6, 7, 9, 10, 12}", "{2, 7}", "{2, 3, 6, 7, 12}"], answer: 1 },
  { id: "se_u3400", topic: "sets", diagram: {"type":"venn2","aOnly":[6,8],"bOnly":[3,9],"both":[2,4,11],"labelA":"A","labelB":"B"}, q: "A = {2, 4, 6, 8, 11}, B = {2, 3, 4, 9, 11}. Find A ∩ B", options: ["{2, 3, 4, 6, 8, 9, 11}", "{2, 4, 6, 8, 11}", "{2, 3, 4, 9, 11}", "{2, 4, 11}"], answer: 3 },
  { id: "se_u3401", topic: "sets", diagram: {"type":"venn2","aOnly":[1,2],"bOnly":[3,5],"both":[4,7,9],"labelA":"A","labelB":"B"}, q: "A = {1, 2, 4, 7, 9}, B = {3, 4, 5, 7, 9}. Find A ∩ B", options: ["{3, 4, 5, 7, 9}", "{1, 2, 3, 4, 5, 7, 9}", "{4, 7, 9}", "{1, 2, 4, 7, 9}"], answer: 2 },
  { id: "se_u3402", topic: "sets", diagram: {"type":"venn2","aOnly":[2,4,5],"bOnly":[6,8,10],"both":[1,7],"labelA":"A","labelB":"B"}, q: "A = {1, 2, 4, 5, 7}, B = {1, 6, 7, 8, 10}. Find A ∩ B", options: ["{1, 2, 4, 5, 7}", "{1, 2, 4, 5, 6, 7, 8, 10}", "{1, 7}", "{1, 6, 7, 8, 10}"], answer: 2 },
  { id: "se_u3403", topic: "sets", diagram: {"type":"venn2","aOnly":[9,11,12],"bOnly":[7,8,10],"both":[1,2],"labelA":"A","labelB":"B"}, q: "A = {1, 2, 9, 11, 12}, B = {1, 2, 7, 8, 10}. Find A ∪ B", options: ["{1, 2, 9, 11, 12}", "{1, 2, 7, 8, 9, 10, 11, 12}", "{1, 2, 7, 8, 10}", "{1, 2}"], answer: 1 },
  { id: "se_u3404", topic: "sets", diagram: {"type":"venn2","aOnly":[4,8,9,10],"bOnly":[2,5,11,12],"both":[6],"labelA":"A","labelB":"B"}, q: "A = {4, 6, 8, 9, 10}, B = {2, 5, 6, 11, 12}. Find A ∩ B", options: ["{2, 5, 6, 11, 12}", "{4, 6, 8, 9, 10}", "{2, 4, 5, 6, 8, 9, 10, 11, 12}", "{6}"], answer: 3 },
  { id: "se_u3405", topic: "sets", diagram: {"type":"venn2","aOnly":[3,10,11],"bOnly":[5,6,7],"both":[9,12],"labelA":"A","labelB":"B"}, q: "A = {3, 9, 10, 11, 12}, B = {5, 6, 7, 9, 12}. Find A ∪ B", options: ["{3, 9, 10, 11, 12}", "{5, 6, 7, 9, 12}", "{9, 12}", "{3, 5, 6, 7, 9, 10, 11, 12}"], answer: 3 },
  { id: "se_u3406", topic: "sets", diagram: {"type":"venn2","aOnly":[2,4,7,10],"bOnly":[1,3,5,8],"both":[11],"labelA":"A","labelB":"B"}, q: "A = {2, 4, 7, 10, 11}, B = {1, 3, 5, 8, 11}. Find A ∩ B", options: ["{11}", "{1, 2, 3, 4, 5, 7, 8, 10, 11}", "{1, 3, 5, 8, 11}", "{2, 4, 7, 10, 11}"], answer: 0 },
  { id: "se_u3407", topic: "sets", diagram: {"type":"venn2","aOnly":[3,5,8],"bOnly":[2,9,10],"both":[6,11],"labelA":"A","labelB":"B"}, q: "A = {3, 5, 6, 8, 11}, B = {2, 6, 9, 10, 11}. Find A ∩ B", options: ["{6, 11}", "{2, 6, 9, 10, 11}", "{3, 5, 6, 8, 11}", "{2, 3, 5, 6, 8, 9, 10, 11}"], answer: 0 },
  { id: "se_u3408", topic: "sets", diagram: {"type":"venn2","aOnly":[6,9,12],"bOnly":[1,2,11],"both":[5,8],"labelA":"A","labelB":"B"}, q: "A = {5, 6, 8, 9, 12}, B = {1, 2, 5, 8, 11}. Find A ∩ B", options: ["{5, 6, 8, 9, 12}", "{1, 2, 5, 6, 8, 9, 11, 12}", "{1, 2, 5, 8, 11}", "{5, 8}"], answer: 3 },
  { id: "se_u3409", topic: "sets", diagram: {"type":"venn2","aOnly":[1,2,5],"bOnly":[4,9,12],"both":[3,8],"labelA":"A","labelB":"B"}, q: "A = {1, 2, 3, 5, 8}, B = {3, 4, 8, 9, 12}. Find A ∩ B", options: ["{3, 4, 8, 9, 12}", "{3, 8}", "{1, 2, 3, 5, 8}", "{1, 2, 3, 4, 5, 8, 9, 12}"], answer: 1 },
  { id: "se_u3410", topic: "sets", diagram: {"type":"venn2","aOnly":[1,9],"bOnly":[6,11],"both":[2,7,10],"labelA":"A","labelB":"B"}, q: "A = {1, 2, 7, 9, 10}, B = {2, 6, 7, 10, 11}. Find A ∪ B", options: ["{2, 7, 10}", "{1, 2, 7, 9, 10}", "{1, 2, 6, 7, 9, 10, 11}", "{2, 6, 7, 10, 11}"], answer: 2 },
  { id: "se_u3411", topic: "sets", diagram: {"type":"venn2","aOnly":[1,2,6],"bOnly":[5,9,11],"both":[8,12],"labelA":"A","labelB":"B"}, q: "A = {1, 2, 6, 8, 12}, B = {5, 8, 9, 11, 12}. Find A ∩ B", options: ["{1, 2, 5, 6, 8, 9, 11, 12}", "{8, 12}", "{5, 8, 9, 11, 12}", "{1, 2, 6, 8, 12}"], answer: 1 },
  { id: "se_u3412", topic: "sets", diagram: {"type":"venn2","aOnly":[3,11],"bOnly":[1,7],"both":[2,5,9],"labelA":"A","labelB":"B"}, q: "A = {2, 3, 5, 9, 11}, B = {1, 2, 5, 7, 9}. Find A ∪ B", options: ["{2, 5, 9}", "{1, 2, 3, 5, 7, 9, 11}", "{2, 3, 5, 9, 11}", "{1, 2, 5, 7, 9}"], answer: 1 },
  { id: "se_u3413", topic: "sets", diagram: {"type":"venn2","aOnly":[2,4,9],"bOnly":[1,10,12],"both":[7,11],"labelA":"A","labelB":"B"}, q: "A = {2, 4, 7, 9, 11}, B = {1, 7, 10, 11, 12}. Find A ∪ B", options: ["{7, 11}", "{1, 2, 4, 7, 9, 10, 11, 12}", "{2, 4, 7, 9, 11}", "{1, 7, 10, 11, 12}"], answer: 1 },
  { id: "se_u3414", topic: "sets", diagram: {"type":"venn2","aOnly":[4,9,11],"bOnly":[2,5,10],"both":[1,6],"labelA":"A","labelB":"B"}, q: "A = {1, 4, 6, 9, 11}, B = {1, 2, 5, 6, 10}. Find A ∩ B", options: ["{1, 4, 6, 9, 11}", "{1, 6}", "{1, 2, 5, 6, 10}", "{1, 2, 4, 5, 6, 9, 10, 11}"], answer: 1 },
  { id: "se_u3415", topic: "sets", diagram: {"type":"venn2","aOnly":[1,5,7],"bOnly":[2,10,12],"both":[4,9],"labelA":"A","labelB":"B"}, q: "A = {1, 4, 5, 7, 9}, B = {2, 4, 9, 10, 12}. Find A ∪ B", options: ["{1, 4, 5, 7, 9}", "{4, 9}", "{2, 4, 9, 10, 12}", "{1, 2, 4, 5, 7, 9, 10, 12}"], answer: 3 },
  { id: "se_u3416", topic: "sets", diagram: {"type":"venn2","aOnly":[2,8,9],"bOnly":[1,4,7],"both":[6,11],"labelA":"A","labelB":"B"}, q: "A = {2, 6, 8, 9, 11}, B = {1, 4, 6, 7, 11}. Find A ∪ B", options: ["{6, 11}", "{1, 4, 6, 7, 11}", "{1, 2, 4, 6, 7, 8, 9, 11}", "{2, 6, 8, 9, 11}"], answer: 2 },
  { id: "se_u3417", topic: "sets", diagram: {"type":"venn2","aOnly":[6,10,12],"bOnly":[5,8,11],"both":[4,9],"labelA":"A","labelB":"B"}, q: "A = {4, 6, 9, 10, 12}, B = {4, 5, 8, 9, 11}. Find A ∪ B", options: ["{4, 5, 8, 9, 11}", "{4, 9}", "{4, 6, 9, 10, 12}", "{4, 5, 6, 8, 9, 10, 11, 12}"], answer: 3 },
  { id: "se_u3418", topic: "sets", diagram: {"type":"venn2","aOnly":[4,7,10,11],"bOnly":[6,8,9,12],"both":[1],"labelA":"A","labelB":"B"}, q: "A = {1, 4, 7, 10, 11}, B = {1, 6, 8, 9, 12}. Find A ∩ B", options: ["{1, 4, 6, 7, 8, 9, 10, 11, 12}", "{1, 4, 7, 10, 11}", "{1, 6, 8, 9, 12}", "{1}"], answer: 3 },
  { id: "se_u3419", topic: "sets", diagram: {"type":"venn2","aOnly":[1,7,11],"bOnly":[2,9,10],"both":[8,12],"labelA":"A","labelB":"B"}, q: "A = {1, 7, 8, 11, 12}, B = {2, 8, 9, 10, 12}. Find A ∩ B", options: ["{8, 12}", "{1, 2, 7, 8, 9, 10, 11, 12}", "{2, 8, 9, 10, 12}", "{1, 7, 8, 11, 12}"], answer: 0 },
  { id: "se_u3420", topic: "sets", diagram: {"type":"venn2","aOnly":[2],"bOnly":[12],"both":[1,4,8,10],"labelA":"A","labelB":"B"}, q: "A = {1, 2, 4, 8, 10}, B = {1, 4, 8, 10, 12}. Find A ∪ B", options: ["{1, 4, 8, 10}", "{1, 2, 4, 8, 10, 12}", "{1, 4, 8, 10, 12}", "{1, 2, 4, 8, 10}"], answer: 1 },
  { id: "se_u3421", topic: "sets", diagram: {"type":"venn2","aOnly":[3,7,9],"bOnly":[8,10,11],"both":[2,12],"labelA":"A","labelB":"B"}, q: "A = {2, 3, 7, 9, 12}, B = {2, 8, 10, 11, 12}. Find A ∪ B", options: ["{2, 12}", "{2, 8, 10, 11, 12}", "{2, 3, 7, 9, 12}", "{2, 3, 7, 8, 9, 10, 11, 12}"], answer: 3 },
  { id: "se_u3422", topic: "sets", diagram: {"type":"venn2","aOnly":[7,8],"bOnly":[1,12],"both":[5,10,11],"labelA":"A","labelB":"B"}, q: "A = {5, 7, 8, 10, 11}, B = {1, 5, 10, 11, 12}. Find A ∪ B", options: ["{1, 5, 7, 8, 10, 11, 12}", "{5, 10, 11}", "{5, 7, 8, 10, 11}", "{1, 5, 10, 11, 12}"], answer: 0 },
  { id: "se_u3423", topic: "sets", diagram: {"type":"venn2","aOnly":[3,4,7,8,11],"bOnly":[1,2,5,9,10],"both":[],"labelA":"A","labelB":"B"}, q: "A = {3, 4, 7, 8, 11}, B = {1, 2, 5, 9, 10}. Find A ∪ B", options: ["{}", "{1, 2, 5, 9, 10}", "{3, 4, 7, 8, 11}", "{1, 2, 3, 4, 5, 7, 8, 9, 10, 11}"], answer: 3 },
  { id: "se_u3424", topic: "sets", diagram: {"type":"venn2","aOnly":[2,4,9],"bOnly":[3,5,8],"both":[7,12],"labelA":"A","labelB":"B"}, q: "A = {2, 4, 7, 9, 12}, B = {3, 5, 7, 8, 12}. Find A ∩ B", options: ["{3, 5, 7, 8, 12}", "{2, 4, 7, 9, 12}", "{7, 12}", "{2, 3, 4, 5, 7, 8, 9, 12}"], answer: 2 },
  { id: "se_u3425", topic: "sets", diagram: {"type":"venn2","aOnly":[5,6,8,12],"bOnly":[3,4,10,11],"both":[1],"labelA":"A","labelB":"B"}, q: "A = {1, 5, 6, 8, 12}, B = {1, 3, 4, 10, 11}. Find A ∩ B", options: ["{1, 3, 4, 10, 11}", "{1, 3, 4, 5, 6, 8, 10, 11, 12}", "{1}", "{1, 5, 6, 8, 12}"], answer: 2 },
  { id: "se_u3426", topic: "sets", diagram: {"type":"venn2","aOnly":[3,10],"bOnly":[7,9],"both":[8,11,12],"labelA":"A","labelB":"B"}, q: "A = {3, 8, 10, 11, 12}, B = {7, 8, 9, 11, 12}. Find A ∩ B", options: ["{8, 11, 12}", "{3, 8, 10, 11, 12}", "{3, 7, 8, 9, 10, 11, 12}", "{7, 8, 9, 11, 12}"], answer: 0 },
  { id: "se_u3427", topic: "sets", diagram: {"type":"venn2","aOnly":[1,6,9],"bOnly":[3,11,12],"both":[4,8],"labelA":"A","labelB":"B"}, q: "A = {1, 4, 6, 8, 9}, B = {3, 4, 8, 11, 12}. Find A ∩ B", options: ["{4, 8}", "{1, 4, 6, 8, 9}", "{1, 3, 4, 6, 8, 9, 11, 12}", "{3, 4, 8, 11, 12}"], answer: 0 },
  { id: "se_u3428", topic: "sets", diagram: {"type":"venn2","aOnly":[5,6,10],"bOnly":[7,9,11],"both":[1,3],"labelA":"A","labelB":"B"}, q: "A = {1, 3, 5, 6, 10}, B = {1, 3, 7, 9, 11}. Find A ∩ B", options: ["{1, 3, 5, 6, 7, 9, 10, 11}", "{1, 3, 7, 9, 11}", "{1, 3, 5, 6, 10}", "{1, 3}"], answer: 3 },
  // Ch trig — 50 questions (3 from real Edexcel 4MA1 past papers, 47 practice questions in the same style)
  { id: "tr1", topic: "trig", ref: "Nov 2024 2F Q19", diagram: {"type":"rightTriangle","hyp":"8.6 cm","angle":43,"unknownSide":"adjacent"}, q: "Right triangle PQR: angle R = 43°, hypotenuse PR = 8.6 cm. Find the adjacent side QR (x), to 1 d.p.", options: ["6.3 cm", "5.9 cm", "7.9 cm", "6.1 cm"], answer: 0 },
  { id: "tr2", topic: "trig", ref: "June 2024 2F Q21", diagram: {"type":"rightTriangle","hyp":"6.5 cm","angle":34,"unknownSide":"opposite"}, q: "Right triangle ABC: angle A = 34°, hypotenuse AC = 6.5 cm. Find the opposite side BC (x), to 1 d.p.", options: ["3.6 cm", "5.4 cm", "4.7 cm", "3.4 cm"], answer: 0 },
  { id: "tr3", topic: "trig", ref: "June 2022 2F Q22", diagram: {"type":"rightTriangle","hyp":"9.5 cm","angle":42,"unknownSide":"adjacent"}, q: "Right triangle PQR: angle P = 42°, hypotenuse PR = 9.5 cm. Find the adjacent side PQ (x), to 1 d.p.", options: ["7.1 cm", "6.4 cm", "8.6 cm", "7.5 cm"], answer: 0 },
  { id: "tr_sct3459", topic: "trig", diagram: {"type":"rightTriangle","hyp":"12 cm","angle":70,"angleAt":"bottomLeft","unknownSide":"adjacent"}, q: "Right-angled triangle: the hypotenuse is 12 cm and one angle is 70°. Find the adjacent side, correct to 1 d.p.", options: ["11.3 cm", "5.1 cm", "7.9 cm", "4.1 cm"], answer: 3 },
  { id: "tr_bear3460", topic: "trig", diagram: {"type":"bearing","bearingDeg":320}, q: "The bearing of A from B is 320°. Find the bearing of B from A", options: ["140°", "050°", "040°", "320°"], answer: 0 },
  { id: "tr_bear3461", topic: "trig", diagram: {"type":"bearing","bearingDeg":342}, q: "The bearing of A from B is 342°. Find the bearing of B from A", options: ["018°", "072°", "342°", "162°"], answer: 3 },
  { id: "tr_bear3462", topic: "trig", diagram: {"type":"bearing","bearingDeg":177}, q: "The bearing of A from B is 177°. Find the bearing of B from A", options: ["177°", "183°", "357°", "267°"], answer: 2 },
  { id: "tr_bear3463", topic: "trig", diagram: {"type":"bearing","bearingDeg":295}, q: "The bearing of A from B is 295°. Find the bearing of B from A", options: ["295°", "115°", "065°", "025°"], answer: 1 },
  { id: "tr_sct3464", topic: "trig", diagram: {"type":"rightTriangle","hyp":"16 cm","angle":35,"angleAt":"bottomLeft","unknownSide":"adjacent"}, q: "Right-angled triangle: the hypotenuse is 16 cm and one angle is 35°. Find the adjacent side, correct to 1 d.p.", options: ["13.1 cm", "9.2 cm", "2.9 cm", "14.1 cm"], answer: 0 },
  { id: "tr_bear3465", topic: "trig", diagram: {"type":"bearing","bearingDeg":81}, q: "The bearing of A from B is 081°. Find the bearing of B from A", options: ["261°", "081°", "279°", "171°"], answer: 0 },
  { id: "tr_sct3466", topic: "trig", diagram: {"type":"rightTriangle","hyp":"12 cm","angle":60,"angleAt":"bottomLeft","unknownSide":"adjacent"}, q: "Right-angled triangle: the hypotenuse is 12 cm and one angle is 60°. Find the adjacent side, correct to 1 d.p.", options: ["7 cm", "10.4 cm", "6.8 cm", "6 cm"], answer: 3 },
  { id: "tr_bear3467", topic: "trig", diagram: {"type":"bearing","bearingDeg":121}, q: "The bearing of A from B is 121°. Find the bearing of B from A", options: ["239°", "301°", "211°", "121°"], answer: 1 },
  { id: "tr_bear3468", topic: "trig", diagram: {"type":"bearing","bearingDeg":346}, q: "The bearing of A from B is 346°. Find the bearing of B from A", options: ["166°", "076°", "014°", "346°"], answer: 0 },
  { id: "tr_sct3469", topic: "trig", diagram: {"type":"rightTriangle","hyp":"10 cm","angle":35,"angleAt":"bottomLeft","unknownSide":"adjacent"}, q: "Right-angled triangle: the hypotenuse is 10 cm and one angle is 35°. Find the adjacent side, correct to 1 d.p.", options: ["8.2 cm", "9.2 cm", "1.8 cm", "5.7 cm"], answer: 0 },
  { id: "tr_sct3470", topic: "trig", diagram: {"type":"rightTriangle","hyp":"15 cm","angle":25,"angleAt":"bottomLeft","unknownSide":"opposite"}, q: "Right-angled triangle: the hypotenuse is 15 cm and one angle is 25°. Find the opposite side, correct to 1 d.p.", options: ["8.7 cm", "6.3 cm", "7.3 cm", "13.6 cm"], answer: 1 },
  { id: "tr_sct3471", topic: "trig", diagram: {"type":"rightTriangle","hyp":"8 cm","angle":30,"angleAt":"bottomLeft","unknownSide":"opposite"}, q: "Right-angled triangle: the hypotenuse is 8 cm and one angle is 30°. Find the opposite side, correct to 1 d.p.", options: ["4 cm", "5 cm", "1.8 cm", "6.9 cm"], answer: 0 },
  { id: "tr_bear3472", topic: "trig", diagram: {"type":"bearing","bearingDeg":271}, q: "The bearing of A from B is 271°. Find the bearing of B from A", options: ["001°", "091°", "089°", "271°"], answer: 1 },
  { id: "tr_bear3473", topic: "trig", diagram: {"type":"bearing","bearingDeg":246}, q: "The bearing of A from B is 246°. Find the bearing of B from A", options: ["246°", "066°", "336°", "114°"], answer: 1 },
  { id: "tr_bear3474", topic: "trig", diagram: {"type":"bearing","bearingDeg":136}, q: "The bearing of A from B is 136°. Find the bearing of B from A", options: ["136°", "316°", "224°", "226°"], answer: 1 },
  { id: "tr_sct3476", topic: "trig", diagram: {"type":"rightTriangle","hyp":"18 cm","angle":25,"angleAt":"bottomLeft","unknownSide":"adjacent"}, q: "Right-angled triangle: the hypotenuse is 18 cm and one angle is 25°. Find the adjacent side, correct to 1 d.p.", options: ["1.7 cm", "17.3 cm", "16.3 cm", "7.6 cm"], answer: 2 },
  { id: "tr_sct3478", topic: "trig", diagram: {"type":"rightTriangle","hyp":"18 cm","angle":30,"angleAt":"bottomLeft","unknownSide":"adjacent"}, q: "Right-angled triangle: the hypotenuse is 18 cm and one angle is 30°. Find the adjacent side, correct to 1 d.p.", options: ["2.4 cm", "16.6 cm", "9 cm", "15.6 cm"], answer: 3 },
  { id: "tr_bear3479", topic: "trig", diagram: {"type":"bearing","bearingDeg":302}, q: "The bearing of A from B is 302°. Find the bearing of B from A", options: ["058°", "122°", "032°", "302°"], answer: 1 },
  { id: "tr_bear3480", topic: "trig", diagram: {"type":"bearing","bearingDeg":100}, q: "The bearing of A from B is 100°. Find the bearing of B from A", options: ["100°", "190°", "280°", "260°"], answer: 2 },
  { id: "tr_sct3481", topic: "trig", diagram: {"type":"rightTriangle","hyp":"9 cm","angle":65,"angleAt":"bottomLeft","unknownSide":"adjacent"}, q: "Right-angled triangle: the hypotenuse is 9 cm and one angle is 65°. Find the adjacent side, correct to 1 d.p.", options: ["8.2 cm", "3.8 cm", "4.8 cm", "5.2 cm"], answer: 1 },
  { id: "tr_sct3482", topic: "trig", diagram: {"type":"rightTriangle","hyp":"18 cm","angle":35,"angleAt":"bottomLeft","unknownSide":"opposite"}, q: "Right-angled triangle: the hypotenuse is 18 cm and one angle is 35°. Find the opposite side, correct to 1 d.p.", options: ["14.7 cm", "10.3 cm", "11.3 cm", "7.7 cm"], answer: 1 },
  { id: "tr_bear3483", topic: "trig", diagram: {"type":"bearing","bearingDeg":86}, q: "The bearing of A from B is 086°. Find the bearing of B from A", options: ["266°", "176°", "086°", "274°"], answer: 0 },
  { id: "tr_sct3484", topic: "trig", diagram: {"type":"rightTriangle","hyp":"10 cm","angle":65,"angleAt":"bottomLeft","unknownSide":"opposite"}, q: "Right-angled triangle: the hypotenuse is 10 cm and one angle is 65°. Find the opposite side, correct to 1 d.p.", options: ["0.9 cm", "9.1 cm", "10.1 cm", "4.2 cm"], answer: 1 },
  { id: "tr_sct3485", topic: "trig", diagram: {"type":"rightTriangle","hyp":"8 cm","angle":50,"angleAt":"bottomLeft","unknownSide":"opposite"}, q: "Right-angled triangle: the hypotenuse is 8 cm and one angle is 50°. Find the opposite side, correct to 1 d.p.", options: ["7.1 cm", "5.1 cm", "6.1 cm", "1.9 cm"], answer: 2 },
  { id: "tr_bear3486", topic: "trig", diagram: {"type":"bearing","bearingDeg":170}, q: "The bearing of A from B is 170°. Find the bearing of B from A", options: ["190°", "260°", "170°", "350°"], answer: 3 },
  { id: "tr_sct3487", topic: "trig", diagram: {"type":"rightTriangle","hyp":"15 cm","angle":25,"angleAt":"bottomLeft","unknownSide":"adjacent"}, q: "Right-angled triangle: the hypotenuse is 15 cm and one angle is 25°. Find the adjacent side, correct to 1 d.p.", options: ["14.6 cm", "13.6 cm", "1.4 cm", "6.3 cm"], answer: 1 },
  { id: "tr_sct3488", topic: "trig", diagram: {"type":"rightTriangle","hyp":"12 cm","angle":65,"angleAt":"bottomLeft","unknownSide":"opposite"}, q: "Right-angled triangle: the hypotenuse is 12 cm and one angle is 65°. Find the opposite side, correct to 1 d.p.", options: ["5.1 cm", "11.9 cm", "10.9 cm", "1.1 cm"], answer: 2 },
  { id: "tr_bear3489", topic: "trig", diagram: {"type":"bearing","bearingDeg":99}, q: "The bearing of A from B is 099°. Find the bearing of B from A", options: ["279°", "099°", "261°", "189°"], answer: 0 },
  { id: "tr_bear3490", topic: "trig", diagram: {"type":"bearing","bearingDeg":157}, q: "The bearing of A from B is 157°. Find the bearing of B from A", options: ["157°", "337°", "247°", "203°"], answer: 1 },
  { id: "tr_sct3491", topic: "trig", diagram: {"type":"rightTriangle","hyp":"19 cm","angle":70,"angleAt":"bottomLeft","unknownSide":"opposite"}, q: "Right-angled triangle: the hypotenuse is 19 cm and one angle is 70°. Find the opposite side, correct to 1 d.p.", options: ["17.9 cm", "6.5 cm", "18.9 cm", "1.1 cm"], answer: 0 },
  { id: "tr_bear3492", topic: "trig", diagram: {"type":"bearing","bearingDeg":229}, q: "The bearing of A from B is 229°. Find the bearing of B from A", options: ["131°", "049°", "319°", "229°"], answer: 1 },
  { id: "tr_bear3493", topic: "trig", diagram: {"type":"bearing","bearingDeg":79}, q: "The bearing of A from B is 079°. Find the bearing of B from A", options: ["169°", "259°", "281°", "079°"], answer: 1 },
  { id: "tr_bear3494", topic: "trig", diagram: {"type":"bearing","bearingDeg":339}, q: "The bearing of A from B is 339°. Find the bearing of B from A", options: ["159°", "339°", "021°", "069°"], answer: 0 },
  { id: "tr_sct3495", topic: "trig", diagram: {"type":"rightTriangle","hyp":"7 cm","angle":55,"angleAt":"bottomLeft","unknownSide":"opposite"}, q: "Right-angled triangle: the hypotenuse is 7 cm and one angle is 55°. Find the opposite side, correct to 1 d.p.", options: ["1.3 cm", "6.7 cm", "4 cm", "5.7 cm"], answer: 3 },
  { id: "tr_sct3496", topic: "trig", diagram: {"type":"rightTriangle","hyp":"15 cm","angle":55,"angleAt":"bottomLeft","unknownSide":"opposite"}, q: "Right-angled triangle: the hypotenuse is 15 cm and one angle is 55°. Find the opposite side, correct to 1 d.p.", options: ["13.3 cm", "8.6 cm", "12.3 cm", "2.7 cm"], answer: 2 },
  { id: "tr_bear3497", topic: "trig", diagram: {"type":"bearing","bearingDeg":36}, q: "The bearing of A from B is 036°. Find the bearing of B from A", options: ["216°", "324°", "036°", "126°"], answer: 0 },
  { id: "tr_sct3498", topic: "trig", diagram: {"type":"rightTriangle","hyp":"15 cm","angle":40,"angleAt":"bottomLeft","unknownSide":"opposite"}, q: "Right-angled triangle: the hypotenuse is 15 cm and one angle is 40°. Find the opposite side, correct to 1 d.p.", options: ["11.5 cm", "9.6 cm", "10.6 cm", "5.4 cm"], answer: 1 },
  { id: "tr_bear3499", topic: "trig", diagram: {"type":"bearing","bearingDeg":196}, q: "The bearing of A from B is 196°. Find the bearing of B from A", options: ["164°", "286°", "016°", "196°"], answer: 2 },
  { id: "tr_bear3500", topic: "trig", diagram: {"type":"bearing","bearingDeg":74}, q: "The bearing of A from B is 074°. Find the bearing of B from A", options: ["254°", "164°", "074°", "286°"], answer: 0 },
  { id: "tr_sct3501", topic: "trig", diagram: {"type":"rightTriangle","hyp":"16 cm","angle":30,"angleAt":"bottomLeft","unknownSide":"adjacent"}, q: "Right-angled triangle: the hypotenuse is 16 cm and one angle is 30°. Find the adjacent side, correct to 1 d.p.", options: ["2.1 cm", "8 cm", "13.9 cm", "14.9 cm"], answer: 2 },
  { id: "tr_bear3503", topic: "trig", diagram: {"type":"bearing","bearingDeg":132}, q: "The bearing of A from B is 132°. Find the bearing of B from A", options: ["228°", "132°", "222°", "312°"], answer: 3 },
  { id: "tr_sct3504", topic: "trig", diagram: {"type":"rightTriangle","hyp":"6 cm","angle":70,"angleAt":"bottomLeft","unknownSide":"opposite"}, q: "Right-angled triangle: the hypotenuse is 6 cm and one angle is 70°. Find the opposite side, correct to 1 d.p.", options: ["0.4 cm", "6.6 cm", "2.1 cm", "5.6 cm"], answer: 3 },
  { id: "tr_bear3505", topic: "trig", diagram: {"type":"bearing","bearingDeg":202}, q: "The bearing of A from B is 202°. Find the bearing of B from A", options: ["022°", "292°", "202°", "158°"], answer: 0 },
  { id: "tr_bear3506", topic: "trig", diagram: {"type":"bearing","bearingDeg":330}, q: "The bearing of A from B is 330°. Find the bearing of B from A", options: ["150°", "330°", "030°", "060°"], answer: 0 },
  { id: "tr_bear3507", topic: "trig", diagram: {"type":"bearing","bearingDeg":238}, q: "The bearing of A from B is 238°. Find the bearing of B from A", options: ["058°", "238°", "328°", "122°"], answer: 0 },
  { id: "tr_sct3508", topic: "trig", diagram: {"type":"rightTriangle","hyp":"17 cm","angle":20,"angleAt":"bottomLeft","unknownSide":"opposite"}, q: "Right-angled triangle: the hypotenuse is 17 cm and one angle is 20°. Find the opposite side, correct to 1 d.p.", options: ["5.8 cm", "11.2 cm", "6.8 cm", "16 cm"], answer: 0 },
  // Ch probability — 48 questions (1 from real Edexcel 4MA1 past papers, 47 practice questions in the same style)
  { id: "pr1", topic: "probability", ref: "June 2026 1F Q1", q: "Sandra throws a fair 6-sided dice. What is P(the dice lands on a number less than 7)?", options: ["1", "5/6", "6/6", "0"], answer: 0 },
  { id: "pr_d3542", topic: "probability", q: "A fair 6-sided die is rolled. Find P(the score is even)", options: ["2/3", "1/2", "1/6", "1/3"], answer: 1 },
  { id: "pr_dv3543", topic: "probability", q: "A fair 6-sided die is rolled. Find P(the score is 4 or less)", options: ["2/3", "1/3", "5/6", "4/5"], answer: 0 },
  { id: "pr_dv3545", topic: "probability", q: "A fair 6-sided die is rolled. Find P(the score is 2 or less)", options: ["1/2", "2/5", "1/3", "2/3"], answer: 2 },
  { id: "pr_dv3556", topic: "probability", q: "A fair 6-sided die is rolled. Find P(the score is 1 or less)", options: ["1/5", "1/6", "5/6", "1/3"], answer: 1 },
  { id: "pr_bag3557", topic: "probability", q: "A bag has 2 red and 4 blue counters. One is drawn at random. Find P(red)", options: ["1/3", "3", "2/3", "1/2"], answer: 0 },
  { id: "pr_coin3558", topic: "probability", q: "Two fair coins are tossed. Find P(both land heads)", options: ["1/2", "1/4", "3/4", "1/3"], answer: 1 },
  { id: "pr_bag3559", topic: "probability", q: "A bag has 8 red and 6 blue counters. One is drawn at random. Find P(red)", options: ["7/4", "4/3", "3/7", "4/7"], answer: 3 },
  { id: "pr_bag3562", topic: "probability", q: "A bag has 5 red and 7 blue counters. One is drawn at random. Find P(red)", options: ["12/5", "5/7", "5/12", "7/12"], answer: 2 },
  { id: "pr_bag3565", topic: "probability", q: "A bag has 6 red and 7 blue counters. One is drawn at random. Find P(red)", options: ["6/13", "13/6", "7/13", "6/7"], answer: 0 },
  { id: "pr_bag3566", topic: "probability", q: "A bag has 5 red and 4 blue counters. One is drawn at random. Find P(red)", options: ["4/9", "5/4", "9/5", "5/9"], answer: 3 },
  { id: "pr_bag3568", topic: "probability", q: "A bag has 2 red and 5 blue counters. One is drawn at random. Find P(red)", options: ["2/7", "2/5", "5/7", "7/2"], answer: 0 },
  { id: "pr_bag3570", topic: "probability", q: "A bag has 3 red and 8 blue counters. One is drawn at random. Find P(red)", options: ["8/11", "3/8", "3/11", "11/3"], answer: 2 },
  { id: "pr_bag3574", topic: "probability", q: "A bag has 7 red and 8 blue counters. One is drawn at random. Find P(red)", options: ["8/15", "15/7", "7/8", "7/15"], answer: 3 },
  { id: "pr_bag3575", topic: "probability", q: "A bag has 3 red and 2 blue counters. One is drawn at random. Find P(red)", options: ["5/3", "2/5", "3/5", "3/2"], answer: 2 },
  { id: "pr_bag3576", topic: "probability", q: "A bag has 2 red and 3 blue counters. One is drawn at random. Find P(red)", options: ["2/3", "2/5", "3/5", "5/2"], answer: 1 },
  { id: "pr_bag3577", topic: "probability", q: "A bag has 5 red and 8 blue counters. One is drawn at random. Find P(red)", options: ["5/13", "13/5", "5/8", "8/13"], answer: 0 },
  { id: "pr_bag3583", topic: "probability", q: "A bag has 7 red and 5 blue counters. One is drawn at random. Find P(red)", options: ["5/12", "12/7", "7/12", "7/5"], answer: 2 },
  { id: "pr_bag3587", topic: "probability", q: "A bag has 8 red and 2 blue counters. One is drawn at random. Find P(red)", options: ["5/4", "4", "4/5", "1/5"], answer: 2 },
  { id: "pr_bag3592", topic: "probability", q: "A bag has 4 red and 5 blue counters. One is drawn at random. Find P(red)", options: ["5/9", "9/4", "4/5", "4/9"], answer: 3 },
  { id: "pr_bag3593", topic: "probability", q: "A bag has 6 red and 2 blue counters. One is drawn at random. Find P(red)", options: ["3/4", "1/4", "4/3", "3"], answer: 0 },
  { id: "pr_bag3600", topic: "probability", q: "A bag has 2 red and 8 blue counters. One is drawn at random. Find P(red)", options: ["1/4", "4/5", "5", "1/5"], answer: 3 },
  { id: "pr_bag3605", topic: "probability", q: "A bag has 4 red and 7 blue counters. One is drawn at random. Find P(red)", options: ["7/11", "4/11", "11/4", "4/7"], answer: 1 },
  { id: "pr_bag3611", topic: "probability", q: "A bag has 7 red and 2 blue counters. One is drawn at random. Find P(red)", options: ["2/9", "7/9", "7/2", "9/7"], answer: 1 },
  { id: "pr_bag3614", topic: "probability", q: "A bag has 7 red and 4 blue counters. One is drawn at random. Find P(red)", options: ["7/11", "11/7", "7/4", "4/11"], answer: 0 },
  { id: "pr_bag3623", topic: "probability", q: "A bag has 4 red and 2 blue counters. One is drawn at random. Find P(red)", options: ["1/3", "3/2", "2/3", "2"], answer: 2 },
  { id: "pr_bag3631", topic: "probability", q: "A bag has 4 red and 6 blue counters. One is drawn at random. Find P(red)", options: ["2/5", "3/5", "2/3", "5/2"], answer: 0 },
  { id: "pr_bag3654", topic: "probability", q: "A bag has 6 red and 4 blue counters. One is drawn at random. Find P(red)", options: ["3/5", "2/5", "5/3", "3/2"], answer: 0 },
  { id: "pr_bag3656", topic: "probability", q: "A bag has 3 red and 6 blue counters. One is drawn at random. Find P(red)", options: ["1/3", "2/3", "3", "1/2"], answer: 0 },
  { id: "pr_bag3658", topic: "probability", q: "A bag has 2 red and 6 blue counters. One is drawn at random. Find P(red)", options: ["3/4", "1/3", "4", "1/4"], answer: 3 },
  { id: "pr_bag3684", topic: "probability", q: "A bag has 5 red and 3 blue counters. One is drawn at random. Find P(red)", options: ["5/3", "3/8", "5/8", "8/5"], answer: 2 },
  { id: "pr_bag3690", topic: "probability", q: "A bag has 5 red and 6 blue counters. One is drawn at random. Find P(red)", options: ["5/6", "6/11", "11/5", "5/11"], answer: 3 },
  { id: "pr_bag3705", topic: "probability", q: "A bag has 6 red and 8 blue counters. One is drawn at random. Find P(red)", options: ["3/7", "3/4", "7/3", "4/7"], answer: 0 },
  { id: "pr_bag3710", topic: "probability", q: "A bag has 6 red and 5 blue counters. One is drawn at random. Find P(red)", options: ["11/6", "5/11", "6/5", "6/11"], answer: 3 },
  { id: "pr_bag3724", topic: "probability", q: "A bag has 5 red and 2 blue counters. One is drawn at random. Find P(red)", options: ["2/7", "5/7", "7/5", "5/2"], answer: 1 },
  { id: "pr_bag3747", topic: "probability", q: "A bag has 8 red and 5 blue counters. One is drawn at random. Find P(red)", options: ["8/13", "13/8", "8/5", "5/13"], answer: 0 },
  { id: "pr_bag3779", topic: "probability", q: "A bag has 2 red and 7 blue counters. One is drawn at random. Find P(red)", options: ["9/2", "2/7", "2/9", "7/9"], answer: 2 },
  { id: "pr_bag3783", topic: "probability", q: "A bag has 3 red and 7 blue counters. One is drawn at random. Find P(red)", options: ["3/7", "7/10", "10/3", "3/10"], answer: 3 },
  { id: "pr_bag3803", topic: "probability", q: "A bag has 8 red and 7 blue counters. One is drawn at random. Find P(red)", options: ["7/15", "8/7", "15/8", "8/15"], answer: 3 },
  { id: "pr_bag3909", topic: "probability", q: "A bag has 8 red and 3 blue counters. One is drawn at random. Find P(red)", options: ["8/11", "11/8", "3/11", "8/3"], answer: 0 },
  { id: "pr_bag3935", topic: "probability", q: "A bag has 8 red and 4 blue counters. One is drawn at random. Find P(red)", options: ["2/3", "3/2", "1/3", "2"], answer: 0 },
  { id: "pr_bag3950", topic: "probability", q: "A bag has 3 red and 4 blue counters. One is drawn at random. Find P(red)", options: ["3/4", "7/3", "4/7", "3/7"], answer: 3 },
  { id: "pr_bag3958", topic: "probability", q: "A bag has 4 red and 8 blue counters. One is drawn at random. Find P(red)", options: ["1/3", "3", "1/2", "2/3"], answer: 0 },
  { id: "pr_bag3989", topic: "probability", q: "A bag has 7 red and 3 blue counters. One is drawn at random. Find P(red)", options: ["10/7", "7/3", "3/10", "7/10"], answer: 3 },
  { id: "pr_bag4107", topic: "probability", q: "A bag has 7 red and 6 blue counters. One is drawn at random. Find P(red)", options: ["13/7", "7/13", "7/6", "6/13"], answer: 1 },
  { id: "pr_bag4151", topic: "probability", q: "A bag has 3 red and 5 blue counters. One is drawn at random. Find P(red)", options: ["5/8", "8/3", "3/8", "3/5"], answer: 2 },
  { id: "pr_bag4324", topic: "probability", q: "A bag has 4 red and 3 blue counters. One is drawn at random. Find P(red)", options: ["7/4", "3/7", "4/7", "4/3"], answer: 2 },
  { id: "pr_bag4395", topic: "probability", q: "A bag has 6 red and 3 blue counters. One is drawn at random. Find P(red)", options: ["2/3", "2", "1/3", "3/2"], answer: 0 },
  // Ch histograms — 50 questions (3 from real Edexcel 4MA1 past papers, 47 practice questions in the same style)
  { id: "hi1", topic: "histograms", ref: "Nov 2024 2F Q5", diagram: {"type":"groupedBar","classes":[{"lo":18,"hi":19,"freq":2},{"lo":19,"hi":20,"freq":4},{"lo":20,"hi":21,"freq":5},{"lo":21,"hi":22,"freq":6},{"lo":22,"hi":23,"freq":8}]}, q: "Shoe sizes of 25 nursery children: size 18 (freq 2), 19 (4), 20 (5), 21 (6), 22 (8). Find the median shoe size", options: ["21", "20", "22", "19"], answer: 0 },
  { id: "hi2", topic: "histograms", ref: "Jan 2022 2FR Q4", diagram: {"type":"dataBar","data":[21,28,29,32,34,34,39]}, q: "Salaries ($1000s) of 7 people: 21, 28, 29, 32, 34, 34, 39. Find the mode", options: ["34", "32", "29", "39"], answer: 0 },
  { id: "hi3", topic: "histograms", ref: "Jan 2022 2FR Q4", diagram: {"type":"dataBar","data":[21,28,29,32,34,34,39]}, q: "Using the same salaries (21, 28, 29, 32, 34, 34, 39), find the range", options: ["18", "13", "21", "39"], answer: 0 },
  { id: "hi_freq5912", topic: "histograms", diagram: {"type":"histBar","width":5,"fd":7.44}, q: "A histogram bar covers a class of width 5 with frequency density 7.44. Find the frequency", options: ["12.4", "1.488", "37.2", "42.2"], answer: 2 },
  { id: "hi_fd5913", topic: "histograms", diagram: {"type":"histBar","width":2,"freq":57}, q: "A histogram bar covers a class of width 2 with frequency 57. Find the frequency density", options: ["0.035", "114", "29.5", "28.5"], answer: 3 },
  { id: "hi_stat5914", topic: "histograms", diagram: {"type":"dataBar","data":[7,7,8,21,21,27,36]}, q: "Find the mean of this data set: 7, 7, 8, 21, 21, 27, 36", options: ["19.14", "36", "7", "18.14"], answer: 3 },
  { id: "hi_stat5915", topic: "histograms", diagram: {"type":"dataBar","data":[6,14,16,20,27,29,29]}, q: "Find the median of this data set: 6, 14, 16, 20, 27, 29, 29", options: ["6", "21", "29", "20"], answer: 3 },
  { id: "hi_stat5916", topic: "histograms", diagram: {"type":"dataBar","data":[9,24,31,32,32,35,39]}, q: "Find the range of this data set: 9, 24, 31, 32, 32, 35, 39", options: ["31", "30", "9", "39"], answer: 1 },
  { id: "hi_fd5917", topic: "histograms", diagram: {"type":"histBar","width":2,"freq":7}, q: "A histogram bar covers a class of width 2 with frequency 7. Find the frequency density", options: ["3.5", "14", "0.286", "4.5"], answer: 0 },
  { id: "hi_freq5918", topic: "histograms", diagram: {"type":"histBar","width":20,"fd":7.12}, q: "A histogram bar covers a class of width 20 with frequency density 7.12. Find the frequency", options: ["27.1", "142.4", "0.356", "162.4"], answer: 1 },
  { id: "hi_fd5919", topic: "histograms", diagram: {"type":"histBar","width":2,"freq":44}, q: "A histogram bar covers a class of width 2 with frequency 44. Find the frequency density", options: ["88", "23", "0.045", "22"], answer: 3 },
  { id: "hi_freq5920", topic: "histograms", diagram: {"type":"histBar","width":10,"fd":1.82}, q: "A histogram bar covers a class of width 10 with frequency density 1.82. Find the frequency", options: ["11.8", "0.182", "28.2", "18.2"], answer: 3 },
  { id: "hi_fd5921", topic: "histograms", diagram: {"type":"histBar","width":5,"freq":55}, q: "A histogram bar covers a class of width 5 with frequency 55. Find the frequency density", options: ["0.091", "275", "11", "12"], answer: 2 },
  { id: "hi_freq5922", topic: "histograms", diagram: {"type":"histBar","width":2,"fd":7.52}, q: "A histogram bar covers a class of width 2 with frequency density 7.52. Find the frequency", options: ["9.5", "15", "3.76", "17"], answer: 1 },
  { id: "hi_freq5923", topic: "histograms", diagram: {"type":"histBar","width":20,"fd":3.03}, q: "A histogram bar covers a class of width 20 with frequency density 3.03. Find the frequency", options: ["0.151", "80.6", "60.6", "23"], answer: 2 },
  { id: "hi_stat5924", topic: "histograms", diagram: {"type":"dataBar","data":[10,19,22,27,28,30,33]}, q: "Find the median of this data set: 10, 19, 22, 27, 28, 30, 33", options: ["27", "10", "33", "28"], answer: 0 },
  { id: "hi_stat5925", topic: "histograms", diagram: {"type":"dataBar","data":[5,6,11,12,22,23,32]}, q: "Find the mean of this data set: 5, 6, 11, 12, 22, 23, 32", options: ["5", "15.86", "16.86", "32"], answer: 1 },
  { id: "hi_stat5926", topic: "histograms", diagram: {"type":"dataBar","data":[8,10,12,14,14,26,38]}, q: "Find the median of this data set: 8, 10, 12, 14, 14, 26, 38", options: ["14", "15", "38", "8"], answer: 0 },
  { id: "hi_stat5927", topic: "histograms", diagram: {"type":"dataBar","data":[17,18,25,35,38,40,40]}, q: "Find the mean of this data set: 17, 18, 25, 35, 38, 40, 40", options: ["30.43", "17", "40", "31.43"], answer: 0 },
  { id: "hi_stat5928", topic: "histograms", diagram: {"type":"dataBar","data":[5,11,14,20,26,29,39]}, q: "Find the mean of this data set: 5, 11, 14, 20, 26, 29, 39", options: ["21.57", "5", "20.57", "39"], answer: 2 },
  { id: "hi_stat5929", topic: "histograms", diagram: {"type":"dataBar","data":[21,22,26,35,35,39,39]}, q: "Find the median of this data set: 21, 22, 26, 35, 35, 39, 39", options: ["35", "39", "21", "36"], answer: 0 },
  { id: "hi_stat5930", topic: "histograms", diagram: {"type":"dataBar","data":[10,17,19,27,35,37,38]}, q: "Find the mean of this data set: 10, 17, 19, 27, 35, 37, 38", options: ["26.14", "38", "27.14", "10"], answer: 0 },
  { id: "hi_freq5931", topic: "histograms", diagram: {"type":"histBar","width":5,"fd":0.57}, q: "A histogram bar covers a class of width 5 with frequency density 0.57. Find the frequency", options: ["0.114", "5.6", "2.8", "7.8"], answer: 2 },
  { id: "hi_stat5932", topic: "histograms", diagram: {"type":"dataBar","data":[21,26,28,32,32,33,36]}, q: "Find the mean of this data set: 21, 26, 28, 32, 32, 33, 36", options: ["29.71", "21", "36", "30.71"], answer: 0 },
  { id: "hi_stat5933", topic: "histograms", diagram: {"type":"dataBar","data":[9,11,25,28,28,37,40]}, q: "Find the mean of this data set: 9, 11, 25, 28, 28, 37, 40", options: ["40", "26.43", "9", "25.43"], answer: 3 },
  { id: "hi_stat5934", topic: "histograms", diagram: {"type":"dataBar","data":[16,25,28,31,36,38,39]}, q: "Find the mean of this data set: 16, 25, 28, 31, 36, 38, 39", options: ["39", "30.43", "31.43", "16"], answer: 1 },
  { id: "hi_fd5935", topic: "histograms", diagram: {"type":"histBar","width":2,"freq":9}, q: "A histogram bar covers a class of width 2 with frequency 9. Find the frequency density", options: ["4.5", "0.222", "5.5", "18"], answer: 0 },
  { id: "hi_stat5936", topic: "histograms", diagram: {"type":"dataBar","data":[10,11,21,22,26,30,38]}, q: "Find the median of this data set: 10, 11, 21, 22, 26, 30, 38", options: ["22", "10", "38", "23"], answer: 0 },
  { id: "hi_stat5937", topic: "histograms", diagram: {"type":"dataBar","data":[7,7,22,22,27,34,37]}, q: "Find the range of this data set: 7, 7, 22, 22, 27, 34, 37", options: ["37", "30", "31", "7"], answer: 1 },
  { id: "hi_stat5938", topic: "histograms", diagram: {"type":"dataBar","data":[12,12,16,18,22,28,36]}, q: "Find the range of this data set: 12, 12, 16, 18, 22, 28, 36", options: ["36", "24", "25", "12"], answer: 1 },
  { id: "hi_stat5939", topic: "histograms", diagram: {"type":"dataBar","data":[5,5,15,32,38,39,39]}, q: "Find the range of this data set: 5, 5, 15, 32, 38, 39, 39", options: ["35", "34", "39", "5"], answer: 1 },
  { id: "hi_freq5940", topic: "histograms", diagram: {"type":"histBar","width":10,"fd":4.99}, q: "A histogram bar covers a class of width 10 with frequency density 4.99. Find the frequency", options: ["15", "0.499", "59.9", "49.9"], answer: 3 },
  { id: "hi_stat5941", topic: "histograms", diagram: {"type":"dataBar","data":[5,13,18,18,31,34,40]}, q: "Find the range of this data set: 5, 13, 18, 18, 31, 34, 40", options: ["35", "36", "5", "40"], answer: 0 },
  { id: "hi_fd5942", topic: "histograms", diagram: {"type":"histBar","width":2,"freq":47}, q: "A histogram bar covers a class of width 2 with frequency 47. Find the frequency density", options: ["94", "0.043", "23.5", "24.5"], answer: 2 },
  { id: "hi_fd5943", topic: "histograms", diagram: {"type":"histBar","width":20,"freq":12}, q: "A histogram bar covers a class of width 20 with frequency 12. Find the frequency density", options: ["240", "0.6", "1.6", "1.667"], answer: 1 },
  { id: "hi_stat5944", topic: "histograms", diagram: {"type":"dataBar","data":[18,26,27,28,29,31,35]}, q: "Find the mean of this data set: 18, 26, 27, 28, 29, 31, 35", options: ["18", "28.71", "27.71", "35"], answer: 2 },
  { id: "hi_stat5945", topic: "histograms", diagram: {"type":"dataBar","data":[11,13,23,30,32,36,39]}, q: "Find the range of this data set: 11, 13, 23, 30, 32, 36, 39", options: ["39", "11", "28", "29"], answer: 2 },
  { id: "hi_fd5946", topic: "histograms", diagram: {"type":"histBar","width":20,"freq":60}, q: "A histogram bar covers a class of width 20 with frequency 60. Find the frequency density", options: ["4", "1200", "3", "0.333"], answer: 2 },
  { id: "hi_stat5947", topic: "histograms", diagram: {"type":"dataBar","data":[6,10,18,18,19,24,28]}, q: "Find the mean of this data set: 6, 10, 18, 18, 19, 24, 28", options: ["6", "28", "18.57", "17.57"], answer: 3 },
  { id: "hi_stat5948", topic: "histograms", diagram: {"type":"dataBar","data":[14,20,22,22,23,30,39]}, q: "Find the median of this data set: 14, 20, 22, 22, 23, 30, 39", options: ["14", "23", "39", "22"], answer: 3 },
  { id: "hi_stat5949", topic: "histograms", diagram: {"type":"dataBar","data":[14,22,23,24,35,36,38]}, q: "Find the range of this data set: 14, 22, 23, 24, 35, 36, 38", options: ["24", "38", "14", "25"], answer: 0 },
  { id: "hi_fd5950", topic: "histograms", diagram: {"type":"histBar","width":20,"freq":33}, q: "A histogram bar covers a class of width 20 with frequency 33. Find the frequency density", options: ["660", "0.606", "1.65", "2.65"], answer: 2 },
  { id: "hi_stat5951", topic: "histograms", diagram: {"type":"dataBar","data":[13,16,22,26,26,33,37]}, q: "Find the mean of this data set: 13, 16, 22, 26, 26, 33, 37", options: ["37", "25.71", "24.71", "13"], answer: 2 },
  { id: "hi_fd5952", topic: "histograms", diagram: {"type":"histBar","width":20,"freq":20}, q: "A histogram bar covers a class of width 20 with frequency 20. Find the frequency density", options: ["2", "2.1", "1", "400"], answer: 2 },
  { id: "hi_stat5953", topic: "histograms", diagram: {"type":"dataBar","data":[5,15,23,27,28,31,36]}, q: "Find the median of this data set: 5, 15, 23, 27, 28, 31, 36", options: ["27", "28", "5", "36"], answer: 0 },
  { id: "hi_stat5954", topic: "histograms", diagram: {"type":"dataBar","data":[5,7,13,20,35,36,37]}, q: "Find the range of this data set: 5, 7, 13, 20, 35, 36, 37", options: ["33", "32", "5", "37"], answer: 1 },
  { id: "hi_stat5955", topic: "histograms", diagram: {"type":"dataBar","data":[11,12,19,21,22,24,38]}, q: "Find the mean of this data set: 11, 12, 19, 21, 22, 24, 38", options: ["22", "38", "11", "21"], answer: 3 },
  { id: "hi_freq5956", topic: "histograms", diagram: {"type":"histBar","width":10,"fd":3.56}, q: "A histogram bar covers a class of width 10 with frequency density 3.56. Find the frequency", options: ["0.356", "45.6", "35.6", "13.6"], answer: 2 },
  { id: "hi_freq5957", topic: "histograms", diagram: {"type":"histBar","width":5,"fd":2.65}, q: "A histogram bar covers a class of width 5 with frequency density 2.65. Find the frequency", options: ["7.7", "18.3", "13.3", "0.53"], answer: 2 },
  { id: "hi_fd5958", topic: "histograms", diagram: {"type":"histBar","width":10,"freq":20}, q: "A histogram bar covers a class of width 10 with frequency 20. Find the frequency density", options: ["200", "0.5", "2", "3"], answer: 2 },
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

const SEEN_KEY = 'y10foundation-seen-v1';

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

const FEEDBACK_KEY = 'y10foundation-feedback-v1';

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
  @keyframes dashMove { to { background-position: -20px 0; } }
  .track-lane { background-image: repeating-linear-gradient(90deg, rgba(244,241,234,0.14) 0 1px, transparent 1px 20px); animation: dashMove 3s linear infinite; }
  .checker { background-image: conic-gradient(#1B241E 90deg, #F4F1EA 90deg 180deg, #1B241E 180deg 270deg, #F4F1EA 270deg); background-size: 10px 10px; }
  .graph-bg { background-image: linear-gradient(rgba(244,241,234,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(244,241,234,0.06) 1px, transparent 1px); background-size: 24px 24px; }
  .pop { animation: popIn 0.35s ease-out; }
  .shakeit { animation: shake 0.4s ease-in-out; }
  .topic-scroll::-webkit-scrollbar { width: 8px; }
  .topic-scroll::-webkit-scrollbar-track { background: rgba(244,241,234,0.04); border-radius: 8px; }
  .topic-scroll::-webkit-scrollbar-thumb { background: rgba(244,241,234,0.25); border-radius: 8px; }
  .topic-scroll::-webkit-scrollbar-thumb:hover { background: rgba(244,241,234,0.4); }
`;

export default function Y10FoundationRace() {
  const [screen, setScreen] = useState('setup');
  const [selectedTopics, setSelectedTopics] = useState(TOPICS.map(t => t.id));
  const [numQuestions, setNumQuestions] = useState(10);
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
  const [feedbackList, setFeedbackList] = useState([]);
  const [fbLoading, setFbLoading] = useState(false);
  const [fbOpenFor, setFbOpenFor] = useState(null);
  const [fbText, setFbText] = useState('');
  const [fbSentIds, setFbSentIds] = useState([]);
  const timeoutRef = useRef(null);

  const toggleTopic = (id) => {
    setSelectedTopics(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const startRace = async () => {
    const filteredAll = shuffle(QUESTIONS.filter(q => selectedTopics.includes(q.topic)));
    const seen = await loadSeenIds();
    let unseen = filteredAll.filter(q => !seen.includes(q.id));
    const wanted = Math.max(1, Math.min(numQuestions, filteredAll.length));
    let cycleReset = false;
    if (unseen.length < wanted) {
      // Not enough fresh questions left in this chapter selection — start a new cycle
      // so the student still gets variety instead of running dry.
      cycleReset = true;
      unseen = filteredAll;
    }
    const chosen = unseen.slice(0, wanted).map(shuffleOptions);
    const newSeen = cycleReset ? chosen.map(q => q.id) : [...new Set([...seen, ...chosen.map(q => q.id)])];
    saveSeenIds(newSeen);

    setPool(chosen);
    setQIndex(0);
    setCurrentQuestion(chosen[0]);
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
      const outOfQuestions = (qIndex + 1) >= pool.length;
      setTimeout(() => {
        if (finished || outOfQuestions) {
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
      const res = await window.storage.get('y10foundation-leaderboard', true);
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
      const res = await window.storage.get('y10foundation-leaderboard', true);
      const existing = res ? JSON.parse(res.value) : [];
      const updated = [...(Array.isArray(existing) ? existing : []), entry]
        .sort((a, b) => a.place - b.place || a.totalTime - b.totalTime)
        .slice(0, 50);
      await window.storage.set('y10foundation-leaderboard', JSON.stringify(updated), true);
      setSaved(true);
    } catch (e) {
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

        <div className="flex items-center justify-between mb-1 pt-2">
          <div className="flex items-center gap-2">
            <Flag size={30} color="#F5D76E" strokeWidth={2.4} />
            <h1 className="fd text-4xl tracking-wide" style={{ color: '#F5D76E' }}>Y10 UNIT 1H SPRINT</h1>
          </div>
          <div className="fm text-xs opacity-60 uppercase tracking-widest text-right">Foundation • 1 min/Q<br/>Edexcel IGCSE Maths A</div>
        </div>
        <div className="fb text-xs opacity-45 mb-6">Created by Amer Al-Daboubi</div>

        {screen === 'setup' && (
          <SetupScreen selectedTopics={selectedTopics} toggleTopic={toggleTopic} numQuestions={numQuestions} setNumQuestions={setNumQuestions} startRace={startRace} goToLeaderboard={goToLeaderboard} goToFeedback={goToFeedback} />
        )}

        {screen === 'racing' && currentQuestion && (
          <RacingScreen racers={racers} currentQuestion={currentQuestion} timeLeft={timeLeft} answered={answered} selectedOption={selectedOption} isCorrect={isCorrect} handleAnswer={handleAnswer} stats={stats} fbOpenFor={fbOpenFor} openFeedbackFor={openFeedbackFor} fbText={fbText} setFbText={setFbText} sendFeedback={sendFeedback} fbSentIds={fbSentIds} />
        )}

        {screen === 'results' && (
          <ResultsScreen standings={standings} accuracy={accuracy} avgTime={avgTime} totalRaceTime={totalRaceTime} playerName={playerName} setPlayerName={setPlayerName} saveScore={saveScore} saved={saved} startRace={startRace} goToLeaderboard={goToLeaderboard} />
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

function SetupScreen({ selectedTopics, toggleTopic, numQuestions, setNumQuestions, startRace, goToLeaderboard, goToFeedback }) {
  const allSelected = selectedTopics.length === TOPICS.length;
  const selectAll = () => {
    if (allSelected) return;
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
        Real Edexcel 4MA1 past-paper questions, sorted by chapter from the Y10 Unit 1H long-term plan (Term 1-2).
        Scroll to see all 17 chapters. Each replay serves fresh questions you haven't seen yet before repeating any —
        pick your chapters, choose how many questions to answer, then race three rivals at 1 minute per question.
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
                border: `2px solid ${numQuestions === clamp(p) ? '#F5D76E' : 'rgba(244,241,234,0.15)'}`,
                background: numQuestions === clamp(p) ? '#F5D76E22' : 'transparent',
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
              border: `2px solid ${numQuestions === totalAvailable ? '#F5D76E' : 'rgba(244,241,234,0.15)'}`,
              background: numQuestions === totalAvailable ? '#F5D76E22' : 'transparent',
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
            style={{ background: '#25332B', border: '1px solid rgba(244,241,234,0.2)', color: '#F4F1EA' }}
          />
        </div>
        <div className="fm text-[10px] opacity-40 mt-2">{totalAvailable} questions available in the chapters you've selected</div>
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

function RacingScreen({ racers, currentQuestion, timeLeft, answered, selectedOption, isCorrect, handleAnswer, stats, fbOpenFor, openFeedbackFor, fbText, setFbText, sendFeedback, fbSentIds }) {
  const timerPct = Math.max(0, (timeLeft / QUESTION_TIME) * 100);
  const timerColor = timerPct > 50 ? '#6EC6F5' : timerPct > 20 ? '#F5D76E' : '#F2789F';
  const topicMeta = TOPICS.find(t => t.id === currentQuestion.topic);

  return (
    <div>
      <div className="rounded-xl p-4 mb-5" style={{ background: '#25332B', border: '1px solid rgba(244,241,234,0.08)' }}>
        {racers.map(r => (
          <div key={r.id} className="relative h-9 mb-2 last:mb-0 rounded-md overflow-hidden track-lane" style={{ background: 'rgba(244,241,234,0.04)' }}>
            <div className="absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-out flex items-center gap-1" style={{ left: `calc(${Math.min(r.progress, 96)}% - 2px)` }}>
              <Car size={20} color={r.color} fill={r.color} style={{ transform: 'scaleX(-1)' }} />
            </div>
            <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2 h-6 rounded-sm checker" />
            <div className="absolute left-2 top-1/2 -translate-y-1/2 fm text-[10px] opacity-50">{r.name}</div>
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

      <div className={`rounded-xl p-6 mb-5 ${answered && !isCorrect ? 'shakeit' : ''}`} style={{ background: '#25332B', border: '1px solid rgba(244,241,234,0.08)' }}>
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
        {currentQuestion.diagram && <QuestionDiagram diagram={currentQuestion.diagram} accent="#F5D76E" />}
        {fbOpenFor === currentQuestion.id && (
          <div className="mt-4 pop">
            <textarea
              value={fbText}
              onChange={e => setFbText(e.target.value)}
              placeholder="What's wrong with this question? (e.g. wrong answer, confusing wording, typo)"
              className="fb w-full rounded-lg px-3 py-2 text-sm outline-none"
              rows={2}
              style={{ background: '#1B241E', border: '1px solid rgba(244,241,234,0.2)', color: '#F4F1EA' }}
            />
            <div className="flex justify-end mt-2">
              <button onClick={() => sendFeedback(currentQuestion)} disabled={!fbText.trim()} className="fb rounded-lg px-3 py-2 text-xs font-semibold flex items-center gap-1" style={{ background: fbText.trim() ? '#F5D76E' : 'rgba(244,241,234,0.15)', color: '#1B241E' }}>
                <Send size={13} /> Send to Mr. Al-Daboubi
              </button>
            </div>
          </div>
        )}
      </div>

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
            <button key={i} onClick={() => handleAnswer(i)} disabled={answered} className="fb text-left rounded-lg px-4 py-4 text-sm font-semibold flex items-center justify-between transition-colors" style={{ background: bg, border: `2px solid ${border}`, color: textColor }}>
              <span>{opt}</span>
              {answered && i === currentQuestion.answer && <Check size={18} color="#6EC6F5" />}
              {answered && i === selectedOption && i !== currentQuestion.answer && <X size={18} color="#F2789F" />}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-4 flex items-center gap-2 fb text-sm pop" style={{ color: isCorrect ? '#6EC6F5' : '#F2789F' }}>
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
          <div key={r.id} className="flex items-center justify-between rounded-lg px-4 py-3 mb-2" style={{ background: r.isPlayer ? '#F5D76E18' : '#25332B', border: `1px solid ${r.isPlayer ? '#F5D76E' : 'rgba(244,241,234,0.08)'}` }}>
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
          <input value={playerName} onChange={e => setPlayerName(e.target.value)} placeholder="Enter your name for the leaderboard" className="fb flex-1 rounded-lg px-4 py-3 text-sm outline-none" style={{ background: '#25332B', border: '1px solid rgba(244,241,234,0.15)', color: '#F4F1EA' }} maxLength={24} />
          <button onClick={saveScore} disabled={!playerName.trim()} className="fb rounded-lg px-4 py-3 text-sm font-semibold" style={{ background: playerName.trim() ? '#6EC6F5' : 'rgba(244,241,234,0.15)', color: '#1B241E' }}>Save</button>
        </div>
      ) : (
        <div className="fb text-sm mb-6 flex items-center gap-2" style={{ color: '#6EC6F5' }}>
          <Check size={16} /> Saved to the leaderboard.
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={startRace} className="fd flex-1 flex items-center justify-center gap-2 rounded-lg py-4 text-xl tracking-wide" style={{ background: '#F5D76E', color: '#1B241E' }}>
          <RotateCcw size={18} /> RACE AGAIN
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
      <button onClick={backToSetup} className="fd w-full flex items-center justify-center gap-2 rounded-lg py-4 text-xl tracking-wide" style={{ background: '#F5D76E', color: '#1B241E' }}>
        <ChevronRight size={18} /> BACK TO SETUP
      </button>
    </div>
  );
}

function FeedbackScreen({ feedbackList, loading, backToSetup }) {
  return (
    <div className="pop">
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare size={22} color="#F5D76E" />
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
            <div key={i} className="rounded-lg px-4 py-3" style={{ background: '#25332B', border: '1px solid rgba(244,241,234,0.08)' }}>
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
      <button onClick={backToSetup} className="fd w-full flex items-center justify-center gap-2 rounded-lg py-4 text-xl tracking-wide" style={{ background: '#F5D76E', color: '#1B241E' }}>
        <ChevronRight size={18} /> BACK TO SETUP
      </button>
    </div>
  );
}
