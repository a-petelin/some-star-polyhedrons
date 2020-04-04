var camera, scene, renderer;
var geometry, material, mesh;

//import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r114/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r114/examples/jsm/controls/OrbitControls.js';

var ico = {
"name":"икосаэдр",
"vertexs": [
    [0, 0, 3],
    [0, -2.6832815729997477, 1.341640786499874],
    [2.55195242505612, -0.8291796067500632, 1.3416407864998743],
    [1.5771933363574009, 2.1708203932499366, 1.3416407864998738],
    [-1.5771933363574004, 2.1708203932499375, 1.3416407864998743],
    [-2.55195242505612, -0.8291796067500622, 1.341640786499874],
    [0, 0, -3],
    [0, 2.6832815729997477, -1.341640786499874],
    [-2.55195242505612, 0.8291796067500632, -1.3416407864998743],
    [-1.5771933363574009, -2.1708203932499366, -1.3416407864998738],
    [1.5771933363574004, -2.1708203932499375, -1.3416407864998743],
    [2.55195242505612, 0.8291796067500622, -1.341640786499874]
],
"faces": [
[0, 2, 1],
[0, 3, 2],
[0, 4, 3],
[0, 5, 4],
[0, 1, 5],
[6, 7, 8],
[6, 8, 9],
[6, 9, 10],
[6, 10, 11],
[6, 11, 7],
[1, 2, 10],
[2, 3, 11],
[3, 4, 7],
[4, 5, 8],
[5, 1, 9],
[7, 11, 3],
[8, 7, 4],
[9, 8, 5],
[10, 9, 1],
[11, 10, 2]
]
};

var cube = {
 "name": "куб",
 "vertexs": [
   [ 1, 1,-1],
   [-1, 1,-1],
   [-1,-1,-1],
   [ 1,-1,-1],
   [ 1,-1, 1],
   [-1,-1, 1],
   [-1, 1, 1],
   [ 1, 1, 1]
 ],
 "faces": [
 [0,1,2],
 [0,2,3],
 [0,3,4],
 [0,4,7],
 [3,2,5],
 [3,5,4],
 [2,1,6],
 [2,6,5],
 [1,0,7],
 [1,7,6],
 [4,5,6],
 [4,6,7]
 ]
};

var tet = {
 "name": "тетраэдр",
 "vertexs": [
   [ 1, 1,-1],
   [-1,-1,-1],
   [ 1,-1, 1],
   [-1, 1, 1]
 ],
 "faces": [
 [1, 0, 2],
 [0, 1, 3],
 [2, 3, 1],
 [3, 2, 0]
 ]
};

function getJSON(url, callback) {
  let xhr = new XMLHttpRequest();
  xhr.onload = function () { 
     callback(this.responseText)
  };
  xhr.open('GET', url, true);
  xhr.send();
}

function getModel(url, callback) {
  getJSON(url, data => callback(JSON.parse(data)));
}


function init() {
  camera = new THREE.OrthographicCamera( -5*window.innerWidth / window.innerHeight,  5*window.innerWidth / window.innerHeight, 5, -5, 1, 10 );
  //new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
  camera.position.z = 5;
  
  getModel('models/ico.json', (model) => {
    geometry = new THREE.Geometry();
    geometry.vertices.push.apply(geometry.vertices, model.vertexs.map((v) => {return new (Function.prototype.bind.apply(THREE.Vector3, [null].concat(v)));}));

    geometry.faces.push.apply(geometry.faces, model.faces.map((f) => {return new (Function.prototype.bind.apply(THREE.Face3, [null].concat(f)));}));

    geometry.computeFaceNormals();
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0.4,0.4,0.4 );

    material = new THREE.MeshNormalMaterial();

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  });
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();
  document.querySelector("#render").appendChild(renderer.domElement);
  
}

function animate() {

  requestAnimationFrame(animate);

  renderer.render(scene, camera);

}

export {init, animate};