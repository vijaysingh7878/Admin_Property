'use client'
import { MdLogout } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "@/redux/reducer/AdminSlice";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { MainContext } from "../context/context";
import { usePathname, useRouter } from "next/navigation";



export default function AdminHeader() {
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const admin = useSelector(state => state.admin.data);
    const { tostymsg } = useContext(MainContext);
    const logoutHendler = () => {
        router.push('/login')
        dispatch(logout());
    }
    const [showAdmin, setShowAdmin] = useState(false);
    const [showEditBtn, setShowEditBtn] = useState(false);
    const [selectImg, setSelectImg] = useState(false);
    const showAdminDetails = () => {
        setShowAdmin(true)
    }

    // edit admin part
    const editAdminHendler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', e.target.name.value)
        formData.append('adminProfile', e.target.adminProfile.files[0] ?? null)
        formData.append('phone', e.target.phone.value)
        formData.append('email', e.target.email.value)
        formData.append('location', e.target.location.value)

        axios.patch(`http://localhost:5001/admin/admin-update/${admin._id}`, formData, {
            headers: {
                Authorization: `${localStorage.getItem("adminToken")}`
            }
        }).then(
            (success) => {
                dispatch(login({
                    admin: success.data.admin
                }))
                tostymsg(success.data.msg, success.data.status);
                setShowEditBtn(false);
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    }

    return (
        <header className="flex justify-between items-center px-6 py-4  bg-gradient-to-l from-blue-400 to-blue-300 text-white font-semibold border-b border-gray-300 shadow-sm">
            <h1 className="text-2xl font-bold">Admin Panel</h1>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 cursor-pointer hover:text-black transition-transform ease-in-out" onClick={showAdminDetails}>
                    {/* Avatar section */}
                    <div className="relative w-12 h-12 text-white rounded-full overflow-hidden">
                        {
                            admin?.profile_Photo ?
                                <Image
                                    src={admin?.profile_Photo}
                                    alt={`${admin?.name} profile photo`}
                                    width={50}
                                    height={50}
                                    className="object-cover w-full h-full"
                                />
                                :
                                <div className="flex items-center justify-center w-full h-full bg-white bg-opacity-60">
                                    <FaUserAlt className="text-2xl text-blue-500" />
                                </div>
                        }
                    </div>

                    {/* Admin name section */}
                    <div className="flex flex-col">
                        <span className="font-semibold text-lg">{admin?.name}</span>
                    </div>
                </div>


                {/* View Admin Details */}
                <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center w-full min-h-full ${showAdmin ? 'block' : 'hidden'}`}>
                    <div className="bg-white rounded-lg shadow-xl w-1/3 p-6 relative">
                        <button
                            onClick={() => (setShowAdmin(false), setShowEditBtn(false))}
                            className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl"
                        >
                            ×
                        </button>
                        {
                            showEditBtn
                                ?
                                <form onSubmit={editAdminHendler}
                                    className="max-w-md mx-auto p-6 bg-white text-gray-700 rounded-md shadow-md space-y-6"
                                >
                                    <h2 className="text-2xl font-semibold text-gray-700">Edit</h2>

                                    <div className="flex flex-col items-center">
                                        <input
                                            type="file"
                                            id="adminProfile"
                                            name="adminProfile"
                                            accept="image/*"
                                            onChange={(e) => setSelectImg(URL.createObjectURL(e.target.files[0]))}
                                            className="mt-1 w-full text-sm text-gray-500 hidden"
                                        />
                                        <label htmlFor="adminProfile" className="relative text-center">
                                            <img src={selectImg ? selectImg : admin?.profile_Photo} alt="Photo" className="w-28 h-28 cursor-pointer rounded-full object-cover border" />
                                            <span className="absolute top-0 left-0 bg-black w-full min-h-full text-white opacity-0 hover:opacity-45 rounded-full duration-300 cursor-pointer flex justify-center items-center font-bold">Edit</span>
                                        </label>
                                        {/* <span className="text-red-400 hover:text-red-500 mt-2 cursor-pointer">remove</span> */}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            defaultValue={admin?.name}
                                            required
                                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            defaultValue={admin?.phone}
                                            required
                                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            defaultValue={admin?.email}
                                            required
                                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            defaultValue={admin?.location}
                                            required
                                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowEditBtn(false)}
                                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                                :
                                <div className="flex flex-col items-center text-center bg-white p-6 rounded-xl w-full max-w-md mx-auto space-y-4 transition-all">
                                    <div className="w-28 h-28 relative">
                                        <Image
                                            src={admin?.profile_Photo}
                                            alt="Admin profile"
                                            fill
                                            className="rounded-full object-cover shadow-md"
                                        />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-gray-800">{admin.name}</h2>
                                    <div className="text-sm text-gray-600 w-full text-left space-y-2">
                                        <p><span className="font-semibold text-gray-700">📧 Email:</span> {admin.email}</p>
                                        <p><span className="font-semibold text-gray-700">📞 Phone:</span> {admin.phone}</p>
                                        <p><span className="font-semibold text-gray-700">📍 Location:</span> {admin.location}</p>
                                    </div>
                                    <button onClick={() => setShowEditBtn(true)} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-semibold transition-all shadow hover:shadow-lg">
                                        ✏️ Edit Profile
                                    </button>
                                </div>
                        }

                    </div>
                </div>

                <div
                    onClick={logoutHendler}
                    className="flex items-center gap-2 cursor-pointer hover:text-red-600 transition-all"
                >
                    <span>Logout</span>
                    <div className="bg-red-500 text-white p-2 rounded-full transition">
                        <MdLogout />
                    </div>
                </div>
            </div>
        </header>
    )
}
