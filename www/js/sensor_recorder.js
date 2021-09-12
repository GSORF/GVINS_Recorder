class SensorRecorder {
    constructor(elementID = "divSensorRecorder") {
        this.elementID = elementID;
        this.element = document.getElementById(this.elementID);
        this.isEnabled = false;
  
        this.isRecording = false;
        this.data = new Array();
        
        // Recorder specific member variables (number of measurements)
        this.dataCamera = new Array();
        this.dataAccelerometer = new Array();
        this.dataGyroscope = new Array();
        this.dataMagnetometer = new Array();
        this.dataGPS = new Array();

        this.dataCameraLength = 0;
        this.dataAccelerometerLength = 0;
        this.dataGyroscopeLength = 0;
        this.dataMagnetometerLength = 0;
        this.dataGPSLength = 0;

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
    onCameraData(length)
    {
      this.dataCameraLength = length;
      this.onDataUpdated();
    }

    /*
        Accelerometer Callback: Display current data count
    */
    onAccelerometerData(length)
    {
      this.dataAccelerometerLength = length;
      this.onDataUpdated();
    }
    /*
        Gyroscope Callback: Display current data count
    */
    onGyroscopeData(length)
    {
      this.dataGyroscopeLength = length;
      this.onDataUpdated();
      
    }
    /*
        Magnetometer Callback: Display current data count
    */
    onMagnetometerData(length)
    {
      this.dataMagnetometerLength = length;
      this.onDataUpdated();
    }
    /*
        GPS Callback: Display current data count
    */
    onGPSData(length)
    {
      this.dataGPSLength = length;
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

        this.dataCamera = sensorCamera.getData();
        this.dataGPS = sensorGPS.getData();
        this.dataAccelerometer = sensorAccelerometer.getData();
        this.dataGyroscope = sensorGyroscope.getData();
        this.dataMagnetometer = sensorMagnetometer.getData();
      }

      this.renderHTML();
      log("Toggling recording: " + this.isRecording);
    }

    onDownloadRecording()
    {
      this.data = JSON.stringify({ gps: this.dataGPS, camera: this.dataCamera, accelerometer: this.dataAccelerometer, gyroscope: this.dataGyroscope, magnetometer: this.dataMagnetometer});
      /* 
      var element = document.createElement('a');
                element.setAttribute('href','data:text/plain;charset=utf-8, ' + encodeURIComponent(data_string));
                element.setAttribute('download', "filename.json");
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
*/
        var type = LocalFileSystem.PERSISTENT;
        var size = 0;
        var timestamp = new Date().getTime();
        this.filename = 'measurement_' + timestamp + '.txt';
        window.requestFileSystem(type, size, this.fileSuccessCallback, this.fileErrorCallback);
              
    }

    fileSuccessCallback(filesystem)
    {
      /* 
        console.log(filesystem);
        log('file system open: ' + filesystem.name);
        filesystem.root.getFile("newPersistentFile.json", { create: true }, function (fileEntry) {
    
            log("fileEntry is file?" + fileEntry.isFile.toString() + " - " + fileEntry.fullPath + " - " + fileEntry.nativeURL);
            // fileEntry.name == 'someFile.txt'
            // fileEntry.fullPath == '/someFile.txt'
            sensorRecorder.writeFile(fileEntry, sensorRecorder.data);
    
        }, sensorRecorder.onErrorCreateFile);
    
      */
        log("Saving " + sensorRecorder.filename);
        filesystem.root.getFile(sensorRecorder.filename, {create: true}, function(fileEntry) {

          sensorRecorder.writeFile(fileEntry, sensorRecorder.data);

       }, sensorRecorder.fileErrorCallback);

    }

    fileErrorCallback(error)
    {
      alert("ERROR: " + error + "-" + error.code);
    }

    writeFile(fileEntry, dataObj) {
      // Create a FileWriter object for our FileEntry (log.txt).
      fileEntry.createWriter(function (fileWriter) {
  
          fileWriter.onwriteend = function() {
              log("Successful file write... " + fileWriter + "-" + fileEntry.fullPath + " - " + fileEntry.nativeURL);
              
              var url = fileEntry.toURL();
              var mimeType = 'text/plain';
              cordova.plugins.fileOpener2.open(url, mimeType, {
                error: function error(err) {
                  log("Unable to open the file" + err, true);
                  alert("Unable to open the file");
                },
                success: function success() {
                  log("success with opening the file " + url);
                }
              });
          };
  
          fileWriter.onerror = function (e) {
              log("Failed file write: " + e.toString());
          };
  
          // If data object is not passed in,
          // create a new Blob instead.
          if (!dataObj) {
              dataObj = new Blob(['some example data'], { type: 'text/plain' });
          }

          fileWriter.write(dataObj);
      }, sensorRecorder.onErrorCreateFile);
    }
    onErrorCreateFile(error)
    {
      log("onErrorCreateFile: " + error.code + " - " + error);
    }
    onErrorLoadFs()
    {
      log("onErrorLoadFs");
    }


    onDataUpdated()
    {
      var html = "";
      if(this.isRecording)
      {
        html += "[RECORDING] ";
      }
      html += "Camera (" + this.dataCameraLength;
      html += "), GPS (" + this.dataGPSLength;
      html += "), Accelerometer (" + this.dataAccelerometerLength;
      html += "), Gyroscope (" + this.dataGyroscopeLength + ")";

      document.getElementById("recorderTimestamp").innerText = html;
    }
};

