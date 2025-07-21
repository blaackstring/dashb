import mongoose from 'mongoose'


const Dbconnection =async()=>{

    try {
        
        console.log(process.env.MONGO_URL);
        
        await mongoose.connect(`${process.env.MONGO_URL}`);
        console.log('Db connected');
        
        
    } catch (error) {
        console.error('Error while Connecting DB',error)
        process.exit(1)
    }
}

export  default Dbconnection;