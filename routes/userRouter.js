let express = require('express');
let router = express.Router();
let userController = require('../controllers/userController');
const { route } = require('./indexRouter');

router.get('/login', (req, res) => {
  res.render('login', {banner: 'Log In'});
})

router.post('/login', (req, res, next) => {
  let email = req.body.username;
  let password = req.body.password;

  userController
  .getUserByEmail(email)
  .then(user => {
    if(user) {
      if (userController.comparePassword(password, user.password)) {
        req.session.user = user;
        res.redirect('/');
      } else {
        res.render('login', {
          message: 'Incorrect Password!',
          type: 'alert-danger'
        });
      }      
    } else {
      res.render('login', {
        message: 'Email does not exists!',
        type: 'alert-danger'
      })
    }
  })
});

router.get('/register', (req, res) => {
  res.render('register', {banner: 'Register'});
})

router.post('/register', (req, res, next) => {
  let fullname = req.body.fullname;
  let email = req.body.username;
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;
  let keepLoggedIn = (req.body.keepLoggedIn != undefined);

  if(password != confirmPassword) {
    return res.render('register', {
      message: 'Password does not match!',
      type: 'alert-danger'      
    });
  }

  userController
  .getUserByEmail(email)
  .then(user => {
    if(user) {
      return res.render('register', {
        message: `Email ${email} exists! Please choose another email!`,
        type: 'alert-danger'
      });
    }

    user = {
      fullname,
      username: email,
      password
    };

    return userController
      .createUser(user)
      .then(user => {
        if(keepLoggedIn) {
          req.session.user = user;
          res.redirect('/');
        } else {
          res.render('login', {
            message: 'You have registered. Please log in!',
            type: 'alert-primary'
          });
        }
      });    
  })
  .catch(err => next(err));
});

router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if(err) {
      return next(err);
    }
    return res.redirect('/users/login');
  })
});


module.exports = router;