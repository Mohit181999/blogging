const express=require('express');
const router=express.Router();
const categories=require('../../models/categories');

 
router.all('/*', function (req, res, next) {
    req.app.locals.layout = 'admin'; // set your layout here
    next(); // pass control to the next handler
});
router.get('/',(req,res)=>{
    categories.find({}).then(cat=>{
        const context={
            newposts:cat.map(category=>(
                {
                    id:category.id,
                    name:category.name
                })
        )}
    res.render('admin/categories',{category:context.newposts});
});
});
router.post('/create',(req,res)=>{

    const cat=new categories({
        name:req.body.name
    });
    cat.save(saves=>{
        res.redirect('/admin/categories');
    });        
    });
router.get('/edit/:id',(req,res)=>{
    categories.findOne({_id:req.params.id}).then(category=>{
        const context={
            edit:{
                id:category.id,
                name:category.name
            }
        }
        res.render('admin/categories/edit',{category:context.edit})
    });    
});
router.post('/edit/:id',(req,res)=>{
    categories.findOne({_id:req.params.id}).then(category=>{
        category.name=req.body.name;
        category.save().then(saved=>{
            res.redirect('/admin/categories');
        });        
    });

});
router.post('/:id',(req,res)=>{
    categories.remove({_id:req.params.id}).then(category=>{
                    res.redirect('/admin/categories');
        });
    });

module.exports=router;