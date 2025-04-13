<script>
  import { onMount } from "svelte";
  import { loadScript } from "@paypal/paypal-js";

  let isLoaded = false;
  let errorMessage = "";

  onMount(async () => {
    try {
      const paypalSDK = await loadScript({
        clientId:
          "AQD1grlR1Aiy7WMw6eo8VGEkQT_FW0dj3QEni0Vcgk7ybUYvAd6iuC14Fw6TKnXyyGG1d_LcQ3rZhZTi",
        currency: "USD",
        intent: "capture"
      });

      if (paypalSDK) {
        const buttons = paypalSDK.Buttons({
          appSwitchWhenAvailable: true, // Enable App Switch feature
          createOrder: async function () {
            // Call your API to create the order and return the order ID
            const response = await fetch("/", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                amount: "9.99",
                email: "harshamarri18+sandbox@gmail.com"
              })
            });
            const data = await response.json();
            return data.id;
          },
          onApprove: async function (data, actions) {
            await actions.order.capture();
          },
          onError: function (err) {
            console.error("Payment error:", err);
            errorMessage = err.message || JSON.stringify(err);
          }
        });

        // If the buyer has returned from an App Switch flow, resume the flow
        if (buttons.hasReturned()) {
          buttons.resume();
        } else {
          buttons.render("#paypal-button-container");
        }
        isLoaded = true;
      }
    } catch (err) {
      console.error("PayPal load failed:", err);
      errorMessage = "Failed to load PayPal.";
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
      