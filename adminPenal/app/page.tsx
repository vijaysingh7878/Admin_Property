'use client'
import React, { useContext, useEffect } from 'react';
import { MainContext } from './context/context';
import { FaUsers, FaBuilding, FaMicroblog } from 'react-icons/fa';
import { SiMainwp } from "react-icons/si";
import { VscGitPullRequestNewChanges } from "react-icons/vsc";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend,
} from 'chart.js';


ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);


const AdminDashboard = () => {
  const { propertyShow, readProperty, users, allUser, agents, allAgent, request, requestView, blog, viewBlog } = useContext(MainContext);

  const showAll = [
    {
      name: 'User',
      icon: <FaUsers />,
      total: `${users?.length}`,
      bg: 'bg-blue-400'
    },
    {
      name: 'Property',
      icon: <FaBuilding />,
      total: `${readProperty?.length}`,
      bg: 'bg-green-400'
    },
    {
      name: 'Agent',
      icon: <SiMainwp />,
      total: `${agents?.length}`,
      bg: 'bg-pink-400'
    },
    {
      name: 'Request',
      icon: <VscGitPullRequestNewChanges />,
      total: `${request?.length}`,
      bg: 'bg-orange-400'
    },
    {
      name: 'Blog',
      icon: <FaMicroblog />,
      total: `${blog?.length}`,
      bg: 'bg-red-400'
    },
  ]

  const getMonthlyCounts = (items) => {
    const counts = Array(12).fill(0);
    items?.forEach(item => {      
      const date = new Date(item.createdAt);
      const monthIndex = date.getMonth();
      counts[monthIndex]++;
    });
    return counts;
  };


  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: 'Users',
        data: getMonthlyCounts(users),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
      },
      {
        label: 'Properties',
        data: getMonthlyCounts(readProperty),
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
      },
      {
        label: 'Agents',
        data: getMonthlyCounts(agents),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'Requests',
        data: getMonthlyCounts(request),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      }
    ],
  };


  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
  };


  useEffect(() => {
    allUser();
  }, [users]);

  useEffect(() => {
    propertyShow();
  }, [readProperty]);

  useEffect(() => {
    allAgent();
  }, [agents]);

  useEffect(() => {
    requestView();
  }, [request]);

  useEffect(() => {
    viewBlog();
  }, [blog]);





  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-500">Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
        {
          showAll.map((data, index) => {
            return (
              <div key={index} className="flex justify-between items-center p-4 bg-white shadow rounded-lg hover:shadow-md">
                <div className={`${data.bg} text-2xl p-2 text-white rounded-md`}>
                  {data.icon}
                </div>
                <div className='text-center'>
                  <h3 className="text-md text-gray-500 font-semibold">{data.name}</h3>
                  <p className="text-gray-600">{data.total}</p>
                </div>
              </div>
            )
          })
        }
      </div>

      {/* chart part */}

      <div>
        <Bar data={data} options={options} />
      </div>

      {/* recently part */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 my-8">

        {/* Recently Added Users */}
        <div className="bg-white shadow-md rounded-md p-5 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold mb-4 text-blue-600 flex items-center gap-2">
            👤 Recently Added Users
          </h3>
          <div className="space-y-3">
            {users?.slice(0, 3).map((data, index) => (
              <div key={index} className="flex justify-between text-sm border-b pb-2">
                <span>{data.name}</span>
                <span className="text-gray-500">{new Date(data.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Added Properties */}
        <div className="bg-white shadow-md rounded-md p-5 border-l-4 border-green-500">
          <h3 className="text-lg font-semibold mb-4 text-green-600 flex items-center gap-2">
            🏠 Recently Added Properties
          </h3>
          <div className="space-y-3">
            {readProperty?.slice(0, 3).map((data, index) => (
              <div key={index} className="flex justify-between text-sm border-b pb-2">
                <span>{data.title}</span>
                <span className="text-gray-500">{new Date(data.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Added Agents */}
        <div className="bg-white shadow-md rounded-md p-5 border-l-4 border-yellow-500">
          <h3 className="text-lg font-semibold mb-4 text-yellow-600 flex items-center gap-2">
            🧑‍💼 Recently Added Agents
          </h3>
          <div className="space-y-3">
            {agents?.slice(0, 3).map((data, index) => (
              <div key={index} className="flex justify-between text-sm border-b pb-2">
                <span>{data.name}</span>
                <span className="text-gray-500">{new Date(data.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Added Requests */}
        <div className="bg-white shadow-md rounded-md p-5 border-l-4 border-red-500">
          <h3 className="text-lg font-semibold mb-4 text-red-600 flex items-center gap-2">
            📩 Recently Added Requests
          </h3>
          <div className="space-y-3">
            {request?.slice(0, 3).map((data, index) => (
              <div key={index} className="flex justify-between text-sm border-b pb-2">
                <span>{data.user?.name}</span>
                <span className="text-gray-500">{new Date(data.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>

      </div>


    </div>
  );
};

export default AdminDashboard;

