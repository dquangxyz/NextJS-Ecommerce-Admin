"use client"
import React from 'react'
import Layout from "@/components/Layout";
import Link from "next/link";
import {useEffect, useState} from "react";
import axios from "axios";

interface CategoryItem {
    _id: string;
    name: string;
    parentCategory: string
}

export default function Categories() {
    // local state
    const [name, setName] = useState<string>("");
    // const [parentCategory,setParentCategory] = useState<string>("");
    const [categoriesList, setCategoriesList] = useState<CategoryItem[]>([]);

    useEffect(() => {
        axios.get('/api/categories').then(res => {
            setCategoriesList(res.data);
        });
    }, []);

    // define helper functions
    const saveCategory = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await axios.post('/api/categories', {
            name: name,
        });
        setName("");
    };

    const editCategory = (e: CategoryItem) => {console.log("edit button clicked")};
    const deleteCategory = (e: CategoryItem) => {console.log("delete button clicked")}; 

  return (
    <Layout>
        <h1>Categories</h1>
        <label>New category name</label>
        <form onSubmit={saveCategory}>
            <div className="flex gap-1">
                <input
                    type="text"
                    placeholder='Category name'
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />
                {/* <select onChange={ev => setParentCategory(ev.target.value)} value={parentCategory}>
                    <option value="">No parent category</option>
                    {categoriesList.map(category => (
                        <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
                </select> */}
            </div>
            <div className="flex gap-1">     
                <button type="submit" className="bg-blue-900 text-white px-4 py-1 rounded-md">Save</button>
            </div>
        </form>

        <table className="basic mt-4">
            <thead>
            <tr>
                <td>Category name</td>
                <td>Parent category</td>
                <td></td>
            </tr>
            </thead>
            <tbody>
            {categoriesList.map(category => (
                <tr key={category._id}>
                    <td>{category.name}</td>
                    <td>{category.name}</td>
                    <td>
                        <button onClick={() => editCategory(category)} className="btn-light-blue">Edit</button>
                        <button onClick={() => deleteCategory(category)} className="btn-red">Delete</button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    </Layout>
  )
}