
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

let cart = [];
let products = [];
let totalPrice = document.getElementById("total_price");
let cartCounter = document.getElementById("cart-counter");
let cartItemsCount = document.getElementById("cart_counts");
const cartTextElements = document.querySelectorAll(".cart_products");
const btnControl = document.querySelector(".btn_control");
const cartTotal = document.querySelector(".cart_total");

loadCart();
getData();
checkCart();

async function getData() {
    let response = await fetch('json/products.json');
    let json = await response.json();
    products = json;
}
function loadCart() {
    let storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId,inputQuantity = 1) {
    let product = products.find(p => p.id == productId);
    if (product) {
        let existingProduct = cart.find(p => p.id == productId);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            let productWithQuantity = { ...product, quantity: inputQuantity };
            cart.push(productWithQuantity);
        }
        saveCart();
        checkCart();
    }
}

function addCartToHTML() {
    let content = ``;
    cart.forEach((product, index) => {
        let price = usdToInrIndianStyle(product.price);
        let totalPrice = price * product.quantity;
        content += `
        <div class="cart_product">
            <div class="cart_product_img">  
                <img src=${product.images[0]}>
            </div>
            <div class="cart_product_info">  
                <div class="top_card">
                    <div class="left_card">
                        <h4 class="product_name">${product.name}</h4>
                        <span class="product_price">${formatINR(usdToInrIndianStyle(product.price))}</span>
                    </div>
                    <div class="remove_product" onclick="removeFromCart(${index})">
                        <ion-icon name="close-outline"></ion-icon>
                    </div>
                </div>
                <div class="buttom_card">
                    <div class="counts">
                        <button class="counts_btns minus"  onclick="decreaseQuantity(${index})">-</button>
                        <input type="number" inputmode="numeric" name="productCount" min="1" step="1" max="999"
                            class="product_count"  value=${product.quantity}>
                        <button  class="counts_btns plus" onclick="increaseQuantity(${index})">+</button>
                    </div>
                    <span class="total_price">${formatINR(totalPrice)}</span>
                </div>
            </div>
        </div>`;
    });
    cartTextElements.forEach(element => {
        element.innerHTML = content;
    });;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    checkCart();
}
function increaseQuantity(index){
    cart[index].quantity += 1;
    saveCart();
    checkCart();
}
function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        saveCart();
        checkCart();
    } else {
        removeFromCart(index);
    }
}

function updateTotalPrice() {
    let total = cart.reduce((sum, product) => {
        let price = usdToInrIndianStyle(product.price);
        return sum + (price * product.quantity);
    }, 0);
    totalPrice.innerHTML = formatINR(total);
    localStorage.setItem("total price" , total + 70);
    return total;
}

// Initial call to display the cart products on page load
function checkCart(){
    if (cart.length == 0) {
        cartTextElements.forEach(element => {
            element.classList.add("empty");
            element.innerHTML = "Your cart is empty";
        })
        cartCounter.innerHTML = 0;
        btnControl.style.display = "none";
        cartTotal.style.display = "none";
        checkCartPage(0,0);
    } else {
        cartTextElements.forEach(element => {
            element.classList.remove("empty");
        })
        addCartToHTML();
        let totalQuantity = cart.reduce((sum, product) => sum + product.quantity, 0);
        cartCounter.innerHTML = totalQuantity;
        btnControl.style.display = "flex";
        cartTotal.style.display = "flex";
        let total = updateTotalPrice();
        checkCartPage(total,totalQuantity);       
    }
}
// Add cart page not cart section
function checkCartPage(total,totalQuantity){
    if (window.location.pathname.includes("cartPage.html")) {
        if (cart.length == 0) {
            cartItemsCount.innerHTML = `(0 items)`;
            document.getElementById("Subtotal").innerHTML = `₹499`;
            document.getElementById("total_order").innerHTML = `₹499`;
        }
        else{
            cartItemsCount.innerHTML = `(${totalQuantity} items)`;
            displayInCartPage(total);
        }
    }
}
function displayInCartPage(total){
    let subTotal = document.getElementById("Subtotal");
    subTotal.innerHTML = formatINR(total);
    let totalOrder= parseFloat(subTotal.innerHTML.replace('₹', '')) + 70;
    document.getElementById("total_order").innerHTML = formatINR(totalOrder);
}
function checkOut(){
    let email = localStorage.getItem('email');
    let password = localStorage.getItem('password');
    if (cart.length != 0) {
        if(email && password){
          window.location.href = "checkout.html";
        }
        else {
          window.location.href = "login.html";
        }
     }
}
