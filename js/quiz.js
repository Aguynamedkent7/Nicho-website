// Multiple-choice quiz with instant feedback and a running score.
import { QUIZ } from './data.js';

const root = document.getElementById('quiz');
const scoreEl = document.getElementById('quiz-score');
let score = 0;
let answered = 0;

QUIZ.forEach((item, qi) => {
  const card = document.createElement('fieldset');
  card.className = 'quiz-card reveal';
  card.innerHTML = `<legend>${qi + 1}. ${item.q}</legend>`;
  item.a.forEach((text, ai) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = text;
    b.addEventListener('click', () => {
      const right = ai === item.ok;
      card.querySelectorAll('button').forEach((x, xi) => {
        x.disabled = true;
        if (xi === item.ok) x.classList.add('right');
      });
      if (!right) b.classList.add('wrong');
      score += right ? 1 : 0;
      answered += 1;
      scoreEl.textContent = `Score: ${score} / ${answered}`
        + (answered === QUIZ.length ? (score === QUIZ.length ? ' — perfect!' : ' — done!') : '');
    });
    card.appendChild(b);
  });
  root.appendChild(card);
});

document.getElementById('quiz-reset').addEventListener('click', () => {
  score = 0;
  answered = 0;
  scoreEl.textContent = 'Score: 0 / 0';
  root.querySelectorAll('button').forEach((b) => {
    b.disabled = false;
    b.classList.remove('right', 'wrong');
  });
});
