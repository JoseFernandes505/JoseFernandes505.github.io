//Main JS File
//
//Jose Fernandes

window.onload = function () {
    var mymap = L.map('mapid');
    var layerGroup = L.layerGroup().addTo(mymap);

    var useCoalesce = false;

    function CreateMap(){
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1
        }).addTo(mymap);
        
        mymap.setView([28.5383, -81.3792], 13);

    }

    //Data from https://data.world/timothyrenner/haunted-places
    async function GetCSVData(csvName){
        const response = await fetch(csvName); 
        const data = await response.text();
        
        const parsedData = Papa.parse(data, {header: true});

        parsedData.data.forEach(row => {
            if(row["latitude"] != null && row["longitude"] != null){
                var marker = L.marker([row["latitude"], row["longitude"]]).addTo(layerGroup);

                marker.bindPopup("<h3>" + row["location"] + "</h3> <br/> " + row["description"]);
                marker.on('mouseover', function (e) {
                    this.openPopup();
                });
                marker.on('mouseout', function (e) {
                    this.closePopup();
                });
            }
        });
    }

    function SwitchButtonClicked(){
        //Switches whether or not to use the coalescing CSV
        useCoalesce = !useCoalesce;
        
        //Clears all markers
        layerGroup.clearLayers();
        
        document.getElementById('csvDiv').innerHTML = useCoalesce ? "haunted-places-coalesce.csv" : "haunted-places.csv";
        GetCSVData(useCoalesce ? "haunted-places-coalesce.csv" : "haunted-places.csv");
    }

    //Function calls
    CreateMap();
    GetCSVData("haunted-places.csv");
}