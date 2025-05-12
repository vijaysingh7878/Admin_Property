'use client'
import React, { useContext, useState } from 'react';
import axios from 'axios';
import { MainContext } from '@/app/context/context';
import { useRouter } from 'next/navigation';

export default function CreateBlog() {
    const { tostymsg, BASE_URL } = useContext(MainContext);
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [longDescription, setLongDescription] = useState('');
    const [mainImage, setMainImage] = useState(null);

    const handleFileChange = (e) => {
        setMainImage(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('short_description', shortDescription);
        formData.append('long_description', longDescription);
        formData.append('mainImage', mainImage);

        axios.post(BASE_URL + '/blog/create', formData, {
            headers: {
                Authorization: `${localStorage.getItem('adminToken')}`,
            },
        }).then((response) => {
            tostymsg(response.data.msg, response.data.status);
            router.push('/blog')
        }).catch((error) => {
            console.error(error);
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-center mb-6">Create New Blog Post</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Content */}
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
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
                        type="text"
                        value={shortDescription}
                        onChange={(e) => setShortDescription(e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Long Description */}
                <div>
                    <label htmlFor="longDescription" className="block text-sm font-medium text-gray-700">Long Description</label>
                    <textarea
                        id="longDescription"
                        value={longDescription}
                        onChange={(e) => setLongDescription(e.target.value)}
                        rows="6"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Main Image */}
                <div>
                    <label htmlFor="mainImage" className="block text-sm font-medium text-gray-700">Main Image</label>
                    <input
                        id="mainImage"
                        name='mainImage'
                        type="file"
                        onChange={handleFileChange}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Submit Button */}
                <div className="text-center">
                    <button
                        type="submit"
                        className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Create Blog Post
                    </button>
                </div>
            </form>
        </div>
    );
}
