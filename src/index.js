import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {RoughnessMipmapper} from 'three/examples/jsm/utils/RoughnessMipmapper'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75, //Field of view
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1, 1000); // near and far clipping planes bounding boxes for near and far.

const renderer = new THREE.WebGLRenderer({ antialias:true});
renderer.setSize( window.innerWidth, window.innerHeight);

// start of code attempt to make helmet appear correctly
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;


const pmremGenerator = new THREE.PMREMGenerator( renderer );
pmremGenerator.compileEquirectangularShader();


document.body.appendChild(renderer.domElement);

const light = new THREE.PointLight( 0xFFFFFF, 50, 100 );
light.position.set( 1, 1, 1 );
scene.add( light );

/*
const cube = wireCube();
scene.add(cube);
*/
//scene.add(outline);

//scene.background = new THREE.Color(0xff0000);

camera.position.z = 5;


//const airplane = makeAirplane();
//scene.add(airplane);

const helmet = makeHelmet();
scene.add(helmet);



// User controls
// TODO read documentation on controls

const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change',render)
controls.minDistance = 2;
controls.maxDistance = 10;
controls.target.set(0,0,-0.2);
controls.update();


const objControls = new TransformControls(camera, renderer.domElement);
objControls.addEventListener('change',render);

objControls.attach(helmet);

// this prevents camera controls from interfering with object controls... I I think
objControls.addEventListener( 'dragging-changed', function ( event ) {
    controls.enabled = ! event.value;
} );

scene.add(objControls);

window.addEventListener('resize',onWindowResize, false);




function render(){
    renderer.render(scene,camera)
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    render();

}

function animate(){
    // requestAnimationFrame controls the timing on renderer drawing, i.e. around 60 fps. 
    //    it also pauses when user is not in the same browser tab, which is nice.
    
    // don't really undertstand how this works and why animate() is passed as an argument, but whatever.
    requestAnimationFrame( animate);

    //rotate(cube);
    //rotate(helmet);
    function rotate(object){
        object.rotation.x += 0.01;
        object.rotation.y += 0.01;
    }
    render();
}
animate(); //don't forget to call animate!

function makeHelmet(){
    const model = new THREE.Object3D();

    const roughnessMipmapper = new RoughnessMipmapper( renderer );

    //Importing a 3d Model
    const loader = new GLTFLoader().setPath('./models/helmet/');
    loader.load('DamagedHelmet.gltf', 
    (gltf) => {

        gltf.scene.traverse((child)=>{
            if(child.isMesh){
                roughnessMipmapper.generateMipmaps(child.material);
            }
        })

        model.add(gltf.scene);

        roughnessMipmapper.dispose();

    }, (xhr)=>{
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    }, (error)=>{
        console.error(error);
    });
    return model;
}

function wireCube(){

    // BoxGeometry: contains all the points (vertices) and fill (faces) of a cube
    const geometry = new THREE.BoxGeometry;

    // has properties like color
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00});


    // takes a geometry and applies a material onto it.
    const cube = new THREE.Mesh( geometry, material);

    const outlineMat = new THREE.LineBasicMaterial ( {color:0xffffff, linewidth:40});
    const outlineGeo = new THREE.EdgesGeometry(geometry);
    const lines = new THREE.LineSegments(outlineGeo, outlineMat);
    lines.renderOrder = 1;


    cube.add(lines);

    return cube;
}

function makeAirplane(){

    const model = new THREE.Object3D();
    //Importing a 3d Model
    const loader = new GLTFLoader();
    loader.load('./models/airplane/scene.gltf', 
    (gltf) => {
        //scene.add(gltf.scene);
        
        const geometry0 = gltf.scene.getObjectByName('mesh_0').geometry;
        const geometry1 = gltf.scene.getObjectByName('mesh_1').geometry;
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        const mesh0 = new THREE.Mesh( geometry0, material);
        const mesh1 = new THREE.Mesh( geometry1, material);
        model.add(mesh0);
        model.add(mesh1);
        //console.log(gltf.scene);
    }, (xhr)=>{
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    }, (error)=>{
        console.error(error);
    });
    return model;
}
