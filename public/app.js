var spheres = [];
var toggle = 0;
var keyPress;
var collision= [];
collision[0] = new THREE.Vector3(0,0,0);
var cameraPos = new THREE.Vector3();
var indexSpheres;
var spacePressed = false;
var spheresInit = {};
var index;
var colors = [];
var randColor = Math.floor(Math.random()*6);
colors[0] = ["rgb(14,59,67)","rgb(53,114,102)","rgb(163,187,173)"];
colors[1] = ["rgb(5, 74, 145)","rgb(62, 124, 177)","rgb(129, 164, 205)"];
colors[2] = ["rgb(113, 97, 239)","rgb(149, 127, 239)","rgb(183, 156, 237)"];
colors[3] = ["rgb(217, 93, 57)","rgb(241, 136, 5)","rgb(240, 162, 2)"];
colors[4] = ["rgb(75, 127, 82)","rgb(125, 209, 129)","rgb(150, 232, 188)"];
colors[5] = ["rgb(195, 125, 146)","rgb(216, 154, 158)","rgb(224, 193, 179)"];
var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.5, 1000); 

var transparentPearlMaterial = new THREE.MeshPhongMaterial({color:colors[randColor][1], shininess:0, opacity: 0.8, transparent: true});
var scene = new THREE.Scene();
var skyBoxGeometry = new THREE.SphereGeometry(400,40,40);
var groundGeometry = new THREE.PlaneGeometry( 500, 500, 32 );
var pearlGeometry = new THREE.SphereGeometry( 1, 40, 40 );
var pearlMaterial = new THREE.MeshPhongMaterial({color:colors[randColor][1], shininess:0});
var redMaterial = new THREE.MeshPhongMaterial({color:"rgb(200,0,0)", shininess:0, opacity: 0.8, transparent: true});
var skyBoxMaterial = new THREE.MeshPhongMaterial({color:colors[randColor][0], shininess:0});

const hasPosition = (element) => element.position == collision[0].object.position;

spheres[0] = new THREE.Mesh(pearlGeometry, pearlMaterial);
var transparentPearl = new THREE.Mesh(pearlGeometry, transparentPearlMaterial);
var groundMaterial = new THREE.MeshPhongMaterial({color:colors[randColor][2], shininess:0});
var groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
var skyMesh = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
scene.fog = new THREE.FogExp2( colors[randColor][0], 0.03 );
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


groundMesh.rotation.set(Math.PI/2,0,0);
groundMesh.material.side=THREE.DoubleSide;
skyMesh.material.side = THREE.DoubleSide;
groundMesh.position.set(0,0,0);

camera.position.set( 25, 10, 0 );

light.position.set(2,5,3);



scene.add(light, groundMesh,skyMesh);


renderer.setPixelRatio(window.devicePixelRatio);

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

window.addEventListener('resize', onWindowResize, false);  
    
window.addEventListener('keyup', function (e) {
    keyPress = e.keyCode;
    });


firebase.database().ref('sculptureData').once('value').then(function(snapshot) {
    console.log(snapshot.child("obj").numChildren());
    for (var i=0; i<snapshot.child("obj").numChildren(); i++){
        console.log("creating sphere "+i);
        spheres.push( new THREE.Mesh(pearlGeometry, pearlMaterial));
        spheres[i].position.set(snapshot.child("obj").child(i).child("x").val(), snapshot.child("obj").child(i).child("y").val(), snapshot.child("obj").child(i).child("z").val());
        scene.add(spheres[i]);
      
        }
    });



function writeSculptureData(obj) {
        firebase.database().ref('sculptureData').set({
        obj});
        }

        function indexSender(index) {
            firebase.database().ref('index').set(
            index);
            }        
/*
function writeUserData(x,y,z) {
    firebase.database().ref('sphereAdded').set({
        X: x,
        Y: y,
        Z: z
        });
    }
function writeUserDataDelete(index) {
    firebase.database().ref('sphereDeleted').set({
        INDEX: index
        });
}
*/

firebase.database().ref('index').on('value', function(snapshot) {
    index = snapshot.val();
    });

firebase.database().ref('sculptureData/obj').on('value', function(snapshot) {
    console.log("reading sculpture data");
    if (spheres.length < snapshot.numChildren()) {
        spheres.push(new THREE.Mesh(pearlGeometry, pearlMaterial));
        spheres[spheres.length-1].position.x=snapshot.child(snapshot.numChildren()-1).child("x").val();
        spheres[spheres.length-1].position.y=snapshot.child(snapshot.numChildren()-1).child("y").val();
        spheres[spheres.length-1].position.z=snapshot.child(snapshot.numChildren()-1).child("z").val();
        scene.add(spheres[spheres.length-1]);
    }
    if (spheres.length > snapshot.numChildren()) {
        scene.remove(spheres[index]); 
        spheres.splice(index,1);
        
        
        }
    });
/*
firebase.database().ref('sphereAdded/X').on('value', function(snapshot) {
    console.log("X read");
    spheres.push(new THREE.Mesh(pearlGeometry, pearlMaterial));
    spheres[spheres.length-1].position.x=snapshot.val();
    });
firebase.database().ref('sphereAdded/Y').on('value', function(snapshot) {

    console.log("Y read");
    spheres[spheres.length-1].position.y=snapshot.val();
});
firebase.database().ref('sphereAdded/Z').on('value', function(snapshot) {
    
    console.log("Z read");
    if (spacePressed == true){
    spheres[spheres.length-1].position.z=snapshot.val();
    scene.add(spheres[spheres.length-1]);   
    }
});


firebase.database().ref('sphereDeleted/INDEX').on('value', function(snapshot) {
    scene.remove(spheres[snapshot.val()]); 
    spheres.splice(snapshot.val(),1);
});

    */


function draw() {

    
    camera.getWorldPosition(cameraPos);
    var direction = cameraPos.clone().negate().normalize();
    var rayCaster = new THREE.Raycaster(cameraPos, direction); 
    collision = rayCaster.intersectObjects(spheres); 
//adding sheres
    if (toggle%2 == 0) {
        scene.add(transparentPearl);
        transparentPearl.position.set(collision[0].point.x, collision[0].point.y, collision[0].point.z);
        if (keyPress == 32) {
            spacePressed = true;
            //writeUserData(transparentPearl.position.x, transparentPearl.position.y, transparentPearl.position.z);
            spheres.push(new THREE.Mesh(pearlGeometry, pearlMaterial));
            spheres[spheres.length-1].position.x=transparentPearl.position.x;
            spheres[spheres.length-1].position.y=transparentPearl.position.y;
            spheres[spheres.length-1].position.z=transparentPearl.position.z;
            scene.add(spheres[spheres.length-1]);
            console.log(spheresInit);
            keyPress = 0;
            for (var i = 0; i < spheres.length; i++) {
                spheresInit[i] = {
                    x: spheres[i].position.x,
                    y: spheres[i].position.y,
                    z: spheres[i].position.z,
              };
            }
            writeSculptureData(spheresInit);
        
        }
    }
//toggle adding/deleting spheres
    if (keyPress == 68) {
        toggle += 1;
        if (toggle%2 == 0) {
            for (i=0; i < spheres.length; i++) {
                spheres[i].material= pearlMaterial;
            }    
        }
        keyPress = 0;
    } 
//deleting spheres
    if (toggle%2 == 1) {
        scene.remove(transparentPearl);
            collision[0].object.material=redMaterial;
        for (i=0; i < spheres.length; i++) {
            if (spheres[i].material == redMaterial && collision[0].object != spheres[i]) {
                spheres[i].material = pearlMaterial;
            }
        } 
        if (keyPress == 32) {
            spacePressed = true;
            var sphereIndex = spheres.findIndex(hasPosition);
            indexSender(sphereIndex);
            if (sphereIndex != 0) {
                scene.remove(spheres[sphereIndex]); 
                spheres.splice(sphereIndex,1);
                
            //scene.remove(spheres[sphereIndex]); CALL ON LISTEN
            //spheres.splice(sphereIndex,1);
            //writeUserDataDelete(sphereIndex);
            keyPress = 0;
            for (var i = 0; i < spheres.length; i++) {
                spheresInit[i] = {
                    x: spheres[i].position.x,
                    y: spheres[i].position.y,
                    z: spheres[i].position.z,
              };
            }
            writeSculptureData(spheresInit);
            
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


