import * as Three from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';

window.onload = () => {
    const scene = new Three.Scene();
    scene.background = new Three.Color(0xeeeeee);

    const camera = new Three.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        1,
        4000
    );
    camera.position.set(0, 20, 100);
    camera.lookAt(0, 0, 0);

    // WebGL as a Renderer
    const renderer = new Three.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Control
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 20;
    controls.maxDistance = 800;
    controls.update();

    // Texture
    const skyboxTextures = {
        ft: new Three.TextureLoader().load('./images/Footballfield/posx.jpg'),
        bk: new Three.TextureLoader().load('./images/Footballfield/negx.jpg'),
        up: new Three.TextureLoader().load('./images/Footballfield/posy.jpg'),
        dn: new Three.TextureLoader().load('./images/Footballfield/negy.jpg'),
        rt: new Three.TextureLoader().load('./images/Footballfield/posz.jpg'),
        lf: new Three.TextureLoader().load('./images/Footballfield/negz.jpg'),
    }
    const skyMaterialArray = [];
    for (const texture of Object.values(skyboxTextures)) {
        const material = new Three.MeshStandardMaterial({
            map: texture
        });
        material.side = Three.BackSide;
        skyMaterialArray.push(material);
    }
    
    // Mesh
    const skyGeometry = new Three.BoxGeometry(2400, 2400, 2400);
    const sky = new Three.Mesh(skyGeometry, skyMaterialArray);
    scene.add(sky);

    // Lighting
    const ambientLight = new Three.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
}