let express = require('express');
const { redirect } = require('express/lib/response');
let router = express.Router();
let userController = require('../controllers/userController');

router.post('/', userController.isLoggedIn, (req, res, next) => {
  let controller = require('../controllers/reviewController');
  let review = {
    userId: req.session.user.id,
    productId: req.body.productId,
    rating: req.body.rating,
    message: req.body.message
  };

  console.log(review.productId)

  controller
  .add(review)
  .then(() => {
    res.redirect('/products/' + review.productId)
  })
  .catch(err => next(err))
})


module.exports = router;