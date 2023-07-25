"use client"
import React from 'react'
import Layout from "@/components/Layout";
import Link from "next/link";
import {useEffect, useState} from "react";
import axios from "axios";

function Categories() {
    const [name, setName] = useState<string>("");
    const saveCategory = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await axios.post('/api/categories', {
            name: name
        });
        setName("");
    };

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
            </div>
            <div className="flex gap-1">     
                <button type="submit" className="bg-blue-900 text-white px-4 py-1 rounded-md">Save</button>
            </div>
        </form>
    </Layout>
  )
}

export default Categories