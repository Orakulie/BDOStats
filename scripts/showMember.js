function displayMember(name) {
    var m = members.find(e => e.name == name);
    document.getElementById("tableTitle").innerHTML = `${name}`;

    //<br><br>Total Kills:${tK}<br>Total Deaths:${tD}<br>Avg Kills:${avgK.toFixed(2)}<br>Avg Deaths:${avgD.toFixed(2)} <br> Avg KD:${avgKD.toFixed(2)}

    document.getElementById("tableK").innerHTML = m.kills;
    document.getElementById("tableD").innerHTML = m.deaths;
    document.getElementById("tableAK").innerHTML = (m.kills/m.joined).toFixed(2);
    document.getElementById("tableAD").innerHTML = (m.deaths/m.joined).toFixed(2);
    document.getElementById("tableKD").innerHTML = m.kd;

    var d = {};
    var allKDs = []
    var nws = [];

    for (let i = 0; i < nodewarNames.length; i++) {
            nws.push(nodewarNames[i]);
    }

    for (let i = 0; i < nodewars.length; i++) {

        if (m.stats[i] != null) {
            if (m.stats[i][1] > 0) {
                kd = parseFloat(m.stats[i][0] / m.stats[i][1]).toFixed(2);
            } else {
                kd = m.stats[i][0];
            }
            allKDs.push(kd);
            d[nodewars[i].date] = `${m.stats[i][0]} | ${m.stats[i][1]} (${kd})`;
        }
    }
    var table = new gridjs.Grid({
        columns: Object.keys(d),
        data: [d],
        pagination: false,
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

    avgKDs = [];
    deviation = [];
    /* nodewars.forEach(nw => {
        joinedNws = Object.keys(d)
        date = nw.date
        if (joinedNws.includes(date)) {
            avgKDs.push(nw.kd);
            deviation.push(m.kd-nw.kd)
        }
    }); */

    for (let i = 0; i < nodewars.length; i++) {
        joinedNws = Object.keys(d)
        date = nodewars[i].date
        if (joinedNws.includes(date)) {
            avgKDs.push(nodewars[i].kd);
           // deviation.push(m.stats[i][0]/m.stats[i][1]-nodewars[i].kd)
        }
    }



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
        }/* ,
        {
            label: "Performance",
            backgroundColor: 'rgb(123, 200, 255)',
            borderColor: 'rgb(123, 200, 255)',
            data: deviation
        } */]
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
function mainInit(){
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const name = urlParams.get('name');

displayMember(name);



}





