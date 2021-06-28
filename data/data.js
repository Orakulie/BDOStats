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
        if (this.deaths != 0) {
            this.kd = parseFloat(this.kills / this.deaths).toFixed(2);
        } else {
            this.kd = this.kills;
        }
    }

}

class nodewar {
    constructor(id, members) {
        this.id = id;

        this.date = id.split("w")[1];
        this.day = this.date.slice(0, 2);
        this.month = this.date.slice(2, 4);
        this.date = this.day + "." + this.month;

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
amountOfNodewars = Object.keys(rawData[0]).length - 4;
nodewarNames = []
//#endregion

//#region Get all Nodewar Names
for (let i = 0; i < amountOfNodewars; i++) {
    key = Object.keys(rawData[0])[i + 4];
    nodewarNames.push(key)
}
//#endregion

//#region Extract all Members
for (let i = 0; i < rawData.length; i++) {
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
}
//Sort Members by KD
//members.sort((a, b) => b.kd - a.kd)
//Set Members Index
//members.forEach(m => {
//    m.place = members.indexOf(m) + 1
//});
//#endregion

//#region Extract all Nodewars
for (let i = 0; i < nodewarNames.length; i++) {
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
}
//#endregion

var tK = 0;
var tD = 0;
var avgK = 0;
var avgD = 0;
var avgKD = 0;
nodewars.forEach(e => {
    tK += e.kills;
    tD += e.deaths;
});
avgK = tK / (nodewars.length * 25);
avgD = tD / (nodewars.length * 25);
avgKD = avgK / avgD;


//infoStats.innerHTML = `Stats:<br><br>Total Kills:${tK}<br>Total Deaths:${tD}<br>Avg Kills:${avgK.toFixed(2)}<br>Avg Deaths:${avgD.toFixed(2)} <br> Avg KD:${avgKD.toFixed(2)}`;



function getNodewar(id){ 
    return nodewars.find(nw => {if(nw.id==id)return nw})
}

