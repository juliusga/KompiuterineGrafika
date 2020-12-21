$(function()
{
    var stats = initStats();
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    var webGLRenderer = new THREE.WebGLRenderer();
    webGLRenderer.setClearColor(0x555555, 1.0);
    webGLRenderer.setSize(window.innerWidth, window.innerHeight);
    webGLRenderer.shadowMap.enabled = true;
    webGLRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 50;
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    $("#WebGL-output").append(webGLRenderer.domElement);

    camControl = new THREE.TrackballControls( camera, webGLRenderer.domElement );    

    var controls = new function () 
    {
        this.segments = 12;
        this.rook = null;

        this.redraw = function () {
            scene.remove(this.rook);
            this.rook = createFigure();
            scene.add(this.rook);
        };
    }

    function render() 
    {
        stats.update();
        requestAnimationFrame(render);
        camControl.update(); 
        webGLRenderer.render(scene, camera);
    }

    function initStats() 
    {
        var stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        $("#Stats-output").append(stats.domElement);
        return stats;
    }

    function createFigure() 
    {
        var points = [];
        points.push( new THREE.Vector3(    0,    0, 0 ));
        points.push( new THREE.Vector3( 12.5,    0, 0 ));
        points.push( new THREE.Vector3( 12.5,    2, 0 ));
        points.push( new THREE.Vector3(   10,    3, 0 ));
        points.push( new THREE.Vector3( 10.5,    4, 0 ));
        points.push( new THREE.Vector3(   10,    5, 0 ));
        points.push( new THREE.Vector3(    5,   25, 0 ));
        points.push( new THREE.Vector3(  7.5,   25, 0 ));
        points.push( new THREE.Vector3(  7.5, 32.5, 0 ));
        points.push( new THREE.Vector3(    5, 32.5, 0 ));
        points.push( new THREE.Vector3(    5,   30, 0 ));
        points.push( new THREE.Vector3(    0,   30, 0 ));
        var geometry = new THREE.LatheGeometry(points, Math.ceil(300), 0, 2 * Math.PI);
        var material = new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            combine: THREE.MixOperation,
            reflectivity: 0.5,
            shininess: 300,
        });
        var figure = new THREE.Mesh(geometry, material);
        figure.position.set(0, 1, 0);
        figure.castShadow = true;
        return figure;
    }

    function addLights()
    {
        const spotLight = new THREE.SpotLight(0xAAAAAA);
        spotLight.position.set(0, 100, 400);
        spotLight.castShadow = true;
        scene.add(spotLight);
        var ambientLight = new THREE.AmbientLight("#282828");
        //scene.add(ambientLight);
    }

    function addPlane()
    {
        const geometry = new THREE.PlaneGeometry(500, 500);
        const texture = THREE.ImageUtils.loadTexture("./textures/chess.jpg");
        const material = new THREE.MeshPhongMaterial({
            map: texture,
            color: 0x444444,
            combine: THREE.MixOperation,
            reflectivity: 0.5,
            shininess: 300,
        });
        const plane = new THREE.Mesh( geometry, material );
        plane.position.set(0, 0, 0);
        plane.rotation.x = -0.5 * Math.PI;
        plane.receiveShadow = true;
        scene.add( plane );
    }

    var gui = new dat.GUI();
    gui.add(controls, 'segments', 0, 200).step(1).onChange(controls.redraw);
    render();
    addLights();
    addPlane();
    controls.redraw();
});