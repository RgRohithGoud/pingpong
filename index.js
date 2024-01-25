const express = require("express");
const fs = require("fs");
const { request } = require("http");
const port = process.env.PORT || 3000;
const app = express();

app.listen(port,function(){
    console.log("Server is ready at port "+port);
});

app.use(express.static("public"));
app.use(express.json());

app.get("/", (request,response) => {
    response.sendFile("./public/index.html", (err)=>{
        if(err)console.log(err);
    });
});

app.get("/api",(request,response) => {
    let fileData = fs.readFileSync("./dat.json","utf-8");
    response.send(fileData);
});

app.post("/api",(request,response) => {
    let data = request.body;
    let fileData = JSON.parse(fs.readFileSync("./dat.json","utf-8"));
    if(fileData.length===10){
        let i;
        for(i=10;i>1;i--){
            let temp = fileData[i-1];
            fileData[i]=temp;
        }
    }
    else{
        let i;
        fileData.length++;
        for(i=fileData.length;i>1;i--){
            let temp = fileData[i-1];
            fileData[i]=temp;
        }
    }
    fileData[1] = data;
    fs.writeFile("./dat.json",JSON.stringify(fileData),() =>{
            console.log("Data recieved");
    });
    response.send();
});