'use client'
import React, { useContext, useEffect, useState } from 'react';
import { MainContext } from '../context/context';
import axios from 'axios';
import { FaTrashAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const AdminBannerPanel = () => {
    const { BASE_URL, tostymsg, viewBanner, banner } = useContext(MainContext);
    const [addBanner, setAddBanner] = useState(false);
    const [new_Img, setNew_Img] = useState();
    const [previewURL, setPreviewURL] = useState('');
    const [category, set_Category] = useState('home');
    const [total, setTotal] = useState(10);


    const activeBanner = banner?.filter(img => img.isPublished == true);

    // status_change part
    const statusChange = async (id, num) => {
        await axios.patch(BASE_URL + `/banner/status-change/${id}`, { num }).then(
            (success) => {
                tostymsg(success.data.msg, success.data.status)
                if (success.data.status == 1) {
                    viewBanner();
                }
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    }

    // save_Img part
    const save_Img = async () => {
        const formData = new FormData();
        formData.append('bannerImage', new_Img);
        formData.append('banner_Category', category);
        await axios.post(BASE_URL + `/banner/create`, formData).then(
            (success) => {
                tostymsg(success.data.msg, success.data.status)
                if (success.data.status == 1) {
                    setPreviewURL('')
                    viewBanner();
                }
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    }

    // delete banner part
    const deleteBanner = async (id) => {

        await axios.delete(BASE_URL + `/banner/delete/${id}`).then(
            (success) => {
                tostymsg(success.data.msg, success.data.status)
                if (success.data.status == 1) {
                    viewBanner();
                }
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    }

    useEffect(() => {
        viewBanner();
    }, []);

    return (
        <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg">
            {
                !addBanner ?
                    <>
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                            <h2 className="text-3xl font-semibold text-gray-800">Manage Banners</h2>
                            <button onClick={() => setAddBanner(true)} className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-md transition-all">
                                + Add Banner
                            </button>
                        </div>

                        {/* Current Banners Section */}
                        <section className="mb-10">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4">Current Banners</h3>
                            {activeBanner && activeBanner.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {activeBanner.map((img, index) => (
                                        <div key={index} className="bg-gray-100 relative rounded-lg overflow-hidden border hover:shadow-lg transition">
                                            <img
                                                src={img.bannerImage}
                                                alt={`Banner ${index + 1}`}
                                                className="w-full h-48 object-cover"
                                            />
                                            <p className='text-center'>{img.banner_Category}</p>
                                            <button disabled={!img.isPublished} className={`hover:bg-gray-400 rounded-full text-center p-1 text-sm font-medium absolute top-1 right-1 ${!img.isPublished ? 'text-red-300 cursor-not-allowed' : 'text-red-500'}`} onClick={() => status_change(img._id, 0)}>❌</button>
                                        </div>

                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No current banners available.</p>
                            )}
                        </section>

                        {/* All Banners Section */}
                        <section className="mb-10">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4">All Banners</h3>
                            {banner && banner.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {banner.slice(0, total).map((img) => (
                                        <div
                                            key={img._id}
                                            className="relative bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
                                        >
                                            <img
                                                src={img.bannerImage}
                                                alt="Banner"
                                                className="w-full h-48 object-cover"
                                            />
                                            <p className='text-center'>{img.banner_Category}</p>

                                            {/* Action Overlay */}
                                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-4">
                                                {/* Remove */}
                                                <button
                                                    onClick={() => statusChange(img._id, 0)}
                                                    disabled={!img.isPublished}
                                                    className="p-2 rounded-full bg-white bg-opacity-75 hover:bg-opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <FaTimesCircle className={`w-6 h-6 ${img.isPublished ? 'text-red-500' : 'text-red-300'}`} />
                                                </button>

                                                {/* Add */}
                                                <button
                                                    onClick={() => statusChange(img._id, 1)}
                                                    disabled={img.isPublished}
                                                    className="p-2 rounded-full bg-white bg-opacity-75 hover:bg-opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <FaCheckCircle className={`w-6 h-6 ${img.isPublished ? 'text-green-300' : 'text-green-600'}`} />
                                                </button>

                                                {/* Delete */}
                                                <button
                                                    onClick={() => deleteBanner(img._id)}
                                                    className="p-2 rounded-full bg-white bg-opacity-75 hover:bg-opacity-100"
                                                >
                                                    <FaTrashAlt className="w-6 h-6 text-gray-700 hover:text-red-600" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No banners available.</p>
                            )}
                            <div className="text-center mt-4">
                                <button className="text-blue-500 hover:underline font-medium text-sm" onClick={() => setTotal(total + 5)}>View More</button>
                            </div>
                        </section>
                    </>
                    :
                    <div className="bg-white rounded-lg p-6 border shadow-md max-w-md mx-auto">
                        <button
                            onClick={() => setAddBanner(false)}
                            className="mb-4 text-sm text-red-500 hover:underline"
                        >
                            ← Cancel
                        </button>

                        <label className="block text-gray-700 font-medium mb-2">
                            Upload Banner Image
                        </label>

                        <div className='flex items-center'>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => (setNew_Img(e.target.files[0]), setPreviewURL(URL.createObjectURL(e.target.files[0])))}
                                className="mb-4 w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                            />
                            <select onChange={(e) => set_Category(e.target.value)} className="w-full md:w-32 px-2 py-1 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="home">Home</option>
                                <option value="jaipur">Jaipur</option>
                                <option value="service">Service</option>
                                <option value="blog">Blog</option>
                                <option value="contact">Contact</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-600 text-sm mb-2">Preview:</p>
                            {
                                previewURL ?
                                    <img
                                        src={previewURL}
                                        alt="Banner preview"
                                        className="w-full h-48 object-cover rounded border"
                                    />
                                    : ''
                            }
                        </div>
                        <button
                            onClick={save_Img}
                            className={`w-full py-2 px-4 rounded bg-green-500 hover:bg-green-600 font-medium transition`}
                        >
                            Upload
                        </button>
                    </div>
            }
        </div>
    );
};

export default AdminBannerPanel;
