(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- toggle de tema ---------- */
  var toggle = document.getElementById("theme-toggle");
  toggle.addEventListener("click", function () {
    var next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) { /* almacenamiento no disponible */ }
  });

  /* ---------- menú móvil ---------- */
  var header = document.querySelector("header.site");
  var menuBtn = document.getElementById("menu-btn");
  function closeMenu() {
    header.classList.remove("nav-open");
    menuBtn.setAttribute("aria-expanded", "false");
  }
  menuBtn.addEventListener("click", function () {
    var open = header.classList.toggle("nav-open");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  menuBtn.addEventListener("keydown", function (ev) {
    if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); menuBtn.click(); }
  });
  document.querySelectorAll("nav.main a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });

  /* ---------- reveal al entrar en viewport ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduced) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); ro.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { ro.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- sección activa en nav ---------- */
  var links = {};
  document.querySelectorAll("nav.main a").forEach(function (a) {
    links[a.getAttribute("href").slice(1)] = a;
  });
  var sections = ["perfil", "experiencia", "stack", "formacion", "contacto"]
    .map(function (id) { return document.getElementById(id); });
  if ("IntersectionObserver" in window) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          Object.keys(links).forEach(function (k) { links[k].classList.remove("active"); });
          var link = links[en.target.id];
          if (link) link.classList.add("active");
        }
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(function (s) { if (s) so.observe(s); });
  }

  /* ---------- typewriter del hero ---------- */
  var out = document.getElementById("hero-out");
  var LINES = [
    { kind: "cmd",  text: "whoami" },
    { kind: "strong", text: "bryan — full-stack developer" },
    { kind: "out",  text: "5+ años · sistemas de negocio en producción · Perú" },
    { kind: "cmd",  text: "cat enfoque.txt" },
    { kind: "out",  text: "> backend  · Spring Boot (Java) · Laravel (PHP)" },
    { kind: "out",  text: "> frontend · Vue 3 · Nuxt 3 · TypeScript" },
    { kind: "out",  text: "> mobile   · Android (Kotlin, Jetpack Compose)" },
    { kind: "out",  text: "> infra    · Docker · GitLab CI/CD · DigitalOcean" },
    { kind: "cmd",  text: "grep -h sector /cv/experiencia" },
    { kind: "out",  text: "> banca · retail · gastronomía — 5+ años, Perú" }
  ];

  function makeLine(def) {
    var ln = document.createElement("span");
    ln.className = "ln";
    if (def.kind === "cmd") {
      var pr = document.createElement("span");
      pr.className = "prompt";
      pr.textContent = "$ ";
      ln.appendChild(pr);
      var c = document.createElement("span");
      c.className = "cmd";
      ln.appendChild(c);
      ln._typed = c;
    } else {
      var s = document.createElement("span");
      s.className = def.kind === "strong" ? "out-strong" : "out";
      if (def.kind === "out" && def.text.charAt(0) === ">") {
        var a = document.createElement("span");
        a.className = "arrow";
        a.textContent = ">";
        s.textContent = def.text.slice(1);
        s.insertBefore(a, s.firstChild);
      } else {
        s.textContent = def.text;
      }
      ln.appendChild(s);
      ln._typed = s;
    }
    return ln;
  }

  function finalRender() {
    LINES.forEach(function (def) { out.appendChild(makeLine(def)); });
    var cur = document.createElement("span");
    cur.className = "cursor";
    cur.setAttribute("aria-hidden", "true");
    out.lastChild.appendChild(cur);
  }

  if (reduced) {
    finalRender();
  } else {
    var li = 0;
    function typeLine() {
      if (li >= LINES.length) {
        var cur = document.createElement("span");
        cur.className = "cursor";
        cur.setAttribute("aria-hidden", "true");
        out.lastChild.appendChild(cur);
        return;
      }
      var def = LINES[li];
      var ln = makeLine(def);
      out.appendChild(ln);
      var target = ln._typed;
      var full = def.text;
      target.textContent = "";
      var i = 0;
      var speed = def.kind === "cmd" ? 46 : 24;
      (function step() {
        if (i < full.length) {
          i += 1;
          target.textContent = full.slice(0, i);
          setTimeout(step, speed + Math.random() * 26);
        } else {
          li += 1;
          setTimeout(typeLine, def.kind === "cmd" ? 260 : 120);
        }
      })();
    }
    setTimeout(typeLine, 450);
  }
})();
