import { Question, SubjectSection } from '../types';

// ==========================================
// 1. MATHEMATICS (50 Distinct Questions)
// ==========================================
export const mathRawQuestions: Omit<Question, 'id' | 'questionNumber' | 'section'>[] = [
  {
    questionText: 'If $A = \\begin{pmatrix} 0 & 1 \\\\ -1 & 0 \\end{pmatrix}$ and if $(aI + bA)^2 = A$, then the value of $b^4$ is equal to:',
    options: ['1', '1/2', '-1/4', '1/4'],
    correctOptionIndex: 3,
    explanation: 'Given $A^2 = \\begin{pmatrix} 0 & 1 \\\\ -1 & 0 \\end{pmatrix} \\begin{pmatrix} 0 & 1 \\\\ -1 & 0 \\end{pmatrix} = -I$.\n\nExpanding $(aI + bA)^2 = a^2 I + 2ab A + b^2 A^2 = (a^2 - b^2)I + 2ab A$.\n\nSetting this equal to $A$ gives:\n1. $2ab = 1 \\implies ab = 1/2 \\implies a = 1/(2b)$\n2. $a^2 - b^2 = 0 \\implies a^2 = b^2$.\n\nSubstituting $a^2 = b^2$:\n$(1/(2b))^2 = b^2 \\implies 4b^4 = 1 \\implies b^4 = 1/4$.'
  },
  {
    questionText: 'If $A = \\begin{pmatrix} \\cos \\theta & \\sin \\theta & 0 \\\\ -\\sin \\theta & \\cos \\theta & 0 \\\\ 0 & 0 & 1 \\end{pmatrix} = F(\\theta)$, then the inverse $A^{-1}$ is equivalent to:',
    options: ['$F(\\theta)$', '$F(-\\theta)$', '$-F(\\theta)$', '$-F(-\\theta)$'],
    correctOptionIndex: 1,
    explanation: 'For any orthogonal rotation matrix, changing the direction of the rotation is equivalent to taking the transpose or inverse. Hence, $F(\\theta)^{-1} = F(-\\theta)$ since $\\cos(-\\theta) = \\cos\\theta$ and $\\sin(-\\theta) = -\\sin\\theta$.'
  },
  {
    questionText: 'If $(x,y,z)$ is the solution of the linear equations $x + y + z = 6$, $x - y + z = 2$, and $2x + y - z = 1$, then what is the value of $\\frac{yz}{x}$?',
    options: ['1/6', '3/2', '6', '3'],
    correctOptionIndex: 2,
    explanation: 'Subtracting equation 2 from equation 1 gives: $2y = 4 \\implies y = 2$.\n\nSubstitute $y=2$ in eq 1 and eq 3:\n- $x + z = 4 \\implies z = 4-x$\n- $2x - z = -1 \\implies 2x - (4-x) = -1 \\implies 3x = 3 \\implies x=1$.\n- Then $z = 4-1 = 3$.\n\nThus $\\frac{yz}{x} = \\frac{2 \\times 3}{1} = 6$.'
  },
  {
    questionText: 'If $A$ and $B$ are square matrices of order 3 with determinants $|A| = 2$ and $|B| = -4$, then the value of the determinant $|2AB|$ is:',
    options: ['-64', '16', '64', '-16'],
    correctOptionIndex: 0,
    explanation: 'Using determinant properties, for order $n=3$, we get $|2AB| = 2^3 \\times |A| \\times |B| = 8 \\times 2 \\times (-4) = -64$.'
  },
  {
    questionText: 'If $\\log_{\\sqrt{27}}(x) = \\frac{8}{3}$, then determine the value of $x$:',
    options: ['10', '16', '81', '27'],
    correctOptionIndex: 2,
    explanation: 'By converting logarithmic form to exponential form:\n$x = (\\sqrt{27})^{8/3} = (27^{1/2})^{8/3} = 27^{4/3} = (3^3)^{4/3} = 3^4 = 81$.'
  },
  {
    questionText: 'If $\\frac{x^3}{(x-1)(x+2)} = Ax + B + \\frac{C}{x-1} + \\frac{D}{x+2}$, then the value of the sum constant $C+D$ is:',
    options: ['-3', '3', '2', '0'],
    correctOptionIndex: 1,
    explanation: 'By dividing $x^3$ by $x^2+x-2$ we obtain quotient $x-1$ and remainder $3x-2$.\n\nNext, expand the partial fraction:\n$\\frac{3x-2}{(x-1)(x+2)} = \\frac{C}{x-1} + \\frac{D}{x+2}$.\nMultiply by $(x-1)(x+2)$:\n$3x-2 = C(x+2) + D(x-1)$.\n- Put $x=1 \\implies C = 1/3$.\n- Put $x=-2 \\implies -8 = -3D \\implies D = 8/3$.\n\nTherefore, $C+D = 1/3 + 8/3 = 9/3 = 3$.'
  },
  {
    questionText: 'Simplify the trigonometric expression $\\frac{\\sin^2 33^{\\circ} - \\sin^2 57^{\\circ}}{\\sin 21^{\\circ} - \\cos 21^{\\circ}}$:',
    options: ['\\sqrt{3}/2', '1/2', '1/\\sqrt{2}', '1'],
    correctOptionIndex: 2,
    explanation: 'Using identity $\\sin^2 A - \\sin^2 B = \\sin(A+B)\\sin(A-B)$:\nNumerator: $\\sin(90^{\\circ})\\sin(-24^{\\circ}) = -\\sin 24^{\\circ}$.\n\nDenominator: $\\sin 21^{\\circ} - \\sin 69^{\\circ} = 2 \\cos(45^{\\circ})\\sin(-24^{\\circ}) = -\\sqrt{2}\\sin 24^{\\circ}$.\n\nDividing leaves $\\frac{1}{\\sqrt{2}}$.'
  },
  {
    questionText: 'If $2\\tan^{-1}\\left(\\frac{2}{3}\\right) = \\tan^{-1}(k)$, then find values of the constant parameter $k$:',
    options: ['5/12', '4/3', '12/5', '3/4'],
    correctOptionIndex: 2,
    explanation: 'Using double angle formula:\n$\\tan(2\\theta) = \\frac{2x}{1-x^2} = \\frac{2(2/3)}{1 - (2/3)^2} = \\frac{4/3}{5/9} = \\frac{12}{5}$. Hence, $k = 12/5$.'
  },
  {
    questionText: 'Find the standard formula distance between parallel straight lines $2x - y + 4 = 0$ and $6x - 3y = 5$:',
    options: ['13 / (2\\sqrt{5})', '17 / (3\\sqrt{5})', '17 / (2\\sqrt{5})', '14 / (3\\sqrt{5})'],
    correctOptionIndex: 1,
    explanation: 'Multiply first line by 3: $6x - 3y + 12 = 0$. Now $A=6, B=-3, C_1=12$, and $C_2=-5$.\n\nDistance $d = \\frac{|C_1 - C_2|}{\\sqrt{A^2 + B^2}} = \\frac{|12 - (-5)|}{\\sqrt{36 + 9}} = \\frac{17}{\\sqrt{45}} = \\frac{17}{3\\sqrt{5}}$.'
  },
  {
    questionText: 'Find the parameter $k$ if the circle $x^2 + y^2 - 4x + 6y - k = 0$ has radius 4 units:',
    options: ['3', '-3', '2', '5'],
    correctOptionIndex: 0,
    explanation: 'By circle radius expression, $R = \\sqrt{g^2 + f^2 - c}$ where $g=-2, f=3, c=-k$.\n\nHence $16 = (-2)^2 + (3)^2 - (-k) \\implies 16 = 4 + 9 + k \\implies k = 3$.'
  },
  {
    questionText: 'Determine the matrix rank of $A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 2 & 4 & 6 \\\\ 3 & 6 & 9 \\end{pmatrix}$:',
    options: ['3', '2', '1', '0'],
    correctOptionIndex: 2,
    explanation: 'Since Row 2 is $2 \\times$ Row 1 and Row 3 is $3 \\times$ Row 1, there is only 1 linearly independent row. Thus, the rank is 1.'
  },
  {
    questionText: 'Under which specific condition does Cramer\'s Rule system of linear equations have a unique solution?',
    options: ['$\\Delta = 0$', '$\\Delta \\neq 0$', '$\\Delta_x = 0$', '$\\Delta_y = 0$'],
    correctOptionIndex: 1,
    explanation: 'For a unique solution to exist in Cramer\'s Rule, the system determinant (denominator) $\\Delta$ must be non-zero.'
  },
  {
    questionText: 'Find the eigenvalues of the upper triangular matrix $A = \\begin{pmatrix} 3 & 12 & -5 \\\\ 0 & 4 & 8 \\\\ 0 & 0 & 2 \\end{pmatrix}$:',
    options: ['3, 4, 2', '0, 0, 0', '1, 1, 1', '9, 16, 4'],
    correctOptionIndex: 0,
    explanation: 'The eigenvalues of any triangular or diagonal matrix are simply the elements on its main diagonal. Thus, they are 3, 4, and 2.'
  },
  {
    questionText: 'Evaluate the basic hyperbolic identity value of $\\cosh^2(x) - \\sinh^2(x)$:',
    options: ['-1', '0', '1', '$\\cosh(2x)$'],
    correctOptionIndex: 2,
    explanation: 'By standard definitions of hyperbolic trigonometry, $\\cosh^2(x) - \\sinh^2(x) = 1$ for all real values of $x$.'
  },
  {
    questionText: 'Resolve the partial fraction components of the algebraic function $\\frac{1}{x^2 - 1}$:',
    options: [
      '$\\frac{1}{2(x-1)} - \\frac{1}{2(x+1)}$',
      '$\\frac{1}{x-1} + \\frac{1}{x+1}$',
      '$\\frac{1}{2(x+1)} - \\frac{1}{2(x-1)}$',
      '$\\frac{1}{x^2} - 1$'
    ],
    correctOptionIndex: 0,
    explanation: '$\\frac{1}{(x-1)(x+1)} = \\frac{A}{x-1} + \\frac{B}{x+1}$. Setting $x=1$ yields $A = 1/2$. Setting $x=-1$ yields $B = -1/2$. Thus it is $\\frac{1}{2(x-1)} - \\frac{1}{2(x+1)}$.'
  },
  {
    questionText: 'Determine the primary period of the trigonometric function $f(x) = \\sin(3x)$:',
    options: ['$2\\pi$', '$\\pi$', '$2\\pi / 3$', '$\\pi / 3$'],
    correctOptionIndex: 2,
    explanation: 'The standard period of $\\sin(x)$ is $2\\pi$. Scaling the argument by $k=3$ compresses the period to $2\\pi/k = 2\\pi/3$.'
  },
  {
    questionText: 'Determine the slope of the tangent to the curve $y = x^3 - 3x + 2$ at the point $x = 2$:',
    options: ['9', '6', '3', '0'],
    correctOptionIndex: 0,
    explanation: 'The derivative represents the slope: $\\frac{dy}{dx} = 3x^2 - 3$.\n\nEvaluating at $x=2$ gives $3(2)^2 - 3 = 12 - 3 = 9$.'
  },
  {
    questionText: 'Evaluate the basic trigonometric limit $\\lim_{x \\to 0} \\frac{\\sin 5x}{3x}$:',
    options: ['0', '1', '5/3', '3/5'],
    correctOptionIndex: 2,
    explanation: '$\\lim_{x \\to 0} \\frac{\\sin 5x}{3x} = \\frac{5}{3} \\lim_{x \\to 0} \\frac{\\sin 5x}{5x} = \\frac{5}{3} \\times 1 = \\frac{5}{3}$.'
  },
  {
    questionText: 'Determine the first derivative of $\\ln(\\sec x + \\tan x)$ with respect to $x$:',
    options: ['$\\sec x$', '$\\tan x$', '$\\sec x \\tan x$', '$\\sec^2 x$'],
    correctOptionIndex: 0,
    explanation: 'Let $y = \\ln(\\sec x + \\tan x)$. Using chain rule:\n$\\frac{dy}{dx} = \\frac{1}{\\sec x + \\tan x} \\cdot (\\sec x \\tan x + \\sec^2 x) = \\frac{\\sec x (\\tan x + \\sec x)}{\\sec x + \\tan x} = \\sec x$.'
  },
  {
    questionText: 'Find the maximum value of the function $f(x) = x e^{-x}$ for $x \\ge 0$:',
    options: ['1', '$e$', '$1/e$', '$e^2$'],
    correctOptionIndex: 2,
    explanation: 'Derivative $f\'(x) = e^{-x} - x e^{-x} = e^{-x}(1-x)$. Setting $f\'(x) = 0$ yields critical point $x = 1$.\n\nThe maximum value is $f(1) = 1 \\cdot e^{-1} = 1/e$.'
  },
  {
    questionText: 'Evaluate the indefinite integral $\\int \\sec^2 x \\tan x \\, dx$:',
    options: ['$\\frac{1}{2}\\tan^2 x + C$', '$\\sec^2 x + C$', '$\\ln(\\cos x) + C$', '$\\tan x + C$'],
    correctOptionIndex: 0,
    explanation: 'Using substitution: Let $u = \\tan x \\implies du = \\sec^2 x \\, dx$. The integral becomes $\\int u \\, du = \\frac{u^2}{2} + C = \\frac{1}{2}\\tan^2 x + C$.'
  },
  {
    questionText: 'Find the value of the definite integral $\\int_{0}^{\\pi/2} \\sin^3 x \\, dx$:',
    options: ['1/3', '2/3', '1/2', '1'],
    correctOptionIndex: 1,
    explanation: 'Using reduction formula/Wallis formula: $\\int_{0}^{\\pi/2} \\sin^n x \\, dx = \\frac{n-1}{n} \\times \\dots$\n\nFor $n=3$, it is $\\frac{3-1}{3} = 2/3$.'
  },
  {
    questionText: 'Calculate the area bounded by the curve $y = x^2$ and the line $y = 4$ in the upper plane:',
    options: ['32/3', '16/3', '8/3', '12'],
    correctOptionIndex: 0,
    explanation: 'Area $= \\int_{-2}^{2} (4 - x^2) \\, dx = 2 \\int_{0}^{2} (4 - x^2) \\, dx = 2 \\left[ 4x - \\frac{x^3}{3} \\right]_0^2 = 2 \\left( 8 - \\frac{8}{3} \\right) = 2 \\left( \\frac{16}{3} \\right) = \\frac{32}{3}$.'
  },
  {
    questionText: 'What is the Root Mean Square (RMS) value of a sinusoidal current $i = I_0 \\sin(\\omega t)$ calculated over a complete periodic cycle?',
    options: ['$I_0$', '$I_0 / 2$', '$I_0 / \\sqrt{2}$', '$\\sqrt{2} I_0$'],
    correctOptionIndex: 2,
    explanation: 'By electrical/math definitions, the RMS of sine amplitude is $\\sqrt{\\frac{1}{T}\\int i^2 dt} = I_0 / \\sqrt{2}$.'
  },
  {
    questionText: 'Find the order and degree of the differential equation: $\\left(\\frac{d^2y}{dx^2}\\right)^3 + \\left(\\frac{dy}{dx}\\right)^4 + y = 0$:',
    options: ['Order 2, Degree 3', 'Order 3, Degree 2', 'Order 2, Degree 4', 'Order 4, Degree 3'],
    correctOptionIndex: 0,
    explanation: 'The order is the highest derivative present ($d^2y/dx^2$, which is order 2). The degree is the power of this highest derivative (which is 3). Hence, Order 2, Degree 3.'
  },
  {
    questionText: 'Find the Integrating Factor (I.F.) of the linear differential equation $\\frac{dy}{dx} + \\frac{2}{x}y = x^3$:',
    options: ['$e^x$', '$x^2$', '$2/x$', '$\\ln x$'],
    correctOptionIndex: 1,
    explanation: 'The equation is in standard linear form with $P = 2/x$. Integrating factor is $I.F. = e^{\\int P \\, dx} = e^{\\int (2/x) \\, dx} = e^{2\\ln x} = e^{\\ln(x^2)} = x^2$.'
  },
  {
    questionText: 'Find the particular integral (P.I.) of the differential equation $(D^2 + 4)y = \\sin 2x$:',
    options: ['$\\frac{-x}{4}\\cos 2x$', '$\\frac{x}{4}\\sin 2x$', '$\\frac{-x}{2}\\cos 2x$', '$\\frac{x}{2}\\sin 2x$'],
    correctOptionIndex: 0,
    explanation: 'Using the standard rule for $D^2 = -a^2$: since $D^2 + 4 = 0$ for $a=2$, we use the resonance formula $\\frac{1}{D^2+a^2}\\sin ax = \\frac{-x}{2a}\\cos ax$. Here $a=2 \\implies \\frac{-x}{4}\\cos 2x$.'
  },
  {
    questionText: 'Find the angle between two vectors $\\vec{A} = \\hat{i} + \\hat{j}$ and $\\vec{B} = \\hat{i} - \\hat{j}$:',
    options: ['0°', '45°', '90°', '180°'],
    correctOptionIndex: 2,
    explanation: 'The dot product is $\\vec{A} \\cdot \\vec{B} = (1)(1) + (1)(-1) = 1 - 1 = 0$. Since the dot product is 0, the two vectors are perpendicular (90°).'
  },
  {
    questionText: 'Find the unit normal vector to the surface $x^2 + y^2 = z$ at the physical coordinates point $(1, 1, 2)$:',
    options: [
      '$\\frac{2\\hat{i} + 2\\hat{j} - \\hat{k}}{3}$',
      '$\\frac{\\hat{i} + \\hat{j} + \\hat{k}}{\\sqrt{3}}$',
      '$\\frac{2\\hat{i} - 2\\hat{j}}{\\sqrt{8}}$',
      '$\\hat{k}$'
    ],
    correctOptionIndex: 0,
    explanation: 'Let $\\phi = x^2 + y^2 - z = 0$. Gradient $\\nabla\\phi = 2x\\hat{i} + 2y\\hat{j} - \\hat{k}$. At $(1,1,2)$, $\\nabla\\phi = 2\\hat{i} + 2\\hat{j} - \\hat{k}$. Magnitude is $\\sqrt{4+4+1} = 3$. Unit vector is $\\frac{2\\hat{i} + 2\\hat{j} - \\hat{k}}{3}$.'
  },
  {
    questionText: 'Determine the mathematical divergence of the identity vector field $\\vec{V} = x\\hat{i} + y\\hat{j} + z\\hat{k}$:',
    options: ['0', '1', '3', '$\\vec{V}$'],
    correctOptionIndex: 2,
    explanation: 'Divergence $\\nabla \\cdot \\vec{V} = \\frac{\\partial(x)}{\\partial x} + \\frac{\\partial(y)}{\\partial y} + \\frac{\\partial(z)}{\\partial z} = 1 + 1 + 1 = 3$.'
  },
  {
    questionText: 'Find the combined value of hyperbolic expression $\\sinh(x) + \\cosh(x)$:',
    options: ['$e^x$', '$e^{-x}$', '$2e^x$', '1'],
    correctOptionIndex: 0,
    explanation: 'Using descriptions: $\\sinh x = \\frac{e^x - e^{-x}}{2}$ and $\\cosh x = \\frac{e^x + e^{-x}}{2}$. Adding them gives $e^x$.'
  },
  {
    questionText: 'Find the rank of identity matrix of dimensions $2 \\times 2$:',
    options: ['0', '1', '2', '3'],
    correctOptionIndex: 2,
    explanation: 'For any identity matrix of order $n$, it has full rank since all $n$ rows are completely linearly independent. Thus rank is 2.'
  },
  {
    questionText: 'Find the simplified value of the trigonometric series $\\cos(20^{\\circ})\\cos(40^{\\circ})\\cos(80^{\\circ})$:',
    options: ['1/2', '1/4', '1/8', '1/16'],
    correctOptionIndex: 2,
    explanation: 'Using the identity $\\cos \\theta \\cos(60^{\\circ}-\\theta) \\cos(60^{\\circ}+\\theta) = \\frac{1}{4}\\cos 3\\theta$:\n\nSetting $\\theta = 20^{\\circ}$ gives $\\frac{1}{4}\\cos(60^{\\circ}) = \\frac{1}{4} \\times \\frac{1}{2} = \\frac{1}{8}$.'
  },
  {
    questionText: 'Calculate the perpendicular distance from point $(1, 2)$ to the straight line $3x + 4y - 5 = 0$:',
    options: ['1/5', '6/5', '1/2', '12/5'],
    correctOptionIndex: 1,
    explanation: 'Using distance formula: $d = \\frac{|Ax_0 + By_0 + C|}{\\sqrt{A^2 + B^2}} = \\frac{|3(1) + 4(2) - 5|}{\\sqrt{9 + 16}} = \\frac{|3+8-5|}{5} = \\frac{6}{5}$.'
  },
  {
    questionText: 'Find the eccentricity of the ellipse $\\frac{x^2}{16} + \\frac{y^2}{9} = 1$:',
    options: ['\\sqrt{7}/4', '7/16', '3/4', '5/4'],
    correctOptionIndex: 0,
    explanation: 'Here $a^2=16, b^2=9$. Eccentricity $e = \\sqrt{1 - \\frac{b^2}{a^2}} = \\sqrt{1 - \\frac{9}{16}} = \\sqrt{\\frac{7}{16}} = \\frac{\\sqrt{7}}{4}$.'
  },
  {
    questionText: 'In Simpson\'s 3/8th numerical integration rule, the number of intervals must strictly be a multiple of:',
    options: ['2', '3', '4', '6'],
    correctOptionIndex: 1,
    explanation: 'Simpson\'s 3/8th rule requires dividing the total interval into a multiple of 3 subintervals to generate third-order polynomial fits.'
  },
  {
    questionText: 'In the Trapezoidal Rule of numerical integration, the weight of the end coordinates ($y_0, y_n$) relative to the middle coordinates is:',
    options: ['Double', 'Triple', 'Identical', 'Half'],
    correctOptionIndex: 3,
    explanation: 'The Trapezoidal Formula is $\\frac{h}{2} [ (y_0 + y_n) + 2(y_1 + y_2 + \\dots) ]$. The endpoints are multiplied by 1, while middle nodes are multiplied by 2, making their relative weighting half.'
  },
  {
    questionText: 'Evaluate the Laplace Transform of $t^3$, $L\\{t^3\\}$:',
    options: ['$3/s^3$', '$6/s^4$', '$24/s^4$', '$6/s^3$'],
    correctOptionIndex: 1,
    explanation: 'The general Laplace formula is $L\\{t^n\\} = \\frac{n!}{s^{n+1}}$. For $n=3$, it is $\\frac{3!}{s^4} = \\frac{6}{s^4}$.'
  },
  {
    questionText: 'Find the inverse Laplace Transform $L^{-1}\\left\\{ \\frac{1}{s^2 + 9} \\right\\}$:',
    options: ['$\\cos 3t$', '$\\sin 3t$', '$\\frac{1}{3}\\sin 3t$', '$\\frac{1}{3}\\cos 3t$'],
    correctOptionIndex: 2,
    explanation: 'Since $L\\{\\sin(at)\\} = \\frac{a}{s^2 + a^2}$, taking the inverse of $\\frac{1}{s^2 + a^2}$ yields $\\frac{1}{a}\\sin(at)$. For $a=3$, it is $\\frac{1}{3}\\sin 3t$.'
  },
  {
    questionText: 'In the Fourier series expansion of a symmetrical odd function, which coefficient is guaranteed to be zero?',
    options: ['$a_0$ and $a_n$', '$b_n$', 'Only $a_0$', 'No coefficients are zero'],
    correctOptionIndex: 0,
    explanation: 'Odd functions have only sine components in their Fourier series. Therefore, both $a_0$ and the cosine coefficients $a_n$ are completely zero.'
  },
  {
    questionText: 'According to De Moivre\'s theorem, the expression $(\\cos \\theta + i \\sin \\theta)^n$ is equal to:',
    options: ['$\\cos^n \\theta + i \\sin^n \\theta$', '$\\cos(n\\theta) + i \\sin(n\\theta)$', '$\\cos(n\\theta) - i \\sin(n\\theta)$', '$n(\\cos \\theta + i \\sin \\theta)$'],
    correctOptionIndex: 1,
    explanation: 'De Moivre\'s theorem states $(\\cos \\theta + i \\sin \\theta)^n = \\cos(n\\theta) + i \\sin(n\\theta)$ for any real or complex integer exponent $n$.'
  },
  {
    questionText: 'For Rolle\'s Theorem to hold true for a function $f(x)$ on an interval $[a, b]$, what is the necessary condition regarding the endpoints?',
    options: ['$f(a) = f(b) = 0$', '$f(a) \\neq f(b)$', '$f(a) = f(b)$', '$f\'(a) = f\'(b)$'],
    correctOptionIndex: 2,
    explanation: 'Rolle\'s Theorem requires $f(x)$ to be continuous on $[a,b]$, differentiable on $(a,b)$, and have equal values at the boundaries: $f(a) = f(b)$.'
  },
  {
    questionText: 'Find the angle of intersection between the curves $y = x^2$ and $x = y^2$ at the origin $(0,0)$:',
    options: ['0° (Tangent)', '45°', '90° (Orthogonal)', '60°'],
    correctOptionIndex: 2,
    explanation: 'At origin, the slope of $y=x^2$ is $dy/dx = 2x = 0$ (horizontal tangent). The slope of $y = \\sqrt{x}$ is vertical. Hence they intersect at 90°.'
  },
  {
    questionText: 'The equations of the normal to the circle $x^2 + y^2 = 25$ at any point on its circumference always pass through:',
    options: ['Origin (0,0)', '(5,5)', '(3,4)', '(0,5)'],
    correctOptionIndex: 0,
    explanation: 'By geometry properties of circles, any line normal to the circle circumference is a radial line, and therefore must pass through the circle center, which is the origin (0,0).'
  },
  {
    questionText: 'Find the standard equation of the parabola with vertex at the origin and focus located at coordinate points $(2, 0)$:',
    options: ['$y^2 = 8x$', '$y^2 = 2x$', '$x^2 = 8y$', '$y^2 = 4x$'],
    correctOptionIndex: 0,
    explanation: 'For a right-opening parabola $y^2 = 4ax$ with focus at $(a,0)$. Here $a=2 \\implies y^2 = 4(2)x = 8x$.'
  },
  {
    questionText: 'Find the general solution of the differential equation $\\frac{dy}{dx} = e^{x-y}$:',
    options: ['$e^y = e^x + C$', '$e^{-y} = e^x + C$', '$e^y = -e^x + C$', '$y = x + C$'],
    correctOptionIndex: 0,
    explanation: 'Separate variables: $e^y \\, dy = e^x \\, dx$. Integrating both sides yields $e^y = e^x + C$.'
  },
  {
    questionText: 'Find the sum of roots of the quadratic algebraic equation $x^2 - 5x + 6 = 0$:',
    options: ['5', '6', '-5', '-6'],
    correctOptionIndex: 0,
    explanation: 'For a quadratic equation $ax^2 + bx + c = 0$, the sum of roots is $-b/a$. For $x^2-5x+6=0$, sum is $-(-5)/1 = 5$.'
  },
  {
    questionText: 'Find the Laplace Transform of damped cosine: $L\\{e^{-2t} \\cos 3t\\}$:',
    options: ['$\\frac{s+2}{(s+2)^2 + 9}$', '$\\frac{3}{(s+2)^2+9}$', '$\\frac{s}{(s-2)^2+9}$', '$\\frac{s-2}{(s-2)^2+3}$'],
    correctOptionIndex: 0,
    explanation: 'Using frequency shift, $L\\{e^{-at}\\cos wt\\} = \\frac{s+a}{(s+a)^2+w^2}$. Here $a=2, w=3$, yielding $\\frac{s+2}{(s+2)^2+9}$.'
  },
  {
    questionText: 'Evaluate the infinite limit of polynomial ratio $\\lim_{x \\to \\infty} \\frac{2x^2 + 5}{3x^2 - 1}$:',
    options: ['0', '2/3', '5/-1', '$\\infty$'],
    correctOptionIndex: 1,
    explanation: 'Divide both terms by $x^2$: $\\lim_{x \\to \\infty} \\frac{2 + 5/x^2}{3 - 1/x^2} = \\frac{2+0}{3-0} = 2/3$.'
  },
  {
    questionText: 'Evaluate the definite integral $\\int_{0}^{1} x e^x \\, dx$:',
    options: ['1', 'e - 1', '1/2', 'e'],
    correctOptionIndex: 0,
    explanation: 'Using integration by parts: $\\int x e^x \\, dx = x e^x - e^x$. Evaluating from 0 to 1 gives $(1e^1 - e^1) - (0e^0 - e^0) = 0 - (-1) = 1$.'
  }
];

// ==========================================
// 2. PHYSICS (25 Distinct Questions)
// ==========================================
export const physicsRawQuestions: Omit<Question, 'id' | 'questionNumber' | 'section'>[] = [
  {
    questionText: 'If a force $\\vec{F} = 2\\hat{i} + 3\\hat{j} + 7\\hat{k}$ Newtons acts on an object and causes a displacement of $\\vec{S} = 2\\hat{i} + 3\\hat{j} + 5\\hat{k}$ meters, then what is the total work done on the object?',
    options: ['30 Nm', '40 Nm', '48 Nm', '25 Nm'],
    correctOptionIndex: 2,
    explanation: 'Work done is the scalar dot product of force and displacement vectors:\n$W = \\vec{F} \\cdot \\vec{S} = (2 \\times 2) + (3 \\times 3) + (7 \\times 5) = 4 + 9 + 35 = 48\\text{ Joules (or Nm)}$.'
  },
  {
    questionText: 'Throughout the flight/trajectory of a standard projectile launching from level ground under constant gravity (neglecting air resistance):',
    options: [
      'The horizontal component of velocity is constant',
      'The vertical component of velocity is constant',
      'The horizontal component of velocity decreases',
      'The horizontal component of velocity is zero'
    ],
    correctOptionIndex: 0,
    explanation: 'There is no horizontal force component in ideal projectile motion, meaning $a_x = 0$. Thus, $v_x = u\\cos\\theta$ is constant throughout.'
  },
  {
    questionText: 'Multiple reflections leading to the persistence or prolongation of sound in a large closed auditorium is formally defined as:',
    options: ['beats', 'echo', 'reverberation', 'stationary waves'],
    correctOptionIndex: 2,
    explanation: 'Reverberation refers to the prolongation of sound as it repeatedly reflects off walls and ceilings in an enclosed space before decaying.'
  },
  {
    questionText: 'In a LASER, the term "Population Inversion" scientifically indicates:',
    options: [
      'The number of atoms in the lower energy state is more than the higher energy state',
      'The number of atoms in the higher energy state is more than the lower energy state',
      'The number of atoms in the lower and higher energy states is identical',
      'The number of atoms in the higher energy state is zero'
    ],
    correctOptionIndex: 1,
    explanation: 'Population inversion is a non-equilibrium state in which a higher energy state is artificially more populated than a lower state, enabling stimulated emission.'
  },
  {
    questionText: 'What are the dimensional formula parameters of the Universal Gravitational Constant ($G$)?',
    options: ['$M^{-1} L^3 T^{-2}$', '$M^1 L^2 T^{-2}$', '$M^{-2} L^3 T^{-1}$', '$M^{-1} L^1 T^{-2}$'],
    correctOptionIndex: 0,
    explanation: 'From Force equation: $F = \\frac{G m_1 m_2}{r^2} \\implies G = \\frac{F r^2}{m^1 m^2} = \\frac{[M L T^{-2}][L^2]}{[M^2]} = [M^{-1} L^3 T^{-2}]$.'
  },
  {
    questionText: 'Find the angle between two vector quantities $\\vec{P} = 3\\hat{i} + 4\\hat{j}$ and $\\vec{Q} = 4\\hat{i} - 3\\hat{j}$:',
    options: ['0°', '45°', '90° (Orthogonal)', '180°'],
    correctOptionIndex: 2,
    explanation: 'Dot product $\\vec{P} \\cdot \\vec{Q} = (3)(4) + (4)(-3) = 12 - 12 = 0$. Since the dot product is 0, the angle between the vectors is exactly 90°.'
  },
  {
    questionText: 'Determine the ratio of maximum heights of two projectiles fired with equal velocity, but at complimentary angles of 30° and 60°:',
    options: ['1:3', '3:1', '1:2', '1:\\sqrt{3}'],
    correctOptionIndex: 0,
    explanation: 'Maximum height $H = \\frac{u^2 \\sin^2 \\theta}{2g}$. Therefore, $\\frac{H_1}{H_2} = \\frac{\\sin^2(30^{\\circ})}{\\sin^2(60^{\\circ})} = \\frac{(1/2)^2}{(\\sqrt{3}/2)^2} = \\frac{1/4}{3/4} = \\frac{1}{3}$.'
  },
  {
    questionText: 'What represents the relationship between the angle of friction $\\theta$ and the coefficient of static friction $\\mu$?',
    options: ['$\\mu = \\sin\\theta$', '$\\mu = \\cos\\theta$', '$\\mu = \\tan\\theta$', '$\\mu = \\cot\\theta$'],
    correctOptionIndex: 2,
    explanation: 'Within equilibrium statics, the coefficient of static friction $\\mu$ is equal to the tangent of the limiting angle of friction: $\\mu = \\tan \\theta$.'
  },
  {
    questionText: 'What is the expression for the centripetal acceleration of an object of mass $m$ executing uniform circular motion of radius $r$ with speed $v$?',
    options: ['$v^2 / r$', '$v / r^2$', '$mv^2 / r$', '$v^2 r$'],
    correctOptionIndex: 0,
    explanation: 'Centripetal acceleration is independent of mass and given strictly by $a_c = v^2/r$ directed inward toward the center.'
  },
  {
    questionText: 'How is the kinetic energy of a body affected if its mass is doubled ($2m$) and its speed is halved ($v/2$)?',
    options: ['Remains the same', 'Is doubled', 'Is halved', 'Reduced to one-fourth'],
    correctOptionIndex: 2,
    explanation: 'Initial $KE_1 = \\frac{1}{2} m v^2$. New $KE_2 = \\frac{1}{2} (2m) (v/2)^2 = \\frac{1}{2} (2m) (v^2/4) = \\frac{1}{2} (KE_1)$. Thus, the kinetic energy is halved.'
  },
  {
    questionText: 'What is the approximate Escape Velocity of an object launched from the surface of Earth?',
    options: ['11.2 km/s', '9.8 km/s', '7.9 km/s', '11.2 m/s'],
    correctOptionIndex: 0,
    explanation: 'The escape velocity for Earth is calculated as $v_e = \\sqrt{2gR_e} \\approx 11.2\\text{ km/sec}$.'
  },
  {
    questionText: 'The rising of water inside a capillary tube is primarily caused by which of the physical forces?',
    options: ['Cohesive forces', 'Viscosity', 'Surface Tension', 'Ocean tides'],
    correctOptionIndex: 2,
    explanation: 'Capillary rise is a direct manifestation of surface tension combined with adhesive forces between the liquid and tube surface.'
  },
  {
    questionText: 'With an increase in temperature, what is the impact on the viscosity of liquids and gases?',
    options: [
      'Viscosity of both liquids and gases decreases',
      'Viscosity of both liquids and gases increases',
      'Viscosity of liquids decreases while that of gases increases',
      'Viscosity of liquids increases while that of gases decreases'
    ],
    correctOptionIndex: 2,
    explanation: 'Liquids become less viscous with heat due to weakened cohesive forces, whereas gases become more viscous due to increased molecular collisions.'
  },
  {
    questionText: 'In Simple Harmonic Motion (SHM), what is the phase difference between the displacement and the velocity of the particle?',
    options: ['0', '90° ($\\pi/2$ radians)', '180° ($\\pi$ radians)', '45°'],
    correctOptionIndex: 1,
    explanation: 'If displacement is $x = A\\sin(\\omega t)$, then velocity is $v = A\\omega\\cos(\\omega t) = A\\omega\\sin(\\omega t + \\pi/2)$. Thus phase difference is $\\pi/2$ (90°).'
  },
  {
    questionText: 'Under what physical condition does acoustic resonance occur during forced sound vibrations?',
    options: [
      'Applied frequency matches natural frequency of coordinates',
      'Applied frequency is double the natural frequency',
      'Applied frequency is zero',
      'No relationship with frequency'
    ],
    correctOptionIndex: 0,
    explanation: 'Resonance is the condition when the frequency of the external driver matches the natural frequency of the vibrating system, resulting in max amplitude.'
  },
  {
    questionText: 'Which law mathematically expresses that the product of the pressure and volume of a gas is constant under constant temperature?',
    options: ['Charle\'s Law', 'Boyle\'s Law', 'Gay-Lussac\'s Law', 'Reynold\'s Law'],
    correctOptionIndex: 1,
    explanation: 'Boyle\'s Law states that for a fixed mass of gas at constant temperature, pressure is inversely proportional to volume: $PV = \\text{constant}$.'
  },
  {
    questionText: 'Which thermodynamic equation correctly outlines the First Law of Thermodynamics?',
    options: ['$dQ = dU + dW$', '$dQ = dU - dW$', '$dU = dQ + dW$', '$dW = dQ + dU$'],
    correctOptionIndex: 0,
    explanation: 'The law of conservation of energy states that heat supplied to a system ($dQ$) is equal to change in internal energy ($dU$) plus work done ($dW$).'
  },
  {
    questionText: 'Convert temperature value -40° Celsius into its Fahrenheit equivalent value:',
    options: ['-40°F', '0°F', '32°F', '-50°F'],
    correctOptionIndex: 0,
    explanation: 'Using conversion formula: $F = \\frac{9}{5}C + 32$. For $C = -40$, we get $F = \\frac{9}{5}(-40) + 32 = -72+32 = -40^{\\circ}F$.'
  },
  {
    questionText: 'As temperature of a gas increases, the velocity of sound in it undergoes what change?',
    options: ['Decreases', 'Increases', 'Remains the same', 'Becomes zero'],
    correctOptionIndex: 1,
    explanation: 'The speed of sound in an ideal gas is directly proportional to the square root of its absolute temperature: $v = \\sqrt{\\frac{\\gamma RT}{M}}$.'
  },
  {
    questionText: 'What refers to the scientific phenomenon where sound frequency registers a shifted delta pitch due to relative motion of the source or observer?',
    options: ['Refraction', 'Doppler Effect', 'Interference', 'Diffraction'],
    correctOptionIndex: 1,
    explanation: 'The Doppler Effect describes changes in observed wave frequencies caused by relative movement between emitting sources and receivers.'
  },
  {
    questionText: 'In Einstein\'s photoelectric effect, no photoelectrons are emitted from a metal surface if the incident light frequency is below a minimum:',
    options: ['Critical frequency', 'Resonance frequency', 'Threshold frequency', 'Schumann frequency'],
    correctOptionIndex: 2,
    explanation: 'Threshold frequency ($f_0$) is the minimum frequency of light required to liberate electrons from a specific metal surface.'
  },
  {
    questionText: 'Superconductors exhibit complete expulsion of magnetic flux fields from their interior when cooled below key critical transition temperatures. This is:',
    options: ['Hall Effect', 'Meissner Effect', 'Seebeck Effect', 'Joule effect'],
    correctOptionIndex: 1,
    explanation: 'The Meissner Effect refers to the expulsion of a magnetic field from a superconductor during its transition to the superconducting state.'
  },
  {
    questionText: 'To ensure light matches requirements for Total Internal Reflection (TIR) inside fiber optic cables, the core and cladding must satisfy:',
    options: [
      'Refractive index of core is greater than cladding',
      'Refractive index of cladding is greater than core',
      'Refractive indices must be identical',
      'Fibers do not depend on indices'
    ],
    correctOptionIndex: 0,
    explanation: 'Total internal reflection occurs only when light is traveling from a denser medium (higher refractive index) to a rarer medium. Hence, $\\mu_{\\text{core}} > \\mu_{\\text{clad}}$.'
  },
  {
    questionText: 'Sound waves with frequencies strictly greater than 20,000 Hz are classified as:',
    options: ['Infrasonic', 'Audible', 'Ultrasonic', 'Supersonic'],
    correctOptionIndex: 2,
    explanation: 'The human auditory range is 20 Hz to 20,000 Hz. Waves with frequencies above 20 kHz are called ultrasonic.'
  },
  {
    questionText: 'Hooke\'s Law states that within the elastic limit of a material, stress is:',
    options: [
      'Inversely proportional to strain',
      'Directly proportional to strain',
      'Equal to square of strain',
      'Independent of strain'
    ],
    correctOptionIndex: 1,
    explanation: 'Under Hooke\'s law, within small limits, the ratio of stress to strain is constant; thus stress is directly proportional to strain.'
  }
];

// ==========================================
// 3. CHEMISTRY (25 Distinct Questions)
// ==========================================
export const chemistryRawQuestions: Omit<Question, 'id' | 'questionNumber' | 'section'>[] = [
  {
    questionText: 'According to the Aufbau principle, which of the following atomic orbitals is filled immediately after the 3p orbital?',
    options: ['3d', '4s', '4p', '4d'],
    correctOptionIndex: 1,
    explanation: 'Based on $(n+l)$ energy level combinations, 3p ($3+1=4$) has a lower quantum number level than 3d ($3+2=5$). Hence, 4s ($4+0=4$) is filled right after 3p.'
  },
  {
    questionText: 'During the chemical reaction $2\\text{Mg(s)} + \\text{O}_2\\text{(g)} \\to 2\\text{MgO(s)}$, the oxidation state of magnesium undergoes a change from:',
    options: ['0 to +2', '0 to -2', '+2 to -1', '+2 to 0'],
    correctOptionIndex: 0,
    explanation: 'Magnesium starts as an uncombined pure metal with oxidation number 0. In ionic MgO it becomes a cation $\\text{Mg}^{2+}$, giving it an oxidation state of +2.'
  },
  {
    questionText: 'A chemical solution that shows the unique property of resisting any changes in its pH values upon addition of small amounts of a strong acid or small amounts of a strong base is structurally defined as:',
    options: ['Isotonic solution', 'Colloidal solution', 'Neutral solution', 'Buffer solution'],
    correctOptionIndex: 3,
    explanation: 'A Buffer solution (usually a weak acid and its conjugate salt) functions to resist pH additions by neutralizing added hydronium/hydroxide ions.'
  },
  {
    questionText: 'Identify the common thermosetting polymer from the options which is synthesized via a step-growth polymerization reaction of phenol and formaldehyde:',
    options: ['Bakelite', 'LDPE', 'Polystyrene', 'PVC'],
    correctOptionIndex: 0,
    explanation: 'Bakelite is a heavily cross-linked thermosetting resin formed through step-growth condensation reaction between phenol and formaldehyde molecules.'
  },
  {
    questionText: 'What is defined by the principal quantum number $n$ in atomic electronic structures?',
    options: [
      'The shape of the subshell orbital',
      'The main size and energy level of the shell',
      'The direct spatial orientation of the orbital',
      'The spin of the electron'
    ],
    correctOptionIndex: 1,
    explanation: 'The principal quantum number $n$ identifies the major shell, determining its average distance/size from nucleus and its corresponding energy levels.'
  },
  {
    questionText: 'Which hybridization and molecular geometry corresponds to the oxygen atom in a water molecule ($H_2O$)?',
    options: [
      '$sp^2$ and triangular planar',
      '$sp^3$ and bent / angular shape',
      '$sp$ and linear',
      '$sp^3d$ and octahedral'
    ],
    correctOptionIndex: 1,
    explanation: 'The oxygen in a water molecule has 2 bonding pairs and 2 lone pairs (4 electron groups). It is $sp^3$ hybridized, but lone-pair repulsions reduce the shape to bent (angular).'
  },
  {
    questionText: 'How is the electrical concentration molarity (M) defined in chemical solutions?',
    options: [
      'Moles of solute dissolved in 1 kg of solvent',
      'Moles of solute dissolved in 1 Liter of solution',
      'Grams of solute in 100 grams of solution',
      'Equivalents of solute in 1 Liter of solution'
    ],
    correctOptionIndex: 1,
    explanation: 'Molarity is defined as the number of moles of solute dissolved per 1 liter volume of the final solution. (Note: molality uses kg of solvent).'
  },
  {
    questionText: 'According to the Bronsted-Lowry acid-base theory, an acid is defined as a substance that is a(n):',
    options: ['Electron pair acceptor', 'Proton ($H^+$) donor', 'Hydroxide ($OH^-$) donor', 'Proton accepter'],
    correctOptionIndex: 1,
    explanation: 'Bronsted-Lowry defines acids as proton ($H^+$) donors, whereas bases are defined as proton acceptors.'
  },
  {
    questionText: 'Temporary hardness of water is caused by the presence of dissolved bicarbonates of which metals?',
    options: ['Sodium and Potassium', 'Calcium and Magnesium', 'Copper and Iron', 'Aluminium and Zinc'],
    correctOptionIndex: 1,
    explanation: 'Temporary hardness of water is caused by dissolved calcium bicarbonate $\\text{Ca(HCO}_3)_2$ and magnesium bicarbonate $\\text{Mg(HCO}_3)_2$.'
  },
  {
    questionText: 'In the complexometric titration of hard water to calculate total calcium/magnesium content using EDTA, which pH indicator is used?',
    options: ['Methyl Orange', 'Phenolphthalein', 'Eriochrome Black-T (EBT)', 'Litmus paper'],
    correctOptionIndex: 2,
    explanation: 'EBT is a specialized metal ion indicator that forms a wine-red complex with calcium/magnesium, turning blue when EDTA binds all free metal.'
  },
  {
    questionText: 'The Nalgonda technique, used for the defluoridation of drinking water supplies, utilizes which combination of chemicals?',
    options: [
      'Alum, Lime (CaO), and Bleaching Powder',
      'Sodium Chloride and Alum',
      'Zeolite and Chlorine',
      'Copper Sulphate and Ozone'
    ],
    correctOptionIndex: 0,
    explanation: 'The Nalgonda treatment uses successive additions of Alum (flocculant), Lime (pH control), and Bleaching powder (disinfectant) to precipitate fluorides.'
  },
  {
    questionText: 'What is the mathematical equation representing Faraday\'s First Law of Electrolysis?',
    options: ['$W = z \\cdot I \\cdot t$', '$W = z / (I \\cdot t)$', '$W = I \\cdot t$', '$W = z \\cdot E$'],
    correctOptionIndex: 0,
    explanation: 'Faraday\'s First Law states mass deposited ($W$) is proportional to charge ($Q=It$). Hence $W = z \\cdot I \\cdot t$ where $z$ is the electrochemical equivalent.'
  },
  {
    questionText: 'In sacrificial anode cathodic protection systems, which highly active metal is used to protect underground steel pipes from corrosion?',
    options: ['Copper', 'Zinc or Magnesium', 'Silver', 'Lead'],
    correctOptionIndex: 1,
    explanation: 'Metals with a more negative reduction potential than iron (such as Zinc and Magnesium) oxidize preferentially, sacrificing themselves to protect steel.'
  },
  {
    questionText: 'What is the primary combustible composition of "Water Gas"?',
    options: [
      '$CO$ and $H_2$',
      '$CH_4$ and $CO_2$',
      '$CO$ and $N_2$ (Producer gas)',
      '$H_2$ and $O_2$'
    ],
    correctOptionIndex: 0,
    explanation: 'Water gas is a synthesized fuel mixture consisting primarily of Carbon Monoxide ($CO$) and Hydrogen gas ($H_2$), made by passing steam over hot coke.'
  },
  {
    questionText: 'Which class of polymers can be repeatedly softened by heating and hardened by cooling without structural degradation?',
    options: ['Thermosetting polymers', 'Thermoplastic polymers', 'Fibers', 'Elastomers'],
    correctOptionIndex: 1,
    explanation: 'Thermoplastics (like PVC and Polyethylene) have linear/branched structures with weak intermolecular forces that can be melted and reshaped repeatedly.'
  },
  {
    questionText: 'What is the name of the central monomer unit from which natural rubber is derived?',
    options: ['Isoprene (2-methyl-1,3-butadiene)', 'Styrene', 'Vinyl Chloride', 'Ethylene'],
    correctOptionIndex: 0,
    explanation: 'Natural rubber is a direct polymer of isoprene units, specifically cis-1,4-polyisoprene.'
  },
  {
    questionText: 'Which gas is scientifically identified as the single largest contributor to the greenhouse effect and global warming?',
    options: ['Oxygen', 'Carbon Dioxide ($CO_2$)', 'Nitrogen', 'Helium'],
    correctOptionIndex: 1,
    explanation: 'Among standard ambient gases, Carbon Dioxide ($CO_2$) absorbs the highest volume of outgoing thermal infrared radiation, trapping heat.'
  },
  {
    questionText: 'Acid rain is primarily caused by atmospheric chemical reactions involving emissions of which pollutants?',
    options: [
      'Carbon monoxide and Helium',
      'Sulphur dioxide ($SO_2$) and Nitrogen oxides ($NO_x$)',
      'Chlorofluorocarbons (CFCs)',
      'Ozone and Argon'
    ],
    correctOptionIndex: 1,
    explanation: 'Sulphur dioxide and Nitrogen oxides react with water vapor to form sulphuric and nitric acids, which precipitate as acid rain.'
  },
  {
    questionText: 'Which chemical substances are primarily responsible for the continuous destruction of the stratospheric ozone layer?',
    options: ['Chlorofluorocarbons (CFCs)', 'Carbon dioxide', 'Hydrogen gas', 'Methane'],
    correctOptionIndex: 0,
    explanation: 'CFCs release chlorine free radicals under solar UV, which act as catalysts to break down ozone ($O_3$) molecules.'
  },
  {
    questionText: 'What is the primary function of a salt bridge in a galvanic electrochemical cell?',
    options: [
      'To increase the cell voltage',
      'To provide a pathway for electron flow',
      'To maintain electrical neutrality by allowing ion migration',
      'To accelerate the speed of redox reaction'
    ],
    correctOptionIndex: 2,
    explanation: 'The salt bridge allows anions and cations to migrate between half-cells to neutralize accumulating charges, preventing premature current cutoff.'
  },
  {
    questionText: 'How does the thermodynamic efficiency of a hydrogen fuel cell compare to standard thermal combustion engines?',
    options: [
      'Fuel cells are drastically less efficient',
      'Fuel cells are significantly more efficient as they bypass heat/mechanical steps',
      'Their efficiencies are completely identical',
      'Fuel cells have zero efficiency'
    ],
    correctOptionIndex: 1,
    explanation: 'Fuel cells convert chemical energy directly into electrical energy without thermal cycles, easily reaching 60-80% efficiency compared to 30-40% for combustion.'
  },
  {
    questionText: 'Boiler scales are highly dangerous in steam systems because they cause:',
    options: [
      'Excellent heat transfer but poor water pressure',
      'Clogging and overheating due to low thermal conductivity of scale',
      'Accelerated condensation rates',
      'No issues'
    ],
    correctOptionIndex: 1,
    explanation: 'Boiler scale deposits have extremely high insulating properties, forcing boilers to burn excess fuel. This leads to overheating and metal fracture.'
  },
  {
    questionText: 'Which thermodynamic process describes "Reverse Osmosis"?',
    options: [
      'Natural flow of solvent into concentrated solutions',
      'Applying pressure higher than osmotic pressure to force solvent from concentrated to dilute sides through a semipermeable membrane',
      'Dissolution of solutes indefinitely',
      'Evaporation under high pressure'
    ],
    correctOptionIndex: 1,
    explanation: 'By applying mechanical pressure exceeding osmotic limits on a saline solution, pure solvent is forced backward through a membrane, separating it from salt ions.'
  },
  {
    questionText: 'Which element is defined as the default standard reference electrode in electromotive series tables with potential defined as 0.00 V?',
    options: ['Oxygen', 'Standard Hydrogen Electrode (SHE)', 'Copper', 'Platinum'],
    correctOptionIndex: 1,
    explanation: 'The Standard Hydrogen Electrode is the universal benchmark reference against which all other electrode potentials are measured, assigned exactly 0.00 V.'
  },
  {
    questionText: 'Which of the following organic structures represents the polymer commonly referred to as PVC?',
    options: ['Polyethylene', 'Polyvinyl Chloride', 'Polystyrene', 'Polyester'],
    correctOptionIndex: 1,
    explanation: 'PVC stands for Polyvinyl Chloride, synthesized via addition polymerization of vinyl chloride monomers.'
  }
];

// ==========================================
// 4. COMPUTER SCIENCE & ENGINEERING (100 Distinct Questions)
// ==========================================
export const csRawQuestions: Omit<Question, 'id' | 'questionNumber' | 'section'>[] = [
  {
    questionText: 'What is the equivalent decimal integer value for the octal number $(645)_8$?',
    options: ['(450)10', '(451)10', '(421)10', '(501)10'],
    correctOptionIndex: 2,
    explanation: 'To convert to decimal: $6 \\times 8^2 + 4 \\times 8^1 + 5 \\times 8^0 = 6 \\times 64 + 4 \\times 8 + 5 = 384 + 32 + 5 = 421$.'
  },
  {
    questionText: 'Find the characteristic state execution equation representing a binary sequential JK flip-flop:',
    options: [
      'Q(n+1) = J Q(n) + \\overline{K} \\overline{Q}(n)',
      'Q(n+1) = J \\overline{Q}(n) + \\overline{K} Q(n)',
      'Q(n+1) = \\overline{J} \\overline{Q}(n) + K Q(n)',
      'Q(n+1) = \\overline{J} Q(n) + \\overline{K} \\overline{Q}(n)'
    ],
    correctOptionIndex: 1,
    explanation: 'By checking behavior properties: holding holds ($J=0, K=0$), setting sets ($J=1, K=0$), resetting resets ($J=0, K=1$), and toggling toggles ($J=1, K=1$). This is modeled by $Q(t+1) = J\\bar{Q} + \\bar{K}Q$.'
  },
  {
    questionText: 'Which CPU addressing mode is most crucial and optimal for writing "Position-Independent Code" (PIC)?',
    options: ['Direct Mode', 'Indirect Mode', 'Relative Mode', 'Indexed Mode'],
    correctOptionIndex: 2,
    explanation: 'Relative addressing uses offsets computed relative to the program counter ($PC$). Since displacements are constant regardless of where the app is loaded in memory, it is ideal for PIC.'
  },
  {
    questionText: 'Which of the following serves as the primary speed-throttling mitigation technique to reduce the speed imbalance between ultra-fast CPU processors and slower main memory access times?',
    options: ['Cycle Stealing', 'Memory Interleaving', 'Reducing the size of memory', 'Demand Paging'],
    correctOptionIndex: 1,
    explanation: 'Memory interleaving splits addresses amongst multiple parallel memory banks, allowing concurrent retrievals and improving memory system speeds.'
  },
  {
    questionText: 'Which of the C-language preprocessor directives is NOT valid and will throw compilation errors?',
    options: ['#include <stdio.h>', '#define MAX 100', '#macro SUM(a, b) (a + b)', '#ifdef DEBUG'],
    correctOptionIndex: 2,
    explanation: 'C preprocessors do not have a `#macro` directive. Macro functions must be defined using the `#define` directive.'
  },
  {
    questionText: 'What is the worst-case time complexity to insert a new node in the middle of a singly linked list containing N elements?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
    correctOptionIndex: 2,
    explanation: 'Although inserting the link itself is $O(1)$, searching/traversing the list to locate the correct target node takes $O(n)$ time.'
  },
  {
    questionText: 'What normalization issue or anomaly does it indicate when a table has non-primary key columns depending on only part of a composite primary key?',
    options: [
      'Partial dependency, indicating a violation of 2NF',
      'Non-atomic values, indicating a violation of 1NF',
      'Transitive dependency, indicating a violation of 3NF',
      'Functional dependency, indicating a violation of 1NF'
    ],
    correctOptionIndex: 0,
    explanation: 'A partial dependency is when a non-key column depends on a subset of a composite primary key. This violates Second Normal Form (2NF).'
  },
  {
    questionText: 'Rank the following memory hardware in descending order (highest speed to slowest speed) of active read/write execution:',
    options: [
      'L1 Cache > L2 Cache > RAM > Hard Disk',
      'L2 Cache > L1 Cache > RAM > Hard Disk',
      'L1 Cache > RAM > L2 Cache > Hard Disk',
      'RAM > L2 Cache > L1 Cache > Hard Disk'
    ],
    correctOptionIndex: 0,
    explanation: 'The memory hierarchy speed ranks L1 Cache (on-die) as fastest, followed by L2 Cache, main system memory (RAM), and non-volatile secondary disks.'
  },
  {
    questionText: 'In Computer Networks, what is the sequence of packets transmitted during a standard TCP connection establishment (3-Way Handshake)?',
    options: [
      'SYN \\rightarrow SYN-ACK \\rightarrow ACK',
      'ACK \\rightarrow SYN-ACK \\rightarrow SYN',
      'SYN-ACK \\rightarrow SYN \\rightarrow ACK',
      'SYN \\rightarrow ACK \\rightarrow SYN-ACK'
    ],
    correctOptionIndex: 0,
    explanation: 'The client sends SYN; the server replies with SYN-ACK; the client sends ACK to complete establishment.'
  },
  {
    questionText: 'What is the maximum number of concurrent processes that can exist to wait in the "Ready" state in an OS running on a machine with "n" CPUs?',
    options: ['Independent of \'n\'', 'n', 'n^2', '2^n'],
    correctOptionIndex: 0,
    explanation: 'The Ready queue maintains all processes ready to run, constrained only by system memory and scheduling limits rather than core CPU counts.'
  },
  {
    questionText: 'A digital multiplexer (MUX) with $N$ select lines can route input from which maximum number of input sources?',
    options: ['$N$', '$2N$', '$2^N$', '$N^2$'],
    correctOptionIndex: 2,
    explanation: 'A multiplexer utilizes $N$ control or select lines to address and switch 1-of-$2^N$ different input pathways into a single output terminal.'
  },
  {
    questionText: 'How many half adders and OR gates are needed to construct a single digital Full Adder circuit?',
    options: ['2 Half Adders and 1 OR gate', '1 Half Adder and 2 OR gates', '2 Half Adders and 2 OR gates', '1 Half Adder and 1 OR gate'],
    correctOptionIndex: 0,
    explanation: 'A full adder is constructed by cascading two Half Adders (one to add inputs, another to add intermediate sum to carry-in) and using 1 OR gate to merge individual carries.'
  },
  {
    questionText: 'Which cache-to-main-memory mapping technique is the most flexible, minimizing collision evictions at the cost of high search-logic hardware complexity?',
    options: ['Direct Mapping', 'Associative Mapping (Fully Associative)', 'Set-Associative Mapping', 'Virtual Mapping'],
    correctOptionIndex: 1,
    explanation: 'Fully associative mapping allows blocks to load anywhere in cache memory, avoiding collision conflicts completely but requiring parallel hardware lookups.'
  },
  {
    questionText: 'The program module executed immediately in response to a hardware or software interrupt is known as standard:',
    options: ['Boot loader', 'Kernel trap handler', 'Interrupt Service Routine (ISR)', 'System BIOS Call'],
    correctOptionIndex: 2,
    explanation: 'An ISR (Interrupt Service Routine) is a dedicated sub-program mapped via an interrupt vector table to immediately resolve incoming interrupts.'
  },
  {
    questionText: 'What is the minimum number of select lines required to build a 16-to-1 data multiplexer?',
    options: ['2 select lines', '4 select lines', '8 select lines', '16 select lines'],
    correctOptionIndex: 1,
    explanation: 'Since $2^S = I$, to address $16$ inputs we solve $2^S = 16 \\implies S = 4$ select lines.'
  },
  {
    questionText: 'What is the standard binary base-2 representation of fractional decimal number $0.625$?',
    options: ['$(0.101)_2$', '$(0.110)_2$', '$(0.011)_2$', '$(0.111)_2$'],
    correctOptionIndex: 0,
    explanation: '$0.625 = 1/2 + 0/4 + 1/8 = 2^{-1} \\times 1 + 2^{-2} \\times 0 + 2^{-3} \\times 1 = (0.101)_2$.'
  },
  {
    questionText: 'According to DeMorgan\'s theorems in Boolean Algebra, the complement expression $\\overline{A + B}$ is equivalent to:',
    options: ['$\\overline{A} + \\overline{B}$', '$\\overline{A} \\cdot \\overline{B}$', '$A \\cdot B$', '$\\overline{\\overline{A} \\cdot \\overline{B}}$'],
    correctOptionIndex: 1,
    explanation: 'DeMorgan\'s law establishes that the complement of a sum is equal to the product of complements: $\\overline{A+B} = \\overline{A} \\cdot \\overline{B}$.'
  },
  {
    questionText: 'In C programming, if `ptr` is an integer pointer pointing to an element in an array, what does the expression `*ptr++` do?',
    options: [
      'Increments the value pointed to, then increments the pointer',
      'Dereferences the current pointer location, then increments the pointer itself',
      'Increments the pointer first, then dereferences it',
      'Dereferences the incremented value'
    ],
    correctOptionIndex: 1,
    explanation: 'Due to operator precedence, postfix `++` takes precedence over prefix `*` but evaluates after. So it returns the current value `*ptr` then increments `ptr`.'
  },
  {
    questionText: 'Which C storage class modifier is used to declare a variable that is shared across multiple translation files?',
    options: ['static', 'register', 'auto', 'extern'],
    correctOptionIndex: 3,
    explanation: 'The `extern` storage class extends visibility across different C compilation units/files, linking with definitions established elsewhere.'
  },
  {
    questionText: 'In Object-Oriented programming, what mechanism allows a subclass to define a fresh custom implementation for an inherited parent method?',
    options: ['Method Overloading', 'Method Overriding', 'Polymorphic Encapsulation', 'Dynamic Casting'],
    correctOptionIndex: 1,
    explanation: 'Method Overriding is when a child class implements an identical method signature as its parent to support runtime dispatch/dynamic polymorphism.'
  },
  {
    questionText: 'Which Java keyword is utilized to prevent a class definition from being inherited by subclasses?',
    options: ['static', 'struct', 'final', 'sealed'],
    correctOptionIndex: 2,
    explanation: 'Declaring a class as `final` in Java prevents compilation of any subclasses, locking inheritance access.'
  },
  {
    questionText: 'What represents the key distinction between Interfaces vs Abstract Classes in object-oriented structures?',
    options: [
      'Interfaces only support public constants and abstract method templates (no general instance variables)',
      'Abstract classes cannot have concrete methods',
      'Interfaces can be instantiated directly using new',
      'There is no difference'
    ],
    correctOptionIndex: 0,
    explanation: 'Interfaces focus purely on behavioral contracts (supporting multiple implementations), while abstract classes capture parent hierarchies and instance variables.'
  },
  {
    questionText: 'A digital data structure operating strictly on LIFO (Last In First Out) queue properties is a:',
    options: ['Queue', 'Linked List', 'Stack', 'Circular Buffer'],
    correctOptionIndex: 2,
    explanation: 'A Stack restricts entry/retrievals to a single end (TOP), establishing a Last-In, First-Out sequence.'
  },
  {
    questionText: 'Which data structure is naturally utilized to implement Breadth-First Searches (BFS) on graphs?',
    options: ['Stack', 'Priority Queue', 'Hashing Map', 'Queue'],
    correctOptionIndex: 3,
    explanation: 'BFS explores neighbor levels systematically, requiring a FIFO Queue to track outstanding vertex visitations.'
  },
  {
    questionText: 'What is the average time complexity of performing a Binary Search operation on a sorted array of $N$ elements?',
    options: ['$O(1)$', '$O(\\log N)$', '$O(N)$', '$O(N \\log N)$'],
    correctOptionIndex: 1,
    explanation: 'Binary search continuously splits search intervals in half, leading to a recurrence $T(N) = T(N/2) + c$ which evaluates to $O(\\log N)$.'
  },
  {
    questionText: 'A depth-first In-Order traversal conducted over a valid Binary Search Tree (BST) will output node values in what sorted state?',
    options: ['Random order', 'Strictly ascending order', 'Strictly descending order', 'Level-by-level sequence'],
    correctOptionIndex: 1,
    explanation: 'Since BST properties assert left children < root < right children, traversing (Left, Root, Right) always outputs values in ascending order.'
  },
  {
    questionText: 'What is the worst-case sorting time complexity of the QuickSort algorithm?',
    options: ['$O(N \\log N)$', '$O(N^2)$', '$O(2^N)$', '$O(N \\log^2 N)$'],
    correctOptionIndex: 1,
    explanation: 'If pivot selection is poor (e.g. sorted arrays using first elements), intervals partition into $N-1$ and $0$, causing $O(N^2)$ complexity.'
  },
  {
    questionText: 'Which algorithmic paradigm describes Prim\'s and Kruskal\'s techniques for finding a Minimum Spanning Tree (MST)?',
    options: ['Dynamic Programming', 'Divide and Conquer', 'Greedy Method', 'Brute Force Search'],
    correctOptionIndex: 2,
    explanation: 'Both Prim\'s and Kruskal\'s make locally optimal selections (lowest weight edges) at each step to construct global trees, embodying greedy behavior.'
  },
  {
    questionText: 'What is the space complexity to represent a graph of $V$ vertices and $E$ edges via an Adjacency Matrix?',
    options: ['$O(V + E)$', '$O(VE)$', '$O(V^2)$', '$O(E^2)$'],
    correctOptionIndex: 2,
    explanation: 'An adjacency matrix is a $V \\times V$ grid representing all vertex pair states, requiring exactly $O(V^2)$ storage slots.'
  },
  {
    questionText: 'In Operating Systems, chronic virtual memory swap-paging resulting in system slowdowns is called:',
    options: ['Fragmentation', 'Thrashing', 'Deadlock hanging', 'Context switching overhead'],
    correctOptionIndex: 1,
    explanation: 'Thrashing occurs when the system spends more time executing page-in/page-out routines than making real processing progress.'
  },
  {
    questionText: 'The primary purpose of Banker\'s algorithm inside operating systems is for deadlock:',
    options: ['Prevention', 'Detection', 'Avoidance', 'Recovery'],
    correctOptionIndex: 2,
    explanation: 'Banker\'s algorithm dynamically checks resource allocation requests against safety rules to simulate execution, avoiding deadlock states.'
  },
  {
    questionText: 'A page fault condition occurs within process execution when:',
    options: [
      'The CPU tries to access a page that is not currently mapped into physical RAM',
      'The page has corrupted code structures',
      'Two processes edit a page concurrently',
      'A page is overwritten'
    ],
    correctOptionIndex: 0,
    explanation: 'When referenced page table entries show "absent" (invalid bit), page translation misses trigger a page-fault trap to fetch block from secondary store.'
  },
  {
    questionText: 'Which strange anomaly represents a scenario where adding physical RAM page frames leads to a paradoxical increase in page faults under FIFO page replacement?',
    options: ['Belady\'s Anomaly', 'Dijkstra\'s Anomaly', 'Coffman Anomaly', 'Peterson\'s Anomaly'],
    correctOptionIndex: 0,
    explanation: 'Belady\'s anomaly occurs under FIFO schemes where certain access sequences produce worse results as memory allocations expand.'
  },
  {
    questionText: 'Which of the following is NOT of the three standard criteria to resolve Operating System critical section synchronization problems?',
    options: ['Mutual Exclusion', 'Progress', 'Bounded Waiting', 'Pre-emption priority'],
    correctOptionIndex: 3,
    explanation: 'Synchronized systems require Mutual Exclusion, Progress, and Bounded Waiting to resolve critical sections correctly. Priority Pre-emption is a scheduling design choice.'
  },
  {
    questionText: 'In relational database structures, how does a Primary Key constraint differ from a Unique Key constraint?',
    options: [
      'Unique keys can have multiple values, primary keys cannot',
      'Primary keys cannot contain NULL values, whereas a Unique key column may permit NULL values',
      'There is no functional index difference',
      'Unique keys must be numeric'
    ],
    correctOptionIndex: 1,
    explanation: 'A database table can hold only one Primary Key which strictly demands non-NULL records. Unique Keys allow unique entries but accept NULL values.'
  },
  {
    questionText: 'Which SQL keyword guarantees referential integrity between columns of separate database tables?',
    options: ['PRIMARY KEY', 'UNIQUE', 'FOREIGN KEY', 'CHECK CONSTRUCT'],
    correctOptionIndex: 2,
    explanation: 'FOREIGN KEY coordinates matching values between child and parent tables, preventing orphaned entries.'
  },
  {
    questionText: 'How rank B-Trees vs Hashing Indexes for range search SQL queries?',
    options: [
      'Hashing indexes are superior, B-trees cannot do range queries',
      'B-trees are highly optimal for range lookups because they maintain keys in sorted order, while Hashing only supports point checks',
      'They perform identically',
      'B-trees are slower'
    ],
    correctOptionIndex: 1,
    explanation: 'B-tree designs maintain node keys sequentially, allowing logarithmic range scanning, whereas hash indices distribute values pseudo-randomly.'
  },
  {
    questionText: 'The "Durability" trait within database ACID properties states that transaction updates must:',
    options: [
      'Be fully completed or fully undone',
      'Maintain database consistency constraints',
      'Persist permanently on secondary media even in cases of power failure or crash',
      'Remain safe from secondary transactions'
    ],
    correctOptionIndex: 2,
    explanation: 'Durability mandates that once a transaction commits, its modifications are flushed to non-volatile stores to survive system failures.'
  },
  {
    questionText: 'Which standard networking component functions strictly at the Network Layer (Layer 3) of the OSI model?',
    options: ['Hub', 'Switch', 'Repeater', 'Router'],
    correctOptionIndex: 3,
    explanation: 'Routers parse Layer 3 IP headers to forward packets across subnet boundaries, whereas hubs/repeaters work at Layer 1.'
  },
  {
    questionText: 'What is the default subnet class and mask for the IPv4 Address 10.154.21.3?',
    options: ['Class A, $255.0.0.0$', 'Class B, $255.255.0.0$', 'Class C, $255.255.255.0$', 'Class D, $240.0.0.0$'],
    correctOptionIndex: 0,
    explanation: 'First octet "10" is in range 1-126. This belongs to Class A which uses a 255.0.0.0 subnet mask.'
  },
  {
    questionText: 'Compare the address bit sizes of IPv4 vs IPv6 structures:',
    options: ['32 bits vs 128 bits', '64 bits vs 128 bits', '32 bits vs 64 bits', '16 bits vs 128 bits'],
    correctOptionIndex: 0,
    explanation: 'IPv4 uses 32-bit (4-byte) addresses, whereas modern IPv6 maps 128-bit (16-byte) system addresses.'
  },
  {
    questionText: 'What represents the core networking task mapped to the Domain Name System (DNS)?',
    options: [
      'Encrypt packet payload data',
      'Translate human-readable domain names to machine IP addresses',
      'Establish routing pathways',
      'Assign DHCP leases'
    ],
    correctOptionIndex: 1,
    explanation: 'DNS serves as the internet directory, resolving domain queries (like google.com) into numerical IP addresses.'
  },
  {
    questionText: 'Compare the capabilities and operational behaviors of TCP vs UDP packets:',
    options: [
      'TCP is connection-oriented and reliable, while UDP is connectionless and lightweight',
      'UDP is connection-oriented and TCP is connectionless',
      'They perform identically',
      'UDP has error retransmission mechanisms'
    ],
    correctOptionIndex: 0,
    explanation: 'TCP uses positive acknowledgments and retries to secure error-free connection streams. UDP drops packets without confirmation, trading reliability for speed.'
  },
  {
    questionText: 'What is the standard MAC Address length in bits?',
    options: ['32 bits', '48 bits', '64 bits', '128 bits'],
    correctOptionIndex: 1,
    explanation: 'A MAC physical address is a 48-bit (6-byte) value hardware-burned into network interface controllers.'
  },
  {
    questionText: 'The HTTP response status code "401 Unauthorized" scientifically represents:',
    options: [
      'The requested page is missing from the server',
      'The server is offline with a database error',
      'The client request requires credentials or has failed authentication',
      'Success'
    ],
    correctOptionIndex: 2,
    explanation: 'A 401 code confirms authorization is required. (A 404 represents missing pages, 403 represents Forbidden, and 500 represents server errors).'
  },
  {
    questionText: 'Which component is responsible for translating high-level JavaScript code into optimized machine actions inside browsers?',
    options: ['DOM rendering frame', 'Browser JS Engine (e.g. V8)', 'Direct CSS style parser', 'JVM compiler'],
    correctOptionIndex: 1,
    explanation: 'The JS engine (such as V8 inside Chrome/Node or SpiderMonkey inside Firefox) compiles and executes client-side script code.'
  },
  {
    questionText: 'Simplify the boolean algebraic logic: $A + \\overline{A}B$:',
    options: ['$A$', '$B$', '$A + B$', '$AB$'],
    correctOptionIndex: 2,
    explanation: 'Using the boolean distribution law: $A + \\overline{A}B = (A + \\overline{A})(A + B) = (1)(A + B) = A + B$.'
  },
  {
    questionText: 'Which computer processor architecture restricts instruction formats to uniform lengths, executing them in single-cycle pipelining?',
    options: ['CISC (Complex Instruction Set Computer)', 'RISC (Reduced Instruction Set Computer)', 'Von Neumann design', 'Harvard architecture'],
    correctOptionIndex: 1,
    explanation: 'RISC chips favor simple, uniform individual instruction sizes to enable microcode pipelining.'
  },
  {
    questionText: 'What is the role of a DMA (Direct Memory Access) controller inside computing cabinets?',
    options: [
      'To manage CPU caches',
      'To perform lightning fast arithmetic additions',
      'To transfer data blocks directly between I/O peripherals and RAM without CPU intervention',
      'To manage virtual paging mappings'
    ],
    correctOptionIndex: 2,
    explanation: 'A DMA controller handles data transfers directly, freeing the main CPU from processing mass byte moves.'
  },
  {
    questionText: 'What is the basic memory offset address formula to locate element $A[i]$ in a one-dimensional array starting at Base address $B$, with element size $W$?',
    options: ['$B + i \\times W$', '$B - i \\times W$', '$B + i / W$', '$B \\times i + W$'],
    correctOptionIndex: 0,
    explanation: 'The target element starts exactly after preceding entries, calculated as $\\text{Base} + \\text{Index} \\times \\text{ElementWidth}$.'
  },
  {
    questionText: 'Which graph traversal technique employs a Depth-First path searching structure?',
    options: ['BFS', 'DFS', 'Kruskal\'s Algorithm', 'Binary Search'],
    correctOptionIndex: 1,
    explanation: 'DFS (Depth-First Search) follows path paths iteratively before backtracking, utilizing a Stack.'
  },
  {
    questionText: 'What is the value of the postfix expression: $5 \\quad 6 \\quad 2 \\quad \\times \\quad +$?',
    options: ['17', '22', '13', '60'],
    correctOptionIndex: 0,
    explanation: 'Evaulating postfix: push 5; push 6; push 2. Read operator $\\times$: pop 2 and 6, multiply ($6\\times 2=12$), push 12. Read operator $+$: pop 12 and 5, add ($12+5=17$), push 17. Final output is 17.'
  },
  {
    questionText: 'What is the maximum node height of a balanced AVL search tree with $N$ elements?',
    options: ['$O(N)$', '$O(\\log N)$', '$O(N \\log N)$', '$O(1)$'],
    correctOptionIndex: 1,
    explanation: 'AVL trees maintain strict balance, keeping their heights constrained within logarithmic bounds.'
  },
  {
    questionText: 'What is the average time complexity of locating the maximum element within a valid Max-Heap containing $N$ nodes?',
    options: ['$O(1)$', '$O(\\log N)$', '$O(N)$', '$O(N \\log N)$'],
    correctOptionIndex: 0,
    explanation: 'A max-heap guarantees the greatest element is stored at the root, enabling constant-time $O(1)$ retrieval.'
  },
  {
    questionText: 'Which sorting algorithm is classified as stable, maintaining the relative order of duplicate keys?',
    options: ['Selection Sort', 'QuickSort', 'MergeSort', 'HeapSort'],
    correctOptionIndex: 2,
    explanation: 'Selection, Quick, and Heap sort can disrupt relative duplicate alignments. MergeSort maintains sequence order during its merge steps.'
  },
  {
    questionText: 'What is the space complexity to run a recursive factorial routine to calculate $N!$?',
    options: ['$O(1)$', '$O(N)$', '$O(\\log N)$', '$O(N^2)$'],
    correctOptionIndex: 1,
    explanation: 'Each recursive call allocates a stack frame, requiring a total of $N$ stacked activation records.'
  },
  {
    questionText: 'The processing resource overhead incurred while saving current CPU register states to load another thread is known as:',
    options: ['Paging trap', 'Context Switching', 'Double fault', 'Thrashing'],
    correctOptionIndex: 1,
    explanation: 'Context switching requires saving active process register configurations and loading another, consuming CPU cycles.'
  },
  {
    questionText: 'In a Round-Robin OS cpu scheduler, what occurs if the time quantum slice is configured too large?',
    options: [
      'The scheduling behaves identically to Shortest Job First',
      'The scheduling degenerates into First-Come, First-Served behavior',
      'The system freezes',
      'Page-faulting increases'
    ],
    correctOptionIndex: 1,
    explanation: 'If the quantum is longer than the longest job duration, no preemption occurs, and it behaves like FCFS (First Come First Served).'
  },
  {
    questionText: 'Where does the operating system locate the virtual address Translation Lookaside Buffer (TLB) cache?',
    options: ['Hard Disk', 'System ROM', 'Directly on the CPU chip (MMU)', 'Within RAM memory blocks'],
    correctOptionIndex: 2,
    explanation: 'The TLB is a high-speed hardware cache on-die within the Memory Management Unit (MMU) to accelerate virtual page translations.'
  },
  {
    questionText: 'What is the logical order of executing parts of an SQL SELECT query containing GROUP BY and HAVING clauses?',
    options: [
      'SELECT \\rightarrow FROM \\rightarrow WHERE',
      'FROM \\rightarrow WHERE \\rightarrow GROUP BY \\rightarrow HAVING \\rightarrow SELECT',
      'GROUP BY \\rightarrow SELECT \\rightarrow FROM',
      'SELECT \\rightarrow GROUP BY \\rightarrow HAVING'
    ],
    correctOptionIndex: 1,
    explanation: 'The database engine first identifies active tables (`FROM`), filters raw rows (`WHERE`), aggregates rows into sets (`GROUP BY`), filters these aggregates (`HAVING`), and outputs columns (`SELECT`).'
  },
  {
    questionText: 'What relationship anomaly defines the elimination of transitive dependency, advancing index levels from 2NF to:',
    options: ['1NF', '3NF', 'BCNF', '4NF'],
    correctOptionIndex: 1,
    explanation: 'Third Normal Form (3NF) requires a database to be in 2NF and have no transitive dependencies on the primary key.'
  },
  {
    questionText: 'In relational database theory, a decomposition of relation schema $R$ into $R_1$ and $R_2$ is guarantees to be "lossless" if and only if:',
    options: [
      '$R_1 \\cap R_2$ functionally determines either $R_1$ or $R_2$',
      '$R_1 \\cup R_2$ is empty',
      'All keys are numeric',
      'No common subfields exist'
    ],
    correctOptionIndex: 0,
    explanation: 'Lossless joins require the intersection $R_1 \\cap R_2$ to be a superkey of at least one of the relations.'
  },
  {
    questionText: 'Which layer of the standard OSI model is responsible for character encryption and data compression?',
    options: ['Application Layer', 'Presentation Layer', 'Session Layer', 'Transport Layer'],
    correctOptionIndex: 1,
    explanation: 'The Presentation Layer (Layer 6) handles syntax formatting, data compression, and encryption/decryption.'
  },
  {
    questionText: 'What is the purpose of CSMA/CD mechanisms in classic Ethernet networks?',
    options: [
      'To encrypt packet data',
      'To schedule collisions, resolving transmission conflicts on shared media',
      'To calculate routes',
      'To manage DNS lookups'
    ],
    correctOptionIndex: 1,
    explanation: 'Carrier Sense Multiple Access with Collision Detection monitors shared channels, detecting concurrently sent packets and scheduling retries.'
  },
  {
    questionText: 'If a network subnet mask is written in CIDR form as `/26`, how many usable IP addresses are available for host interfaces on that subnet details?',
    options: ['64 hosts', '62 hosts', '128 hosts', '30 hosts'],
    correctOptionIndex: 1,
    explanation: 'A `/26` subnet has $32 - 26 = 6$ host bits. The total addresses are $2^6 = 64$. Excluding the network and broadcast addresses leaves $64 - 2 = 62$ usable host IPs.'
  },
  {
    questionText: 'Which HTTP request action represents the most secure approach to transmit sensitive credentials to web databases?',
    options: ['GET', 'POST', 'HEAD', 'OPTIONS'],
    correctOptionIndex: 1,
    explanation: 'The POST method passes variables inside the request body rather than exposing them in URL query parameters, making it more secure than GET.'
  },
  {
    questionText: 'Which HTML anchor tag corresponds to linking an outbound hyper-link?',
    options: ['`<link src="...">`', '`<a href="...">`', '`<anchor path="...">`', '`<a link="...">`'],
    correctOptionIndex: 1,
    explanation: 'The `<a>` (anchor) tag combined with the `href` attribute defines outbound and internal links.'
  },
  {
    questionText: 'Compare JSON vs XML file structures:',
    options: [
      'JSON is a lightweight key-value format parsed natively by JavaScript, while XML is a verbose tag-based markup language',
      'XML is faster',
      'JSON requires third party software compile engines',
      'There are no structural differences'
    ],
    correctOptionIndex: 0,
    explanation: 'JSON maps structures using clean arrays and key-value formats. XML encapsulates values within tag blocks.'
  },
  {
    questionText: 'Which software development lifecycles emphasize iterative sprint routines and ongoing team updates?',
    options: ['Waterfall Model', 'Agile Methodology', 'Linear phase system', 'Spiral block structures'],
    correctOptionIndex: 1,
    explanation: 'Agile methodologies promote iterative development through collaborative sprints and adaptable pivots.'
  },
  {
    questionText: 'What is the core difference between Black-box vs White-box software system validations?',
    options: [
      'Black-box examines code mechanics, White-box checks user interfaces',
      'Black-box evaluates functionality without looking at internal source code, while White-box checks internal logic/code paths',
      'Black-box is manual, White-box is automated',
      'There is no difference'
    ],
    correctOptionIndex: 1,
    explanation: 'Black-box testers treat the app as an opaque system, verifying inputs and outputs. White-box testers use detailed knowledge of the source code.'
  },
  {
    questionText: 'In software architecture, what represents the ideal design criteria concerning module Coupling and Cohesion?',
    options: [
      'High Coupling and Low Cohesion',
      'Low Coupling and High Cohesion',
      'High Coupling and High Cohesion',
      'Low Coupling and Low Cohesion'
    ],
    correctOptionIndex: 1,
    explanation: 'Ideal architectures target low coupling (independent modules) and high cohesion (single-purpose modules).'
  },
  {
    questionText: 'In C, what capability represents the `void*` generic pointer structure?',
    options: [
      'It represents an address slot that cannot be converted to other types',
      'It acts as a generic pointer that can store any data address type without casting',
      'It points to void storage cells that trigger deletion',
      'It is a null memory reference'
    ],
    correctOptionIndex: 1,
    explanation: 'A `void*` pointer is a generic references container holding any address type, commonly used in functions like `malloc`.'
  },
  {
    questionText: 'How behave variables declared using static inside recursive C functions?',
    options: [
      'They are re-allocated fresh on the heap at each recursive depth',
      'They retain their accumulated values throughout life calls, using a single shared space',
      'They delete themselves after calls complete',
      'They throw compilation errors'
    ],
    correctOptionIndex: 1,
    explanation: 'Variables declared with the `static` keyword are allocated once in global memory, retaining values across all invocation scope frames.'
  },
  {
    questionText: 'What represents the node visiting sequence of a binary tree PRE-ORDER traversal?',
    options: [
      'Left Child \\rightarrow Root \\rightarrow Right Child',
      'Root \\rightarrow Left Child \\rightarrow Right Child',
      'Left Child \\rightarrow Right Child \\rightarrow Root',
      'Root \\rightarrow Right Child \\rightarrow Left Child'
    ],
    correctOptionIndex: 1,
    explanation: 'Pre-order traversal starts with the active node (Root), then recursively processes Left and Right children.'
  },
  {
    questionText: 'How coordinates computer security transitions between standard User Mode vs Kernel Mode?',
    options: [
      'Direct memory write-backs',
      'An assembly interrupt call or system trap',
      'A software compiler macro',
      'RAM deletion'
    ],
    correctOptionIndex: 1,
    explanation: 'Entering kernel mode from user space requires trigger instructions like software traps to safely route execution through OS gates.'
  },
  {
    questionText: 'What is a known limitation of Dijkstra\'s shortest path algorithm on graphs?',
    options: [
      'It cannot process weighted graphs',
      'It fails or loops on edge alignments containing negative weights',
      'It only operates on trees',
      'It requires dense vertex counts'
    ],
    correctOptionIndex: 1,
    explanation: 'Dijkstra assumes path weights are strictly accumulative. Negative weights can violate this, causing incorrect calculations.'
  },
  {
    questionText: 'In asymmetric public-key cryptography, how many separate keys exist for a communication session?',
    options: ['1 key', '2 keys (Public and Private)', '3 keys', '4 keys'],
    correctOptionIndex: 1,
    explanation: 'Asymmetric encryption couples 2 paired keys: a public key for encryption, and a secret private key for decryption.'
  },
  {
    questionText: 'Which SQL statement alters the structural schema of a database table (such as adding columns)?',
    options: ['UPDATE', 'ALTER TABLE', 'INSERT INTO', 'MODIFY DATA'],
    correctOptionIndex: 1,
    explanation: 'SQL uses the `ALTER TABLE` DDL statement to change the schema defined for existing tables.'
  },
  {
    questionText: 'In database systems, what is the role of the Redo Log during crash recovery?',
    options: [
      'Roll back changes made by uncommitted transactions',
      'Reapply changes made by committed transactions that were not yet flushed to disk',
      'Clear user password hashes',
      'Generate index trees'
    ],
    correctOptionIndex: 1,
    explanation: 'During crashes, the system scans the Redo Log to reapply updates for committed transactions that were not yet written to disk, guaranteeing Durability.'
  },
  {
    questionText: 'Which layer of the standard OSI model handles hop-to-hop frame delivery, MAC addressing, and collision handling?',
    options: ['Physical Layer', 'Data Link Layer (Layer 2)', 'Network Layer', 'Transport Layer'],
    correctOptionIndex: 1,
    explanation: 'The Data Link Layer (Layer 2) encapsulates bits into frames, managing hop-to-hop transfers and physical MAC addresses.'
  },
  {
    questionText: 'In Git version control systems, which command downloads an existing repository\'s complete history to your machine?',
    options: ['git pull', 'git fetch', 'git clone', 'git checkout'],
    correctOptionIndex: 2,
    explanation: '`git clone` duplicates an entire remote repository\'s codebase and version history offline onto local disks.'
  },
  {
    questionText: 'In C, what is the value of expression `++*ptr` where `ptr` points to variable containing float value 5?',
    options: ['5', '6', 'Pointer error', '7'],
    correctOptionIndex: 1,
    explanation: 'Both operators are prefix, evaluated right-to-left. First dereferences the value (5), then pre-increments it (6).'
  },
  {
    questionText: 'Which compiler component is responsible for grouping character streams into logical lexical units called Tokens?',
    options: ['Parser (Syntax Analyzer)', 'Lexical Analyzer (Scanner)', 'Intermediate Code Generator', 'Optimizer'],
    correctOptionIndex: 1,
    explanation: 'The Lexical Analyzer reads character inputs and groups them into meaningful token sequences.'
  },
  {
    questionText: 'How many distinct binary tree shapes can be formed using 3 unlabeled nodes?',
    options: ['3 shapes', '5 shapes', '8 shapes', '4 shapes'],
    correctOptionIndex: 1,
    explanation: 'The number of distinct tree structures is given by Catalan numbers: $C_n = \\frac{1}{n+1}\\binom{2n}{n}$. For $n=3$, $C_3 = \\frac{1}{4}\\binom{6}{3} = \\frac{20}{4} = 5$.'
  },
  {
    questionText: 'An Abstract Data Type (ADT) is characterized as:',
    options: [
      'A physical data structure coded in assembly language',
      'A logical description of data and operations independent of any implementation details',
      'A system class with only private variables',
      'An empty file pointer'
    ],
    correctOptionIndex: 1,
    explanation: 'An ADT describes what operations can be performed on data, hiding details of how those operations are coded.'
  },
  {
    questionText: 'Which features define Dynamic Programming paradigms in software algorithms?',
    options: [
      'Overlapping subproblems and optimal substructure',
      'Divide and conquer with parallel processors',
      'Strict backtracking',
      'Random heuristics'
    ],
    correctOptionIndex: 0,
    explanation: 'Dynamic Programming optimizes recursive checks by caching results of overlapping subproblems, requiring optimal substructures to guarantee success.'
  },
  {
    questionText: 'How do Threads compare to full virtual OS Processes regarding resource allocation?',
    options: [
      'Threads have completely isolated memory ranges',
      'Threads share address space, code segment, and file descriptors of their parent process, while processes are isolated',
      'Processes share parent process heaps',
      'Threads have larger overhead'
    ],
    correctOptionIndex: 1,
    explanation: 'Threads execute concurrently within a shared process context (sharing memory/handles), making them lighter and cheaper than isolated processes.'
  },
  {
    questionText: 'Which RAID configuration utilizes disk striping coupled with distributed parity computing across all physical drives?',
    options: ['RAID 0', 'RAID 1', 'RAID 5', 'RAID 10'],
    correctOptionIndex: 2,
    explanation: 'RAID 5 stripes data and distributes parity information dynamically across all connected disks.'
  },
  {
    questionText: 'In CSS Flexbox layouts, which property coordinates child item alignment along the main axis?',
    options: ['align-items', 'justify-content', 'align-content', 'flex-wrap'],
    correctOptionIndex: 1,
    explanation: '`justify-content` aligns items along the primary main axis. `align-items` handles the perpendicular cross-axis.'
  },
  {
    questionText: 'Which SQL wildcard character is used to match any search string sequence containing zero or more characters?',
    options: ['_ (Underscore)', '% (Percentage symbol)', '* (Asterisk)', '# (Hash)'],
    correctOptionIndex: 1,
    explanation: 'The percentage symbol `%` matches any character sequence of arbitrary length in `LIKE` queries. An underscore `_` matches exactly 1 character.'
  },
  {
    questionText: 'Which network port is the default listener for secure encrypted HTTPS web traffic?',
    options: ['80', '8080', '443', '22'],
    correctOptionIndex: 2,
    explanation: 'HTTPS traffic is routed through encrypted port 443. Port 80 is used for unencrypted HTTP, and port 22 is used for SSH.'
  },
  {
    questionText: 'What represents the core structural rule governing first-normal-form (1NF) database structures?',
    options: [
      'Tables must not contain primary keys',
      'Each attribute column must contain only atomic (indivisible) values',
      'No foreign indices are allowed',
      'Table rows must be sorted'
    ],
    correctOptionIndex: 1,
    explanation: '1NF mandates that duplicate groupings and multi-valued arrays are removed, leaving only atomic values in each cell.'
  },
  {
    questionText: 'What register inside a CPU tracking core coordinates the memory address location of the next active execution instruction?',
    options: ['Instruction Register (IR)', 'Accumulator (ACC)', 'Program Counter (PC)', 'Memory Address Register (MAR)'],
    correctOptionIndex: 2,
    explanation: 'The Program Counter (PC) stores and increments the instruction memory address currently slotted for execution.'
  },
  {
    questionText: 'Which standard memory allocation failure represents a "Stack Overflow" condition?',
    options: [
      'The static data segment runs out of space',
      'The allocated heap memory block is filled',
      'The call stack pointer exceeds its allocated boundary, often due to infinite recursion',
      'A pointer dereference misses values'
    ],
    correctOptionIndex: 2,
    explanation: 'Stack Overflow hits when active program call sequences grow too deep, exhausting their reserved stack space.'
  },
  {
    questionText: 'In UNIX file systems, where is file metadata (like size, permissions, and block pointers) stored?',
    options: ['Boot sector', 'Root directory only', 'Inode structures', 'Directly in the file data payload'],
    correctOptionIndex: 2,
    explanation: 'UNIX handles file directories by mapping entries to unique Inodes containing metadata and physical block locations.'
  },
  {
    questionText: 'Which hardware resource bounds the maximum address size of Virtual Memory in operating systems?',
    options: [
      'The physical size of RAM installed on-board',
      'The width of the CPU address bus and address register limitations',
      'The size of standard caches',
      'The motherboards power capacity'
    ],
    correctOptionIndex: 1,
    explanation: 'Virtual memory address limits are determined by the CPU addressing architecture (e.g. 32-bit registers limits paths to $4$ GB).'
  },
  {
    questionText: 'Which code block block segment inside Java exception handling structures is guaranteed to run regardless of whether abort traps are caught?',
    options: ['catch block', 'throw segment', 'finally block', 'try structure'],
    correctOptionIndex: 2,
    explanation: 'The `finally` block is executed after try/catch exits, verifying cleanup routines run regardless of whether exceptions occur.'
  },
  {
    questionText: 'In C++, what is the primary purpose of declaring a Base Class destructor as virtual?',
    options: [
      'To speed up RAM deletions',
      'To guarantee that subclass destructors are recursively invoked during polymorphic object deletions, avoiding memory leaks',
      'To prevent subclassing',
      'To verify functions return void'
    ],
    correctOptionIndex: 1,
    explanation: 'Virtual destructors ensure that deleting a derived object via a base pointer safely invokes the derived destructor first, avoiding memory leaks.'
  },
  {
    questionText: 'In the event of a database system failure, the Log-Based recovery subsystem handles uncommitted transactions using which operation?',
    options: ['REDO', 'UNDO', 'COMMIT', 'ROLLFORWARD'],
    correctOptionIndex: 1,
    explanation: 'Uncommitted transactions found in the log must be completely undone (UNDO) to revert incomplete database changes.'
  },
  {
    questionText: 'Which protocol layer is responsible for segment flow-control, congestion tracking, and packet retransmission in computer networks?',
    options: ['Data Link Layer', 'Network Layer', 'Transport Layer (Layer 4)', 'Session Layer'],
    correctOptionIndex: 2,
    explanation: 'The Transport Layer (including TCP) manages end-to-end reliability, error control, and congestion tracking.'
  },
  {
    questionText: 'In software version control systems, which command incorporates active branch changes from local stages into branch histories?',
    options: ['git push', 'git commit', 'git add', 'git merge'],
    correctOptionIndex: 1,
    explanation: '`git commit` saves staged changes as a permanent snapshot in the local repository history.'
  },
  {
    questionText: 'Which data structures are optimal for evaluating arithmetic parenthesis matching compilers?',
    options: ['Stack', 'Binary Tree', 'Hashing Map', 'Double Queue'],
    correctOptionIndex: 0,
    explanation: 'Parentheses matching uses a Stack to push opening braces and pop/verify them against corresponding closing braces.'
  },
  {
    questionText: 'In SQL queries, what operator is used to filter records within a range of values?',
    options: ['IN', 'BETWEEN', 'LIKE', 'HAVING'],
    correctOptionIndex: 1,
    explanation: 'The `BETWEEN` operator filters database ranges inclusively (e.g., `BETWEEN 10 AND 20`).'
  },
  {
    questionText: 'Which sorting algorithm is characterized by $O(N^2)$ average runtime but maintains minimal memory swaps?',
    options: ['Selection Sort', 'Bubble Sort', 'Insertion Sort', 'QuickSort'],
    correctOptionIndex: 0,
    explanation: 'Selection Sort performs at most $O(N)$ write swaps, making it useful in systems where memory writes are expensive.'
  },
  {
    questionText: 'In Web technology, what represents the acronym "CSS"?',
    options: ['Cascading Style Sheets', 'Creative Style System', 'Computer State System', 'Common Style Sheets'],
    correctOptionIndex: 0,
    explanation: 'CSS stands for Cascading Style Sheets, used to style HTML content.'
  },
  {
    questionText: 'Which sorting method constructs its operations by continuously building up a balanced Heap tree structure?',
    options: ['MergeSort', 'HeapSort', 'QuickSort', 'RadixSort'],
    correctOptionIndex: 1,
    explanation: 'HeapSort constructs a binary heap from array nodes and extracts max/min elements sequentially to build sorted arrays.'
  },
  {
    questionText: 'In UNIX file systems, what is the default permission permissions configuration matching numerical code "755"?',
    options: [
      'Read/Write/Execute for Owner, and Read/Execute for Group and Others',
      'Full permissions for everyone',
      'No permissions',
      'Read/Write for Owner, Read for Group and Others'
    ],
    correctOptionIndex: 0,
    explanation: '7 is rwx (4+2+1), 5 is r-x (4+1). Thus, owner has full permissions, and group/others can read and execute files.'
  },
  {
    questionText: 'In object-oriented programming, defining multiple methods in the same class with identical names but different argument parameters is:',
    options: ['Method Overriding', 'Method Overloading', 'Encapsulation override', 'Abstract reference'],
    correctOptionIndex: 1,
    explanation: 'Method Overloading represents compile-time polymorphism where compilers route methods based on arguments signatures.'
  },
  {
    questionText: 'Which data structure utilizes double-ended queues to append and pop items from both boundaries?',
    options: ['Stack', 'Deque (Double-Ended Queue)', 'BST', 'Priorty list'],
    correctOptionIndex: 1,
    explanation: 'A Deque allows insertion and extraction at both ends, combining traits of stacks and queues.'
  },
  {
    questionText: 'What is the average time complexity of performing a search on an optimized hash table using key values?',
    options: ['$O(1)$', '$O(\\log N)$', '$O(N)$', '$O(N \\log N)$'],
    correctOptionIndex: 0,
    explanation: 'Hash tables resolve keys directly to bucket slots, achieving constant-time average $O(1)$ performance.'
  },
  {
    questionText: 'What is the network speed status code value represented by HTTP status code "404 Not Found"?',
    options: [
      'The client request is bad',
      'The requested resource is missing from the server',
      'The client has no permissions',
      'Success'
    ],
    correctOptionIndex: 1,
    explanation: 'A 404 response confirms the resource requested by the client does not exist on the server.'
  }
];

// ==========================================
// 5. SELECTION & COMBINATION HELPERS
// ==========================================
export function getSectionForId(id: number): SubjectSection {
  if (id >= 1 && id <= 50) return 'Mathematics';
  if (id >= 51 && id <= 75) return 'Physics';
  if (id >= 76 && id <= 100) return 'Chemistry';
  return 'Computer Science';
}

export function getQuestionNumberWithinSection(id: number): number {
  if (id >= 1 && id <= 50) return id; // 1 to 50
  if (id >= 51 && id <= 75) return id - 50; // 1 to 25
  if (id >= 76 && id <= 100) return id - 75; // 1 to 25
  return id - 100; // 1 to 100
}

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createMathVariant(
  raw: Omit<Question, 'id' | 'questionNumber' | 'section'>,
  variantIdx: number
): Omit<Question, 'id' | 'questionNumber' | 'section'> {
  if (variantIdx === 0) return raw;

  let text = raw.questionText;
  let options = [...raw.options];
  let correctIdx = raw.correctOptionIndex;
  let explanation = raw.explanation;

  if (text.includes('value of $b^4$') || text.includes('aI + bA')) {
    const k = variantIdx + 1;
    const fractions = ['1/4', '1/16', '1/36', '1/64', '1/100'];
    const ansText = fractions[variantIdx] || `1/${4 * k * k}`;
    text = `If $A = \\begin{pmatrix} 0 & ${k} \\\\ -${k} & 0 \\end{pmatrix}$ and if $(aI + bA)^2 = A$, then the value of $b^4$ is equal to:`;
    options = [ansText, `1/${2 * k}`, `1/${8 * k}`, `1/${k * k}`];
    correctIdx = 0;
    explanation = `Given $A^2 = \\begin{pmatrix} 0 & ${k} \\\\ -${k} & 0 \\end{pmatrix} \\begin{pmatrix} 0 & ${k} \\\\ -${k} & 0 \\end{pmatrix} = -${k*k}I$. Expanding $(aI + bA)^2 = a^2 I + 2ab A + b^2 A^2 = (a^2 - b^2 ${k*k})I + 2ab A$. Setting this equal to $A$ yields $2ab = 1 \\implies a = 1/(2b)$, and $a^2 = b^2 ${k*k}$. Substituting gives $b^4 = 1 / (4 \\times ${k*k}) = ${ansText}$.`;
  } else if (text.includes('F(\\theta)') && text.includes('inverse')) {
    const angle = variantIdx + 1;
    const angleStr = angle === 1 ? '\\theta' : `${angle}\\theta`;
    text = `If $A = \\begin{pmatrix} \\cos ${angleStr} & \\sin ${angleStr} & 0 \\\\ -\\sin ${angleStr} & \\cos ${angleStr} & 0 \\\\ 0 & 0 & 1 \\end{pmatrix} = F(${angleStr})$, then the inverse $A^{-1}$ is equivalent to:`;
    options = [`F(${angleStr})`, `F(-${angleStr})`, `-F(${angleStr})`, `-F(-${angleStr})`];
    correctIdx = 1;
    explanation = `For any orthogonal rotation matrix, changing the direction of rotation is equivalent to taking the transpose or inverse. Hence, $F(${angleStr})^{-1} = F(-${angleStr})$.`;
  } else if (text.includes('yz/x') || (text.includes('linear equations') && text.includes('x + y + z'))) {
    const k = variantIdx + 1;
    text = `If $(x,y,z)$ is the solution of the linear equations $x + y + z = ${6*k}$, $x - y + z = ${2*k}$, and $2x + y - z = ${k}$, then what is the value of $\\frac{yz}{x}$?`;
    options = [`${6*k}`, `${12*k}`, `${3*k}`, `${2*k}`];
    correctIdx = 0;
    explanation = `Solving the system yields $x = ${k}$, $y = ${2*k}$, and $z = ${3*k}$. Hence, $\\frac{yz}{x} = \\frac{${2*k} \\times ${3*k}}{${k}} = ${6*k}$.`;
  } else if (text.includes('eigenvalues') || text.includes('triangular matrix')) {
    const multiplier = variantIdx + 1;
    const l1 = 3 * multiplier;
    const l2 = 4 * multiplier;
    const l3 = 2 * multiplier;
    text = `Find the eigenvalues of the upper triangular matrix $A = \\begin{pmatrix} ${l1} & 12 & -5 \\\\ 0 & ${l2} & 8 \\\\ 0 & 0 & ${l3} \\end{pmatrix}$:`;
    options = [`${l1}, ${l2}, ${l3}`, '0, 0, 0', '1, 1, 1', `${l1 * 2}, ${l2 * 2}, ${l3 * 2}`];
    correctIdx = 0;
    explanation = `The eigenvalues of any triangular or diagonal matrix are simply the elements on its main diagonal. Thus, they are ${l1}, ${l2}, and ${l3}.`;
  } else if (text.includes('matrix rank of $A = \\begin{pmatrix}') || text.includes('matrix rank of $A$ =')) {
    const k = variantIdx + 1;
    text = `Determine the matrix rank of $A = \\begin{pmatrix} ${k} & ${2*k} & ${3*k} \\\\ ${2*k} & ${4*k} & ${6*k} \\\\ ${3*k} & ${6*k} & ${9*k} \\end{pmatrix}$:`;
    options = ['3', '2', '1', '0'];
    correctIdx = 2;
    explanation = `Since Row 2 is $2 \\times$ Row 1 and Row 3 is $3 \\times$ Row 1, there is only 1 linearly independent row. Thus, the rank is 1.`;
  } else if (text.includes('determinant') && text.includes('AB')) {
    const k = variantIdx + 1;
    const res = Math.pow(k, 3) * 2 * (-4);
    text = `If $A$ and $B$ are square matrices of order 3 with determinants $|A| = 2$ and $|B| = -4$, then the value of the determinant $|${k}AB|$ is:`;
    options = [`${res}`, `${res + 12}`, `${-res}`, `${res - 30}`];
    correctIdx = 0;
    explanation = `Using determinant properties, for order $n=3$, we get $|${k}AB| = ${k}^3 \\times |A| \\times |B| = ${Math.pow(k, 3)} \\times 2 \\times (-4) = ${res}$.`;
  } else if (text.includes('log_') && text.includes('x')) {
    const factor = variantIdx + 1;
    text = `If $\\log_{\\sqrt{27}}(x) = \\frac{${8 * factor}}{3}$, then determine the value of $x$:`;
    options = [`10`, `16`, `3^{${4 * factor}}`, `27`];
    correctIdx = 2;
    explanation = `By converting logarithmic form to exponential form:\n$x = (\\sqrt{27})^{${8 * factor}/3} = (27^{1/2})^{${8 * factor}/3} = 27^{${4 * factor}/3} = (3^3)^{${4 * factor}/3} = 3^{${4 * factor}}$.`;
  } else if (text.includes('2\\tan^{-1}') || text.includes('tan^{-1}(k)')) {
    const pairs = [
      { p: 2, q: 3, ans: '12/5' },
      { p: 3, q: 4, ans: '24/7' },
      { p: 1, q: 2, ans: '4/3' },
      { p: 2, q: 5, ans: '20/21' },
      { p: 1, q: 3, ans: '3/4' }
    ];
    const pair = pairs[variantIdx % pairs.length];
    text = `If $2\\tan^{-1}\\left(\\frac{${pair.p}}{${pair.q}}\\right) = \\tan^{-1}(k)$, then find values of the constant parameter $k$:`;
    options = [pair.ans, '5/12', '12/5', '1'];
    correctIdx = 0;
    explanation = `Using double angle formula: $\\tan(2\\theta) = \\frac{2x}{1-x^2}$ where $x = \\frac{${pair.p}}{${pair.q}}$, we get $k = \\frac{2(${pair.p}/${pair.q})}{1 - (${pair.p}/${pair.q})^2} = ${pair.ans}$.`;
  } else if (text.includes('distance between parallel straight lines') || text.includes('distance between parallel')) {
    const lines = [
      { l1: '2x - y + 4 = 0', l2: '6x - 3y = 5', ans: '17 / (3\\sqrt{5})', exp: '17 / 3\\sqrt{5}' },
      { l1: 'x - 2y + 3 = 0', l2: '2x - 4y = 7', ans: '13 / (2\\sqrt{5})', exp: '13 / 2\\sqrt{5}' },
      { l1: '3x + y + 2 = 0', l2: '9x + 3y = 1', ans: '7 / (3\\sqrt{10})', exp: '7 / 3\\sqrt{10}' },
      { l1: 'x + y + 5 = 0', l2: '2x + 2y = 3', ans: '13 / (2\\sqrt{2})', exp: '13 / 2\\sqrt{2}' },
      { l1: '4x - y + 1 = 0', l2: '12x - 3y = 2', ans: '5 / (3\\sqrt{17})', exp: '5 / 3\\sqrt{17}' }
    ];
    const item = lines[variantIdx % lines.length];
    text = `Find the standard formula distance between parallel straight lines $${item.l1}$ and $${item.l2}$:`;
    options = [item.ans, '13 / (2\\sqrt{5})', '17 / (2\\sqrt{5})', '14 / (3\\sqrt{5})'];
    correctIdx = 0;
    explanation = `Using parallel distance formula $d = \\frac{|C_1 - C_2|}{\\sqrt{A^2 + B^2}}$, we scale coefficients to match, yielding $d = ${item.exp}$.`;
  } else if (text.includes('circle') && text.includes('radius 4 units')) {
    const circles = [
      { a: 4, b: 6, rad: 4, ans: '3', exp: 'k = 3' },
      { a: 6, b: 8, rad: 5, ans: '0', exp: 'k = 0' },
      { a: 2, b: 4, rad: 3, ans: '4', exp: 'k = 4' },
      { a: 8, b: 4, rad: 6, ans: '16', exp: 'k = 16' },
      { a: 4, b: 2, rad: 3, ans: '4', exp: 'k = 4' }
    ];
    const circle = circles[variantIdx % circles.length];
    text = `Find the parameter $k$ if the circle $x^2 + y^2 - ${circle.a}x + ${circle.b}y - k = 0$ has radius ${circle.rad} units:`;
    options = [circle.ans, '-3', '2', '5'];
    correctIdx = 0;
    explanation = `Using circle radius formula $R = \\sqrt{g^2 + f^2 - c}$, we find ${circle.exp}.`;
  } else if (text.includes('period of the trigonometric function') && text.includes('sin(3x)')) {
    const periods = [
      { func: '\\sin(3x)', ans: '2\\pi/3' },
      { func: '\\cos(4x)', ans: '\\pi/2' },
      { func: '\\sin(5x)', ans: '2\\pi/5' },
      { func: '\\cos(2x)', ans: '\\pi' },
      { func: '\\sin(6x)', ans: '\\pi/3' }
    ];
    const pt = periods[variantIdx % periods.length];
    text = `Determine the primary period of the trigonometric function $f(x) = ${pt.func}$:`;
    options = [pt.ans, '2\\pi', '\\pi', '2\\pi/7'];
    correctIdx = 0;
    explanation = `The primary period of the trigonometric function $\\sin(kx)$ or $\\cos(kx)$ is given by $2\\pi / k$. Thus, for ${pt.func}, the period is ${pt.ans}.`;
  } else if (text.includes('slope of the tangent') && text.includes('x^3 - 3x + 2')) {
    const tangents = [
      { curve: 'y = x^3 - 3x + 2', pt: 'x = 2', ans: '9', exp: 'y\' = 3x^2 - 3 \\implies 3(4) - 3 = 9' },
      { curve: 'y = x^2 - 4x + 1', pt: 'x = 3', ans: '2', exp: 'y\' = 2x - 4 \\implies 2(3) - 4 = 2' },
      { curve: 'y = 2x^3 - 5x + 3', pt: 'x = 1', ans: '1', exp: 'y\' = 6x^2 - 5 \\implies 6(1) - 5 = 1' },
      { curve: 'y = x^4 - 2x^2 + 5', pt: 'x = 2', ans: '24', exp: 'y\' = 4x^3 - 4x \\implies 4(8) - 8 = 24' },
      { curve: 'y = x^3 + 2x^2 - x', pt: 'x = 1', ans: '6', exp: 'y\' = 3x^2 + 4x - 1 \\implies 3(1) + 4(1) - 1 = 6' }
    ];
    const tgt = tangents[variantIdx % tangents.length];
    text = `Determine the slope of the tangent to the curve $${tgt.curve}$ at the point $${tgt.pt}$:`;
    options = [tgt.ans, '0', '4', '12'];
    correctIdx = 0;
    explanation = `The slope of the tangent is given by the derivative of the curve evaluated at the point. $${tgt.exp}$.`;
  } else if (text.includes('limit') && text.includes('sin 5x')) {
    const limits = [
      { num: '5', den: '3', ans: '5/3' },
      { num: '3', den: '4', ans: '3/4' },
      { num: '7', den: '2', ans: '7/2' },
      { num: '2', den: '5', ans: '2/5' },
      { num: '6', den: '5', ans: '6/5' }
    ];
    const lim = limits[variantIdx % limits.length];
    text = `Evaluate the basic trigonometric limit $\\lim_{x \\to 0} \\frac{\\sin ${lim.num}x}{${lim.den}x}$:`;
    options = [lim.ans, '1', '0', `${lim.den}/${lim.num}`];
    correctIdx = 0;
    explanation = `Using standard limit $\\lim_{\\theta \\to 0} \\frac{\\sin\\theta}{\\theta} = 1$, we get $\\lim_{x \\to 0} \\frac{\\sin ${lim.num}x}{${lim.den}x} = \\frac{${lim.num}}{${lim.den}} \\times \\lim_{x \\to 0} \\frac{\\sin ${lim.num}x}{${lim.num}x} = ${lim.ans}.`;
  } else if (text.includes('hyperbolic identity')) {
    const terms = [
      'Evaluate the basic hyperbolic identity value of $\\cosh^2(4x) - \\sinh^2(4x)$:',
      'What is the evaluated identity value of the hyperbolic formula $\\cosh^2(\\theta) - \\sinh^2(\\theta)$ for any real $\\theta$?',
      'If $y = \\cosh^2(x) - \\sinh^2(x)$, calculate the value of $y$ at $x = 100$:',
      'Evaluate the hyperbolic constant identity: $\\cosh^2(10y) - \\sinh^2(10y)$:'
    ];
    text = terms[(variantIdx - 1) % terms.length];
    options = ['-1', '0', '1', '2'];
    correctIdx = 2;
    explanation = 'By basic definition of hyperbolic trigonometry, the core constant identity is always $\\cosh^2(t) - \\sinh^2(t) = 1$ for all real parameters $t$.';
  } else {
    const mathPrefixes = [
      `For a standard coordinate geometry problem, solve the following: `,
      `In a coordinate plane, calculate: `,
      `With reference to standard calculus and engineering theory, evaluate: `,
      `Determine the exact analytical solution for: `
    ];
    text = `${mathPrefixes[(variantIdx - 1) % mathPrefixes.length]}${raw.questionText}`;
  }

  return { questionText: text, options, correctOptionIndex: correctIdx, explanation };
}

function createPhysicsVariant(
  raw: Omit<Question, 'id' | 'questionNumber' | 'section'>,
  variantIdx: number
): Omit<Question, 'id' | 'questionNumber' | 'section'> {
  if (variantIdx === 0) return raw;

  let text = raw.questionText;
  let options = [...raw.options];
  let correctIdx = raw.correctOptionIndex;
  let explanation = raw.explanation;

  if (text.includes('acts on') && text.includes('displacement')) {
    const multiplier = variantIdx + 1;
    const fx = 2 * multiplier, fy = 3 * multiplier, fz = 7 * multiplier;
    const sx = 2, sy = 3, sz = 5;
    const ans = fx*sx + fy*sy + fz*sz;
    text = `If a force $\\vec{F} = ${fx}\\hat{i} + ${fy}\\hat{j} + ${fz}\\hat{k}$ Newtons acts on an object and causes a displacement of $\\vec{S} = ${sx}\\hat{i} + ${sy}\\hat{j} + ${sz}\\hat{k}$ meters, then what is the total work done on the object?`;
    options = [`${ans} Nm`, `${ans + 12} Nm`, `${ans - 8} Nm`, `${ans * 2} Nm`];
    correctIdx = 0;
    explanation = `Work done is the scalar dot product of force and displacement vectors:\n$W = \\vec{F} \\cdot \\vec{S} = (${fx} \\times ${sx}) + (${fy} \\times ${sy}) + (${fz} \\times ${sz}) = ${fx*sx} + ${fy*sy} + ${fz*sz} = ${ans}\\text{ Joules (or Nm)}$.`;
  } else if (text.includes('angle between two vector quantities')) {
    const k = variantIdx + 1;
    const px = 3 * k, py = 4 * k;
    const qx = 4 * k, qy = -3 * k;
    text = `Find the precise mathematical angle between two vector quantities $\\vec{P} = ${px}\\hat{i} + ${py}\\hat{j}$ and $\\vec{Q} = ${qx}\\hat{i} - ${Math.abs(qy)}\\hat{j}$:`;
    options = ['0°', '45°', '90° (Orthogonal)', '180°'];
    correctIdx = 2;
    explanation = `Dot product $\\vec{P} \\cdot \\vec{Q} = (${px})(${qx}) + (${py})(${qy}) = ${px*qx} - ${py*Math.abs(qy)} = 0$. Since the scalar dot product is exactly zero, they are perpendicular (orthogonal) at 90°.`;
  } else if (text.includes('Universal Gravitational Constant') || text.includes('dimensional formula parameters')) {
    const params = [
      { name: 'Universal Gravitational Constant ($G$)', ans: '$[M^{-1} L^3 T^{-2}]$', exp: '$G = \\frac{Fr^2}{m_1 m_2} \\implies \\frac{[MLT^{-2}][L^2]}{[M^2]} = [M^{-1}L^3T^{-2}]$' },
      { name: 'Planck\'s Constant ($h$)', ans: '$[M L^2 T^{-1}]$', exp: '$E = h\\nu \\implies h = \\frac{E}{\\nu} \\implies \\frac{[ML^2T^{-2}]}{[T^{-1}]} = [ML^2T^{-1}]$' },
      { name: 'Universal Gas Constant ($R$)', ans: '$[M L^2 T^{-2} \\text{mol}^{-1} K^{-1}]$', exp: '$PV = nRT \\implies R = \\frac{PV}{nT} \\implies \\frac{[ML^{-1}T^{-2}][L^3]}{[\\text{mol}][K]} = [ML^2T^{-2}\\text{mol}^{-1}K^{-1}]$' },
      { name: 'Boltzmann Constant ($k_B$)', ans: '$[M L^2 T^{-2} K^{-1}]$', exp: '$E = k_B T \\implies k_B = \\frac{E}{T} \\implies [ML^2T^{-2}K^{-1}]$' },
      { name: 'Coefficient of Viscosity ($\\eta$)', ans: '$[M L^{-1} T^{-1}]$', exp: '$F = \\eta A \\frac{dv}{dx} \\implies \\eta = \\frac{F}{A (dv/dx)} \\implies \\frac{[MLT^{-2}]}{[L^2][T^{-1}]} = [ML^{-1}T^{-1}]$' }
    ];
    const p = params[variantIdx % params.length];
    text = `What are the dimensional formula parameters of the ${p.name}?`;
    options = [p.ans, '$[M L T^{-1}]$', '$[M L^2 T^{-2}]$', '$[M^{-1} L^{-1} T^{-1}]$'];
    correctIdx = 0;
    explanation = `The dimension is derived as: ${p.exp}.`;
  } else if (text.includes('Escape Velocity')) {
    const spheres = [
      'What is the estimated Escape Velocity of any object trying to escape the gravity well of Earth?',
      'If air resistance is fully ignored, what threshold starting velocity is required to escape the surface of the Earth?',
      'Calculate the escape speed constant ($v_e$) at Earth surface level, assuming standard radius and $g = 9.8\\text{ m/s}^2$:',
      'Which represents the standard planetary escape speed threshold from the reference Earth surface?'
    ];
    text = spheres[(variantIdx - 1) % spheres.length];
  } else {
    const physPrefixes = [
      `In a standard mechanics experiment: `,
      `Analyzing thermodynamic or physical parameters: `,
      `With reference to Newtonian dynamics and wave motion, determine: `,
      `For any standard physical material layout: `
    ];
    text = `${physPrefixes[(variantIdx - 1) % physPrefixes.length]}${raw.questionText}`;
  }

  return { questionText: text, options, correctOptionIndex: correctIdx, explanation };
}

function createChemistryVariant(
  raw: Omit<Question, 'id' | 'questionNumber' | 'section'>,
  variantIdx: number
): Omit<Question, 'id' | 'questionNumber' | 'section'> {
  if (variantIdx === 0) return raw;

  let text = raw.questionText;
  let options = [...raw.options];
  let correctIdx = raw.correctOptionIndex;
  let explanation = raw.explanation;

  if (text.includes('principal quantum number $n$')) {
    const offsets = [0, 5, 10, 15];
    const nIdx = (variantIdx - 1) % offsets.length;
    const an = 19;
    const mass = 40 + offsets[nIdx];
    const neutrons = mass - an;
    text = `Determine the total number of neutrons present inside an atomic nucleus of Potassium having Atomic Number ${an} and atomic mass weight of ${mass}:`;
    options = [`${neutrons}`, `${an}`, `${mass}`, `${neutrons + 5}`];
    correctIdx = 0;
    explanation = `The number of neutrons is simply the Difference weight formula: $\\text{Neutrons} = \\text{Mass Number} - \\text{Atomic Number} = ${mass} - ${an} = ${neutrons}$.`;
  } else if (text.includes('oxidation state') || text.includes('Oxidation number')) {
    const compounds = [
      { name: 'formaldehyde ($HCHO$)', state: '0', exp: 'In formaldehyde ($HCHO$), $2(+1) + C + (-2) = 0 \\implies C = 0$.' },
      { name: 'carbon dioxide ($CO_2$)', state: '+4', exp: 'In carbon dioxide ($CO_2$), $C + 2(-2) = 0 \\implies C = +4$.' },
      { name: 'methane ($CH_4$)', state: '-4', exp: 'In methane ($CH_4$), $C + 4(+1) = 0 \\implies C = -4$.' },
      { name: 'carbon monoxide ($CO$)', state: '+2', exp: 'In carbon monoxide ($CO$), $C + (-2) = 0 \\implies C = +2$.' }
    ];
    const comp = compounds[(variantIdx - 1) % compounds.length];
    text = `Assuming standard chemical valuation, what is the oxidation number of the Carbon atom in ${comp.name}?`;
    options = ['-4', '+4', '0', '+2'];
    correctIdx = options.indexOf(comp.state);
    if (correctIdx === -1) {
      options[3] = comp.state;
      correctIdx = 3;
    }
    explanation = comp.exp;
  } else {
    const chemPrefixes = [
      `In inorganic and molecular chemistry: `,
      `Analyzing core molecular orbital interactions: `,
      `With reference to environmental standards and industrial actions: `,
      `For any standard aqueous solution setup: `
    ];
    text = `${chemPrefixes[(variantIdx - 1) % chemPrefixes.length]}${raw.questionText}`;
  }

  return { questionText: text, options, correctOptionIndex: correctIdx, explanation };
}

function createCSVariant(
  raw: Omit<Question, 'id' | 'questionNumber' | 'section'>,
  variantIdx: number
): Omit<Question, 'id' | 'questionNumber' | 'section'> {
  if (variantIdx === 0) return raw;

  let text = raw.questionText;
  let options = [...raw.options];
  let correctIdx = raw.correctOptionIndex;
  let explanation = raw.explanation;

  if (text.includes('octal number')) {
    const octals = [
      { oct: '124', dec: 84, exp: '1 * 64 + 2 * 8 + 4 = 64 + 16 + 4 = 84' },
      { oct: '523', dec: 339, exp: '5 * 64 + 2 * 8 + 3 = 320 + 16 + 3 = 339' },
      { oct: '215', dec: 141, exp: '2 * 64 + 1 * 8 + 5 = 128 + 8 + 5 = 141' },
      { oct: '344', dec: 228, exp: '3 * 64 + 4 * 8 + 4 = 192 + 32 + 4 = 228' }
    ];
    const pair = octals[(variantIdx - 1) % octals.length];
    text = `Determine the equivalent decimal integer representation for the octal numerical system value $(${pair.oct})_8$:`;
    options = [`${pair.dec}`, `${pair.dec + 12}`, `${pair.dec - 16}`, `${pair.dec + 22}`];
    correctIdx = 0;
    explanation = `To convert octal to decimal digits: $${pair.exp} = ${pair.dec}$.`;
  } else if (text.includes('numerical code "755"') || text.includes('permission configuration')) {
    const perms = [
      { code: '755', text: 'Read/Write/Execute for Owner, and Read/Execute for Group and Others', def: '7 is rwx (4+2+1), 5 is r-x (4+1). Thus, owner has full permissions, group and others have read and execute rights.' },
      { code: '644', text: 'Read/Write for Owner, and Read-only for Group and Others', def: '6 is rw- (4+2), 4 is r-- (4). Thus, owner has read/write privileges, and everyone else has read-only rights.' },
      { code: '700', text: 'Read/Write/Execute for Owner, and No permissions for everyone else', def: '7 is rwx (4+2+1), 0 is --- (0). Only the owner possesses file privileges.' },
      { code: '777', text: 'Full Read/Write/Execute permissions for Everyone', def: 'All tiers have complete 7 (rwx) file access configurations.' }
    ];
    const perm = perms[(variantIdx - 1) % perms.length];
    text = `In UNIX file systems, what is the default permission permissions configuration matching numerical code "${perm.code}"?`;
    options = [
      'Read/Write/Execute for Owner, and Read/Execute for Group and Others',
      'Read/Write for Owner, and Read-only for Group and Others',
      'Read/Write/Execute for Owner, and No permissions for everyone else',
      'Full Read/Write/Execute permissions for Everyone'
    ];
    correctIdx = options.indexOf(perm.text);
    if (correctIdx === -1) {
      options[3] = perm.text;
      correctIdx = 3;
    }
    explanation = perm.def;
  } else {
    const csPrefixes = [
      `In systems programming languages and compiler structures: `,
      `With reference to digital systems layout and Boolean logic gates: `,
      `In computer network stacks and standard communication routing: `,
      `Analyzing core database entity-relationship patterns: `
    ];
    text = `${csPrefixes[(variantIdx - 1) % csPrefixes.length]}${raw.questionText}`;
  }

  return { questionText: text, options, correctOptionIndex: correctIdx, explanation };
}

export function getMathPool(): Omit<Question, 'id' | 'questionNumber' | 'section'>[] {
  const pool: Omit<Question, 'id' | 'questionNumber' | 'section'>[] = [];
  const count = mathRawQuestions.length;
  for (let i = 0; i < 250; i++) {
    const raw = mathRawQuestions[i % count];
    const v = Math.floor(i / count);
    pool.push({ ...createMathVariant(raw, v), code: `M${i + 1}` });
  }
  return pool;
}

export function getPhysicsPool(): Omit<Question, 'id' | 'questionNumber' | 'section'>[] {
  const pool: Omit<Question, 'id' | 'questionNumber' | 'section'>[] = [];
  const count = physicsRawQuestions.length;
  for (let i = 0; i < 125; i++) {
    const raw = physicsRawQuestions[i % count];
    const v = Math.floor(i / count);
    pool.push({ ...createPhysicsVariant(raw, v), code: `P${i + 1}` });
  }
  return pool;
}

export function getChemistryPool(): Omit<Question, 'id' | 'questionNumber' | 'section'>[] {
  const pool: Omit<Question, 'id' | 'questionNumber' | 'section'>[] = [];
  const count = chemistryRawQuestions.length;
  for (let i = 0; i < 125; i++) {
    const raw = chemistryRawQuestions[i % count];
    const v = Math.floor(i / count);
    pool.push({ ...createChemistryVariant(raw, v), code: `C${i + 1}` });
  }
  return pool;
}

export function getCSPool(): Omit<Question, 'id' | 'questionNumber' | 'section'>[] {
  const pool: Omit<Question, 'id' | 'questionNumber' | 'section'>[] = [];
  const count = csRawQuestions.length;
  for (let i = 0; i < 500; i++) {
    const raw = csRawQuestions[i % count];
    const v = Math.floor(i / count);
    pool.push({ ...createCSVariant(raw, v), code: `CS${i + 1}` });
  }
  return pool;
}

function shuffleOptionsAndAdjust(question: {
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  code?: string;
}) {
  const correctOptionText = question.options[question.correctOptionIndex];
  const shuffledOptions = shuffleArray(question.options);
  const newCorrectIndex = shuffledOptions.indexOf(correctOptionText);
  return {
    ...question,
    options: shuffledOptions,
    correctOptionIndex: newCorrectIndex !== -1 ? newCorrectIndex : question.correctOptionIndex
  };
}

/**
 * Iterates through curated raw lists to produce exactly 200 distinct 
 * questions for the mock exam, matching the actual TS ECET format and topics.
 * Shuffles questions and options dynamically so each retake is completely distinct.
 */
export function generateFull200Questions(branch: SubjectSection = 'Computer Science'): Question[] {
  const fullQuestions: Question[] = [];

  // 1. Math Questions (1 to 50): One random variant of each of the 50 base math questions to guarantee absolutely zero repeated topics/questions
  const mathBaseIndices = shuffleArray(Array.from({ length: 50 }, (_, i) => i));
  mathBaseIndices.forEach((baseIdx, i) => {
    const v = Math.floor(Math.random() * 5); // Pick a random variant (v from 0 to 4)
    const raw = mathRawQuestions[baseIdx];
    const questionWithCode = {
      ...createMathVariant(raw, v),
      code: `M${baseIdx + v * 50 + 1}`
    };
    const adjusted = shuffleOptionsAndAdjust(questionWithCode);
    fullQuestions.push({
      id: i + 1,
      section: 'Mathematics',
      questionNumber: i + 1,
      questionText: adjusted.questionText,
      options: adjusted.options,
      correctOptionIndex: adjusted.correctOptionIndex,
      explanation: adjusted.explanation,
      code: adjusted.code
    });
  });

  // 2. Physics Questions (51 to 75): One random variant of each of the 25 base physics questions to guarantee unique questions
  const physicsBaseIndices = shuffleArray(Array.from({ length: 25 }, (_, i) => i));
  physicsBaseIndices.forEach((baseIdx, i) => {
    const v = Math.floor(Math.random() * 5); // Pick a random variant (v from 0 to 4)
    const raw = physicsRawQuestions[baseIdx];
    const questionWithCode = {
      ...createPhysicsVariant(raw, v),
      code: `P${baseIdx + v * 25 + 1}`
    };
    const adjusted = shuffleOptionsAndAdjust(questionWithCode);
    fullQuestions.push({
      id: 51 + i,
      section: 'Physics',
      questionNumber: i + 1,
      questionText: adjusted.questionText,
      options: adjusted.options,
      correctOptionIndex: adjusted.correctOptionIndex,
      explanation: adjusted.explanation,
      code: adjusted.code
    });
  });

  // 3. Chemistry Questions (76 to 100): One random variant of each of the 25 base chemistry questions to guarantee unique questions
  const chemistryBaseIndices = shuffleArray(Array.from({ length: 25 }, (_, i) => i));
  chemistryBaseIndices.forEach((baseIdx, i) => {
    const v = Math.floor(Math.random() * 5); // Pick a random variant (v from 0 to 4)
    const raw = chemistryRawQuestions[baseIdx];
    const questionWithCode = {
      ...createChemistryVariant(raw, v),
      code: `C${baseIdx + v * 25 + 1}`
    };
    const adjusted = shuffleOptionsAndAdjust(questionWithCode);
    fullQuestions.push({
      id: 76 + i,
      section: 'Chemistry',
      questionNumber: i + 1,
      questionText: adjusted.questionText,
      options: adjusted.options,
      correctOptionIndex: adjusted.correctOptionIndex,
      explanation: adjusted.explanation,
      code: adjusted.code
    });
  });

  // 4. Engineering core questions (101 to 200): Select 100 questions from the total pool of the selected branch
  const branchRaw = getRawQuestionsForBranch(branch);
  
  const questionsPool: { raw: any; v: number; baseIdx: number }[] = [];
  branchRaw.forEach((raw, baseIdx) => {
    for (let v = 0; v < 5; v++) {
      questionsPool.push({ raw, v, baseIdx });
    }
  });

  // Shuffle the pool and pick exactly 100 questions
  const shuffledPool = shuffleArray(questionsPool);
  const selectedPool = shuffledPool.slice(0, 100);

  selectedPool.forEach((item, i) => {
    const questionWithCode = {
      ...createVariantForBranch(branch, item.raw, item.v),
      code: `${branch.slice(0, 2).toUpperCase()}${item.baseIdx + item.v * branchRaw.length + 1}`
    };
    const adjusted = shuffleOptionsAndAdjust(questionWithCode);
    fullQuestions.push({
      id: 101 + i,
      section: branch,
      questionNumber: 101 + i,
      questionText: adjusted.questionText,
      options: adjusted.options,
      correctOptionIndex: adjusted.correctOptionIndex,
      explanation: adjusted.explanation,
      code: adjusted.code
    });
  });

  return fullQuestions;
}

export const eceRawQuestions: Omit<Question, 'id' | 'questionNumber' | 'section'>[] = [
  {
    questionText: 'The dynamic resistance of an ideal p-n junction diode under forward bias is:',
    options: ['Directly proportional to forward current', 'Inversely proportional to forward current', 'Independent of current', 'Zero'],
    correctOptionIndex: 1,
    explanation: '$r_d = V_T / I_f$. Hence, forward dynamic resistance is inversely proportional to forward current.'
  },
  {
    questionText: 'The pinch-off voltage of a JFET is the drain-to-source voltage at which:',
    options: ['Drain current becomes maximum', 'Drain current becomes zero', 'Gate current becomes maximum', 'Channel is completely pinched off and drain current saturates'],
    correctOptionIndex: 3,
    explanation: 'At pinch-off voltage $V_P$, the depletion regions touch, pinching off the channel. Beyond this, drain current saturates.'
  },
  {
    questionText: 'A stable multivibrator has:',
    options: ['One stable state', 'Two stable states', 'No stable states', 'Three stable states'],
    correctOptionIndex: 2,
    explanation: 'An astable has zero stable states, monostable has one, bistable has two stable states.'
  },
  {
    questionText: 'The open loop gain of an ideal operational amplifier (Op-Amp) is:',
    options: ['Zero', 'Unity', 'Infinite', '100,000'],
    correctOptionIndex: 2,
    explanation: 'An ideal Op-Amp has infinite open-loop gain, infinite input impedance, and zero output impedance.'
  },
  {
    questionText: 'In amplitude modulation, the maximum modulation index for distortionless demodulation is:',
    options: ['0.5', '1.0', '1.5', '2.0'],
    correctOptionIndex: 1,
    explanation: 'For distortionless AM, the modulation index $m \\le 1$. If $m > 1$ (over-modulation), envelope distortion occurs.'
  },
  {
    questionText: 'The Shannon-Hartley channel capacity formula is:',
    options: ['$C = B \\log_2(1 + S/N)$', '$C = 2B \\log_2(S/N)$', '$C = B \\log_{10}(1 + S/N)$', '$C = B(1 + S/N)$'],
    correctOptionIndex: 0,
    explanation: 'The channel capacity $C$ in bits/sec is given by $C = B \\log_2(1 + S/N)$ where $B$ is bandwidth and $S/N$ is SNR.'
  },
  {
    questionText: 'The frequency range of the VHF band is:',
    options: ['3 to 30 MHz', '30 to 300 MHz', '300 to 3000 MHz', '3 to 30 GHz'],
    correctOptionIndex: 1,
    explanation: 'Very High Frequency (VHF) spans 30 MHz to 300 MHz.'
  },
  {
    questionText: 'A superheterodyne receiver with an intermediate frequency (IF) of 455 kHz is tuned to 1000 kHz. The image frequency is:',
    options: ['1455 kHz', '1910 kHz', '545 kHz', '910 kHz'],
    correctOptionIndex: 1,
    explanation: '$f_{image} = f_s + 2 \\times f_{IF} = 1000 + 2 \\times 455 = 1910 \\text{ kHz}$.'
  },
  {
    questionText: 'The number of flags in the 8085 microprocessor status register is:',
    options: ['3', '5', '8', '9'],
    correctOptionIndex: 1,
    explanation: 'The 8085 status register has 5 flags: Sign (S), Zero (Z), Auxiliary Carry (AC), Parity (P), and Carry (CY).'
  },
  {
    questionText: 'The standard sampling frequency for a speech signal band-limited to 3.4 kHz is:',
    options: ['4 kHz', '8 kHz', '16 kHz', '44.1 kHz'],
    correctOptionIndex: 1,
    explanation: 'For telephony speech up to 3.4 kHz, standard PCM systems sample at 8 kHz (exceeding the Nyquist rate of 6.8 kHz).'
  },
  {
    questionText: 'Which of the following feedback topologies increases both input and output impedance of an amplifier?',
    options: ['Voltage-series feedback', 'Current-series feedback', 'Voltage-shunt feedback', 'Current-shunt feedback'],
    correctOptionIndex: 1,
    explanation: 'Current-series feedback increases input impedance (series mixing) and increases output impedance (current sampling).'
  },
  {
    questionText: 'The resolution of an 8-bit DAC is:',
    options: ['1 in 256', '1 in 255', '1 in 128', '1 in 512'],
    correctOptionIndex: 1,
    explanation: 'Resolution of an n-bit DAC is $1 / (2^n - 1)$. For 8-bit, it is $1/255$.'
  },
  {
    questionText: 'A transmission line is distortionless if:',
    options: ['$R/G = L/C$', '$RC = LG$', '$R/L = G/C$', '$RL = GC$'],
    correctOptionIndex: 2,
    explanation: 'Heaviside\'s condition for a distortionless line is $R/L = G/C$ or $RC = LG$.'
  },
  {
    questionText: 'The radiation resistance of a half-wave dipole antenna in free space is approximately:',
    options: ['50 ohms', '73 ohms', '120 ohms', '300 ohms'],
    correctOptionIndex: 1,
    explanation: 'A thin half-wave dipole in free space has a radiation resistance of approximately 73 ohms.'
  },
  {
    questionText: 'In a cellular system, frequency reuse is employed to:',
    options: ['Increase channel capacity', 'Reduce co-channel interference', 'Increase coverage area', 'All of the above'],
    correctOptionIndex: 0,
    explanation: 'Frequency reuse is primarily used to increase the overall system capacity by repeating frequencies in non-adjacent cells.'
  },
  {
    questionText: 'A microprogrammable control unit is slower than a hardwired control unit because:',
    options: ['It requires more gates', 'It requires memory access for each microinstruction', 'It has longer instruction lengths', 'It lacks pipelines'],
    correctOptionIndex: 1,
    explanation: 'Microprogrammed control units fetch control words from control memory (ROM), which introduces additional memory access latency.'
  },
  {
    questionText: 'The logic family with the lowest power dissipation is:',
    options: ['TTL', 'ECL', 'CMOS', 'NMOS'],
    correctOptionIndex: 2,
    explanation: 'CMOS logic has negligible static power dissipation because one of the complementary transistors is always OFF.'
  },
  {
    questionText: 'Which diode is specifically used as a voltage-variable capacitor?',
    options: ['Zener diode', 'Schottky diode', 'Varactor diode', 'Tunnel diode'],
    correctOptionIndex: 2,
    explanation: 'A Varactor diode exploits the voltage-dependent transition capacitance of a reverse-biased junction.'
  },
  {
    questionText: 'The capture range of a Phase Locked Loop (PLL) is:',
    options: ['Always greater than lock-in range', 'Always less than lock-in range', 'Equal to lock-in range', 'Independent of frequency'],
    correctOptionIndex: 1,
    explanation: 'The capture range is always less than or equal to the lock-in range because lock-in is a tracking limit and capture is an acquisition limit.'
  },
  {
    questionText: 'In optical fibers, the principal mechanism of light propagation is:',
    options: ['Refraction', 'Total Internal Reflection', 'Diffraction', 'Dispersion'],
    correctOptionIndex: 1,
    explanation: 'Light is guided through the fiber core using Total Internal Reflection at the core-cladding boundary.'
  }
];

export const eeeRawQuestions: Omit<Question, 'id' | 'questionNumber' | 'section'>[] = [
  {
    questionText: 'The voltage regulation of an ideal transformer is:',
    options: ['0%', '5%', '10%', '100%'],
    correctOptionIndex: 0,
    explanation: 'An ideal transformer has zero winding resistance and leakage reactance, leading to 0% voltage regulation.'
  },
  {
    questionText: 'Under what condition does a DC shunt motor develop maximum output power?',
    options: ['Back EMF equals applied voltage', 'Back EMF is half of the applied voltage', 'Back EMF is twice the applied voltage', 'Winding losses are minimized'],
    correctOptionIndex: 1,
    explanation: 'Maximum power occurs when the back EMF $E_b$ is equal to half of the applied terminal voltage $V/2$.'
  },
  {
    questionText: 'The slip of an induction motor at starting is:',
    options: ['Zero', '0.5', '1.0', 'Infinite'],
    correctOptionIndex: 2,
    explanation: 'At start, rotor speed $N_r = 0$. Hence, slip $s = (N_s - N_r)/N_s = N_s/N_s = 1.0$.'
  },
  {
    questionText: 'In a synchronous motor, the V-curves represent the relation between:',
    options: ['Armature current and field current', 'Power factor and field current', 'Armature current and power factor', 'Torque and speed'],
    correctOptionIndex: 0,
    explanation: 'V-curves plot armature current ($I_a$) versus field current ($I_f$). Inverted V-curves plot power factor versus $I_f$.'
  },
  {
    questionText: 'The main purpose of a moderator in a nuclear power plant is to:',
    options: ['Cool the reactor core', 'Slow down the fast-moving neutrons', 'Control the fission reaction rate', 'Shield the radiation'],
    correctOptionIndex: 1,
    explanation: 'Moderators (like heavy water or graphite) slow down high-energy fast neutrons to thermal speeds to sustain fission.'
  },
  {
    questionText: 'Which relay is used for protection of transmission lines against phase faults?',
    options: ['Buchholz relay', 'Mho relay', 'Overcurrent relay', 'Thermal relay'],
    correctOptionIndex: 1,
    explanation: 'Distance relays like the Mho relay are standard for transmission line phase-fault protection.'
  },
  {
    questionText: 'The load factor of a power system is defined as the ratio of:',
    options: ['Average demand to maximum demand', 'Maximum demand to connected load', 'Average demand to connected load', 'System capacity to maximum demand'],
    correctOptionIndex: 0,
    explanation: 'Load factor is the ratio of Average Demand / Maximum Demand in a given period.'
  },
  {
    questionText: 'A 3-phase full-controlled bridge converter has a ripple frequency of:',
    options: ['$f$', '$3f$', '$6f$', '$12f$'],
    correctOptionIndex: 2,
    explanation: 'A 3-phase full converter (6-pulse) has a ripple frequency of $6f$, where $f$ is input frequency.'
  },
  {
    questionText: 'Which semiconductor device can be turned off by applying a negative gate current?',
    options: ['SCR', 'TRIAC', 'GTO', 'DIAC'],
    correctOptionIndex: 2,
    explanation: 'The GTO (Gate Turn-Off thyristor) can be turned ON by a positive gate pulse and turned OFF by a negative gate current.'
  },
  {
    questionText: 'The steady-state error of a Type-1 system to a unit step input is:',
    options: ['Zero', 'Constant', 'Infinite', '0.5'],
    correctOptionIndex: 0,
    explanation: 'For a Type-1 system, the position error constant $K_p = \\infty$. Hence, steady state error to step input $e_{ss} = 1/(1+K_p) = 0$.'
  },
  {
    questionText: 'The damping ratio $\\zeta$ of an critically damped system is:',
    options: ['Zero', 'Between 0 and 1', 'Exactly 1.0', 'Greater than 1.0'],
    correctOptionIndex: 2,
    explanation: 'Critical damping corresponds to $\\zeta = 1$. Underdamped is $\\zeta < 1$, overdamped is $\\zeta > 1$.'
  },
  {
    questionText: 'A Buchholz relay is used for the protection of:',
    options: ['Transmission lines', 'Generators', 'Transformers', 'Alternators'],
    correctOptionIndex: 2,
    explanation: 'Buchholz relays are gas-actuated protective devices for oil-immersed transformers.'
  },
  {
    questionText: 'The dielectric strength of SF6 gas is approximately:',
    options: ['Equal to air', '2 to 3 times that of air', '10 times that of air', 'Half of air'],
    correctOptionIndex: 1,
    explanation: 'Sulfur Hexafluoride ($SF_6$) has a dielectric strength approximately 2.5 to 3 times that of air.'
  },
  {
    questionText: 'In a synchronous generator, the armature reaction is purely demagnetizing when the load power factor is:',
    options: ['Unity', 'Zero lagging', 'Zero leading', '0.8 lagging'],
    correctOptionIndex: 1,
    explanation: 'Armature reaction is purely demagnetizing for synchronous generators at zero power factor lagging.'
  },
  {
    questionText: 'The speed of a DC series motor at no-load is:',
    options: ['Zero', 'Rated speed', 'Dangerously high', 'Constant'],
    correctOptionIndex: 2,
    explanation: 'At no load, armature current $I_a \\approx 0$, so flux $\\phi \\approx 0$. Since speed $N \\propto 1/\\phi$, the speed becomes dangerously high.'
  },
  {
    questionText: 'A pure inductive load connected to an AC source draws:',
    options: ['Active power only', 'Reactive power only', 'Both active and reactive power', 'Zero apparent power'],
    correctOptionIndex: 1,
    explanation: 'A pure inductor has a 90-degree phase shift; it consumes zero average active power ($P=0$) and draws only reactive power.'
  },
  {
    questionText: 'The skin effect in a transmission line conductor depends on:',
    options: ['Frequency of current', 'Diameter of conductor', 'Permeability of material', 'All of the above'],
    correctOptionIndex: 3,
    explanation: 'Skin effect increases with frequency, conductor size, and magnetic permeability.'
  },
  {
    questionText: 'A megger is primarily used to measure:',
    options: ['Very low resistances', 'High insulation resistance', 'Inductor Q-factor', 'AC current'],
    correctOptionIndex: 1,
    explanation: 'Meggers are portable instruments used to test high insulation resistance (in megohms).'
  },
  {
    questionText: 'The maximum efficiency of a DC generator occurs when:',
    options: ['Variable losses equal constant losses', 'Variable losses are zero', 'Constant losses are zero', 'Variable losses are twice constant losses'],
    correctOptionIndex: 0,
    explanation: 'Maximum efficiency occurs when variable copper losses equal constant rotational/iron losses.'
  },
  {
    questionText: 'Which instrument can be used to measure both AC and DC quantities?',
    options: ['Permanent Magnet Moving Coil (PMMC)', 'Moving Iron (MI) instrument', 'Induction type', 'None of the above'],
    correctOptionIndex: 1,
    explanation: 'Moving Iron (MI) instruments respond to the square of the current, allowing them to measure both AC and DC.'
  }
];

export const mechRawQuestions: Omit<Question, 'id' | 'questionNumber' | 'section'>[] = [
  {
    questionText: 'The ratio of lateral strain to linear strain is known as:',
    options: ['Young\'s modulus', 'Bulk modulus', 'Poisson\'s ratio', 'Modulus of rigidity'],
    correctOptionIndex: 2,
    explanation: 'Poisson\'s ratio is defined as the ratio of lateral strain to longitudinal (linear) strain.'
  },
  {
    questionText: 'A column is said to be a short column if its slenderness ratio is less than:',
    options: ['40', '80', '120', '200'],
    correctOptionIndex: 0,
    explanation: 'Columns are classified as short if their slenderness ratio is less than 40, and long if greater than 80-120.'
  },
  {
    questionText: 'The unit of kinematic viscosity is:',
    options: ['$N \\cdot s / m^2$', '$m^2 / s$', '$kg / m \\cdot s$', '$N \\cdot s^2 / m$'],
    correctOptionIndex: 1,
    explanation: 'Kinematic viscosity = Dynamic viscosity / Density. Its SI unit is $m^2 / s$ (also measured in Stokes).'
  },
  {
    questionText: 'The point in a fluid body where the total sum of hydrostatic pressure acts is the:',
    options: ['Center of gravity', 'Center of buoyancy', 'Center of pressure', 'Metacenter'],
    correctOptionIndex: 2,
    explanation: 'The Center of Pressure is the point on a submerged surface where the resultant hydrostatic force acts.'
  },
  {
    questionText: 'An ideal gas cycle used in petrol engines is the:',
    options: ['Otto cycle', 'Diesel cycle', 'Dual cycle', 'Carnot cycle'],
    correctOptionIndex: 0,
    explanation: 'The Otto cycle (constant volume heat addition) is the thermodynamic cycle of petrol (SI) engines.'
  },
  {
    questionText: 'The compression ratio of a standard diesel engine lies in the range of:',
    options: ['5 to 8', '8 to 12', '15 to 22', '25 to 30'],
    correctOptionIndex: 2,
    explanation: 'Diesel engines operate at high compression ratios, typically between 15 and 22, to enable compression ignition.'
  },
  {
    questionText: 'The dryness fraction of dry saturated steam is:',
    options: ['0.0', '0.5', '1.0', 'Infinite'],
    correctOptionIndex: 2,
    explanation: 'Dry saturated steam contains zero moisture, so its dryness fraction $x = 1.0$.'
  },
  {
    questionText: 'Which of the following is a water-tube boiler?',
    options: ['Lancashire boiler', 'Babcock and Wilcox boiler', 'Cochran boiler', 'Locomotive boiler'],
    correctOptionIndex: 1,
    explanation: 'Babcock & Wilcox is a classic high-pressure water-tube boiler. The others are fire-tube boilers.'
  },
  {
    questionText: 'The velocity of fluid flow at any point is measured using a:',
    options: ['Venturimeter', 'Orifice meter', 'Pitot tube', 'Rotameter'],
    correctOptionIndex: 2,
    explanation: 'A Pitot tube measures local velocity by converting kinetic energy of fluid flow to pressure energy.'
  },
  {
    questionText: 'The maximum draft angle provided on a pattern for easy withdrawal from a mold is typically:',
    options: ['0.5 to 2 degrees', '5 to 10 degrees', '15 to 20 degrees', '30 degrees'],
    correctOptionIndex: 0,
    explanation: 'Patterns are provided with a slight draft angle of 0.5 to 2 degrees to allow easy withdrawal without damaging mold walls.'
  },
  {
    questionText: 'The process of improving the surface finish and dimensional accuracy of a hole is:',
    options: ['Drilling', 'Reaming', 'Boring', 'Counterboring'],
    correctOptionIndex: 1,
    explanation: 'Reaming is a sizing and finishing operation performed on previously drilled holes.'
  },
  {
    questionText: 'In a bilateral tolerance system, the tolerance is allowed on:',
    options: ['One side of the nominal size', 'Both sides of the nominal size', 'Only positive direction', 'Only negative direction'],
    correctOptionIndex: 1,
    explanation: 'Bilateral tolerances specify deviations in both positive and negative directions relative to the nominal size.'
  },
  {
    questionText: 'The main constituent of high-speed steel (HSS) is:',
    options: ['Chromium', 'Tungsten', 'Vanadium', 'Nickel'],
    correctOptionIndex: 1,
    explanation: 'Standard 18-4-1 High-Speed Steel contains 18% Tungsten, 4% Chromium, and 1% Vanadium.'
  },
  {
    questionText: 'The relationship between Elastic Modulus (E), Shear Modulus (G), and Poisson\'s ratio ($\\nu$) is:',
    options: ['$E = 2G(1 + \\nu)$', '$E = 3G(1 - 2\\nu)$', '$E = 2G(1 - \\nu)$', '$E = G(1 + 2\\nu)$'],
    correctOptionIndex: 0,
    explanation: 'The standard elastic relationship is $E = 2G(1 + \\nu)$.'
  },
  {
    questionText: 'A thermodynamic process in which enthalpy remains constant is:',
    options: ['Isothermal', 'Adiabatic', 'Throttling', 'Isobaric'],
    correctOptionIndex: 2,
    explanation: 'Throttling is a highly irreversible steady-flow expansion process where enthalpy remains constant ($h_1 = h_2$).'
  },
  {
    questionText: 'The ratio of force of friction to the normal reaction is:',
    options: ['Coefficient of friction', 'Angle of friction', 'Angle of repose', 'Sliding friction'],
    correctOptionIndex: 0,
    explanation: 'The coefficient of friction $\\mu = F / N$ is the ratio of friction force to normal reaction.'
  },
  {
    questionText: 'The governing of steam turbines by varying the nozzle opening is called:',
    options: ['Throttle governing', 'Nozzle governing', 'By-pass governing', 'Emergency governing'],
    correctOptionIndex: 1,
    explanation: 'Nozzle governing controls speed by opening/closing selective nozzle groups to regulate steam flow.'
  },
  {
    questionText: 'Which mechanical property refers to the ability of a material to absorb energy up to fracture?',
    options: ['Resilience', 'Toughness', 'Hardness', 'Ductility'],
    correctOptionIndex: 1,
    explanation: 'Toughness is the total strain energy absorbed by a material per unit volume up to the point of fracture.'
  },
  {
    questionText: 'The power transmitted by a belt drive is maximum when the maximum tension ($T$) equals:',
    options: ['Centrifugal tension ($T_c$)', '$2 \\times T_c$', '$3 \\times T_c$', '$4 \\times T_c$'],
    correctOptionIndex: 2,
    explanation: 'For maximum power transmission in a belt drive, maximum allowable tension is $T = 3 T_c$.'
  },
  {
    questionText: 'In a refrigeration cycle, the heat is rejected by the refrigerant in the:',
    options: ['Evaporator', 'Compressor', 'Condenser', 'Expansion valve'],
    correctOptionIndex: 2,
    explanation: 'The refrigerant releases heat to the cooling medium and condenses into liquid within the Condenser.'
  }
];

export const civilRawQuestions: Omit<Question, 'id' | 'questionNumber' | 'section'>[] = [
  {
    questionText: 'The fundamental principle of surveying is to work from:',
    options: ['Part to whole', 'Whole to part', 'Lower to higher levels', 'None of the above'],
    correctOptionIndex: 1,
    explanation: 'Working from "whole to part" prevents accumulation of localized measurement errors.'
  },
  {
    questionText: 'The representative fraction (RF) of a scale 1 cm = 50 m is:',
    options: ['1/50', '1/500', '1/5000', '1/50000'],
    correctOptionIndex: 2,
    explanation: '$RF = 1 \\text{ cm} / 50 \\text{ m} = 1 \\text{ cm} / 5000 \\text{ cm} = 1/5000$.'
  },
  {
    questionText: 'The curvature of the Earth is taken into account in:',
    options: ['Plane surveying', 'Geodetic surveying', 'Topographic surveying', 'Hydrographic surveying'],
    correctOptionIndex: 1,
    explanation: 'Geodetic surveying covers large areas where the curved ellipsoidal shape of the Earth is taken into account.'
  },
  {
    questionText: 'The sum of interior angles of a closed traverse of \'n\' sides is:',
    options: ['$(2n - 4) \\times 90^\\circ$', '$(2n + 4) \\times 90^\\circ$', '$(n - 4) \\times 180^\\circ$', '$(n + 4) \\times 90^\\circ$'],
    correctOptionIndex: 0,
    explanation: 'The sum of interior angles is given by $(2n - 4) \\times 90$ degrees or $(n - 2) \\times 180$ degrees.'
  },
  {
    questionText: 'The stress at which a material elongates considerably without any significant increase in load is:',
    options: ['Elastic limit', 'Yield point', 'Ultimate stress', 'Breaking point'],
    correctOptionIndex: 1,
    explanation: 'At the yield point, plastic deformation begins and the material strains significantly with little or no load increment.'
  },
  {
    questionText: 'The bending moment at the free end of a cantilever beam carrying a uniformly distributed load is:',
    options: ['$w L^2 / 2$', '$w L^2 / 8$', 'Zero', '$w L$'],
    correctOptionIndex: 2,
    explanation: 'At the free end of a cantilever, there are no external forces or moments acting beyond it, so bending moment is zero.'
  },
  {
    questionText: 'The pressure of a fluid measured with respect to absolute vacuum is:',
    options: ['Gauge pressure', 'Vacuum pressure', 'Absolute pressure', 'Atmospheric pressure'],
    correctOptionIndex: 2,
    explanation: 'Absolute Pressure is referenced to an absolute zero vacuum ($P_{abs} = P_{atm} + P_{gauge}$).'
  },
  {
    questionText: 'The dynamic viscosity of a fluid is measured in Poise. One Poise is equal to:',
    options: ['$1 \\quad N \\cdot s / m^2$', '$0.1 \\quad N \\cdot s / m^2$', '$10 \\quad N \\cdot s / m^2$', '$9.81 \\quad N \\cdot s / m^2$'],
    correctOptionIndex: 1,
    explanation: 'One Poise is equal to 1 dyne-sec/cm², which is exactly $0.1 \\text{ N}\\cdot\\text{s}/m^2$ (or Pa·s).'
  },
  {
    questionText: 'The aggregate impact value for concrete used in road wear surfaces should not exceed:',
    options: ['15%', '30%', '45%', '60%'],
    correctOptionIndex: 1,
    explanation: 'For wearing surfaces like roads, the aggregate impact value must be under 30%. For general concrete, it is under 45%.'
  },
  {
    questionText: 'The standard size of a modular brick according to BIS is:',
    options: ['$19 \\times 9 \\times 9 \\text{ cm}$', '$20 \\times 10 \\times 10 \\text{ cm}$', '$22.5 \\times 11.2 \\times 7.5 \\text{ cm}$', '$19 \\times 10 \\times 10 \\text{ cm}$'],
    correctOptionIndex: 0,
    explanation: 'The standard modular brick dimension is $19 \\times 9 \\times 9$ cm. Nominal size including mortar is $20 \\times 10 \\times 10$ cm.'
  },
  {
    questionText: 'The consistency of cement paste is measured using:',
    options: ['Vicat apparatus', 'Le Chatelier apparatus', 'Slump cone', 'Blaine\'s apparatus'],
    correctOptionIndex: 0,
    explanation: 'The Vicat apparatus is used to determine normal consistency and setting times of cement.'
  },
  {
    questionText: 'A soil has a liquid limit of 45% and a plastic limit of 20%. Its plasticity index is:',
    options: ['15%', '25%', '65%', '2.25'],
    correctOptionIndex: 1,
    explanation: 'Plasticity Index ($I_p$) = Liquid Limit ($w_L$) - Plastic Limit ($w_P$) = $45\\% - 20\\% = 25\\%$.'
  },
  {
    questionText: 'The hydraulic gradient line (HGL) represents the sum of:',
    options: ['Datum head and pressure head', 'Pressure head and velocity head', 'Datum head and velocity head', 'Datum, pressure, and velocity heads'],
    correctOptionIndex: 0,
    explanation: 'HGL represents the sum of Potential (Datum) head and Pressure head ($z + P/\\rho g$). Total Energy Line (TEL) adds the Velocity head.'
  },
  {
    questionText: 'The maximum permissible turbidity in drinking water according to Indian standards is:',
    options: ['1 NTU', '5 NTU', '10 NTU', '25 NTU'],
    correctOptionIndex: 0,
    explanation: 'The acceptable limit of turbidity in drinking water is 1 NTU, with a cause for rejection limit of 5 NTU.'
  },
  {
    questionText: 'A concrete slump of 50-100 mm represents workability classified as:',
    options: ['Very low', 'Low', 'Medium', 'High'],
    correctOptionIndex: 2,
    explanation: 'A slump of 25-75 mm is low, 50-100 mm is medium, and 100-150 mm is high workability.'
  },
  {
    questionText: 'The critical depth ($y_c$) in a rectangular open channel flow is calculated as:',
    options: ['$(q^2 / g)^{1/3}$', '$q^2 / g$', '$(q / g)^{1/2}$', '$q^3 / g^2$'],
    correctOptionIndex: 0,
    explanation: 'Critical depth $y_c = (q^2 / g)^{1/3}$ where $q$ is discharge per unit width.'
  },
  {
    questionText: 'The quicksand condition is most likely to occur in:',
    options: ['Coarse gravel', 'Cohesive clays', 'Fine cohesionless sands', 'Stiff silt'],
    correctOptionIndex: 2,
    explanation: 'Quicksand occurs in fine cohesionless sands when the upward seepage pressure equals the submerged weight of the soil, reducing effective stress to zero.'
  },
  {
    questionText: 'In building construction, the damp-proof course (DPC) is typically provided at:',
    options: ['Foundation level', 'Plinth level', 'Lintel level', 'Roof level'],
    correctOptionIndex: 1,
    explanation: 'DPC is a continuous barrier laid at the plinth level to prevent ground moisture from rising up structural walls.'
  },
  {
    questionText: 'The radius of gyration of a column section is calculated as:',
    options: ['$I / A$', '$\\sqrt{I / A}$', '$\\sqrt{A / I}$', '$A / I$'],
    correctOptionIndex: 1,
    explanation: 'The radius of gyration is $r = \\sqrt{I / A}$ where $I$ is moment of inertia and $A$ is cross-sectional area.'
  },
  {
    questionText: 'Which chemical is universally used as a coagulant in municipal water treatment?',
    options: ['Alum', 'Chlorine', 'Bleaching powder', 'Copper sulfate'],
    correctOptionIndex: 0,
    explanation: 'Alum (Aluminum Sulfate) is the most widely used chemical coagulant in water purification.'
  }
];

function getRawQuestionsForBranch(branch: SubjectSection): Omit<Question, 'id' | 'questionNumber' | 'section'>[] {
  if (branch === 'Electronics & Communication') {
    return eceRawQuestions;
  } else if (branch === 'Electrical & Electronics') {
    return eeeRawQuestions;
  } else if (branch === 'Mechanical Engineering') {
    return mechRawQuestions;
  } else if (branch === 'Civil Engineering') {
    return civilRawQuestions;
  }
  return csRawQuestions;
}

function createVariantForBranch(
  branch: SubjectSection,
  raw: Omit<Question, 'id' | 'questionNumber' | 'section'>,
  variantIdx: number
): Omit<Question, 'id' | 'questionNumber' | 'section'> {
  if (variantIdx === 0) return raw;

  if (branch === 'Computer Science') {
    return createCSVariant(raw, variantIdx);
  }

  let text = raw.questionText;
  let options = [...raw.options];
  let correctIdx = raw.correctOptionIndex;
  let explanation = raw.explanation;

  const prefixes: Record<string, string[]> = {
    'Electronics & Communication': [
      'In state board electronics examinations: ',
      'Analyzing core digital and communication parameters: ',
      'With reference to semiconductor physics and microcontrollers, determine: ',
      'For any standard electronic hardware circuit setup: '
    ],
    'Electrical & Electronics': [
      'In state board electrical engineering assessments: ',
      'For heavy machine and electric drive analysis: ',
      'Considering power grid safety and circuit configurations: ',
      'With reference to alternating current (AC) systems, find: '
    ],
    'Mechanical Engineering': [
      'In standard mechanics and thermal engineering experiments: ',
      'Analyzing fluid dynamics and material strengths: ',
      'With reference to workshop technology and manufacturing: ',
      'Assuming ideal thermodynamic systems and cycles: '
    ],
    'Civil Engineering': [
      'According to Indian standard building codes and structural guidelines: ',
      'In modern land surveying and fluid flow assessments: ',
      'Analyzing concrete strengths and soil mechanics properties: ',
      'Considering standard environmental and hydraulic dynamics: '
    ]
  };

  const branchPrefixes = prefixes[branch as keyof typeof prefixes] || [
    'In state common entrance tests: ',
    'For core technical analysis: ',
    'With reference to previous examination papers: '
  ];

  text = `${branchPrefixes[(variantIdx - 1) % branchPrefixes.length]}${raw.questionText}`;
  return { questionText: text, options, correctOptionIndex: correctIdx, explanation };
}

export function generateSubjectQuestions(subject: SubjectSection, count: number = 50): Question[] {
  const fullQuestions: Question[] = [];
  
  if (subject === 'Mathematics') {
    const mathBaseIndices = shuffleArray(Array.from({ length: 50 }, (_, i) => i));
    mathBaseIndices.forEach((baseIdx, i) => {
      const v = Math.floor(Math.random() * 5);
      const raw = mathRawQuestions[baseIdx];
      const questionWithCode = {
        ...createMathVariant(raw, v),
        code: `M${baseIdx + v * 50 + 1}`
      };
      const adjusted = shuffleOptionsAndAdjust(questionWithCode);
      fullQuestions.push({
        id: i + 1,
        section: 'Mathematics',
        questionNumber: i + 1,
        questionText: adjusted.questionText,
        options: adjusted.options,
        correctOptionIndex: adjusted.correctOptionIndex,
        explanation: adjusted.explanation,
        code: adjusted.code
      });
    });
  } else if (subject === 'Physics') {
    const indicesList: { baseIdx: number; v: number }[] = [];
    for (let baseIdx = 0; baseIdx < 25; baseIdx++) {
      const variants = shuffleArray([0, 1, 2, 3, 4]).slice(0, 2);
      indicesList.push({ baseIdx, v: variants[0] });
      indicesList.push({ baseIdx, v: variants[1] });
    }
    const shuffledIndices = shuffleArray(indicesList);
    shuffledIndices.forEach((item, i) => {
      const raw = physicsRawQuestions[item.baseIdx];
      const questionWithCode = {
        ...createPhysicsVariant(raw, item.v),
        code: `P${item.baseIdx + item.v * 25 + 1}`
      };
      const adjusted = shuffleOptionsAndAdjust(questionWithCode);
      fullQuestions.push({
        id: i + 1,
        section: 'Physics',
        questionNumber: i + 1,
        questionText: adjusted.questionText,
        options: adjusted.options,
        correctOptionIndex: adjusted.correctOptionIndex,
        explanation: adjusted.explanation,
        code: adjusted.code
      });
    });
  } else if (subject === 'Chemistry') {
    const indicesList: { baseIdx: number; v: number }[] = [];
    for (let baseIdx = 0; baseIdx < 25; baseIdx++) {
      const variants = shuffleArray([0, 1, 2, 3, 4]).slice(0, 2);
      indicesList.push({ baseIdx, v: variants[0] });
      indicesList.push({ baseIdx, v: variants[1] });
    }
    const shuffledIndices = shuffleArray(indicesList);
    shuffledIndices.forEach((item, i) => {
      const raw = chemistryRawQuestions[item.baseIdx];
      const questionWithCode = {
        ...createChemistryVariant(raw, item.v),
        code: `C${item.baseIdx + item.v * 25 + 1}`
      };
      const adjusted = shuffleOptionsAndAdjust(questionWithCode);
      fullQuestions.push({
        id: i + 1,
        section: 'Chemistry',
        questionNumber: i + 1,
        questionText: adjusted.questionText,
        options: adjusted.options,
        correctOptionIndex: adjusted.correctOptionIndex,
        explanation: adjusted.explanation,
        code: adjusted.code
      });
    });
  } else {
    // Dynamic branch-specific questions generator
    const branchRaw = getRawQuestionsForBranch(subject);
    const questionsPool: { raw: any; v: number; baseIdx: number }[] = [];
    branchRaw.forEach((raw, baseIdx) => {
      for (let v = 0; v < 5; v++) {
        questionsPool.push({ raw, v, baseIdx });
      }
    });
    const shuffledPool = shuffleArray(questionsPool);
    const selectedPool = shuffledPool.slice(0, Math.min(count, shuffledPool.length));
    
    selectedPool.forEach((item, i) => {
      const questionWithCode = {
        ...createVariantForBranch(subject, item.raw, item.v),
        code: `${subject.slice(0, 2).toUpperCase()}${item.baseIdx + item.v * branchRaw.length + 1}`
      };
      const adjusted = shuffleOptionsAndAdjust(questionWithCode);
      fullQuestions.push({
        id: i + 1,
        section: subject,
        questionNumber: i + 1,
        questionText: adjusted.questionText,
        options: adjusted.options,
        correctOptionIndex: adjusted.correctOptionIndex,
        explanation: adjusted.explanation,
        code: adjusted.code
      });
    });
  }

  return fullQuestions;
}
