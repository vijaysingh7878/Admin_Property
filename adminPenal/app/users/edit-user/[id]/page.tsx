'use client'
import { MainContext } from "@/app/context/context";
import axios from "axios";
import { useRouter } from "next/navigation";
import { use, useContext, useEffect, useState } from "react";

export default function EditUser({ params }) {
    const { id } = use(params)
    const { BASE_URL, tostymsg } = useContext(MainContext);
    const router = useRouter();
    const [user, setUser] = useState()
    const [selectImg, setSelectImg] = useState(null)

    // user read part
    const userRead = async () => {
        await axios.get(BASE_URL + `/user/read?id=${id}`, {
            headers: {
                Authorization: `${localStorage.getItem("adminToken")}`
            }
        }).then(
            (success) => {
                setUser(success.data.users);
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    }
    // remove profile photo start
    const removeProfilePhoto = () => {
        if (user?.profile_Photo) {
            axios.put(BASE_URL + `/user/remove-profile?id=${id}`).then(
                (success) => {
                    tostymsg(success.data.msg, success.data.status)
                    userRead()
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
            userRead()
        }, []
    )
    // user update part
    const userEditHendler = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', event.target.name.value)
        formData.append('userProfile', event.target.profilePhoto.files[0] ?? null)
        formData.append('phone', event.target.phone.value)
        formData.append('email', event.target.email.value)
        formData.append('location', event.target.location.value)

        axios.patch(BASE_URL + `/user/user-update/${id}`, formData).then(
            (success) => {
                tostymsg(success.data.msg, success.data.status)
                router.push('/users')
                event.target.reset()
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    }
    return (
        <form onSubmit={userEditHendler}
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
                    <img src={selectImg ? selectImg : user?.profile_Photo} alt="Photo" className="w-28 h-28 cursor-pointer rounded-full object-cover border" />
                    <span className="absolute top-0 left-0 bg-black w-full min-h-full text-white opacity-0 hover:opacity-45 rounded-full duration-300 cursor-pointer flex justify-center items-center font-bold">Edit</span>
                </label>
                <span className="text-red-400 hover:text-red-500 mt-2 cursor-pointer" onClick={() => removeProfilePhoto()}>remove</span>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                    type="text"
                    name="name"
                    defaultValue={user?.name}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                    type="tel"
                    name="phone"
                    defaultValue={user?.phone}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    name="email"
                    defaultValue={user?.email}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                    type="text"
                    name="location"
                    defaultValue={user?.location}
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