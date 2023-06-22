"use client"
import { useState } from "react";
import axios from "axios";
import { redirect } from "next/navigation";

export default function NewProductForm() {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [price, setPrice] = useState<string>('');

    const [goToProduct, setGoToProduct] = useState<boolean>(false);

    const handleAddNewProduct = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const data = { title, description, price };
      await axios.post('/api/products', data)
      setGoToProduct(true);
    }

    const uploadImages = async (e : React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target?.files;
      if (files && files.length > 0){
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          data.append('file', file);
        }
        const res = await axios.post('/api/upload', data); // just upload the photo and show
        console.log(res.data);
      }
    }

    if (goToProduct){
      return redirect ('/products')
    }
    
  return (
    <form onSubmit={handleAddNewProduct}>
        <div className="flex flex-col">
          <label className="text-blue-900">Product name</label>
          <input className="px-1 mb-2" type="text" placeholder="Product name" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="flex flex-col">
          <label>Description</label>
          <textarea className="px-1 mb-2" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
        </div>
        <div className="flex flex-col">
          <label>Price (in USD)</label>
          <input className="px-1 mb-2" type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div className="flex flex-col">
          <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <div>
              Add image
            </div>
            <input type="file" onChange={uploadImages} className="hidden"/>
          </label>
        </div>
        <button type="submit" className="bg-blue-900 text-white px-4 py-1 rounded-md">Save</button>
    </form>
  )
}
