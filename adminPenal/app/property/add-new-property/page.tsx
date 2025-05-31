'use client'
import { MainContext } from "@/app/context/context";
import axios from "axios";
import Select from 'react-select';
import { useContext, useEffect, useState } from "react";
import { createFromNextReadableStream } from "next/dist/client/components/router-reducer/fetch-server-response";

export default function newPropertyAdd() {
    const { BASE_URL, tostymsg, users, allUser } = useContext(MainContext) as any;
    const [showImg, setShowImg] = useState<string>('')
    const [propertyType, setPropertyType] = useState<string>('')

    const formHendler = async (event: any) => {
        event.preventDefault();
        const formData = new FormData() as any;

        if (event.target.maltipleImage.files.length == 1) {
            formData.append('maltipleImage', event.target.maltipleImage.files[0] ?? null);
        } else {
            for (var img of event.target.maltipleImage.files) {
                formData.append('maltipleImage', img)
            }
        }
        if (event.target.video.files.length > 0) {
            formData.append('video', event.target.video.files[0] ?? null);
        }
        if (event.target.document.files.length > 0) {
            formData.append('document', event.target.document.files[0] ?? null);
        }

        formData.append('title', event.target.title.value);
        formData.append('user_Id', event.target.user_Id.value);
        formData.append('mainImage', event.target.mainImage.files[0] ?? null);
        formData.append('category', event.target.category.value);
        formData.append('area', event.target.area.value);
        formData.append('propertyType', event.target.elements.propertyType.value);
        if (event.target.price) {
            formData.append('price', event.target.price.value);
        } else {
            formData.append('rentDetails.monthlyRent', event.target.rent.value);
        }
        formData.append('address', event.target.address.value);
        formData.append('city', event.target.city.value);
        formData.append('state', event.target.state.value);
        formData.append('short_description', event.target.short_description.value);
        formData.append('long_description', event.target.long_description.value);
        // formData.append('rentDetails.rentStart', new Date());
        // formData.append('rentDetails.expiredOn', new Date());
        formData.append('rentDetails.status', false);



        await axios.post(BASE_URL + '/property/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(
            (success) => {
                tostymsg(success.data.msg, success.data.status)
                if (success.data.status == 1) {
                    event.target.reset();
                    setShowImg('')
                    // router.push('/property')
                }
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    }
    useEffect(
        () => {
            allUser()
        }, []
    )
    return (
        <>
            <form action="" className="bg-gray-200 w-2/3 mx-auto p-6 rounded shadow" onSubmit={formHendler}>
                <h2 className="text-2xl font-semibold mb-6">Add New Property</h2>

                <div className="mb-4">
                    <label className="mb-1 font-medium" htmlFor="title">Title</label>
                    <div className="flex gap-2">
                        <input type="text" id="title" name="title" className=" border-2 rounded px-3 py-2" placeholder="Enter title" />
                        <Select name="user_Id" options={users?.map((data, index) => {
                            return { value: data._id, label: data.name }
                        })} />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 p-4 bg-white shadow-md rounded-lg">

                    <div>
                        <label htmlFor="mainImage" className="block mb-2 text-sm font-medium text-gray-700">
                            📷 Main Image <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="file"
                            id="mainImage"
                            name="mainImage"
                            required
                            onChange={(e) => setShowImg(URL.createObjectURL(e.target.files[0]))}
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                        />
                        {showImg && (
                            <img
                                src={showImg}
                                alt="Preview"
                                className="mt-3 w-full h-40 object-cover rounded border"
                            />
                        )}
                    </div>

                    <div>
                        <label htmlFor="maltipleImage" className="block mb-2 text-sm font-medium text-gray-700">
                            🖼️ Other Images <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="file"
                            id="maltipleImage"
                            name="maltipleImage"
                            multiple
                            required
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                        />
                    </div>

                    {/* Video Upload */}
                    <div>
                        <label
                            htmlFor="video"
                            className="block mb-2 text-sm font-semibold text-gray-700"
                        >
                            🎥 Video Tour
                        </label>
                        <input
                            type="file"
                            id="video"
                            name="video"
                            accept="video/*"
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Document Upload */}
                    <div>
                        <label
                            htmlFor="document"
                            className="block mb-2 text-sm font-semibold text-gray-700"
                        >
                            📄 Upload Property Document
                        </label>
                        <input
                            type="file"
                            id="document"
                            name="document"
                            accept=".pdf,.doc,.docx"
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                </div>



                <div className="mb-4">
                    <label className="mb-1 font-medium" htmlFor="category">Category</label>
                    <div className="flex gap-2">
                        <input type="text" id="category" name="category" className="w-full border-2 rounded px-3 py-2" />
                        <select name="propertyType"
                            onChange={(e) => setPropertyType(e.target.value)}
                            className="w-full md:w-48 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="rent">Rent</option>
                            <option value="buy">Buy</option>
                            {/* <option value="sell">Sell</option> */}
                        </select>
                    </div>
                </div>
                {
                    propertyType == 'buy' ?
                        <div className="mb-4">
                            <label className="mb-1 font-medium" htmlFor="price">Price</label>
                            <input type="text" id="price" name="price" className="w-full border-2 rounded px-3 py-2" placeholder="Enter price" />
                        </div> :
                        <div className="mb-4">
                            <label className="mb-1 font-medium" htmlFor="rent">Monthly Rent</label>
                            <input type="number" id="rent" name="rent" className="w-full border-2 rounded px-3 py-2" placeholder="Enter rent" />
                        </div>
                }
                <div className="mb-4">
                    <label className="mb-1 font-medium" htmlFor="area">Area</label>
                    <input type="text" id="area" name="area" className="w-full border-2 rounded px-3 py-2" placeholder="Enter area" />
                </div>


                <div className="mb-6">
                    <label className="mb-1 font-medium" htmlFor="location">Location</label>
                    <div className="flex gap-2">
                        <input type="text" id="address" name="address" className="border-2 rounded px-3 py-2" placeholder="Enter address" />
                        <input type="text" id="city" name="city" className="border-2 rounded px-3 py-2" placeholder="Enter city" />
                        <input type="text" id="state" name="state" className="border-2 rounded px-3 py-2" placeholder="Enter state" />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="mb-1 font-medium" htmlFor="short_description">Short Description</label>
                    <input type="text" id="short_description" name="short_description" className="w-full border-2 rounded px-3 py-2" placeholder="Enter short description" />
                </div>
                <div className="mb-6">
                    <label className="mb-1 font-medium" htmlFor="long_description">Long Description</label>
                    <input type="text" id="long_description" name="long_description" className="w-full border-2 rounded px-3 py-2" placeholder="Enter long description" />
                </div>
                <div className="text-center">
                    <button type="submit" className="bg-blue-500 m-auto text-white px-6 py-2 rounded hover:bg-blue-600 transition">
                        Add Property
                    </button>
                </div>
            </form>
        </>
    )
}