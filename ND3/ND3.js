/*

scenoje pavaizduoti 1 ir 2 aukšto grindis, naudoti AmbientLight ir SpotLight šviesas kaip čia.

palaikančias metalines konstrukcijas supaprastinti iki cilindrų ir stačiakampių gretasienių formų (Cube/BoxGeometry);

laiptų pakopoms (pakopos kairei ir dešinei kojai skiriasi!) naudoti ExtrudeGeometry
(su apskritiminiais kontūrais), o turėklams naudoti TubeGeometry (su SplineCurve3); medžiagos atitinkamai: LambertMaterial (matinė išvaizda) ir PhongMaterial (metalinė išvaizda);

naudoti dat.gui.js meniu keičiant parametrus:
laiptų skaičius, pirmo ir paskutinio laipto santykinė padėtis (posūkio kampas ir posūkio vertikalios ašies padėtis).

*/

const STAIR_SIZE = 10;
const STAIR_HEIGHT = 12;
const STAIR_GAP_X = 2;
const HANDRAIL_HEIGHT = 9;
const SUPPORT_SIZE = 0.6;
const RADIAL_SEGMENTS = 40;

function render() {
	renderer.render(scene, camera);
	requestAnimationFrame(render);
	cameraControls.update(); 
}

function initFloor()
{
	var geometry = new THREE.PlaneGeometry(100,50);
    var material = new THREE.MeshBasicMaterial({color: 0x996633});
    var floor1 = new THREE.Mesh(geometry, material);
    floor1.rotation.x = -0.5 * Math.PI;
	floor1.receiveShadow  = true;
	floor1.receiveLight = true;
	floor1.material.side = THREE.DoubleSide;
    scene.add(floor1);
}

function initLight()
{
	var ambientLight = new THREE.AmbientLight("#282828");
	ambientLight.castShadow = true;
	scene.add(ambientLight);
	var spotLight = new THREE.SpotLight( 0xAAAAAA);
	spotLight.position.set(-20, 100, 20);
	spotLight.castShadow = true;
	scene.add( spotLight );
}

function stairForm()
{
	var shape = new THREE.Shape();
	shape.moveTo(STAIR_SIZE / 3, 0);
	shape.lineTo(-STAIR_SIZE / 3, 0);
	shape.lineTo(-STAIR_SIZE / 3, STAIR_SIZE / 5);
	shape.quadraticCurveTo(-STAIR_SIZE / 5, STAIR_SIZE / 2, STAIR_SIZE / 3, 0);
	return shape;
}

function createStair()
{
	var options = {
		amount: controls.stepGapY / 3,
		bevelThickness: 0.3,
		bevelSize: 0.65,
		bevelSegments: 25,
		bevelEnabled: true,
		curveSegments: 20,
		steps: 4
	};
	var stairMaterial = new THREE.MeshLambertMaterial();
	stairMaterial.color.setHex(0x59401f);
	var stairGeometry = new THREE.ExtrudeGeometry(stairForm(), options); 
	var stairMesh = new THREE.Mesh(stairGeometry, stairMaterial) ;
	stairMesh.rotation.z = Math.PI / 2;	
	return stairMesh;
}

var controls = new function() 
{
	this.angle = 0;
	this.stairAmount = 10;
	this.stepGapY = 1;
	this.stairAngle = 0;
	this.showFloor = true;
	
	this.draw = function()
	{
		scene.remove(mainObject);
		controls.stairAngle = controls.angle / (controls.stairAmount - 1);
		controls.stepGapY = (STAIR_HEIGHT / controls.stairAmount) / 2;
		mainObject = drawStairs();
		scene.add(mainObject);
	}
}

function getSupportConPoints()
{
	var supportConPoints = [];
	supportConPoints.push(new THREE.Vector3(0, controls.stepGapY - 0.25, (-STAIR_SIZE / 2) + 5));
	supportConPoints.push(new THREE.Vector3(0, controls.stepGapY - 0.25,  -STAIR_SIZE / 2));
	supportConPoints.push(new THREE.Vector3(0, controls.stepGapY - 0.25, (-STAIR_SIZE / 2) - 0.5));
	supportConPoints.push(new THREE.Vector3(0, controls.stepGapY + 0.75, (-STAIR_SIZE / 2) - 0.5));
	supportConPoints.push(new THREE.Vector3(0, controls.stepGapY + HANDRAIL_HEIGHT, (-STAIR_SIZE / 2) - 1));
	return supportConPoints;
}

function drawStairs()
{
	var mainObject = new THREE.Object3D();
	var supportMaterial = new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide});
	var frontSGeometry = new THREE.CylinderGeometry(SUPPORT_SIZE, SUPPORT_SIZE, controls.stepGapY, 40);
	var middleSGeometry = new THREE.CubeGeometry(STAIR_GAP_X / 2 + SUPPORT_SIZE, SUPPORT_SIZE, SUPPORT_SIZE * 2, 40);
	var backSGeometry = new THREE.CylinderGeometry(0.6, 0.6, controls.stepGapY * 2, 40);
	var nextX = 0;
	var nextZ = 0;
	var supportPoints = [];
	var supportCoord = [0, 0, 0];

	for (var i = 0; i < controls.stairAmount; i++)
	{
		var currentStair = createStair();
		
		if (i % 2 == 0) {
			currentStair.position.y = controls.stepGapY + controls.stepGapY / 2;
			currentStair.rotation.x = Math.PI / 2;
		} else {
			currentStair.position.y = controls.stepGapY ;
			currentStair.rotation.x = -Math.PI / 2;
		}

		var supportConPoints = getSupportConPoints();

		var supportRailsGeometry = new THREE.TubeGeometry(new THREE.SplineCurve3(supportConPoints), 10, 0.25, 10, false);
		var supportRails = THREE.SceneUtils.createMultiMaterialObject(supportRailsGeometry, [supportMaterial]);
		
		var frontS = new THREE.Mesh(frontSGeometry, supportMaterial);
		frontS.position.y = controls.stepGapY / 2;

		var middleS = new THREE.Mesh(middleSGeometry, supportMaterial);
		middleS.position.x = (STAIR_GAP_X / 2 + SUPPORT_SIZE) / 2;
		middleS.position.y = controls.stepGapY - SUPPORT_SIZE / 2;
		
		var backS = new THREE.Mesh(backSGeometry, supportMaterial);
		backS.position.x = STAIR_GAP_X / 2 + SUPPORT_SIZE;
		backS.position.y = controls.stepGapY - (SUPPORT_SIZE / 2) + (controls.stepGapY + SUPPORT_SIZE) / 2 - SUPPORT_SIZE / 2;
			
		var stair = new THREE.Object3D();
		currentStair.castShadow = true;
		frontS.castShadow = true;
		middleS.castShadow = true;
		backS.castShadow = true;
		supportRails.castShadow = true;

		stair.add(currentStair);
		stair.add(frontS);
		stair.add(middleS);
		stair.add(backS);
		stair.add(supportRails);
		stair.position.x = nextX;
		stair.position.y = i * 2 * controls.stepGapY;
		stair.position.z = nextZ;
		stair.rotation.y = i * (Math.PI / 180 * controls.stairAngle);
		stair.castShadow = true;
		mainObject.add(stair);
	
		supportCoord[0] = nextX + (STAIR_SIZE / 2 + 1) * Math.sin(-1 * (Math.PI / 180 * controls.stairAngle) * i);
		supportCoord[1] = i * (controls.stepGapY + controls.stepGapY) + HANDRAIL_HEIGHT + controls.stepGapY;
		supportCoord[2] = nextZ + -1 * (STAIR_SIZE / 2 + 1) * Math.cos(-1 *(Math.PI / 180 * controls.stairAngle) * i);
		supportPoints.push(new THREE.Vector3(supportCoord[0], supportCoord[1], supportCoord[2]));
		
		nextX = nextX + (STAIR_GAP_X / 2 + SUPPORT_SIZE) * Math.cos(-(Math.PI / 180 * controls.stairAngle) * i);
		nextZ = nextZ + (STAIR_GAP_X / 2 + SUPPORT_SIZE) * Math.sin(-(Math.PI / 180 * controls.stairAngle) * i);
	}
	var geometry = new THREE.PlaneGeometry(100,100);
    var material = new THREE.MeshBasicMaterial({color: 0xBB8855});
    if (controls.showFloor)
    {
	    var floor2 = new THREE.Mesh(geometry, material);
		floor2.position.x = nextX + 49;
		floor2.position.z = nextZ;
		floor2.position.y = controls.stairAmount * 2 * controls.stepGapY + 2 * (1 / controls.stairAmount);
		floor2.rotation.x = -0.5 * Math.PI;
		floor2.receiveShadow  = true;
		floor2.receiveLight = true;
		floor2.material.side = THREE.DoubleSide;
		mainObject.add(floor2);
    }
	var handRailGeometry = new THREE.TubeGeometry(new THREE.SplineCurve3(supportPoints), 100, 0.25, 30, false);
	var handRail = THREE.SceneUtils.createMultiMaterialObject(handRailGeometry, [supportMaterial]);
	mainObject.add(handRail);
	mainObject.castShadow = true;
	return mainObject;
}


var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.shadowMapEnabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
initFloor();
initLight();

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = -60;
camera.position.y = 20;
camera.position.z = 0;
camera.lookAt(new THREE.Vector3(0, 0, 0));
$("#WebGL-output").append(renderer.domElement);
var cameraControls = new THREE.TrackballControls(camera, renderer.domElement);

var gui = new dat.GUI();
gui.add(controls, 'stairAmount', 5, 20).step(1).name('Laiptų skaičius').onChange(controls.draw);
gui.add(controls, 'angle', -90, 90).step(5).name('Santykinė padėtis').onChange(controls.draw);
gui.add(controls, 'showFloor').name('Rodyti grindis').onFinishChange(controls.draw);
controls.stairAngle = controls.angle / (controls.stairAmount - 1);
controls.stepGapY = STAIR_HEIGHT / controls.stairAmount / 2;
render();

var mainObject = drawStairs();
scene.add(mainObject);