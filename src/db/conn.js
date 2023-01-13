const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const mongo = process.env.MONGO_URI||'mongodb://127.0.0.1:27017/mpr';
const connectDB = async () => {
    try{
        mongoose.connect(mongo,
             {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
            .then(() => console.log('MongoDB connected'))
            .catch(err => console.log(err));
    
    
    }
    catch(err){
        console.log(err);
    }
}

connectDB();