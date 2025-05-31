// 'use client'
// import { useState } from "react";


// export default function SettingsPage() {
//     const [logoPreview, setLogoPreview] = useState(null);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         if (e.target.logo.length > 0) {
//             formData.append('logo', e.target.logo.files[0])
//         }
//         formData.append('profile_Photo', e.target.profile_Photo.files[0] ?? null)
//         formData.append('password', e.target.password.value)
//         formData.append('phone', e.target.phone.value)
//         formData.append('email', e.target.email.value)
//         formData.append('location', e.target.location.value)

//         await axios.post(BASE_URL + '/user/create', formData).then(
//             (success) => {
//                 tostymsg(success.data.msg, success.data.status)
//                 if (success.data.status == 1) {
//                     e.target.reset()
//                 }
//             }
//         ).catch(
//             (error) => {
//                 console.log(error);
//             }
//         )
//     };

//     return (
//         <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
//             <h1 className="text-2xl font-semibold mb-6 text-gray-800">🔧 Website Settings</h1>

//             <form className="space-y-6" onSubmit={handleSubmit}>
//                 {/* Logo Upload */}
//                 <div>
//                     <label htmlFor="logo" className="block text-sm font-medium text-gray-700">Website Logo</label>
//                     <input
//                         type="file"
//                         id="logo"
//                         name="logo"
//                         accept="image/*"
//                         onChange={(e) => setLogoPreview(URL.createObjectURL(e.target.files[0]))}
//                         className="mt-2 block w-full text-sm border border-gray-300 rounded-lg p-2 bg-gray-50"
//                     />
//                     {logoPreview && (
//                         <img
//                             src={logoPreview}
//                             alt="Logo Preview"
//                             className="mt-4 h-24 w-auto object-contain border rounded shadow"
//                         />
//                     )}
//                 </div>

//                 {/* Website Name */}
//                 <div>
//                     <label htmlFor="name" className="block text-sm font-medium text-gray-700">Website Name</label>
//                     <input
//                         type="text"
//                         id="name"
//                         name="name"
//                         placeholder="Enter website name"
//                         className="mt-2 block w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
//                     />
//                 </div>

//                 {/* Contact Number */}
//                 <div>
//                     <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact Number</label>
//                     <input
//                         type="tel"
//                         id="contact"
//                         name="contact"
//                         placeholder="Enter contact number"
//                         className="mt-2 block w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
//                     />
//                 </div>

//                 {/* Email */}
//                 <div>
//                     <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
//                     <input
//                         type="email"
//                         id="email"
//                         name="email"
//                         placeholder="Enter email"
//                         className="mt-2 block w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
//                     />
//                 </div>

//                 <button
//                     type="submit"
//                     className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
//                 >
//                     Save Changes
//                 </button>
//             </form>
//         </div>
//     );
// }
