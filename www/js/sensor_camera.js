class SensorCamera {
    constructor(elementID = "divCamera") {
      this.elementID = elementID;
      this.element = document.getElementById(this.elementID);
      this.isEnabled = false;
      this.isAvailable = false;
  
      this.isRecording = false;
      this.data = new Array();

      
      // Camera specific member variables
      this.video = null;
      this.canvas = null;
      this.context = null;
      this.stream = null;
      this.constraints = {video: { facingMode: { ideal: 'environment'}}, audio: false}; // { video: { deviceId: { exact: 0 } } };    // 
        /*
        const constraints = {
            'qvga': {width: {exact: 320}, height: {exact: 240}, facingMode: {exact: 'environment'}},
            'vga': {width: {exact: 640}, height: {exact: 480}, facingMode: {exact: 'environment'}},
            'fhd': {width: {exact: 1920}, height: {exact: 1080}, facingMode: {exact: 'environment'}} };
        */

      // Test GetUserMedia (GUM) and WebGL:
      if(navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia && !!window.WebGLRenderingContext)
      {
        this.isAvailable = true;

      }

      this.renderHTML();
    
      // Draw Camera Panel in UI
      log("Camera constructor called!");
    }
  
    /* GLOBAL / PUBLIC methods */
    enable() {

        this.isEnabled = true;
        this.renderHTML();
        log("Camera enabled");

        //this.watchID = navigator.geolocation.watchPosition(this.onGeolocationSuccess.bind(this), this.onGeolocationError.bind(this), this.geolocationOptions);

        var self = this;
        navigator.mediaDevices.getUserMedia(this.constraints)
        .then(function(stream) {
            
            self.video.srcObject = stream;
            self.stream = stream;
            self.video.setAttribute('autoplay', 'true');
            self.video.addEventListener('canplay', self.onVideoCanPlay, false);
            
            //sensorRecorder.onVideoData(this);
            
        }.bind(self))
        .catch(function(err) {
            log('Camera Error: ' + err.name + ' ' + err.message, true);
        });

    }
    disable() {
        this.isEnabled = false;
        this.renderHTML();
        log("Camera disabled, watchId = " + this.watchID);

        if (this.video) {
            this.video.pause();
            this.video.srcObject = null;
            this.video.removeEventListener('canplay', onVideoCanPlay);
        }
        if (this.stream) {
            this.stream.getVideoTracks()[0].stop();
        }
    }
    
    toggleRecording(record) {
      this.isRecording = record;
      if(record)
      {
        log("Camera recording started.");
      }
      else
      {
        log("Camera recording stopped.")
      }
    }
    
    renderHTML() {
      log("Camera rendered");
      
      var html = '';
      
      html += '<div class="card mb-3 rounded-3 shadow-sm">';
      if(this.isAvailable)
      {
        html += ' <div class="card-header py-3">';
        html += '   <h4 class="my-0 fw-normal">Camera</h4>';
        html += '   <div class="custom-control custom-switch">';
        if(this.isEnabled)
        {
          html += '     <input type="checkbox" class="custom-control-input" id="cameraSwitch" onclick="javascript:sensorCamera.disable();" checked>';
          html += '     <label class="custom-control-label" for="cameraSwitch">Disable</label>';
        }
        else
        {
          html += '     <input type="checkbox" class="custom-control-input" id="cameraSwitch" onclick="javascript:sensorCamera.enable();">';
          html += '     <label class="custom-control-label" for="cameraSwitch">Enable</label>';
        }
        html += '   </div>';
        html += ' </div>';
      }
      html += ' <div class="card-body">';
      /*
      navigator.mediaDevices.enumerateDevices()
      .then(function(devices) {
          devices.forEach(function(device) {
              html += '   <p id="mediaDevice_' + device.deviceId + '">' + device.kind + ": " + device.label + " id = " + device.deviceId + '</p>';
          }.bind(html));
      }.bind(html));
      */
      html += '   <h1 id="cameraTimestamp" class="card-title pricing-card-title">{TIMESTAMP}</h1>';
      html += '   <video id="cameraVideo" autoplay="true" style="display: none;">Your browser does not support the video tag.</video>';
      html += '   <canvas id="cameraCanvas"></canvas>';
      html += '   <p id="cameraData">No Camera data yet.</p>';
      html += '   <p id="cameraHint"><small>Hint: On Android please allow camera access in your <em>App Settings</em>.</small></p>';
      html += ' </div>';
      html += '</div>';
  
      this.element.innerHTML = html;

      this.video = document.getElementById("cameraVideo");
      this.canvas = document.getElementById("cameraCanvas");
      this.camData = document.getElementById("cameraData");
      this.camTimestamp = document.getElementById("cameraTimestamp");
      this.context = this.canvas.getContext('2d');

      
    }
    getData() {
      log("Exporting Camera...");
      return this.data;
    }
    /* PRIVATE (i.e. sensor specific) methods */
    onVideoCanPlay() {
        sensorCamera.video.play();
        requestAnimationFrame(sensorCamera.renderFrame);
    }
    
    renderFrame() {
        // re-register callback
        requestAnimationFrame(sensorCamera.renderFrame);
        // set internal canvas size to match HTML element size
        sensorCamera.canvas.width = sensorCamera.canvas.scrollWidth;
        sensorCamera.canvas.height = sensorCamera.canvas.scrollHeight;
        if (sensorCamera.video.readyState === sensorCamera.video.HAVE_ENOUGH_DATA) {
            // scale and horizontally center the camera image
            var videoSize = { width: sensorCamera.video.videoWidth, height: sensorCamera.video.videoHeight };
            var canvasSize = { width: sensorCamera.canvas.width, height: sensorCamera.canvas.height };
            var renderSize = sensorCamera.calculateSize(videoSize, canvasSize);
            var xOffset = (canvasSize.width - renderSize.width) / 2;


            sensorCamera.context.drawImage(sensorCamera.video, xOffset, 0, renderSize.width, renderSize.height);
            if(sensorCamera.isRecording)
            {
              var camera_dataframe = {time_ms: new Date().getTime(),
                image: sensorCamera.canvas.toDataURL()};
            
              sensorCamera.data.push(camera_dataframe);
              sensorRecorder.onCameraData(sensorCamera.data.length);
            }
        
            sensorCamera.camData.innerHTML = sensorCamera.canvas.toDataURL().substring(0,200);
            sensorCamera.camTimestamp.innerHTML = new Date().getTime();

            /*
            console.log(sensorCamera.context);
            console.log(videoSize);
            console.log(canvasSize);
            console.log(renderSize);
            console.log(sensorCamera.video);
            */
        }
    }

    calculateSize(srcSize, dstSize) {
        var srcRatio = srcSize.width / srcSize.height;
        var dstRatio = dstSize.width / dstSize.height;
        if (dstRatio > srcRatio) {
          return {
            width:  dstSize.height * srcRatio,
            height: dstSize.height
          };
        } else {
          return {
            width:  dstSize.width,
            height: dstSize.width / srcRatio
          };
        }
      }
    
  }
  