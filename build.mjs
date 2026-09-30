// Generates the static pages from one shared layout: `node build.mjs`, then commit and push.
import { writeFileSync } from 'node:fs';

const SUPPORT_ENDPOINT = 'https://www.izeus.org/_functions/support';
const APP_STORE_ID = '6800939446';
const V = Date.now().toString(36);

const appleLogo = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.1-1.2 2.9-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.4-.9-2.4-3.9zM14 5.5c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.1-.6 2.8-1.4z"/></svg>';

// site.js switches the badge to "Download on the" with the real link once the App Store lookup finds the app.
const storeBadge = `<a class="store" data-store="${APP_STORE_ID}" href="#get">${appleLogo}<span><small data-store-label>Coming soon on the</small><b>App Store</b></span></a>`;

const icon = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const icons = {
  camera: icon('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'),
  bars: icon('<path d="M5 20V10M10 20V4M15 20v-7M20 20V8"/>'),
  menu: icon('<path d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M16 3c-2 1-3 4-3 7h3v11"/>'),
  heart: icon('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/><path d="M3 12h4l2-3 3 6 2-3h7"/>'),
  chat: icon('<path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8M8 13h5"/>'),
  lock: icon('<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>'),
};

const frame = (name, alt, lazy = true) =>
  `<div class="frame"><img src="assets/shots/${name}.webp" alt="${alt}" width="600" height="1300"${lazy ? ' loading="lazy"' : ''}></div>`;
const shot = (name, alt, title, sub) =>
  `<figure class="shot">${frame(name, alt)}<figcaption>${title}<span>${sub}</span></figcaption></figure>`;

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
    title: 'BYOHack – Be your own health hacker, on iPhone',
    description: 'Snap a meal for instant nutrient estimates, track your Apple Health trends and get practical A.I. coaching. Your data stays on your iPhone.',
    script: true,
    body: `<main class="wrap wide">
<section class="pitch">
  <div>
    <span class="eyebrow">Nutrition &middot; Apple Health &middot; A.I. coach</span>
    <h1>Be your own <span class="grad">health hacker</span></h1>
    <p class="lead">Snap a photo of your meal and BYOHack estimates the energy, macros and micronutrients in seconds. It lines that up with your Apple Health trends and tells you the one thing to do next.</p>
    <div class="cta-row">
      ${storeBadge}
      <a class="btn btn-ghost" href="#how">How it works</a>
    </div>
    <p class="meta">Free to download &middot; Your data stays on your iPhone &middot; Sign in with Apple</p>
  </div>
  <div class="pitch-art">
    ${frame('today', 'The Today screen: next action, energy, protein, carbs, fat, water and exercise', false)}
    <img class="pitch-logo" src="assets/icon-512.png" alt="BYOHack app icon" width="120" height="120">
  </div>
</section>

<section id="features">
  <h2 class="section-title">Everything you eat, everything you do, in one place</h2>
  <p class="section-sub">Stop guessing. BYOHack turns meals and Health data into clear, daily nudges.</p>
  <div class="features">
    <div class="feature glass"><div class="icon">${icons.camera}</div><h3>Snap a meal</h3><p>Take a photo or describe what you ate. A.I. estimates energy, protein, carbs, fat and more. Save favourites to re-log with one tap.</p></div>
    <div class="feature glass"><div class="icon">${icons.bars}</div><h3>See every nutrient</h3><p>Track vitamins, minerals, sugar, sodium, fibre and water against your own targets, with colour bars that show what's behind.</p></div>
    <div class="feature glass"><div class="icon">${icons.menu}</div><h3>Menu ideas that fit</h3><p>Get breakfast, lunch and dinner suggestions built from your meal history and what you still need today.</p></div>
    <div class="feature glass"><div class="icon">${icons.heart}</div><h3>Health Track</h3><p>Weight, body fat, cardio fitness, sleep, steps and mood from Apple Health, by day, week, month or year, with plain-English explanations.</p></div>
    <div class="feature glass"><div class="icon">${icons.chat}</div><h3>Health Coach</h3><p>Ask for keto targets, a high-protein swap or a weekly adjustment. The coach knows your targets and recent days.</p></div>
    <div class="feature glass"><div class="icon">${icons.lock}</div><h3>Private by design</h3><p>Your logs, targets and Health data stay on your iPhone. No ads, and we never sell your data.</p></div>
  </div>
</section>

<section id="screens">
  <h2 class="section-title">See it in action</h2>
  <p class="section-sub">Real screens from the app.</p>
  <div class="shots">
    ${shot('record', 'Record food and drink: favourite meals or a new photo', 'Record in seconds', 'Photo, description or favourite')}
    ${shot('today', 'Today overview with next action and macro bars', 'Today', 'Your next best move')}
    ${shot('intake', 'Micronutrient intake versus targets', 'Every nutrient', 'Vitamins and minerals vs targets')}
    ${shot('menu', 'Menu suggestions for breakfast and lunch', 'Menu ideas', 'Built from your history')}
    ${shot('history', 'Meal history grouped by day with energy totals', 'Meal history', 'Every day at a glance')}
    ${shot('energy', 'Energy intake chart by day with goal line', 'Energy', 'Intake against your goal')}
    ${shot('weight', 'Weight and body fat trends from Apple Health', 'Weight trends', 'From your scale via Apple Health')}
    ${shot('sleep', 'Sleep duration chart with goal line', 'Sleep', 'Why it matters, explained')}
  </div>
</section>

<section id="how">
  <h2 class="section-title">How it works</h2>
  <p class="section-sub">Set it up in a couple of minutes, then just keep logging.</p>
  <ol class="steps">
    <li class="glass"><h3>Set your targets</h3><p>Pick a diet style and your energy and macro goals, or let the Health Coach suggest them.</p></li>
    <li class="glass"><h3>Log what you eat</h3><p>Snap, describe or re-log a favourite. Estimates land in your day straight away.</p></li>
    <li class="glass"><h3>Connect Apple Health</h3><p>Steps, active energy, weight, sleep and more flow in automatically.</p></li>
    <li class="glass"><h3>Follow the next action</h3><p>Today tells you what's behind and what to eat next. Ask the coach when you want more.</p></li>
  </ol>
</section>

<section id="pricing">
  <h2 class="section-title">Free to start</h2>
  <p class="section-sub">Upgrade only if you want more A.I. every day.</p>
  <div class="plans">
    <div class="plan glass"><h3>Free</h3><ul><li>Meal logging and favourites</li><li>Apple Health tracking</li><li>10 A.I. interactions to try it out</li></ul></div>
    <div class="plan glass pro"><h3>BYOHack Pro</h3><ul><li>15 A.I. interactions every day</li><li>Meal estimates and label scan</li><li>Health Coach and menu suggestions</li><li>Monthly or annual plans</li></ul></div>
  </div>
</section>

<section id="get">
  <div class="band glass">
    <img src="assets/icon-512.png" alt="" width="88" height="88">
    <h2>Ready to hack your health?</h2>
    <p data-store-text>BYOHack is coming soon to the App Store for iPhone.</p>
    ${storeBadge}
    <p class="fine">BYOHack is a wellness tool, not a medical device, and does not provide medical advice.</p>
  </div>
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
