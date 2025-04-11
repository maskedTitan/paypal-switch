<script>
        import { onMount } from 'svelte';
        import { loadScript } from '@paypal/paypal-js';
      
        let isLoaded = false;
        let errorMessage = '';
      
        onMount(async () => {
          try {
            const paypal = await loadScript({
              clientId: 'AQD1grlR1Aiy7WMw6eo8VGEkQT_FW0dj3QEni0Vcgk7ybUYvAd6iuC14Fw6TKnXyyGG1d_LcQ3rZhZTi', // dummy here, real client ID not needed due to server call
              currency: 'USD',
              intent: 'capture'
            });
      
            if (paypal) {
              isLoaded = true;
      
              paypal.Buttons({
                appSwitchWhenAvailable: true,
                createOrder: async () => {
                  const res = await fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: '9.99', email: 'h22tswift13@gmail.com' })
                  });
                  const data = await res.json();
                  return data.id; // Order ID
                },
                onApprove: async (data, actions) => {
                  const details = await actions.order.capture();
                  //alert(`Transaction completed by ${details.payer.name.given_name}`);
                },
                onError: (err) => {
                    console.error('Payment error:', err); // <-- this will show the full error
                    errorMessage = err.message || JSON.stringify(err); // Optional: show the message to user
                }
              }).render('#paypal-button-container');
            }
          } catch (err) {
            console.error('PayPal load failed:', err);
            errorMessage = 'Failed to load PayPal.';
          }
        });
      </script>
      
      <div class="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
        <h1 class="text-xl font-bold mb-4">PayPal App Switch Demo</h1>
      
        <div id="paypal-button-container" class="w-full max-w-sm"></div>
      
        {#if !isLoaded && !errorMessage}
          <p class="text-gray-600 mt-4">Loading PayPal...</p>
        {/if}
      
        {#if errorMessage}
          <p class="text-red-500 mt-4">{errorMessage}</p>
        {/if}
      </div>
      