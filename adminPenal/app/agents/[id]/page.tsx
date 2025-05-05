'use client'
import axios from "axios";
import Image from "next/image";
import { use, useEffect, useState } from "react";

export default function agentDetails({ params }) {
    const { id } = use(params);
    const [agentDetails, setAgentDetails] = useState()
    console.log(agentDetails);

    const agentDetailsHendler = async () => {
        await axios.get(`http://localhost:5001/agent/read?id=${id}`, {
            headers: {
                Authorization: `${localStorage.getItem("adminToken")}`
            }
        }).then(
            (success) => {               
                setAgentDetails(success.data.users)
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    }
    useEffect(
        () => {
            agentDetailsHendler()
        }, [id]
    )

    return (
        <div className="flex">
            <div className="w-full p-4">
                <div className="flex justify-between items-start bg-white p-6 rounded-lg shadow-md">
                    <div>
                        <h2 className="text-2xl font-semibold mb-2">{agentDetails?.name}</h2>
                        <p className="mb-1"><strong>Email:</strong> {agentDetails?.email}</p>
                        <p><strong>Phone:</strong> {agentDetails?.phone}</p>
                    </div>

                    <div className="w-20 h-20 relative rounded-full overflow-hidden border border-gray-300">
                        <Image
                            src={agentDetails?.profile_Photo}
                            alt={agentDetails?.name}
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                </div>

                <h3 className="text-xl font-semibold mt-6 mb-4">Properties Added</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {agentDetails?.property.length > 0 ? (
                        agentDetails?.property.map((property, index) => (
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