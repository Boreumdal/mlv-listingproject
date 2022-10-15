function initializeMap() {
    // get current position for default
    function pos(){
        if (document.querySelector('#lat').value == '' || document.querySelector('#lat').value == 'undefined' || document.querySelector('#lng').value == '' || document.querySelector('#lng').value == 'undefined'){
            document.querySelector('#sub').disabled = true
            document.querySelector('#sub').style.cursor = 'not-allowed'
            document.querySelector('#curpos').style.color = '#e74c3c'
            document.querySelector('#curpos').innerText = 'Pick/Redrag the pin •'
        }
        else {
            document.querySelector('#sub').disabled = false
            document.querySelector('#sub').style.cursor = 'pointer'
            document.querySelector('#curpos').style.color = '#2ed573'
            document.querySelector('#curpos').innerText = 'Ready to submit •'
        }
    }
    function current(){
        // local browser navigator support checker
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(success)
        }
        else {
            console.log('Geolocation not supported');
        }
    }

    // main function
    async function success(place){
        // current location variable
        let currLocation = {lat: place.coords.latitude, lng: place.coords.longitude}
        
        function containerEvent(evt) {
            mainFunc(evt)
        }
        
        function fireClick(map) {
          map.addEventListener('tap', containerEvent);
        }
        
        function mainFunc(evt) {
            map.removeEventListener('tap', containerEvent);
            var coord = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
            let latitude = Math.abs(coord.lat)
            //  + ((coord.lat > 0) ? 'N' : 'S')
            let longitude = Math.abs(coord.lng)

            sendToInput(latitude, longitude)
            
            var pointedMarker = new H.map.Marker({lat: Math.abs(coord.lat), lng: Math.abs(coord.lng)})
            
            pointedMarker.draggable = true
            map.addObject(pointedMarker)
            pos()
        }

        function dragger(map, behavior){
            map.addEventListener('dragstart', function(ev) {
                var target = ev.target,
                    pointer = ev.currentPointer;
                if (target instanceof H.map.Marker) {
                  var targetPosition = map.geoToScreen(target.getGeometry());
                  target['offset'] = new H.math.Point(pointer.viewportX - targetPosition.x, pointer.viewportY - targetPosition.y);
                  behavior.disable();
                }
                pos()
            }, false);
            
            map.addEventListener('dragend', function(ev) {
                var target = ev.target;
                if (target instanceof H.map.Marker) {
                  behavior.enable();
                }
                pos()
            }, false);
            
            map.addEventListener('drag', function(ev) {
                var target = ev.target,
                    pointer = ev.currentPointer;
                if (target instanceof H.map.Marker) {
                  target.setGeometry(map.screenToGeo(pointer.viewportX - target['offset'].x, pointer.viewportY - target['offset'].y));
                }
                sendToInput(target.a.lat, target.a.lng)
                pos()
            }, false);
        }

        function sendToInput(lat, lng){
            let valueLat = {
                value: lat,
                placeholder: lat // for debugging purpose
            }
            let valueLng = {
                value: lng,
                placeholder: lng // for debugging purpose
            }
            // for debugging purpose
            for (let attr in valueLat){
                document.querySelector('#lat').setAttribute(attr, valueLat[attr])
            }
            for (let attr in valueLng){
                document.querySelector('#lng').setAttribute(attr, valueLng[attr])
            }
            pos()
        }
        // hero connection
        var platform = await new H.service.Platform({
            apikey: 'GRUNlNT4RwB49FHL2BWfRxn3vRs1-OBzH3JfW2xAHxY'
        });
        var defaultLayers = platform.createDefaultLayers();

        var map = new H.Map(document.getElementById('map'),
        defaultLayers.vector.normal.map,{
            center: currLocation,
            zoom: 10
        });

        window.addEventListener('resize', () => map.getViewPort().resize())
        
        var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map))
        var ui = H.ui.UI.createDefault(map, defaultLayers)
        
        fireClick(map)
        dragger(map, behavior)
    }
    pos()
    current()
}
document.onload = initializeMap()