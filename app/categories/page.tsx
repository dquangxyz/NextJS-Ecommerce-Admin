"use client"
import React from 'react'
import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import { redirect } from "next/navigation";
import axios from "axios";


interface CategoryItem {
    _id: string;
    name: string;
    parentCategory: CategoryItem
};

export default function Categories() {
    // local state
    const [name, setName] = useState<string>("");
    const [parentCategory,setParentCategory] = useState<string>("");
    const [categoriesList, setCategoriesList] = useState<CategoryItem[]>([]);

    const [editedCategory, setEditedCategory] = useState<CategoryItem>();

    const [selectedDeleteCategory, setSelectedDeleteCategory] = useState<CategoryItem | null>();
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

    const [refreshPage, setRefreshPage] = useState<boolean>(false);

    const fetchCategories = async () => {
        await axios.get('/api/categories').then(res => {
            setCategoriesList(res.data);
        });
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // define helper functions
    const saveCategory = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (editedCategory){
            await axios.put('/api/categories', {
                _id: editedCategory._id,
                name: name,
                parentCategory: parentCategory
            });
        } else {
            await axios.post('/api/categories', {
                name: name,
                parentCategory: parentCategory
            });
        }
        
        setName("");
        fetchCategories();
    };

    const editCategory = (category: CategoryItem) => {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parentCategory?._id);
    };

    const handleOpenModal = (category: CategoryItem) => {
        setShowDeleteModal(true);
        setSelectedDeleteCategory(category);
    };
    
    const handleConfirmDelete = async (confirmed: boolean) => {
        if (confirmed) {
            await axios.delete('/api/categories?_id='+selectedDeleteCategory?._id);
            setRefreshPage(true);
        }
        setShowDeleteModal(false);
        setSelectedDeleteCategory(null);
    };

    if (refreshPage){
        return redirect ('/categories')
    }

  return (
    <Layout>
        <h1>Categories</h1>
        <label>{editedCategory? `Edit category ${editedCategory.name}`: 'Create new category'}</label>
        <form onSubmit={saveCategory}>
            <div className="flex gap-1">
                <input
                    type="text"
                    placeholder='Category name'
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />
                <select className='mb-0' 
                    value={parentCategory} 
                    onChange={(e) => setParentCategory(e.target.value)}
                >
                    <option value="">No parent category</option>
                    {categoriesList.map(category => (
                        <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
                </select>
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
                    <td>{category.parentCategory ? category.parentCategory.name : 'N/A'}</td>
                    <td>
                        <button onClick={() => editCategory(category)} className="btn-light-blue">Edit</button>
                        <button onClick={() => handleOpenModal(category)} className="btn-red">Delete</button>
                    </td>
                </tr>
            ))}

            </tbody>
        </table>

        {showDeleteModal && (
            <div className="modal">
                <div className="modal-content">
                    <h2>Confirm Delete</h2>
                    <p>Are you sure you want to delete this category (id: ${selectedDeleteCategory?._id} )?</p>
                    <div className="modal-buttons">
                    <button onClick={() => handleConfirmDelete(true)}>Yes</button>
                    <button onClick={() => handleConfirmDelete(false)}>No</button>
                    </div>
                </div>
            </div>
        )}
    </Layout>
  )
}