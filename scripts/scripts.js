/* WRITE YOUR JS HERE... YOU MAY REQUIRE MORE THAN ONE JS FILE. IF SO SAVE IT SEPARATELY IN THE SCRIPTS DIRECTORY */

const speciesButtons = document.querySelectorAll('.species');

speciesButtons.forEach(button => {
  button.addEventListener('click', function() {
    const popupId = this.getAttribute('data-popup');
    showPopup(popupId);
  });
});

function showPopup(popupId) {
  const popup = document.getElementById(popupId);
  if (popup) {
    popup.style.display = 'block';
  }
}

function hidePopup(popupId) {
  const popup = document.getElementById(popupId);
  if (popup) {
    popup.style.display = 'none';
  }
}

// Add event listeners for close buttons
const closeButtons = document.querySelectorAll('.close-popup');
closeButtons.forEach(button => {
  button.addEventListener('click', function() {
    const popup = this.closest('.popup-background');
    if (popup) {
      popup.style.display = 'none';
    }
  });
});

// Depth counter functionality
const depthDisplay = document.getElementById('depth-display');
const zones = [
  { id: 'sunlit', minDepth: 0, maxDepth: 200 },
  { id: 'twilight', minDepth: 200, maxDepth: 1000 },
  { id: 'midnight', minDepth: 1000, maxDepth: 4000 },
  { id: 'abyssal', minDepth: 4000, maxDepth: 6000 },
  { id: 'hadal', minDepth: 6000, maxDepth: 11000 }
];

const scrollButtons = document.querySelectorAll('.scroll-button');

let targetDepth = 0;
let displayedDepth = 0;
let animationFrame = null;

function computeDepth() {
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  const viewportCenter = scrollY + viewportHeight / 2;
  
  let depth = 0;
  let activeZone = null;
  
  for (const zone of zones) {
    const section = document.getElementById(zone.id);
    if (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionBottom = sectionTop + sectionHeight;
      
      if (viewportCenter >= sectionTop && viewportCenter < sectionBottom) {
        const progress = (viewportCenter - sectionTop) / sectionHeight;
        depth = zone.minDepth + (zone.maxDepth - zone.minDepth) * progress;
        activeZone = zone.id;
        break;
      }
    }
  }

  targetDepth = Math.round(depth);
  updateScrollButtons(activeZone);
}

function updateScrollButtons(activeZoneId) {
  if (!scrollButtons.length) return;

  scrollButtons.forEach(button => {
    const targetId = button.getAttribute('href')?.slice(1);
    button.classList.toggle('active', targetId === activeZoneId);
  });
}

function renderDepth() {
  if (!depthDisplay) return;

  const delta = targetDepth - displayedDepth;
  if (Math.abs(delta) < 0.5) {
    displayedDepth = targetDepth;
    depthDisplay.textContent = `${displayedDepth}m`;
    animationFrame = null;
    return;
  }

  displayedDepth += delta * 0.18;
  depthDisplay.textContent = `${Math.round(displayedDepth)}m`;
  animationFrame = requestAnimationFrame(renderDepth);
}

function scheduleDepthUpdate() {
  computeDepth();
  if (!animationFrame) {
    animationFrame = requestAnimationFrame(renderDepth);
  }
}

window.addEventListener('scroll', scheduleDepthUpdate);
window.addEventListener('resize', scheduleDepthUpdate);

// Depth counter drawer toggle
const depthToggleBtn = document.getElementById('depth-toggle-btn');
const depthCounter = document.querySelector('.depth-counter');

if (depthToggleBtn && depthCounter) {
  depthToggleBtn.addEventListener('click', function() {
    depthCounter.classList.toggle('open');
  });
}
scheduleDepthUpdate(); // initial call
