const express = require('express');
const  mongoose=require('mongoose');
const jwt = require('jsonwebtoken');

const stripe=require('stripe');
const path=require('path');

require('dotenv').config()
const app = express();

app.use(express.urlencoded({extended:false}));

const publicpath=path.join(__dirname,'public')

const DetailModel=require('./database');
const { error } = require('console');


// privateRoute()

app.set('view engine','ejs');
app.use(express.static(publicpath));
app.use(express.json());


app.get('/landingpage',(req,res)=>{
    res.render('Landing Page');
});
app.get('/order',(req,res)=>{
    res.render('main.ejs');
});
app.get('/main.ejs',(req,res)=>{
    res.render('main.ejs');
});

app.get('/success',(req,res)=>{
    res.render('Success.ejs');
});

app.get('/cancel',(req,res)=>{
    res.render('Failed.ejs');
});

let stripeGateway=stripe(process.env.stripe_api);
let DOMAIN=process.env.DOMAIN;
app.post('/stripe-checkout',async (req,res)=>{
    const lineIems=req.body.items.map((item)=>{
        const unitAmount=parseInt(item.price.replace(/[^0-9]/g,'')*100);
        console.log('item-price : ',item.price);
        console.log('unitAmount : ',unitAmount);
        return {
            price_data:{
                currency:'inr',
                product_data:{
                    name:item.title,
                    images:[item.productImg]
                },
                unit_amount:unitAmount
            },
            quantity:item.quantity
        }
    })
    console.log('lineIems : ',lineIems);
    //Create Checkout Session
    const session=await stripeGateway.checkout.sessions.create({
        payment_method_types:['card'],
        line_items:lineIems,
        mode:'payment',
        success_url:`${DOMAIN}/success`,
        cancel_url:`${DOMAIN}/cancel`,
        billing_address_collection:'required'
    });
    res.json(session.url);
})


app.get("/registration.ejs" ,(req,res)=>{
    res.render("registration.ejs");
})

app.post("/registration" , async function (req, res) {
    
    let data=new DetailModel({
        name: req.body.name,
        email: req.body.email,
        password:req.body.password,
    });
    if(req.body.password===req.body.Confirm_Password){
        let result=await data.save();
        res.render("login.ejs");
    }
    else{
        res.status(400).json({ error: "password doesn't match" });alert("password does not match");
    }
})

app.get("/" ,(req,res)=>{
    res.render("Landing Page");
})
app.get("/login.ejs" ,(req,res)=>{
    res.render("login.ejs");
})
app.post("/login" , async function (req, res) {
    try{
        const check=await DetailModel.findOne({email:req.body.email});
        if(!check){
            res.status(400).json({ error: "User doesn't exist" });
        }
        else if(check.password===req.body.password){
            const token = jwt.sign({ email: check.email, userId: check._id }, 'your_secret_key');
            
            res.send(
                `<script>
                    localStorage.setItem('token', '${token}');
                    window.location.href = '/landingpage';
                </script>`
            );
            // res.render("Landing Page");
        }
        else{
            // window.location.href = '/login.ejs';
            res.status(400).json({ error: "Wrong Credientials" });
        }
    }
    catch(error){
        res.send("Wrong Credentials");
    }

    });
    

app.listen(3000,()=>{
    console.log("Listening On Port 3000");
})
