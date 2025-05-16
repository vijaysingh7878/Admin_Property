'use client'
import { MainContext } from '@/app/context/context';
import axios from 'axios';
import Link from 'next/link';
import { useContext, useState } from 'react';

const AddUserForm = ({ onSubmit }) => {
    const { BASE_URL, tostymsg } = useContext(MainContext);
    const [formData, setFormData] = useState({
        name: '',
        profile_Photo: '',
        password: '',
        phone: '',
        email: '',
        status: true,
        location: ''
    });

    const handleChange = (e) => {

        const { name, value, type, checked, files } = e.target;
        if (type === 'file') {
            const file = files[0];
            console.log(files);
            
            if (file) {
                setFormData({
                    ...formData,
                    profile_Photo: file,
                });
            }
        }
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);

        await axios.post(BASE_URL + '/user/create', formData).then(
            (success) => {
                tostymsg(success.data.msg, success.data.status)
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
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded"
            />

            <input
                name="profile_Photo"
                type="file"
                placeholder="Profile Photo URL"
                value={formData.profile_Photo}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
            />

            <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
            />

            <input
                name="phone"
                type="text"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
            />

            <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded"
            />

            <input
                name="location"
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
            />

            <label className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    name="status"
                    checked={formData.status}
                    onChange={handleChange}
                />
                <span>Active</span>
            </label>

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
