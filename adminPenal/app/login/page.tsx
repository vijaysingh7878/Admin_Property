'use client'

import axios from "axios";
import { useContext, useState } from "react";
import { MainContext } from "../context/context";
import { useDispatch } from "react-redux";
import { login } from "../../redux/reducer/AdminSlice";
import { useRouter } from "next/navigation";
import { MdEmail } from "react-icons/md";
import { TbLockMinus } from "react-icons/tb";
import { TbLockOff } from "react-icons/tb";

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
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const data = {
      email: e.target.email.value,
      password: e.target.password.value
    };

    axios.post(`${BASE_URL}/user/adminLogin`, data)
      .then((res) => {
        if (res.data.status === 1) {
          dispatch(login({
            admin: res.data.user,
            adminToken: res.data.userToken
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
    axios.post(`${BASE_URL}/user/password`, {
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
    <div
      className="min-h-screen flex flex-col md:flex-row items-center justify-center lg:justify-end bg-cover px-4 md:px-10"
      style={{
        backgroundImage: `url('/loginPage.jpg')`,
      }}
    >
      <div className="w-full max-w-md bg-white lg:bg-inherit bg-opacity-90 p-6 md:p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Login to your account</h2>

        <form className="space-y-5" onSubmit={handleLogin}>
          {!showOtpStep && (
            <>
              <div className="relative w-full">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                  <MdEmail />
                </span>
              </div>

              <div className="relative w-full">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 cursor-pointer"
                >
                  {showPassword ? <TbLockMinus /> : <TbLockOff />}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => setShowOtpStep(true)}
                  className="text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 rounded-md transition"
              >
                Login
              </button>
            </>
          )}
        </form>

        {/* OTP Email Step */}
        {showOtpStep && !showOtpInput && !showPasswordReset && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Enter Email</label>
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>
            <button
              onClick={sendOtp}
              className="w-full bg-orange-400 text-white py-2 rounded-md hover:bg-orange-500 transition"
            >
              Send OTP
            </button>
          </>
        )}

        {/* OTP Verification Step */}
        {showOtpInput && !showPasswordReset && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
              <input
                type="text"
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter your OTP"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>
            <button
              onClick={handleOtpVerify}
              className="w-full bg-orange-400 text-white py-2 rounded-md hover:bg-orange-500 transition"
            >
              Verify OTP
            </button>
          </>
        )}

        {/* Password Reset Step */}
        {showPasswordReset && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>
            <button
              onClick={handlePasswordUpdate}
              className="w-full bg-orange-400 text-white py-2 rounded-md hover:bg-orange-500 transition"
            >
              Save Password
            </button>
          </>
        )}
      </div>
    </div>
  );
}
