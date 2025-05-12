'use client'
import React, { use, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { MainContext } from '@/app/context/context';
import { useRouter } from 'next/navigation';

export default function EditBlog({ params }) {
    const { id } = use(params)
    const { BASE_URL, tostymsg, viewBlog, blog } = useContext(MainContext);
    const router = useRouter();


    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', e.target.title.value);
        formData.append('content', e.target.content.value);
        formData.append('short_description', e.target.short_description.value);
        formData.append('long_description', e.target.long_description.value);
        if (e.target.mainImage.files[0]) {
            formData.append('mainImage', e.target.mainImage.files[0]);
        }

        axios.put(BASE_URL + `/blog/edit-blog/${id}`, formData).then((response) => {
            tostymsg(response.data.msg, response.data.status);
            router.push('/blog')

        }).catch((error) => {
            console.error(error);
        });
    };
    useEffect(
        () => {
            viewBlog(id)
        }, [id]
    )

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-center mb-6">Edit Blog Post</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        id="title"
                        name='title'
                        type="text"
                        defaultValue={blog?.title}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Content */}
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                    <textarea
                        id="content"
                        name='content'
                        defaultValue={blog?.content}
                        required
                        rows="6"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Tags */}
                {/* <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
                    <input
                        id="tags"
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div> */}

                {/* Short Description */}
                <div>
                    <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700">Short Description</label>
                    <input
                        id="shortDescription"
                        name='short_description'
                        type="text"
                        value={blog?.short_description}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Long Description */}
                <div>
                    <label htmlFor="longDescription" className="block text-sm font-medium text-gray-700">Long Description</label>
                    <textarea
                        id="longDescription"
                        name='long_description'
                        defaultValue={blog?.long_description}
                        rows="6"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Main Image */}
                <div>
                    <label htmlFor="mainImage" className="block text-sm font-medium text-gray-700">Main Image</label>
                    <input
                        id="mainImage"
                        defaultValue={blog?.mainImage}
                        type="file"
                        name='mainImage'
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Submit Button */}
                <div className="text-center">
                    <button
                        type="submit"
                        className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Save Post
                    </button>
                </div>
            </form>
        </div>
    );
}
