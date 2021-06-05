import mongoose from 'mongoose';

const messageSchema=mongoose.Schema({
    
});
const roomSchema=mongoose.Schema({
    name:String,
    messages:[{
        "name":String,
    "message":String,
    "time":String,
    "received":Boolean
    }]
})
const Room=mongoose.model('roomcollections',roomSchema);
export default Room


//"messageschema" is the name that will be shown in the database where all the message will be stored. That is the name of the collections