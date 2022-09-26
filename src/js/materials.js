import '../scss/style.scss'
import * as dat from 'dat.gui'
import Stats from 'stats.js'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Setup
const stats = new Stats()
stats.showPanel(0);
document.body.appendChild( stats.dom );

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Textures
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)
const cubeTextureLoader = new THREE.CubeTextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.png')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorAoTexture = textureLoader.load('/textures/door/ao.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metallic.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const matcapTexture = textureLoader.load('/textures/matcaps/8.png')
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')

const envMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg',
])

doorColorTexture.generateMipmaps = false
doorColorTexture.minFilter = THREE.NearestFilter
doorColorTexture.magFilter = THREE.NearestFilter

gradientTexture.generateMipmaps = false
gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter

// Cursor
const cursor = {
    x: 0,
    y: 0
}

// Scene
const scene = new THREE.Scene()

// Objects
const materialBasic = new THREE.MeshBasicMaterial({
    map: doorColorTexture
})
materialBasic.transparent = true
materialBasic.alphaMap = doorAlphaTexture
materialBasic.side = THREE.DoubleSide

const materialNormal = new THREE.MeshNormalMaterial()
const materialMatcap = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture
})

const materialLambert = new THREE.MeshLambertMaterial()
const materialPhong = new THREE.MeshPhongMaterial()
const materialToon = new THREE.MeshToonMaterial({
    gradientMap: gradientTexture
})

const materialStandard = new THREE.MeshStandardMaterial()
materialStandard.metalness = 0
materialStandard.roughness = 1
materialStandard.map = doorColorTexture
materialStandard.aoMap = doorAoTexture
materialStandard.displacementMap = doorHeightTexture
materialStandard.displacementScale = 0.05
materialStandard.metalnessMap = doorMetalnessTexture
materialStandard.roughnessMap = doorRoughnessTexture
materialStandard.normalMap = doorNormalTexture
materialStandard.side = THREE.DoubleSide
materialStandard.transparent = true
materialStandard.alphaMap = doorAlphaTexture

const materialEnv = new THREE.MeshStandardMaterial()
materialEnv.metalness = 0.7
materialEnv.roughness = 0.2

const material = materialStandard

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    material
)
sphere.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
)

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 64, 64),
    material
)
plane.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.35, 0.2, 64, 128),
    material
)
torus.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
)

sphere.position.x = -1.5
torus.position.x = 1.5

// Axes Helper
const axesHelper = new THREE.AxesHelper(3)

// Camera
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height)
camera.position.z = 4

// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4

// Build Scene
scene.add(axesHelper)
scene.add(sphere, plane, torus)
scene.add(ambientLight, pointLight);
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.autoRotate = false
controls.autoRotateSpeed = 1
controls.enableDamping = true

// GUI & DEBUG
const gui = new dat.GUI({width: 300})
let params = {
    color: materialBasic.color.getHex(),
    rotationSpeed: 0.3,
    rotateObjects: false
}

const folder_mat = gui.addFolder('Material')
folder_mat.add(materialStandard, 'metalness', 0, 1, 0.1)
folder_mat.add(materialStandard, 'roughness', 0, 1, 0.1)
folder_mat.add(materialStandard, 'aoMapIntensity', 0, 10, 0.01)
folder_mat.add(materialStandard, 'displacementScale', 0, 5, 0.01)
folder_mat.addColor(params, 'color').onChange(() => {
    materialStandard.color.setHex(Number(params.color.toString().replace('#', '0x')))
})
folder_mat.open()

const folder_vis = gui.addFolder('Visibility')
folder_vis.add(params, 'rotationSpeed', 0, 1, 0.1).name('Cam speed')
folder_vis.add(params, 'rotateObjects')
folder_vis.add(pointLight, 'intensity', 0, 2, 0.1).name('light intensity')
folder_vis.add(materialStandard, 'wireframe')
folder_vis.add(axesHelper, 'visible').name('Axes Helper')
folder_vis.open()

const folder_controls = gui.addFolder('Camera')
folder_controls.add(controls, 'autoRotate')
folder_controls.add(controls, 'autoRotateSpeed', 0, 25, 1)
folder_controls.add(controls, 'enableDamping')
folder_controls.open()


// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
})

const render_handler = () => {
    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

render_handler()

// Toggle Fullscreen
window.addEventListener('dblclick', () => {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
})

// Handle window resize
window.addEventListener('resize', (e) => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    render_handler()
})

// Time
let time = Date.now()
const clock = new THREE.Clock()

// Animations
const tick = () => {
    stats.begin();
    const elapsedTime = clock.getElapsedTime()

    if (params.rotateObjects) {
        sphere.rotation.y = params.rotationSpeed * elapsedTime
        plane.rotation.y = params.rotationSpeed * elapsedTime
        torus.rotation.y = params.rotationSpeed * elapsedTime
    }


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    stats.end();
    window.requestAnimationFrame(tick)
}

tick()
