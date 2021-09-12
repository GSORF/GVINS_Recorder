class SensorMagnetometer {
  constructor(elementID) {
    this.elementID = elementID;
    this.element = document.getElementById(this.elementID);
    this.isEnabled = false;
    this.isAvailable = false;

    this.isRecording = false;
    this.data = new Array();

    // Magnetometer specific member variables
    try {
      this.magnetometer = new Magnetometer({ referenceFrame: 'device', frequency: 60 });

      this.magnetometer.addEventListener('error', error => {
        // Handle runtime errors.
        if (e.error.name === 'NotAllowedError') {
            // Branch to code for requesting permission.
        } else if (e.error.name === 'NotReadableError' ) {
            log('Cannot connect to the magnetometer.', true);
        }
      });
  
      this.magnetometer.addEventListener('reading', ev => {
        if(this.isRecording)
        {
          var magnetometer_dataframe = {time_ms: new Date().getTime(),
            x: this.magnetometer.x,
            y: this.magnetometer.y,
            z: this.magnetometer.z
          };
          this.data.push(magnetometer_dataframe);
          sensorRecorder.onMagnetometerData(this.data.length);
        }
        var dataHTML = "";
        
        dataHTML += "Magnetic field along the X-axis<br />" + this.magnetometer.x + " μT.<br />";
        dataHTML += "Magnetic field along the Y-axis<br />" + this.magnetometer.y + " μT.<br />";
        dataHTML += "Magnetic field along the Z-axis<br />" + this.magnetometer.z + " μT.";
    
        document.getElementById("magnetometerData").innerHTML = dataHTML;
        document.getElementById("magnetometerTimestamp").textContent = "Timestamp: " + Date.now();
      });
  
      window.addEventListener("compassneedscalibration",function(event) {
        // ask user to wave device in a figure-eight motion  
        event.preventDefault();
    }, true);
      this.isAvailable = true;
      log("Magnetometer constructor called!");
    } catch (error) {
      // Handle construction errors.
      if (error.name === 'SecurityError') {
        // See the note above about feature policy.
        log('Magnetometer construction was blocked by a feature policy.', true);
      } else if (error.name === 'ReferenceError') {
        log('Magnetometer is not supported by the User Agent.', true);
      } else {
        log(error, true);
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
      
    log("Magnetometer enabled");
    this.isEnabled = true;
    this.renderHTML();

    this.magnetometer.start();
  }
  disable() {
    if(this.isAvailable == false)
    {
      return;
    }
      
    log("Magnetometer disabled");
    this.isEnabled = false;
    this.renderHTML();

    this.magnetometer.stop();
  }
  
  toggleRecording(record) {
    this.isRecording = record;
    if(record)
    {
      log("Magnetometer recording started.");
    }
    else
    {
      log("Magnetometer recording stopped.")
    }
  }
    
  renderHTML() {
    log("Magnetometer rendered");
    
    var html = '';
    
    if(this.isAvailable)
    {
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
      html += '   <h1 id="magnetometerTimestamp" class="card-title pricing-card-title">{TIMESTAMP}</h1>';
      html += '   <p id="magnetometerData">No Magnetometer data yet.</p>';
      html += ' </div>';
      html += '</div>';
    }
    else
    {
      html += '<div class="card mb-3 rounded-3 shadow-sm">';
      html += ' <div class="card-header py-3">';
      html += '   <h4 class="my-0 fw-normal">Magnetometer</h4>';
      html += ' </div>';
      html += ' <div class="card-body">';
      html += '   <p id="magnetometerData">Magnetometer is not available on this device.</p>';
      html += ' </div>';
      html += '</div>';
    }
    
    this.element.innerHTML = html;
  }
  getData() {
    log("Exporting Magnetometer...");
    return this.data;
  }
  /* PRIVATE (sensor specific) methods */
}


