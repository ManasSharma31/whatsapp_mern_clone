
//import 
import express from 'express';
import mongoose from 'mongoose';
import Messages,{Room} from './dbMessages.js';
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

    const roomCollection=db.collection("roomschemas");
    const changeStream2=roomCollection.watch();

    const messageCollections=db.collection("messageschemas");  //mongoose automatically converts the name of the collection to plural with all lowercase
    const changeStream=messageCollections.watch();

    changeStream.on("change",(change)=>{
        const details=change.fullDocument;
        if(change.operationType==="insert")
        {
            pusher.trigger("messages","inserted",{
                message:details.message,
                name:details.name,
                time:details.time,
                received:details.received

            });
        }
        else
        {
            console.log("Error Trigerring Pushern");
        }
    })

    changeStream2.on("change",(change)=>{
        const da=change.fullDocument;
        if(change.operationType==="insert")
        {
            pusher.trigger("rooms","inserted",{
                name:da.name,

            });
        }
        else
        {
            console.log("Error Trigerring Pushern");
        }
    })

})




app.get('/',function(req,res){
    res.status(200).send("Hello");
});

app.get("/messages/sync",function(req,res){
    Messages.find(function(err,data){
        if(err)
        {
            res.status(500).send(err)
        }
        else{
            res.status(200).send(data);
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
    console.log('Inside Id');
    const id=req.params.id;
    console.log(id);
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

app.post("/messages/new",function(req,res){
    const ob=req.body;
    Messages.create(ob,function(err,data){
        if(err)
        {
            res.status(500).send(err);
        }
        else{
            res.status(200).send(data);
        }
    })
})
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