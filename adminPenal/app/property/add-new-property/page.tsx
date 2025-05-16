'use client'
import { MainContext } from "@/app/context/context";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

export default function newPropertyAdd() {
    const { BASE_URL, tostymsg } = useContext(MainContext);
    const [showImg, setShowImg] = useState('')

    const router = useRouter();
    const formHendler = (event) => {
        event.preventDefault();
        console.log(event.target.elements.propertyType.value);

        const formData = new FormData();

        if (event.target.otherImage.files.length == 1) {
            formData.append('maltipleImage', event.target.otherImage.files[0] ?? null);
        } else {
            for (var img of event.target.otherImage.files) {
                formData.append('maltipleImage', img)
            }

        }

        formData.append('title', event.target.title.value);
        formData.append('agentId', event.target.agentId.value);
        formData.append('mainImage', event.target.image.files[0] ?? null);
        formData.append('category', event.target.category.value);
        formData.append('propertyType', event.target.elements.propertyType.value);
        formData.append('price', event.target.price.value);
        formData.append('area', event.target.area.value);
        formData.append('city', event.target.city.value);
        formData.append('state', event.target.state.value);
        formData.append('short_description', event.target.short_description.value);
        formData.append('long_description', event.target.long_description.value);

        axios.post(BASE_URL + '/property/create', formData).then(
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
    return (
        <>
            <form action="" className="bg-gray-200 w-2/3 mx-auto p-6 rounded shadow" onSubmit={formHendler}>
                <h2 className="text-2xl font-semibold mb-6">Add New Property</h2>

                <div className="mb-4">
                    <label className="mb-1 font-medium" htmlFor="title">Title</label>
                    <div className="flex gap-2">
                        <input type="text" id="title" name="title" className="w-full border-2 rounded px-3 py-2" placeholder="Enter title" />
                        <input type="text" id="agentId" name="agentId" className="w-full border-2 rounded px-3 py-2" placeholder="Enter agentId" />

                    </div>
                </div>

                <div className="mb-4">
                    <label className="mb-1 font-medium" htmlFor="image">Main Image</label>
                    <input type="file" id="image" onChange={(e) => setShowImg(URL.createObjectURL(e.target.files[0]))} name="image" required className="w-full border-2 rounded px-3 py-2" />
                    {
                        showImg ?
                            <img src={showImg} alt="main image" />
                            :
                            ''
                    }
                </div>

                <div className="mb-4">
                    <label className="mb-1 font-medium" htmlFor="otherImage">Other Images</label>
                    <input type="file" id="otherImage" multiple required name="otherImage" className="w-full border-2 rounded px-3 py-2" />
                </div>

                <div className="mb-4">
                    <label className="mb-1 font-medium" htmlFor="category">Category</label>
                    <div className="flex gap-2">
                        <input type="text" id="category" name="category" className="w-full border-2 rounded px-3 py-2" />
                        <select name="propertyType"
                            className="w-full md:w-48 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">--</option>
                            <option value="buy">Buy</option>
                            <option value="sell">Sell</option>
                            <option value="rent">Rent</option>
                        </select>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="mb-1 font-medium" htmlFor="price">Price</label>
                    <input type="text" id="price" name="price" className="w-full border-2 rounded px-3 py-2" placeholder="Enter price" />
                </div>

                <div className="mb-6">
                    <label className="mb-1 font-medium" htmlFor="location">Location</label>
                    <div className="flex gap-2">
                        <input type="text" id="area" name="area" className="border-2 rounded px-3 py-2" placeholder="Enter area" />
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