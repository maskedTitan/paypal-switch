<script>
    import { page } from '$app/stores';
  
    let token;
    let payerId;
  
    $: token = $page.url.searchParams.get('token');
    $: payerId = $page.url.searchParams.get('PayerID');
  </script>
  
  <div class="flex flex-col items-center justify-center min-h-screen p-6 bg-green-50">
    <h1 class="text-xl font-bold mb-4 text-green-800">Payment Approved</h1>
    <p class="text-green-700 mb-2">Thank you for your payment.</p>
  
    <div class="mt-4 text-sm text-gray-700 bg-white shadow p-4 rounded max-w-sm w-full">
      <p><strong>Order ID:</strong> {token}</p>
      <p><strong>Payer ID:</strong> {payerId}</p>
    </div>
  </div>
  