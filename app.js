/**
 * Application Controller for WAQTY Official Showcase
 * Manages 3D Scroll Engine, Interactive Tabs, ROI Calculator, and FAQ Accordion
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize 3D Scroll Engine
  let scene3D = null;
  try {
    scene3D = new Waqty3DScene('webgl-container');
    window.active3DScene = scene3D;
  } catch (err) {
    console.error('Notice on 3D initialization:', err);
  }

  // 2. Interactive Feature Tabs Switcher
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;

      // Update button styles
      tabButtons.forEach(b => {
        b.classList.remove('active', 'text-emerald-400');
        b.classList.add('text-slate-400');
      });
      btn.classList.add('active', 'text-emerald-400');
      btn.classList.remove('text-slate-400');

      // Show targeted tab content
      tabContents.forEach(content => {
        if (content.id === targetId) {
          content.classList.remove('hidden');
          content.classList.add('grid');
        } else {
          content.classList.add('hidden');
          content.classList.remove('grid');
        }
      });

      // Refresh icons if needed
      if (window.lucide) {
        lucide.createIcons();
      }
    });
  });

  // 3. Interactive ROI & Cost-Savings Calculator
  const branchesSlider = document.getElementById('branches-slider');
  const employeesSlider = document.getElementById('employees-slider');
  const branchesDisplay = document.getElementById('branches-val-display');
  const employeesDisplay = document.getElementById('employees-val-display');

  const traditionalCostEl = document.getElementById('calc-traditional-cost');
  const waqtyCostEl = document.getElementById('calc-waqty-cost');
  const totalSavingsEl = document.getElementById('calc-total-savings');
  const percentSavingsEl = document.getElementById('calc-percent-savings');

  function updateCalculator() {
    if (!branchesSlider || !employeesSlider) return;

    const branches = parseInt(branchesSlider.value, 10);
    const employees = parseInt(employeesSlider.value, 10);

    // Update Slider Labels
    branchesDisplay.textContent = branches === 1 ? 'فرع واحد' : branches === 2 ? 'فرعان' : `${branches} فروع`;
    employeesDisplay.textContent = `${employees} موظف`;

    // Calculations:
    // Traditional: ~8,000 EGP per device + ~2,000 EGP installation/wiring + ~2,000 EGP annual maintenance per branch
    const traditionalPerBranch = 12000;
    const traditionalTotal = branches * traditionalPerBranch;

    // WAQTY Annual Package (Flat 600 EGP/year for unlimited employees & branches)
    const waqtyTotal = 600;

    const netSavings = Math.max(traditionalTotal - waqtyTotal, 0);
    const savingsPercent = Math.min(Math.round((netSavings / traditionalTotal) * 100), 99);

    // Render formatted numbers
    traditionalCostEl.textContent = `${traditionalTotal.toLocaleString('ar-EG')} ج.م`;
    waqtyCostEl.textContent = `${waqtyTotal.toLocaleString('ar-EG')} ج.م / سنة`;
    totalSavingsEl.textContent = `${netSavings.toLocaleString('ar-EG')} ج.م`;
    percentSavingsEl.textContent = `${savingsPercent}%`;
  }

  if (branchesSlider && employeesSlider) {
    branchesSlider.addEventListener('input', updateCalculator);
    employeesSlider.addEventListener('input', updateCalculator);
    updateCalculator();
  }

  // 4. Interactive FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const toggleBtn = item.querySelector('.faq-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('open');
          }
        });

        // Toggle current item
        if (isOpen) {
          item.classList.remove('open');
        } else {
          item.classList.add('open');
        }
      });
    }
  });

  // 5. Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }
});
