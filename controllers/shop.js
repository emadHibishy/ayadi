const Product = require('../models/products')
const User = require('../models/user');
const Like = require('../models/like');
const sequelize = require('sequelize');
const Cart = require('../models/cart');
const stripe = require('stripe')('sk_test_51GvXeGHVGbfBrYDIVVR9Ahsu1ht1JOhz6kgxB9WfifIKkPwiZB8TANDjrDdqGaaEHLbRepjtT2JjlOv3rOXcJkcN00TwqCiiLW')

exports.getWelcome = (req,res,next)=>{
    res.render('welcome/welcome')
}
exports.getHome = (req,res,next)=>{
    User
        .findAll({
            where:{
                type:"Handcraft"
        }})
        .then(users=>{
            Product
                .findAll()
                .then(products=>{
                    res.render('Home/home',{
                        prods:products,
                        user:req.session.user,
                        handcrafts:users,
                        pageTitle: "Products"
                    })  
            })
        })
        .catch(err=>{
            console.log(err);
        })
    
        
}

exports.getCrochet = (req,res,next)=>{
    User
        .findAll({
            where:{
                type:"Handcraft"
        }})
        .then(users=>{
            Product
                .findAll({
                    where:{
                        type:"Crochet"
                    }})
                .then(products=>{
                    res.render('Home/home',{
                        prods:products,
                        user:req.user,
                        handcrafts:users,
                        pageTitle: "Crochet"
                    })  
            })
        })
        .catch(err=>{
            console.log(err);
        })
}

exports.getPortrait = (req,res,next)=>{
    User
        .findAll({
            where:{
                type:"Handcraft"
        }})
        .then(users=>{
            Product
                .findAll({
                    where:{
                        type:"Portrait"
                    }})
                .then(products=>{
                    res.render('Home/home',{
                        prods:products,
                        user:req.user,
                        handcrafts:users,
                        pageTitle: "Portrait"
                    })  
            })
        })
        .catch(err=>{
            console.log(err);
        })
}

exports.getGlassPainting = (req,res,next)=>{
    User
        .findAll({
            where:{
                type:"Handcraft"
        }})
        .then(users=>{
            Product
                .findAll({
                    where:{
                        type:"Glass Painting"
                    }})
                .then(products=>{
                    res.render('Home/home',{
                        prods:products,
                        user:req.user,
                        handcrafts:users,
                        pageTitle: "Glass Painting"
                    })  
            })
        })
        .catch(err=>{
            console.log(err);
        })
}

exports.getUsers = (req,res,next)=>{
    User
        .findAll({
            where:{
                type:"Handcraft"
        }})
        .then(users=>{
            res.render('users/users',{
                user:req.user,
                handcrafts:users,
                pageTitle: "Handcrafts"
            })
        })
        .catch(err=>{
            console.log(err)
        })
}

exports.getCart = (req, res, next) => {
    req.user
      .getCart()
      .then(cart => {
        return cart
          .getProducts()
          .then(products => {
            User
                .findAll({
                    where:{
                        type:'Handcraft'
                    }
                })
                .then(handcrafts=>{
                    res.render('Home/cart', {
                        pageTitle: 'Your Cart',
                        user:req.user,
                        handcrafts:handcrafts,
                        products: products
                      });
                })
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
};
  
  exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    console.log(prodId)
    req.user
      .getCart()
      .then(cart => {
        fetchedCart = cart;
        return cart.getProducts({ where: { id: prodId } });
      })
      .then(products => {
        let product;
        if (products.length > 0) {
          product = products[0];
        }
  
        if (product) {
          const oldQuantity = product.cartItem.quantity;
          newQuantity = oldQuantity + 1;
          return product;
        }
        return Product.findByPk(prodId);
      })
      .then(product => {
        return fetchedCart.addProduct(product, {
          through: { quantity: newQuantity }
        });
      })
      .then(() => {
        res.redirect('/cart');
      })
      .catch(err => console.log(err));
  };

  exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
        .getCart()
        .then(cart=>{
            return cart
                    .getProducts({
                        where:{
                            id:prodId
                        }
                    })
        })
        .then(products=>{
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(()=>{
            res.redirect('/cart')
        })
        .catch(err=>{
            console.log(err)
        })
}

exports.getCheckout = (req, res, next) => {
    req.user
      .getCart()
      .then(cart => {
        return cart
          .getProducts()
          .then(products => {
                    return stripe.checkout.sessions.create({
                        payment_method_types:['card'],
                        line_items: products.map(p =>{
                            console.log(p.price)
                                return{
                                    name:p.describtion,
                                    amount :p.price * 100,
                                    currency: 'egp',
                                    quantity:p.cartItem.quantity
                                }; 
                        }),
                        success_url: req.protocol + '://' + req.get('host') + '/checkout/success', 
                        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
                    }) .then((session)=>{
                        User
                        .findAll({
                            where:{
                                type:'Handcraft'
                            }
                        })
                        .then(handcrafts=>{
                        res.render('Home/checkout', {
                            pageTitle: 'Checkout',
                            user:req.user,
                            handcrafts:handcrafts,
                            products: products,
                            sessionId:session.id
                          });
                    })
                })
                
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
};

exports.getCheckoutSuccess = (req, res, next) => {
    let fetchedCart;
    req.user
      .getCart()
      .then(cart => {
        fetchedCart = cart;
        return cart.getProducts();
      })
      .then(products => {
        return req.user
          .createOrder()
          .then(order => {
            return order.addProducts(
              products.map(product => {
                product.orderItem = { quantity: product.cartItem.quantity };
                return product;
              })
            );
          })
          .catch(err => console.log(err));
      })
      .then(result => {
        return fetchedCart.setProducts(null);
      })
      .then(result => {
        res.redirect('/orders');
      })
      .catch(err => console.log(err));
  };

exports.getOrders = (req, res, next) => {
    req.user
      .getOrders({include: ['products']})
      .then(orders => {
        res.render('Home/orders', {
          path: '/orders',
          user:req.session.user,
          orders: orders
        });
      })
      .catch(err => console.log(err));
  };


  exports.postHomeLike = (req,res,next)=>{
    const prodId = req.body.productId;
            Like.findOne({where:{
                userId: req.user.id ,
                productId: prodId}})
                .then(user=>{
                    if(!user){
                        Product
                        .findByPk(prodId)
                        .then(product=>{
                            req.user
                            .addProduct(product)
                            .then(()=>{
                                Like.findAll({
                                    attributes: [[sequelize.fn('COUNT', sequelize.col('productId')), 'productLikes']],
                                    where:{productId:prodId}
                                  })
                                .then(productLikes=>{
                                    let prodLikes = productLikes[0].dataValues.productLikes;
                                    Product
                                        .update({
                                        likes: prodLikes,
                                    }, {
                                        where: {
                                        id: prodId
                                        }
                                    })
                                })
                            })
                        })
                        .catch(err=>{
                            console.log(err)
                        })
                    }
                })
            res.redirect('/home')
}