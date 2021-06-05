import mongoose from 'mongoose';

const messageSchema=mongoose.Schema({
    "name":String,
    "message":String,
    "time":String,
    "received":Boolean
});
const roomSchema=mongoose.Schema({
    name:String
})
const Room=mongoose.model('roomSchema',roomSchema);
export {Room};
export default mongoose.model('messageSchema',messageSchema);


//"messageschema" is the name that will be shown in the database where all the message will be stored. That is the name of the collections