// import your controllers here

export default function bindRoutes(app) {
  app.get('/', (req, res) => {
    res.render('home');
  });
}
