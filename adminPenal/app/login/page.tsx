'use client'

import axios from "axios";
import { useContext } from "react";
import { MainContext } from "../context/context";
import { useDispatch } from "react-redux";
import { login } from "../../redux/reducer/AdminSlice";
import { useRouter } from "next/navigation";
export default function Login() {
  const { tostymsg } = useContext(MainContext);
  const dispatch = useDispatch()
  const router = useRouter()

  const loginHendler = (event) => {
    event.preventDefault();
    const admin = {
      email: event.target.email.value,
      password: event.target.password.value
    }
    axios.post('http://localhost:5001/admin/login', admin).then(
      (success) => {
        tostymsg(success.data.msg, success.data.status)
        console.log(success.data);

        if (success.data.status == 1) {
          router.push('/')
          dispatch(login(
            {
              admin: success.data.admin,
              adminToken: success.data.adminToken
            }
          ))
        }
      }
    ).catch(
      (error) => {
        tostymsg(error.data?.msg, error.data?.status)
        console.log(error);
      }
    )
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Login to your account</h2>

        <form className="space-y-5" onSubmit={loginHendler}>
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {/* <p className="text-sm text-center mt-6">
          Don’t have an account?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p> */}
      </div>
    </div>
  );
}
