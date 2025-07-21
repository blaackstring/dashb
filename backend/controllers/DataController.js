
import Insight from "../model/data.model.js";

export const GetData=async(req,res)=>{

    try {
       const data= await Insight.find()
       if(data.length<=0){
        return res.status(404).send({message:'data not found',success:false})
       }
        console.log(data);
   
       res.status(200).send({data,message:'Data successfully Fetched',success:true})
        
    } catch (error) {
        res.status(500).send({message:'Error while Sending data',success:false})
    }
}