
import  express from 'express'
import { GetData } from '../controllers/DataController.js'


const router=express.Router()

router.get('/get_data',GetData)


export default router