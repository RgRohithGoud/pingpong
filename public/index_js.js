function session(){
    let data = window.sessionStorage;
    let arr = [];
    let items;
    for(items in data){
            let item = data[items];
            try{
            item = JSON.parse(item);
            if(item["type"]==="game-score"){
                item["dt"] = new Date(item["dt"]);
                arr.push(item);
            }
            }
            catch(err){
            }
    }
    arr = arr.sort((a,b)=> b.dt - a.dt);
    let table = "Current Session\n<table>\n<tr><th>SNo.</th><th>Players</th><th>Points</th><th>Winner</th><th>Date Time</th></tr>\n";
    for(let i = 0;i<arr.length;i++){
            let dat = arr[i];
            table += "<tr><td>"+(i+1)+"</td><td>"+dat.players+"</td><td>"+dat.points+"</td><td>"+dat.win+"</td><td>"+dat.dt+"</td></tr>"
    }
    table+="</table>";
    return table;
}
function local(){
    let data = window.localStorage;
    let arr = [];
    let items;
    for(items in data){
            let item = data[items];
            try{
            item = JSON.parse(item);
            if(item["type"]==="game-score"){
                item["dt"] = new Date(item["dt"]);
                arr.push(item);
            }
            }
            catch(err){
            }
    }
    arr = arr.sort((a,b)=> b.dt - a.dt);
    let table = "Local History\n<table>\n<tr><th>SNo.</th><th>Players</th><th>Points</th><th>Winner</th><th>Date Time</th></tr>\n";
    for(let i = 0;i<arr.length;i++){
            let dat = arr[i];
            table += "<tr><td>"+(i+1)+"</td><td>"+dat.players+"</td><td>"+dat.points+"</td><td>"+dat.win+"</td><td>"+dat.dt+"</td></tr>"
    }
    table+="</table>";
    return table;
}

document.getElementById("button").addEventListener("click", loadajax);

// Reload when page comes.
function loadajax(){
    const xhr = new XMLHttpRequest();
    xhr.open("GET","/api",true);
    xhr.onload = function(){
        if(this.status == 200){
                let xhrdat = JSON.parse(this.responseText);
                let len = xhrdat.length;
                let table = "Golbal History\n<table>\n<tr><th>SNo.</th><th>Players</th><th>Points</th><th>Winner</th><th>Date Time</th></tr>\n";
                for(let i = 1;i<=len;i++){
                        let dat = xhrdat[i];
                        dat["dt"] = new Date(dat["dt"]);
                        table += "<tr><td>"+i+"</td><td>"+dat.players+"</td><td>"+dat.points+"</td><td>"+dat.win+"</td><td>"+dat.dt+"</td></tr>"
                }
                table+="</table>";
                document.getElementById("ajax").innerHTML = table;

        }
        else{
            console.log("Error while retriveing data");
        }
    }
    xhr.send();
}

document.getElementById("session").innerHTML = session();
document.getElementById("local").innerHTML = local();
loadajax();

setInterval(function(){
    document.getElementById("session").innerHTML = session();
    document.getElementById("local").innerHTML = local();
},10000);
