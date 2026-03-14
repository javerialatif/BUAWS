# BUAWS — Animal Welfare Society Adoption Website

A beautiful, static website for the **Bahria University Animal Welfare Society (BUAWS)** to help animals find forever homes.

## 🐾 About

Built for BUAWS at Bahria University's E-8 Islamabad campus. This site allows volunteers to list animals for adoption, share photos and videos, and collect adoption inquiries.

## 📁 File Structure

```
buaws-site/
├── index.html                         ← Main website
├── assets/
│   ├── css/style.css                  ← All styles
│   └── js/main.js                     ← All interactivity
├── cat_lahore_tayyab-adoption/        ← Animal media folders
│   ├── 1.jpeg
│   └── ...
├── cat_navalcomplex_hibas-stray/
├── cat_phase2_eyerupture-stray/
├── cat_tenchbata_grey-stray/
├── cat_tenchbata_white-persian/
├── cat_unknown_biscuit/
├── cat_unknown_turkish-angora/
├── cat_wahcantt_roadkill/
├── dog_askari11_leo/
├── dog_askari11_puppy-ridazulfiqar/
└── dog_unknown_chiku-labrador/
```

## 🚀 Deploy to GitHub Pages

1. **Create a new GitHub repository** (e.g., `buaws-adoption`)
2. **Copy all files** into the repository root — including this folder's contents AND all the animal media folders
3. **Push to GitHub**
4. Go to **Settings → Pages**
5. Under "Source", select `main` branch, `/ (root)` folder
6. Click **Save**
7. Your site will be live at `https://yourusername.github.io/buaws-adoption/`

## ✉️ Connecting the Contact Form

The form currently simulates submission. To make it real, use one of these free services:

### Option A: Formspree (Recommended — Free)
1. Go to [formspree.io](https://formspree.io) and create a free account
2. Create a new form and get your endpoint URL
3. In `index.html`, find `<form class="contact-form" id="contactForm">` and add `action="https://formspree.io/f/YOUR_ID" method="POST"`
4. In `main.js`, replace the simulated submission with a real `fetch()` call:

```javascript
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(contactForm);
  await fetch('https://formspree.io/f/YOUR_ID', {
    method: 'POST',
    body: data,
    headers: { 'Accept': 'application/json' }
  });
  contactForm.reset();
  showToast();
});
```

### Option B: Netlify Forms
If you host on Netlify instead, add `netlify` attribute to the form tag and it works automatically.

## ➕ Adding New Animals

To add a new animal, copy one of the existing `<article class="animal-card">` blocks in `index.html` and update:

- `data-type`: `"cat"` or `"dog"`
- `data-status`: `"adoption"` or `"stray"`
- The image/video sources
- Card name, description, tags
- Gallery button `data-images` and `data-videos` JSON arrays

## 📱 Features

- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Image sliders with auto-advance on cards
- ✅ Video support (plays on hover)
- ✅ Full-screen gallery modal (keyboard navigable)
- ✅ Filter by type (cats/dogs) or status (adoption/stray)
- ✅ Adopt modal linking to contact form
- ✅ Smooth scroll & scroll-triggered animations
- ✅ Contact/adoption form with success toast
- ✅ Urgent care badges for animals needing medical help

## 🎨 Design

Warm editorial aesthetic with:
- **Fonts**: Playfair Display (headings) + DM Sans (body)
- **Colors**: Cream, earth tones, forest green
- **Style**: Organic, compassionate, editorial
