class SensorGyroscope {
  constructor(elementID) {
    this.elementID = elementID;
    this.element = document.getElementById(this.elementID);
    this.isEnabled = false;
    this.isAvailable = false;

    this.isRecording = false;
    this.data = new Array();
    
    // Gyroscope specific member variables
    try {
      this.gyroscope = new Gyroscope({ referenceFrame: 'device', frequency: 60 });

      this.gyroscope.addEventListener('error', e => {
        // Handle runtime errors.
        if (e.error.name === 'NotAllowedError') {
            // Branch to code for requesting permission.
        } else if (e.error.name === 'NotReadableError' ) {
            log('Cannot connect to the gyroscope.', true);
        }
      });

      this.gyroscope.addEventListener('reading', ev => {
  
        if(this.isRecording)
        {
          var gyroscope_dataframe = {time_ms: new Date().getTime(),
            x: this.gyroscope.x,
            y: this.gyroscope.y,
            z: this.gyroscope.z
          };
          this.data.push(gyroscope_dataframe);
          sensorRecorder.onGyroscopeData(this.data);
        }
        var dataHTML = "";
        
        dataHTML += "Angular velocity along the X-axis<br />" + this.gyroscope.x + " rad/s.<br />";
        dataHTML += "Angular velocity along the Y-axis<br />" + this.gyroscope.y + " rad/s.<br />";
        dataHTML += "Angular velocity along the Z-axis<br />" + this.gyroscope.z + " rad/s.";
    
        document.getElementById("gyroscopeData").innerHTML = dataHTML;
        document.getElementById("gyroscopeTimestamp").textContent = "Timestamp: " + Date.now();
      });

      this.isAvailable = true;
      log("Gyroscope constructor called!");
    } catch (error) {
      // Handle construction errors.
      if (error.name === 'SecurityError') {
        // See the note above about feature policy.
        log('Gyroscope construction was blocked by a feature policy.', true);
      } else if (error.name === 'ReferenceError') {
        log('Gyroscope is not supported by the User Agent.', true);
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
      
    log("Gyroscope enabled");
    this.isEnabled = true;
    this.renderHTML();

    this.gyroscope.start();
    
  }
  disable() {
    if(this.isAvailable == false)
    {
      return;
    }
    
    log("Gyroscope disabled");
    this.isEnabled = false;
    this.renderHTML();

    this.gyroscope.stop();
    
  }
  
  toggleRecording(record) {
    this.isRecording = record;
    if(record)
    {
      log("Gyroscope recording started.");
    }
    else
    {
      log("Gyroscope recording stopped.")
    }
  }
    
  renderHTML() {
    log("Gyroscope rendered");
    
    var html = '';
    
    if(this.isAvailable)
    {
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
      html += '   <p id="gyroscopeData">No Gyroscope data yet.</p>';
      html += ' </div>';
      html += '</div>';
    }
    else
    {
      html += '<div class="card mb-3 rounded-3 shadow-sm">';
      html += ' <div class="card-header py-3">';
      html += '   <h4 class="my-0 fw-normal">Gyroscope</h4>';
      html += ' </div>';
      html += ' <div class="card-body">';
      html += '   <p id="gyroscopeData">Gyroscope is not available on this device.</p>';
      html += ' </div>';
      html += '</div>';
    }
    
    this.element.innerHTML = html;
  }
  getData() {
    log("Exporting Gyroscope...");
    return this.data;
  }
  /* PRIVATE (sensor specific) methods */
}
