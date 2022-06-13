lass ItemController {
  constructor (db){
    this.db = db;
  }

  async showItems (req, res) {
    const listOfItems = items;
    res.render('index', {listOfItems});
  }
};

export default ItemController;