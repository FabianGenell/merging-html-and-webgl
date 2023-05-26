import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'

// import clouds from '../img/clouds.jpg'

export default class Sketch {
    constructor(options) {
        this.time = 0;
        this.container = options.dom;
        this.scene = new THREE.Scene();

        this.height = this.container.offsetHeight;
        this.width = this.container.offsetWidth;

        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
        this.camera.position.z = 10;

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.width, this.height);
        this.container.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement)


        this.resize();
        this.setupResize();
        this.addObjects();
        this.render();
    }

    setupResize() {
        window.addEventListener('resize', this.resize.bind(this));
    }

    resize() {

        this.height = this.container.offsetHeight;
        this.width = this.container.offsetWidth;

        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;

        this.camera.updateProjectionMatrix();
    }



    addObjects() {
        // this.geometry = new THREE.PlaneGeometry(4, 4, 100, 100);
        this.geometry = new THREE.SphereGeometry(4, 100, 100)

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
            },
            side: THREE.DoubleSide,
            fragmentShader: fragment,
            vertexShader: vertex,
            wireframe: false,
        })


        this.cube = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.cube);
    }

    render() {
        this.material.uniforms.time.value += 0.02;

        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(this.render.bind(this)); //We use bind(this) so that the context of 'this' doesn't get lost (or something like that)
    }
}

new Sketch({
    dom: document.getElementById('container'),
});









