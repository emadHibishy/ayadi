const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/isAuth');
const shopController = require('../controllers/shop');
const adminController = require('../controllers/admin');

router.get('/',shopController.getWelcome);

router.get('/profile/addProduct',isAuth,adminController.getAddProduct);

router.post('/profile/addProduct',adminController.postAddProduct);

router.get('/profile/editProduct/:productId',isAuth,adminController.getEditProduct);

router.post('/profile/editProduct',adminController.postEditProduct);

router.get('/home',shopController.getHome);

router.get('/home/category/crochet',shopController.getCrochet);

router.get('/home/category/glassPainting',shopController.getGlassPainting);

router.get('/home/category/portrait',shopController.getPortrait);

router.get('/home/users',shopController.getUsers)

router.post('/profile/deleteProduct',adminController.postDeleteProduct);

router.get('/profile/:userId',adminController.getProfile);

router.get('/cart',isAuth, shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/cart-delete-item', shopController.postCartDeleteProduct);

router.get('/checkout',isAuth, shopController.getCheckout);

router.get('/checkout/success', shopController.getCheckoutSuccess);

router.get('/checkout/cancel', shopController.getCheckout);

router.get('/orders',isAuth,shopController.getOrders);

router.post('/profile/productLike/:productId',adminController.postProfileLike);

router.post('/home/productLike/:productId',shopController.postHomeLike);

module.exports = router;