/* A+ Worksheets - QUESTIONS ONLY (answers live in Firestore, never in this public file).
   Each sheet: id, lvl (1 Foundation, 2 Standard, 3 Challenge), qs:[{m:marks,q:stem,p:[parts]}] */
window.WS_CH={
 m:{name:"Maths A (IGCSE 4MA1)",ch:[["m01","Number Skills - HCF, LCM, Primes & Fractions"],["m02","Indices, Surds & Standard Form"],["m03","Bounds & Accuracy"],["m04","Percentages"],["m05","Ratio & Proportion"],["m06","Units & Compound Measures"],["m07","Algebraic Manipulation"],["m08","Formulae & Rearranging"],["m09","Linear & Simultaneous Equations"],["m10","Quadratic Equations"],["m11","Inequalities"],["m12","Sequences"],["m13","Functions"],["m14","Graphs & Coordinate Geometry"],["m15","Calculus"],["m16","Sets & Venn Diagrams"],["m17","Angles, Polygons & Circle Theorems"],["m18","Pythagoras & Trigonometry"],["m19","Area, Perimeter & Volume"],["m20","Similarity & Congruence"],["m21","Transformations"],["m22","Vectors"],["m23","Bearings, Constructions & Loci"],["m24","Statistics"],["m25","Probability"]]},
 f:{name:"Further Pure Maths (4PM1)",ch:[["f01","Logarithms, Indices & Surds"],["f02","Quadratic Functions"],["f03","Identities & Inequalities"],["f04","Graphs"],["f05","Series"],["f06","Binomial Series"],["f07","Vectors"],["f08","Coordinate Geometry"],["f09","Differentiation"],["f10","Integration"],["f11","Kinematics"],["f12","Trigonometry"]]},
 s:{name:"Statistics 1 (WST01)",ch:[["s01","Data Representation & Summary"],["s02","Probability"],["s03","Correlation & Regression"],["s04","Discrete Random Variables"],["s05","Normal Distribution"]]}
};
window.WS_SHEETS=window.WS_SHEETS||{};
Object.assign(window.WS_SHEETS,{
"m02":[
{id:"m02-1",lvl:1,qs:[
{m:3,q:"Work out the value of",p:["(a) 2^5","(b) 3^4 ÷ 3^2","(c) 5^0 + 7^1"]},
{m:3,q:"Write as a single power of x or y",p:["(a) x^3 × x^4","(b) y^8 ÷ y^5","(c) (a^2)^3 (write as a power of a)"]},
{m:2,q:"Write in standard form",p:["(a) 45 000","(b) 0.0072"]},
{m:3,q:"Work out the value of",p:["(a) 25^(1/2)","(b) 8^(1/3)","(c) 2^-3"]},
{m:2,q:"Write √50 in the form a√2, where a is an integer."},
{m:3,q:"Simplify",p:["(a) √3 × √12","(b) √18 + √8"]},
{m:2,q:"Work out (3 × 10^4) × (2 × 10^5). Give your answer in standard form."},
{m:2,q:"Rationalise the denominator of 6/√3 and simplify your answer."}]},
{id:"m02-2",lvl:2,qs:[
{m:4,q:"Simplify fully",p:["(a) (2x^3 y)^4","(b) (12a^5 b^2) ÷ (3a^2 b)"]},
{m:3,q:"Find the value of n in each case.",p:["(a) 2^n = 1/16","(b) 9^n = 27"]},
{m:4,q:"Evaluate, without a calculator",p:["(a) 16^(3/4)","(b) (27/8)^(-2/3)"]},
{m:3,q:"Expand and simplify (3 + √5)(2 − √5)."},
{m:3,q:"Write 4/(3 − √5) in the form a + b√5, where a and b are integers."},
{m:2,q:"A light year is 9.46 × 10^12 km. The star Proxima is 4.3 light years from the Sun. Work out this distance in km. Give your answer in standard form, correct to 3 significant figures."},
{m:4,q:"Work out, giving each answer in standard form",p:["(a) (4.8 × 10^7) ÷ (1.2 × 10^-3)","(b) (3 × 10^5) + (4 × 10^4)"]},
{m:3,q:"Simplify √75 − 2√12 + √27, giving your answer in the form a√3."}]},
{id:"m02-3",lvl:3,qs:[
{m:3,q:"Solve 2^(x+1) = 4^(x−3)."},
{m:4,q:"x = 3^n. Write each of the following in terms of x.",p:["(a) 27^n","(b) 9^(n+1)"]},
{m:3,q:"Show that (√12 − √3)^2 = 3."},
{m:3,q:"Show that (√3 + 1)/(√3 − 1) can be written as 2 + √3."},
{m:4,q:"A rectangle has area 12 cm² and length (3 + √3) cm. Find the width of the rectangle in the form a + b√3, where a and b are integers."},
{m:3,q:"A right-angled triangle has shorter sides of length (2 + √3) cm and (2 − √3) cm. Show that the hypotenuse has length √14 cm."},
{m:4,q:"The mass of the Earth is 5.97 × 10^24 kg. The mass of the Moon is 7.35 × 10^22 kg.",p:["(a) How many times heavier is the Earth than the Moon? Give your answer to 3 significant figures.","(b) Work out the combined mass of the Earth and the Moon. Give your answer in standard form to 3 significant figures."]},
{m:5,q:"Solve 3^(2x) − 4 × 3^x + 3 = 0."}]}
]});
