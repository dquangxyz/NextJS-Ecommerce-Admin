"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import { redirect } from "next/navigation";
import Image from 'next/image';
import { ReactSortable } from "react-sortablejs";

interface ProductItem {
    _id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    images: string[];
    properties: { [key:string] : string }
}
interface EditProductFormProps {
    productId: string;
}
interface ItemType {
  id: number;
  name: string;
}
interface CategoryItem {
  _id: string;
  name: string;
  parentCategory: CategoryItem;
  properties: Array<{ [key: string]: string[] }>
};

export default function EditProductForm({productId}: EditProductFormProps) {
    const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

    const [title, setTitle] = useState<string>(selectedProduct?.title || 'test');
    const [description, setDescription] = useState<string>(selectedProduct?.description || '');
    const [category,setCategory] = useState<string>(selectedProduct?.category || '');
    const [price, setPrice] = useState<Number>(selectedProduct?.price || 0);
    const [images, setImages] = useState<string[]>([]);
    const [imagesOrder, setImagesOrder] = useState<ItemType[]>([]);
    const [imgLoadingStatus, setImgLoadingStatus] = useState<boolean>(false);
    const [categories,setCategories] = useState<CategoryItem[]>([]);
    const [refreshPage, setRefreshPage] = useState<boolean>(false);

    const [productProperties,setProductProperties] = useState<{ [key: string]: string }>(selectedProduct?.properties || {});

    useEffect(() => {
      const fetchProductsData =  async () => {
        try {
            const res =  await axios.get<ProductItem[]>('/api/products');
            const data = res.data;
            const product = data.find(item => item._id === productId);
            setSelectedProduct(product || null);
            setTitle(product?.title || '');
            setDescription(product?.description || '');
            setCategory(product?.category || '');
            setPrice(product?.price || 0);
            setImages(product?.images || []);
            setImagesOrder(product?.images.map((item, index) => ({ 
              id: index, 
              name: item
            })) || []);
            setProductProperties(product?.properties || {})
        } catch (error) {
            console.log('Error fetching products:', error);
        }
      }
      fetchProductsData();
    }, [productId]);

    useEffect(() => {
      const fetchCategoryData = async () => {
        const res = await axios.get('/api/categories');
        setCategories(res.data);
      }
      fetchCategoryData();
    },[]);

    const handleEditProduct = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const data = { _id: productId, title, description, category, price, images, properties: productProperties };
      try {
        await axios.put('/api/products/', data);
        setRefreshPage(true);
      } catch (error) {
        console.log('Error updating product:', error);
      }
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

    const setProductProp = (propName: string, value: string) => {
      setProductProperties(prev => {
        const newProductProps = {...prev};
        newProductProps[propName] = value;
        return newProductProps;
      });
    }
    

    const propertiesToFill : Array< {[key: string]: string[] }> = [];
    if (categories.length > 0 && category) {
      // show children's properties
      let catInfo = categories.find(({_id}) => _id === category);
      if (catInfo){
        propertiesToFill.push(...catInfo.properties);

        // show parent's properties
        while(catInfo?.parentCategory?._id) {
          const parentCat = categories.find(({_id}) => _id === catInfo?.parentCategory?._id);
          if (parentCat){
            propertiesToFill.push(...parentCat.properties);
            catInfo = parentCat;
          }    
        }
      }  
    }

    if (refreshPage){
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

        <div className="flex flex-row gap-3">
          <div className="flex flex-col">
            <label>Category</label>
          </div>
          <div className="flex flex-col">
            <select value={category} onChange={e => setCategory(e.target.value)}>
              <option value="">Uncategorized</option>
              {categories.length > 0 && categories.map((c:CategoryItem) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {propertiesToFill.length > 0 && propertiesToFill.map((property, index) => (
          <div key={index} className="flex gap-3">
            <label>{property.name}</label>
            <div>
              <select value={productProperties[property.name.toString()]} 
                onChange={(e) => {
                  setProductProp(property.name.toString(), e.target.value)
                  console.log("tttt", productProperties[property.name.toString()])
                }}
              >
                {property.values.map(value => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>
          </div>
        ))}

        <div className="flex flex-col">
          <label>Price (in USD)</label>
          <input className="px-1 mb-2" type="number" placeholder="Price" value={price.toString()} onChange={(e) => setPrice(Number(e.target.value))} />
        </div>
        <div className="flex flex-col">
          {imgLoadingStatus ? <p>Uploading images...</p> :
            <ReactSortable 
              list={imagesOrder}
              setList={setImagesOrder} 
            >
              {imagesOrder.length > 0 && imagesOrder.map((link, index) => {
                return (
                  <div key={link.id} className="h-24 p-5">
                    {/* <img src={link} alt="uploaded photo" /> */}
                    <Image
                      src={link.name}
                      width={100}
                      height={140}
                      alt="uploaded photo"
                      unoptimized={false}
                    />
                    <a href={link.name}>{link.name}</a>
                  </div>
                );
              })}
            </ReactSortable>   
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
