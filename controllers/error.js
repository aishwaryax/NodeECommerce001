exports.get404 = (req, res, next) => {
  res.status(404).render('errors/404', { pageTitle: 'Page Not Found', path: '/404', isAuthenticated: req.isLoggedIn })
}

exports.get500 = (req, res, next) => {
  res.status(500).render('errors/500', { pageTitle: 'Page Not Found', path: '/500', isAuthenticated: req.isLoggedIn })
}

