const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');



router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res)=>{
   /* Comment.find({_id:req.params.id}).populate('user')
        .then(comments=>{
            const context={
                newcom:comments.map(post=>(
                    {
                        user:comments.user.id,
                        body:comments.body,
                    })
            )}
            res.render('admin/com',{Comment:context.newcom})
        });   */
        Comment.find({user:req.user.id}).populate('users').then(comments=>{
            const context={
               newcom:comments.map(Comment=>(
                    {
                        user:Comment.user.firstname,
                        id:Comment.id,
                        body:Comment.body,
                        date:Comment.date
                    })
            )}
            res.render('admin/comments',{comments:context.newcom}); 
        })
      
});

router.post('/', (req, res)=>{
    Post.findOne({_id: req.body.id}).then(post=>{
        const newComment = new Comment({
            user: req.user.id,
            body: req.body.body
        });
        post.comments.push(newComment);
        console.log(post);
        post.save().then(savedPost=>{
            newComment.save().then(savedComment=>{
                res.redirect(`/post/${post.id}`);
            });
        });
    });
         
});



router.post('/:id', (req, res)=>{
    Comment.remove({_id: req.params.id}).then(deleteItem=>{
        Post.findOneAndUpdate({comments: req.params.id}, {$pull: {comments: req.params.id}}, (err, data)=>{
        if(err) console.log(err);
            res.redirect('/admin/comments');
              });
        });
});



router.post('/approve-comment', (req, res)=>{
    Comment.findByIdAndUpdate(req.body.id, {$set: {approveComment: req.body.approveComment}}, (err, result)=>{
        if(err) return err;
        res.send(result)
        });
});

module.exports = router;


