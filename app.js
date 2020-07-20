const express=require('express');
const app=express();
const path=require('path');
const exphbs=require('express-handlebars');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const methodOverride=require('method-override');
const upload=require('express-fileupload');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');

 
mongoose.Promise=global.Promise;

mongoose.connect('mongodb://localhost/cms1',{ useNewUrlParser: true ,useUnifiedTopology: true}).then(db=>{
     
}).catch(err=>console.log(err));

app.use(session({

    secret: 'blogging',
    resave: true,
    saveUninitialized: true

}));
app.use(flash());
app.use((req, res, next)=>{
    res.locals.user = req.user || null;
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.form_errors = req.flash('form_errors');
    res.locals.error = req.flash('error');
    next();
});

app.use(passport.initialize());
app.use(passport.session());

const {select}=require('./helpers/handlebars');
app.use(upload());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());



app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname,'public')));
app.engine('handlebars', exphbs({defaultLayout: 'home',helpers:{select:select} }));
app.set('view engine', 'handlebars');

const main=require('./routes/home/main');
const admin=require('./routes/admin/index');
const posts=require('./routes/admin/posts');
const categories=require('./routes/admin/categories');
const comments=require('./routes/admin/comments');

app.use('/', main);
app.use('/admin',admin);
app.use('/admin/posts',posts);
app.use('/admin/categories',categories);
app.use('/admin/comments',comments);
 
app.listen(1234,()=>{

    console.log('connected');
});