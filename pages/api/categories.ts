import { Category } from '@/models/Category';
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from "mongoose";
import { mongooseConnect } from '@/lib/mongoose';
import { authOptions, isAdminRequest } from './auth/[...nextauth]';

interface ICategory {
    name: string,
    parentCategory: mongoose.Types.ObjectId | null
    properties: { 
        name: string,
        values: string[] 
    }
}
  
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    await mongooseConnect();
    await isAdminRequest(req,res);
    
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
