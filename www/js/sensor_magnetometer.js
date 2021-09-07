class SensorMagnetometer {
    constructor(elementID) {
      this.elementID = elementID;
      this.element = document.getElementById(this.elementID);
      this.isEnabled = false;

      this.isRecording = false;
      this.data = new Array();
      
      this.renderHTML();
    }
  
      /* GLOBAL / PUBLIC methods */
    enable() {
      log("Magnetometer enabled");
      this.isEnabled = true;
      this.renderHTML();
    }
    disable() {
      log("Magnetometer disabled");
      this.isEnabled = false;
      this.renderHTML();
    }
    
    update() {
      log("Magnetometer updated");
    }
    
    renderHTML() {
      log("Magnetometer rendered");
      
      var html = '';

      html += '<div class="card mb-3 rounded-3 shadow-sm">';
      html += ' <div class="card-header py-3">';
      html += '   <h4 class="my-0 fw-normal">Magnetometer</h4>';
      html += '   <div class="custom-control custom-switch">';
      if(this.isEnabled)
      {
        html += '     <input type="checkbox" class="custom-control-input" id="magnetometerSwitch" onclick="javascript:sensorMagnetometer.disable();" checked>';
        html += '     <label class="custom-control-label" for="magnetometerSwitch">Disable</label>';
      }
      else
      {
        html += '     <input type="checkbox" class="custom-control-input" id="magnetometerSwitch" onclick="javascript:sensorMagnetometer.enable();">';
        html += '     <label class="custom-control-label" for="magnetometerSwitch">Enable</label>';
      }
      html += '   </div>';
      html += ' </div>';
      html += ' <div class="card-body">';
      html += '   <h1 class="card-title pricing-card-title" id="gyroscopeTimestamp">{TIMESTAMP}</h1>';
      html += '   <p id="magnetometerData">No Mag data yet.</p>';
      if(this.isEnabled)
      {
        html += '   <button id="btnEnableMagnetometer" onclick="javascript:sensorMagnetometer.disable();">Disable Magnetometer Sensor</button>';
      }
      else
      {
        html += '   <button id="btnDisableMagnetometer" onclick="javascript:sensorMagnetometer.enable();">Enable Magnetometer Sensor</button>';
      }
      html += ' </div>';
      html += '</div>';

      this.element.innerHTML = html;
    }
    save() {
      log("Magnetometer saved");
    }
      /* PRIVATE (sensor specific) methods */
  
  
  
  }
  
  

/* 

let magnetometer = null;
let magnetometer_debug = document.getElementById("magnetometerElement");
try {
    magnetometer = new Magnetometer({ referenceFrame: 'device', frequency: 60 });
    magnetometer.addEventListener('error', event => {
        // Handle runtime errors.
        if (event.error.name === 'NotAllowedError') {
            // Branch to code for requesting permission.
        } else if (event.error.name === 'NotReadableError' ) {
            console.log('Cannot connect to the sensor.');
        }
    });
    magnetometer.addEventListener('reading', e => {
		magnetometer_debug.innerHTML = "Magnetic field along the X-axis<br />" + magnetometer.x + " μT.<br />" + "Magnetic field along the Y-axis<br />" + magnetometer.y + " μT.<br />" + "Magnetic field along the Z-axis<br />" + magnetometer.z + " μT.";


        magnetometer_dataframe = {time_ms: new Date().getTime(),
            x: magnetometer.x,
            y: magnetometer.y,
            z: magnetometer.z
        };
        sensorRecorder.onMagnetometerData(magnetometer_dataframe);
          


    });
    magnetometer.start();
} catch (error) {
    // Handle construction errors.
    if (error.name === 'SecurityError') {
        // See the note above about feature policy.
        console.log('Magnetometer construction was blocked by a feature policy.');
    } else if (error.name === 'ReferenceError') {
        console.log('Magnetometer is not supported by the User Agent.');
    } else {
        throw error;
    }
	magnetometer_debug.innerHTML = error;
}

*/





