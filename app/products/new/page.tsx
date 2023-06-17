"use client"
import Layout from "@/components/Layout"
import { useState } from "react";

export default function NewProduct() {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [price, setPrice] = useState<string>('');

  return (
    <Layout>
        <h1 className="text-blue-900 mb-2 text-xl">New Product</h1>
        <label className="text-blue-900">Product name</label>
        <input className="px-1 mb-2" type="text" placeholder="Product name"/>
        <label>Description</label>
        <textarea className="px-1 mb-2" placeholder="Description"></textarea>
        <label>Price (in USD)</label>
        <input className="px-1 mb-2" type="number" placeholder="Price"/>
        <button className="bg-blue-900 text-white px-4 py-1 rounded-md">Save</button>
    </Layout>
  )
}
