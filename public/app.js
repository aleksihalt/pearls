var spheres = [];
var sphereId = 0;
var toggle = 0;
var keyPress;
var collision = [];
var cameraPos = new THREE.Vector3();
var dataCounter=0;
var spaceCounter = false;

var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.5, 1000); 

var transparentPearlMaterial = new THREE.MeshPhongMaterial({color:"rgb(53,114,102)", shininess:0, opacity: 0.8, transparent: true});
var scene = new THREE.Scene();
var skyBoxGeometry = new THREE.SphereGeometry(400,40,40);
var groundGeometry = new THREE.PlaneGeometry( 500, 500, 32 );
var pearlGeometry = new THREE.SphereGeometry( 1, 40, 40 );
var pearlMaterial = new THREE.MeshPhongMaterial({color:"rgb(53,114,102)", shininess:0});
var redMaterial = new THREE.MeshPhongMaterial({color:"rgb(200,0,0)", shininess:0, opacity: 0.8, transparent: true});
var skyBoxMaterial = new THREE.MeshPhongMaterial({color:"rgb(14,59,67)", shininess:0});

const hasPosition = (element) => element.position == collision[0].object.position;

spheres[sphereId] = new THREE.Mesh(pearlGeometry, pearlMaterial);
var transparentPearl = new THREE.Mesh(pearlGeometry, transparentPearlMaterial);
var groundMaterial = new THREE.MeshPhongMaterial({color:"rgb(163,187,173)", shininess:0});
var groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
var skyMesh = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
scene.fog = new THREE.FogExp2( "rgb(14,59,67)", 0.03 );
var light = new THREE.DirectionalLight("rgb(255,255,255)");
var light2 = new THREE.AmbientLight( 0x888888 );
scene.add( light2 );
var renderer = new THREE.WebGLRenderer();

controls = new THREE.OrbitControls( camera, renderer.domElement );

controls.enableDamping = true; 
controls.enableZoom = false;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.maxPolarAngle = (99/100)*Math.PI / 2;
controls.enableKeys = false;


spheres[0].position.set(0,0,0);
groundMesh.rotation.set(Math.PI/2,0,0);
groundMesh.material.side=THREE.DoubleSide;
skyMesh.material.side = THREE.DoubleSide;
groundMesh.position.set(0,0,0);

camera.position.set( 25, 10, 0 );

light.position.set(2,5,3);



scene.add(light, groundMesh, skyMesh);


renderer.setPixelRatio(window.devicePixelRatio);

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

window.addEventListener('resize', onWindowResize, false);  
    
window.addEventListener('keyup', function (e) {
    keyPress = e.keyCode;
    });



function writeUserData(x,y,z) {
    firebase.database().ref('sphereAdded').set({
        X: x,
        Y: y,
        Z: z
        });
    }

    if (spaceCounter == true) {
        firebase.database().ref('X').on('value', function(snapshot) {
            console.log("read");
                          //spheres.push(new THREE.Mesh(pearlGeometry, pearlMaterial));
                          //spheres[spheres.length-1].position.set(snapshot.child("X").val(), snapshot.child("Y").val(), snapshot.child("Z").val());
                         // scene.add(spheres[spheres.length-1]);
                          
         });
    }


function draw() {
    if (spaceCounter == false && keyPress == 32) {
        spaceCounter = true;
        scene.add(spheres[0]);
        keyPress = 0;
    }
    
    if (spaceCounter == true) {
    camera.getWorldPosition(cameraPos);
    var direction = cameraPos.clone().negate().normalize();
    var rayCaster = new THREE.Raycaster(cameraPos, direction); 
    collision = rayCaster.intersectObjects(spheres); 

    if (toggle%2 == 0 && spaceCounter==true) {
        scene.add(transparentPearl);
        transparentPearl.position.set(collision[0].point.x, collision[0].point.y, collision[0].point.z);
        if (keyPress == 32) {
           //spheres.push(new THREE.Mesh(pearlGeometry, pearlMaterial));
        // spheres[spheres.length-1].position.set(collision[0].point.x, collision[0].point.y, collision[0].point.z);
        // scene.add(spheres[spheres.length-1]);
            keyPress = 0;
            writeUserData(collision[0].point.x, collision[0].point.y, collision[0].point.z);
            console.log("write success");
        }
    }

    if (keyPress == 68) {
        toggle += 1;
        if (toggle%2 == 0) {
            for (i=0; i < spheres.length; i++) {
                spheres[i].material= pearlMaterial;
            }    
        }
        keyPress = 0;
    } 

    if (toggle%2 == 1) {
        scene.remove(transparentPearl);
        if (collision[0].object != spheres[0]) {
            collision[0].object.material=redMaterial;
        }
        for (i=1; i < spheres.length; i++) {
            if (spheres[i].material == redMaterial && collision[0].object != spheres[i]) {
                spheres[i].material = pearlMaterial;
            }
        } 
        if (keyPress == 32) {
            var sphereIndex = spheres.findIndex(hasPosition);
            if (sphereIndex != 0) {
            scene.remove(spheres[sphereIndex]);
            spheres.splice(sphereIndex,1);
            keyPress = 0;
            dataCounter--;
            }
        }
        
    }
}
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(draw);

}

     
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}    

    draw();   // the variable is defined


