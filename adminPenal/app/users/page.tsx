'use client'
import axios from "axios"
import { useContext, useEffect, useRef, useState } from "react"
import { MainContext } from "../context/context"
import Link from "next/link";

export default function User() {
    const { tostymsg } = useContext(MainContext);
    const [users, setUsers] = useState()
    const [searchUsers, setSearchUsers] = useState(null)


    const allUser = async () => {
        await axios.get(`http://localhost:5001/user/read?name=${searchUsers}`, {
            headers: {
                Authorization: `${localStorage.getItem("adminToken")}`
            }
        }).then(
            (success) => {
                setUsers(success.data.users)
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    }

    // statusChange part
    const statusChange = (id) => {
        axios.put(`http://localhost:5001/user/status-change?id=${id}`).then(
            (success) => {
                tostymsg(success.data.msg, success.data.status)
                allUser()
            }
        ).catch(
            (error) => {
                tostymsg(error.data.msg, error.data.status)
                console.log(error);
            }
        )
    }

    useEffect(
        () => {
            allUser()
        }, [searchUsers]
    )
    return (
        <div className="w-full my-3">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">All Users</h2>
                <input
                    onChange={(e) => setSearchUsers(e.target.value)}
                    type="search"
                    placeholder="Search user name or email"
                    className="border border-black px-2 py-1 rounded outline-none"
                />
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
                    </tr>
                </thead>
                <tbody className="text-gray-700">
                    {
                        users?.map(
                            (data, index) => {
                                return (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 border">{index + 1}</td>
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
                                    </tr>
                                )
                            }
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}