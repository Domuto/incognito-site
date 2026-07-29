export async function GET() {
  return new Response(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body {
        margin: 0;
        padding: 0;
        background: transparent;
        color: #f5f0e8;
      }

      body {
        font-family: 'Space Mono', monospace;
      }

      #tripleseat_link {
        display: none !important;
      }
    </style>
  </head>
  <body>
    <script src="https://www.google.com/recaptcha/api.js"></script>
    <script src="https://api.tripleseat.com/v1/leads/ts_script.js?lead_form_id=26805&public_key=90e0e457ced62ccf86f2f5d9a0deb7857a4676d9"></script>
  </body>
</html>`,
    {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    },
  )
}
