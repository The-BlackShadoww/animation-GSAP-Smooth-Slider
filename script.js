// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { SplitText } from "gsap/SplitText";
// import Lenis from "lenis";

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  //todo--> Slide content data
  const slides = [
    {
      title:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, dolore dolorem nostrum, totam vitae, molestias quam eos eligendi officia",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80",
    },
    {
      title:
        "A second poetic line. Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, dolore dolorem nostrum, totam vitae, molestias quam eos eligendi officia",
      image:
        "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1920&q=80",
    },
    {
      title:
        "Third line is poetic too. Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, dolore dolorem nostrum, totam vitae, molestias quam eos eligendi officia",
      image:
        "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1920&q=80",
    },
    {
      title:
        "Fourth poetic line delight. Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, dolore dolorem nostrum, totam vitae, molestias quam eos eligendi officia",
      image:
        "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1920&q=80",
    },
    {
      title:
        "Fifth line for the slider. Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, dolore dolorem nostrum, totam vitae, molestias quam eos eligendi officia",
      image:
        "https://images.unsplash.com/photo-1469594292607-ee250bf79d6b?auto=format&fit=crop&w=1920&q=80",
    },
  ];

  //todo--> Calculate scroll distance for pinning
  const pinDistance = window.innerHeight * slides.length;

  //todo--> DOM Elements
  const progressBar = document.querySelector(".slider-progress");
  const imagesContainer = document.querySelector(".slider-images");
  const titleContainer = document.querySelector(".slider-title");
  const indicesContainer = document.querySelector(".slider-indices");

  let activeSlide = 0;
  let currentSplit = null;

  //todo--> Create slide indicators dynamically
  function createIndices() {
    indicesContainer.innerHTML = "";
    slides.forEach((slide, i) => {
      const p = document.createElement("p");
      p.dataset.index = i;

      const marker = document.createElement("span");
      marker.classList.add("marker");
      const index = document.createElement("span");
      index.classList.add("index");
      index.textContent = (i + 1).toString().padStart(2, "0");

      p.appendChild(marker);
      p.appendChild(index);
      indicesContainer.appendChild(p);

      if (i === 0) {
        marker.style.transform = "scaleX(1)";
        index.style.opacity = "1";
      } else {
        marker.style.transform = "scaleX(0)";
        index.style.opacity = "0.4";
      }
    });
  }

  //todo--> Animate new slide: image + title + indicators
  function animateNewSlide(index) {
    const newImage = document.createElement("img");
    newImage.src = slides[index].image;
    newImage.alt = slides[index].title;

    gsap.set(newImage, {
      scale: 1.1,
      opacity: 0,
    });

    imagesContainer.appendChild(newImage);

    gsap.to(newImage, {
      opacity: 1,
      scale: 1,
      duration: 1.5,
      ease: "power3.out",
    });

    // Cleanup old images, keep at most 3
    if (imagesContainer.children.length > 3) {
      imagesContainer.removeChild(imagesContainer.children[0]);
    }

    animateNewTitle(index);
    animateIndicators(index);
  }

  //todo--> Animate the side progress indicators
  function animateIndicators(index) {
    const paragraphs = indicesContainer.querySelectorAll("p");
    paragraphs.forEach((p, i) => {
      const marker = p.querySelector(".marker");
      const number = p.querySelector(".index");

      if (i === index) {
        gsap.to(marker, { scaleX: 1, duration: 0.3, ease: "power2.out" });
        gsap.to(number, { opacity: 1, duration: 0.3, ease: "power2.out" });
      } else {
        gsap.to(marker, { scaleX: 0, duration: 0.3, ease: "power2.out" });
        gsap.to(number, { opacity: 0.4, duration: 0.3, ease: "power2.out" });
      }
    });
  }

  //todo--> Animate slide title text lines using SplitText
  function animateNewTitle(index) {
    if (currentSplit) {
      currentSplit.revert();
    }

    titleContainer.innerHTML = `<h1>${slides[index].title}</h1>`;

    currentSplit = new SplitText(titleContainer.querySelector("h1"), {
      type: "lines",
      linesClass: "line",
    });

    gsap.set(currentSplit.lines, {
      yPercent: 100,
      opacity: 0,
    });

    gsap.to(currentSplit.lines, {
      yPercent: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.1,
    });
  }

  //todo--> Initialize indices on page load
  createIndices();
  //todo--> Show the first slide initially
  animateNewSlide(0);

  //todo--> Setup ScrollTrigger for pinning and slide change on scroll
  ScrollTrigger.create({
    trigger: ".slider",
    start: "top top",
    end: `+=${pinDistance}`,
    pin: true,
    scrub: 0.6,
    onUpdate: (self) => {
      //todo--> Animate progress bar scaleY based on scroll progress
      gsap.to(progressBar, {
        scaleY: self.progress,
        ease: "none",
        duration: 0.3,
      });

      //todo--> Calculate current slide index
      const newIndex = Math.min(
        slides.length - 1,
        Math.floor(self.progress * slides.length)
      );

      //todo--> Update slide if changed
      if (newIndex !== activeSlide) {
        activeSlide = newIndex;
        animateNewSlide(newIndex);
      }
    },
  });
});

//! code from perplexity
// //todo--> Register GSAP Plugins
// gsap.registerPlugin(ScrollTrigger, SplitText);

// //todo--> Initialize Lenis smooth scrolling
// const lenis = new Lenis();
// lenis.on("scroll", ScrollTrigger.update);
// function raf(time) {
//   lenis.raf(time);
//   requestAnimationFrame(raf);
// }
// requestAnimationFrame(raf);

// //todo--> Slide content data
// const slides = [
//   {
//     title: "Poetic line number one",
//     image:
//       "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80",
//   },
//   {
//     title: "A second poetic line",
//     image:
//       "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1920&q=80",
//   },
//   {
//     title: "Third line is poetic too",
//     image:
//       "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1920&q=80",
//   },
//   {
//     title: "Fourth poetic line delight",
//     image:
//       "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1920&q=80",
//   },
//   {
//     title: "Fifth line for the slider",
//     image:
//       "https://images.unsplash.com/photo-1469594292607-ee250bf79d6b?auto=format&fit=crop&w=1920&q=80",
//   },
// ];

// //todo--> Calculate scroll distance for pinning
// const pinDistance = window.innerHeight * slides.length;

// //todo--> DOM Elements
// const progressBar = document.querySelector(".slider-progress");
// const imagesContainer = document.querySelector(".slider-images");
// const titleContainer = document.querySelector(".slider-title");
// const indicesContainer = document.querySelector(".slider-indices");

// let activeSlide = 0;
// let currentSplit = null;

// //todo--> Create slide indicators dynamically
// function createIndices() {
//   indicesContainer.innerHTML = "";
//   slides.forEach((slide, i) => {
//     const p = document.createElement("p");
//     p.dataset.index = i;

//     const marker = document.createElement("span");
//     marker.classList.add("marker");
//     const index = document.createElement("span");
//     index.classList.add("index");
//     index.textContent = (i + 1).toString().padStart(2, "0");

//     p.appendChild(marker);
//     p.appendChild(index);
//     indicesContainer.appendChild(p);

//     if (i === 0) {
//       marker.style.transform = "scaleX(1)";
//       index.style.opacity = "1";
//     } else {
//       marker.style.transform = "scaleX(0)";
//       index.style.opacity = "0.4";
//     }
//   });
// }

// //todo--> Animate new slide: image + title + indicators
// function animateNewSlide(index) {
//   const newImage = document.createElement("img");
//   newImage.src = slides[index].image;
//   newImage.alt = slides[index].title;

//   gsap.set(newImage, {
//     scale: 1.1,
//     opacity: 0,
//   });

//   imagesContainer.appendChild(newImage);

//   gsap.to(newImage, {
//     opacity: 1,
//     scale: 1,
//     duration: 1.5,
//     ease: "power3.out",
//   });

//   // Cleanup old images, keep at most 3
//   if (imagesContainer.children.length > 3) {
//     imagesContainer.removeChild(imagesContainer.children[0]);
//   }

//   animateNewTitle(index);
//   animateIndicators(index);
// }

// //todo--> Animate the side progress indicators
// function animateIndicators(index) {
//   const paragraphs = indicesContainer.querySelectorAll("p");
//   paragraphs.forEach((p, i) => {
//     const marker = p.querySelector(".marker");
//     const number = p.querySelector(".index");

//     if (i === index) {
//       gsap.to(marker, { scaleX: 1, duration: 0.3, ease: "power2.out" });
//       gsap.to(number, { opacity: 1, duration: 0.3, ease: "power2.out" });
//     } else {
//       gsap.to(marker, { scaleX: 0, duration: 0.3, ease: "power2.out" });
//       gsap.to(number, { opacity: 0.4, duration: 0.3, ease: "power2.out" });
//     }
//   });
// }

// //todo--> Animate slide title text lines using SplitText
// function animateNewTitle(index) {
//   if (currentSplit) {
//     currentSplit.revert();
//   }

//   titleContainer.innerHTML = `<h1>${slides[index].title}</h1>`;

//   currentSplit = new SplitText(titleContainer.querySelector("h1"), {
//     type: "lines",
//     linesClass: "line",
//   });

//   gsap.set(currentSplit.lines, {
//     yPercent: 100,
//     opacity: 0,
//   });

//   gsap.to(currentSplit.lines, {
//     yPercent: 0,
//     opacity: 1,
//     duration: 0.8,
//     ease: "power3.out",
//     stagger: 0.1,
//   });
// }

// //todo--> Initialize indices on page load
// createIndices();
// //todo--> Show the first slide initially
// animateNewSlide(0);

// //todo--> Setup ScrollTrigger for pinning and slide change on scroll
// ScrollTrigger.create({
//   trigger: ".slider",
//   start: "top top",
//   end: `+=${pinDistance}`,
//   pin: true,
//   scrub: 0.6,
//   onUpdate: (self) => {
//     //todo--> Animate progress bar scaleY based on scroll progress
//     gsap.to(progressBar, {
//       scaleY: self.progress,
//       ease: "none",
//       duration: 0.3,
//     });

//     //todo--> Calculate current slide index
//     const newIndex = Math.min(
//       slides.length - 1,
//       Math.floor(self.progress * slides.length)
//     );

//     //todo--> Update slide if changed
//     if (newIndex !== activeSlide) {
//       activeSlide = newIndex;
//       animateNewSlide(newIndex);
//     }
//   },
// });
