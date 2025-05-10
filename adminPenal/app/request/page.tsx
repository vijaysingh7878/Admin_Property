'use client'

import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { MainContext } from "../context/context"

export default function RequestView() {
    const { requestView,request } = useContext(MainContext)
    const [filter, setFilter] = useState('')

    useEffect(
        () => {
            requestView(filter)
        }, [filter]
    )
    return (
        <div className="bg-gray-100 p-6 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6">

                <h1 className="text-xl font-bold text-gray-500">User Property request</h1>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* <div className="bg-white p-4 rounded shadow text-center">
                        <div className="text-gray-500 text-sm">Total request</div>
                        <div className="text-2xl font-bold">{request?.length}</div>
                    </div> */}
                    {/* <div className="bg-white p-4 rounded shadow text-center">
                        <div className="text-gray-500 text-sm">Today’s request</div>
                        <div className="text-2xl font-bold">5</div>
                    </div> */}
                    {/* <div className="bg-white p-4 rounded shadow text-center">
                        <div className="text-gray-500 text-sm">Filtered Results</div>
                        <div className="text-2xl font-bold">2</div>
                    </div> */}
                </div>

                <div className="flex flex-col md:flex-row justify-between gap-4">
                    {/* <input
                        type="text"
                        placeholder="Search by user or property..."
                        className="w-full md:w-1/2 px-4 py-2 border rounded"
                    /> */}

                    <select
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full md:w-48 px-4 py-2 border rounded"
                    >
                        <option value="">All Types</option>
                        <option value="buy">Buy</option>
                        <option value="visit">Visit</option>
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto bg-white rounded-lg">
                    {
                        request?.length > 0 ?
                            <table className="min-w-full divide-y divide-gray-200 shadow">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">#</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Contect</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Property</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Location</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Seller/Agent</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {Array.isArray(request) &&
                                        request?.map((req, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm">{index + 1}</td>

                                                <td className="px-4 py-3 text-sm  space-x-3">
                                                    <span>{req.user.name}</span>
                                                </td>

                                                <td className="px-4 py-3 text-sm space-x-3">
                                                    <span>{req.user.phone}</span>
                                                </td>

                                                <td className="px-4 py-3 text-sm text-gray-700">{req.user.email}</td>

                                                <td className="px-4 py-3 text-sm flex items-center space-x-3">
                                                    <span>{req.property.title}</span>
                                                </td>

                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                    {req.property.state}, {req.property.district}
                                                </td>

                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                    {req.agent.name}
                                                </td>

                                                <td className="px-4 py-3 text-sm">
                                                    <span
                                                        className={`text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700                                               
                                           `}
                                                    >
                                                        Buy
                                                    </span>
                                                </td>

                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {new Date(req.createdAt).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                            :
                            <p className="font-semibold p-2 text-center text-xl">Data not found</p>
                    }
                </div>
            </div>
        </div>
    )
}