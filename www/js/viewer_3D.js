class Viewer3D {
	constructor(elementID = "divViewer3D") {
	  this.elementID = elementID;
	  this.element = document.getElementById(this.elementID);
	  this.isEnabled = false;
  
	  this.isRecording = false;
	  this.data = new Array();
	  
	  // Viewer specific member variables
	  
  
	  // Draw GPS Panel in UI
	  this.renderHTML();
	  log("Viewer constructor called!");
	}
  
	  /* GLOBAL / PUBLIC methods */
	enable() {
	  	this.isEnabled = true;
		this.renderHTML();
		log("Viewer enabled");
		
	}
	disable() {
		this.isEnabled = false;
		this.renderHTML();
		log("Viewer disabled");
	}
	
	update() {
	  log("Viewer updated");
	  
	}
	
	renderHTML() {
	  log("Viewer rendered");
	  
	  var html = '';

	  html += '<div class="card mb-3 rounded-3 shadow-sm">';
	  html += ' <div class="card-header py-3">';
	  html += '   <h4 class="my-0 fw-normal">3D Viewer</h4>';
	  html += '   <div class="custom-control custom-switch">';
	  if(this.isEnabled)
	  {
		html += '     <input type="checkbox" class="custom-control-input" id="viewerSwitch" onclick="javascript:viewer3D.disable();" checked>';
		html += '     <label class="custom-control-label" for="viewerSwitch">Disable</label>';
	  }
	  else
	  {
		html += '     <input type="checkbox" class="custom-control-input" id="viewerSwitch" onclick="javascript:viewer3D.enable();">';
		html += '     <label class="custom-control-label" for="viewerSwitch">Enable</label>';
	  }
	  html += '   </div>';
	  html += ' </div>';
	  html += ' <div class="card-body">';
	  html += '   <h1 id="viewer_timestamp" class="card-title pricing-card-title">{TIMESTAMP (REMOVE!)}</h1>';
	  html += '   <canvas id="viewer_3D" class="mb-3" height="200"></canvas>';
	  if(this.isEnabled)
	  {
		html += '   <button id="btnEnableViewer" onclick="javascript:viewer3D.disable();">Disable Viewer</button>';
	  }
	  else
	  {
		html += '   <button id="btnDisableViewer" onclick="javascript:viewer3D.enable();">Enable Viewer</button>';
	  }
	  html += ' </div>';
	  html += '</div>';
  
	  this.element.innerHTML = html;
	  
	  this.setup3DScene();
	}
	getData() {
	  console.log("Exporting Viewer...");
	  return this.data;
	}
	/* PRIVATE (i.e. sensor specific) methods */
	setup3DScene()
	{
		
		var dom_element = document.getElementById("viewer_3D");
		var renderer = new THREE.WebGLRenderer({canvas: dom_element});
		//renderer.setSize( window.innerWidth, window.innerHeight );
		//document.body.appendChild( renderer.domElement );

		var scene = new THREE.Scene();
		var camera = new THREE.PerspectiveCamera( 75, dom_element.width/dom_element.height, 0.1, 1000 );

		const size = 10;
		const divisions = 10;

		const gridHelper = new THREE.GridHelper( size, divisions );
		scene.add( gridHelper );

		const axesHelper = new THREE.AxesHelper( 5 );
		scene.add( axesHelper );

		var geometry = new THREE.BoxGeometry( 1, 1, 1 );
		var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		var cube = new THREE.Mesh( geometry, material );
		scene.add( cube );

		camera.position.z = 2;
		camera.position.y = 1;

		var animate = function () {
			requestAnimationFrame( animate );

			cube.rotation.x += 0.01;
			cube.rotation.y += 0.01;

			renderer.render( scene, camera );
		};

		animate();

	}
	
  }
