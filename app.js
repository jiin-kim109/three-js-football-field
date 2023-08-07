import * as Three from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
import { CinematicCamera } from 'https://unpkg.com/three@0.126.1/examples/jsm/cameras/CinematicCamera.js';


const mouse = new Three.Vector2();
let INTERSECTED;

const objects = [];

window.onload = () => {
    const scene = new Three.Scene();
    scene.background = new Three.Color(0xeeeeee);

    const camera = new CinematicCamera(
        50,
        window.innerWidth / window.innerHeight,
        1,
        4000
    );
    camera.position.set(-50, 10, 50);
    camera.lookAt(0, 0, 0);

    // WebGL as a Renderer
    const renderer = new Three.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = true;

    const raycaster = new Three.Raycaster();

    /**
     * Camera Control
     */
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false;
    controls.minDistance = 20;
    controls.maxDistance = 200;
    controls.update();

    /**
    * Texture 
    */
    // Skybox
    const skyboxTextures = {
        ft: new Three.TextureLoader().load('./images/Footballfield/posx.jpg'),
        bk: new Three.TextureLoader().load('./images/Footballfield/negx.jpg'),
        up: new Three.TextureLoader().load('./images/Footballfield/posy.jpg'),
        dn: new Three.TextureLoader().load('./images/Footballfield/negy.jpg'),
        rt: new Three.TextureLoader().load('./images/Footballfield/posz.jpg'),
        lf: new Three.TextureLoader().load('./images/Footballfield/negz.jpg'),
    }
    const skyMaterialArray = [];
    for (const [side, texture] of Object.entries(skyboxTextures)) {
        const material = new Three.MeshBasicMaterial({ map: texture });
        material.side = Three.BackSide;
        skyMaterialArray.push(material);
    }
    // Plane
    var repeatX	= 10;
	var repeatY	= 10;
	var anisotropy	= 16;
	var planeNormal	= Three.ImageUtils.loadTexture('./images/grass/grass_01_norm.png');
	var planeDiffuse = Three.ImageUtils.loadTexture('./images/grass/grass_01.png');
    planeNormal.repeat.x = repeatX
	planeNormal.repeat.y = repeatY
	planeNormal.anisotropy = anisotropy;
    planeDiffuse.wrapS = Three.RepeatWrapping;
	planeDiffuse.wrapT = Three.RepeatWrapping;
	planeDiffuse.repeat.x = repeatX
	planeDiffuse.repeat.y = repeatY
	planeDiffuse.anisotropy = anisotropy;

    /**
     * Mesh
     */
    // Skybox
    const skyGeometry = new Three.BoxGeometry(2400, 2400, 2400);
    const sky = new Three.Mesh(skyGeometry, skyMaterialArray);
    // Balls

    // Plane
    const planeGeometry = new Three.CircleGeometry(2000,2000);
    //const planeMaterial = new Three.ShadowMaterial();
    //planeMaterial.opacity = 0.2;
    const planeMaterial = new Three.MeshPhongMaterial({ 
		map	: planeDiffuse,
		normalMap : planeNormal,
        normalScale	: new Three.Vector2(1,1).multiplyScalar(0.5),
		color : 0x33FF33,
    });
    const plane = new Three.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.y = -5;
    plane.receiveShadow = true;
    
    scene.add(sky);
    scene.add(plane);
    for (let i=0; i<200; i++) {
        createRandomBall(scene);
    }
    /**
     * Lighting
     */
    const ambientLight = new Three.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    var hemiLight = new Three.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
    // hemiLight.color.setHSV( 0.6, 0.75, 0.5 );
    // hemiLight.groundColor.setHSV( 0.095, 0.5, 0.5 );
    hemiLight.position.set( 0, 500, 0 );
    scene.add( hemiLight );
    /*
    const pointLight = new Three.PointLight(0xffffff, 0.5);
    pointLight.position.set(-5, 100, 100);
    const plHelper = new Three.PointLightHelper(pointLight, 0.1, 0x0000ff);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 2048;
    pointLight.shadow.mapSize.height = 2048;
    scene.add(plHelper);
    scene.add(pointLight);
    */
    const directionalLight = new Three.DirectionalLight(0xffffff, 1.7);
    directionalLight.position.set(-5, 0.75, 1);
    directionalLight.position.multiplyScalar(100);
    directionalLight.target.updateMatrixWorld();
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadowCameraVisible = true;
    var d = 500;
    directionalLight.shadow.camera.left = -d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = -d;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 3500;
    directionalLight.shadow.Bias = -0.0001;
    directionalLight.shadow.Darkness = 0.35;
    const dlHelper = new Three.DirectionalLightHelper(directionalLight, 0.2, 0x0000ff);
    //scene.add( new Three.CameraHelper( directionalLight.shadow.camera ) );
    //scene.add(dlHelper);
    scene.add(directionalLight);

    function animate() {
        requestAnimationFrame(animate);
        render();
        renderer.render(scene, camera);
    }
    function render() {
        raycaster.setFromCamera( mouse, camera );
        const intersects = raycaster.intersectObjects( objects, false );
        if ( intersects.length > 0 ) {
            const targetDistance = intersects[ 0 ].distance;
            camera.focusAt( targetDistance );
            if ( INTERSECTED != intersects[ 0 ].object ) {
                if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
                INTERSECTED = intersects[ 0 ].object;
                INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
                INTERSECTED.material.color.setHex( 0xff0000 );
            }
        } else {
            if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
            INTERSECTED = null;
        }
    }
    animate();

    function createRandomBall() {
        const posX = Math.random() * 900 - 450;
        const posZ = Math.random() * 900 - 450;

        const meshGenerators = [
            createSoftballMesh,
            createBasketballMesh,
            createTennisMesh,
            createFootballMesh,
            createBasketballMesh
        ]
        const randomBallMesh = meshGenerators[Math.floor(Math.random()*meshGenerators.length)]();
        randomBallMesh.castShadow = true;
        randomBallMesh.position.x += posX;
        randomBallMesh.position.z += posZ;

        var angleX = Math.PI - Math.random() * (2 * Math.PI);
        var angleY = Math.PI - Math.random() * (2 * Math.PI);
        var angleZ = Math.PI - Math.random() * (2 * Math.PI);
        randomBallMesh.rotation.x = angleX;
        randomBallMesh.rotation.y = angleY;
        randomBallMesh.rotation.z = angleZ;
        scene.add(randomBallMesh);
        objects.push(randomBallMesh);
    }
}

const createFootballMesh = () => {
    const texture = Three.ImageUtils.loadTexture('images/Footballballfree.jpg59a2a1dc-64c8-4bc3-83ef-1257c9147fd1Large.jpg');
    const material = new Three.MeshPhongMaterial({
        map	: texture,
        bumpMap	: texture,
        bumpScale: 0.01,
    });
    const geometry = new Three.SphereGeometry(5, 32, 16);
    const mesh = new Three.Mesh(geometry, material);
    mesh.castShadow = true;
    return mesh;
}
const createBasketballMesh = () => {
    const texture	= Three.ImageUtils.loadTexture('images/BasketballColor.jpg')
    const geometry = new Three.SphereGeometry(5.5, 32, 16);
    const material = new Three.MeshPhongMaterial({
        map	: texture,
        bumpMap	: texture,
        bumpScale: 0.01,
    })
    const mesh = new Three.Mesh(geometry, material);
    mesh.castShadow = true;
    return mesh	
}
const createSoftballMesh = () => {
    const textureColor = Three.ImageUtils.loadTexture('images/SoftballColor.jpg')
    const textureBump = Three.ImageUtils.loadTexture('images/SoftballBump.jpg')
    const geometry = new Three.SphereGeometry(3, 32, 16);
    const material = new Three.MeshPhongMaterial({
        map	: textureColor,
        bumpMap	: textureBump,
        bumpScale: 0.01,
    })
    const mesh	= new Three.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.position.y -= 2;
    return mesh	
}
const createTennisMesh = () => {
    const textureColor = Three.ImageUtils.loadTexture('images/NewTennisBallColor.jpg')
    const textureBump	= Three.ImageUtils.loadTexture('images/TennisBallBump.jpg')
    const geometry = new Three.SphereGeometry(3, 32, 16);
    const material = new Three.MeshPhongMaterial({
        map	: textureColor,
        bumpMap	: textureBump,
        bumpScale: 0.01,
    })
    const mesh = new Three.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.position.y -= 2;
    return mesh	
}


document.addEventListener( 'mousemove', onDocumentMouseMove );

function onDocumentMouseMove( event ) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}