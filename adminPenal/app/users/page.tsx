'use client'
import axios from "axios"
import { useContext, useEffect, useRef, useState } from "react"
import { MainContext } from "../context/context"
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Pagination from "../componants/Pagination";


export default function User() {
    const { BASE_URL, tostymsg, allUser, users, totalUsers, limit, skip, setSkip } = useContext(MainContext);
    const [searchUsers, setSearchUsers] = useState(null)
    const [filter, setFilter] = useState('')
    const [viewUser, setViewUser] = useState(false);
    const [userDetails, setUserDetails] = useState(false);
    const searchParams = useSearchParams()
    const role = 'user'

    const viewUserHendler = (id) => {
        axios.get(BASE_URL + `/user/read?id=${id}`, {
            headers: {
                Authorization: `${localStorage.getItem("adminToken")}`
            }
        }).then(
            (success) => {
                console.log(success.data);

                setUserDetails(success.data.users);
                setViewUser(true)
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    }
    // statusChange part
    const statusChange = (id) => {
        axios.put(BASE_URL + `/user/status-change?id=${id}`).then(
            (success) => {
                tostymsg(success.data.msg, success.data.status)
                allUser(searchUsers, filter, skip, '', role);

            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    }

    // delete User part
    const deleteUser = (id) => {
        axios.delete(BASE_URL + `/user/delete/${id}`).then(
            (success) => {
                tostymsg(success.data.msg, success.data.status)
                allUser(searchUsers, filter, skip, '', role);

            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    }


    useEffect(
        () => {
            const newValue = Number(searchParams.get('skip')) || 0
            setSkip(newValue)
            allUser(searchUsers, filter, newValue, '', role);
        }, [searchParams, searchUsers, filter]
    )

    useEffect(
        () => {
            allUser(searchUsers, filter, skip, '', role);
        }, [searchUsers, filter, skip, role]
    )
    return (
        <div className="w-full p-6 flex flex-col justify-between h-full">
            <div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-500">All Users</h2>

                    <input
                        onChange={(e) => setSearchUsers(e.target.value)}
                        type="search"
                        placeholder="Search user name or email"
                        className="border border-black px-2 py-1 rounded outline-none w-full md:w-64"
                        aria-label="Search users"
                    />

                    <select
                        className="w-full md:w-48 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={(e) => setFilter(e.target.value)}
                        aria-label="Filter users"
                    >
                        <option value="">All</option>
                        <option value="active">Active</option>
                        <option value="inActive">In Active</option>
                    </select>

                    <Link href={'users/add-user'}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    // onClick={handleAddUser}
                    >
                        Add
                    </Link>
                </div>


                <table className="min-w-full border border-gray-200 text-sm text-left mt-5">
                    <thead className="bg-gray-200 text-gray-600 uppercase ">
                        <tr>
                            <th className="px-4 py-2 border">S.NO.</th>
                            <th className="px-4 py-2 border">Profile</th>
                            <th className="px-4 py-2 border">name</th>
                            <th className="px-4 py-2 border">Phone</th>
                            <th className="px-4 py-2 border">Email</th>
                            <th className="px-4 py-2 border">Location</th>
                            <th className="px-4 py-2 border">status</th>
                            <th className="px-4 py-2 border">Edit</th>
                            <th className="px-4 py-2 border">View</th>
                            <th className="px-4 py-2 border">Delete</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {Array.isArray(users) &&
                            users?.map(
                                (data, index) => {
                                    return (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 border">{index + 1 + skip}</td>
                                            <td className="px-4 py-2 border">
                                                <img src={data.profile_Photo} alt="user" className="w-12 h-12 rounded-full object-cover" />
                                            </td>
                                            <td className="px-4 py-2 border">{data.name}</td>
                                            <td className="px-4 py-2 border">{data.phone}</td>
                                            <td className="px-4 py-2 border">{data.email}</td>
                                            <td className="px-4 py-2 border">{data.location}</td>
                                            <td className="px-4 py-2 border">
                                                <button onClick={() => statusChange(data._id)} className={`${data.status ? 'bg-blue-500' : 'bg-red-500'}  text-white px-4 py-1 rounded transition`}>
                                                    {data.status ? 'IN' : "OUT"}
                                                </button>
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <Link href={`users/edit-user/${data._id}`}>
                                                    <button className="text-blue-600 hover:underline">Edit</button>
                                                </Link>
                                            </td>
                                            <td className="px-4 py-2">
                                                <button onClick={() => viewUserHendler(data._id)} className="text-blue-600 hover:underline">view</button>

                                                {/* view property part */}
                                                <div className={`fixed inset-0 bg-black bg-opacity-20 z-50 flex items-center justify-center w-full ${viewUser ? 'block' : 'hidden'}`}>
                                                    <div className="bg-white rounded-lg shadow-xl max-h-[70%] max-w-[60%] overflow-y-auto p-6 relative">
                                                        <button
                                                            onClick={() => setViewUser(false)}
                                                            className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl"
                                                        >
                                                            ×
                                                        </button>

                                                        <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg">
                                                            {/* Profile Image */}
                                                            <div className="flex flex-col items-center">
                                                                <div className="w-32 h-32 relative mb-4">
                                                                    <Image src={userDetails?.profile_Photo || 'user'}
                                                                        alt="Admin Profile"
                                                                        fill
                                                                        className="rounded-full object-cover shadow-lg border-4 border-gray-200"
                                                                    />
                                                                </div>
                                                                <h2 className="text-3xl font-bold text-gray-800 mb-1">{userDetails?.name}</h2>
                                                                <p className="text-gray-500 text-sm">{userDetails?.location}</p>
                                                            </div>

                                                            {/* Details */}
                                                            <div className="mt-6 border-t pt-6 space-y-4 text-left text-gray-700">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-medium w-28">📧 Email:</span>
                                                                    <span>{userDetails?.email}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-medium w-28">📞 Phone:</span>
                                                                    <span>{userDetails?.phone}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-medium w-28">📍 Location:</span>
                                                                    <span>{userDetails?.location}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-medium w-28">🟢 Status:</span>
                                                                    <span className={userDetails?.status ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
                                                                        {userDetails?.status ? 'Active' : 'Inactive'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 border text-center">
                                                <button onClick={() => deleteUser(data._id)} className="text-blue-600 hover:underline">❌</button>
                                            </td>
                                        </tr>
                                    )
                                }
                            )
                        }
                    </tbody>
                </table>
            </div>
            <Pagination total={totalUsers} limit={limit} skip={skip} value={'users'} />
        </div >
    )
}