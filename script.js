/**
 * Euhana Explains Mentorship Program — Interactive Logic & Dynamic Calculator
 * Creator: Sarkar Erfan Uhana (IISER Kolkata MS23)
 */

document.addEventListener('DOMContentLoaded', () => {
  initSubjectCalculator();
  initFAQAccordion();
  initMobileMenu();
  initNavbarScroll();
});

// State for Silver Plan subjects
const state = {
  silverSubjects: ['Physics', 'Chemistry', 'Biology'],
  currentModalPlan: 'Silver',
};

/**
 * 1. Dynamic Subject Calculator for Silver Plan
 * Pricing logic:
 * 1 Subject: ₹99 (old ₹149)
 * 2 Subjects: ₹179 (old ₹249)
 * 3 Subjects: ₹249 (old ₹399)
 */
function initSubjectCalculator() {
  const chkPhysics = document.getElementById('chkPhysics');
  const chkChemistry = document.getElementById('chkChemistry');
  const chkBiology = document.getElementById('chkBiology');

  const pillPhysics = document.getElementById('pillPhysics');
  const pillChemistry = document.getElementById('pillChemistry');
  const pillBiology = document.getElementById('pillBiology');

  const silverPrice = document.getElementById('silverPrice');
  const silverOldPrice = document.getElementById('silverOldPrice');
  const silverDiscountTag = document.getElementById('silverDiscountTag');
  const silverSummaryText = document.getElementById('silverSummaryText');

  function updatePricing() {
    const selected = [];
    if (chkPhysics && chkPhysics.checked) selected.push('Physics');
    if (chkChemistry && chkChemistry.checked) selected.push('Chemistry');
    if (chkBiology && chkBiology.checked) selected.push('Biology');

    // Prevent zero selection: if none selected, re-check the clicked one or default to Physics
    if (selected.length === 0) {
      chkPhysics.checked = true;
      selected.push('Physics');
    }

    // Update active pill classes
    if (pillPhysics) pillPhysics.classList.toggle('active', chkPhysics.checked);
    if (pillChemistry) pillChemistry.classList.toggle('active', chkChemistry.checked);
    if (pillBiology) pillBiology.classList.toggle('active', chkBiology.checked);

    state.silverSubjects = selected;

    // Calculate prices based on count
    let price = '₹249';
    let oldPrice = '₹399';
    let discountTag = 'All 3 Subjects Combo Deal (Save 37%)';

    if (selected.length === 1) {
      price = '₹99';
      oldPrice = '₹149';
      discountTag = 'Single Subject Plan (Save 33%)';
    } else if (selected.length === 2) {
      price = '₹179';
      oldPrice = '₹249';
      discountTag = '2-Subject Combo Deal (Save 28%)';
    } else if (selected.length === 3) {
      price = '₹249';
      oldPrice = '₹399';
      discountTag = 'All 3 Subjects Combo Deal (Save 37%)';
    }

    if (silverPrice) silverPrice.textContent = price;
    if (silverOldPrice) silverOldPrice.textContent = oldPrice;
    if (silverDiscountTag) silverDiscountTag.textContent = discountTag;
    if (silverSummaryText) silverSummaryText.textContent = selected.join(' + ');
  }

  // Attach change listeners
  [chkPhysics, chkChemistry, chkBiology].forEach((chk) => {
    if (chk) {
      chk.addEventListener('change', updatePricing);
    }
  });

  // Initial calculation
  updatePricing();
}

// State & Configuration for Razorpay buttons
const RAZORPAY_BUTTONS = {
  'Physics': 'pl_TSUI8YBSclcQCq', // Physics only (₹99)
  'Chemistry': 'pl_TSUMVJsZGF29E9', // Chemistry only (₹99)
  'Biology': 'pl_TSUPdKik0zbRju', // Biology only (₹99)
  'Physics, Chemistry': 'pl_TSUSPAUjYXYiQP', // Phy + Chem combo (₹179)
  'Chemistry, Physics': 'pl_TSUSPAUjYXYiQP', // Phy + Chem combo (₹179)
  'Physics, Biology': 'pl_TSUWPcv6lU6j10', // Phy + Bio combo (₹179)
  'Biology, Physics': 'pl_TSUWPcv6lU6j10', // Phy + Bio combo (₹179)
  'Chemistry, Biology': 'pl_TSUUesDdj6TNom', // Chem + Bio combo (₹179)
  'Biology, Chemistry': 'pl_TSUUesDdj6TNom', // Chem + Bio combo (₹179)
  'Physics, Chemistry, Biology': 'pl_TSUZLXgFgE76tG', // All 3 subjects combo (₹249)
  'Gold': 'pl_TSUcUq7F06nbpP', // Gold Plan (₹499)
  'Diamond': 'pl_TSUdFYdtw4TGAK' // Diamond Plan (₹999)
};

function renderRazorpayButton(container, buttonId, label = 'Instant Online Payment') {
  if (!container) return;
  container.innerHTML = '';

  const wrapper = document.getElementById('razorpayContainer');
  const badge = wrapper ? wrapper.querySelector('.instant-badge') : null;

  if (buttonId) {
    if (wrapper) wrapper.style.display = 'block';
    if (badge) badge.innerHTML = `<i data-lucide="zap" class="icon-xs"></i> ${label}`;

    const form = document.createElement('form');
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
    script.setAttribute('data-payment_button_id', buttonId);
    script.async = true;
    form.appendChild(script);
    container.appendChild(form);
  } else {
    // If specific button ID is not configured yet, hide container or offer direct WhatsApp gateway
    if (wrapper) wrapper.style.display = 'none';
  }

  if (window.lucide) {
    lucide.createIcons();
  }
}

/**
 * 2. Enrollment Modal & Online Checkout
 */
function openEnrollmentModal(planType) {
  state.currentModalPlan = planType;
  const modal = document.getElementById('enrollmentModal');
  const modalPlanBadge = document.getElementById('modalPlanBadge');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const summaryPlanName = document.getElementById('summaryPlanName');
  const summarySubjectsRow = document.getElementById('summarySubjectsRow');
  const summarySubjectsList = document.getElementById('summarySubjectsList');
  const summaryTotalAmount = document.getElementById('summaryTotalAmount');
  const razorpayFormHolder = document.getElementById('razorpayFormHolder');

  let planName = 'Silver Plan';
  let totalAmount = '₹249 / month';
  let subjects = state.silverSubjects.join(', ');
  let activeRazorpayId = '';
  let activeLabel = 'Instant Online Payment';

  if (planType === 'Silver') {
    planName = 'Silver Plan';
    modalPlanBadge.textContent = 'Silver Plan';
    modalPlanBadge.style.color = '#60a5fa';
    modalPlanBadge.style.borderColor = 'rgba(37, 99, 235, 0.3)';

    if (state.silverSubjects.length === 1) {
      totalAmount = '₹99 / month';
      const singleSubject = state.silverSubjects[0];
      activeRazorpayId = RAZORPAY_BUTTONS[singleSubject] || '';
      activeLabel = `Instant Online Payment (${singleSubject} Only)`;
    } else if (state.silverSubjects.length === 2) {
      totalAmount = '₹179 / month';
      const comboKey = [...state.silverSubjects].sort().join(', ');
      activeRazorpayId = RAZORPAY_BUTTONS[comboKey] || RAZORPAY_BUTTONS[subjects] || '';
      activeLabel = 'Instant Online Payment (2 Subjects Combo)';
    } else {
      totalAmount = '₹249 / month';
      activeRazorpayId = RAZORPAY_BUTTONS['Physics, Chemistry, Biology'] || RAZORPAY_BUTTONS['All 3'] || '';
      activeLabel = 'Instant Online Payment (All 3 Subjects Combo)';
    }

    summarySubjectsRow.style.display = 'flex';
    summarySubjectsList.textContent = subjects;
    modalSubtitle.textContent = `Selected subjects: ${subjects}`;
  } else if (planType === 'Gold') {
    planName = 'Gold Plan (Bi-Weekly Meets + Parent Reports)';
    modalPlanBadge.textContent = 'Gold Plan';
    modalPlanBadge.style.color = '#fbbf24';
    modalPlanBadge.style.borderColor = 'rgba(245, 158, 11, 0.4)';

    totalAmount = '₹499 / month';
    activeRazorpayId = RAZORPAY_BUTTONS['Gold'] || '';
    activeLabel = 'Instant Online Payment (Gold Plan)';

    summarySubjectsRow.style.display = 'flex';
    summarySubjectsList.textContent = 'All Subjects (Physics + Chemistry + Biology)';
    modalSubtitle.textContent = 'Includes 2x Google Meets/week + Parent Reports';
  } else if (planType === 'Diamond') {
    planName = 'Diamond Plan (Daily 1-on-1 Call & Adaptive Strategy)';
    modalPlanBadge.textContent = 'Diamond Plan';
    modalPlanBadge.style.color = '#22d3ee';
    modalPlanBadge.style.borderColor = 'rgba(6, 182, 212, 0.4)';

    totalAmount = '₹999 / month';
    activeRazorpayId = RAZORPAY_BUTTONS['Diamond'] || '';
    activeLabel = 'Instant Online Payment (Diamond Plan)';

    summarySubjectsRow.style.display = 'flex';
    summarySubjectsList.textContent = 'Complete All-Subject 1-on-1 Mentorship';
    modalSubtitle.textContent = 'Includes Daily 1-on-1 Personal Calling & Daily Audits';
  }

  summaryPlanName.textContent = planName;
  summaryTotalAmount.textContent = totalAmount;

  // Render Razorpay button dynamically
  renderRazorpayButton(razorpayFormHolder, activeRazorpayId, activeLabel);

  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeEnrollmentModal() {
  const modal = document.getElementById('enrollmentModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Close modal when clicking outside card
window.addEventListener('click', (e) => {
  const modal = document.getElementById('enrollmentModal');
  if (e.target === modal) {
    closeEnrollmentModal();
  }
});

// Close modal on Escape key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeEnrollmentModal();
  }
});

/**
 * 3. FAQ Accordion Logic
 */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other accordions for clean accordion UX
        faqItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove('active');
            other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            other.querySelector('.faq-answer').style.maxHeight = null;
          }
        });

        if (!isActive) {
          item.classList.add('active');
          questionBtn.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
        } else {
          item.classList.remove('active');
          questionBtn.setAttribute('aria-expanded', 'false');
          answer.style.maxHeight = null;
        }
      });
    }
  });
}

/**
 * 4. Mobile Menu Toggle
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const iconOpen = document.getElementById('navIconOpen');
  const iconClose = document.getElementById('navIconClose');

  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('active');
      if (iconOpen) iconOpen.classList.toggle('hidden', isOpen);
      if (iconClose) iconClose.classList.toggle('hidden', !isOpen);
    });

    // Close menu when clicking on mobile links
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-link, .btn');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        if (iconOpen) iconOpen.classList.remove('hidden');
        if (iconClose) iconClose.classList.add('hidden');
      });
    });
  }
}

/**
 * 5. Navbar Sticky Blur Effect
 */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
        navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.12)';
      } else {
        navbar.style.boxShadow = 'none';
        navbar.style.borderBottomColor = 'var(--border-subtle)';
      }
    });
  }
}
