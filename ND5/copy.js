

    // once everything is loaded, we run our Three.js stuff.
    $(function () {

        var stats = initStats();
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

        var webGLRenderer = new THREE.WebGLRenderer();
        webGLRenderer.setClearColor(0xEEEEEE, 1.0);
        webGLRenderer.setSize(window.innerWidth, window.innerHeight);
        webGLRenderer.shadowMapEnabled = true;

        // position and point the camera to the center of the scene
        camera.position.x = -30;
        camera.position.y = 40;
        camera.position.z = 50;
        camera.lookAt(new THREE.Vector3(10, 0, 0));

        $("#WebGL-output").append(webGLRenderer.domElement);

	   	camControl = new THREE.TrackballControls( camera, webGLRenderer.domElement );    

        // call the render function
        //var step = 0;

        //var latheMesh;
        var rook = createFigure(12);

        scene.add(rook);


        // setup the control gui
        var controls = new function () {
            // we need the first child, since it's a multimaterial

            this.segments = 12;
            this.phiStart = 0;
            this.phiLength = 2 * Math.PI;

            this.redraw = function () {
                scene.remove(rook);
                rook = createFigure(12);
                scene.add(rook);
            };
        }

        var gui = new dat.GUI();
        gui.add(controls, 'segments', 0, 200).step(1).onChange(controls.redraw);


        render();

        function createFigure(segments) {
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
            var latheGeometry = new THREE.LatheGeometry(points, Math.ceil(300), 0, 2 * Math.PI);
            var latheMaterial = new THREE.MeshPhongMaterial({
                color: "white",
                combine: THREE.MixOperation,
                reflectivity: 0.3,
                shininess: 300,
              });

            latheMaterial.side = THREE.DoubleSide;
            var figure = new THREE.Mesh(latheGeometry, latheMaterial);
            figure.position.x = figure.position.y = figure.position.z = 0;
            return new THREE.Mesh(latheGeometry, latheMaterial);;
          }

          function createLatheMesh(points, segments) {
            var latheGeometry = new THREE.LatheGeometry(points, Math.ceil(300), 0, 2 * Math.PI);
            var latheMaterial = new THREE.MeshPhongMaterial({
              color: "white",
              combine: THREE.MixOperation,
              reflectivity: 0.3,
              shininess: 300,
            });
            latheMaterial.side = THREE.DoubleSide;
            return new THREE.Mesh(latheGeometry, latheMaterial);
          }

        function render() {
            stats.update();
            requestAnimationFrame(render);
            camControl.update(); 
            webGLRenderer.render(scene, camera);
        }

        function initStats() {

            var stats = new Stats();
            stats.setMode(0);

            // Align top-left
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.left = '0px';
            stats.domElement.style.top = '0px';

            $("#Stats-output").append(stats.domElement);

            return stats;
        }
    });


