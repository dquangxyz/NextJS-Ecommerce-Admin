import { Category } from '@/models/Category';
import { NextApiRequest, NextApiResponse } from 'next';

interface ICategory {
    name: string,
}
  
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    
    if (method === 'GET'){
        res.json(await Category.find());
    } else if (method === 'POST'){
        const { name } : ICategory = req.body;
        const categoryDoc = await Category.create({
            name: name,
        });
        res.json(categoryDoc);
    } else if (method === 'PUT') {
        res.json("put")
    } else if (method === 'DELETE') {
        res.json("delete")
    }
}
