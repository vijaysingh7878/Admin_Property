'use client'
import { MainContext } from "@/app/context/context";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function users() {
    const { id } = useParams()
    const { BASE_URL, users, allUser, rating, averageRating } = useContext(MainContext);
    const [filter, setFilter] = useState('')
    const [viewProperty, setViewProperty] = useState(false);
    const [propertyDetails, setPropertyDetails] = useState();


    const viewPropertyhendler = async (id, user_id) => {

        await axios.get(BASE_URL + `/property/read?id=${id}`, {
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


    useEffect(
        () => {
            if (id) {
                allUser('', '', '', id);
                rating(id)
            }
        }, [id]
    )

    return (
        <div className="flex">
            <div className="w-full p-4">
                <div className="flex justify-between items-start bg-white p-6 rounded-lg shadow-md">
                    <div>
                        <h2 className="text-2xl font-semibold mb-2">{users?.name} <span className="text-[12px] text-gray-300">({users?.role})</span></h2>
                        <h2 className="text-md font-semibold mb-2 text-red-300">{users?.company}</h2>
                        <p className="mb-1"><strong>Email:</strong> {users?.email}</p>
                        <p><strong>Phone:</strong> {users?.phone}</p>
                        <span className="text-gray-400 text-sm">Rating: {averageRating || '-'}</span>
                        <p className="text-sm text-gray-300 font-semibold">Join: {new Date(users?.createdAt).toLocaleDateString()}</p>

                    </div>

                    <div className="w-20 h-20 relative rounded-full overflow-hidden border border-gray-300">
                        <Image
                            src={users?.profile_Photo || 'agent'}
                            alt={users?.name || 'Profile Photo'}
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-10">
                    <h3 className="text-xl font-semibold mt-6 mb-4">Properties Added</h3>
                    <select
                        className="w-full md:w-48 px-3 py-2 border border-gray-300 text-sm rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="">All</option>
                        <optgroup label="Approval Status">
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </optgroup>
                        <optgroup label="Availability">
                            <option value="available">Available</option>
                            <option value="sold">Sold</option>
                            <option value="soon">Coming Soon</option>
                        </optgroup>
                        <optgroup label="Property Type">
                            <option value="buy">Buy</option>
                            <option value="sell">Sell</option>
                            <option value="rent">Rent</option>
                        </optgroup>
                    </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {
                        users?.property?.length > 0 ? (
                            users?.property.filter(property => filter == '' || property.action == filter || property.status == filter).map((property, index) => (
                                <>
                                    <div onClick={() => viewPropertyhendler(property?._id, property?.user?._id)}
                                        key={index}
                                        className="bg-white p-4 cursor-pointer rounded group shadow-md hover:shadow-lg "
                                    >
                                        <div className=" overflow-hidden ">
                                            <img
                                                src={property.mainImage}
                                                alt={property.title}
                                                className="w-full h-48 object-cover group-hover:scale-110 rounded mb-4 transition duration-400"
                                            />
                                        </div>
                                        <h4 className="font-semibold text-lg">{property.title}</h4>
                                        <p className="text-gray-600">{property.location}</p>
                                        <p className="text-green-500 font-semibold">₹{property.price}</p>
                                    </div>
                                    {/* view property part */}
                                    < div className={`fixed inset-0 bg-black bg-opacity-20 z-50 flex items-center justify-center w-full ${viewProperty ? 'block' : 'hidden'}`}>
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
                                                        <p className="mt-2 text-gray-500">{propertyDetails?.address},{propertyDetails?.state}, {propertyDetails?.city}</p>
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
                                                    <p className="mt-2 text-gray-600">Owner ID: {propertyDetails?.user?.name} <span className="text-[11px] text-green-500">({averageRating})</span></p>
                                                    <p className="mt-2 text-gray-500">Action Status: {propertyDetails?.action}</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div></>
                            ))
                        ) : (
                            <p className="text-gray-500">No properties added by this agent.</p>
                        )}
                </div>
            </div>
        </div >
    )
}