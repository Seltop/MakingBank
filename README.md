# Pulse - Wearable Tech Shopify Theme

A production-ready Shopify Liquid theme for premium wearable technology brands such as smart rings, watches, fitness trackers, and accessories.

## Connect To Shopify

This project is already a Shopify theme. The local Shopify CLI has been added as a dev dependency so you can run Shopify commands from this folder.

### First-time local setup

```powershell
cd "C:\Users\selto\OneDrive\Documents\Making bank website\wearable-tech-theme"
npm.cmd install
```

### Preview on your Shopify store

Use your actual `myshopify.com` store domain:

```powershell
npm.cmd run dev -- --store your-store.myshopify.com
```

Shopify CLI will open a browser login if needed. You need a store owner account, a staff account with theme permissions, or a Theme Access password.

### Save the store in a local environment file

You can copy `shopify.theme.toml.example` to `shopify.theme.toml`, replace the store value, then run commands without repeating `--store`:

```powershell
Copy-Item shopify.theme.toml.example shopify.theme.toml
npm.cmd run dev
```

`shopify.theme.toml` is ignored by Git and excluded from theme uploads because it can contain store-specific credentials.

### Upload as an unpublished theme

```powershell
npm.cmd run push -- --store your-store.myshopify.com
```

After upload, open Shopify admin > Online Store > Themes to preview or publish it.

### Other useful commands

```powershell
npm.cmd run check
npm.cmd run package
npm.cmd run list -- --store your-store.myshopify.com
npm.cmd run info
```

## Upload Without CLI

You can also upload a ZIP in Shopify admin:

1. Create a ZIP whose root contains `assets/`, `config/`, `layout/`, `locales/`, `sections/`, `snippets/`, and `templates/`.
2. Open Shopify admin > Online Store > Themes.
3. In Theme library, choose Add theme > Upload zip file.
4. Preview the uploaded theme, then publish when ready.

## First-Time Shopify Admin Setup

### Collections

Create these collection handles in Shopify admin:

- `smart-rings`
- `smart-watches`
- `fitness-trackers`
- `accessories`

Then open the theme customizer and assign the matching collections in the Featured collections section.

### Pages

Create these pages and assign the matching theme template:

| Page title | Template suffix | Handle |
| --- | --- | --- |
| About | `about` | `about` |
| Contact | `contact` | `contact` |
| FAQ | `faq` | `faq` |
| Size guide | `size-guide` | `size-guide` |
| Reviews | `reviews` | `reviews` |
| Technology / How it works | `technology` | `technology` |
| Shipping & returns | `shipping-returns` | `shipping-returns` |
| Privacy policy | `privacy-policy` | `privacy-policy` |
| Terms of service | `terms-of-service` | `terms-of-service` |

Shopify can generate policy pages under Settings > Policies, so privacy and terms can also live under `/policies/...`.

### Collection Templates

Assign these optional collection templates for category-specific merchandising:

| Collection | Template suffix | Recommended handle |
| --- | --- | --- |
| Smart Rings | `smart-rings` | `smart-rings` |
| Smart Watches | `smart-watches` | `smart-watches` |
| Fitness Trackers | `fitness-trackers` | `fitness-trackers` |
| Accessories | `accessories` | `accessories` |

### Navigation

Create a main menu in Online Store > Navigation:

- Shop: `/collections/all`
- Smart Rings: `/collections/smart-rings`
- Smart Watches: `/collections/smart-watches`
- Fitness Trackers: `/collections/fitness-trackers`
- Technology: `/pages/technology`
- About: `/pages/about`
- Reviews: `/pages/reviews`
- Contact: `/pages/contact`

Create a footer menu with FAQ, Size guide, Shipping & returns, Privacy, and Terms.

### Product Badges

Add these product tags to show badges automatically:

- `new`
- `best-seller`

Setting a compare-at price higher than the price shows a Sale badge.

## File Structure

```text
wearable-tech-theme/
  assets/
    cart.js
    theme.css
    theme.js
  config/
    settings_data.json
    settings_schema.json
  layout/
    password.liquid
    theme.liquid
  locales/
    en.default.json
  sections/
    announcement-bar.liquid
    app-connectivity.liquid
    benefits.liquid
    best-sellers.liquid
    cart-drawer.liquid
    comparison.liquid
    customer-reviews.liquid
    faq-preview.liquid
    featured-collections.liquid
    final-cta.liquid
    footer-group.json
    footer.liquid
    header-group.json
    header.liquid
    hero.liquid
    image-with-text.liquid
    lifestyle-image.liquid
    main-cart.liquid
    main-collection.liquid
    main-contact.liquid
    main-faq.liquid
    main-page.liquid
    main-product.liquid
    main-reviews.liquid
    main-size-guide.liquid
    main-technology.liquid
    product-recommendations.liquid
    rich-text.liquid
    track-health.liquid
    trust-badges.liquid
  snippets/
    collection-filters.liquid
    icon.liquid
    meta-tags.liquid
    pagination.liquid
    price.liquid
    product-badges.liquid
    product-card.liquid
  templates/
    404.liquid
    article.liquid
    blog.liquid
    cart.json
    collection.accessories.json
    collection.fitness-trackers.json
    collection.json
    collection.smart-rings.json
    collection.smart-watches.json
    customers/
      account.liquid
      activate_account.liquid
      addresses.liquid
      login.liquid
      order.liquid
      register.liquid
      reset_password.liquid
    index.json
    list-collections.liquid
    page.about.json
    page.contact.json
    page.faq.json
    page.json
    page.privacy-policy.json
    page.reviews.json
    page.shipping-returns.json
    page.size-guide.json
    page.technology.json
    page.terms-of-service.json
    page.terms.json
    password.liquid
    product.json
    search.liquid
  package.json
  README.md
  shopify.theme.toml.example
```

## Notes

- Cart drawer behavior is controlled under Theme settings > Cart.
- Product pages detect ring and watch options from product type or tags.
- SEO metadata is generated in `snippets/meta-tags.liquid`.
- CSS and JavaScript are buildless theme assets, so no frontend build step is required.
