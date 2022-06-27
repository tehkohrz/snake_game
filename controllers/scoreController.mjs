export default class InitScoreController {
  constructor(db) {
    this.db = db;
  }

  getHighscores = async (req, res) => {
    try {
      const database = this.db;
      // If there are no highscores the return is null
      const highscore = await database.findAll();
      // Sort the highscore in descending order
      const sortedHighscore = highscore.sort((a, b) => {
        if (a.score > b.score) {
          return -1;
        }
        if (a.score < b.score) {
          return 1;
        }
        return 0;
      });
      res.json(sortedHighscore);
    } catch (err) {
      console.log('getHighscore', err);
      res.json(err.message);
    }
  };

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
