'use client'
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { MainContext } from "../context/context"
import Link from "next/link";
import Pagination from "../componants/Pagination";
import { useSearchParams } from "next/navigation";

export default function Agent() {
    const { tostymsg, allAgent, agents, totalAgents, limit, skip, setSkip } = useContext(MainContext);
    const [searchagents, setSearchagents] = useState(null)
    const searchParams = useSearchParams()
    const [filter, setFilter] = useState('')



    // statusChange part
    const statusChange = (id) => {
        axios.put(`https://admin-property.onrender.com/agent/status-change?id=${id}`).then(
            (success) => {
                tostymsg(success.data.msg, success.data.status)
                allAgent(searchagents, '', skip)
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
            const newValue = Number(searchParams.get('skip')) || 0
            setSkip(newValue)
            allAgent(searchagents, filter, '', newValue);
        }, [searchagents, filter, skip]
    )
    return (
        <div className="w-full p-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold  text-gray-500">All Agents</h2>
                <input
                    onChange={(e) => setSearchagents(e.target.value)}
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
                        <th className="px-4 py-2 border">Details</th>
                    </tr>
                </thead>
                <tbody className="text-gray-700">
                    {Array.isArray(agents) &&
                        agents?.map(
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
                                            <Link href={`agents/edit-agent/${data._id}`}>
                                                <button className="text-blue-600 hover:underline">Edit</button>
                                            </Link>
                                        </td>
                                        <td className="px-4 py-2 border">
                                            <Link href={`agents/${data._id}`}>
                                                <button className="text-blue-600 hover:underline">Details</button>
                                            </Link>
                                        </td>
                                    </tr>
                                )
                            }
                        )
                    }
                </tbody>
            </table>
            <Pagination total={totalAgents} limit={limit} skip={skip} value={'agents'} />

        </div>
    )
}