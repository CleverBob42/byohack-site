// Generates the static pages from one shared layout: `node build.mjs`, then commit and push.
import { writeFileSync } from 'node:fs';

const SUPPORT_ENDPOINT = 'https://www.izeus.org/_functions/support';
const V = Date.now().toString(36);

function helixPath(amplitude, wavelength, height, invert = false) {
  const pts = [];
  for (let y = 0; y <= height; y += 6) {
    const x = 60 + amplitude * Math.sin((y / wavelength) * Math.PI * 2) * (invert ? -1 : 1);
    pts.push(`${x.toFixed(1)} ${y}`);
  }
  return `M${pts.join('L')}`;
}

const helix = (cls, strands) =>
  `<svg class="helix ${cls}" viewBox="0 0 120 3400" preserveAspectRatio="none">${strands}</svg>`;

const background = `<div class="bg" aria-hidden="true">
  <div class="bg-art"></div>
  <img class="bg-mark" src="assets/icon-512.png" alt="">
  <div class="orb o1"></div><div class="orb o2"></div><div class="orb o3"></div><div class="orb o4"></div>
  ${helix('h1', `<path class="a" d="${helixPath(34, 170, 3400)}"/><path class="b" d="${helixPath(34, 170, 3400, true)}"/>`)}
  ${helix('h2', `<path class="a" d="${helixPath(26, 170, 3400)}"/>`)}
  <div class="grid"></div>
  <div class="mist"></div>
</div>`;

const NAV = [
  ['index.html', 'Home'],
  ['support.html', 'Support'],
  ['privacy.html', 'Privacy'],
  ['terms.html', 'Terms'],
];

function layout({ file, title, description, body, script = false }) {
  const links = NAV.map(([href, label]) =>
    `<a href="${href}"${href === file ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="theme-color" content="#070d18">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="https://byohack.izeus.org/assets/icon-512.png">
<link rel="icon" type="image/png" sizes="32x32" href="assets/icon-32.png">
<link rel="icon" type="image/png" sizes="512x512" href="assets/icon-512.png">
<link rel="apple-touch-icon" href="assets/icon-180.png">
<link rel="stylesheet" href="assets/style.css?v=${V}">
</head>
<body>
${background}
<header class="nav">
  <a class="brand" href="index.html"><img src="assets/logo.png" alt="" width="36" height="36"><span>BYOHack</span></a>
  <nav class="nav-links">${links}</nav>
</header>
${body}
<footer class="foot">&copy; ${new Date().getFullYear()} iZeus Pty Ltd &middot; <a href="privacy.html">Privacy</a> &middot; <a href="terms.html">Terms</a> &middot; <a href="support.html">Support</a></footer>
${script ? `<script src="assets/site.js?v=${V}"></script>\n` : ''}</body>
</html>
`;
}

const pages = {
  'index.html': {
    title: 'BYOHack – Meals, Health and A.I. coaching for iPhone',
    description: 'Log meals with a photo, sync Apple Health activity and get practical wellness coaching on iPhone.',
    body: `<main class="wrap">
<section class="hero">
  <img src="assets/icon-512.png" alt="BYOHack app icon" width="120" height="120">
  <h1>BYOHack</h1>
  <p class="lead">Log meals with a photo, sync your Apple Health activity, and get practical wellness coaching, all on your iPhone.</p>
</section>
<section class="cards">
  <a class="card glass" href="support.html"><h2>Support</h2><p>Questions, FAQ and a contact form.</p></a>
  <a class="card glass" href="privacy.html"><h2>Privacy</h2><p>What the app uses and where your data stays.</p></a>
  <a class="card glass" href="terms.html"><h2>Terms of Use</h2><p>Subscriptions, A.I. features and the EULA.</p></a>
</section>
</main>`,
  },

  'support.html': {
    title: 'BYOHack Support',
    description: 'Help, FAQ and contact form for the BYOHack iPhone app.',
    script: true,
    body: `<main class="wrap"><article class="doc glass">
<h1>Support</h1>
<p class="muted">BYOHack &middot; iPhone</p>
<p>BYOHack helps you log meals, sync Apple Health activity, and get practical wellness coaching.</p>

<h2 id="contact">Contact us</h2>
<p>For help, bug reports or feedback, send us a message and we'll reply by email.</p>
<p class="notice ok" id="sent" role="status" hidden>Thanks! Your message has been sent. We'll reply by email.</p>
<p class="notice err" id="error" role="alert" hidden></p>
<form class="contact" method="post" action="${SUPPORT_ENDPOINT}">
  <input type="hidden" name="app" value="BYOHack">
  <input type="hidden" name="return" value="https://byohack.izeus.org/support.html">
  <label>Your name<input name="name" required maxlength="80" autocomplete="name"></label>
  <label>Your email<input name="email" type="email" required maxlength="120" autocomplete="email"></label>
  <label>Message<textarea name="message" required minlength="5" maxlength="4000" placeholder="Include your iPhone model and iOS version if you're reporting a problem."></textarea></label>
  <div class="hp" aria-hidden="true"><label>Leave this empty<input name="website" tabindex="-1" autocomplete="off"></label></div>
  <button class="btn" type="submit">Send message</button>
</form>

<h2>Frequently asked questions</h2>
<p class="faq-q">How many A.I. requests do I get?</p>
<p class="faq-a">Free installs include meal logging, Health tracking and 10 lifetime A.I. interactions. BYOHack Pro includes 15 A.I. interactions per calendar day (meal capture and Health Coach). Re-logging favourites and manual edits don't use A.I. quota.</p>
<p class="faq-q">How do I manage or cancel BYOHack Pro?</p>
<p class="faq-a">Open iOS Settings, tap your name, then Subscriptions.</p>
<p class="faq-q">How do I change Apple Health access?</p>
<p class="faq-a">Open iOS Settings &rarr; Health &rarr; Data Access &amp; Devices &rarr; BYOHack.</p>
<p class="faq-q">Is BYOHack medical advice?</p>
<p class="faq-a">No. BYOHack is a wellness tool, not a medical device. Always ask a qualified health professional about medical questions.</p>

<h2>Privacy</h2>
<p>Your logs stay on your iPhone. <a href="privacy.html">Read the privacy policy</a>.</p>
</article></main>`,
  },

  'privacy.html': {
    title: 'BYOHack Privacy Policy',
    description: 'How the BYOHack iPhone app handles your information.',
    body: `<main class="wrap"><article class="doc glass">
<h1>Privacy Policy</h1>
<p class="muted">Last updated: 30 September 2026</p>
<p>BYOHack (&ldquo;we&rdquo;, &ldquo;our&rdquo;) is a personal wellness app that helps you log meals, track activity, and receive coaching tips. This policy explains what information the app uses.</p>

<h2>Information the app uses</h2>
<ul>
  <li><strong>Account basics</strong> such as a display name if you choose Sign in with Apple or local device sign-in.</li>
  <li><strong>Health and fitness data</strong> you allow through Apple Health (for example steps, active energy, weight, sleep), used only to show progress and coaching context on your device.</li>
  <li><strong>Meal photos and food notes</strong> you submit for nutrient estimates. Those requests are sent to our A.I. provider to generate estimates, then results are stored on your device.</li>
  <li><strong>Preferences and targets</strong> you set in the app (diet style, calorie/macro targets, medications/supplements you add).</li>
  <li><strong>Purchase status</strong> for optional BYOHack Pro subscriptions, handled by Apple.</li>
</ul>

<h2>Where data is stored</h2>
<p>All of your logs and settings stay on your smartphone. A.I. meal and coach requests are processed by Google Gemini to return estimates and coaching text. We do not sell your personal data.</p>

<h2>Health data</h2>
<p>Apple Health data is read only with your permission and is used for wellness tracking inside BYOHack. We do not use Health data for advertising. BYOHack is not a medical device and does not provide medical advice.</p>

<h2>Subscriptions and payments</h2>
<p>Payments for BYOHack Pro are processed by Apple. We do not receive your full payment card details.</p>

<h2>Support messages</h2>
<p>If you contact us through the <a href="support.html#contact">support form</a>, we receive the name, email address and message you enter. We use them only to reply to you, and they are stored by our website provider, Wix.</p>

<h2>Your choices</h2>
<ul>
  <li>You can revoke Apple Health access in iOS Settings.</li>
  <li>You can delete meal history and other in-app data from the app or by deleting the app.</li>
  <li>You can manage or cancel subscriptions in your Apple ID subscriptions settings.</li>
</ul>

<h2>Contact</h2>
<p>Questions about privacy? Send us a message through the <a href="support.html#contact">support form</a>.</p>
</article></main>`,
  },

  'terms.html': {
    title: 'BYOHack Terms of Use',
    description: 'Terms of Use (EULA) for the BYOHack iPhone app.',
    body: `<main class="wrap"><article class="doc glass">
<h1>Terms of Use</h1>
<p class="muted">Last updated: 23 September 2026</p>
<p>BYOHack is a personal wellness app from Rob Law / iZeus. By downloading or using BYOHack you agree to these terms and to Apple&rsquo;s standard Licensed Application End User License Agreement (EULA).</p>
<p>Apple&rsquo;s standard EULA: <a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/">apple.com/legal/internet-services/itunes/dev/stdeula</a></p>

<h2>Not medical advice</h2>
<p>BYOHack provides wellness tracking, nutrient estimates, and coaching tips for general lifestyle purposes only. It is not a medical device and does not diagnose, treat, cure, or prevent any disease. Always seek the advice of a qualified health professional for medical questions. Do not ignore professional medical advice because of something you read in the app.</p>

<h2>Subscriptions (BYOHack Pro)</h2>
<p>BYOHack is free to download. Free use includes meal logging, Health tracking, and 10 lifetime A.I. interactions. Optional auto-renewable BYOHack Pro subscriptions unlock 15 A.I. interactions per calendar day. Payment is charged to your Apple ID. Subscriptions renew automatically unless cancelled at least 24 hours before the end of the current period. Manage or cancel in your Apple ID account settings. Titles, lengths, and prices are shown in the app&rsquo;s subscribe screen and on the App Store product page.</p>

<h2>A.I. features</h2>
<p>Meal estimates and coaching responses are generated with third-party A.I. services and may be incomplete or incorrect. Use them as guides, not as medical or dietary prescriptions.</p>

<h2>Privacy</h2>
<p>How we handle information is described in our <a href="privacy.html">Privacy Policy</a>.</p>

<h2>Contact</h2>
<p>Questions? Send us a message through the <a href="support.html#contact">support form</a>.</p>
</article></main>`,
  },
};

for (const [file, page] of Object.entries(pages)) {
  writeFileSync(new URL(file, import.meta.url), layout({ file, ...page }));
}
console.log(`built ${Object.keys(pages).length} pages (v=${V})`);
