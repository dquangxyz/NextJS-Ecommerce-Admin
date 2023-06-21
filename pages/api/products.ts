import { NextApiRequest, NextApiResponse } from 'next';
import {Product} from '@/models/Product';
import { mongooseConnect } from '@/lib/mongoose';

interface IProduct {
  _id: string;
  title: string;
  description: string;
  price: number;
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method } = req;
    await mongooseConnect();
    
    if (method === 'GET'){
      res.json(await Product.find())
    } else if (method === 'POST'){
      const { title, description, price } : IProduct = req.body;
      const productDoc = await Product.create({title, description, price})
      res.json(productDoc);
    } else if (method === 'PUT') {
      const { title,description,price,_id } : IProduct = req.body;
      await Product.updateOne({_id}, { title,description,price });
      res.json(true);
    }

  } catch (error) {
    // Handle any errors that occurred during processing
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
