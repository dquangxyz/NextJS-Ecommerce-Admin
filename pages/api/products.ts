import { NextApiRequest, NextApiResponse } from 'next';
import {Product} from '@/models/Product';
import { mongooseConnect } from '@/lib/mongoose';

interface IProduct {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  images: string[];
  properties: { [key: string] : string }
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method } = req;
    await mongooseConnect();
    
    if (method === 'GET'){
      res.json(await Product.find())
    } else if (method === 'POST'){
      const { title, description, category, price, images, properties} : IProduct = req.body;
      const productDoc = await Product.create({ title, description, category, price, images, properties })
      res.json(productDoc);
    } else if (method === 'PUT') {
      const { title,description, category, price, images,_id, properties } : IProduct = req.body;
      await Product.updateOne({_id}, { title,description,category,price,images, properties });
      res.json(true);
    } else if (method === 'DELETE') {
      if (req.query?.id) {
        await Product.deleteOne({_id:req.query?.id});
        res.json(true);
      }
    }

  } catch (error) {
    // Handle any errors that occurred during processing
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
