document.addEventListener('deviceready', onDeviceReady, false);



let isDeviceReady = false; 
let isRecordingSensors = false;

var sensorGPS = null;
var sensorAccelerometer = null;
var sensorGyroscope = null;
var sensorMagnetometer = null;

var sensorCamera = null;

var sensorRecorder = null;

var viewer3D = null;

//var cameraSensor = null;

var frame1 = null;
var frame2 = null;
var prevFrame_gray = null;
var currFrame_gray = null;
var dstC1 = null;
var dstC3 = null;
var dstC4 = null;

// parameters for ShiTomasi corner detection
let [maxCorners, qualityLevel, minDistance, blockSize] = [30, 0.3, 7, 7];

// parameters for lucas kanade optical flow
let winSize = new cv.Size(15, 15);
let maxLevel = 2;
let criteria = new cv.TermCriteria(cv.TERM_CRITERIA_EPS | cv.TERM_CRITERIA_COUNT, 10, 0.03);

// create some random colors
let color = [];
for (let i = 0; i < maxCorners; i++) {
    color.push(new cv.Scalar(parseInt(Math.random()*255), parseInt(Math.random()*255),
                             parseInt(Math.random()*255), 255));
}
let oldFrame = null;
let oldGray = null;
let p0 = null;
let none = null;

// Create a mask image for drawing purposes
let zeroEle = null;
let mask = null;

let frame = null;
let frameGray = null;
let p1 = null;
let st = null;
let err = null;

var vc = null;
var streaming = null;
var firstRun = true;
const FPS = 30.0;

function startVideoProcessing(height, width) {
	// Print OpenCV Debug Information
	//console.log(cv);
	oldFrame = new cv.Mat(height, width, cv.CV_8UC4);
	oldGray = new cv.Mat();
	p0 = new cv.Mat();
	none = new cv.Mat();

	// Create a mask image for drawing purposes
	zeroEle = new cv.Scalar(0, 0, 0, 255);
	mask = new cv.Mat(oldFrame.rows, oldFrame.cols, oldFrame.type(), zeroEle);

	frame = new cv.Mat(height, width, cv.CV_8UC4);
	frameGray = new cv.Mat();
	p1 = new cv.Mat();
	st = new cv.Mat();
	err = new cv.Mat();
	
    requestAnimationFrame(processVideo);
}

function processVideo() {
	if (!streaming) {
		// clean and stop.
		frame.delete(); oldGray.delete(); p0.delete(); p1.delete(); err.delete(); mask.delete();
		return;
	}
	
    document.getElementById("camera_timestamp").textContent = "Timestamp = " + vc.video.currentTime + " s.";
	let begin = Date.now();
    
	// Read Frame from VideoCapture
	vc.read(frame);
	// Serialize the frame:
	cv.imshow('canvasOutput', frame);
	let img = document.getElementById("canvasOutput");
	// Send it to the Sensor Recorder:
	video_dataframe = {time_ms: new Date().getTime(),
		image: img.toDataURL()
	};
	sensorRecorder.onVideoData(video_dataframe);
	
    try {
		let begin = Date.now();
	
		// OpenCV MAGIC part!
		if(firstRun)
		{
			// take first frame and find corners in it
			//vc.read(oldFrame);
			cv.cvtColor(frame, oldGray, cv.COLOR_RGB2GRAY);
			
			cv.goodFeaturesToTrack(oldGray, p0, maxCorners, qualityLevel, minDistance, none, blockSize);

			firstRun = false;
		}
		else
		{
			// start processing.
			//vc.read(frame);
			cv.cvtColor(frame, frameGray, cv.COLOR_RGBA2GRAY);

			
			// calculate optical flow
			cv.calcOpticalFlowPyrLK(oldGray, frameGray, p0, p1, st, err, winSize, maxLevel, criteria);

			// select good points
			let goodNew = [];
			let goodOld = [];
			for (let i = 0; i < st.rows; i++) {
				if (st.data[i] === 1) {
					goodNew.push(new cv.Point(p1.data32F[i*2], p1.data32F[i*2+1]));
					goodOld.push(new cv.Point(p0.data32F[i*2], p0.data32F[i*2+1]));
				}
			}

			// draw the tracks
			for (let i = 0; i < goodNew.length; i++) {
				cv.line(mask, goodNew[i], goodOld[i], color[i], 2);
				cv.circle(frame, goodNew[i], 5, color[i], -1);
			}
			cv.add(frame, mask, frame);

			cv.imshow('canvasOutput', frame);
			//console.log("CANVAS OUTPUT");

			// now update the previous frame and previous points
			frameGray.copyTo(oldGray);
			p0.delete(); p0 = null;
			p0 = new cv.Mat(goodNew.length, 1, cv.CV_32FC2);
			for (let i = 0; i < goodNew.length; i++) {
				p0.data32F[i*2] = goodNew[i].x;
				p0.data32F[i*2+1] = goodNew[i].y;
			}
		}
	
	} catch (err) {
		document.getElementById("camera_timestamp").textContent = err;
	}
	// schedule the next one.
	let delay = 1000/FPS - (Date.now() - begin);
	/*
    
    cv.Canny(dstC1, dstC1, 150, 300, 3, false);
    
    cv.imshow('canvasOutput', dstC1);
	cv.imshow('canvasOutput', dstC1);
	*/
	document.getElementById("camera_timestamp").textContent = delay;
    requestAnimationFrame(processVideo);
	
}

function callback_video(stream, video)
{
	console.log("callback_video");
	/* console.log("callback_video", ev.timeStamp);
	 */

	height = video.videoHeight * 0.25;
    width = video.videoWidth * 0.25;
    video.setAttribute('width', width);
    video.setAttribute('height', height);
    streaming = true;
    vc = new cv.VideoCapture(video);
    startVideoProcessing(height, width);
}

function callback_opencv()
{
	console.log("callback_opencv");
	cameraSensor.startCamera("fhd", callback_video, "videoElement");
}



function main()
{
	sensorGPS = new SensorGPS("divGPS");
	sensorAccelerometer = new SensorAccelerometer("divAccelerometer");
	sensorGyroscope = new SensorGyroscope("divGyroscope");
	sensorMagnetometer = new SensorMagnetometer("divMagnetometer");
	sensorCamera = new SensorCamera("divCamera");
	sensorRecorder = new SensorRecorder("divSensorRecorder");

	viewer3D = new Viewer3D("divViewer3D");

	

	/*
	// Define a model for linear regression.
	const model = tf.sequential();
	model.add(tf.layers.dense({units: 1, inputShape: [1]}));

	model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

	// Generate some synthetic data for training.
	const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
	const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

	// Train the model using the data.
	model.fit(xs, ys, {epochs: 10}).then(() => {
	  // Use the model to do inference on a data point the model hasn't seen before:
	  model.predict(tf.tensor2d([5], [1, 1])).print();
	  // Open the browser devtools to see the output
	});

	
	cameraSensor = new CameraSensor("consoleOutput");
	cameraSensor.loadOpenCv(callback_opencv);
	
	sensorRecorder = new SensorRecorder();
	
	getLocation(); // Start GPS
	//getLocation(); // Start Gyroscope
	//getLocation(); // Start Accelerometer

	let btnToggleRecording = document.getElementById('btnToggleRecording');
	btnToggleRecording.addEventListener('click', (e) => {
		if(isRecordingSensors)
		{
			isRecordingSensors = false;
			btnToggleRecording.innerText = "Start recording";
			sensorRecorder.onToggleRecording(false);
		}
		else
		{
			isRecordingSensors = true;
			btnToggleRecording.innerText = "Stop recording";
			sensorRecorder.onToggleRecording(true);
		}
	}, false);


	
	let btnDownloadRecording = document.getElementById('btnDownloadRecording');
	btnDownloadRecording.addEventListener('click', (e) => {
		
			sensorRecorder.onDownloadRecording();
		
	}, false);

 */




	
/* 
	let imgElement = document.getElementById('imageSrc');
	let inputElement = document.getElementById('fileInput');
	inputElement.addEventListener('change', (e) => {
	  imgElement.src = URL.createObjectURL(e.target.files[0]);
	}, false);
	imgElement.onload = function() {
	  let mat = cv.imread(imgElement);
	  cv.imshow('canvasOutput', mat);
	  mat.delete();
	};
	function onOpenCvReady() {
	  document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
	}
*/


}

function onDeviceReady( )
{
	isDeviceReady = true; 
	log("CALLING MAIN!");
	main();
}



