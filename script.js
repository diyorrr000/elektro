// ====== SYSTEM INITIALIZATION ======
console.log('ElektroServis System Starting...');

// ====== GLOBAL VARIABLES ======
let scene, camera, renderer, particles, particleSystem;
let aboutScene, aboutCamera, aboutRenderer, aboutCube;
let contactScene, contactCamera, contactRenderer, contactSphere;
let servicesScene, servicesCamera, servicesRenderer, servicesLines;
let isLoaded = false;

// ====== DOM ELEMENTS ======
const loader = document.querySelector('.loader');
const scrollProgress = document.querySelector('.scroll-progress');
const navToggle = document.getElementById('navToggle');
const navMenu = document.querySelector('.nav-menu');
const mainTitle = document.getElementById('mainTitle');
const heroSubtitle = document.querySelector('.hero-subtitle');

// ====== LOADER REMOVAL ======
window.addEventListener('load', () => {
    setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        isLoaded = true;
        initAnimations();
        init3D();
    }, 2000);
});

// ====== SCROLL PROGRESS ======
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    scrollProgress.style.width = scrolled + '%';
});

// ====== NAVIGATION TOGGLE ======
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.innerHTML = navMenu.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bolt"></i>';
});

// Close menu when clicking a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.innerHTML = '<i class="fas fa-bolt"></i>';
    });
});

// ====== GSAP ANIMATIONS ======
function initAnimations() {
    // Hero title and subtitle
    gsap.to(mainTitle, {
        duration: 1.5,
        opacity: 1,
        y: 0,
        ease: 'power3.out',
        delay: 0.5
    });
    
    gsap.to(heroSubtitle, {
        duration: 1.5,
        opacity: 1,
        y: 0,
        ease: 'power3.out',
        delay: 0.8
    });

    // Icons animation
    gsap.from('.icon-3d', {
        duration: 1,
        scale: 0,
        rotation: 360,
        stagger: 0.2,
        ease: 'back.out(1.7)',
        delay: 1.2
    });

    // Button animation
    gsap.from('.btn-neon', {
        duration: 1,
        y: 30,
        opacity: 0,
        ease: 'power3.out',
        delay: 1.5
    });

    // Section titles on scroll
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            duration: 1,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
        });
    });

    // Service cards on scroll
    gsap.utils.toArray('.service-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            duration: 0.8,
            y: 50,
            opacity: 0,
            delay: i * 0.1,
            ease: 'power3.out'
        });
    });

    // Why items on scroll
    gsap.utils.toArray('.why-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            duration: 0.8,
            y: 30,
            opacity: 0,
            delay: i * 0.1,
            ease: 'power3.out'
        });
    });
}

// ====== 3D SCENE: HERO (Particles) ======
function initHero3D() {
    const canvas = document.getElementById('hero3d');
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    camera.position.z = 5;

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 50;
        positions[i + 1] = (Math.random() - 0.5) * 50;
        positions[i + 2] = (Math.random() - 0.5) * 50;

        colors[i] = Math.random() * 0.5 + 0.5;     // R
        colors[i + 1] = Math.random() * 0.8 + 0.2; // G
        colors[i + 2] = Math.random() * 1.0;       // B
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });

    particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    // Add electric lines
    const lineGeometry = new THREE.BufferGeometry();
    const lineCount = 100;
    const linePositions = new Float32Array(lineCount * 6);

    for (let i = 0; i < lineCount * 6; i += 6) {
        const x = (Math.random() - 0.5) * 30;
        const y = (Math.random() - 0.5) * 30;
        const z = (Math.random() - 0.5) * 30;

        linePositions[i] = x;
        linePositions[i + 1] = y;
        linePositions[i + 2] = z;
        linePositions[i + 3] = x + (Math.random() - 0.5) * 5;
        linePositions[i + 4] = y + (Math.random() - 0.5) * 5;
        linePositions[i + 5] = z + (Math.random() - 0.5) * 5;
    }

    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00a8ff, transparent: true, opacity: 0.3 });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        particleSystem.rotation.x += 0.001;
        particleSystem.rotation.y += 0.002;
        lines.rotation.y += 0.001;

        renderer.render(scene, camera);
    }
    animate();

    // Resize handling
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ====== 3D SCENE: ABOUT (Cube) ======
function initAbout3D() {
    const container = document.getElementById('about3d');
    
    aboutScene = new THREE.Scene();
    aboutCamera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    aboutRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    aboutRenderer.setSize(container.clientWidth, container.clientHeight);
    aboutRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(aboutRenderer.domElement);

    // Create electric panel (cube with wireframe)
    const geometry = new THREE.BoxGeometry(3, 3, 3);
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x00a8ff }));
    aboutScene.add(line);

    // Inner glowing cube
    const cubeMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00a8ff, 
        transparent: true, 
        opacity: 0.1 
    });
    const cube = new THREE.Mesh(geometry, cubeMaterial);
    aboutScene.add(cube);

    aboutCamera.position.z = 8;

    // Lights
    const light = new THREE.PointLight(0x00a8ff, 1, 100);
    light.position.set(5, 5, 5);
    aboutScene.add(light);

    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        line.rotation.x += 0.01;
        line.rotation.y += 0.01;
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        aboutRenderer.render(aboutScene, aboutCamera);
    }
    animate();

    // Resize
    window.addEventListener('resize', () => {
        aboutCamera.aspect = container.clientWidth / container.clientHeight;
        aboutCamera.updateProjectionMatrix();
        aboutRenderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// ====== 3D SCENE: SERVICES (Energy Lines) ======
function initServices3D() {
    const canvas = document.getElementById('services3d');
    
    servicesScene = new THREE.Scene();
    servicesCamera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    servicesRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    servicesRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
    servicesRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    servicesCamera.position.z = 15;

    // Create animated energy lines
    const lineCount = 50;
    const lineGeometries = [];
    const lineMaterials = [];
    servicesLines = [];

    for (let i = 0; i < lineCount; i++) {
        const geometry = new THREE.BufferGeometry();
        const points = [];
        const segments = 20;
        
        for (let j = 0; j <= segments; j++) {
            const x = (j - segments/2) * 0.5;
            const y = Math.sin(j * 0.5) * 2 + (Math.random() - 0.5) * 0.5;
            const z = (Math.random() - 0.5) * 10;
            points.push(new THREE.Vector3(x, y, z));
        }
        
        geometry.setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ 
            color: new THREE.Color(Math.random() * 0.5 + 0.5, Math.random() * 0.8 + 0.2, 1),
            transparent: true,
            opacity: 0.4
        });
        
        const line = new THREE.Line(geometry, material);
        line.position.x = (Math.random() - 0.5) * 40;
        line.position.y = (Math.random() - 0.5) * 20;
        servicesScene.add(line);
        servicesLines.push({ line, speed: Math.random() * 0.02 + 0.01 });
    }

    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        servicesLines.forEach(obj => {
            obj.line.position.y += obj.speed;
            if (obj.line.position.y > 15) obj.line.position.y = -15;
            obj.line.rotation.z += 0.001;
        });

        servicesRenderer.render(servicesScene, servicesCamera);
    }
    animate();

    // Resize
    window.addEventListener('resize', () => {
        servicesCamera.aspect = canvas.clientWidth / canvas.clientHeight;
        servicesCamera.updateProjectionMatrix();
        servicesRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
}

// ====== 3D SCENE: CONTACT (Sphere) ======
function initContact3D() {
    const container = document.getElementById('contact3d');
    
    contactScene = new THREE.Scene();
    contactCamera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    contactRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    contactRenderer.setSize(container.clientWidth, container.clientHeight);
    contactRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(contactRenderer.domElement);

    // Create glowing sphere
    const geometry = new THREE.SphereGeometry(2, 32, 32);
    const material = new THREE.MeshPhongMaterial({
        color: 0x00ffaa,
        shininess: 100,
        transparent: true,
        opacity: 0.7,
        wireframe: true
    });
    contactSphere = new THREE.Mesh(geometry, material);
    contactScene.add(contactSphere);

    // Inner core
    const coreGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const coreMaterial = new THREE.MeshBasicMaterial({ color: 0x00a8ff });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    contactScene.add(core);

    contactCamera.position.z = 6;

    // Lights
    const light1 = new THREE.PointLight(0x00a8ff, 1, 100);
    light1.position.set(5, 5, 5);
    contactScene.add(light1);

    const light2 = new THREE.PointLight(0x00ffaa, 0.5, 100);
    light2.position.set(-5, -5, 5);
    contactScene.add(light2);

    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        contactSphere.rotation.x += 0.01;
        contactSphere.rotation.y += 0.01;
        core.rotation.x += 0.02;
        core.rotation.y += 0.02;

        contactRenderer.render(contactScene, contactCamera);
    }
    animate();

    // Resize
    window.addEventListener('resize', () => {
        contactCamera.aspect = container.clientWidth / container.clientHeight;
        contactCamera.updateProjectionMatrix();
        contactRenderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// ====== INITIALIZE ALL 3D SCENES ======
function init3D() {
    if (!isLoaded) return;
    
    try {
        initHero3D();
        initAbout3D();
        initServices3D();
        initContact3D();
        console.log('All 3D scenes initialized successfully.');
    } catch (error) {
        console.warn('3D initialization error (non-critical):', error);
    }
}

// ====== INTERACTIVE HOVER EFFECTS ======
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// ====== SMOOTH SCROLL FOR LINKS ======
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// ====== INITIALIZE ON DOM CONTENT LOADED ======
document.addEventListener('DOMContentLoaded', () => {
    console.log('ElektroServis DOM ready.');
    
    // Set current year in footer
    document.querySelector('footer p').innerHTML = `© ${new Date().getFullYear()} <strong>ElektroServis</strong> | Akmalbek Suyarov`;
});