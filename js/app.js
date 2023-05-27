import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import imagesLoaded from 'imagesloaded';
import FontFaceObserver from 'fontfaceobserver';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';

import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'


// import clouds from '../img/clouds.jpg'

export default class Sketch {
    constructor(options) {

        this.time = 0;

        this.container = options.dom;
        this.height = this.container.offsetHeight;
        this.width = this.container.offsetWidth;

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
        this.camera.position.z = 10;
        this.camera.fov = 2 * Math.atan((this.height / 2) / this.camera.position.z) * (180 / Math.PI);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.width, this.height);
        this.renderer.outputColorSpace = 'srgb-linear'; //Without this images become washed out.

        this.container.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement)

        this.images = [...document.querySelectorAll('img')];

        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();

        const loadImages = new Promise((resolve) => imagesLoaded(
            document.querySelectorAll('img'), { background: true }, resolve)
        );

        const loadOpenSans = new FontFaceObserver('Open Sans').load();
        const loadPlayfair = new FontFaceObserver('Playfair Display').load();

        Promise.all([loadImages, loadOpenSans, loadPlayfair]).then(() => {
            this.addImages();
            this.pointerMovement();
            this.setupScroll();
            this.resize();
            this.setupResize();
            this.addObjects();
            this.render();
        })
    }

    pointerMovement() {
        window.addEventListener('mousemove', (e) => {
            // calculate pointer position in normalized device coordinates
            // (-1 to +1) for both components
            this.pointer.x = (e.clientX / this.width) * 2 - 1;
            this.pointer.y = - (e.clientY / this.height) * 2 + 1;

            this.raycaster.setFromCamera(this.pointer, this.camera);

            // calculate objects intersecting the picking ray
            const intersects = this.raycaster.intersectObjects(this.scene.children /*This should be list of objects you want to intersect*/);

            if (intersects.length > 0) {
                const obj = intersects[0].object;
                obj.material.uniforms.hover.value = intersects[0].uv;
            }

        }, false);
    }

    setupScroll() {
        this.lenis = new Lenis({ lerp: 0.05 })
        this.currentScroll = 0;
        this.setImagePosition();

        this.lenis.on('scroll', (e) => {
            this.currentScroll += e.velocity;
            this.setImagePosition()
        })

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

    addImages() {

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                uImage: { value: 0.0 },
                hover: { value: new THREE.Vector2(0.5, 0.5) },
                hoverState: { value: 0.0 }
            },
            side: THREE.DoubleSide,
            fragmentShader: fragment,
            vertexShader: vertex,
            wireframe: false,
        })

        this.materials = [];

        this.imageStore = this.images.map(img => {
            const { top, left, width, height } = img.getBoundingClientRect();

            const geometry = new THREE.PlaneGeometry(width, height, 10, 10);
            const texture = new THREE.TextureLoader().load(img.src);

            const material = this.material.clone();
            material.uniforms.uImage.value = texture;
            this.materials.push(material);

            const mesh = new THREE.Mesh(geometry, material);

            img.addEventListener('mouseenter', () => {
                gsap.to(material.uniforms.hoverState, {
                    duration: 1,
                    value: 1,
                })
            })

            img.addEventListener('mouseleave', () => {
                gsap.to(material.uniforms.hoverState, {
                    duration: 1,
                    value: 0,
                })
            })

            this.scene.add(mesh);

            return ({
                mesh,
                img,
                top,
                left,
                width,
                height
            })

        })
    }

    setImagePosition() {
        this.imageStore.forEach(image => {
            //Converting coordinates from page (0,0 is in topleft) to three (0,0 is in center)
            image.mesh.position.x = -this.width / 2 + image.left + image.width / 2;
            image.mesh.position.y = this.height / 2 + this.currentScroll - image.top - image.height / 2;
        })
    }

    addObjects() {
        // this.geometry = new THREE.PlaneGeometry(100, 100, 100, 100);
        // // this.geometry = new THREE.SphereGeometry(4, 100, 100)

        // this.material = new THREE.ShaderMaterial({
        //     uniforms: {
        //         time: { value: 0.0 },
        //     },
        //     side: THREE.DoubleSide,
        //     fragmentShader: fragment,
        //     vertexShader: vertex,
        //     wireframe: false,
        // })


        // this.cube = new THREE.Mesh(this.geometry, this.material);
        // this.scene.add(this.cube);
    }

    render(time) {
        this.time += 0.05;
        this.materials.forEach((material) => material.uniforms.time.value = this.time);

        this.lenis.raf(time)
        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(this.render.bind(this)); //We use bind(this) so that the context of 'this' doesn't get lost (or something like that)
    }
}

new Sketch({
    dom: document.getElementById('container'),
});









