//Main JS File
//
//Jose Fernandes

var CSVTypeToColor = {
    "Ghost": "Blue",
    "Bigfoot": "Brown",
    "UFO": "DarkMagenta"
}

window.onload = function () {
    var map = L.map('mapid');
    var layerGroup = L.layerGroup().addTo(map);

    var useCoalesce = false;

    var menuOpen = false;
    var showGhosts = false;
    var showBigfoot = false;
    var showUFOs = false;


    var ImmediateFilterAction = L.Toolbar2.Action.extend({
        initialize: function (map, myAction) {
            this.map = map;
            this.myAction = myAction;
            L.Toolbar2.Action.prototype.initialize.call(this);
        },
        addHooks: function () {

            ShowChosenData()
        }
    });
    var GhostAction = ImmediateFilterAction.extend({
        options: {
            toolbarIcon: {
                html: 'Ghosts',
                tooltip: 'Load Ghost encounters!'
            }
        },
        addHooks: function () {
            showGhosts = !showGhosts;

            ImmediateFilterAction.prototype.addHooks.call(this);
        }
    });
    var BigfootAction = ImmediateFilterAction.extend({
        options: {
            toolbarIcon: {
                html: 'Bigfoot',
                tooltip: 'Load Bigfoot sightings!'
            }
        },
        addHooks: function () {
            showBigfoot = !showBigfoot;

            ImmediateFilterAction.prototype.addHooks.call(this);
        }
    });
    var UFOAction = ImmediateFilterAction.extend({
        options: {
            toolbarIcon: {
                html: 'UFO',
                tooltip: 'Load UFO sightings!'
            }
        },
        addHooks: function () {
            showUFOs = !showUFOs;

            ImmediateFilterAction.prototype.addHooks.call(this);
        }
    });
    var MyCustomAction = L.Toolbar2.Action.extend({
        options: {
            toolbarIcon: {
                className: 'glyphicon glyphicon-menu-hamburger',
            },
            subToolbar: new L.Toolbar2({
                actions: [GhostAction, BigfootAction, UFOAction]
            })
        },
        addHooks: function () {
            menuOpen = !menuOpen;
            if (!menuOpen)
                this.myAction.disable();
        }
    });

    function CreateMap() {
        //Creates Tile Layer
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1
        }).addTo(map);

        //Creates Toolbar
        new L.Toolbar2.Control({
            position: 'topleft',
            actions: [MyCustomAction]
        }).addTo(map);

        //Zooms into Orlando
        map.setView([0, 0], 3);

        map.on('click', onMapClick);
    }

    function onMapClick(e) {
        map.closePopup();
    }


    async function ShowChosenData() {
        layerGroup.clearLayers();

        if (showGhosts) {
            GetCSVData("haunted-places.csv", "Ghost")
        }
        if (showBigfoot) {
            GetCSVData("bigfoot-reports.csv", "Bigfoot");
        }
        if (showUFOs) {
            GetCSVData("UFO-reports.csv", "UFO");
        }
    }

    //Data from:
    //https://data.world/timothyrenner/haunted-places
    //https://data.world/ninja/understanding-bigfoot-sightings
    async function GetCSVData(csvName, type) {
        const response = await fetch(csvName);
        const data = await response.text();

        const parsedData = Papa.parse(data, { header: true });

        parsedData.data.forEach(row => {
            if (row["latitude"] != null && row["longitude"] != null) {
                var marker = L.circleMarker([row["latitude"], row["longitude"]], {
                    "radius": 5,
                    "fillColor": CSVTypeToColor[type],
                    "color": CSVTypeToColor[type],
                    "weight": 1,
                    "opacity": 1
                }).addTo(layerGroup);

                var title = "";
                if (type == "Ghost") {
                    title = "Ghost at " + row["location"];
                } else
                    if (type == "Bigfoot") {
                        title = "Bigfooot sighting in " + row["county"];
                    } else
                        if (type == "UFO") {
                            title = row["shape"] + " UFO sighted near " + row["city"];
                        }

                marker.bindPopup("<div class=\"scrollbox\"><h3 style=\"color:" + CSVTypeToColor[type] + "\">" + title + "</h3> <br/> " + row["description"]);
                marker.on('mouseover', function (e) {
                    this.openPopup();
                });
            }
        });
    }

    //Function calls
    CreateMap();
    ShowChosenData();
}