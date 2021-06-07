//#region Classes
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
        stats.forEach(s => {
            if (s != null) {
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
checkboxDiv = document.getElementById("checkboxes");
toggleCheckboxesButton = document.getElementById("toggleCheckboxesButton");
infoStats = document.getElementById("infoStats");
checkboxes = []
classChart = null;
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
members.sort((a, b) => b.kd - a.kd)
//Set Members Index
members.forEach(m => {
    m.place = members.indexOf(m) + 1
});
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
    nodewars.push(nw);
}
//#endregion


//#region Initiate all-Table
table = new gridjs.Grid({
    columns: [{ id: "place", name: "", width: 40 },
    {
        name: "Name",
        attributes: (cell) => {
            if (cell) {
                return {
                    'data-cell-content': cell,
                    'id': cell,
                    'onclick': () => {
                        displayMember(cell)
                    },
                    'style': 'cursor: pointer',
                    'onMouseOver': () => document.getElementById(cell).style.backgroundColor = "#999",
                    'onMouseOut': () => document.getElementById(cell).style.backgroundColor = "white"
                };
            }
        }
    },
        "Party", "GS",
    {
        id: 'cl',
        name: "Class",
    },
        "Kills", "Deaths", "KD"],
    data: members,
    sort: true,
    fixedHeader: true,
    height: '700px',
    search: true,
    pagination: {
        limit: 10
    }
}).render(document.getElementById("wrapper"));
//#endregion

//#region all stats table

nodewars.forEach(nw => {

    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.checked = true;
    checkbox.onclick = (c) => updateTable();
    checkbox.id = nw.id;
    var label = document.createElement('label');
    label.htmlFor = nw.id;
    label.appendChild(document.createTextNode(nw.date));
    checkboxDiv.appendChild(checkbox);
    checkboxDiv.appendChild(label);
    //var br = document.createElement("br");
    //checkboxDiv.appendChild(br);
    checkboxes.push(checkbox);
});

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


infoStats.innerHTML = `Stats:<br><br>Total Kills:${tK}<br>Total Deaths:${tD}<br>Avg Kills:${avgK.toFixed(2)}<br>Avg Deaths:${avgD.toFixed(2)} <br> Avg KD:${avgKD.toFixed(2)}`;

function updateTable() {
    var nws = [];
    checkboxes.forEach(cb => {
        if (cb.checked) {
            nws.push(cb.id);
        }
    });
    changeMembers(nws);
}

function toggleCheckboxes() {
    var anyChecked = false;
    checkboxes.forEach(cb => {
        if (cb.checked) {
            anyChecked = true;
        }
    });
    if (anyChecked == false) {
        checkboxes.forEach(cb => {
            cb.checked = true;
        });
        toggleCheckboxesButton.innerHTML = "Uncheck All";
    } else {
        checkboxes.forEach(cb => {
            cb.checked = false;
        });
        toggleCheckboxesButton.innerHTML = "Check All";
    }
    updateTable();
}

function toggleCheckboxesVisiblity(b) {
    if (b) {
        checkboxDiv.style.display = "flex";
        toggleCheckboxesButton.style.display = "flex";
        document.getElementById('classes').style.display = "flex";
    } else {
        checkboxDiv.style.display = "none";
        toggleCheckboxesButton.style.display = "none";
        document.getElementById('classes').style.display = "none";
    }
}


function changeMembers(nws) {
    members = []
    for (let i = 0; i < rawData.length; i++) {
        stats = [];
        for (let nw = 0; nw < amountOfNodewars; nw++) {
            key = Object.keys(rawData[i])[nw + 4];
            if (!nws.includes(key))
                continue;
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
    members.sort((a, b) => b.kd - a.kd)
    //Set Members Index
    members.forEach(m => {
        m.place = members.indexOf(m) + 1
    });

    var tK = 0;
    var tD = 0;
    var avgK = 0;
    var avgD = 0;
    var avgKD = 0;
    nws.forEach(e => {
        nodewars.forEach(e2 => {
            if (e2.id === e) {
                tK += e2.kills;
                tD += e2.deaths;
            }
        });
    });
    avgK = tK / (nws.length * 25);
    avgD = tD / (nws.length * 25);
    avgKD = avgK / avgD;


    infoStats.innerHTML = `Stats:<br><br>Total Kills:${tK}<br>Total Deaths:${tD}<br>Avg Kills:${avgK.toFixed(2)}<br>Avg Deaths:${avgD.toFixed(2)} <br> Avg KD:${avgKD.toFixed(2)}`;

    displayAll();
    updateClasses();
}

function displayAll() {
    toggleCheckboxesVisiblity(true);
    if (kdChart != null)
        kdChart.destroy();
    document.getElementById("tableTitle").innerHTML = "All Stats";
    table.updateConfig({
        columns: [{ id: "place", name: "", width: 40 },
        {
            name: "Name",
            attributes: (cell) => {
                if (cell) {
                    return {
                        'data-cell-content': cell,
                        'id': cell,
                        'onclick': () => {
                            displayMember(cell)
                        },
                        'style': 'cursor: pointer',
                        'onMouseOver': () => document.getElementById(cell).style.backgroundColor = "#999",
                        'onMouseOut': () => document.getElementById(cell).style.backgroundColor = "white"
                    };
                }
            }
        },
            "Party", "GS",
        {
            id: 'cl',
            name: "Class",
        },
            "Kills", "Deaths", "KD"],
        data: members,
        sort: true,
        fixedHeader: true,
        height: '700px',
        search: true,
        pagination: {
            limit: 10
        }
    }).forceRender();
}


function displayMember(name) {
    toggleCheckboxesVisiblity(false);
    var m = members.find(e => e.name == name);
    document.getElementById("tableTitle").innerHTML = `${name}<br>${m.kills}-${m.deaths}<br>${m.kd}`;
    var d = {};
    var allKDs = []
    var nws = [];

    for (let i = 0; i < nodewarNames.length; i++) {
        if (checkboxes[i].checked) {
            nws.push(nodewarNames[i]);
        }
    }

    for (let i = 0; i < nws.length; i++) {

        if (m.stats[i] != null) {
            if (m.stats[i][1] > 0) {
                kd = parseFloat(m.stats[i][0] / m.stats[i][1]).toFixed(2);
            } else {
                kd = m.stats[i][0];
            }
            allKDs.push(kd);
            date = nws[i].split("w")[1];
            day = date.slice(0, 2);
            month = date.slice(2, 4);
            d[day + "." + month] = `${m.stats[i][0]} | ${m.stats[i][1]} (${kd})`;
        }
    }
    table.updateConfig({
        columns: Object.keys(d),
        height: 150,
        data: [d],
        pagination: false

    }).forceRender();

    avgKDs = [];
    nodewars.forEach(nw => {
        joinedNws = Object.keys(d)
        date = nw.date
        if (joinedNws.includes(date)) {
            avgKDs.push(nw.kd);
        }
    });
    const data = {
        labels: Object.keys(d),
        datasets: [{
            label: m.name,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: allKDs
        }, {
            label: "Avg",
            backgroundColor: 'rgb(123, 99, 255)',
            borderColor: 'rgb(123, 99, 255)',
            data: avgKDs
        }]
    };

    const config = {
        type: 'line',
        data: data,
        options: {}
    };
    kdChart = new Chart(
        document.getElementById('kdChart'),
        config
    );










}

//#endregion


function getClassData() {
    var memberClasses = {};


    members.forEach(m => {
        if (m.cl != "-" && m.kd != 0) {
            if (memberClasses[m.cl] == null) {
                memberClasses[m.cl] = 1;
            } else {
                memberClasses[m.cl] += 1;
            }
        }
    });

    var otherClasses = "";
    var otherClassesAmount = 0;

    for (var k in memberClasses) {
        if (memberClasses[k] <= 2) {

            otherClasses += k + " ";
            otherClassesAmount += memberClasses[k];
            delete memberClasses[k];
        }
    }
    memberClasses[otherClasses] = otherClassesAmount;

    var classAmount = []
    var colors = []
    for (var k in memberClasses) {
        colors.push(getClassColor(k));
        classAmount.push(memberClasses[k])
    }
    const memberClassesData = {
        labels: Object.keys(memberClasses),
        datasets: [{
            data: classAmount, backgroundColor: colors
        }],

    }
    return memberClassesData;
}

const classDisplayConfig = {
    type: 'doughnut',
    data: getClassData(),
    options: {
        style: "display: inline-block",
        responsive: false,
        plugins: {
            legend: {
                display: false,
                position: 'top',
            },
            title: {
                display: true,
                text: 'Class distribution'
            }
        }
    },
};


classChart = new Chart(
    document.getElementById('classes'),
    classDisplayConfig
);




function updateClasses() {
    if (classChart != null) {
        classChart.data = getClassData();
        classChart.update();
    }
}



function getClassColor(cl) {
    color = "";
    switch (cl) {
        case ("Nova"):
            color = "rgb(0, 128, 128)";
            break;
        case ("Guardian"):
            color = "rgb(170,110,40)";
            break;
        case ("Warrior"):
            color = "rgb(245, 130, 48)";
            break;
        case ("Ninja"):
            color = "rgb(0,0,0)";
            break;
        case ("Hash"):
            color = "rgb(255,225, 25)";
            break;
        case ("DK"):
            color = "rgb(0,0,128)";
            break;
        case ("Witch"):
            color = "rgb(70,240,240)";
            break;
        case ("Striker"):
            color = "rgb(255,250,200)";
            break;
        case ("Zerk"):
            color = "rgb(128, 128,0)";
            break;
        case ("Archer"):
            color = "rgb(170, 255, 195)";
            break;
        case ("Sorc"):
            color = "rgb(145, 30, 180)";
            break;
        case ("Wizard"):
            color = "rgb(255,215,180)";
            break;
        case ("Valk"):
            color = "rgb(255,255,255)";
            break;
        case ("Ranger"):
            color = "rgb(60, 180, 75)";
            break;
        case ("Sage"):
            color = "rgb(255,250,200)";
            break;
        case ("Mystic"):
            color = "rgb(0,130,200)";
            break;
        case ("Tamer"):
            color = "rgb(250, 190, 212)";
            break;
        case ("Lahn"):
            color = "rgb(230,25,75)";
            break;
        default:
            color = "rgb(128,128,128)";
            break;
    }
    return color;
}





function calcPerformanc(k,d,avgk, avgd){
    return k-avgk + avgd-d;
}