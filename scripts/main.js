checkboxes = [];
checkboxDiv = document.getElementById("checkboxes");




//draw nodewarbox for each nodewar
allNwDiv = document.getElementById("allNws")
for (let i = 0; i < nodewars.length; i++) {



    var nwBlock = document.createElement("div");
    nwBlock.setAttribute("class","nwBlock");
    nwBlock.onclick = ()=>window.open("nodewar.html?ID="+nodewars[i].id,"_self");
    
    if(nodewars[i].result==1){
        nwBlock.style.backgroundColor="#61b15a";
    }else if(nodewars[i].result==-1){
        nwBlock.style.backgroundColor="#aa3a3a";
    }

    var nwTitle = document.createElement("div");
    nwTitle.setAttribute("class","nwBlockTitle");
    nwTitle.innerHTML = nodewars[i].date;

    var nwStats = document.createElement("div");
    nwStats.setAttribute("class","nwBlockStats");
    nwStats.innerHTML = `Kills:${nodewars[i].kills}<br>Deaths:${nodewars[i].deaths}<br><b>KD:${((nodewars[i].kills)/(nodewars[i].deaths)).toFixed(2)}</b>`


    nwBlock.appendChild(nwTitle);
    nwBlock.appendChild(nwStats);

    allNwDiv.appendChild(nwBlock);
}







table = new gridjs.Grid({
    columns: [
    {
        name: "Name",
        attributes: (cell) => {
            if (cell) {
                return {
                    'data-cell-content': cell,
                    'id': cell,
                    'onclick': () => {
                        window.open("member.html?name="+cell,"_self");
                    },
                    'style': 'cursor: pointer;background-color: rgb(17, 17, 17);    border: 1px solid #222831;',
                    'onMouseOver': () => document.getElementById(cell).style.backgroundColor = "#222831",
                    'onMouseOut': () => document.getElementById(cell).style.backgroundColor = "#111"
                };
            }
        }
    },
        "Party", "GS",
    {
        id: 'cl',
        name: "Class"
    },
        {id:"joined",name:"Joined"},"Kills", "Deaths", "KD"],
    data: members,
    sort: true,
    style:{

    
    td:{
        "backgroundColor":"#111",
        "borderColor":"#222831",
        
    },
    container :{
        "color":"#ececec",
        "borderColor":"#222831",
    },
    table:{
        "backgroundColor":"#111",
        "color":"#ececec",
        "borderColor":"#222831",
    },
    th:{
        "backgroundColor":"#f2a365",
        "color":"#111",
        "borderColor":"#222831"
    },
    pargination:{
        "backgroundColor":"#111",
        "borderColor":"#222831"
    }

    }
}).render(document.getElementById("wrapper"));



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
}


function changeMembers(nws) {
    members = []
/*     for (let i = 0; i < rawData.length; i++) {
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
    } */
    for (let i = 0; i < newData.length; i++) {
        row = newData[i];

        var rawStats = row.slice(4);
        var stats = [];

        for (let j = 0; j < rawStats.length; j++) {
            if (!nws.includes(nodewarNames[j]))
                continue;

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
    //Sort Members by KD
    //members.sort((a, b) => b.kd - a.kd)
    //Set Members Index
    //members.forEach(m => {
    //    m.place = members.indexOf(m) + 1
    //});

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


    //infoStats.innerHTML = `Stats:<br><br>Total Kills:${tK}<br>Total Deaths:${tD}<br>Avg Kills:${avgK.toFixed(2)}<br>Avg Deaths:${avgD.toFixed(2)} <br> Avg KD:${avgKD.toFixed(2)}`;

    displayAll();
}



function updateTable() {
    var nws = [];
    checkboxes.forEach(cb => {
        if (cb.checked) {
            nws.push(cb.id);
        }
    });
    if(nws.length>0)
    changeMembers(nws);
}

function displayAll() {
    toggleCheckboxesVisiblity(true);
    if (kdChart != null)
        kdChart.destroy();
    table.updateConfig({
        columns: [
        {
            name: "Name",
            attributes: (cell) => {
                if (cell) {
                    return {
                        'data-cell-content': cell,
                        'id': cell,
                        'onclick': () => {
                            window.open("member.html?name="+cell,"_top");
                        },
                        'style': 'cursor: pointer;background-color: rgb(17, 17, 17);    border: 1px solid #222831;',
                        'onMouseOver': () => document.getElementById(cell).style.backgroundColor = "#222831",
                        'onMouseOut': () => document.getElementById(cell).style.backgroundColor = "#111"
                    };
                }
            }
        },
            "Party", "GS",
        {
            id: 'cl',
            name: "Class"
        },
            "Kills", "Deaths", "KD"],
        data: members,
        sort: true,
        fixedHeader: true,
        style:{
        
            td:{
            "backgroundColor":"#111",
            "borderColor":"#222831"
        },
        container :{
            "color":"#ececec",
            "borderColor":"#222831"
        },
        table:{
            "backgroundColor":"#111",
            "color":"#ececec",
            "borderColor":"#222831"
        },
        th:{
            "backgroundColor":"#f2a365",
            "color":"#111",
            "borderColor":"#222831"
        },
        pargination:{
            "backgroundColor":"#111",
            "borderColor":"#222831"
        }
    
    
        }
    }).forceRender();
}




var memberClasses = {};
function getClassData() {
    


    members.forEach(m => {
        if (m.cl != "-" && m.kd != 0) {
            if (memberClasses[m.cl] == null) {
                memberClasses[m.cl] = 1;
            } else {
                memberClasses[m.cl] += 1;
            }
        }
    });

    //var otherClasses = "";
    //var otherClassesAmount = 0;

    //for (var k in memberClasses) {
    //    if (memberClasses[k] <= 2) {

    //        otherClasses += k + " ";
    //        otherClassesAmount += memberClasses[k];
    //        delete memberClasses[k];
    //    }
    //}
    //memberClasses[otherClasses] = otherClassesAmount;

    var classAmount = []
    var colors = []
    for (var k in memberClasses) {
        //    colors.push(getClassColor(k));
        classAmount.push(memberClasses[k])
    }
    colors = ["rgb(11,11,11)", "rgb(242,163,101)", "rgb(48,71,94)", "rgb(101,64,98)"]
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
        borderColor: "rgba(10,10,10,0.3)",
        responsive: false,
        plugins: {
            legend: {
                display: false,
                position: 'top',
            },
            title: {
                display: true,
                text: 'Class distribution',
                color:"#ECECEC"
            }
        }
    },
};


classChart = new Chart(
    document.getElementById('classes'),
    classDisplayConfig
);


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
            color = "rgb(20,50,150)";
            break;
        case ("Witch"):
            color = "rgb(70,240,240)";
            break;
        case ("Striker"):
            color = "rgb(255,250,200)";
            break;
        case ("Zerk"):
            color = "rgb(128, 160,30)";
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

parties = [{ "Name": "Main", "Members": 0, "KD": 0 }, { "Name": "Flex", "Members": 0, "KD": 0 }, { "Name": "Def", "Members": 0, "KD": 0 }]

for (let i = 0; i < members.length; i++) {
    const element = members[i];
    if (element.party == "Main") {
        parties[0].KD += parseFloat(element.kd);
        parties[0].Members++;
    } else if (element.party == "Flex") {
        parties[1].KD += parseFloat(element.kd);
        parties[1].Members++;
    } else {
        parties[2].KD += parseFloat(element.kd);
        parties[2].Members++;
    }
}
for (let i = 0; i < 3; i++) {
    parties[i].KD = parties[i].KD / parties[i].Members;
}


partiesKD = [parties[0].KD, parties[1].KD, parties[2].KD]
colors = [ "rgba(242,163,101,0.6)", "rgba(48,71,94,0.6)", "rgb(101,64,98,0.6)"]

const partyData = {
    labels: ["Main", "Flex", "Def"],
    datasets: [{
        data: partiesKD, backgroundColor: colors
    }],

}

const groupConfig = {
    type: 'polarArea',
    data: partyData,
    options: {
        borderColor: "rgba(10,10,10,0.3)",
        scales: {
            r: {
              ticks: {
                color:"white",
                backdropColor:"rgba(0,0,0,0)"
              }
            }
          },
        responsive: false,
        plugins: {
            legend: {
                display: false,
                position: 'top',
            },
            title: {
                display: true,
                text: 'Party Performances (KD)',
                color:"#ECECEC"
            }
        }
    }
};



groupChart = new Chart(
    document.getElementById('groups'),
    groupConfig
);


kds = []

nodewars.forEach(nw => {
    kds.push(nw.kd);
});
const historyData = {
    labels: nodewarNames,
    datasets: [{
      data: kds
    }]
  };
  Chart.defaults.color = "white";
const historyConfig = {
    type: 'line',
    data: historyData,
    options: {
        borderColor: "#f2a365",
        plugins: {
            legend: {
                display: false,
                position: 'top',
            },
            title: {
                display: true,
                text: 'Nodewar KDs',
                color:"#ECECEC"
            }
        }
    }
  };

historyChart = new Chart(
    document.getElementById("history"),
    historyConfig
)






/* //attendance
var attendanceBox = document.getElementById("attendance");
highestAttendance = [];

members.forEach(m => {
    if(highestAttendance.length < 3){
        highestAttendance.push(m)
    }else{
        if(highestAttendance[2].joined<m.joined){
            highestAttendance[2] = m;
        }

        let i = 1;
        while(i >= 0 && highestAttendance[i].joined< m.joined){
            highestAttendance[i+1] = highestAttendance[i]
            highestAttendance[i] = m; 
            i--;
        }
    }
});

attendanceBox.innerHTML = `1. ${highestAttendance[0].name} - ${highestAttendance[0].joined}/${nodewars.length}<br>
2. ${highestAttendance[1].name} - ${highestAttendance[1].joined}/${nodewars.length}<br>
3. ${highestAttendance[2].name} - ${highestAttendance[2].joined}/${nodewars.length}<br>`;
 */

//GUILD INFO


//Winrate
var wonNws = 0;
nodewars.forEach(nw => {
    if(nw.result == 1)
        wonNws++;
    if(nw.result == 0)
        wonNws+=0.5;
});
document.getElementById("table1").innerHTML = parseInt((wonNws/nodewars.length)*100)+"%";

//Avg GS
var gsSum = 0;
members.forEach(m => {
    gsSum += parseInt(m.gs);
});
document.getElementById("table2").innerHTML = parseInt(gsSum/members.length);

//Main Class
//https://stackoverflow.com/questions/50723396/get-key-of-max-value-in-dictionary-nodejs
const result = Object.entries(memberClasses).reduce((a, b) => a[1] > b[1] ? a : b)[0]

document.getElementById("table3").innerHTML = result;


//Avg Attendance

var attSum = 0;

nodewars.forEach(nw => {
    attSum +=nw.members.length;
});

document.getElementById("table4").innerHTML = (attSum/nodewars.length).toFixed(2);


//Avg KD

var kdSum = 0;

nodewars.forEach(nw => {
    kdSum +=parseFloat(nw.kd);
});

document.getElementById("table5").innerHTML = (kdSum/nodewars.length).toFixed(2);