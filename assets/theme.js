/* =========================================================
   PULSE - Wearable Tech theme JS
   Global UI behaviours (header, mobile nav, filters, etc.)
   ========================================================= */

(function () {
  'use strict';

  /* ---------- Toast helper ---------- */
  window.showToast = function (message) {
    var c = document.getElementById('ToastContainer');
    if (!c) return;
    var el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    c.appendChild(el);
    setTimeout(function () { el.remove(); }, 3200);
  };

  /* ---------- Drawer open/close (generic) ---------- */
  function bindToggles() {
    document.addEventListener('click', function (e) {
      var openEl = e.target.closest('[data-drawer-open]');
      if (openEl) {
        e.preventDefault();
        var target = document.getElementById(openEl.getAttribute('data-drawer-open'));
        if (target) { target.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
      }
      var closeEl = e.target.closest('[data-drawer-close]');
      if (closeEl) {
        e.preventDefault();
        var drawer = closeEl.closest('.cart-drawer, .filter-drawer, .mobile-nav');
        if (drawer) { drawer.classList.remove('is-open'); document.body.style.overflow = ''; }
      }
      var overlay = e.target.classList && e.target.classList.contains('cart-drawer__overlay') ||
                    e.target.classList && e.target.classList.contains('filter-drawer__overlay') ||
                    e.target.classList && e.target.classList.contains('mobile-nav__overlay');
      if (overlay) {
        var d = e.target.closest('.cart-drawer, .filter-drawer, .mobile-nav');
        if (d) { d.classList.remove('is-open'); document.body.style.overflow = ''; }
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.cart-drawer.is-open, .filter-drawer.is-open, .mobile-nav.is-open')
          .forEach(function (d) { d.classList.remove('is-open'); });
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- Accordion / FAQ ---------- */
  // Native <details> handles itself. No JS needed.

  /* ---------- Product gallery thumbs ---------- */
  function bindGallery() {
    document.querySelectorAll('[data-gallery]').forEach(function (gallery) {
      var main = gallery.querySelector('[data-gallery-main]');
      gallery.querySelectorAll('[data-gallery-thumb]').forEach(function (thumb) {
        thumb.addEventListener('click', function () {
          var src = thumb.getAttribute('data-src');
          var alt = thumb.getAttribute('data-alt') || '';
          if (main && src) { main.querySelector('img').src = src; main.querySelector('img').alt = alt; }
          gallery.querySelectorAll('[data-gallery-thumb]').forEach(function (t) { t.classList.remove('is-active'); });
          thumb.classList.add('is-active');
        });
      });
    });
  }

  /* ---------- Variant selector ---------- */
  function bindVariants() {
    document.querySelectorAll('[data-variant-form]').forEach(function (form) {
      var data = form.querySelector('[data-product-json]');
      if (!data) return;
      var product;
      try { product = JSON.parse(data.textContent); } catch (e) { return; }

      var state = {};
      product.options.forEach(function (opt, i) {
        var selected = form.querySelector('[data-option-index="' + i + '"] .variant-option.is-selected');
        state[i] = selected ? selected.getAttribute('data-value') : product.variants[0].options[i];
      });

      function findVariant() {
        return product.variants.find(function (v) {
          return v.options.every(function (val, i) { return val === state[i]; });
        });
      }

      function update() {
        var v = findVariant();
        var input = form.querySelector('[name="id"]');
        var price = form.querySelector('[data-product-price]');
        var compare = form.querySelector('[data-product-compare]');
        var btn = form.querySelector('[data-add-to-cart]');
        var buyNow = form.querySelector('[data-buy-now]');

        if (!v) {
          if (btn) { btn.disabled = true; btn.textContent = 'Unavailable'; }
          if (buyNow) buyNow.disabled = true;
          return;
        }
        if (input) input.value = v.id;
        if (price) price.textContent = formatMoney(v.price);
        if (compare) {
          if (v.compare_at_price && v.compare_at_price > v.price) {
            compare.textContent = formatMoney(v.compare_at_price);
            compare.style.display = '';
          } else { compare.style.display = 'none'; }
        }
        if (btn) {
          btn.disabled = !v.available;
          btn.textContent = v.available ? (btn.getAttribute('data-default-text') || 'Add to cart') : 'Sold out';
        }
        if (buyNow) buyNow.disabled = !v.available;

        // Update URL with variant
        if (history.replaceState) {
          var url = new URL(window.location.href);
          url.searchParams.set('variant', v.id);
          history.replaceState({}, '', url.toString());
        }
      }

      form.querySelectorAll('[data-option-index]').forEach(function (group) {
        var i = parseInt(group.getAttribute('data-option-index'), 10);
        group.querySelectorAll('.variant-option').forEach(function (btn) {
          btn.addEventListener('click', function () {
            group.querySelectorAll('.variant-option').forEach(function (b) { b.classList.remove('is-selected'); });
            btn.classList.add('is-selected');
            state[i] = btn.getAttribute('data-value');
            update();
          });
        });
      });

      update();
    });
  }

  function formatMoney(cents) {
    var amount = (cents / 100);
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency: window.shopCurrency || 'USD' }).format(amount);
    } catch (e) {
      return '$' + amount.toFixed(2);
    }
  }
  window.formatMoney = formatMoney;

  /* ---------- Quantity buttons ---------- */
  function bindQuantity() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-qty-change]');
      if (!btn) return;
      var input = btn.parentElement.querySelector('input[type="number"]');
      if (!input) return;
      var v = parseInt(input.value, 10) || 1;
      var d = parseInt(btn.getAttribute('data-qty-change'), 10);
      v = Math.max(parseInt(input.min || 1, 10), v + d);
      input.value = v;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  /* ---------- Collection sort ---------- */
  function bindSort() {
    var sort = document.querySelector('[data-collection-sort]');
    if (!sort) return;
    sort.addEventListener('change', function () {
      var url = new URL(window.location.href);
      url.searchParams.set('sort_by', sort.value);
      url.searchParams.delete('page');
      window.location.href = url.toString();
    });
  }

  /* ---------- Smooth anchor scroll for in-page links ---------- */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href').slice(1);
    if (!id) return;
    var target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    bindToggles();
    bindGallery();
    bindVariants();
    bindQuantity();
    bindSort();
  });
})();
