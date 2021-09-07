class SensorRecorder {
    constructor(elementID = "divSensorRecorder") {
        this.elementID = elementID;
        this.element = document.getElementById(this.elementID);
        this.isEnabled = false;
  
        this.isRecording = false;
        this.data = new Array();
        
        this.renderHTML();

        // Recorder specific member variables
        this.dataVideo = new Array();
        this.dataAccelerometer = new Array();
        this.dataGyroscope = new Array();
        this.dataMagnetometer = new Array();
        this.dataGPS = new Array();
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
        html += '   <h1 id="recorderTimestamp" class="card-title pricing-card-title">{TIMESTAMP}</h1>';
        html += '   <input type="checkbox" id="record_video" name="cbRecordVideo" checked><label for="record_video">&nbsp;Video</label><br />';
        html += '   <input type="checkbox" id="record_gps" name="cbRecordGPS" checked><label for="record_gps">&nbsp;GPS</label><br />';
        html += '   <input type="checkbox" id="record_accelerometer" name="cbRecordAccelerometer" checked><label for="record_accelerometer">&nbsp;Accelerometer</label><br />';
        html += '   <input type="checkbox" id="record_gyroscope" name="cbRecordGyroscope" checked><label for="record_gyroscope">&nbsp;Gyroscope</label><br />';
        html += '   <button id="btnToggleRecording">Start recording</button>';
        html += '   <button id="btnDownloadRecording">Download recording</button>';
        if(this.isEnabled)
        {
          html += '   <button id="btnEnableSensorRecorder" onclick="javascript:sensorRecorder.disable();">Disable Sensor Recorder</button>';
        }
        else
        {
          html += '   <button id="btnDisableSensorRecorder" onclick="javascript:sensorRecorder.enable();">Enable Sensor Recorder</button>';
        }
        html += ' </div>';
        html += '</div>';
  
        this.element.innerHTML = html;
      }
      save() {
        log("Magnetometer saved");
      }
        /* PRIVATE (sensor specific) methods */
    
    
    /*
        Video Callback: Save current video frame
    */
    onVideoData(dataframe)
    {
        if(this.isRecording)
        {
            this.dataVideo.push(dataframe);
            console.log("Video length:", this.dataVideo.length);
            this.onDataUpdated();
        }
    }

    /*
        Accelerometer Callback: Save current video frame
    */
    onAccelerometerData(dataframe)
    {
        if(this.isRecording)
        {
            this.dataAccelerometer.push(dataframe);
            console.log("Accelerometer length:", this.dataAccelerometer.length);
            this.onDataUpdated();
        }
    }
    /*
        Gyroscope Callback: Save current video frame
    */
    onGyroscopeData(dataframe)
    {
        if(this.isRecording)
        {
            this.dataGyroscope.push(dataframe);
            console.log("Gyroscope length:", this.dataGyroscope.length);
            this.onDataUpdated();
        }
    }
    /*
        Magnetometer Callback: Save current video frame
    */
    onMagnetometerData(dataframe)
    {
        if(this.isRecording)
        {
            this.dataMagnetometer.push(dataframe);
            console.log("Magnetometer length:", this.dataMagnetometer.length);
            this.onDataUpdated();
        }
    }
    /*
        GPS Callback: Save current video frame
    */
    onGPSData(dataframe)
    {
        if(this.isRecording)
        {
            this.dataGPS.push(dataframe);
            console.log("GPS length:", this.dataGPS.length);
            this.onDataUpdated();
        }
    }
                
    onToggleRecording(doRecording)
    {
        console.log("Toggling recording:", doRecording);
        this.isRecording = doRecording;
    }


    onDownloadRecording()
    {
        var data_string = JSON.stringify({ video: this.dataVideo, accelerometer: this.dataAccelerometer, gyroscope: this.dataGyroscope, magnetometer: this.dataMagnetometer, gps: this.dataGPS});
        var element = document.createElement('a');
                  element.setAttribute('href','data:text/plain;charset=utf-8, ' + encodeURIComponent(data_string));
                  element.setAttribute('download', "filename.json");
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
    }
    onDataUpdated()
    {
        document.getElementById("recorder_timestamp").innerText = "Video (" + this.dataVideo.length + "), GPS (" + this.dataGPS.length + "), Accelerometer (" + this.dataAccelerometer.length  + "), Gyroscope (" + this.dataGyroscope.length + ")";
    }
};

