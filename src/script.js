import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'


// Texture loader for particle shapes diff from default 
// square shape
const loader = new THREE.TextureLoader()
const loader1 = new THREE.TextureLoader()
const loader2 = new THREE.TextureLoader()

const starShape = loader.load('./star3.png')
const starShape1 = loader1.load('./star1.png')
const starShape2 = loader2.load('./star2.png')

// Debug
const gui = new dat.GUI()


//Text Content
const text = document.querySelector('.content')

const hideTextContent = () => {
    text.style.display = "none" // keeps text from fading back in
}

setTimeout(hideTextContent, 7500)

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );
const particlesGeometry = new THREE.BufferGeometry;
const particlesGeometry1 = new THREE.BufferGeometry;
const particlesGeometry2 = new THREE.BufferGeometry;



const particlesCount = 7000; 

const posArr = new Float32Array(particlesCount * 4)
const posArr1 = new Float32Array(particlesCount * 2)
const posArr2 = new Float32Array(particlesCount * 5)

for (let i = 0; i < particlesCount * 4; i++){
    posArr[i] = (Math.random() - 0.5) * (Math.random() * 5)
}

for (let j = 0; j < particlesCount * 2; j++){
    posArr1[j] = (Math.random() - 0.40) * 2
}

for (let k = 0; k < particlesCount * 6; k++){
    posArr2[k] = (Math.random() - (.01 ** 3)) - (Math.random() ** 4)
} 

// takes random vals from for loop and sets them to
// buffer attrib to be added to render
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArr, 3))
particlesGeometry1.setAttribute('position', new THREE.BufferAttribute(posArr1, 3))
particlesGeometry2.setAttribute('position', new THREE.BufferAttribute(posArr2, 3))

const material = new THREE.PointsMaterial({
    size: 0.005,
    alphaTest: 0.5,
    transparent: false,

})

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.017,
    map: starShape, //map on a custom THREE.js texture
    transparent: false,
alphaTest: 0.062,
})

const particlesMaterial1 = new THREE.PointsMaterial({
    size: 0.02,
    map: starShape1, //map on a custom THREE.js texture
    transparent: false,
alphaTest: 0.062,
})

const particlesMaterial2 = new THREE.PointsMaterial({
    size: .018,
    map: starShape2, //map on a custom THREE.js texture
    transparent: true,
    alphaTest: 0.072,
})


// Mesh
// if using points material must be THREE.Points
// if using a mesh material use THREE.mesh
const sphere = new THREE.Points(geometry,material)
const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial)
const particleMesh1 = new THREE.Points(particlesGeometry2, particlesMaterial1)
const particleMesh2 = new THREE.Points(particlesGeometry1, particlesMaterial2)

// scene.add( particleMesh, particleMesh1, particleMesh2 )
scene.add( particleMesh, particleMesh1, particleMesh2)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)

pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()
let mouseY = 0
let mouseX = 0
// mouse interaction= 0
function animateParticles(e) {
    mouseY= e.clientY
    mouseX= e.clientX
}
document.addEventListener('mousemove', animateParticles)
const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .05 * elapsedTime

    // rotates particle mesh no matter on mouse move 
    // all the particle meshes move with mouse event
    particleMesh.rotation.y = -.004 * elapsedTime // starts the particles movement w/o any client mouse movement 
    
    if (mouseX > 0) { // if there is mouse movement alter particle movement using below method
    particleMesh.rotation.y = mouseX * (elapsedTime * .00003)
    particleMesh.rotation.x = mouseY * (elapsedTime * .00003)
    particleMesh1.rotation.y = mouseX * (elapsedTime * .00003)
    particleMesh1.rotation.x = mouseY * (elapsedTime * .00003)
    particleMesh2.rotation.y = mouseX * (elapsedTime * .00003)
    particleMesh2.rotation.x = mouseY * (elapsedTime * .00003)
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()