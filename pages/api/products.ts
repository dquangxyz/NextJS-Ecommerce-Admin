import { NextApiRequest, NextApiResponse } from 'next';
import {Product} from '@/models/Product';
import { mongooseConnect } from '@/lib/mongoose';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method } = req;
    await mongooseConnect();
    

    if (method === 'POST'){
        const { title, description, price } = req.body;
        const productDoc = await Product.create({title, description, price})
        res.json(productDoc);
    }

  } catch (error) {
    // Handle any errors that occurred during processing
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
