export default class InitScoreController {
  constructor(db) {
    this.db = db;
  }

  insertHighscore = async (req, res) => {
    try {
      const database = this.db;
      console.log('Insert new score', req.body);
      const newScore = await database.Score.create({
        name: req.cookies.username,
        score: req.body.score,
        created_at: Date.now(),
        updated_at: Date.now(),
      });
      res.json({ newScore });
    } catch (err) {
      console.log('Score insert Error', err);
    }
  };

  getHighscores = async (req, res) => {
    try {
      const database = this.db;
      // If there are no highscores the return is null
      const highscore = await database.Score.findAll();
      let sortedHighscore = highscore;
      if (highscore.length > 0) {
      // Sort the highscore in descending order
        sortedHighscore = highscore.sort((a, b) => {
          if (a.score > b.score) {
            return -1;
          }
          if (a.score < b.score) {
            return 1;
          }
          return 0;
        });
      }
      res.json({ sortedHighscore });
    } catch (err) {
      console.log('getHighscore', err);
      res.json(err.message);
    }
  };

  // NOT USED - for a different way to maintain highscore by keeping only 10 top scores
  updateHighscore = async (req, res) => {
    try {
      const database = this.db;
      // Retrieve highscore, index and new user
      const { score, scoreId, username } = req.body;
      const highscore = await database.Score.findOne({
        where: {
          id: scoreId,
        },
      });
      // Update the entry
      highscore.score = score;
      highscore.username = username;
      highscore.updated_at = Date.now();
      highscore.save();
    } catch (err) {
      console.log('updateHighscore', err);
      res.json(err.message);
    }
  };
}
