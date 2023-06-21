"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import { redirect } from "next/navigation";

interface ProductItem {
    _id: string;
    title: string;
    description: string;
    price: number;
}
interface EditProductFormProps {
    productId: string;
}

export default function EditProductForm({productId}: EditProductFormProps) {
    const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
    const [title, setTitle] = useState<string>(selectedProduct?.title || 'test');
    const [description, setDescription] = useState<string>(selectedProduct?.description || '');
    const [price, setPrice] = useState<Number>(selectedProduct?.price || 0);
    const [goToProduct, setGoToProduct] = useState<boolean>(false);

    useEffect(() => {
        const fetchData =  async () => {
            try {
                const res =  await axios.get<ProductItem[]>('/api/products');
                const data = res.data;
                const product = data.find(item => item._id === productId);
                setSelectedProduct(product || null);
                setTitle(product?.title || '');
                setDescription(product?.description || '');
                setPrice(product?.price || 0);
            } catch (error) {
                console.log('Error fetching products:', error);
            }
        }

        fetchData();

    }, [productId]);

    const handleEditProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = { _id: productId, title, description, price };
        try {
            await axios.put('/api/products/', data);
            setGoToProduct(true);
        } catch (error) {
            console.log('Error updating product:', error);
        }
    }

    if (goToProduct){
        return redirect ('/products')
    }

  return (
    <form onSubmit={handleEditProduct}>
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
        <input className="px-1 mb-2" type="number" placeholder="Price" value={price.toString()} onChange={(e) => setPrice(Number(e.target.value))} />
        </div>
        <button type="submit" className="bg-blue-900 text-white px-4 py-1 rounded-md">Save</button>
    </form>
  )
}
