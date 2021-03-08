var Product = require('../../../models/products')

var Likes=0;
        function like(){
            Likes++
            Product.update({likes:Likes})
            document.getElementById('love').innerHTML= likes;
        }