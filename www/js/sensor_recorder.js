class SensorRecorder {
    constructor(elementID = "divSensorRecorder") {
        this.elementID = elementID;
        this.element = document.getElementById(this.elementID);
        this.isEnabled = false;
  
        this.isRecording = false;
        this.data = new Array();
        
        // Recorder specific member variables
        this.dataCamera = new Array();
        this.dataAccelerometer = new Array();
        this.dataGyroscope = new Array();
        this.dataMagnetometer = new Array();
        this.dataGPS = new Array();

        this.renderHTML();
      }
    
        /* GLOBAL / PUBLIC methods */
      enable() {
        log("Sensor recorder enabled");
        this.isEnabled = true;
        this.renderHTML();
      }
      disable() {
        log("Sensor recorder disabled");
        this.isEnabled = false;
        this.renderHTML();
      }
      
      update() {
        log("Sensor recorder updated");
      }
      
      renderHTML() {
        log("Sensor recorder rendered");
        
        var html = '';
  
        html += '<div class="card mb-3 rounded-3 shadow-sm">';
        html += ' <div class="card-header py-3">';
        html += '   <h4 class="my-0 fw-normal">Sensor Recorder</h4>';
        html += '   <div class="custom-control custom-switch">';
        if(this.isEnabled)
        {
          html += '     <input type="checkbox" class="custom-control-input" id="sensorRecorderSwitch" onclick="javascript:sensorRecorder.disable();" checked>';
          html += '     <label class="custom-control-label" for="sensorRecorderSwitch">Disable</label>';
        }
        else
        {
          html += '     <input type="checkbox" class="custom-control-input" id="sensorRecorderSwitch" onclick="javascript:sensorRecorder.enable();">';
          html += '     <label class="custom-control-label" for="sensorRecorderSwitch">Enable</label>';
        }
        html += '   </div>';
        html += ' </div>';
        html += ' <div class="card-body">';
        if(this.isEnabled)
        {
          html += '   <h1 id="recorderTimestamp" class="card-title pricing-card-title">{TIMESTAMP}</h1>';
          html += '   <input type="checkbox" id="record_camera" name="cbRecordCamera" checked><label for="record_camera">&nbsp;Camera</label><br />';
          html += '   <input type="checkbox" id="record_gps" name="cbRecordGPS" checked><label for="record_gps">&nbsp;GPS</label><br />';
          html += '   <input type="checkbox" id="record_accelerometer" name="cbRecordAccelerometer" checked><label for="record_accelerometer">&nbsp;Accelerometer</label><br />';
          html += '   <input type="checkbox" id="record_gyroscope" name="cbRecordGyroscope" checked><label for="record_gyroscope">&nbsp;Gyroscope</label><br />';
          html += '   <input type="checkbox" id="record_magnetometer" name="cbRecordGyroscope" checked><label for="record_magnetometer">&nbsp;Magnetometer</label><br />';

          if(this.isRecording)
          {
            html += '   <button id="btnToggleRecording" onclick="javascript:sensorRecorder.onToggleRecording(false);">Stop recording</button>';
          }
          else
          {
            html += '   <button id="btnToggleRecording" onclick="javascript:sensorRecorder.onToggleRecording(true);">Start recording</button>';
            var totalSizeBytes = 0;
            totalSizeBytes += JSON.stringify(this.dataCamera).replace(/[\[\]\,\"]/g,'').length;
            totalSizeBytes += JSON.stringify(this.dataAccelerometer).replace(/[\[\]\,\"]/g,'').length;
            totalSizeBytes += JSON.stringify(this.dataGyroscope).replace(/[\[\]\,\"]/g,'').length;
            totalSizeBytes += JSON.stringify(this.dataMagnetometer).replace(/[\[\]\,\"]/g,'').length;
            totalSizeBytes += JSON.stringify(this.dataGPS).replace(/[\[\]\,\"]/g,'').length;

            var totalSizeKiloBytes = totalSizeBytes / 1024.0;
            var totalSizeMegaBytes = totalSizeKiloBytes / 1024.0;

            
            html += '   <button id="btnDownloadRecording" onclick="javascript:sensorRecorder.onDownloadRecording();">Download recording (' + totalSizeMegaBytes + ' MB)</button>';
          }
        
        }
        else
        {
          html += '   <p>Please enable the sensor recorder in order to display options.</p>';
        }
        html += ' </div>';
        html += '</div>';
  
        this.element.innerHTML = html;
        if(this.isEnabled)
        {
          this.onDataUpdated();
        }

      }
      save() {
        log("Magnetometer saved");
      }
        /* PRIVATE (sensor specific) methods */
    
    
    /*
        Camera Callback: Display current data count
    */
    onCameraData(data)
    {
      this.dataCamera = data;
      this.onDataUpdated();
    }

    /*
        Accelerometer Callback: Display current data count
    */
    onAccelerometerData(data)
    {
      this.dataAccelerometer = data;
      this.onDataUpdated();
    }
    /*
        Gyroscope Callback: Display current data count
    */
    onGyroscopeData(data)
    {
      this.dataGyroscope = data;
      this.onDataUpdated();
      
    }
    /*
        Magnetometer Callback: Display current data count
    */
    onMagnetometerData(data)
    {
      this.dataMagnetometer = data;
      this.onDataUpdated();
    }
    /*
        GPS Callback: Display current data count
    */
    onGPSData(data)
    {
      this.dataGPS = data;
      this.onDataUpdated();
    }
                
    onToggleRecording(doRecording)
    {

      this.isRecording = doRecording;
      
      if(this.isRecording)
      {
        var recordCamera = document.getElementById("record_camera").checked;
        var recordGPS = document.getElementById("record_gps").checked;
        var recordAcclerometer = document.getElementById("record_accelerometer").checked;
        var recordGyroscope = document.getElementById("record_gyroscope").checked;
        var recordMagnetometer = document.getElementById("record_magnetometer").checked;

        sensorCamera.toggleRecording(recordCamera);
        sensorGPS.toggleRecording(recordGPS);
        sensorAccelerometer.toggleRecording(recordAcclerometer);
        sensorGyroscope.toggleRecording(recordGyroscope);
        sensorMagnetometer.toggleRecording(recordMagnetometer);
      }
      else
      {
        sensorCamera.toggleRecording(false);
        sensorGPS.toggleRecording(false);
        sensorAccelerometer.toggleRecording(false);
        sensorGyroscope.toggleRecording(false);
        sensorMagnetometer.toggleRecording(false);
      }

      this.renderHTML();
      log("Toggling recording: " + this.isRecording);
    }


    onDownloadRecording()
    {
      this.dataCamera = sensorCamera.getData();
      this.dataGPS = sensorGPS.getData();
      this.dataAccelerometer = sensorAccelerometer.getData();
      this.dataGyroscope = sensorGyroscope.getData();
      this.dataMagnetometer = sensorMagnetometer.getData();

      var data_string = JSON.stringify({ gps: this.dataGPS, camera: this.dataCamera, accelerometer: this.dataAccelerometer, gyroscope: this.dataGyroscope, magnetometer: this.dataMagnetometer});
      var element = document.createElement('a');
                element.setAttribute('href','data:text/plain;charset=utf-8, ' + encodeURIComponent(data_string));
                element.setAttribute('download', "filename.json");
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
    }
    onDataUpdated()
    {
      var html = "";
      if(this.isRecording)
      {
        html += "[RECORDING] ";
      }
      html += "Camera (" + this.dataCamera.length;
      html += "), GPS (" + this.dataGPS.length;
      html += "), Accelerometer (" + this.dataAccelerometer.length;
      html += "), Gyroscope (" + this.dataGyroscope.length + ")";

      document.getElementById("recorderTimestamp").innerText = html;
    }
};

