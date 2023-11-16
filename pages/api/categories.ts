import { Category } from '@/models/Category';
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from "mongoose";
import { mongooseConnect } from '@/lib/mongoose';

interface ICategory {
    name: string,
    parentCategory: mongoose.Types.ObjectId
    properties: { 
        name: string,
        values: string[] 
    }
}
  
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    await mongooseConnect();
    
    if (method === 'GET'){
        res.json(await Category.find().populate('parentCategory'));
    } else if (method === 'POST'){
        const { name, parentCategory, properties } : ICategory = req.body;
        const categoryDoc = await Category.create({
            name,
            parentCategory,
            properties
        });
        res.json(categoryDoc);
    } else if (method === 'PUT') {
        const { _id, name, parentCategory, properties } = req.body;
        console.log("prop", properties)
        const categoryDoc = await Category.updateOne({_id},{
            name,
            parentCategory,
            properties
        });
        res.json(categoryDoc);
    } else if (method === 'DELETE') {
        const {_id} = req.query;
        await Category.deleteOne({_id});
        res.json(true);
    }
}
