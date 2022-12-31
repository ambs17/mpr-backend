const mongoose = require('mongoose');
const dotenv = require('dotenv');
//const mongo = process.env.MONGO_URI||'mongodb://127.0.0.1:27017/BooksApp';
//const mongo = "mongodb+srv://mprmongodb:mprmongodb@mpr.0bb0uvi.mongodb.net/?retryWrites=true&w=majority"
const mongo = "mongodb+srv://mprmongodb:mprmongodb@cluster0.n7wzvvx.mongodb.net/?retryWrites=true&w=majority"

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