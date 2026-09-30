// >>> izeus-support
// Shared iZeus support form backend, reusable by any app site (BYOHack first).
// Source of truth: CleverBob42/byohack-site wix/izeus-support-block.js, synced with `node wix/sync-expr.mjs`.
// Only this marked block is replaced in backend/http-functions.js; other projects' code is untouched.
// Aliased imports and izeusSupport-prefixed names keep it from colliding with other code in the file.
//
// Usage from any static page:
//   <form method="post" action="https://www.izeus.org/_functions/support">
//     hidden: app (e.g. "BYOHack"), return (page URL on izeus.org or *.izeus.org), website (honeypot, empty)
//     fields: name, email, message
// Messages go into the Wix Form "iZeus support"; its "Form submitted -> Send an email" automation emails
// the owner, so no address is published. The visitor is sent back to `return` with ?sent=1 or ?error=...
import { response as izeusSupportResponse } from 'wix-http-functions';
import { submissions as izeusSupportSubmissions } from 'wix-forms.v2';
import { elevate as izeusSupportElevate } from 'wix-auth';

const IZEUS_SUPPORT_FORM_ID = 'fe2e7fb7-cc74-4825-843e-2c130e37f698';
const IZEUS_SUPPORT_FIELDS = { name: 'first_name_1e27', email: 'email_7214', message: 'message' };
const IZEUS_SUPPORT_FALLBACK = 'https://www.izeus.org/';
const izeusSupportCreate = izeusSupportElevate(izeusSupportSubmissions.createSubmission);

function izeusSupportReturnUrl(raw) {
  try {
    const u = new URL(raw);
    const host = u.hostname.toLowerCase();
    if (u.protocol === 'https:' && (host === 'izeus.org' || host.endsWith('.izeus.org'))) {
      return `${u.origin}${u.pathname}`;
    }
  } catch (e) {}
  return IZEUS_SUPPORT_FALLBACK;
}

function izeusSupportBack(returnUrl, query) {
  return izeusSupportResponse({
    status: 303,
    headers: { Location: `${returnUrl}?${query}#contact`, 'Cache-Control': 'no-store' },
  });
}

export async function post_support(request) {
  const form = new URLSearchParams(await request.body.text());
  const back = izeusSupportReturnUrl(form.get('return') || '');
  if (form.get('website')) return izeusSupportBack(back, 'sent=1');
  const app = (form.get('app') || 'iZeus').replace(/[^\w .-]/g, '').trim().slice(0, 40) || 'iZeus';
  const name = (form.get('name') || '').trim().slice(0, 80);
  const email = (form.get('email') || '').trim().slice(0, 120);
  const message = (form.get('message') || '').trim().slice(0, 4000);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 5) {
    return izeusSupportBack(back, 'error=invalid');
  }
  try {
    await izeusSupportCreate({
      formId: IZEUS_SUPPORT_FORM_ID,
      submissions: {
        [IZEUS_SUPPORT_FIELDS.name]: name,
        [IZEUS_SUPPORT_FIELDS.email]: email,
        [IZEUS_SUPPORT_FIELDS.message]: `[${app}] ${message}`,
      },
    });
  } catch (e) {
    console.error('izeus support submission failed', e);
    return izeusSupportBack(back, 'error=send');
  }
  return izeusSupportBack(back, 'sent=1');
}
// <<< izeus-support
