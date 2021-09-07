class SensorGPS {
  constructor(elementID = "divGPS") {
    this.elementID = elementID;
    this.element = document.getElementById(this.elementID);
    this.isEnabled = false;

    this.isRecording = false;
    this.data = new Array();
    
    
    // GPS specific member variables
    this.hasGPSFix = false;
    this.watchID = null;
    this.utm_northing = 0;
    this.utm_easting = 0;
    this.utm_zoneNum = 0;
    this.utm_zoneLetter = "";
    this.geolocationOptions = { maximumAge: 0, timeout: 5000, enableHighAccuracy: true };

    // Draw GPS Panel in UI
    this.renderHTML();
    log("GPS constructor called!");
  }

	/* GLOBAL / PUBLIC methods */
  enable() {
    if (navigator.geolocation) {
      this.watchID = navigator.geolocation.watchPosition(this.onGeolocationSuccess.bind(this), this.onGeolocationError.bind(this), this.geolocationOptions);
      this.isEnabled = true;
      this.renderHTML();
      log("GPS enabled, watchId = " + this.watchID);
      
    } else {
      this.element.innerHTML = "Geolocation is not supported on this device.";
    }
  }
  disable() {
    
    if (navigator.geolocation) {
      navigator.geolocation.clearWatch(this.watchID);
      this.isEnabled = false;
      this.renderHTML();
      log("GPS disabled, watchId = " + this.watchID);
      
    } else {
      this.element.innerHTML = "Geolocation is not supported on this device.";
    }

  }
  
  update() {
    log("GPS updated");
    
  }
  
  renderHTML() {
    log("GPS rendered");
    


    var html = '';
    
    html += '<div class="card mb-3 rounded-3 shadow-sm">';
    html += ' <div class="card-header py-3">';
    html += '   <h4 class="my-0 fw-normal">GPS</h4>';
    html += '   <div class="custom-control custom-switch">';
    if(this.isEnabled)
    {
      html += '     <input type="checkbox" class="custom-control-input" id="gpsSwitch" onclick="javascript:sensorGPS.disable();" checked>';
      html += '     <label class="custom-control-label" for="gpsSwitch">Disable</label>';
    }
    else
    {
      html += '     <input type="checkbox" class="custom-control-input" id="gpsSwitch" onclick="javascript:sensorGPS.enable();">';
      html += '     <label class="custom-control-label" for="gpsSwitch">Enable</label>';
    }
    html += '   </div>';
    html += ' </div>';
    html += ' <div class="card-body">';
    html += '   <h1 id="gpsTimestamp" class="card-title pricing-card-title">{TIMESTAMP}</h1>';
    html += '   <p id="gpsData">No GPS data yet.</p>';
    if(this.isEnabled)
    {
      html += '   <button id="btnEnableGPS" onclick="javascript:sensorGPS.disable();">Disable GPS Sensor</button>';
    }
    else
    {
      html += '   <button id="btnDisableGPS" onclick="javascript:sensorGPS.enable();">Enable GPS Sensor</button>';
    }
    html += ' </div>';
    html += '</div>';

    this.element.innerHTML = html;
    
  }
  getData() {
    console.log("Exporting GPS...");
    return this.data;
  }
	/* PRIVATE (i.e. sensor specific) methods */
  onGeolocationSuccess(position) {
    var utm_data = utm.fromLatLon(position.coords.latitude, position.coords.longitude);
    if(this.hasGPSFix == false)
    {
      console.log(utm_data);
      this.utm_northing = utm_data.northing;
      this.utm_easting = utm_data.easting;
      this.utm_zoneNum = utm_data.zoneNum;
      this.utm_zoneLetter = utm_data.zoneLetter;
      this.hasGPSFix = true;
    }
    else
    {
      console.log(utm_data);
      
    }
    // UTM: 48 N 377299 1483035
    // GPS: 13.41250188°N, 103.86666901°E
    // geodetic_data = utm.toLatLon(377299,1483035, 48, "P");
  
    // console.log(geodetic_data);
    // console.log(utm_data);
    document.getElementById("gpsData").innerHTML = "Latitude: " + position.coords.latitude +
    "<br />Longitude: " + position.coords.longitude +
    "<br />accuracy of position: " + position.coords.accuracy +
    "<br />altitude in meters above the mean sea level: " + position.coords.altitude +
    "<br />altitude accuracy of position: " + position.coords.altitudeAccuracy +
    "<br />heading as degrees clockwise from North: " + position.coords.heading +
    "<br />speed in meters per second: " + position.coords.speed +
    "<br />date/time of the response: " + position.timestamp +
    "<br />easting (UTM, delta first fix): " + (utm_data.easting-this.utm_easting) +
    "<br />northing (UTM, delta first fix): " + (utm_data.northing-this.utm_northing) +
    "<br />zoneNum (UTM): " + (utm_data.zoneNum);
    
    document.getElementById("gpsTimestamp").textContent = "Timestamp: " + Date.now();
  
    var gps_dataframe = {time_ms: new Date().getTime(),
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy,
    altitude: position.coords.altitude,
    altitudeAccuracy: position.coords.altitudeAccuracy,
    heading: position.coords.heading,
    speed: position.coords.speed,
    timestamp: position.timestamp,
    easting: utm_data.easting,
    northing: utm_data.northing,
    zoneNum: utm_data.zoneNum,
    easting_offset: (utm_data.easting-this.utm_easting),
    northing_offset: (utm_data.northing-this.utm_northing)};

    if(this.isRecording)
    {
      this.data.push(dataframe);
    }
  }
  onGeolocationError(error) {
    log('code: '    + error.code    + ', ' +
          'message: ' + error.message);
  }
  
}
