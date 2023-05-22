//express library
const express = require('express');
const app = express();
//static files
app.use(express.static('public'));
const path = require('path');
//port
const HTTP_PORT = process.env.PORT || 8080;

const onHttpStart = ()=>{
    console.log(`Port Listening :${HTTP_PORT}`);
}
//endpoints 
//about
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'/views/about.html'));
})

//listening
app.listen(HTTP_PORT,onHttpStart);