'use client'
import { MainContext } from "@/app/context/context";
import axios from "axios";
import { useRouter } from "next/navigation";
import { use, useContext, useEffect, useState } from "react";

export default function EditProperty({ params }) {
    const { id } = use(params);
    const { tostymsg, propertyShow, readProperty } = useContext(MainContext)
    const [showImg, setShowImg] = useState()
    const router = useRouter();

    // updateForm part
    const updateForm = (event) => {
        event.preventDefault();

        const formData = new FormData();

        if (event.target.otherImage.files.length == 1) {
            formData.append('otherImage', event.target.otherImage.files[0]);
        } else {
            for (var img of event.target.otherImage.files) {
                formData.append('otherImage', img)
            }

        }
        formData.append('title', event.target.title.value);
        formData.append('image', event.target.image.files[0] ?? null);
        formData.append('category', event.target.category.value);
        formData.append('price', event.target.price.value);
        formData.append('area', event.target.area.value);
        formData.append('district', event.target.district.value);
        formData.append('state', event.target.state.value);
        formData.append('description', event.target.description.value);

        axios.put(`https://admin-property.onrender.com/property/edit-property/${id}`, formData).then(
            (success) => {
                tostymsg(success.data.msg, success.data.status)
                router.push('/property')
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    }
    const deleteOtherImg = (url) => {
        axios.patch(`https://admin-property.onrender.com/property/edit-property/${id}`, { url }).then(
            (success) => {
                tostymsg(success.data.msg, success.data.status)
                property()
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    }
    useEffect(
        () => {
            propertyShow('', '', id)
        }, [id]
    )
    return (
        <>
            <form action="" className="bg-gray-200 w-2/3 mx-auto p-6 rounded shadow" onSubmit={updateForm}>
                <h2 className="text-2xl font-semibold mb-6">Edit Property</h2>

                <div className="mb-4">
                    <label className="mb-1 font-medium" htmlFor="title">Title</label>
                    <input type="text" defaultValue={readProperty?.title} id="title" name="title" className="w-full border-2 rounded px-3 py-2" placeholder="Enter title" />
                </div>

                <div className="mb-4">
                    <label className="mb-1 font-medium" htmlFor="image">Image</label>
                    <input onChange={(e) => setShowImg(URL.createObjectURL(e.target.files[0]))} type="file" id="image" defaultValue={readProperty?.mainImage} name="image" className="w-full border-2 rounded px-3 py-2" />
                    {
                        showImg ?
                            <img src={showImg} alt="main image" className="p-2" />
                            :
                            <img src={readProperty?.mainImage} alt="main image" className="p-2" />
                    }
                </div>

                <div className="mb-4">
                    <label className="mb-1 font-medium" htmlFor="otherImage">Other Images</label>
                    <input type="file" id="otherImage" multiple defaultValue={readProperty?.maltipleImage} name="otherImage" className="w-full border-2 rounded px-3 py-2" />

                    <div className="flex gap-2 flex-wrap justify-between">
                        {
                            readProperty?.maltipleImage?.map(
                                (url, index) => {
                                    console.log(url);

                                    return (
                                        <div className="relative" key={index}>
                                            <img src={url} alt="other image" className="w-40 p-2" />
                                            <span onClick={() => deleteOtherImg(url)} className="absolute top-0 right-0 bg-white font-bold rounded-full py-0.5 px-2 cursor-pointer">x</span>
                                        </div>
                                    )
                                }
                            )
                        }
                    </div>
                </div>

                <div className="mb-4">
                    <label className="mb-1 font-medium" htmlFor="category">Category</label>
                    <input type="text" defaultValue={readProperty?.category} id="category" name="category" className="w-full border-2 rounded px-3 py-2" />
                </div>

                <div className="mb-4">
                    <label className="mb-1 font-medium" htmlFor="price">Price</label>
                    <input type="text" id="price" defaultValue={readProperty?.price} name="price" className="w-full border-2 rounded px-3 py-2" placeholder="Enter price" />
                </div>

                <div className="mb-6">
                    <label className="mb-1 font-medium" htmlFor="location">Location</label>
                    <div className="flex gap-2">
                        <input type="text" id="location" defaultValue={readProperty?.area} name="area" className="border-2 rounded px-3 py-2" placeholder="Enter area" />
                        <input type="text" id="district" defaultValue={readProperty?.district} name="district" className="border-2 rounded px-3 py-2" placeholder="Enter district" />
                        <input type="text" id="state" defaultValue={readProperty?.state} name="state" className="border-2 rounded px-3 py-2" placeholder="Enter state" />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="mb-1 font-medium" htmlFor="description">Description</label>
                    <input type="text" id="description" defaultValue={readProperty?.description} name="description" className="w-full border-2 rounded px-3 py-2" placeholder="Enter description" />
                </div>
                <div className="text-center">
                    <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition">
                        Save
                    </button>
                </div>
            </form>
        </>
    )
}