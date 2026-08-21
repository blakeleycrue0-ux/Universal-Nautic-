/* Universal Nautic — minimal, dependency-free interaction layer. */

(function () {
  "use strict";

  /* Header: solid once the page has scrolled past the hero. */
  var header = document.querySelector(".site-header");
  if (header) {
    var threshold = 64;
    var setHeaderState = function () {
      if (window.scrollY > threshold) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    };
    setHeaderState();
    window.addEventListener("scroll", setHeaderState, { passive: true });
  }

  /* Mobile navigation. */
  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".nav-mobile");
  if (toggle && mobileNav) {
    var closeNav = function () {
      toggle.setAttribute("aria-expanded", "false");
      mobileNav.classList.remove("is-open");
      document.body.style.overflow = "";
    };
    var openNav = function () {
      toggle.setAttribute("aria-expanded", "true");
      mobileNav.classList.add("is-open");
      document.body.style.overflow = "hidden";
    };
    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      if (expanded) { closeNav(); } else { openNav(); }
    });
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { closeNav(); }
    });
  }

  /* Gentle reveal-on-scroll for elements marked .reveal. */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Contact form: static-hosting-friendly submit handler.
     Replace the fetch endpoint with the real form backend when connected. */
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      var submitBtn = form.querySelector("button[type='submit']");

      /* No backend connected yet — action is a placeholder. */
      if (!form.action || form.action.indexOf("#") !== -1 || form.getAttribute("action") === "#") {
        if (status) {
          status.textContent = "This form is not yet connected. Please email us directly in the meantime.";
        }
        return;
      }

      if (submitBtn) { submitBtn.disabled = true; }
      if (status) { status.textContent = "Sending…"; }

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            if (status) { status.textContent = "Thank you — we will be in touch shortly."; }
          } else {
            if (status) { status.textContent = "Something went wrong. Please email us directly."; }
          }
        })
        .catch(function () {
          if (status) { status.textContent = "Something went wrong. Please email us directly."; }
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; }
        });
    });
  }
})();
