// Initialize Locomotive Scroll with GSAP ScrollTrigger integration
function loco() {
    // Register ScrollTrigger plugin with GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Create new Locomotive Scroll instance for smooth scrolling
    const locoScroll = new LocomotiveScroll({
        el: document.querySelector("main"),
        smooth: true
    });

    // Update ScrollTrigger on scroll events
    locoScroll.on("scroll", ScrollTrigger.update);

    // Configure ScrollTrigger to work with Locomotive Scroll
    ScrollTrigger.scrollerProxy("main", {
        scrollTop(value) {
            return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
        },
        pinType: document.querySelector("main").style.transform ? "transform" : "fixed"
    });

    // Update Locomotive Scroll when ScrollTrigger refreshes
    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    ScrollTrigger.refresh();
}

// Initialize smooth scrolling
loco();

// Set up canvas and context for image animation
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

// Frame tracking object for animation
const frame = {
    currentIndex: 0,
    maxIndex: 300
};

// Track loaded images and store image objects
let imageLoaded = 0;
const images = [];

// Preload all animation frames
function preLoadframe() {
    for (let i = 1; i <= frame.maxIndex; i++) {
        const imageUrl = `./assets/images/male${i.toString().padStart(4, "0")}.png`;
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
            imageLoaded++;
            if (imageLoaded === frame.maxIndex) {
                loadImage(frame.currentIndex);
                startAnimation();
            }
        };
        images.push(img);
    }
}

// Load and display a specific frame
function loadImage(index) {
    if (index >= 0 && index <= frame.maxIndex) {
        const img = images[index];
        // Set canvas dimensions to window size
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;

        // Calculate scaling to maintain aspect ratio
        const scaleX = canvas.width / img.width;
        const scaleY = canvas.height / img.height;
        const scale = Math.max(scaleX, scaleY);

        // Calculate new dimensions and centering offsets
        const newWidth = img.width * scale;
        const newHeight = img.height * scale;
        const offsetX = (canvas.width - newWidth) / 2;
        const offsetY = (canvas.height - newHeight) / 2;

        // Clear canvas and draw image
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        context.drawImage(img, 0, 0, img.width, img.height, offsetX, offsetY, newWidth, newHeight);
        
        frame.currentIndex = index;
    }
}

// Handle window resize
window.addEventListener("resize", () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    loadImage(Math.floor(frame.currentIndex));
});

// Initialize scroll-based animations
function startAnimation() {
    // Animate frame sequence based on scroll position
    gsap.to(frame, {
        currentIndex: frame.maxIndex,
        scrollTrigger: {
            scrub: 0.15,
            trigger: "#page>canvas",
            scroller: "main",
            start: "top top",
            end: "700% top",
            pin: true
        },
        onUpdate: function() {
            loadImage(Math.floor(frame.currentIndex));
        }
    });

    // Pin sections during scroll
    gsap.to("#page1", {
        scrollTrigger: {
            trigger: "#page1",
            start: "top top",
            end: "bottom top",
            pin: true,
            scroller: "main"
        }
    });

    gsap.to("#page2", {
        scrollTrigger: {
            trigger: "#page2",
            start: "top top",
            end: "bottom top",
            pin: true,
            scroller: "main"
        }
    });

    gsap.to("#page3", {
        scrollTrigger: {
            trigger: "#page3",
            start: "top top",
            end: "bottom top",
            pin: true,
            scroller: "main"
        }
    });
}

// Start preloading frames
preLoadframe();
