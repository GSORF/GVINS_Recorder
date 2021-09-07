class SensorAccelerometer {
  constructor(elementID) {
    this.elementID = elementID;
    this.element = document.getElementById(this.elementID);
    this.isEnabled = false;
    this.isAvailable = false;

    this.isRecording = false;
    this.data = new Array();
    
    // Accelerometer specific member variables
    try {
      this.accelerometer = new Accelerometer({ referenceFrame: 'device', frequency: 60 });

      this.accelerometer.addEventListener('error', e => {
        // Handle runtime errors.
        if (e.error.name === 'NotAllowedError') {
            // Branch to code for requesting permission.
        } else if (e.error.name === 'NotReadableError' ) {
            log('Cannot connect to the accelerometer.');
        }
      });

      this.accelerometer.addEventListener('reading', ev => {
  
        if(this.isRecording)
        {
          var accelerometer_dataframe = {time_ms: new Date().getTime(),
            x: this.accelerometer.x,
            y: this.accelerometer.y,
            z: this.accelerometer.z
          };
          this.data.push(accelerometer_dataframe);
        }
        var dataHTML = "";
    
        dataHTML += "Acceleration along the X-axis<br />" + this.accelerometer.x + " m/s2.<br />";
        dataHTML += "Acceleration along the Y-axis<br />" + this.accelerometer.y + " m/s2.<br />";
        dataHTML += "Acceleration along the Z-axis<br />" + this.accelerometer.z + " m/s2.";
    
        document.getElementById("accelerometerData").innerHTML = dataHTML;
      });
      
      this.isAvailable = true;
      log("Accelerometer constructor called!");
    } catch (error) {
      // Handle construction errors.
      if (error.name === 'SecurityError') {
        // See the note above about feature policy.
        log('Accelerometer construction was blocked by a feature policy.');
      } else if (error.name === 'ReferenceError') {
        log('Accelerometer is not supported by the User Agent.');
      } else {
        log(error);
        throw error;
      }
    }
    this.renderHTML();
  }
  
  /* GLOBAL / PUBLIC methods */
  enable() {
    if(this.isAvailable == false)
    {
      return;
    }
    
    log("Accelerometer enabled");
    this.isEnabled = true;
    this.renderHTML();

    this.accelerometer.start();
  }
  disable() {
    if(this.isAvailable == false)
    {
      return;
    }
    
    log("Accelerometer disabled");
    this.isEnabled = false;
    this.renderHTML();

    this.accelerometer.stop();
  }
  
  toggleRecording(record) {
    this.isRecording = record;
    if(record)
    {
      log("Accelerometer recording started.");
    }
    else
    {
      log("Accelerometer recording stopped.")
    }
  }
    
  renderHTML() {
    log("Accelerometer rendered");
    
    var html = '';
    
    if(this.isAvailable)
    {
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
      html += ' </div>';
      html += '</div>';
    }
    else
    {
      html += '<div class="card mb-3 rounded-3 shadow-sm">';
      html += ' <div class="card-header py-3">';
      html += '   <h4 class="my-0 fw-normal">Accelerometer</h4>';
      html += ' </div>';
      html += ' <div class="card-body">';
      html += '   <p id="accelerometerData">Accelerometer is not available on this device.</p>';
      html += ' </div>';
      html += '</div>';
    }
    
    this.element.innerHTML = html;
  }
  getData() {
    log("Exporting Accelerometer...");
    return this.data;
  }
  /* PRIVATE (sensor specific) methods */

}
