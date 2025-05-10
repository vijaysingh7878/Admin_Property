'use client';
import React, { useContext, useEffect, useRef, useState } from "react";
import { MainContext } from "../context/context";
import Image from "next/image";
import axios from "axios";
import { io } from 'socket.io-client';
import { useSelector } from "react-redux";

export default function ChatPage() {
  let socket = useRef(null);
  const { viewChat, chat } = useContext(MainContext);
  const chatEndScroll = useRef(null);
  const [message, setMessage] = useState([]);
  const [msg, setMsg] = useState('');
  const [selectChat, setSelectChat] = useState('')
  const admin = useSelector(state => state.admin.data);

  const chatHendler = async () => {
    try {
      const response = await axios.get('http://localhost:5001/chat/read/chat', {
        params: {
          senderId: admin._id,
          receiverId: selectChat,
        }
      });

      setMessage(response.data.user?.message || []);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle sending message
  const handleSendMessage = async (e) => {
    e.preventDefault()

    const data = {
      senderId: admin._id,
      receiverId: selectChat,
      message: msg,
    };
    console.log(data);

    await axios.post('http://localhost:5001/chat/create', data);

    socket.current.emit('sendMessage', data);
    setMessage((prevMessages) => [...prevMessages, { msg: msg, senderId: admin._id, timestamp: new Date() }]);

    setMsg('');
    viewChat();
  };

  useEffect(() => {
    chatEndScroll.current?.scrollIntoView({ behavior: 'smooth' });

  }, [message]);

  useEffect(() => {

    socket.current = io('http://localhost:5001');

    socket.current.emit('join', admin._id);

    socket.current.on('receiveMessage', (data) => {
      setMessage((prevMessages) => [...prevMessages, { msg: data.message, senderId: data.senderId, timestamp: new Date() }]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [admin._id]);

  useEffect(() => {
    viewChat();
  }, []);

  useEffect(() => {
    chatHendler();
  }, [selectChat]);


  return (
    <div className="flex gap-6">
      {/* Chat Users List */}
      <div className="p-6 min-w-[280px] max-w-[320px] w-full">
        <div className="p-4 bg-white shadow-md rounded-md w-full max-w-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-500">Chat Users</h2>
            {/* <button
              className="flex items-center justify-center border-2 border-orange-300 text-orange-400 
                 hover:bg-orange-300 hover:text-white transition-all rounded-full w-8 h-8 text-lg font-bold"
              title="Add User"
            >
              +
            </button> */}
          </div>
        </div>


        <ul className="bg-white rounded-md shadow divide-y divide-gray-100">
          {chat?.length > 0 ? (
            chat.map((user: any, index: number) => (
              <li
                onClick={() => {
                  const receiver =
                    admin._id == user.senderId ? user.receiverId : user.senderId;
                  setSelectChat(receiver);
                }}
                key={index}
                className={`px-4 py-3 mb-3 cursor-pointer rounded-md transition duration-200 flex items-center gap-3
                  ${selectChat === (admin._id === user.senderId ? user.receiverId : user.senderId)
                    ? 'bg-orange-200'
                    : 'bg-orange-100 hover:scale-105'}`}

              >
                <div className="w-10 h-10 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full font-semibold uppercase overflow-hidden">
                  {user.receiver.profile_Photo ? (
                    <Image
                      src={user.receiver.profile_Photo}
                      alt={user.receiver.name}
                      width={40}
                      height={40}
                      className="object-cover rounded-full h-10"
                    />
                  ) : (
                    <span className="text-lg">{user.receiver.name?.charAt(0)}</span>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">{user.receiver.name}</span>
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-sm text-gray-500">No users found in chat.</li>
          )}
        </ul>
      </div>

      {/* View Chat Section */}

      {
        selectChat ? (
          <div className="px-4 pt-6 flex-1">
            <div className="flex items-center gap-3 mb-6">
              <h1 className="text-xl font-bold text-gray-500">Chat Support</h1>
            </div>

            <div className="border rounded-lg shadow-md overflow-hidden bg-white flex flex-col h-[600px]">

              {/* Message Display Section */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
                <div>
                  {message?.map((data, i) => {
                    if (data.msg !== '') {
                      return (
                        <div key={i} className={`mb-3 ${admin._id == data.senderId ? 'text-right' : ''}`} ref={chatEndScroll}>
                          <span className={`py-1 px-2 rounded-md ${admin._id === data.senderId ? 'bg-blue-200' : 'bg-green-200'}`}>
                            {data.msg}
                          </span>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>

              {/* Message Input Form */}
              <form className="p-4 border-t bg-white flex gap-2" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        ) : (
          ''
        )
      }



    </div>

  );
}
