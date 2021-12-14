const router = require("express").Router();
const mongoose = require('mongoose')

const bcrypt = require('bcryptjs');
//poner las cosas del bcryptjs
const User = require('../models/User.model');

const saltRounds = 10;




/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/sign-up', (req, res, next) =>{
  res.render('sign-up');
 });

router.post('/sign-up', (req, res, next) =>{
  const { username, password } = req.body;

  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);

  User.create({
    username,
    hashedPassword
  })
  .then(x =>{
    res.redirect('/');
  })
  .catch(error => {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render('auth/signup', { errorMessage: error.message });
    } else if (error.code === 11000) {
      res.status(500).render('auth/signup', {
         errorMessage: 'Username and email need to be unique. Either username or email is already used.'
      });
    } else {
      next(error);
    }
  })
})

module.exports = router;
