// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// --- 1. Momentum Scrolling (Lenis) Setup ---
// We configure Lenis to feel heavy and fluid, matching the brutalist aesthetic.
const lenis = new Lenis({
    duration: 1.5, // Slightly longer duration for heavier momentum
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false, // Keep native scroll on mobile for better UX
    touchMultiplier: 2,
});

// Synchronize Lenis scrolling with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);


// --- 2. Dynamic Theme Inversion Mechanic ---
// This logic forces the site to invert colors when scrolling into specific sections.
// It watches the ".technical-pillars" section we created in the HTML.

ScrollTrigger.create({
    trigger: ".technical-pillars",
    start: "top 40%", // Triggers when the top of the section reaches 40% down the viewport
    end: "bottom 60%", // Triggers when the bottom leaves
    
    // When scrolling down into the section: Invert to Light Theme
    onEnter: () => document.body.classList.add("theme-light"),
    
    // When scrolling back up into the Hero: Revert to Dark Theme
    onLeaveBack: () => document.body.classList.remove("theme-light"),
    
    // When scrolling down past the section: Revert to Dark Theme (for the Cases/Archive)
    onLeave: () => document.body.classList.remove("theme-light"),
    
    // When scrolling back up into the section from below: Invert to Light Theme
    onEnterBack: () => document.body.classList.add("theme-light"),
});

console.log("Core motion and theme mechanics initialized.");
// --- 3. Three.js Hero Animation (Abstract Data Object) ---
// --- 3. Three.js Hero Animation (Wireframe Polygon shifted to Right) ---
const initThreeJS = () => {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    container.innerHTML = ''; // مسح الـ Canvas القديم

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 1. إعادة المضلع القديم (Icosahedron)
    const geometry = new THREE.IcosahedronGeometry(3.2, 1); // حجم مناسب جداً
    
    // 2. إعادة المادة القديمة (الشبكة الفضية)
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x999999, // لون رمادي فضي
        wireframe: true, // شبكة خطوط
        transparent: true,
        opacity: 0.5     // وضوح ممتاز
    });
    
    const shape = new THREE.Mesh(geometry, material);

    // 🚀 السر هنا: إزاحة المضلع لليمين
    // إذا كانت الشاشة كبيرة (لابتوب) أزحه لليمين (2.5)، وإذا كانت جوال اتركه في المنتصف (0)
    shape.position.x = window.innerWidth > 768 ? 2.5 : 0; 
    
    scene.add(shape);

    // 🚀 جزيئات البيانات (Particles) - التحديث الجديد للفخامة والوضوح
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500; // مضاعفة العدد ليملأ الفراغ بشكل ساحر
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        // توزيع الجزيئات في مساحة أوسع (20 بدلاً من 15) لتعطي إحساساً بعمق الفضاء
        posArray[i] = (Math.random() - 0.5) * 20; 
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.035,        // تكبير حجم النقاط لتصبح مرئية بوضوح
        color: 0xffffff,    // جعلها بيضاء ساطعة لتتناقض بقوة مع الخلفية
        transparent: true,
        opacity: 0.7,       // زيادة الوضوح وتقليل الشفافية
        blending: THREE.AdditiveBlending // إضافة لمعان (Glow) خفيف للنقاط عند تقاطعها
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // التفاعل مع الماوس
    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    const clock = new THREE.Clock();

    // حركة الدوران
    const animate = () => {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        shape.rotation.y += 0.003;
        shape.rotation.x += 0.002;
        particlesMesh.rotation.y = -elapsedTime * 0.02;

        const targetX = mouseX * 0.001;
        const targetY = mouseY * 0.001;
        
        shape.rotation.y += 0.05 * (targetX - shape.rotation.y);
        shape.rotation.x += 0.05 * (targetY - shape.rotation.x);

        renderer.render(scene, camera);
    };

    animate();

    // الاستجابة لتغيير حجم الشاشة
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // تحديث مكان المضلع إذا قام المستخدم بتكبير/تصغير النافذة
        shape.position.x = window.innerWidth > 768 ? 2.5 : 0; 
    });
};

initThreeJS();
// Select all case visual containers
const caseVisuals = document.querySelectorAll('.case-visual');

caseVisuals.forEach((visual) => {
    gsap.fromTo(visual, 
        { 
            y: -50 // Start slightly higher
        }, 
        {
            y: 50, // Move slightly lower as you scroll past
            ease: "none",
            scrollTrigger: {
                trigger: visual.parentElement,
                start: "top bottom", 
                end: "bottom top",
                scrub: true, // Ties the animation directly to the scrollbar position
            }
        }
    );
});
// --- 6. Archive Filtering Logic ---
const filterBtns = document.querySelectorAll('.filter-btn');
const archiveItems = document.querySelectorAll('.archive-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        archiveItems.forEach(item => {
            if (filterValue === 'all') {
                item.classList.remove('hidden');
            } else {
                if (item.getAttribute('data-category') === filterValue) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            }
        });
        
        // Force ScrollTrigger to recalculate layout height after filtering
        ScrollTrigger.refresh();
    });
});
// --- 7. Functional Navigation Logic (Lenis ScrollTo) ---
const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const targetId = item.getAttribute('data-target');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Tell Lenis to smoothly scroll to the target section
            lenis.scrollTo(targetElement, {
                offset: -80, // Accounts for the height of the fixed navigation bar
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        }
    });
});
// --- 8. Archive Hover Image Reveal (Mouse Follower) ---
const hoverReveal = document.getElementById('hover-image-reveal');
const archiveRows = document.querySelectorAll('.archive-item');

if (hoverReveal && archiveRows.length > 0) {
    archiveRows.forEach(row => {
        
        // 1. عند دخول الماوس إلى الصف
        row.addEventListener('mouseenter', () => {
            const imgUrl = row.getAttribute('data-image');
            if (imgUrl) {
                // تغيير خلفية الحاوية لتطابق صورة المشروع الخاص بالصف
                hoverReveal.style.backgroundImage = `url('${imgUrl}')`;
                // إضافة كلاس لإظهار الصورة
                hoverReveal.classList.add('visible');
            }
        });

        // 2. عند خروج الماوس من الصف
        row.addEventListener('mouseleave', () => {
            // إخفاء الصورة
            hoverReveal.classList.remove('visible');
        });

        // 3. جعل الصورة تتبع الماوس أثناء حركته داخل الصف
        row.addEventListener('mousemove', (e) => {
            // استخدام GSAP لتحريك الصورة بنعومة شديدة
            gsap.to(hoverReveal, {
                x: e.clientX + 20,  // إزاحة الصورة قليلاً لليمين حتى لا يغطيها مؤشر الماوس
                y: e.clientY - 110, // توسيط الصورة عمودياً بجانب الماوس
                duration: 0.4,      // سرعة التتبع (نعومة الحركة)
                ease: "power3.out"
            });
        });
    });
}











const scrambleElement =
document.getElementById("scramble-name");

if(scrambleElement){

    const finalText =
    "MARRA";

    const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@";

    let animationPlayed = false;

    ScrollTrigger.create({

        trigger: ".about-section",

        start: "top 65%",

        once: true,

        onEnter: () => {

            if(animationPlayed) return;

            animationPlayed = true;

            let iteration = 0;

            const interval = setInterval(() => {

                scrambleElement.innerText =
                finalText
                .split("")
                .map((letter,index) => {

                    if(index < iteration){
                        return finalText[index];
                    }

                    return chars[
                        Math.floor(
                            Math.random() *
                            chars.length
                        )
                    ];

                })
                .join("");

                if(iteration >= finalText.length){

                    clearInterval(interval);

                }

                iteration += 0.10;

            },10);

        }
    });
}




const scrambleElement2 =
document.getElementById("scramble-name2");

if(scrambleElement2){

    const finalText =
    "MOHAMED";

    const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@";

    let animationPlayed = false;

    ScrollTrigger.create({

        trigger: ".about-section",

        start: "top 65%",

        once: true,

        onEnter: () => {

            if(animationPlayed) return;

            animationPlayed = true;

            let iteration = 0;

            const interval = setInterval(() => {

                scrambleElement2.innerText =
                finalText
                .split("")
                .map((letter,index) => {

                    if(index < iteration){
                        return finalText[index];
                    }

                    return chars[
                        Math.floor(
                            Math.random() *
                            chars.length
                        )
                    ];

                })
                .join("");

                if(iteration >= finalText.length){

                    clearInterval(interval);

                }

                iteration += 0.05;

            },35);

        }
    });
}



// --- 9. Metrics Counter Animation ---
const counters = document.querySelectorAll('.counter');
const speed = 200; // سرعة العد (كلما قل الرقم كانت أسرع)

// استخدام Intersection Observer لتشغيل العد فقط عندما يرى المستخدم القسم
const observerOptions = {
    root: null,
    threshold: 0.5 // يبدأ العد عندما يظهر 50% من القسم في الشاشة
};

const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
            observer.unobserve(counter); // تشغيلها مرة واحدة فقط
        }
    });
}, observerOptions);

counters.forEach(counter => {
    counterObserver.observe(counter);
});