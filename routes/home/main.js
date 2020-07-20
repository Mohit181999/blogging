const express=require('express');
const router=express.Router();
const posts=require('../../models/Post');
const categories=require('../../models/categories');
const User=require('../../models/user');
const bcrypt=require('bcryptjs');
const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const Comment = require('../../models/Comment');
  
router.all('/*' ,(req,res,next)=>{
    req.app.locals.layout='home';
    next();
});
router.get('/',(req,res)=>{
    posts.find({}).then(posts=>{
        const context={
            newposts:posts.map(post=>(
                {
                    id:post.id,
                    title:post.title,
                    status:post.status,
                    body:post.body,
                    file:post.file
                })
        )}
        categories.find({}).then(categories=>{
            const context2={
                newcat:categories.map(category=>(
                    {
                        id:category.id,
                        name:category.name
                    })
            )}
            res.render('home/index' ,{posts:context.newposts,category:context2.newcat});
        });
        
    });  
});
router.get('/login',(req,res)=>{
    res.render('home/login');
});
router.get('/register',(req,res)=>{
    res.render('home/register');
})
router.post('/register', (req, res)=>{

    let errors = [];
    if(!req.body.firstName) {
        errors.push({message: 'please enter your first name'});
    }
    if(!req.body.lastName) {
        errors.push({message: 'please add a last name'});
    }

    if(!req.body.email) {
        errors.push({message: 'please add an email'});
    }

    if(!req.body.password) {
        errors.push({message: 'please enter a password'});
    }


    if(!req.body.passwordConfirm) {
        errors.push({message: 'This field cannot be blank'});
    }

    if(req.body.password !== req.body.passwordConfirm) {
        errors.push({message: "Password fields don't match"});
    }


    if(errors.length > 0){
        res.render('home/register', {
            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,

        });

    } else {
        User.findOne({email: req.body.email}).then(user=>{
            if(!user){
                const newUser = new User({
                    firstname: req.body.firstName,
                    lastname: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password,
                });
                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(newUser.password, salt, (err, hash)=>{
                        newUser.password = hash;
                        newUser.save().then(savedUser=>{
                            req.flash('success_message', 'You are now registered, please login');
                            res.redirect('/login');
                        });
                    });
                });

            } else {
                req.flash('error_message', 'That email exist please login');
                res.redirect('/login');
            }
        });
    }
});

passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done)=>{

    User.findOne({email: email}).then(user=>{
        if(!user) return done(null, false, {message: 'No user found'});
        bcrypt.compare(password, user.password, (err, matched)=>{
            if(err) return err;
            if(matched){
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect password' });
            }
        });
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});
router.post('/login', (req, res, next)=>{

    passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true

    })(req, res, next);
});


router.get('/logout', (req, res)=>{
    req.logOut();
    res.redirect('/login');

});


 


router.get('/post/:id',(req,res)=>{
   
   
    posts.findOne({_id:req.params.id}).then(post=>{
        const context={
            edit:{
                id:post.id,
                title:post.title,
                status:post.status,
                file:post.file
            }
        }
         Comment.find({}).populate('user').then(comments=>{
            const context3={
                newcom:comments.map(Comment=>(
                     {
                         user:Comment.user.firstname,
                         id:Comment.id,
                         body:Comment.body,
                         date:Comment.date
                     })
             )}
         
        categories.find({}).then(categories=>{
            const context2={
                newcat:categories.map(category=>(
                    {
                        id:category.id,
                        name:category.name
                    })
            )}
            res.render('home/post' ,{post:context.edit,comments:context3.newcom,category:context2.newcat});
    });   
 
    });
});
});

module.exports=router;
 