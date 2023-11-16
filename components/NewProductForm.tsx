"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import { redirect } from "next/navigation";

interface CategoryItem {
  _id: string;
  name: string;
  parentCategory: CategoryItem
};

export default function NewProductForm() {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [category,setCategory] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [images, setImages] = useState<string[]>([]);
    const [categories,setCategories] = useState<CategoryItem[]>([]);

    const [imgLoadingStatus, setImgLoadingStatus] = useState<boolean>(false);

    const [goToProduct, setGoToProduct] = useState<boolean>(false);

    useEffect(() => {
      setImages(images);

      const fetchCategoryData = async () => {
        const res = await axios.get('/api/categories');
        setCategories(res.data);
      }
      fetchCategoryData();
    }, [images]);

    const handleAddNewProduct = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const data = { title, description, category, price, images };
      await axios.post('/api/products', data)
      setGoToProduct(true);
    }

    const uploadImages = async (e : React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target?.files;
      if (files && files.length > 0){
        setImgLoadingStatus(true);
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          data.append('file', file);
        }
        const res = await axios.post('/api/upload', data); // just upload the photo and show
        const newImageUrls = res.data.links;
        setImages(prev => [...prev, ...newImageUrls]);
        setImgLoadingStatus(false);
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
          <label>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">Uncategorized</option>
            {categories.length > 0 && categories.map((c:CategoryItem) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label>Price (in USD)</label>
          <input className="px-1 mb-2" type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div className="flex flex-col">
          {imgLoadingStatus ? <p>Uploading images...</p> :
            <>
              {images.length > 0 && images.map((link, index) => {
                return (
                  <div key={index} className="h-24 p-5">
                    <img src={link} alt="uploaded photo successfully" />
                    <p>{link}</p>
                  </div>
                );
              })}
            </>    
          }
          <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <div>Add image</div>
            <input type="file" onChange={uploadImages} className="hidden"/>
          </label>
        </div>
        <button type="submit" className="bg-blue-900 text-white px-4 py-1 rounded-md">Save</button>
    </form>
  )
}
