function mainInit(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const nodewarID = urlParams.get('ID');

    selectedNodewar = getNodewar(nodewarID)


    document.getElementById("tableTitle").innerHTML = `Nodewar ${selectedNodewar.date}`;

    document.getElementById("tableK").innerHTML = selectedNodewar.kills;
    document.getElementById("tableD").innerHTML = selectedNodewar.deaths;
    document.getElementById("tableAK").innerHTML = (selectedNodewar.kills/selectedNodewar.members.length).toFixed(2);
    document.getElementById("tableAD").innerHTML = (selectedNodewar.deaths/selectedNodewar.members.length).toFixed(2);
    document.getElementById("tableKD").innerHTML = selectedNodewar.kd;

    members = []
    /* for (let i = 0; i < rawData.length; i++) {
        stats = [];
        for (let nw = 0; nw < amountOfNodewars; nw++) {
            key = Object.keys(rawData[i])[nw + 4];
            if (key != nodewarID)
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
    */


    for (let i = 0; i < newData.length; i++) {
        row = newData[i];

        var rawStats = row.slice(4);
        var stats = [];

        for (let j = 0; j < rawStats.length; j++) {
            if (nodewarNames[j] != nodewarID)
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
        if (m.stats[0]!= null)
            members.push(m)
    }






    //Sort Members by KD
    members.sort((a, b) => b.kd - a.kd)
    //Set Members Index
    members.forEach(m => {
        m.place = members.indexOf(m) + 1
    });



    table = new gridjs.Grid({
        columns: [{ id: "place", name: "" },
        {
            name: "Name",
            attributes: (cell) => {
                if (cell) {
                    return {
                        'data-cell-content': cell,
                        'id': cell,
                        'onclick': () => {
                            window.open("member.html?name=" + cell, "_top");
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
        style: {

            td: {
                "backgroundColor": "#111",
                "borderColor": "#222831"
            },
            container: {
                "color": "#ececec",
                "borderColor": "#222831"
            },
            table: {
                "backgroundColor": "#111",
                "color": "#ececec",
                "borderColor": "#222831"
            },
            th: {
                "backgroundColor": "#f2a365",
                "color": "#111",
                "borderColor": "#222831"
            },
            pargination: {
                "backgroundColor": "#111",
                "borderColor": "#222831"
            }

        }
    }).render(document.getElementById("wrapper"));







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

    for (let i = 0; i < selectedNodewar.members.length; i++) {
        const element = selectedNodewar.members[i];
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
}