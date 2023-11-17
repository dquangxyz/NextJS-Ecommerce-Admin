"use client"
import React from 'react'
import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import { redirect } from "next/navigation";
import axios from "axios";

interface ICategoryItem {
    _id: string;
    name: string;
    parentCategory: ICategoryItem | null
};

interface IProperty {
    name: string;
    values: string;
}

export default function Categories() {
    // local state
    const [name, setName] = useState<string>("");
    const [parentCategory,setParentCategory] = useState<string | null>("");
    const [categoriesList, setCategoriesList] = useState<ICategoryItem[]>([]);

    const [editedCategory, setEditedCategory] = useState<ICategoryItem>();

    const [selectedDeleteCategory, setSelectedDeleteCategory] = useState<ICategoryItem | null>();
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

    const [properties,setProperties] = useState<IProperty[]>([]);

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
                parentCategory: parentCategory === "" ? null : parentCategory,
                properties: properties.map(p => ({
                    name:p.name,
                    values:p.values.split(','),
                }))
            });
        } else {
            await axios.post('/api/categories', {
                name: name,
                parentCategory: parentCategory === "" ? null : parentCategory,
                properties: properties.map(p => ({
                    name:p.name,
                    values:p.values.split(','),
                }))
            });
        }  
        setName("");
        setParentCategory('');
        setProperties([]);
        fetchCategories();
    };

    const editCategory = (category: ICategoryItem) => {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parentCategory ? category.parentCategory._id : null);
    };

    const handleOpenModal = (category: ICategoryItem) => {
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

    // functions handle Properties
    const addProperty = () => {
        setProperties(prev => {
            return [...prev, {name:'',values:''}];
        });
    }
    const handlePropertyNameChange = (index: number,newName:string) => {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        });
    }
    const handlePropertyValuesChange = (index: number, newValues: string) => {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        });
    }
    const removeProperty = (indexToRemove: number) => {
        setProperties(prev => {
            return [...prev].filter((property, pIndex) => {
                return pIndex !== indexToRemove;
            });
        });
    }

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
                    value={parentCategory ? parentCategory : ""} 
                    onChange={(e) => setParentCategory(e.target.value)}
                >
                    <option value="">No parent category</option>
                    {categoriesList.map(category => (
                        <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
                </select>
            </div>

            <div className="mb-2">
                <label className="block">Properties</label>
                <button onClick={addProperty} type="button" className="btn-default bg-green-500 text-sm mb-2">Add new property</button>
                {properties.length > 0 && properties.map((property, index) => (
                    <div key={index} className="flex gap-1 mb-2">
                        <input type="text"
                                className="mb-0"
                                onChange={(e) => handlePropertyNameChange(index, e.target.value)}
                                value={property.name}
                                placeholder="property name (example: color)"/>
                        <input type="text"
                                className="mb-0"
                                onChange={(e)=> handlePropertyValuesChange(index, e.target.value)}
                                value={property.values}
                                placeholder="values, comma separated"/>
                        <button onClick={() => removeProperty(index)} type="button" className="btn-red">X</button>
                    </div>
                ))}
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