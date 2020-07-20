const express=require('express');
const router=express.Router();
const posts=require('../../models/Post');
const {isEmpty}=require('../../helpers/upload-helper');
const fs=require('fs');
const categories=require('../../models/categories');

router.all('/*', function (req, res, next) {
    req.app.locals.layout = 'admin'; // set your layout here
    next(); // pass control to the next handler
    });
router.get('/',(req,res)=>{

    posts.find({}).then(posts=>{
        const context={
            newposts:posts.map(post=>(
                {
                    id:post.id,
                    title:post.title,
                    status:post.status,
                    file:post.file
                })
        )}
        res.render('admin/posts',{posts:context.newposts})
    });    
});

router.get('/create',(req,res)=>{
    
         
    res.render('admin/posts/create' );
});

router.post('/create',(req,res)=>{
    let filename = 'BMW-Z4.jpg';


    if(!isEmpty(req.files)){

       let file = req.files.file;
       filename = Date.now() + '-' + file.name;

       file.mv('./public/uploads/' + filename, (err)=>{

           if(err) throw err;

       });
    const newPost= new posts({
        title:req.body.title,
        status:req.body.status,
        body:req.body.body,
        file:filename
        
         
    }); 
    newPost.save().then(saveData=>{         
        res.redirect('/admin/posts');
    }).catch(error=>{
        console.log('can not save'+error);
    });
}
});
router.get('/edit/:id',(req,res)=>{
    
    posts.findOne({_id:req.params.id}).then(post=>{
        const context={
            edit:{
                id:post.id,
                title:post.title,
                status:post.status,
                file:post.file
            }
        }
        res.render('admin/posts/edit',{post:context.edit})
    }); 
}); 
router.get('/my-post',(req,res)=>{
    posts.find({_id:req.user.id}).then(posts=>{
        const context={
            newposts:posts.map(post=>(
                {
                    id:post.id,
                    title:post.title,
                    status:post.status,
                    file:post.file
                })
        )}
        res.render('admin/posts/my-post',{posts:context.newposts})
    }); 
     
});  
router.put('/edit/:id',(req,res)=>{
    posts.findOne({_id:req.params.id}).then(post=>{
         post.title=req.body.title;
         post.id=req.body.id;
         post.status=req.body.status;
         post.file=req.body.file;
         let filename='uploads1';
    if(!isEmpty(req.files)){
    let file=req.files.file;
    filename=Date.now()+'-'+file.name;
    post.file=filename;
    file.mv('./public/uploads'+ filename,(err)=>{
        if(err)throw err;
    });   
    console.log(filename);
}  
         post.save().then(update=>{
             req.flash('success_message','post was updated');
        res.redirect('/admin/posts');
         }); 
    
     
});
});
router.delete('/:id',(req,res)=>{

    posts.remove({_id:req.params.id})
        .then(result=>{
            res.redirect('/admin/posts');

        });
});

module.exports=router;