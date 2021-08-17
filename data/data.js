//#region classes
class member {
    constructor(name, party, gs, cl, stats) {
        this.name = name;
        this.party = party;
        this.gs = gs;
        this.cl = cl;
        this.stats = stats;
        this.kills = 0;
        this.deaths = 0;
        this.kd = 0;
        this.place = 0;
        this.joined = 0
        stats.forEach(s => {
            if (s != null) {
                this.joined++;
                this.kills += s[0];
                this.deaths += s[1];
            }
        });
        this.avgK = parseFloat(parseFloat(this.kills / this.joined).toFixed(2));
        if (this.deaths != 0) {
            this.kd = parseFloat(parseFloat(this.kills / this.deaths).toFixed(2));
        } else {
            this.kd = this.kills;
        }
    }

}

class nodewar {
    constructor(id, members) {
        this.id = id;

        this.date = id.split(" ")[1];
        //this.day = this.date.slice(0, 2);
        //this.month = this.date.slice(2, 4);
        //this.date = this.day + "." + this.month;

        this.result = 0;


        this.members = members;
        this.kills = 0;
        this.deaths = 0;
        this.kd = 0;
        members.forEach(m => {
            this.nwIndex = nodewarNames.indexOf(id);
            this.kills += m.stats[this.nwIndex][0];
            this.deaths += m.stats[this.nwIndex][1];
        });
        if (this.deaths != 0) {
            this.kd = parseFloat(this.kills / this.deaths).toFixed(2);
        } else {
            this.kd = this.kills;
        }
    }
}
//#endregion

//#region Global Variables
nodewars = []
members = [];
kdChart = null;
amountOfNodewars = 0;
nodewarNames = []
//#endregion
var spData = null;
//var spNws = [];
var newData = [];


var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        init(JSON.parse(this.responseText));

        var xhttp2 = new XMLHttpRequest();
        xhttp2.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                doDataResults(JSON.parse(this.responseText));
                mainInit();
            }
        };
        xhttp2.open("GET", "https://sheets.googleapis.com/v4/spreadsheets/1K8uDEI2pPVU6_pZanqBqFR6N7Se3MKaUjgKxc4jKVDw/values/Results?key=AIzaSyBNRW5H0MOnLSCig0SXrsjn4011lOJP7gQ", true);
        xhttp2.send();
    }
};
xhttp.open("GET", "https://sheets.googleapis.com/v4/spreadsheets/1K8uDEI2pPVU6_pZanqBqFR6N7Se3MKaUjgKxc4jKVDw/values/Stats?key=AIzaSyBNRW5H0MOnLSCig0SXrsjn4011lOJP7gQ", true);
xhttp.send();




function init(json) {
    spData = json.values;
    let row = []

    for (let i = 4; i < spData[0].length; i++) {
        const nw = spData[0][i];
        nodewarNames.push(nw);
    }

    for (let i = 1; i < spData.length; i++) {
        const row = spData[i];
        newData.push(row);
        let rawStats = row.slice(4);
        let stats = [];
        for (let j = 0; j < rawStats.length; j++) {
            if (rawStats[j] == "-") {
                stats.push((null, null))
                continue;
            }
            value = rawStats[j].split("(")[1].split(",");
            kills = parseInt(value[0]);
            deaths = parseInt(value[1].slice(0, -1));
            stats.push([kills, deaths])
        }

        m = new member(row[0], row[1], row[2], row[3], stats)
        if (m.stats.length > 0)
            members.push(m)
    }

    amountOfNodewars = nodewarNames.length;

    for (let i = 0; i < nodewarNames.length; i++) {
        membersInNw = [];
        members.forEach(m => {
            if (m.stats[i] != null) {
                membersInNw.push(m);
            }
        });

        nw = new nodewar(nodewarNames[i], membersInNw);
        /* nwResults.forEach(element => {
            if(element.id === nw.id){
                nw.result = element.result;
            }
        }); */
        nodewars.push(nw);
    }
    nodewars.forEach(e => {
        tK += e.kills;
        tD += e.deaths;
    });

}

/* 

function doDataStats(json) {
    spData = json.values;
    var row = [];
    for (let i = 4; i < spData.length; i++) {
        v = spData[i]["gs$cell"];
        if(v.row == 1 && v.col > 4){
            nodewarNames.push(v.$t);
            continue;
        }
        if(v.col == 1 && row.length > 0){
            newData.push(row);
            row = [];
        }
        row.push(v.$t);
    }
    newData.push(row)
    for (let i = 0; i < newData.length; i++) {
        row = newData[i];

        var rawStats = row.slice(4);
        var stats = [];
        for (let j = 0; j < rawStats.length; j++) {
            if(rawStats[j] == "-"){
                stats.push((null,null))
                continue;
            }
            value = rawStats[j].split("(")[1].split(",");
            kills = parseInt(value[0]);
            deaths = parseInt(value[1].slice(0, -1));
            stats.push([kills, deaths])            
        }

        m = new member(row[0],row[1],row[2],row[3],stats)
        if (m.stats.length > 0)
            members.push(m)
    }


    amountOfNodewars = nodewarNames.length;

    for (let i = 0; i < nodewarNames.length; i++) {
        membersInNw = [];
        members.forEach(m => {
            if (m.stats[i] != null) {
                membersInNw.push(m);
            }
        });
    
        nw = new nodewar(nodewarNames[i], membersInNw);

        nodewars.push(nw);
    }
    nodewars.forEach(e => {
        tK += e.kills;
        tD += e.deaths;
    });

} */
function doDataResults(json) {
    spData = json.values;
    var row = [];
    for (let i = 1; i < spData.length; i ++) {
        v = spData[i];
        getNodewar(v[0]).result = v[1]
    }

}





//#region Get all Nodewar Names
/* for (let i = 0; i < amountOfNodewars; i++) {
    key = Object.keys(rawData[0])[i + 4];
    nodewarNames.push(key)
} */
//#endregion

//#region Extract all Members
/* for (let i = 0; i < rawData.length; i++) {
    stats = [];
    for (let nw = 0; nw < amountOfNodewars; nw++) {
        key = Object.keys(rawData[i])[nw + 4];
        value = rawData[i][key];
        if (value != "-") {
            value = value.split("(")[1].split(",");
            kills = parseInt(value[0]);
            deaths = parseInt(value[1].slice(0, -1));
            stats.push([kills, deaths])
        } else {
            stats.push((null, null))
        }

    }
    m = new member(rawData[i].familyname, rawData[i].party, rawData[i].gs, rawData[i].class, stats)
    if (m.stats.length > 0)
        members.push(m)
} */
//Sort Members by KD
//members.sort((a, b) => b.kd - a.kd)
//Set Members Index
//members.forEach(m => {
//    m.place = members.indexOf(m) + 1
//});
//#endregion

//#region Extract all Nodewars
/* for (let i = 0; i < nodewarNames.length; i++) {
    membersInNw = [];
    members.forEach(m => {
        if (m.stats[i] != null) {
            membersInNw.push(m);
        }
    });

    nw = new nodewar(nodewarNames[i], membersInNw);
    nwResults.forEach(element => {
        if(element.id === nw.id){
            nw.result = element.result;
        }
    });
    nodewars.push(nw);
} */
//#endregion

var tK = 0;
var tD = 0;
var avgK = 0;
var avgD = 0;
var avgKD = 0;
/* nodewars.forEach(e => {
    tK += e.kills;
    tD += e.deaths;
}); */
avgK = tK / (nodewars.length * 25);
avgD = tD / (nodewars.length * 25);
avgKD = avgK / avgD;


//infoStats.innerHTML = `Stats:<br><br>Total Kills:${tK}<br>Total Deaths:${tD}<br>Avg Kills:${avgK.toFixed(2)}<br>Avg Deaths:${avgD.toFixed(2)} <br> Avg KD:${avgKD.toFixed(2)}`;



function getNodewar(id) {
    return nodewars.find(nw => { if (nw.id == id) return nw })
}

