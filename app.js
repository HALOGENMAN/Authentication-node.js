const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

MONGOOSE_URI = "mongodb+srv://shayak:159951sm357753@cluster0-fidtq.mongodb.net/authentication" ;


const app = express()

app.set("view engine","ejs")
app.set("views","views")

app.use(bodyParser.urlencoded({extended:false}))
app.use((req,res,next)=>{
    res.send("working")
})

mongoose.connect(MONGOOSE_URI)
.then(()=>{
    console.log("CONNECTED!")
    app.listen(3000)
})
.catch(err=>{
    console.log(err)
})


  