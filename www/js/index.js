document.addEventListener('deviceready', onDeviceReady, false);

let isDeviceReady = false; 

function btnTouchStart(btn ){
	btn.classList.add("touchStart" ); }

function btnTouchEnd(btn ){
	btn.classList.remove("touchStart" ); }

function onDeviceReady( ) {
	isDeviceReady = true ; }


function exampleOneClicked(img ){   
	/* Front Camera , disable save to phone ,
		data url , quality 60 . */
	if(isDeviceReady ){
		let pictureOptions = {
			cameraDirection: Camera.Direction.FRONT,
			saveToPhotoAlbum: false,
			destinationType: Camera.DestinationType.DATA_URL,
			quality: 60 };

		function fctSuccess(image ){
			img.src = `data:image/jpeg;base64,${image }`; }

		function fctFailure(errorMsg ){
			console.log(errorMsg ); }

		navigator
			.camera
			.getPicture(fctSuccess , 
						fctFailure , 
						pictureOptions ); }}


function exampleTwoClicked(img ){
	/* Photo Library , allow Edit */
	if(isDeviceReady ){

		let pictureOptions = {
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY ,
			allowEdit: true };

		function fctSuccess(image ){
			img.src = image; }

		function fctFailure(errorMsg ){
			console.log(errorMsg ); }

		navigator
			.camera
			.getPicture(fctSuccess , 
						fctFailure , 
						pictureOptions ); }}


function exampleThreeClicked(img ){
	/* Photo Library , popover  */
	if(isDeviceReady ){

		let pictureOptions = {
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY ,
			popoverOptions: new CameraPopoverOptions(
				0 , 
				200 , 
				300, 
				400 , 
				Camera.PopoverArrowDirection.ARROW_UP , 
				0 , 
				0 ) };

		function fctSuccess(image ){
			img.src = image; }

		function fctFailure(errorMsg ){
			console.log(errorMsg ); }

		navigator
				.camera
				.getPicture(fctSuccess , 
							fctFailure , 
							pictureOptions ); 

		function updatePopOverLocation(){
			let cameraPopoverHandle = new CameraPopoverHandle();
			let cameraPopoverOptions = new CameraPopoverOptions(
					100 , 
					300 , 
					300 , 
					600 , 
					Camera.PopoverArrowDirection.ARROW_DOWN , 
					0 , 
					0 );
			cameraPopoverHandle.setPosition(cameraPopoverOptions ); }

		window.setTimeout(updatePopOverLocation , 4000 ); }}                        

		
function exampleFourClicked(vdo ){
	/* video ,  Photo Library */
	if(isDeviceReady ){

		let pictureOptions = {
			mediaType: Camera.MediaType.VIDEO ,
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY };

		function fctSuccess(video ){
			vdo.src = video; }

		function fctFailure(errorMsg ){
			console.log(errorMsg ); }

		navigator
			.camera
			.getPicture(fctSuccess , 
						fctFailure , 
						pictureOptions ); }}