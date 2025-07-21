import express from 'express'
import dotenv from 'dotenv'
import DbConnetion from './config/DbConnetion.js';
import router from './routes/homeRoute.js';
import path from 'path'
    
dotenv.config()



const frontendpath=path.join(__dirname,'../frontend/dist')
const app=express();
 DbConnetion()

app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use('/api/v1',router)

const port =process.env.PORT || 4000

app.get('*',(req,res)=>{
    res.sendFile(frontendpath,'index.html')
})
app.listen(port,()=>{
    console.log(`Server is running on ${port}`)
})