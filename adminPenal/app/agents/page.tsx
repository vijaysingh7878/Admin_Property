'use client'
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { MainContext } from "../context/context"
import Link from "next/link";
import Pagination from "../componants/Pagination";
import { useSearchParams } from "next/navigation";

export default function Agent() {
    const { BASE_URL, tostymsg, allUser, users, totalusers, limit, skip, setSkip } = useContext(MainContext);
    const [searchusers, setSearchusers] = useState(null)
    const searchParams = useSearchParams()
    const [filter, setFilter] = useState('')

    const role = 'agent';

    const updateUserRole = async (userId, userRole) => {
        try {
            const res = await axios.patch(BASE_URL + `/user/${userId}/role`, { userRole })
            tostymsg(res.data.msg, res.data.status);
            if (res.data.status == 1) {
                allUser(searchusers, filter, skip, '', role);
            }
        } catch (err) {
            console.log(err);
        }
    };


    // statusChange part
    const statusChange = (id) => {
        axios.put(BASE_URL + `/user/status-change?id=${id}`).then(
            (success) => {
                tostymsg(success.data.msg, success.data.status)
                allUser(searchusers, filter, skip, '', role);
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    }

    // delete agent part
    const deleteAgent = (id) => {
        axios.delete(BASE_URL + `/user/delete/${id}`).then(
            (success) => {
                tostymsg(success.data.msg, success.data.status)
                allUser(searchusers, filter, skip, '', role);
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
            allUser(searchusers, filter, newValue, '', role);
        }, [searchusers, filter, skip, role]
    )
    return (
        <div className="w-full p-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold  text-gray-500">All Agents</h2>
                <input
                    onChange={(e) => setSearchusers(e.target.value)}
                    type="search"
                    placeholder="Search agent name or email"
                    className="border border-black px-2 py-1 rounded outline-none"
                />
                <div className="flex flex-col md:flex-row justify-end gap-4">
                    <select
                        className="w-full md:w-48 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="active">Active</option>
                        <option value="inActive">In Active</option>
                    </select>
                </div>
                <Link href={'agents/add-agent'}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
                        <th className="px-4 py-2 border">Role</th>
                        <th className="px-4 py-2 border">status</th>
                        <th className="px-4 py-2 border">Edit</th>
                        <th className="px-4 py-2 border">Details</th>
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
                                        <td className="px-4 py-2">
                                            <select
                                                className="text-sm border rounded px-2 py-1 bg-gray-50"
                                                value={data.role}
                                                onChange={(e) => updateUserRole(data._id, e.target.value)}
                                            >
                                                <option value="user">User</option>
                                                <option value="agent">Agent</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className="px-4 py-2 border">
                                            <button onClick={() => statusChange(data._id)} className={`${data.status ? 'bg-blue-500' : 'bg-red-500'}  text-white px-4 py-1 rounded transition`}>
                                                {data.status ? 'IN' : "OUT"}
                                            </button>
                                        </td>
                                        <td className="px-4 py-2 border">
                                            <Link href={`agents/edit-agent/${data._id}`}>
                                                <button className="text-blue-600 hover:underline">Edit</button>
                                            </Link>
                                        </td>
                                        <td className="px-4 py-2 border">
                                            <Link href={`users/${data._id}`}>
                                                <button className="text-blue-600 hover:underline">Details</button>
                                            </Link>
                                        </td>
                                        <td className="px-4 py-2 border">
                                            <button onClick={() => deleteAgent(data._id)} className="text-blue-600 hover:underline">❌</button>
                                        </td>
                                    </tr>
                                )
                            }
                        )
                    }
                </tbody>
            </table>
            <Pagination total={totalusers} limit={limit} skip={skip} value={'users'} />

        </div>
    )
}