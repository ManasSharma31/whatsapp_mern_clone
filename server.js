
//import 
import express from 'express';
import mongoose from 'mongoose';
import Room from './dbMessages.js';
import Pusher from 'pusher';
import cors from 'cors';


//app config
const app=express();
const port=process.env.PORT || 9000;


//middleware

app.use(express.json()); //This helps us to parse the dtata coming in the json format
app.use(cors());   //To provide access

//database config
mongoose.connect("mongodb+srv://admin-manas:atlas31@cluster0.vgb0t.mongodb.net/whatsappDB?retryWrites=true&w=majority",{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
});
mongoose.set('useFindAndModify', false);

const pusher = new Pusher({
    appId: "1213076",
    key: "9d91118879f492872072",
    secret: "52cb12288cd76e901792",
    cluster: "ap2",
    useTLS: true
  });

const db=mongoose.connection;
db.once("open",()=>{
    console.log("Db is connected");

    const roomCollection=db.collection("roomcollections");
    const changeStream2=roomCollection.watch();
    changeStream2.on("change",(change)=>{
        const da=change.fullDocument;
        if(change.operationType==="insert")
        {
            console.log(da);
            pusher.trigger("rooms","inserted",{
                name:da.name,
                _id:da._id

            });
        }
        else if(change.operationType==="update")
        {
            pusher.trigger("rooms","updated",{
                messages:change.updateDescription.updatedFields,

            });

        }
        else
        {
            console.log("Error Trigerring Pushern");
        }
    })
   

})




app.get("/room/sync",function(req,res){
    Room.find(function(err,data){
        if(err)
        {
            res.status(500).send(err)
        }
        else{
            res.status(200).send(data);
        }
    })
})
app.get("/roomname/:id",function(req,res){
    const id=req.params.id;

    Room.find({_id:id},function(err,data){
        if(err)
        {
            res.status(500).send(err)
        }
        else{
            res.status(200).send(data);
        }
    })

});
app.post("/roomname/:id",function(req,res)
{
    const ob=req.body;
    const id=req.params.id;
    console.log('Inside Id');
    Room.findOneAndUpdate({_id:id},{$push:{messages:ob}},function(err,data){
        if(err)
        {
            res.status(500).send(err)
        }
        else{
            
            res.status(200).send(data);
        }
    });
    });

app.post("/room",function(req,res){
    const ob=req.body;
    Room.create(ob,function(err,data){
        if(err)
        {
            res.status(500).send(err);
        }
        else{
            res.status(200).send(data);
        }
    })
})


app.listen(port , ()=>console.log(`server listening at :${port}`));