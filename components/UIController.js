"use client";

import { useEffect } from "react";

export default function UIController() {
  useEffect(() => {
    document.body.classList.add("scroll-reveal-ready");

    const root = document;

    const onClick = (event) => {
      const option = event.target.closest(".option-card");
      if (option) {
        const parent = option.closest(".options-grid");
        if (parent) {
          parent.querySelectorAll(".option-card").forEach((card) => {
            card.classList.remove("selected");
          });
        }
        option.classList.add("selected");
      }

      const scanButton = event.target.closest("#scanBtn");
      if (scanButton) {
        const upload = root.getElementById("uploadZone");
        const result = root.getElementById("result");
        if (upload && result) {
          upload.style.display = "none";
          result.style.display = "block";
          scanButton.style.display = "none";
        }
      }

      const uploadZone = event.target.closest("#uploadZone");
      if (uploadZone && root.getElementById("scanBtn")) {
        const scan = root.getElementById("scanBtn");
        if (scan.style.display !== "none") scan.click();
      }

      const startButton = event.target.closest("#startBtn");
      if (startButton) {
        startButton.textContent = "✓ Done";
        startButton.classList.remove("btn-primary");
        startButton.classList.add("btn-secondary");
        const feedback = root.getElementById("feedback");
        if (feedback) feedback.style.display = "block";
      }

      const anchor = event.target.closest('a[href^="#"]');
      if (anchor) {
        const href = anchor.getAttribute("href");
        if (!href || href === "#") {
          event.preventDefault();
          return;
        }
        const target = root.querySelector(href);
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };

    const onScroll = () => {
      const navbar = root.querySelector(".navbar");
      if (navbar) navbar.classList.toggle("navbar-scrolled", window.scrollY > 12);
    };

    root.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const items = root.querySelectorAll(".fade-in");
    let observer;

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
      );

      items.forEach((item) => observer.observe(item));
    } else {
      items.forEach((item) => item.classList.add("is-visible"));
    }

    return () => {
      root.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
      document.body.classList.remove("scroll-reveal-ready");
    };
  }, []);

  return null;
}
