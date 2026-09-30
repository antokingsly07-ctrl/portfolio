// Mobile nav, active link highlighting, reveal on scroll, contact mailto fallback
(function(){
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');
  if(hamburger && navLinks){
    hamburger.addEventListener('click', function(){
      var open = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    navLinks.addEventListener('click', function(e){
      if(e.target.closest('a')){ navLinks.classList.remove('open'); hamburger.setAttribute('aria-expanded','false'); }
    });
  }

  // Active section highlight
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var map = {};
  links.forEach(function(a){ map[a.getAttribute('href').slice(1)] = a; });
  if('IntersectionObserver' in window){
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting && map[en.target.id]){
          links.forEach(function(a){ a.classList.remove('active'); });
          map[en.target.id].classList.add('active');
        }
      });
    }, {rootMargin:'-40% 0px -55% 0px'});
    Object.keys(map).forEach(function(id){ var s=document.getElementById(id); if(s) obs.observe(s); });
  }

  // Reveal on scroll
  var reveals = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var ro = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('visible'); ro.unobserve(en.target); } });
    }, {threshold:0.08});
    reveals.forEach(function(r){ ro.observe(r); });
  } else {
    reveals.forEach(function(r){ r.classList.add('visible'); });
  }

  // LinkedIn placeholder notice
  document.querySelectorAll('[data-linkedin-placeholder]').forEach(function(a){
    a.addEventListener('click', function(e){
      if(a.getAttribute('href') === '#'){
        e.preventDefault();
        alert('Add your LinkedIn URL: open index.html and replace the data-linkedin-placeholder links.');
      }
    });
  });

  // Disabled placeholder buttons
  document.querySelectorAll('.btn-disabled').forEach(function(b){
    b.addEventListener('click', function(e){ e.preventDefault(); });
  });
})();

/* Scroll progress, nav state, back-to-top, staggered reveals, card spotlight */
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var bar = document.getElementById('progress');
  var nav = document.getElementById('topnav');
  var toTop = document.getElementById('toTop');
  var ticking = false;
  function onScroll(){
    var y = window.scrollY || document.documentElement.scrollTop;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if(bar) bar.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    if(nav) nav.classList.toggle('scrolled', y > 10);
    if(toTop) toTop.classList.toggle('show', y > 600);
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if(!ticking){ requestAnimationFrame(onScroll); ticking = true; }
  }, {passive:true});
  onScroll();
  if(toTop) toTop.addEventListener('click', function(){
    window.scrollTo({top:0, behavior: reduce ? 'auto' : 'smooth'});
  });

  // Staggered reveal for cards (skipped when reduced motion is preferred)
  if('IntersectionObserver' in window && !reduce){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          var el = en.target;
          el.classList.add('in');
          io.unobserve(el);
          // After the entrance finishes, hand transitions back to the card's own hover styles
          setTimeout(function(){
            el.classList.remove('rv');
            el.classList.remove('in');
            el.style.transitionDelay = '';
          }, parseInt(el.getAttribute('data-rv-delay') || '0', 10) + 650);
        }
      });
    }, {threshold:0.1});
    var groups = document.querySelectorAll('.projects-grid,.skills-grid,.two-col,.info-cards,.cert-grid,.timeline');
    groups.forEach(function(g){
      Array.prototype.forEach.call(g.children, function(child, i){
        var d = (i % 6) * 70;
        child.classList.add('rv');
        child.style.transitionDelay = d + 'ms';
        child.setAttribute('data-rv-delay', d);
        io.observe(child);
      });
    });
  }

  // Spotlight follows cursor on project cards (fine pointers only)
  if(!reduce && window.matchMedia('(pointer: fine)').matches){
    document.querySelectorAll('.project-card').forEach(function(card){
      card.addEventListener('mousemove', function(e){
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }
})();
