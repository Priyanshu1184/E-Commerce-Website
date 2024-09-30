let cartIcon=document.querySelector("#cart-icon");
let cart=document.querySelector(".cart");
let closeCart=document.querySelector("#close-cart");
cartIcon.onclick=()=>{
    cart.classList.add("active");
};
closeCart.onclick=()=>{
    cart.classList.remove("active");
}

if(document.readyState=="loading"){
    document.addEventListener("DOMContentLoaded",ready);
}else{
    ready();
}
//Making Function
function ready(){
    //removing items from cart
    var removeCartButtons=document.getElementsByClassName("cart-remove");
    for(var i=0;i<removeCartButtons.length;i++){
        var button=removeCartButtons[i];
        button.addEventListener("click",removeCartItem);
    }
    

//Quantity Update
var quantityInputs=document.getElementsByClassName("cart-quantity");
for(var i=0;i<quantityInputs.length;i++){
    var input=quantityInputs[i];
    input.addEventListener("change",quantityChanged);
}

//Add to Cart
var addCart = document.getElementsByClassName("add-cart");
for (var i = 0; i < addCart.length; i++) {
    var button = addCart[i];
    button.addEventListener("click", addCartClicked);
    }

loadCartItems();
}

//Remove cart items Main
function removeCartItem(event){
    var buttonClicked=event.target;
    buttonClicked.parentElement.remove();
    updateTotal();
    saveCartItems();
    updateCartIcon();
}

//Quantity Update Main
function quantityChanged(event){
    var input=event.target;
    if(isNaN(input.value)||input.value<=0){
        input.value=1;
    }
    updateTotal();
    saveCartItems();
    updateCartIcon()
}

//Add to Cart Main
function addCartClicked(event) {
    var button = event.target;
    var shopProducts = button.parentElement;
    var title = shopProducts.getElementsByClassName("product-title")[0].innerText;
    var price = shopProducts.getElementsByClassName("price")[0].innerText;
    var productImg=shopProducts.getElementsByClassName("product-img")[0].src;
    addProductToCart(title, price, productImg);
    updateTotal();
    saveCartItems();
    updateCartIcon()
}

function addProductToCart(title, price, productImg) {
    var cartShopBox = document.createElement("div");
    cartShopBox.classList.add("cart-box");
    var cartItems = document.getElementsByClassName("cart-content")[0];
    var cartItemsNames = cartItems.getElementsByClassName("cart-product-title");
    for (var i = 0; i < cartItemsNames.length; i++) {
        if(cartItemsNames[i].innerText == title) {
            alert("You have already add this item to cart");
            return;
        }
    }
    var cartBoxContent =  `
    <img src="${productImg}" alt="" class="cart-img" />
    <div class="detail box">
      <div class="cart-product-title">${title}</div>
      <div class="cart-price">${price}</div>
      <input
        type="number"
        name=""
        id=""
        value="1"
        class="cart-quantity"
      />
    </div>
    <i class="bx bxs-trash-alt cart-remove"></i>`;

    cartShopBox.innerHTML = cartBoxContent;
    cartItems.append(cartShopBox);
    cartShopBox.getElementsByClassName('cart-remove')[0]
    .addEventListener("click", removeCartItem);
    cartShopBox.getElementsByClassName("cart-quantity")[0]
    .addEventListener("change", quantityChanged);
    saveCartItems();
    updateCartIcon()
    }

//Update Total
function updateTotal(){
    var cartContent=document.getElementsByClassName("cart-content")[0];
    var cartBoxes=cartContent.getElementsByClassName("cart-box");
    var total=0;
    for(var i=0;i<cartBoxes.length;i++){
        var cartBox=cartBoxes[i];
        var priceElement=cartBox.getElementsByClassName("cart-price")[0];
        var quantityElement=cartBox.getElementsByClassName("cart-quantity")[0];
        var price=parseFloat(priceElement.innerText.replace('Rs.',''));
        var quantity=quantityElement.value;
        total=total+price*quantity;
        //Console.log(price,quantity,total);
        //If Price Contain Some Point's/Paisa's Value
        total=Math.round(total*100)/100;
        document.getElementsByClassName("total-price")[0].innerText="Rs."+total;
        //Save Total to localstorage
        localStorage.setItem("cartTotal",total);
    }
}


//Keep Item in cart when page refresh with localStorage
function saveCartItems(){
    var cartContent=document.getElementsByClassName("cart-content")[0];
    var cartBoxes=cartContent.getElementsByClassName("cart-box");
    var cartItems=[];
    for(var i=0;i<cartBoxes.length;i++){
        cartBox=cartBoxes[i];
        var titleElement = cartBox.getElementsByClassName("cart-product-title")[0].innerText;
        var priceElement = cartBox.getElementsByClassName("cart-price")[0].innerText;
        var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0].value;
        var productImg=cartBox.getElementsByClassName("cart-img")[0].src;
        var item={
            title:titleElement,
            price:priceElement,
            quantity:quantityElement,
            productImg:productImg,
        }
        cartItems.push(item);
    }
    localStorage.setItem("cartItems",JSON.stringify(cartItems));
}

//Loads IN Cart
function loadCartItems(){
    var cartItems=localStorage.getItem('cartItems');
    if(cartItems){
        cartItems=JSON.parse(cartItems);
    for (var i=0;i<cartItems.length;i++){
        var item=cartItems[i];
        addProductToCart(item.title,item.price,item.productImg);

    var cartBoxes= document.getElementsByClassName("cart-box");
    var cartBox=cartBoxes[cartBoxes.length-1];
    var quantityElement=cartBox.getElementsByClassName("cart-quantity")[0];
    quantityElement.value=item.quantity;
        }
    }
    var cartTotal=localStorage.getItem("cartTotal");
    if(cartTotal){
        document.getElementsByClassName("total-price")[0].innerText="Rs."+cartTotal;
    }
    updateCartIcon();
}

//Quantity in Cart Icon
function updateCartIcon(){
    var cartBoxes=document.getElementsByClassName("cart-box");
    var quantity=0;
    for(var i=0;i<cartBoxes.length;i++){
        var cartBox=cartBoxes[i];
        var quantityElement=cartBox.getElementsByClassName("cart-quantity")[0];
        quantity=quantity+parseInt(quantityElement.value);
        //Console.log(quantity);
    }
    var cartIcon=document.getElementById("cart-icon");
    let cart=document.querySelector(".cart");
    let closeCart=document.querySelector("#close-cart");
    cartIcon.setAttribute("data-quantity",quantity);
    if(quantity==0){
        cart.style.display="none";
        closeCart.style.display="none";
        cartIcon.onclick=()=>{
            alert("Your cart is empty");
        }
    }
    else{
        cartIcon.onclick=()=>{
            cart.classList.add("active");
        };
        closeCart.onclick=()=>{
            cart.classList.remove("active");
        }
    }
}

// function clearCart(){
//     var cartContent=document.getElementsByClassName("cart-content")[0];
//     cartContent.innerHTML='';
//     updateTotal();
//     localStorage.removeItem("cartItems");

// }