
// === Currency helpers injected ===
function usdToInrIndianStyle(usdStrOrNum){
  let n = typeof usdStrOrNum === 'string' ? parseFloat(String(usdStrOrNum).replace(/[^0-9.]/g,'')) : Number(usdStrOrNum||0);
  if (isNaN(n)) n = 0;
  if (n <= 15) return (n < 10 ? 499 : 999);
  if (n <= 40) return (n < 30 ? 1499 : 1999);
  if (n <= 60) return 2999;
  if (n <= 100) return 3999;
  if (n <= 150) return 4999;
  if (n <= 200) return 6999;
  return 9999;
}
function formatINR(val){ return `₹${Math.round(Number(val)||0)}`; }
// === End helpers ===

window.addEventListener("load", function(){
    clearCart();
    let totalPrice = document.getElementById("total_price");
    showCheckAnimation();
    addDate();
    let total = localStorage.getItem('total price');
    if (total) {
        total = parseFloat(total);
        totalPrice.innerHTML = `$${total.toFixed(2)}`;
    } else {
        totalPrice.innerHTML = `₹499`;
    }
})

function showCheckAnimation(){
    const checkIconContainer = document.getElementById('checkoutIcon');
     checkIconContainer.innerHTML = '';
     const newCheckIcon = document.createElement('div');
     newCheckIcon.style.width = '200px';
     newCheckIcon.style.height = '200px';
     checkIconContainer.appendChild(newCheckIcon);
 
     lottie.loadAnimation({
         container: newCheckIcon,
         renderer: 'svg',
         loop: false,
         autoplay: true,
         path: 'json/AnimationCheckoutPage.json' 
     });
}

function addDate(){
    let date = document.getElementById("order_date");
    const now = new Date();
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const day = now.getDate(); 
    const month = months[now.getMonth()]; 
    const year = now.getFullYear();
    date.innerHTML  = ` ${month} ${day},  ${year}`;
}
function clearCart() {
    localStorage.removeItem('cart');
}
function backHome() {
    window.location.href = "index.html"; 
}