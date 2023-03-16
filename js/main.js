let camera, scene, renderer;
let geometry, material, mesh;

import * as THREE from 'three';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r114/examples/jsm/controls/OrbitControls.js';
import {Plane, Line, Vect} from './geomLib.js';

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
    camera.position.z = 5;
  
    getModel('models/ico.json', (model) => {
        geometry = new THREE.Geometry();
        geometry.vertices.push.apply(geometry.vertices, model.vertexs.map((v) => {return new (Function.prototype.bind.apply(THREE.Vector3, [null].concat(v)));}));

        geometry.faces.push.apply(geometry.faces, model.faces.map((f) => {return new (Function.prototype.bind.apply(THREE.Face3, [null].concat(f)));}));

        geometry.computeFaceNormals();

        material = new THREE.MeshNormalMaterial();

        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
    });
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0.4,0.4,0.4 );
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
