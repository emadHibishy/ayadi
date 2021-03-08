const User = require('../models/user');
const bcrypt = require('bcryptjs');

const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(
    sendgridTransport({
    auth:{
        api_key:'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'
    }
}));

exports.getLogin = (req,res,next)=>{
   
    let message = req.flash('error');
    if(message.length > 0){
        message= message[0];
    }else{
        message = null;
    }
    res.render('login/login',{
        errorMessage: message
    })
}

exports.postLogin = (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    User
        .findOne({where:{email:email}})
        .then(user=>{
            if(!user){
                req.flash('error', 'Invalid email.');
                return res.redirect('/login');
            }
            return bcrypt.
                compare(password,user.password)
                .then(doMatch=>{
                    if(doMatch){
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err=>{
                            console.log(err);
                            res.redirect('/home');
                        });
                    }
                    req.flash('error', 'Invalid password.');
                    res.redirect('/login');
                })
                .catch(err=>{
                    console.log(err);
                    res.redirect('/login');
                })
        })
        .catch(err=>{
            console.log(err)
        })    
}

exports.postLogout = (req,res,next)=>{
    req.session.destroy(err=>{
        console.log(err);
        res.redirect('/');
    })
}

exports.getSignup = (req,res,next)=>{
    let message = req.flash('error');
    if(message.length > 0){
        message= message[0];
    }else{
        message = null;
    }
    res.render('sign-up/signup',{
        errorMessage:message
    });
}

exports.postSignup = (req,res,next)=>{
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
    const type = req.body.type;

    User.findOne({where:{email:email}})
        .then(userfound=>{
            if(userfound){
                req.flash('error','e-mail already exists.')
                return res.redirect('/signup');
            }
            return bcrypt
                .hash(password,12)
                .then(hashedPassword=>{
                    return User.create({
                        name:name,
                        email:email,
                        phone:phone,
                        password: hashedPassword,
                        type: type
                })
            })
            .then(()=>{
                res.redirect('/login')
                return transporter.sendMail({
                    to: email,
                    from: 'ehebishy@yahoo.com',
                    subject: 'Signup Succeeded',
                    html: '<h1>You Successfully Signed up!</h1>'
                })
                
            })
            .catch(err=>{
                console.log(err);
            })
        })
        
        .catch(err=>{
            console.log(err)
        })
     

    


}