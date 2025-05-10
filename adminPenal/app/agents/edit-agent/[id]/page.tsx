'use client'
import { MainContext } from "@/app/context/context";
import axios from "axios";
import { use, useContext, useEffect, useState } from "react";

export default function EditAgents({ params }) {
    const { id } = use(params)
    const { tostymsg, allAgent, agents } = useContext(MainContext);
    const [selectImg, setSelectImg] = useState(null)


    // remove profile photo start
    const removeProfilePhoto = () => {
        if (agents?.profile_Photo) {
            axios.put(`https://admin-property.onrender.com/agent/remove-profile?id=${id}`).then(
                (success) => {
                    tostymsg(success.data.msg, success.data.status)
                    agentsRead()
                }
            ).catch(
                (error) => {
                    tostymsg(error.data.msg, error.data.status)
                    console.log(error);
                }
            )
        } else if (selectImg) {
            setSelectImg(null)
        }
    }
    useEffect(
        () => {
            allAgent('', id)
        }, []
    )
    // agents update part
    const agentsEditHendler = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', event.target.name.value)
        formData.append('agentProfile', event.target.profilePhoto.files[0] ?? null)
        formData.append('phone', event.target.phone.value)
        formData.append('email', event.target.email.value)
        formData.append('location', event.target.location.value)

        axios.patch(`https://admin-property.onrender.com/agent/agent-update/${id}`, formData).then(
            (success) => {
                tostymsg(success.data.msg, success.data.status)
                router.push('/agents')
                event.target.reset()
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    }
    return (
        <form onSubmit={agentsEditHendler}
            className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md space-y-6"
        >
            <h2 className="text-2xl font-semibold text-gray-700">Edit</h2>

            <div className="flex flex-col items-center">
                <input
                    type="file"
                    id="profilePhoto"
                    name="profilePhoto"
                    accept="image/*"
                    onChange={(e) => setSelectImg(URL.createObjectURL(e.target.files[0]))}
                    className="mt-1 w-full text-sm text-gray-500 hidden"
                />
                <label htmlFor="profilePhoto" className="relative text-center">
                    <img src={selectImg ? selectImg : agents?.profile_Photo} alt="Photo" className="w-28 h-28 cursor-pointer rounded-full object-cover border" />
                    <span className="absolute top-0 left-0 bg-black w-full min-h-full text-white opacity-0 hover:opacity-45 rounded-full duration-300 cursor-pointer flex justify-center items-center font-bold">Edit</span>
                </label>
                <span className="text-red-400 hover:text-red-500 mt-2 cursor-pointer" onClick={() => removeProfilePhoto()}>remove</span>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                    type="text"
                    name="name"
                    defaultValue={agents?.name}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                    type="tel"
                    name="phone"
                    defaultValue={agents?.phone}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    name="email"
                    defaultValue={agents?.email}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                    type="text"
                    name="location"
                    defaultValue={agents?.location}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
            >
                Save
            </button>
        </form>
    )
}