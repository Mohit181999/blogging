const express=require('express');
const router=express.Router();
const posts=require('../../models/Post');
const faker=require('faker');

router.all('/*', function (req, res, next) {
    req.app.locals.layout = 'admin'; // set your layout here
    next(); // pass control to the next handler
    });
 
router.get('/',(req,res)=>{
    res.render('admin/index');
}); 
router.get('/Dashboard',(req,res)=>{
    res.render('admin/Dashboard');
});
router.post('/generate-fake-posts',(req,res)=>{

    for(let i=0;i<req.body.amount;i++){
    let post=new posts();
    post.title=faker.name.title();
    post.status='public';
    post.save(err=>{
        if(err)throw err;
    });
    }
    res.redirect('/admin/posts');
});
 
module.exports=router;