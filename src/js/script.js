import '../scss/style.scss'
import * as THREE from 'three'

// Setup
const sizes = {
    width: 800,
    height: 600
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xffcc00 })
)

scene.add(cube)

const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)



// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3

// Build Scene
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('canvas.webgl')
})
renderer.setSize(sizes.width, sizes.height)

// Time
let time = Date.now()

// Animations
const tick = () => {
    // Time
    const current_time = Date.now()
    const dt = current_time - time

    // Update objects
    cube.rotation.y += .001 * dt

    renderer.render(scene, camera)

    // Update Time
    time = current_time
    window.requestAnimationFrame(tick)
}

tick()
