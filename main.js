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
checkboxes = []
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
        }else{
            stats.push((null,null))
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

function updateTable(){
    var nws = [];
    checkboxes.forEach(cb => {
        if(cb.checked){
            nws.push(cb.id);
        }
    });
    changeMembers(nws);
}

function toggleCheckboxes(){
    var anyChecked = false;
    checkboxes.forEach(cb => {
        if(cb.checked){
            anyChecked = true;
        }
    });
    if(anyChecked == false){
        checkboxes.forEach(cb => {
            cb.checked = true;
        });
        toggleCheckboxesButton.innerHTML = "Uncheck All";
    }else{
        checkboxes.forEach(cb => {
            cb.checked = false;
        });
        toggleCheckboxesButton.innerHTML = "Check All";
    }
    updateTable();
}

function toggleCheckboxesVisiblity(b){
    if(b){
        checkboxDiv.style.display = "flex";
        toggleCheckboxesButton.style.display = "flex";
    }else{
        checkboxDiv.style.display = "none";
        toggleCheckboxesButton.style.display = "none";
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
    displayAll();
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
    m = members.find(e => e.name == name);
    document.getElementById("tableTitle").innerHTML = `${name}<br>${m.kills}-${m.deaths}<br>${m.kd}`;
    d = {};
    allKDs = []
    offset = 0;
    for (let i = 0; i < nodewarNames.length; i++) {

        while(i+offset < checkboxes.length &&!checkboxes[i+offset].checked)
            offset+=1;
        if (m.stats[i] != null) {
            if (m.stats[i][1] > 0) {
                kd = parseFloat(m.stats[i][0] / m.stats[i][1]).toFixed(2);
            } else {
                kd = m.stats[i][0];
            }
            allKDs.push(kd);
            date = nodewarNames[i+offset].split("w")[1];
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
        if(joinedNws.includes(date)){
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


