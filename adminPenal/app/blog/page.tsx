'use client'
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { MainContext } from '../context/context';
import Link from 'next/link';


const AdminBlogList = () => {
    const { BASE_URL, tostymsg, viewBlog, blog } = useContext(MainContext);

    const statusChange = (id) => {
        axios.put(BASE_URL + `/blog/status-change?id=${id}`).then(
            (success) => {
                tostymsg(success.data.msg, success.data.status);
                viewBlog()
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    }
    const deleteBlog = (id) => {
        axios.delete(BASE_URL + `/blog/delete/${id}`).then(
            (success) => {
                tostymsg(success.data.msg, success.data.status);
                viewBlog()
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    }


    useEffect(
        () => {
            viewBlog()
        }, []
    )
    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className='flex justify-between my-2 items-center'>
                <h1 className="text-xl font-bold text-gray-500">All Blog Posts</h1>
                <div className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 mx-5 rounded transition">
                    <Link href={'blog/add-blog'}>
                        + Add New
                    </Link>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow border rounded-lg">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">S.NO.</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Image</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Title</th>
                            {/* <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Published</th> */}
                            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Created At</th>
                            <th className="py-3 px-4 text-center font-semibold text-sm text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(blog) &&
                            blog?.map((post, index) => (
                                <tr key={post._id} className="border-t hover:bg-gray-50 transition">
                                    <td className="py-3 px-4 text-sm">{index + 1}</td>
                                    <td className="px-4 py-2 border">
                                        <img src={post.mainImage} alt="property" className="w-12 h-12 object-cover rounded" />
                                    </td>
                                    <td className="py-3 px-4 text-sm">{post.title}</td>
                                    {/* <td className="py-3 px-4 text-sm">{post.isPublished ? "Yes" : "No"}</td> */}
                                    <td className="py-3 px-4 text-sm">{new Date(post.createdAt).toLocaleDateString()}</td>
                                    <td className="py-3 px-4 text-sm text-center">
                                        <button onClick={() => statusChange(post._id)} className={`${post.status ? 'bg-blue-500' : 'bg-red-500'}  text-white px-4 py-1 mx-5 rounded transition`}>
                                            {post.status ? 'IN' : "OUT"}
                                        </button>
                                        <button
                                            onClick={() => deleteBlog(post._id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 mx-5"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                                        >
                                            <Link href={`blog/edit-blog/${post._id}`}>
                                                Edit
                                            </Link>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminBlogList;
