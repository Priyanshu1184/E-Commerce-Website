const  mongoose=require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/StyleVista')
.then(()=>{
    console.log("Connection Successfull");
})
.catch(()=>{
    console.log("Connection Failed");
})
const DetailSchema = new mongoose.Schema({
    name: {type:String, required:true},
    email: {type:String, required:true},
    password: {type:String, required:true},
});

const DetailModel=mongoose.model('details',DetailSchema);
module.exports=DetailModel;