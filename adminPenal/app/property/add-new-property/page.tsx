'use client'
import { MainContext } from "@/app/context/context";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

export default function newPropertyAdd() {
    const { BASE_URL, tostymsg } = useContext(MainContext);
    const [showImg, setShowImg] = useState()

    const router = useRouter();
    const formHendler = (event) => {
        event.preventDefault();
        const formData = new FormData();

        if (event.target.otherImage.files.length == 1) {
            formData.append('maltipleImage', event.target.otherImage.files[0] ?? null);
        } else {
            for (var img of event.target.otherImage.files) {
                formData.append('maltipleImage', img)
            }

        }

        formData.append('title', event.target.title.value);
        formData.append('mainImage', event.target.image.files[0] ?? null);
        formData.append('category', event.target.category.value);
        formData.append('price', event.target.price.value);
        formData.append('area', event.target.area.value);
        formData.append('district', event.target.district.value);
        formData.append('state', event.target.state.value);
        formData.append('description', event.target.description.value);

        axios.post(BASE_URL + '/property/create', formData).then(
            (success) => {
                tostymsg(success.data.msg, success.data.status)
                event.target.reset();
                router.push('/property')
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
                    <input type="text" id="title" name="title" className="w-full border-2 rounded px-3 py-2" placeholder="Enter title" />
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
                    <input type="text" id="category" name="category" className="w-full border-2 rounded px-3 py-2" />
                </div>

                <div className="mb-4">
                    <label className="mb-1 font-medium" htmlFor="price">Price</label>
                    <input type="text" id="price" name="price" className="w-full border-2 rounded px-3 py-2" placeholder="Enter price" />
                </div>

                <div className="mb-6">
                    <label className="mb-1 font-medium" htmlFor="location">Location</label>
                    <div className="flex gap-2">
                        <input type="text" id="location" name="area" className="border-2 rounded px-3 py-2" placeholder="Enter area" />
                        <input type="text" id="district" name="district" className="border-2 rounded px-3 py-2" placeholder="Enter district" />
                        <input type="text" id="state" name="state" className="border-2 rounded px-3 py-2" placeholder="Enter state" />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="mb-1 font-medium" htmlFor="description">Description</label>
                    <input type="text" id="description" name="description" className="w-full border-2 rounded px-3 py-2" placeholder="Enter description" />
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