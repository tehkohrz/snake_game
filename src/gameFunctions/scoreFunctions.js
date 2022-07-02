import axios from 'axios';

// Checks current highscore against past highscore
// Output true to highlight 'NEW' highscore
async function checkHighScore(score) {
  try {
    // send highscore to DB to check and update user table
    // Return true/false if new highscore
    const userHighscore = await axios.post('/getScore', { score });
    // Post score to community score table
    if (score > 0) {
      const newScore = await axios.post('/postHighscore', { score });
    }
    return userHighscore;
  } catch (err) {
    console.log('Score function Error', err);
  }
}

async function getHighScore() {
  try {
    const res = await axios.get('/highScore');
    return res.data.sortedHighscore;
  } catch (err) {
    console.log('Score function Error', err);
  }
}
// Get sorted high score from DB

function renderHighscore(highscore) {
  const scoreBoard = document.getElementById('scoreBoard');
  // Remove last rendered highscores
  if (scoreBoard.innerHTML) {
    scoreBoard.innerHTML = '';
  }
  // Insert row for scoreheader
  const title = document.createElement('h1');
  title.innerText = 'Highscore';
  scoreBoard.appendChild(title);
  const rowTitle = document.createElement('div');
  rowTitle.classList.add('row');
  rowTitle.classList.add('scoreHeader');
  const positionTitle = document.createElement('div');
  positionTitle.classList.add('scoreEntry');
  positionTitle.classList.add('col-2');
  const nameTitle = document.createElement('div');
  nameTitle.classList.add('col-6');
  nameTitle.classList.add('scoreEntry');
  nameTitle.innerText = 'Name';
  const scoreTitle = document.createElement('div');
  scoreTitle.classList.add('col-4');
  scoreTitle.classList.add('scoreEntry');
  scoreTitle.innerText = 'Score';
  rowTitle.appendChild(positionTitle);
  rowTitle.appendChild(nameTitle);
  rowTitle.appendChild(scoreTitle);
  scoreBoard.appendChild(rowTitle);
  // Render top 10 highscores
  const highScoreContainer = document.createElement('div');
  highScoreContainer.id = 'highScoreContainer';
  highScoreContainer.classList.add('row');
  scoreBoard.appendChild(highScoreContainer);
  console.log(highscore[0].id);
  for (let i = 0; i < 10; i += 1) {
    const row = document.createElement('div');
    row.classList.add('row');
    const position = document.createElement('div');
    position.classList.add('scoreEntry');
    position.classList.add('col-2');
    position.innerText = i + 1;
    const name = document.createElement('div');
    name.classList.add('scoreEntry');
    name.classList.add('col-6');
    name.innerText = highscore[i].name;
    const score = document.createElement('div');
    score.classList.add('scoreEntry');
    score.classList.add('col-4');
    score.innerText = highscore[i].score;
    row.appendChild(position);
    row.appendChild(name);
    row.appendChild(score);
    highScoreContainer.appendChild(row);
  }
}

export { checkHighScore, renderHighscore, getHighScore };
