let express = require('express');
const { redirect } = require('express/lib/response');
let router = express.Router();

router.post('/', (req, res, next) => {
  let controller = require('../controllers/reviewController');
  let review = {
    userId: 1,
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