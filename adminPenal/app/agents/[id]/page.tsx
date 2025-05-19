'use client'
import { MainContext } from "@/app/context/context";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function users() {
    const { id } = useParams()
    const { users, allUser, rating, averageRating } = useContext(MainContext)

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
                        <h2 className="text-2xl font-semibold mb-2">{users?.name}</h2>
                        <h2 className="text-md font-semibold mb-2 text-red-300">[ {users?.company}]</h2>
                        <p className="mb-1"><strong>Email:</strong> {users?.email}</p>
                        <p><strong>Phone:</strong> {users?.phone}</p>
                        <span className="text-gray-400 text-sm bg-green-200 p-1">Rating: {averageRating || '-'}</span>
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

                <h3 className="text-xl font-semibold mt-6 mb-4">Properties Added</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {
                        users?.property?.length > 0 ? (
                            users?.property.map((property, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-4 rounded shadow-md hover:shadow-lg transition duration-200"
                                >
                                    <img
                                        src={property.mainImage}
                                        alt={property.title}
                                        className="w-full h-48 object-cover rounded mb-4"
                                    />
                                    <h4 className="font-semibold text-lg">{property.title}</h4>
                                    <p className="text-gray-600">{property.location}</p>
                                    <p className="text-green-500 font-semibold">₹{property.price}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No properties added by this agent.</p>
                        )}
                </div>
            </div>
        </div>
    )
}