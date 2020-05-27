const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const csrf = require("csurf")
const session = require("express-session"); 
const mongodbSessionStore = require("connect-mongodb-session")(session)

MONGOOSE_URI = "mongodb+srv://shayak:<enter password>@cluster0-fidtq.mongodb.net/authProject" ;

const store = new mongodbSessionStore({
    uri:MONGOOSE_URI,
    collection:"session",
}) 


const authRouter = require("./routes/auth")

const app = express()
const csrfProtection = csrf();

app.set("view engine","ejs")
app.set("views","views")

app.use(bodyParser.urlencoded({extended:false}))
// app.use(express.static("public"))
app.use(session({secret:"hello world",resave:false,saveUninitialized:false,store:store}));
app.use(csrfProtection);

app.use((req,res,next)=>{
    res.locals.csrfToken = req.csrfToken()
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.name = req.session.user;
    next()
})

app.use(authRouter)

app.use("/",(req,res,next)=>{
    res.send("<h1>404 Page not found </h1>")
})

app.use((err,req,res,next)=>{
    console.log(err);
    res.send("<h1>500 working on it</h1>")
})

mongoose.connect(MONGOOSE_URI)
.then(()=>{
    console.log("CONNECTED!")
    app.listen(8080)
})
.catch(err=>{
    console.log(err)
})


  