'use client';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { IoArrowBack } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

export default function ChatSettings() {
    let socket = useRef(null);
    const chatEndScroll = useRef(null);
    const [message, setMessage] = useState([]);
    const [msg, setMsg] = useState('');
    const admin = useSelector(state => state.admin.data);

    const viewChat = async () => {
        try {
            const response = await axios.get('http://localhost:5001/chat/read', {
                params: {
                    senderId: admin._id,
                    receiverId: '6808ac1e97d58bcb8f34b8b1',
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
            receiverId: '6808ac1e97d58bcb8f34b8b1',
            message: msg,
        };

        await axios.post('http://localhost:5001/chat/create', data);

        socket.current.emit('sendMessage', data);

        setMessage((prevMessages) => [...prevMessages, { msg, timestamp: new Date() }]);

        setMsg('');
        viewChat();
    };

    useEffect(() => {
        viewChat();
        chatEndScroll.current?.scrollIntoView({ behavior: 'smooth' });

    }, [message]);

    useEffect(() => {

        socket.current = io('http://localhost:5001');

        socket.current.emit('join', admin._id);

        socket.current.on('receiveMessage', (data) => {
            setMessage((prevMessages) => [...prevMessages, { msg: data.message, timestamp: new Date() }]);
        });

        return () => {
            socket.current.disconnect();
        };
    }, [admin._id]);

    return (
        <div className="px-4 py-6 h-[600px]">
            <div className="flex items-center gap-3 mb-6">
                <Link href="/setting" className="text-gray-600 hover:text-gray-800 text-xl">
                    <IoArrowBack />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Chat Support</h1>
            </div>

            <div className="border rounded-lg shadow-md overflow-hidden bg-white flex flex-col h-[600px]">
                
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
                    <div>
                        {message?.map((data, i) => {
                            if (data.msg != '') {
                                return (
                                    <div key={i} className={`mb-3 ${admin._id == data.senderId ? 'text-right' : ''}`} ref={chatEndScroll}>
                                        <span className="bg-green-200 py-1 px-2 rounded-md">
                                            {data.msg}
                                        </span>
                                    </div>
                                );
                            }
                        })}
                    </div>
                </div>

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
    );
}
