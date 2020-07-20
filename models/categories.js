const mongoose=require('mongoose');

const schema=mongoose.Schema;

const categories=new schema({

    name:{
        type:String
    }


});

module.exports=mongoose.model('categories',categories);