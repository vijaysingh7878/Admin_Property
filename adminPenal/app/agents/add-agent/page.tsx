'use client'
import { MainContext } from '@/app/context/context';
import axios from 'axios';
import React, { useContext, useState } from 'react';

const AddAgentForm = () => {
    const { BASE_URL, tostymsg } = useContext(MainContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(e.target.phone.value);

        const formData = new FormData();
        formData.append('name', e.target.name.value)
        formData.append('profile_Photo', e.target.profile_Photo.files[0] ?? null)
        formData.append('password', e.target.password.value)
        formData.append('phone', e.target.phone.value)
        formData.append('email', e.target.email.value)
        formData.append('location', e.target.location.value)
        formData.append('company', e.target.company.value)
        formData.append('role', e.target.role.value)

        await axios.post(BASE_URL + '/user/create', formData).then(
            (success) => {
                tostymsg(success.data.msg, success.data.status)
                if (success.data.status == 1) {
                    e.target.reset()
                }
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    };


    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Add New Agent</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    required
                    className="border p-2 rounded"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    className="border p-2 rounded"
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    className="border p-2 rounded"
                />
                <input
                    type="text"
                    name="company"
                    placeholder="Company"
                    className="border p-2 rounded"
                />
                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    className="border p-2 rounded"
                />
                <input
                    type="file"
                    name="profile_Photo"
                    placeholder="Profile Photo URL"
                    className="border p-2 rounded"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="border p-2 rounded"
                />
                <input
                    type="text"
                    name="role"
                    placeholder="role"
                    className="border p-2 rounded"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Add Agent
                </button>
            </form>
        </div>
    );
};

export default AddAgentForm;
