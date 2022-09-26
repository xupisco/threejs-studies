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

const colorTexture = textureLoader.load('/textures/minecraft.png')
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.png')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const aoTexture = textureLoader.load('/textures/door/ao.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metallic.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

colorTexture.generateMipmaps = false
colorTexture.minFilter = THREE.NearestFilter
colorTexture.magFilter = THREE.NearestFilter

// Cursor
const cursor = {
    x: 0,
    y: 0
}

// Scene
const scene = new THREE.Scene()

// Objects
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshPhongMaterial({
        map: colorTexture,
        wireframe: false,

    })
)

// Axes Helper
const axesHelper = new THREE.AxesHelper(3)

// Camera
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height)
camera.position.z = 3
camera.lookAt(cube.position)

// Light
const light = new THREE.HemisphereLight(0xffffff, 0x080820, 1.5);
light.position.x = 2

// Build Scene
scene.add(axesHelper)
scene.add(cube)
scene.add(light);
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.autoRotate = true
controls.autoRotateSpeed = 1
controls.enableDamping = true

// GUI & DEBUG
const gui = new dat.GUI({width: 250})
let params = {
    color: cube.material.color.getHex()
}

const folder_pos = gui.addFolder('Position')
folder_pos.add(cube.position, 'x', -3, 3, 0.01)
folder_pos.add(cube.position, 'y', -3, 3, 0.01)
folder_pos.add(cube.position, 'z', -3, 3, 0.01)

const folder_vis = gui.addFolder('Visibility')
folder_vis.addColor(params, 'color').onChange(() => {
    cube.material.color.setHex(Number(params.color.toString().replace('#', '0x')))
})

folder_vis.add(cube, 'visible')
folder_vis.add(light, 'intensity', 0, 10, 0.1).name('light intensity')
folder_vis.add(cube.material, 'wireframe')
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

// Animations
const tick = () => {
    stats.begin();
    // Time
    const current_time = Date.now()
    const dt = current_time - time

    // Update objects
    // cube.rotation.y += .0005 * dt

    // Update camera
    // const cam_angle = cursor.x * Math.PI * 2
    // const cam_dist = 3

    // camera.position.x = Math.sin(cam_angle) * cam_dist
    // camera.position.z = Math.cos(cam_angle) * cam_dist
    // camera.position.y = cursor.y * 10
    // camera.lookAt(cube.position)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Update Time
    time = current_time
    stats.end();
    window.requestAnimationFrame(tick)
}

tick()
