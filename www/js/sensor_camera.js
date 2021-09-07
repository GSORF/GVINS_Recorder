function SensorCamera(errorOutputId) {
 /*     
    let self = this;
    this.errorOutput = document.getElementById(errorOutputId);

    console.log("CAMERASENSOR_CONSTRUCTOR")

    this.loadOpenCv = async function(onloadCallback) {
        
        if (cv.getBuildInformation)
        {
            console.log(cv.getBuildInformation());
            onloadCallback();
        }
        else
        {
            // WASM
            if (cv instanceof Promise) {
                cv = await cv;
                console.log(cv.getBuildInformation());
                onloadCallback();
            } else {
                cv['onRuntimeInitialized']=()=>{
                    //console.log(cv.getBuildInformation());
                    onloadCallback();
                }
            }
        }
    
    };

   this.createFileFromUrl = function(path, url, callback) {
        let request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        request.onload = function(ev) {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    let data = new Uint8Array(request.response);
                    cv.FS_createDataFile('/', path, data, true, false, false);
                    callback();
                } else {
                    self.printError('Failed to load ' + url + ' status: ' + request.status);
                }
            }
        };
        request.send();
    };

    this.loadImageToCanvas = function(url, cavansId) {
        let canvas = document.getElementById(cavansId);
        let ctx = canvas.getContext('2d');
        let img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
        };
        img.src = url;
    };



    this.clearError = function() {
        this.errorOutput.innerHTML = '';
    };


    this.loadCode = function(scriptId, textAreaId) {
        let scriptNode = document.getElementById(scriptId);
        let textArea = document.getElementById(textAreaId);
        if (scriptNode.type !== 'text/code-snippet') {
            throw Error('Unknown code snippet type');
        }
        textArea.value = scriptNode.text.replace(/^\n/, '');
    };

    this.addFileInputHandler = function(fileInputId, canvasId) {
        let inputElement = document.getElementById(fileInputId);
        inputElement.addEventListener('change', (e) => {
            let files = e.target.files;
            if (files.length > 0) {
                let imgUrl = URL.createObjectURL(files[0]);
                self.loadImageToCanvas(imgUrl, canvasId);
            }
        }, false);
    };
 */
    this.printError = function(err) {
        if (typeof err === 'undefined') {
            err = '';
        } else if (typeof err === 'number') {
            if (!isNaN(err)) {
                if (typeof cv !== 'undefined') {
                    err = 'Exception: ' + cv.exceptionFromPtr(err).msg;
                }
            }
        } else if (typeof err === 'string') {
            let ptr = Number(err.split(' ')[0]);
            if (!isNaN(ptr)) {
                if (typeof cv !== 'undefined') {
                    err = 'Exception: ' + cv.exceptionFromPtr(ptr).msg;
                }
            }
        } else if (err instanceof Error) {
            err = err.stack.replace(/\n/g, '<br>');
        }
        this.errorOutput.innerHTML = err;
    };

    function onVideoCanPlay() {
        if (self.onCameraStartedCallback) {
            self.onCameraStartedCallback(self.stream, self.video);
        }
    };

    this.startCamera = function(resolution, callback, videoId) {
        const constraints = { video: { deviceId: { exact: 0 } } };
		
		/*
		const constraints = {
            'qvga': {width: {exact: 320}, height: {exact: 240}, facingMode: {exact: 'environment'}},
            'vga': {width: {exact: 640}, height: {exact: 480}, facingMode: {exact: 'environment'}},
            'fhd': {width: {exact: 1920}, height: {exact: 1080}, facingMode: {exact: 'environment'}} };
        */
		let video = document.getElementById(videoId);
        if (!video) {
            video = document.createElement('video');
        }

        let videoConstraint = constraints[resolution];
        if (!videoConstraint) {
            videoConstraint = true;
        }

        navigator.mediaDevices.getUserMedia({video: videoConstraint, audio: false})
            .then(function(stream) {
                video.srcObject = stream;
                video.play();
                self.video = video;
                self.stream = stream;
                self.onCameraStartedCallback = callback;
                video.addEventListener('canplay', onVideoCanPlay, false);
            })
            .catch(function(err) {
                self.printError('Camera Error: ' + err.name + ' ' + err.message);
            });
    };

    this.stopCamera = function() {
        if (this.video) {
            this.video.pause();
            this.video.srcObject = null;
            this.video.removeEventListener('canplay', onVideoCanPlay);
        }
        if (this.stream) {
            this.stream.getVideoTracks()[0].stop();
        }
    };
};


/* 
<div class="card mb-3 rounded-3 shadow-sm">

				  <div class="card-header py-3">
					<h4 class="my-0 fw-normal">Camera</h4>
				  </div>
				  <div class="card-body">
					<h1 class="card-title pricing-card-title" id="camera_timestamp">{TIMESTAMP}</h1>
					<video autoplay="true" id="videoElement">Your browser does not support the video tag.</video>
					<canvas id="canvasOutput" width="640" height="480"></canvas>
					
					</div>
</div>


*/