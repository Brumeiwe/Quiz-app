let questions = [];
let currentIndex = 0;
let selectedOption = null;
let score = 0;
let timer = 60;
let timerInterval = null;
let totalQuestions = 10;

const startPage = document.getElementById('start-page');
const quizPage = document.getElementById('quiz-page');
const quizContainer = document.getElementById('quiz-container');
const submitBtn = document.getElementById('submit');
const nextBtn = document.getElementById('next');
const scoreDiv = document.getElementById('score');
const timerDiv = document.querySelector('.timer');
const counterDiv = document.getElementById('question-counter');
const numQuestionsInput = document.getElementById('num-questions');
const startBtn = document.getElementById('start-quiz');
const themeBtn = document.getElementById('theme-btn');

// Dark/Light Mode
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  if (document.body.classList.contains('dark')) {
    themeBtn.innerText = "☀️ Light Mode";
  } else {
    themeBtn.innerText = "🌙 Dark Mode";
  }
});

// Disable start button until questions load
startBtn.disabled = true;

// Shuffle function
function shuffleArray(array) {
  for (let i = array.length -1; i>0; i--){
    const j = Math.floor(Math.random()*(i+1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Fetch questions
fetch('questions.json')
  .then(res => res.json())
  .then(data => {
    questions = shuffleArray(data);
    numQuestionsInput.max = questions.length;
    document.querySelector('.info').innerText = `There are ${questions.length} available questions from the provided text.`;
    startBtn.disabled = false;
  })
  .catch(err => {
    console.error(err);
    alert("Failed to load questions. Check questions.json file.");
  });

// Start Quiz
startBtn.addEventListener('click', () => {
  let inputVal = parseInt(numQuestionsInput.value);
  if (isNaN(inputVal) || inputVal <1 || inputVal>questions.length) {
    alert(`Please enter a number between 1 and ${questions.length}`);
    return;
  }
  totalQuestions = inputVal;
  currentIndex = 0;
  score = 0;
  startPage.style.display = 'none';
  quizPage.style.display = 'block';
  renderQuestion();
});

// Timer
function startTimer() {
  clearInterval(timerInterval);
  timer = 60;
  timerDiv.innerText = `${timer}s`;
  timerInterval = setInterval(()=>{
    timer--;
    timerDiv.innerText = `${timer}s`;
    if(timer<=0) clearInterval(timerInterval);
  },1000);
}

// Render question
function renderQuestion() {
  selectedOption = null;
  startTimer();
  const q = questions[currentIndex];
  counterDiv.innerText = `Question ${currentIndex+1} of ${totalQuestions}`;
  if(q.options && q.options.length>0){
    q.options = shuffleArray(q.options);
    quizContainer.innerHTML = `
      <div class="question">
        <h3>${q.question}</h3>
        <div class="options">
          ${q.options.map(option => `<button>${option}</button>`).join('')}
        </div>
      </div>
    `;
    document.querySelectorAll('.options button').forEach(button=>{
      button.addEventListener('click', ()=>{
        document.querySelectorAll('.options button').forEach(btn=>btn.classList.remove('selected'));
        button.classList.add('selected');
        selectedOption = button;
      });
    });
  } else {
    quizContainer.innerHTML = `
      <div class="question">
        <h3>${q.question}</h3>
        <input type="text" id="answer-input" placeholder="Type your answer here" />
      </div>
    `;
  }
  submitBtn.style.display='inline-block';
  nextBtn.classList.remove('enabled');
}

// Submit Answer
submitBtn.addEventListener('click', ()=>{
  const q = questions[currentIndex];
  if(q.options && q.options.length>0){
    if(!selectedOption) return alert('Please select an answer!');
    if(selectedOption.innerText===q.answer){
      selectedOption.classList.add('correct');
      score++;
    } else {
      selectedOption.classList.add('wrong');
      document.querySelectorAll('.options button').forEach(btn=>{
        if(btn.innerText===q.answer) btn.classList.add('correct');
      });
    }
  } else {
    const input = document.getElementById('answer-input');
    if(!input.value.trim()) return alert('Please type your answer!');
    if(input.value.trim().toLowerCase()===q.answer.toLowerCase()){
      score++;
      input.style.border='2px solid #00c853';
      input.style.backgroundColor='#b9f6ca';
    } else {
      input.style.border='2px solid #d50000';
      input.style.backgroundColor='#ff8a80';
    }
  }
  clearInterval(timerInterval);
  nextBtn.classList.add('enabled');
});

// Next Question
nextBtn.addEventListener('click', ()=>{
  currentIndex++;
  if(currentIndex<totalQuestions){
    renderQuestion();
  } else {
    const percentage = Math.round((score/totalQuestions)*100);
    quizContainer.innerHTML = `
      <h2>Quiz Complete! 🎉</h2>
      <p>You answered <strong>${score}</strong> out of <strong>${totalQuestions}</strong> questions correctly.</p>
      <p>Your <strong>Final Score</strong> is: <strong>${percentage}%</strong></p>
      <button id="restart">Take Another Quiz</button>
    `;
    submitBtn.style.display='none';
    nextBtn.style.display='none';
    timerDiv.style.display='none';
    counterDiv.style.display='none';

    document.getElementById('restart').addEventListener('click', ()=>{
      currentIndex=0;
      score=0;
      timerDiv.style.display='block';
      counterDiv.style.display='block';
      startPage.style.display='block';
      quizPage.style.display='none';
      submitBtn.style.display='inline-block';
      nextBtn.style.display='inline-block';
    });
  }
});
