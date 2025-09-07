
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

let productsContainer=[];
let linkName=document.getElementsByClassName("categories_link");

getData()
async function getData(category = null){
    let response = await  fetch('json/products.json');
    let json=await response.json();
    productsContainer=json;
    if (category) {
        productsContainer = productsContainer.filter(product => product.category === category);
    }
    displayProducts();
}
function displayProducts(){
    let container=``;
    for(let i=0;i<productsContainer.length;i++ ){
        container+=`
        <div class="product-card" data-id="${productsContainer[i].id}">
        <div class="card-img">
            <img  onclick=displayDetails(${productsContainer[i].id});
             src=${productsContainer[i].images[0]}
             alt=${productsContainer[i].name}>
            <a href=""  class="addToCart">
                <ion-icon name="cart-outline" class="Cart"></ion-icon>
            </a>
        </div>
        <div class="card-info">
             <h4 class="product-name" onclick=displayDetails(${productsContainer[i].id});>${productsContainer[i].name}</h4>
             <h5 class="product-price">${formatINR(usdToInrIndianStyle(productsContainer[i].price))}</h5>
        </div>
    </div>`
    }
    document.getElementById("productCount").innerHTML = `${productsContainer.length} Products`;
    document.querySelector('.products .content').innerHTML = container;
      // Adding event listener to each "addToCart" link
      let addToCartLinks = document.querySelectorAll('.addToCart');
      addToCartLinks.forEach(link => {
          link.addEventListener('click', function(event) {
              event.preventDefault();
              let productCard = event.target.closest('.product-card');
              if (productCard && productCard.dataset.id) {
                  let id_product = productCard.dataset.id;
                  addToCart(id_product);
              }
          });
      });
}
function getCategory(e){
    let category = e.target.getAttribute('productCategory');
    setActiveLink(e.target)
    try{
        getData(category);
    }catch(e){
        console.log("not found")
    }
    if (window.innerWidth <= 768) {
        // to close when use select category
        toggleSidebar();
    }
}
function setActiveLink(activeLink) {
    Array.from(linkName).forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

Array.from(linkName).forEach(function(element){
    element.addEventListener('click',getCategory);
})

function toggleSidebar() {
    var sidebar = document.querySelector(".aside");
    sidebar.classList.toggle("open");
}

function displayDetails(productId){
    window.location.href = `ProductDetails.html?productId=${productId}`;
}
