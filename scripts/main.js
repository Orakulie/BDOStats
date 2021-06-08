checkboxes = [];
checkboxDiv = document.getElementById("checkboxes");




//draw nodewarbox for each nodewar
allNwDiv = document.getElementById("allNws")
for (let i = 0; i < nodewars.length; i++) {



    var nwBlock = document.createElement("div");
    nwBlock.setAttribute("class","nwBlock");

    if(nodewars[i].result==1){
        nwBlock.style.backgroundColor="#61b15a";
    }else if(nodewars[i].result==0){
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
    columns: [{ id: "place", name: ""},
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
        columns: [{ id: "place", name: ""},
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
