/* ==========================================================================
   NARAYANI RESORT AND AGRO TOURISM - JAVASCRIPT LOGIC & INTERACTIONS
   Helpline: 7058012788
   Location: Near Alandi Dam, Girnare, Nashik
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initHeaderScroll();
  initMobileMenu();
  initDefaultDates();
  calculatePrice();
  initScrollTop();
});

/* --------------------------------------------------------------------------
   1. HERO BACKGROUND CROSS-FADE SLIDER
   -------------------------------------------------------------------------- */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;

  let currentSlide = 0;
  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 5000);
}

/* --------------------------------------------------------------------------
   2. STICKY HEADER & ACTIVE NAV SCROLL-SPY
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Header shadow
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll spy
    let currentId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. MOBILE NAVIGATION DRAWER
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    toggleBtn.classList.toggle('open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      toggleBtn.classList.remove('open');
    });
  });
}

/* --------------------------------------------------------------------------
   4. DEFAULT DATES SETTING (Today & Tomorrow)
   -------------------------------------------------------------------------- */
function initDefaultDates() {
  const checkinInput = document.getElementById('calc-checkin');
  const checkoutInput = document.getElementById('calc-checkout');
  const bdayDateInput = document.getElementById('bday-date');

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const todayStr = formatDate(today);
  const tomorrowStr = formatDate(tomorrow);

  if (checkinInput) {
    checkinInput.min = todayStr;
    checkinInput.value = todayStr;
  }
  if (checkoutInput) {
    checkoutInput.min = todayStr;
    checkoutInput.value = tomorrowStr;
  }
  if (bdayDateInput) {
    bdayDateInput.min = todayStr;
    bdayDateInput.value = todayStr;
  }
}

/* --------------------------------------------------------------------------
   5. CELEBRATION IMAGE SWITCHER
   -------------------------------------------------------------------------- */
function switchCelebrationImage(imgSrc, title, desc) {
  const mainImg = document.getElementById('celebration-active-img');
  const titleElem = document.querySelector('.celebration-img-overlay h3');
  const descElem = document.querySelector('.celebration-img-overlay p');
  const thumbs = document.querySelectorAll('.celebration-thumbs .thumb-card');

  if (mainImg) {
    mainImg.style.opacity = '0.4';
    setTimeout(() => {
      mainImg.src = imgSrc;
      mainImg.style.opacity = '1';
    }, 150);
  }
  if (titleElem) titleElem.textContent = title;
  if (descElem) descElem.textContent = desc;

  thumbs.forEach(t => t.classList.remove('active'));
  // Find which thumb matches
  thumbs.forEach(t => {
    const imgInThumb = t.querySelector('img');
    if (imgInThumb && imgInThumb.src.includes(imgSrc.split('/').pop())) {
      t.classList.add('active');
    }
  });
}

/* --------------------------------------------------------------------------
   6. GUEST COUNTER CONTROLS
   -------------------------------------------------------------------------- */
function adjustCount(elementId, change) {
  const input = document.getElementById(elementId);
  if (!input) return;

  let val = parseInt(input.value) || 0;
  const min = parseInt(input.min) || 0;
  const max = parseInt(input.max) || 200;

  val += change;
  if (val < min) val = min;
  if (val > max) val = max;

  input.value = val;
  calculatePrice();
}

/* --------------------------------------------------------------------------
   7. INTERACTIVE BOOKING ESTIMATOR & RATE CALCULATOR
   -------------------------------------------------------------------------- */
function calculatePrice() {
  const reasonElem = document.getElementById('calc-reason');
  const adultsElem = document.getElementById('calc-adults');
  const kidsElem = document.getElementById('calc-kids');
  const totalElem = document.getElementById('calculated-total');
  const breakdownElem = document.getElementById('quote-breakdown');

  if (!reasonElem || !adultsElem || !kidsElem || !totalElem) return;

  const reason = reasonElem.value;
  const adults = parseInt(adultsElem.value) || 1;
  const kids = parseInt(kidsElem.value) || 0;

  // Pricing Matrix (Per Person Base)
  let adultRate = 850;
  let kidRate = 450;
  let reasonLabel = "Birthday Celebration Package";

  switch (reason) {
    case 'birthday':
      adultRate = 850;
      kidRate = 450;
      reasonLabel = "🎂 Birthday Special (Pool + Lawn + Food)";
      break;
    case 'overnight':
      adultRate = 1450;
      kidRate = 750;
      reasonLabel = "🛏️ Overnight Cottage Stay & Full Meals";
      break;
    case 'day_picnic':
      adultRate = 650;
      kidRate = 350;
      reasonLabel = "☀️ One-Day Agro Picnic & Lunch";
      break;
    case 'pool_party':
      adultRate = 750;
      kidRate = 400;
      reasonLabel = "🏊 Pool Party & Evening Gathering";
      break;
    case 'family_event':
      adultRate = 900;
      kidRate = 450;
      reasonLabel = "👨‍👩‍👦‍👦 Family Reunion & Lawn Feast";
      break;
    case 'corporate':
      adultRate = 800;
      kidRate = 400;
      reasonLabel = "💼 Corporate Team Outing";
      break;
  }

  // Calculate base
  let total = (adults * adultRate) + (kids * kidRate);

  // Addons
  let addonsTotal = 0;
  const decorChecked = document.getElementById('addon-cake-decor')?.checked;
  const musicChecked = document.getElementById('addon-dj-music')?.checked;
  const bbqChecked = document.getElementById('addon-bbq')?.checked;
  const bonfireChecked = document.getElementById('addon-bonfire')?.checked;

  if (decorChecked) addonsTotal += 999; // Balloon & Gazebo setup
  if (musicChecked) addonsTotal += 600; // Party Sound System
  if (bbqChecked) addonsTotal += (adults * 250); // Live Barbecue starters
  if (bonfireChecked) addonsTotal += 500; // Campfire setup

  total += addonsTotal;

  // Format Total in INR
  totalElem.textContent = `₹${total.toLocaleString('en-IN')}`;

  if (breakdownElem) {
    breakdownElem.innerHTML = `
      <strong>${reasonLabel}</strong> for ${adults} Adults, ${kids} Kids.
      ${addonsTotal > 0 ? `Includes ₹${addonsTotal.toLocaleString('en-IN')} in chosen party add-ons.` : 'Includes pool access, meals & estate amenities.'}
    `;
  }
}

/* --------------------------------------------------------------------------
   8. WHATSAPP BOOKING SUBMISSION (Direct to 7058012788)
   -------------------------------------------------------------------------- */
function submitBookingToWhatsApp() {
  const name = document.getElementById('guest-name').value.trim();
  const phone = document.getElementById('guest-phone').value.trim();
  const reasonText = document.getElementById('calc-reason').options[document.getElementById('calc-reason').selectedIndex].text;
  const checkin = document.getElementById('calc-checkin').value;
  const checkout = document.getElementById('calc-checkout').value;
  const adults = document.getElementById('calc-adults').value;
  const kids = document.getElementById('calc-kids').value;
  const total = document.getElementById('calculated-total').textContent;

  // Addons selected
  const addons = [];
  if (document.getElementById('addon-cake-decor')?.checked) addons.push("🎂 Birthday Decor");
  if (document.getElementById('addon-dj-music')?.checked) addons.push("🎶 Sound System");
  if (document.getElementById('addon-bbq')?.checked) addons.push("🍢 Live BBQ");
  if (document.getElementById('addon-bonfire')?.checked) addons.push("🔥 Bonfire");

  const addonsStr = addons.length ? addons.join(", ") : "Standard Package";

  const message = 
`*NEW RESORT BOOKING INQUIRY - NARAYANI RESORT*
---------------------------------------
👤 *Guest Name:* ${name}
📞 *Guest Phone:* ${phone}
🎉 *Occasion/Reason:* ${reasonText}
📅 *Check-In Date:* ${checkin}
📅 *Check-Out Date:* ${checkout}
👥 *Guests:* ${adults} Adults | ${kids} Children
✨ *Add-Ons:* ${addonsStr}
💰 *Estimated Budget:* ${total}
📍 *Location:* Narayani Resort, near Alandi Dam, Girnare, Nashik
---------------------------------------
Hello Narayani Resort manager, please confirm the cottage & lawn availability for these dates!`;

  const encodedMsg = encodeURIComponent(message);
  const waUrl = `https://wa.me/917058012788?text=${encodedMsg}`;

  window.open(waUrl, '_blank');
}

/* --------------------------------------------------------------------------
   9. BIRTHDAY SPECIAL INQUIRY MODAL LOGIC
   -------------------------------------------------------------------------- */
function openCelebrationModal() {
  const modal = document.getElementById('celebrationModal');
  if (modal) modal.classList.add('active');
}

function closeCelebrationModal() {
  const modal = document.getElementById('celebrationModal');
  if (modal) modal.classList.remove('active');
}

function submitBirthdayInquiry() {
  const bdayName = document.getElementById('bday-name').value.trim();
  const bdayDate = document.getElementById('bday-date').value;
  const bdayGuests = document.getElementById('bday-guests').value;
  const bdaySlot = document.getElementById('bday-slot').value;
  const bdayPhone = document.getElementById('bday-phone').value.trim();

  const msg = 
`*🎂 BIRTHDAY PARTY CELEBRATION INQUIRY*
---------------------------------------
🎉 *Celebrator Name:* ${bdayName}
📅 *Event Date:* ${bdayDate}
⏰ *Time Slot:* ${bdaySlot}
👥 *Estimated Guests:* ${bdayGuests} Persons
📞 *Contact Phone:* ${bdayPhone}
📍 *Location:* Narayani Resort & Agro Tourism, Alandi Dam, Girnare, Nashik
---------------------------------------
Hello Manager, I would like to organize this birthday celebration at Narayani Resort. Please share details on decoration, menu options, pool party, and package quote!`;

  const waUrl = `https://wa.me/917058012788?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');
  closeCelebrationModal();
}

/* --------------------------------------------------------------------------
   10. PHOTO GALLERY FILTERING
   -------------------------------------------------------------------------- */
function filterGallery(category) {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  items.forEach(item => {
    const itemCat = item.getAttribute('data-category');
    if (category === 'all' || itemCat === category) {
      item.style.display = 'block';
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
      }, 50);
    } else {
      item.style.opacity = '0';
      item.style.transform = 'scale(0.95)';
      setTimeout(() => {
        item.style.display = 'none';
      }, 300);
    }
  });
}

/* --------------------------------------------------------------------------
   11. LIGHTBOX MODAL
   -------------------------------------------------------------------------- */
function openLightbox(imgSrc, captionText) {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImage');
  const caption = document.getElementById('lightboxCaption');

  if (modal && img) {
    img.src = imgSrc;
    if (caption) caption.textContent = captionText;
    modal.classList.add('active');
  }
}

function closeLightbox(event) {
  if (event.target.id === 'lightboxModal') {
    closeLightboxDirect();
  }
}

function closeLightboxDirect() {
  const modal = document.getElementById('lightboxModal');
  if (modal) modal.classList.remove('active');
}

// Close on Escape Key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightboxDirect();
    closeCelebrationModal();
  }
});

/* --------------------------------------------------------------------------
   12. FAQ ACCORDION TOGGLE
   -------------------------------------------------------------------------- */
function toggleFaq(btn) {
  const currentItem = btn.parentElement;
  const allItems = document.querySelectorAll('.faq-item');

  allItems.forEach(item => {
    if (item !== currentItem) {
      item.classList.remove('active');
    }
  });

  currentItem.classList.toggle('active');
}

/* --------------------------------------------------------------------------
   13. SCROLL TO TOP
   -------------------------------------------------------------------------- */
function initScrollTop() {
  const scrollBtn = document.getElementById('scrollTopBtn');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollBtn.classList.add('show');
    } else {
      scrollBtn.classList.remove('show');
    }
  });
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}
