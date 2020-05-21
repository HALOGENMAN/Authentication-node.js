const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

MONGOOSE_URI = "mongodb+srv://shayak:159951sm357753@cluster0-fidtq.mongodb.net/authProject" ;

const authRouter = require("./routes/auth")

const app = express()

app.set("view engine","ejs")
app.set("views","views")

app.use(bodyParser.urlencoded({extended:false}))

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
    app.listen(3000)
})
.catch(err=>{
    console.log(err)
})


  