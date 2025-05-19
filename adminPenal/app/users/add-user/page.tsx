'use client'
import { MainContext } from '@/app/context/context';
import axios from 'axios';
import Link from 'next/link';
import { useContext, useState } from 'react';

const AddUserForm = () => {
    const { BASE_URL, tostymsg } = useContext(MainContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
  
        const formData = new FormData();
        formData.append('name', e.target.name.value)
        formData.append('profile_Photo', e.target.profile_Photo.files[0] ?? null)
        formData.append('password', e.target.password.value)
        formData.append('phone', e.target.phone.value)
        formData.append('email', e.target.email.value)
        formData.append('location', e.target.location.value)

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
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md w-full m-10 md:w-2/3 lg:w-1/2 mx-auto">
            <Link href={'/users'} className='bg-gray-200 p-1 rounded-sm hover:bg-gray-300'>← Back</Link>
            <h2 className="text-2xl font-bold text-gray-700">Add New User</h2>

            <input
                name="name"
                type="text"
                placeholder="Name"
                required
                className="w-full px-3 py-2 border rounded"
            />

            <input
                name="profile_Photo"
                type="file"
                placeholder="Profile Photo URL"
                className="w-full px-3 py-2 border rounded"
            />

            <input
                name="password"
                type="password"
                placeholder="Password"
                className="w-full px-3 py-2 border rounded"
            />

            <input
                name="phone"
                type="text"
                placeholder="Phone Number"
                className="w-full px-3 py-2 border rounded"
            />

            <input
                name="email"
                type="email"
                placeholder="Email"
                required
                className="w-full px-3 py-2 border rounded"
            />

            <input
                name="location"
                type="text"
                placeholder="Location"
                className="w-full px-3 py-2 border rounded"
            />

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
                Add User
            </button>
        </form>
    );
};

export default AddUserForm;
