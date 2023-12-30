import { NextApiRequest, NextApiResponse } from 'next';
import multiparty from 'multiparty';
import fs from 'fs';
import mime from 'mime-types';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { mongooseConnect } from '@/lib/mongoose';
import { isAdminRequest } from './auth/[...nextauth]';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    await mongooseConnect();
    await isAdminRequest(req,res);

    const form = new multiparty.Form();
    const client = new S3Client({
        region: 'ap-southeast-2',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        }
    });
    const links:string[] = [];

    form.parse(req, (err, fields, files)=>{
        for (let i=0; i<files.file.length; i++){
            const file = files.file[i];
            const ext = file.originalFilename.split('.').pop();
            const newFilename = Date.now() + '.' + ext;

            client.send(new PutObjectCommand({
                Bucket: 'nextjs-ecommerce-dquangxyz',
                Key: newFilename,
                Body: fs.readFileSync(file.path),
                ACL: 'public-read',
                ContentType: mime.lookup(file.path).toString(),
            }));

            const link = `https://nextjs-ecommerce-dquangxyz.s3.amazonaws.com/${newFilename}`;
            links.push(link);
        }
        res.json({links});
    })    
}

export const config = {
    api: {bodyParser: false}
}