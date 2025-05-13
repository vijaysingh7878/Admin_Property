'use client'

import axios from "axios";
import { useContext, useState } from "react";
import { MainContext } from "../context/context";
import { useDispatch } from "react-redux";
import { login } from "../../redux/reducer/AdminSlice";
import { useRouter } from "next/navigation";

export default function Login() {
  const { BASE_URL, tostymsg } = useContext(MainContext);
  const dispatch = useDispatch();
  const router = useRouter();

  const [showOtpStep, setShowOtpStep] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const data = {
      email: e.target.email.value,
      password: e.target.password.value
    };

    axios.post(`${BASE_URL}/admin/login`, data)
      .then((res) => {
        if (res.data.status === 1) {
          dispatch(login({
            admin: res.data.admin,
            adminToken: res.data.adminToken
          }));
          router.push('/');
        }
        tostymsg(res.data.msg, res.data.status);
      })
      .catch(err => {
        tostymsg(err?.response?.data?.msg || "Login failed", 0);
      });
  };

  const sendOtp = () => {
    axios.post(`${BASE_URL}/mail/otp-send`, { Email: email })
      .then(res => {
        tostymsg(res.data.msg, res.data.status);
        if (res.data.status === 1) {
          setShowOtpInput(true);
        }
      })
      .catch(console.log);
  };

  const handleOtpVerify = () => {
    axios.post(`${BASE_URL}/mail/verify`, { otpValue: otp })
      .then(res => {
        tostymsg(res.data.msg, res.data.status);
        if (res.data.status === 1) {
          setShowPasswordReset(true);
          setShowOtpInput(false);
        }
      })
      .catch(console.log);
  };

  const handlePasswordUpdate = () => {
    axios.post(`${BASE_URL}/admin/password`, {
      email,
      new_password: newPassword
    })
      .then(res => {
        tostymsg(res.data.msg, res.data.status);
        if (res.data.status === 1) {
          setShowOtpStep(false);
          setShowPasswordReset(false);
          setShowOtpInput(false);
        }
      })
      .catch(console.log);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/banner.jpg')`
      }}>
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Login to your account</h2>

        <form className="space-y-5" onSubmit={handleLogin}>
          {!showOtpStep && (
            <>
              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowOtpStep(true)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <button
                type="submit"
                className="w-full bg-orange-400 text-white font-semibold py-2 rounded-md hover:bg-white hover:text-black border-2 border-orange-400 transition"
              >
                Login
              </button>
            </>
          )}
        </form>

        {showOtpStep && !showOtpInput && !showPasswordReset && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Enter Email</label>
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
            <button
              onClick={sendOtp}
              className="w-full bg-orange-400 text-white py-2 rounded-md hover:bg-white hover:text-black border-2 border-orange-400 transition"
            >
              Send OTP
            </button>
          </>
        )}

        {showOtpInput && !showPasswordReset && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
              <input
                type="text"
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter your OTP"
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
            <button
              onClick={handleOtpVerify}
              className="w-full bg-orange-400 text-white py-2 rounded-md hover:bg-white hover:text-black border-2 border-orange-400 transition"
            >
              Verify OTP
            </button>
          </>
        )}

        {showPasswordReset && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
            <button
              onClick={handlePasswordUpdate}
              className="w-full bg-orange-400 text-white py-2 rounded-md hover:bg-white hover:text-black border-2 border-orange-400 transition"
            >
              Save Password
            </button>
          </>
        )}
      </div>
    </div>
  );
}
