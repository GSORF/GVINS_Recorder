class SensorAccelerometer {
    constructor(elementID) {
      this.elementID = elementID;
      this.element = document.getElementById(this.elementID);
      this.isEnabled = false;

      this.isRecording = false;
      this.data = new Array();
      
      this.renderHTML();

      // Accelerometer specific member variables
      this.accelerometer = new Accelerometer({ referenceFrame: 'device', frequency: 60 });
    }
  
      /* GLOBAL / PUBLIC methods */
    enable() {
      log("Accelerometer enabled");
      this.isEnabled = true;
      this.renderHTML();

      this.accelerometer.start()
      accelerometer.addEventListener('error', e => onAccelerometerError);
      accelerometer.addEventListener('reading', e => onAccelerometerReading);
    }
    disable() {
      log("Accelerometer disabled");
      this.isEnabled = false;
      this.renderHTML();

      accelerometer.removeEventListener('error', e => onAccelerometerError);
      accelerometer.removeEventListener('reading', e => onAccelerometerReading);
    }
    
    update() {
      log("Accelerometer updated");
    }
    
    renderHTML() {
      log("Accelerometer rendered");
      
      var html = '';
      
      html += '<div class="card mb-3 rounded-3 shadow-sm">';
      html += ' <div class="card-header py-3">';
      html += '   <h4 class="my-0 fw-normal">Accelerometer</h4>';
      html += '   <div class="custom-control custom-switch">';
      if(this.isEnabled)
      {
        html += '     <input type="checkbox" class="custom-control-input" id="accelerometerSwitch" onclick="javascript:sensorAccelerometer.disable();" checked>';
        html += '     <label class="custom-control-label" for="accelerometerSwitch">Disable</label>';
      }
      else
      {
        html += '     <input type="checkbox" class="custom-control-input" id="accelerometerSwitch" onclick="javascript:sensorAccelerometer.enable();">';
        html += '     <label class="custom-control-label" for="accelerometerSwitch">Enable</label>';
      }
      html += '   </div>';
      html += ' </div>';
      html += ' <div class="card-body">';
      html += '   <h1 id="accelerometerTimestamp" class="card-title pricing-card-title">{TIMESTAMP}</h1>';
      html += '   <p id="accelerometerData">No Accelerometer data yet.</p>';
      if(this.isEnabled)
      {
        html += '   <button id="btnEnableAccelerometer" onclick="javascript:sensorAccelerometer.disable();">Disable Accelerometer Sensor</button>';
      }
      else
      {
        html += '   <button id="btnDisableAccelerometer" onclick="javascript:sensorAccelerometer.enable();">Enable Accelerometer Sensor</button>';
      }
      html += ' </div>';
      html += '</div>';

      this.element.innerHTML = html;
    
    }
    save() {
      log("Accelerometer saved");
    }
      /* PRIVATE (sensor specific) methods */
    onAccelerometerReading(error) {
      accelerometer_debug.innerHTML = "Acceleration along the X-axis<br />" + accelerometer.x + " m/s2.<br />" + "Acceleration along the Y-axis<br />" + accelerometer.y + " m/s2.<br />" + "Acceleration along the Z-axis<br />" + accelerometer.z + " m/s2.";

      accelerometer_dataframe = {time_ms: new Date().getTime(),
          x: accelerometer.x,
          y: accelerometer.y,
          z: accelerometer.z
      };
      //sensorRecorder.onAccelerometerData(accelerometer_dataframe);
        

    }
      
    onAccelerometerError(error) {
        // Handle runtime errors.
        if (e.error.name === 'NotAllowedError') {
          // Branch to code for requesting permission.
      } else if (e.error.name === 'NotReadableError' ) {
          log('Cannot connect to the accelerometer.');
      }
    }
      
  
  }
  
  


/* 					

let accelerometer = null;
let accelerometer_debug = document.getElementById("accelerometerData");
try {
    
    
    accelerometer.start();
} catch (error) {
    // Handle construction errors.
    if (error.name === 'SecurityError') {
        // See the note above about feature policy.
        console.log('Accelerometer construction was blocked by a feature policy.');
    } else if (error.name === 'ReferenceError') {
        console.log('Accelerometer is not supported by the User Agent.');
    } else {
        throw error;
    }
	accelerometer_debug.innerHTML = error;
}

                    
*/


