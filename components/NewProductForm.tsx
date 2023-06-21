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
        <button type="submit" className="bg-blue-900 text-white px-4 py-1 rounded-md">Save</button>
    </form>
  )
}
