var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');

var Product = require('../models/product');
var Order = require('../models/order');

var User = require('../models/user');

/* GET home page. */
router.get('/products', function (req, res, next) {
  var successMsg = req.flash('success')[0];
  // Fetching all products
  Product.find(function (err, docs) {
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('shop/products', { title: 'המוצרים שלנו', products: productChunks, successMsg: successMsg, noMessage: !successMsg });
  }).lean();
});

router.get('/', function (req, res, next) {
  res.render('shop/index', { title: 'תל-חי מרקט' });
});

router.get('/add-to-cart/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function (err, product) {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/products');
  });
});

router.get('/addOne/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.addByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/reduce/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});


router.get('/remove/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/remove-all', function (req, res, next) {
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.removeAllItems();
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function (req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', { products: null });
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', { title: 'עגלת קניות', products: cart.generateArray(), totalPrice: cart.totalPrice })
});

/* 
router.get('/admin/orders', function (req, res, next) {
  res.render('user/admin');
}); */

router.get('/admin/orders', isLoggedIn, isAdmin, function (req, res, next) {
  Order.find(function (err, orders) {
    if (err) {
      return res.write('שגיאה!');
    }
    var cart;
    orders.forEach(function (order) {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render('user/admin', { title: 'פאנל ניהול אדמין', AllOrders: orders });
  });
});

router.get('/checkout', isLoggedIn, function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', {title: 'צק אאוט', total: cart.totalPrice, errMsg: errMsg, noError: !errMsg });
});

router.post('/checkout', isLoggedIn, function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);

  var stripe = require("stripe")(
    "sk_test_51JHENVCkUsU7UWsFgI9xXWt3kZpv7waUaWh2wG07GbYhlSHYIjKI6GKA8UjlSEyv36512IKf0IiyZIDSdle3CiiP00FQ1GzOWs"
  );

  stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "ils",
    source: req.body.stripeToken,
    description: "Test Charge"
  }, function (err, charge) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/checkout');
    }

    var order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id
    });
    order.save(function (err, result) {

      req.flash('success', 'הזמנתך נקלטה בהצלחה במערכת!');
      req.session.cart = null;
      res.redirect('/products');
    });
  });
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}

function isAdmin(req, res, next) {
  if (req.user.role == '1') {
    return next();
  }
  res.redirect('/');
}