 // once everything is loaded, we run our Three.js stuff.
    $(function () {

        var stats = initStats();
        // create a scene, that will hold all our elements such as objects, cameras and lights.
        var scene = new THREE.Scene();
        // create a camera, which defines where we're looking at.
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

        var webGLRenderer = new THREE.WebGLRenderer();
        webGLRenderer.setClearColorHex(0xEEEEEE, 1.0);
        webGLRenderer.setSize(window.innerWidth, window.innerHeight);
        webGLRenderer.shadowMapEnabled = true;

        camera.position.x = -30;
        camera.position.y = 40;
        camera.position.z = 50;
        camera.lookAt(new THREE.Vector3(10, 0, 0));
        var cameraControls = new THREE.TrackballControls(camera, render.domElement);

        $("#WebGL-output").append(webGLRenderer.domElement);

        var step = 0;
        var spGroup;
        var hullMesh;
        generatePoints();

        var controls = new function () {
            this.redraw = function () {
                scene.remove(spGroup);
                scene.remove(hullMesh);
                console.log();
                generatePoints();
            };
        }

        var gui = new dat.GUI();
        gui.add(controls, 'redraw');
        render();

        function generatePoints() {
            var points = [];
            var R = 15;
            var randomX, randomY, randomZ;
            for (var i = 0; i < 200; i++) {
                while (true){
                    randomX = Math.round(THREE.Math.randFloat(-R, R));
                    randomY = Math.round(THREE.Math.randFloat(-R, R));
                    if (R ** 2 - (randomX ** 2 + randomY ** 2) > 0) break;
                }
                randomZ = (Math.sqrt(R ** 2 - (randomX ** 2 + randomY ** 2)));
                if (Math.random() > 0.5) randomZ = randomZ * -1;
                if (i % 3 == 0) points.push(new THREE.Vector3(randomX, randomY, randomZ));
                else if (i % 3 == 1) points.push(new THREE.Vector3(randomZ, randomX, randomY));
                else points.push(new THREE.Vector3(randomY, randomZ, randomX));
                console.log("Pushed: ", randomX, randomY, randomZ)
                //console.log(randomX ** 2 + randomY ** 2 + randomZ ** 2, R ** 2)
            }
            //console.log("Points size: ", points.lenght);
            spGroup = new THREE.Object3D();
            var material = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: false});
            points.forEach(function (point) {
                var spGeom = new THREE.SphereGeometry(0.2);
                var spMesh = new THREE.Mesh(spGeom, material);
                spMesh.position = point;
                spGroup.add(spMesh);
            });
            scene.add(spGroup);
            var hullGeometry = new THREE.ConvexGeometry(points);
            console.log("comparison: ", hullGeometry.faceVertexUvs[0].length, 500);
            for ( i = 0; i < hullGeometry.faceVertexUvs[0].length; i++)
            {
                var point;
                for (var j = 0; j < 3; j++) 
                {
                    var x, y, z;
                    if (j === 0)
                    {
                        point = hullGeometry.vertices[hullGeometry.faces[i].a].clone().normalize();
                    }
                    else if (j === 1)
                    {
                        point = hullGeometry.vertices[hullGeometry.faces[i].b].clone().normalize();
                    }
                    else if (j === 2)
                    {
                        point = hullGeometry.vertices[hullGeometry.faces[i].c].clone().normalize();
                    }
                    x = point.x;
                    y = point.y;
                    z = point.z;
                    hullGeometry.faceVertexUvs[0][i][j].x = 0.5 + (Math.atan2(x, z) / (2 * Math.PI));
                    hullGeometry.faceVertexUvs[0][i][j].y = 0.5 + Math.asin(y)  / Math.PI;
                }
                var dif = 0.8;
                if (Math.abs(hullGeometry.faceVertexUvs[0][i][0].x - hullGeometry.faceVertexUvs[0][i][1].x) > dif ||
                    Math.abs(hullGeometry.faceVertexUvs[0][i][1].x - hullGeometry.faceVertexUvs[0][i][2].x) > dif || 
                    Math.abs(hullGeometry.faceVertexUvs[0][i][2].x - hullGeometry.faceVertexUvs[0][i][0].x) > dif)
                {
                    hullGeometry.faceVertexUvs[0][i][0].x = hullGeometry.faceVertexUvs[0][i][0].x - 1;
                    hullGeometry.faceVertexUvs[0][i][1].x = hullGeometry.faceVertexUvs[0][i][1].x - 1;
                    hullGeometry.faceVertexUvs[0][i][2].x = hullGeometry.faceVertexUvs[0][i][2].x - 1;
                }
            }
            hullMesh = createMesh(hullGeometry);
            scene.add(hullMesh);
        }

        function createMesh(geom) {
            var texture = THREE.ImageUtils.loadTexture("../ND4/texture.png");
            //var meshMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0.2});
            var meshMaterial = new THREE.MeshBasicMaterial();
            meshMaterial.side = THREE.DoubleSide;
            meshMaterial.map = texture;
            var wireFrameMat = new THREE.MeshBasicMaterial();
            wireFrameMat.wireframe = true;
            var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial, wireFrameMat]);
            return mesh;
        }

        function render() {
            stats.update();
            /*spGroup.rotation.y = step;
            hullMesh.rotation.y = step += 0.01;
            // render using requestAnimationFrame*/
            requestAnimationFrame(render);
            webGLRenderer.render(scene, camera);
            cameraControls.update(); 
        }

        function initStats() {
            var stats = new Stats();
            stats.setMode(0); // 0: fps, 1: ms
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.left = '0px';
            stats.domElement.style.top = '0px';
            $("#Stats-output").append(stats.domElement);
            return stats;
        }
    });