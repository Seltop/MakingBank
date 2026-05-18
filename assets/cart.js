/* =========================================================
   PULSE - Cart functionality (AJAX cart drawer)
   ========================================================= */

(function () {
  'use strict';

  var routes = window.routes || {};

  function fetchCart() {
    return fetch(routes.cart_url + '.js', { credentials: 'same-origin' }).then(function (r) { return r.json(); });
  }

  function updateCartCount(cart) {
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = cart.item_count;
      el.style.display = cart.item_count > 0 ? '' : 'none';
    });
  }

  function renderDrawer(cart) {
    var drawer = document.getElementById('CartDrawer');
    if (!drawer) return;
    var body = drawer.querySelector('[data-cart-items]');
    var subtotalEl = drawer.querySelector('[data-cart-subtotal]');
    var footer = drawer.querySelector('[data-cart-footer]');

    if (!cart.items || cart.items.length === 0) {
      body.innerHTML =
        '<div class="cart-empty">' +
          '<p>Your cart is empty</p>' +
          '<a href="/collections/all" class="btn btn--primary" data-drawer-close>Continue shopping</a>' +
        '</div>';
      if (footer) footer.style.display = 'none';
      return;
    }

    if (footer) footer.style.display = '';

    var html = cart.items.map(function (item) {
      var img = item.image
        ? '<img src="' + item.image + '&width=160" alt="' + escapeHtml(item.product_title) + '" loading="lazy">'
        : '';
      var variant = item.variant_title && item.variant_title !== 'Default Title'
        ? '<div class="cart-item__variant">' + escapeHtml(item.variant_title) + '</div>'
        : '';
      return (
        '<div class="cart-item" data-key="' + item.key + '">' +
          '<div class="cart-item__image">' + img + '</div>' +
          '<div>' +
            '<a href="' + item.url + '" class="cart-item__title">' + escapeHtml(item.product_title) + '</a>' +
            variant +
            '<div class="cart-item__qty" data-qty-wrap>' +
              '<button type="button" aria-label="Decrease" data-qty-update="' + item.key + '" data-qty="' + Math.max(0, item.quantity - 1) + '">-</button>' +
              '<input type="number" value="' + item.quantity + '" min="0" data-qty-input="' + item.key + '">' +
              '<button type="button" aria-label="Increase" data-qty-update="' + item.key + '" data-qty="' + (item.quantity + 1) + '">+</button>' +
            '</div>' +
          '</div>' +
          '<div class="cart-item__right">' +
            '<div class="cart-item__price">' + window.formatMoney(item.final_line_price) + '</div>' +
            '<button class="cart-item__remove" type="button" data-qty-update="' + item.key + '" data-qty="0">Remove</button>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    body.innerHTML = html;
    if (subtotalEl) subtotalEl.textContent = window.formatMoney(cart.total_price);
  }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  function openDrawer() {
    var d = document.getElementById('CartDrawer');
    if (d) { d.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
  }

  /* ---------- Add to cart ---------- */
  function addToCart(formData, button, options) {
    options = options || {};
    if (button) { button.classList.add('is-loading'); button.disabled = true; }
    return fetch(routes.cart_add_url + '.js', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      credentials: 'same-origin',
      body: formData
    })
      .then(function (r) {
        if (!r.ok) return r.json().then(function (err) { throw err; });
        return r.json();
      })
      .then(function () { return fetchCart(); })
      .then(function (cart) {
        updateCartCount(cart);
        if (options.checkout) {
          window.location.href = '/checkout';
          return;
        }
        renderDrawer(cart);
        openDrawer();
        if (button) {
          button.classList.remove('is-loading');
          button.disabled = false;
          var orig = button.getAttribute('data-default-text') || button.textContent;
          button.textContent = 'Added';
          setTimeout(function () { button.textContent = orig; }, 1400);
        }
      })
      .catch(function (err) {
        if (button) { button.classList.remove('is-loading'); button.disabled = false; }
        var msg = (err && err.description) || (err && err.message) || 'Could not add to cart';
        window.showToast(msg);
      });
  }

  /* ---------- Update qty ---------- */
  function updateQty(key, qty) {
    return fetch(routes.cart_change_url + '.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ id: key, quantity: qty })
    })
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        renderDrawer(cart);
        updateCartCount(cart);
        // If we're on the cart page, refresh
        if (document.body.classList.contains('template-cart')) window.location.reload();
      });
  }

  /* ---------- Bind handlers ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    fetchCart().then(updateCartCount).then(function () {
      return fetchCart();
    }).then(function (cart) { renderDrawer(cart); });

    document.addEventListener('submit', function (e) {
      var form = e.target.closest('form[action*="/cart/add"]');
      if (!form) return;
      e.preventDefault();
      var fd = new FormData(form);
      var submitter = e.submitter || document.activeElement;
      var isBuyNow = submitter && submitter.closest && submitter.closest('[data-buy-now]');
      var btn = isBuyNow ? submitter : form.querySelector('[data-add-to-cart]') || form.querySelector('button[type="submit"]');
      addToCart(fd, btn, { checkout: !!isBuyNow });
    });

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-qty-update]');
      if (!btn) return;
      e.preventDefault();
      var key = btn.getAttribute('data-qty-update');
      var qty = parseInt(btn.getAttribute('data-qty'), 10);
      updateQty(key, qty);
    });

    document.addEventListener('change', function (e) {
      var input = e.target.closest('[data-qty-input]');
      if (!input) return;
      var key = input.getAttribute('data-qty-input');
      var qty = parseInt(input.value, 10) || 0;
      updateQty(key, qty);
    });

    // Quick add buttons (from product card)
    document.addEventListener('click', function (e) {
      var qa = e.target.closest('[data-quick-add]');
      if (!qa) return;
      e.preventDefault();
      var id = qa.getAttribute('data-quick-add');
      var fd = new FormData();
      fd.append('id', id);
      fd.append('quantity', '1');
      addToCart(fd, qa);
    });
  });
})();
