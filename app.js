const express = require('express');
const path = require('path');

const shop = require('./routes/shop');
const auth = require('./routes/auth');

const Sequelize = require('sequelize');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const bodyParser = require('body-parser');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const sequel = require('./util/database');
const Product = require('./models/products');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');
const Like = require('./models/like')

const multer = require('multer');
const fileStorage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'image');
    },
    filename: (req,file,cb)=>{
        cb(null,file.filename + '-' + file.originalname);
    }
})

const fileFilter = (req,file,cb)=>{
    if( file.mimetype === 'image/jpg' || 
        file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpeg'
        ){
        cb(null,true);
    } else {
        cb(null,false);
    }
}

const csrf = require('csurf');
const csrfProtection = csrf();

const flash = require('connect-flash');


const sequelize = new Sequelize(
    'online_shop',
    'root',
    '01146581234',{ 
    dialect: 'mysql',
        "storage": "./session.mysql"
    });

const myStore = new SequelizeStore({db:sequelize});

io.on('connection',socket =>{
    require('./sockets/init.sockets')(socket);
})

app.set('view engine','ejs');
app.set('views','views');



app.use(bodyParser.urlencoded({extended:false}))
app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single('image'))

app.use('/image',express.static(path.join(__dirname,'image')))
app.use(express.static(path.join(__dirname,'views')))

app.use(
    session({
        secret:'My Secret',
        store: myStore ,
        resave:false,
        saveUninitialized:false
    })
);

myStore.sync();

app.use(csrfProtection);

app.use(flash());

app.use((req,res,next)=>{
   if(!req.session.user){
       return next();
   } else {
    User.findByPk(req.session.user.id)
    .then(user=>{
        req.user = user;
        if(user){
            user.createCart();
        }
        next();
    })
    .catch(err=>{
        console.log(err)
    })
    
   }
    
})
app.use((req,res,next)=>{
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use(shop);
app.use(auth);

Product.belongsToMany(User, { through: Like });
User.belongsToMany(Product, { through: Like });
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through:OrderItem});



sequel
   //.sync({force:true})
   .sync()
    .then(()=>{
    
        server.listen(1080);
    })
    .catch(err=>{
        console.log(err);
    })

