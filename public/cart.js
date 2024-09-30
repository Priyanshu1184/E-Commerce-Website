const payBtn=document.querySelector(".pay-btn");
payBtn.addEventListener("click",()=>{
    fetch("/stripe-checkout",{
        method:"POST",
        headers:
            new Headers({"Content-Type":"application/json"}),
        
        body:JSON.stringify({
            items:JSON.parse(localStorage.getItem("cartItems"))
        })
    })
    .then((res)=>res.json())
    .then((url)=>{
        location.href=url;
        clearCart()
    })
    .catch((error)=>{
        console.log(error);
    })
})