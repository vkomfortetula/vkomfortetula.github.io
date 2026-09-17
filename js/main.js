/**
 * Строительная компания «Вкомфорте» (г. Плавск)
 * Interactive UI & Calculator Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCalculator();
  initPortfolioFilter();
  initModals();
  initForms();
});

/* ==========================================================================
   1. Navigation & Mobile Menu
   ========================================================================== */
function initNavigation() {
  const burgerBtn = document.getElementById('burger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');

  if (burgerBtn && navMenu) {
    burgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      burgerBtn.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        burgerBtn.classList.remove('active');
      });
    });
  }

  // Active link highlighting on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const activeNavLink = document.querySelector(`.nav__list a[href*='${sectionId}']`);

      if (activeNavLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          activeNavLink.classList.add('active');
        } else {
          activeNavLink.classList.remove('active');
        }
      }
    });
  });
}

/* ==========================================================================
   2. Interactive Cost Calculator
   ========================================================================== */
function initCalculator() {
  const materialButtons = document.querySelectorAll('#calc-material .toggle-btn');
  const floorButtons = document.querySelectorAll('#calc-floors .toggle-btn');
  const areaSlider = document.getElementById('calc-area-range');
  const areaVal = document.getElementById('area-val');
  const packageRadios = document.querySelectorAll('input[name="package"]');

  const priceOutput = document.getElementById('calc-price-output');
  const sqmOutput = document.getElementById('calc-sqm-output');
  const periodOutput = document.getElementById('calc-period-output');

  let currentRate = 36000;      // Base rate for Aerated concrete
  let currentFloorMult = 1.0;   // 1 floor
  let currentArea = 120;        // 120 sq m
  let currentPackageAdd = 0;    // Warm contour (0 additional)

  function calculate() {
    // Price per square meter = (Base rate * Floor multiplier) + Package addition
    const pricePerSqm = Math.round((currentRate * currentFloorMult) + currentPackageAdd);
    const totalPrice = Math.round(pricePerSqm * currentArea);

    // Format numbers with space delimiter (e.g. 4 320 000)
    if (priceOutput) priceOutput.textContent = formatNumber(totalPrice);
    if (sqmOutput) sqmOutput.textContent = `${formatNumber(pricePerSqm)} ₽`;

    // Estimate duration based on area and technology
    if (periodOutput) {
      if (currentArea <= 100) {
        periodOutput.textContent = '2.5 - 3.5 месяца';
      } else if (currentArea <= 180) {
        periodOutput.textContent = '3.5 - 5 месяцев';
      } else {
        periodOutput.textContent = '5 - 7 месяцев';
      }
    }
  }

  // Material selection
  materialButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      materialButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentRate = parseFloat(btn.dataset.rate) || 36000;
      calculate();
    });
  });

  // Floor selection
  floorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      floorButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFloorMult = parseFloat(btn.dataset.mult) || 1.0;
      calculate();
    });
  });

  // Area slider
  if (areaSlider && areaVal) {
    areaSlider.addEventListener('input', (e) => {
      currentArea = parseInt(e.target.value, 10);
      areaVal.textContent = currentArea;
      calculate();
    });
  }

  // Package options
  packageRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      currentPackageAdd = parseFloat(radio.dataset.add) || 0;
      calculate();
    });
  });

  // Initial calculation
  calculate();
}

/* ==========================================================================
   3. Portfolio Filter & Project Details
   ========================================================================== */
const projectData = {
  '1': {
    title: 'Проект «Плавск Премиум»',
    area: '145 м²',
    material: 'Автоклавный газобетон Bonolit D400 400мм',
    foundation: 'Монолитная ж/б плита 300 мм с двойным армированием',
    roof: 'Металлочерепица Grand Line 0.5 мм с утеплением 200 мм Rockwool',
    floors: '1 этаж, высота потолков 3.0 м',
    rooms: '3 спальни, кухня-гостиная 42 м², 2 санузла, котельная, гардероб',
    price: 'от 5 220 000 ₽',
    desc: 'Просторный одноэтажный дом с продуманной планировкой для семьи из 4-5 человек. Большая крытая терраса с выходом из кухни-гостиной, панорамные окна в пол с энергосберегающими стеклопакетами.'
  },
  '2': {
    title: 'Коттедж «Усадьба»',
    area: '190 м²',
    material: 'Поризованный керамический блок Braer + облицовочный кирпич',
    foundation: 'Ленточный фундамент глубокого заложения на глубину промерзания',
    roof: 'Мягкая многослойная черепица Shinglas, водосточная система Docke',
    floors: '2 полных этажа, монолитные ж/б перекрытия',
    rooms: '4 спальни, мастер-спальня с ванной, кабинет, гараж с автоматическими воротами',
    price: 'от 7 980 000 ₽',
    desc: 'Респектабельный классический коттедж из премиальных керамических материалов. Обладает высочайшей звукоизоляцией и естественной терморегуляцией.'
  },
  '3': {
    title: 'Барнхаус «Комфорт 110»',
    area: '110 м²',
    material: 'Каркас из строганной доски камерной сушки 195 мм, пароизоляция Delta',
    foundation: 'Железобетонные забивные сваи 150х150 мм с обвязкой пакетом досок',
    roof: 'Кликфальц Pro 0.5 мм в трендовом цвете графит Ral 7024',
    floors: '1.5 этажа с лофтом / вторым светом над гостиной',
    rooms: '2 спальни, второй свет, антресоль для зоны отдыха, панорамная терраса 24 м²',
    price: 'от 3 190 000 ₽',
    desc: 'Стильный современный дом в скандинавском стиле барнхаус. Максимальное естественное освещение, высочайшая энергоэффективность (минимальные затраты на отопление зимой).'
  },
  '4': {
    title: 'Дом «Семейный Очаг»',
    area: '95 м²',
    material: 'Газобетон 375 мм + декоративная штукатурка короед и планкен',
    foundation: 'Утепленный ленточный фундамент со стяжкой по грунту',
    roof: 'Двускатная металлочерепица с водостоками',
    floors: '1 этаж, отсутствие лестниц (идеально для детей и пожилых)',
    rooms: '2 изолированные спальни, кухня-гостиная 28 м², санузел, тамбур',
    price: 'от 3 420 000 ₽',
    desc: 'Компактный и экономичный дом, в котором каждый квадратный метр используется с максимальной пользой. Отличная альтернатива городской 3-комнатной квартире в Плавске.'
  }
};

function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Project modal triggers
  const openProjectBtns = document.querySelectorAll('.open-project-btn');
  const projectModal = document.getElementById('project-modal');
  const projectModalContent = document.getElementById('project-modal-content');

  openProjectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = btn.dataset.project;
      const data = projectData[pid];
      if (!data) return;

      projectModalContent.innerHTML = `
        <div class="modal__header">
          <span class="badge badge--gold" style="margin-bottom: 8px;">${data.area}</span>
          <h3 class="modal__title">${data.title}</h3>
          <p class="modal__desc">${data.desc}</p>
        </div>
        <div style="display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 24px; font-size: 0.92rem;">
          <div>🧱 <strong>Стены:</strong> ${data.material}</div>
          <div>🏗️ <strong>Фундамент:</strong> ${data.foundation}</div>
          <div>🏠 <strong>Кровля:</strong> ${data.roof}</div>
          <div>📐 <strong>Этажность:</strong> ${data.floors}</div>
          <div>🚪 <strong>Помещения:</strong> ${data.rooms}</div>
          <div style="font-size: 1.3rem; font-weight: 800; color: var(--accent-gold); margin-top: 8px;">
            Ориентировочная стоимость: ${data.price}
          </div>
        </div>
        <button class="btn btn--primary btn--block open-modal-btn" data-modal="contact-modal" onclick="closeAllModals()">
          Заказать расчет этого проекта
        </button>
      `;

      projectModal.classList.add('active');
    });
  });
}

/* ==========================================================================
   4. Modals System
   ========================================================================== */
function initModals() {
  document.addEventListener('click', (e) => {
    // Open modal button
    const openBtn = e.target.closest('.open-modal-btn');
    if (openBtn) {
      const modalId = openBtn.dataset.modal;
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        targetModal.classList.add('active');
      }
    }

    // Close buttons or click outside
    if (e.target.dataset.close === 'modal') {
      closeAllModals();
    }
  });

  // ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });
}

function closeAllModals() {
  document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
}

/* ==========================================================================
   5. Form Handlers & Toast Notifications
   ========================================================================== */
function initForms() {
  const forms = [
    document.getElementById('calc-submit-form'),
    document.getElementById('contact-page-form'),
    document.getElementById('modal-form')
  ];

  forms.forEach(form => {
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Show friendly confirmation toast
      showToast('Спасибо за заявку! Наш инженер из г. Плавск свяжется с вами в течение 15 минут.');
      form.reset();
      closeAllModals();
    });
  });
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#10b981">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
