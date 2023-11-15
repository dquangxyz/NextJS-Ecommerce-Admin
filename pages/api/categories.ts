import { Category } from '@/models/Category';
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from "mongoose";
import { mongooseConnect } from '@/lib/mongoose';

interface ICategory {
    name: string,
    parentCategory: mongoose.Types.ObjectId
}
  
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    await mongooseConnect();
    
    if (method === 'GET'){
        res.json(await Category.find().populate('parentCategory'));
    } else if (method === 'POST'){
        const { name, parentCategory } : ICategory = req.body;
        const categoryDoc = await Category.create({
            name: name,
            parentCategory: parentCategory
        });
        res.json(categoryDoc);
    } else if (method === 'PUT') {
        const { _id,name,parentCategory } = req.body;
        const categoryDoc = await Category.updateOne({_id},{
            name: name,
            parentCategory: parentCategory
        });
        res.json(categoryDoc);
    } else if (method === 'DELETE') {
        // if (req.query?._id) {
        //     await Category.deleteOne({_id:req.query?.id});
        //     res.json(true);
        // }
        const {_id} = req.query;
        await Category.deleteOne({_id});
        res.json('ok');
    }
}
