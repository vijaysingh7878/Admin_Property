'use client'
import { useContext, useEffect, useState } from "react"
import axios from 'axios';
import Link from "next/link";
import { MainContext } from "../context/context";
import { TiTick } from "react-icons/ti";
import { GiCrossMark } from "react-icons/gi";
import { useSearchParams } from "next/navigation";
import Pagination from "../componants/Pagination";

export default function ViewProperty() {
    const { BASE_URL, tostymsg, propertyShow, readProperty, totalProperty, limit, skip, setSkip, rating, averageRating } = useContext(MainContext)
    const [filter, setFilter] = useState('')
    const [viewProperty, setViewProperty] = useState(false);
    const [propertyDetails, setPropertyDetails] = useState();
    const [searchProperty, setSearchProperty] = useState('');
    const searchParams = useSearchParams()

    // status change part
    const actionHendler = (id, num) => {

        axios.put(BASE_URL + `/property/status-change?id=${id}`, { num }).then(
            (success) => {
                tostymsg(success.data.msg, success.data.status)
                propertyShow(filter, searchProperty, '', skip)
            }
        ).catch(
            (error) => {
                tostymsg(error.data.msg, error.data.status)
                console.log(error);

            }
        )
    }

    // viewPropertyhendler part

    const viewPropertyhendler = (id, agent_Id) => {

        rating(agent_Id[0]._id);
        axios.get(BASE_URL + `/property/read?id=${id}`, {
            headers: {
                Authorization: `${localStorage.getItem("adminToken")}`
            }
        }).then(
            (success) => {
                setPropertyDetails(success.data.allProperty);
                setViewProperty(true)
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    }

    // deleteProperty part
    const deleteProperty = (id) => {
        axios.delete(BASE_URL + `/property/delete/${id}`).then(
            (success) => {
                tostymsg(success.data.msg, success.data.status)
                propertyShow(filter, searchProperty, '', skip);
            }
        ).catch(
            (error) => {
                console.log(error);

            }
        )
    }

    useEffect(() => {
        const newSkip = Number(searchParams.get('skip')) || 0;
        setSkip(newSkip);
        propertyShow(filter, searchProperty, '', newSkip);
    }, [searchParams, filter, searchProperty]);

    return (
        <>
            <div className="w-full my-6 px-4">
                <div className="flex  md:flex-row justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-500">All Properties</h2>
                    <input
                        onChange={(e) => setSearchProperty(e.target.value)}
                        type="search"
                        placeholder="Search property name or location"
                        className="border border-black px-2 py-1 rounded outline-none"
                    />
                    <select
                        className="w-full md:w-48 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="available">Available</option>
                        <option value="sold">Sold</option>
                        <option value="soon">Soon</option>
                        <option value="buy">Buy</option>
                        <option value="sell">Sell</option>
                        <option value="rent">Rent</option>
                    </select>
                    <Link href="/property/add-new-property">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-3 md:mt-0">
                            Add
                        </button>
                    </Link>

                </div>


                {Array.isArray(readProperty) &&
                    readProperty?.length > 0 ? (
                    <div className="overflow-auto rounded-md shadow-sm border border-gray-200">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-600 uppercase">
                                <tr>
                                    <th className="px-4 py-3">S.No.</th>
                                    <th className="px-4 py-3">Image</th>
                                    <th className="px-4 py-3">Title</th>
                                    {/* <th className="px-4 py-3">Category</th> */}
                                    <th className="px-4 py-3">Price</th>
                                    <th className="px-4 py-3">Type</th>
                                    <th className="px-4 py-3">Location</th>
                                    <th className="px-4 py-3">Agent</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-center">Action</th>
                                    <th className="px-4 py-3">Edit</th>
                                    <th className="px-4 py-3">View</th>
                                    <th className="px-4 py-3">Delete</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white text-gray-700 divide-y divide-gray-200">
                                {readProperty.map((data, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition">
                                        <td className="px-4 py-2">{index + 1 + skip}</td>
                                        <td className="px-4 py-2">
                                            <img
                                                src={data.mainImage}
                                                alt="property"
                                                className="w-14 h-14 object-cover rounded"
                                            />
                                        </td>
                                        <td className="px-4 py-2">{data.title}</td>
                                        {/* <td className="px-4 py-2">{data.category}</td> */}
                                        <td className="px-4 py-2 font-semibold">₹{data.price}</td>
                                        <td className={`px-4 py-2 font-semibold`}>
                                            <span className="bg-green-300 p-1 rounded-md">{data.propertyType}</span></td>
                                        <td className="px-4 py-2">
                                            {data.area} {data.district} {data.state}
                                        </td>
                                        <td className="px-4 py-2">
                                            {data.agent.map((agent, idx) => (
                                                <Link href={`/agents/${agent._id}`} key={idx}>
                                                    <span className="text-blue-600 hover:underline">{agent.name}</span>
                                                </Link>
                                            ))}
                                        </td>
                                        <td className="px-4 py-2">
                                            <select value={data.status} onChange={(e) => actionHendler(data._id, e.target.value)} className="w-full md:w-32 px-2 py-1 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                <option value="available">Available</option>
                                                <option value="sold">Sold</option>
                                                <option value="soon">Soon</option>
                                            </select>
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="flex justify-center gap-2">
                                                {data.action === 'pending' ? (
                                                    <>
                                                        <button
                                                            onClick={() => actionHendler(data._id, 1)}
                                                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
                                                            title="Approve"
                                                        >
                                                            <TiTick />
                                                        </button>
                                                        <button
                                                            onClick={() => actionHendler(data._id, 0)}
                                                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                                                            title="Reject"
                                                        >
                                                            <GiCrossMark />
                                                        </button>
                                                    </>
                                                ) : data.action === 'approved' ? (
                                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm">
                                                        Approved
                                                    </span>
                                                ) : (
                                                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm">
                                                        Rejected
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2">
                                            <Link href={`/property/edit-property/${data._id}`}>
                                                <button className="text-blue-600 hover:underline">Edit</button>
                                            </Link>
                                        </td>

                                        <td className="px-4 py-2">
                                            <button onClick={() => viewPropertyhendler(data._id, data.agent)} className="text-blue-600 hover:underline">view</button>

                                            {/* view property part */}
                                            <div className={`fixed inset-0 bg-black bg-opacity-20 z-50 flex items-center justify-center w-full ${viewProperty ? 'block' : 'hidden'}`}>
                                                <div className="bg-white rounded-lg shadow-xl max-h-[70%] max-w-[60%] overflow-y-auto p-6 relative">
                                                    <button
                                                        onClick={() => setViewProperty(false)}
                                                        className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl"
                                                    >
                                                        ×
                                                    </button>

                                                    <div className="max-w-7xl mx-auto p-6">
                                                        {/* Property Title and Main Image */}
                                                        <div className="flex flex-col md:flex-row items-center">
                                                            <img
                                                                src={propertyDetails?.mainImage}
                                                                alt="Property"
                                                                className="w-full md:w-1/2 h-auto rounded-lg shadow-lg"
                                                            />
                                                            <div className="md:ml-8 mt-4 md:mt-0">
                                                                <h1 className="text-4xl font-bold text-gray-800">{propertyDetails?.title}</h1>
                                                                <p className="mt-2 text-lg text-gray-600">{propertyDetails?.category}</p>
                                                                <p className="mt-4 text-xl text-gray-700">{propertyDetails?.price}</p>
                                                                <p className="mt-2 text-gray-500">{propertyDetails?.state}, {propertyDetails?.city}</p>
                                                                <p className="mt-2 text-gray-500">{propertyDetails?.area}</p>
                                                                <span
                                                                    className={`mt-2 inline-block text-sm px-3 py-1 rounded-full ${propertyDetails?.status === "available"
                                                                        ? "bg-green-500 text-white"
                                                                        : propertyDetails?.status === "sold"
                                                                            ? "bg-red-500 text-white"
                                                                            : "bg-yellow-500 text-white"
                                                                        }`}
                                                                >
                                                                    {propertyDetails?.status}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Short Description */}
                                                        <div className="mt-8">
                                                            <h2 className="text-xl font-semibold text-gray-800">Short Description</h2>
                                                            <p className="mt-2 text-gray-600">{propertyDetails?.short_description}</p>
                                                        </div>

                                                        {/* Long Description */}
                                                        <div className="mt-8">
                                                            <h2 className="text-xl font-semibold text-gray-800">Long Description</h2>
                                                            <p className="mt-2 text-gray-600">{propertyDetails?.long_description}</p>
                                                        </div>

                                                        {/* Multiple Images */}
                                                        <div className="mt-8">
                                                            <h2 className="text-xl font-semibold text-gray-800">Gallery</h2>
                                                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                                                {propertyDetails?.maltipleImage?.map((image, index) => (
                                                                    <img
                                                                        key={index}
                                                                        src={image}
                                                                        alt={`Property Image ${index + 1}`}
                                                                        className="w-full h-40 object-cover rounded-lg shadow-md"
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Agent Info */}
                                                        <div className="mt-8">
                                                            <h2 className="text-xl font-semibold text-gray-800">Info</h2>
                                                            <p className="mt-2 text-gray-600">Agent ID: {propertyDetails?.agent?.name} <span className="text-[11px] text-green-500">({averageRating})</span></p>
                                                            <p className="mt-2 text-gray-500">Action Status: {propertyDetails?.action}</p>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2">
                                            <button onClick={() => deleteProperty(data._id)} className="text-blue-600 hover:underline">❌</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <Pagination total={totalProperty} limit={limit} skip={skip} value={'property'} />
                    </div>
                ) : (
                    <p className="text-xl text-center font-medium text-gray-500 py-20">No Property Added</p>
                )}
            </div>
        </>

    )
}