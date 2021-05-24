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

        }
    }

}

class nodewar{
    constructor(date,members){
        this.date = date;
        this.members = members;
        this.kills = 0;
        this.deaths = 0;
        this.kd = 0;
        members.forEach(m => {
            this.nwIndex = nodewarNames.indexOf(date);
            this.kills += m.stats[this.nwIndex][0];
            this.deaths += m.stats[this.nwIndex][1];
        });
        this.kd = parseFloat(this.kills / this.deaths).toFixed(2);
    }
}

nodewars = []
members = [];
kdChart = null;
amountOfNodewars = Object.keys(rawData[0]).length - 4;
nodewarNames = []
for (let i = 0; i < amountOfNodewars; i++) {
    key = Object.keys(rawData[0])[i + 4];
    nodewarNames.push(key)
}

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
        }
        else {
            stats.push(null)
        }

    }
    m = new member(rawData[i].name, rawData[i].party, rawData[i].gs, rawData[i].class, stats)
    if (m.kd > 0)
        members.push(m)
}


for (let i = 0; i < nodewarNames.length; i++) {
    membersInNw = [];
    members.forEach(m => {
        if(m.stats[i] != null){
            membersInNw.push(m);
        }
    });

    nw = new nodewar(nodewarNames[i],membersInNw);
    nodewars.push(nw);
}


members.sort((a, b) => b.kd - a.kd)
members.forEach(m => {
    m.place = members.indexOf(m) + 1
});

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




function displayAll() {
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

    m = members.find(e => e.name == name);
    document.getElementById("tableTitle").innerHTML = `${name}<br>${m.kills}-${m.deaths}<br>${m.kd}`;
    d = {};
    allKDs = []
    for (let i = 0; i < nodewarNames.length; i++) {
        if (m.stats[i] != null) {
            kd = parseFloat(m.stats[i][0] / m.stats[i][1]).toFixed(2);
            allKDs.push(kd);
            date = nodewarNames[i].split("w")[1];
            day = date.slice(0,2);
            month = date.slice(2,4);
            d[day+"."+month] = `${m.stats[i][0]} | ${m.stats[i][1]} (${kd})`;
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
        avgKDs.push(nw.kd);
    });
    console.log(avgKDs);
    const data = {
        labels: Object.keys(d),
        datasets: [{
          label: m.name,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: allKDs
        },{
        label: "Avg",
        backgroundColor: 'rgb(123, 99, 255)',
        borderColor: 'rgb(123, 99, 255)',
        data: avgKDs
        }]
      };
    
    const config = {
        type: 'line',
        data:data,
        options: {}
      };   
      kdChart = new Chart(
        document.getElementById('kdChart'),
        config
      );










}


