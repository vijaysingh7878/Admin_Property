'use client'
import React, { useContext, useEffect, useState } from 'react';
import { MainContext } from '../context/context';
import axios from 'axios';

const ContactRequests = () => {
    const { BASE_URL, contacts, fetchContacts, tostymsg } = useContext(MainContext);
    const [filter, setFilter] = useState('')

    useEffect(() => {
        fetchContacts(filter);
    }, [filter]);

    const markAsSeen = async (id) => {

        await axios.patch(BASE_URL + `/contect/status-change?id=${id}`).then(
            (success) => {
                tostymsg(success.data.msg, success.data.status)
                if (success.data.status == 1) {
                    fetchContacts(filter);
                }
            }
        ).catch(
            (err) => {
                console.error("Failed to update seen status", err);
            }
        )


    };

    const deleteContact = async (id) => {

        await axios.delete(BASE_URL + `/contect/delete?id=${id}`).then(
            (success) => {
                tostymsg(success.data.msg, success.data.status)
                if (success.data.status == 1) {
                    fetchContacts(filter);
                }
            }
        ).catch(
            (err) => {
                console.error("Failed to update seen status", err);
            }
        )


    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">📩 Contact Requests</h1>
            <select
                className="w-full md:w-48 mb-5 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => setFilter(e.target.value)}
                aria-label="Filter users"
            >
                <option value="">All</option>
                <option value={true}>Seen</option>
                <option value={false}>Not Seen</option>
            </select>


            {contacts.length === 0 ? (
                <p className="text-gray-500">No contact requests found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Contact</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Subject</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Message</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Delete</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {contacts.map((item, index) => (
                                <tr key={index} className={`${item.seen ? '' : 'bg-yellow-50'}`}>
                                    <td className="px-4 py-2 text-sm text-gray-800">{item.name}</td>
                                    <td className="px-4 py-2 text-sm text-gray-600">{item.contact}</td>
                                    <td className="px-4 py-2 text-sm text-blue-600">{item.email}</td>
                                    <td className="px-4 py-2 text-sm text-gray-700">{item.subject || '-'}</td>
                                    <td className="px-4 py-2 text-sm text-gray-700 max-w-xs cursor-pointer" >
                                        {item.message}
                                    </td>
                                    <td className="px-4 py-2 text-sm">
                                        <button onClick={() => markAsSeen(item._id)} className="hover:underline">{item.seen == true ? 'Seen' : 'Mark as Seen'}</button>
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-500">
                                        {new Date(item.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-2 text-sm">
                                        <button onClick={() => deleteContact(item._id)} className="hover:underline">❌</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ContactRequests;
