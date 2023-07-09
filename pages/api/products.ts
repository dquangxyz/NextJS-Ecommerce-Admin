import { NextApiRequest, NextApiResponse } from 'next';
import {Product} from '@/models/Product';
import { mongooseConnect } from '@/lib/mongoose';

interface IProduct {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method } = req;
    await mongooseConnect();
    
    if (method === 'GET'){
      res.json(await Product.find())
    } else if (method === 'POST'){
      const { title, description, price, images } : IProduct = req.body;
      const productDoc = await Product.create({title, description, price, images})
      res.json(productDoc);
    } else if (method === 'PUT') {
      const { title,description,price, images,_id } : IProduct = req.body;
      await Product.updateOne({_id}, { title,description,price,images });
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
