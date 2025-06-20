/**
 * Quick connectivity diagnostic run once at app startup.
 * It logs the status codes (or network errors) for:
 *   1. Your Supabase instance (if EXPO_PUBLIC_SUPABASE_URL env var is present)
 *   2. A generic public HTTPS endpoint (jsonplaceholder) – to detect if *all* HTTPS requests fail
 *
 * This helps identify whether "Network request failed" errors come from:
 *   • General outbound HTTPS blockage (VPN/Proxy/Firewall)
 *   • A domain-specific block (e.g. *.supabase.co)
 *   • App-level misconfiguration
 */

const supabaseUrl: string | undefined = process.env.EXPO_PUBLIC_SUPABASE_URL;

setTimeout(() => {
  if (supabaseUrl) {
    fetch(`${supabaseUrl}/rest/v1/`)
      .then((res) => {
        console.log('GLOBAL Supabase status:', res.status);
      })
      .catch((err) => {
        console.log('GLOBAL Supabase error →', err);
      });
  } else {
    console.log('GLOBAL Supabase test skipped: EXPO_PUBLIC_SUPABASE_URL not set');
  }

  fetch('https://jsonplaceholder.typicode.com/todos/1')
    .then((res) => {
      console.log('GLOBAL JSONPlaceholder status:', res.status);
    })
    .catch((err) => {
      console.log('GLOBAL JSONPlaceholder error →', err);
    });
}, 1000);
