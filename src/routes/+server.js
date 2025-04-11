import { json } from '@sveltejs/kit';

export async function POST({ request }) {
  const body = await request.json();
  const accessToken = await getAccessToken();
  const baseUrl = request.headers.get('origin') ?? 'http://localhost:5173';
  const orderPayload = {
    intent: 'CAPTURE',
    payment_source: {
      paypal: {
        email_address: body.email,
        experience_context: {
          user_action: 'PAY_NOW',
          return_url: `${baseUrl}/success`,
          cancel_url: `${baseUrl}/success`,
          app_switch_preference: {
            launch_paypal_app: true
          }
        }
      }
    },
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: body.amount ?? '9.99'
        }
      }
    ]
  };

  const res = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'PayPal-Request-Id': crypto.randomUUID()
    },
    body: JSON.stringify(orderPayload)
  });

  const data = await res.json();
  return json(data);
}

async function getAccessToken() {
  const CLIENT_ID = 'AQD1grlR1Aiy7WMw6eo8VGEkQT_FW0dj3QEni0Vcgk7ybUYvAd6iuC14Fw6TKnXyyGG1d_LcQ3rZhZTi';
  const SECRET = 'EJDzPxtLMftYOCuoEcd4y28sWDQ0GVmaXyZo8g6a7M88llTeJC-UBDj5qrkKeIakgI8ulAjBQ486SKcV';

  const auth = Buffer.from(`${CLIENT_ID}:${SECRET}`).toString('base64');

  const res = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  const data = await res.json();
  return data.access_token;
}