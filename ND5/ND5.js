$(function()
{
    const ONE_SQUARE = 31.25;
    const INIT_POS = -109.375;
    const TRANSLATION = (INIT_POS * -2) / 200;

    var stats = initStats();
    var scene = new THREE.Scene();
    var currentCamera = null;

    var camera1 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera1.position.x = 200;
    camera1.position.y = 200;
    camera1.position.z = 200;
    camera1.lookAt(new THREE.Vector3(0, 0, 0));

    var camera2 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera2.position.x = -1.75 * INIT_POS;
    camera2.position.y = 30;
    camera2.position.z = -1 * (INIT_POS + 4 * ONE_SQUARE);
    camera2.lookAt(new THREE.Vector3(INIT_POS + 3 * ONE_SQUARE, 1, INIT_POS + 3 * ONE_SQUARE));
    const helper2 = new THREE.CameraHelper( camera2 );
    scene.add(helper2);
    
    var camera3 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera3.position.x = INIT_POS + 3 * ONE_SQUARE + 5;
    camera3.position.y = 300;
    camera3.position.z = 0;
    camera3.lookAt(new THREE.Vector3(0, 0, 0));
    const helper3 = new THREE.CameraHelper( camera3 );
    scene.add(helper3);

    var webGLRenderer = new THREE.WebGLRenderer();
    webGLRenderer.setClearColor(0x555555, 1.0);
    webGLRenderer.setSize(window.innerWidth, window.innerHeight);
    webGLRenderer.shadowMap.enabled = true;
    webGLRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    $("#WebGL-output").append(webGLRenderer.domElement);

    var controls = new function () 
    {
        this.movement = 1;
        this.segments = 12;
        this.cam1FOV = 45;
        this.DollyZoom = 45;

        this.setCamera1 = function()
        {
            if (currentCamera == camera2) 
            {
                this.movement = 1;
                rook.position.x = INIT_POS;
                rook.position.z = INIT_POS;
            }
            currentCamera = camera1;
        }

        this.setCamera2 = function()
        {
            currentCamera = camera2;
            this.movement = 0;
            rook.position.x = INIT_POS + 5 * ONE_SQUARE;
            rook.position.z = INIT_POS + 3 * ONE_SQUARE;
        }

        this.setCamera3 = function()
        {
            if (currentCamera == camera2)
            {
                this.movement = 1;
                rook.position.x = INIT_POS;
                rook.position.z = INIT_POS;
            }
            currentCamera = camera3;
        }

        this.cam1Change = function()
        {
            camera1.fov = controls.cam1FOV;
            camera1.updateProjectionMatrix();
        };

        this.cam2Change = function()
        {
            var height = Math.tan(camera2.fov * (Math.PI / 180) * 0.5) * camera2.position.distanceTo(figureMiddlePoint);
            
            const camLookingDir = new THREE.Vector3();
            camera2.getWorldDirection(camLookingDir);
            camLookingDir.multiplyScalar(controls.DollyZoom);
            
            const position = new THREE.Vector3(-1.75 * INIT_POS, 30, -1 * (INIT_POS + 4 * ONE_SQUARE));
            position.add(camLookingDir);
            camera2.position.set(position.x, position.y, position.z);

            var direction = new THREE.Vector3();
            direction.subVectors(camera2.position, figureMiddlePoint);
            camera2.fov = (180 / Math.PI) * 2 * Math.atan(height / direction.length());
            camera2.near = direction.length() / 100;
            camera2.far = direction.length() + 10000;
            camera2.updateProjectionMatrix();
            helper2.update();
        }
    }

    function render() 
    {
        stats.update();
        requestAnimationFrame(render);
        webGLRenderer.render(scene, currentCamera);
        switch(controls.movement) 
        {
            case 0:
              // code block
              break;
            case 1:
                rook.translateX(TRANSLATION);
                if (rook.position.x >= INIT_POS + 3 * ONE_SQUARE) 
                {
                    controls.movement = 2;
                    rook.position.x = INIT_POS + 3 * ONE_SQUARE;
                }
                break;
            case 2:
                rook.translateZ(TRANSLATION);
                if (rook.position.z >= INIT_POS * -1) 
                {
                    controls.movement = 3;
                    rook.position.z = INIT_POS * -1;
                }
                break;
            case 3:
                rook.translateX(-1 * TRANSLATION);
                if (rook.position.x <= INIT_POS) 
                {
                    controls.movement = 4;
                    rook.position.x = INIT_POS;
                }
                break;
            case 4:
                rook.translateZ(-1 * TRANSLATION);
                if (rook.position.z <= INIT_POS)
                {
                    controls.movement = 1;
                    rook.position.z = INIT_POS;
                }
                break;
        }
        /*if (controls.movement == 1)
        {
            if (camera3.up.y > 0.5)
            {
                camera3.up.y -= 0.005;
                camera3.up.z = 1 - camera3.up.y;
            }
        }
        else if (controls.movement == 3)
        {
            if (camera3.up.y < 1)
            {
                camera3.up.y += 0.005;
                camera3.up.z = 1 - camera3.up.y;
            }
        }*/
        camera3.lookAt(rook.position);
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
        figure.position.set(-125, 1, -125);
        figure.castShadow = true;
        return figure;
    }

    function addLights()
    {
        const spotLight = new THREE.SpotLight(0xFFFFFF);
        spotLight.position.set(100, 200, 100);
        spotLight.castShadow = true;
        scene.add(spotLight);
        var ambientLight = new THREE.AmbientLight("#303030");
        scene.add(ambientLight);
    }

    function addPlane()
    {
        const geometry = new THREE.PlaneGeometry(300, 300);
        const texture = THREE.ImageUtils.loadTexture("./textures/chess.jpg");
        const material = new THREE.MeshPhongMaterial({
            map: texture,
            color: 0xFFFFFF,
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
    gui.add(controls, 'setCamera1').name("Camera 1");
    gui.add(controls, 'cam1FOV', 10, 100).step(1).name("FOV").onChange(controls.cam1Change);
    gui.add(controls, 'setCamera2').name("Camera 2");
    gui.add(controls, "DollyZoom", -100, 100).onChange(controls.cam2Change);
    gui.add(controls, 'setCamera3').name("Camera 3");
    addLights();
    addPlane();
    var rook = createFigure();
    scene.add(rook);
    controls.setCamera2();
    controls.setCamera1();
    render();

    var box = new THREE.Box3().setFromObject(rook);
  
    var figureMiddlePoint = new THREE.Vector3(
    INIT_POS + 5 * ONE_SQUARE,
    rook.position.y + box.getSize().y * 0.5,
    INIT_POS + 3 * ONE_SQUARE
    );
});