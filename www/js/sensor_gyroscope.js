class SensorGyroscope {
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
      log("Gyroscope enabled");
      this.isEnabled = true;
      this.renderHTML();
    }
    disable() {
      log("Gyroscope disabled");
      this.isEnabled = false;
      this.renderHTML();
    }
    
    update() {
      log("Gyroscope updated");
    }
    
    renderHTML() {
      log("Gyroscope rendered");

      var html = '';

      html += '<div class="card mb-3 rounded-3 shadow-sm">';
      html += ' <div class="card-header py-3">';
      html += '   <h4 class="my-0 fw-normal">Gyroscope</h4>';
      html += '   <div class="custom-control custom-switch">';
      if(this.isEnabled)
      {
        html += '     <input type="checkbox" class="custom-control-input" id="gyroscopeSwitch" onclick="javascript:sensorGyroscope.disable();" checked>';
        html += '     <label class="custom-control-label" for="gyroscopeSwitch">Disable</label>';
      }
      else
      {
        html += '     <input type="checkbox" class="custom-control-input" id="gyroscopeSwitch" onclick="javascript:sensorGyroscope.enable();">';
        html += '     <label class="custom-control-label" for="gyroscopeSwitch">Enable</label>';
      }
      html += '   </div>';
      html += ' </div>';
      html += ' <div class="card-body">';
      html += '   <h1 id="gyroscopeTimestamp" class="card-title pricing-card-title">{TIMESTAMP}</h1>';
      html += '   <p id="gyroscopeData">No Gyro data yet.</p>';
      if(this.isEnabled)
      {
        html += '   <button id="btnEnableGyroscope" onclick="javascript:sensorGyroscope.disable();">Disable Gyroscope Sensor</button>';
      }
      else
      {
        html += '   <button id="btnDisableGyroscope" onclick="javascript:sensorGyroscope.enable();">Enable Gyroscope Sensor</button>';
      }
      html += ' </div>';
      html += '</div>';

      this.element.innerHTML = html;
    }
    save() {
      log("Gyroscope saved");
    }
      /* PRIVATE (sensor specific) methods */
  
  
  
  }
  
  
  
/* 


let gyroscope = null;
let gyroscope_debug = document.getElementById("gyroscopeElement");
try {
    gyroscope = new Gyroscope({ referenceFrame: 'device', frequency: 60 });
    gyroscope.addEventListener('error', event => {
        // Handle runtime errors.
        if (event.error.name === 'NotAllowedError') {
            // Branch to code for requesting permission.
        } else if (event.error.name === 'NotReadableError' ) {
            console.log('Cannot connect to the sensor.');
        }
    });
    gyroscope.addEventListener('reading', e => {
		gyroscope_debug.innerHTML = "Angular velocity along the X-axis<br />" + gyroscope.x + " rad/s.<br />" + "Angular velocity along the Y-axis<br />" + gyroscope.y + " rad/s.<br />" + "Angular velocity along the Z-axis<br />" + gyroscope.z + " rad/s.";

        gyroscope_dataframe = {time_ms: new Date().getTime(),
            x: gyroscope.x,
            y: gyroscope.y,
            z: gyroscope.z
        };
        sensorRecorder.onGyroscopeData(gyroscope_dataframe);
          

    });
    gyroscope.start();
} catch (error) {
    // Handle construction errors.
    if (error.name === 'SecurityError') {
        // See the note above about feature policy.
        console.log('Gyroscope construction was blocked by a feature policy.');
    } else if (error.name === 'ReferenceError') {
        console.log('Gyroscope is not supported by the User Agent.');
    } else {
        throw error;
    }
	gyroscope_debug.innerHTML = error;
}





*/





