'use client'
import React, { useContext, useEffect, useState } from 'react';
import { MainContext } from './context/context';
import { FaUsers, FaBuilding, FaMicroblog } from 'react-icons/fa';
import { SiMainwp } from "react-icons/si";
import { VscGitPullRequestNewChanges } from "react-icons/vsc";
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement
} from 'chart.js';
import Link from 'next/link';


ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);


const AdminDashboard = () => {
  const { propertyShow, readProperty, totalProperty, users, allUser, request, requestView, blog, viewBlog } = useContext(MainContext);
  const [showCategory, setShowCategory] = useState(null)
  const [view, setView] = useState(5)
  const [agents, setAgents] = useState([])
  const [user, setUser] = useState([])
  const [filter, setFilter] = useState('')

  const totalChart = 100;

  const showAll = [
    {
      name: 'User',
      icon: <FaUsers />,
      total: `${user?.length}`,
      bg: 'bg-blue-400'
    },
    {
      name: 'Property',
      icon: <FaBuilding />,
      total: `${readProperty?.length || 0}`,
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
    let total = 0;
    const data = Array.isArray(items) ? items : Array.from(items || []);

    data?.forEach(item => {
      const date = new Date(item.createdAt);
      const monthIndex = date.getMonth();
      counts[monthIndex]++;
      total++
    });
    return { counts, total };
  };

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: 'Users',
        data: getMonthlyCounts(user).counts,
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
      },
      {
        label: 'Properties',
        data: getMonthlyCounts(readProperty).counts,
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
      },
      {
        label: 'Agents',
        data: getMonthlyCounts(agents).counts,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'Requests',
        data: getMonthlyCounts(request).counts,
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


  const userData = {
    labels: ['Users'],
    datasets: [
      {
        label: 'Total users',
        data: [getMonthlyCounts(user).total, totalChart],
        backgroundColor: ['#3B82F6', '#e0e0e0'],
        borderWidth: 1,
      },
    ],
  };

  const propertyData = {
    labels: ['Property'],
    datasets: [
      {
        label: 'Total property',
        data: [getMonthlyCounts(readProperty).total, totalChart],
        backgroundColor: ['#10B981', '#e0e0e0'],
        borderWidth: 1,
      },
    ],
  };

  const agentData = {
    labels: ['Agent'],
    datasets: [
      {
        label: 'Total agent',
        data: [getMonthlyCounts(agents).total, totalChart],
        backgroundColor: ['#EC4899', '#e0e0e0'],
        borderWidth: 1,
      },
    ],
  };

  const reqData = {
    labels: ['Request'],
    datasets: [
      {
        label: 'Total request',
        data: [getMonthlyCounts(request).total, totalChart],
        backgroundColor: ['#F97316', '#e0e0e0'],
        borderWidth: 1,
      },
    ],
  };

  const singleOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  useEffect(() => {
    allUser();
  }, []);

  useEffect(() => {
    if (users && users.length > 0) {
      setAgents(users.filter(data => data.role === 'agent'));
      setUser(users.filter(data => data.role === 'user'));
    }
  }, [users]);

  useEffect(() => {
    propertyShow(filter);
  }, [filter]);


  useEffect(() => {
    requestView();
  }, []);

  useEffect(() => {
    viewBlog();
  }, []);





  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-500">
        <span className="cursor-pointer" onClick={() => (setShowCategory(null), setView(5))}>
          Dashboard
        </span>
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {showAll.map((data, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-4 cursor-pointer bg-white shadow rounded-lg hover:shadow-md transition"
            onClick={() => (setShowCategory(data.name), setView(10))}
          >
            <div className={`${data.bg} text-2xl p-2 text-white rounded-md`}>
              {data.icon}
            </div>
            <div className="text-center">
              <h3 className="text-md text-gray-500 font-semibold">{data.name}</h3>
              <p className="text-gray-600">{data.total}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      {!showCategory && (
        <div className="bg-white rounded-lg shadow p-4 mb-8 overflow-x-auto">
          <Bar data={data} options={options} />
        </div>
      )}

      {/* Recently Added Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Users */}
        {(showCategory === null || showCategory === 'User') && (
          <>
            <div className="bg-white shadow-md rounded-md p-5 border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold mb-4 text-blue-600 flex items-center gap-2">
                👤 Recently Added Users
              </h3>
              <div className="space-y-3">
                {user?.slice(0, view).map((data, index) => (
                  <div key={index} className="flex justify-between text-sm border-b pb-2">
                    <div className="text-sm text-blue-600 font-semibold">{index + 1}.</div>
                    <Link href={`/users/${data._id}`}> <span>{data.name}</span></Link>
                    <span>{data.email}</span>
                    <span>{data.location}</span>
                    <span className="text-gray-500">{new Date(data.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
            {showCategory === 'User' && (
              <div className="mt-6 w-full flex justify-center">
                <div className="w-[220px] bg-white p-4 rounded-xl shadow-md border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-600 text-center mb-2">User Stats</h4>
                  <Doughnut data={userData} options={singleOptions} />
                </div>
              </div>
            )}
          </>
        )}

        {/* Properties */}
        {(showCategory === null || showCategory === 'Property') && (
          <>
            <div className="bg-white rounded-md p-5  border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2">
                  <span className="text-lg">🏠</span> Recently Added Properties
                </h3>

                {showCategory === 'Property' && (
                  <select
                    className="w-full md:w-48 px-3 py-2 border border-gray-300 text-sm rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="">All</option>
                    <optgroup label="Approval Status">
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </optgroup>
                    <optgroup label="Availability">
                      <option value="available">Available</option>
                      <option value="sold">Sold</option>
                      <option value="soon">Coming Soon</option>
                    </optgroup>
                    <optgroup label="Property Type">
                      <option value="buy">Buy</option>
                      <option value="sell">Sell</option>
                      <option value="rent">Rent</option>
                    </optgroup>
                  </select>
                )}
              </div>

              <div className="divide-y divide-gray-100">
                {readProperty?.slice(0, view).map((data, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm border-b pb-2"
                  >
                    <div className="text-sm text-green-600 font-semibold">{index + 1}.</div>

                    <div className="col-span-1">
                      <p className="text-gray-800 font-medium truncate">{data.title}</p>
                    </div>

                    <div className="col-span-1">
                      <p className="text-gray-700">{data.city}</p>
                    </div>

                    <div className="col-span-1">
                      <span className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-700 capitalize">
                        {data.propertyType}
                      </span>
                    </div>

                    <div className="col-span-1">
                      <Link href={`/users/${data?.user?._id}`}><p className="text-gray-800 font-medium">{data?.user?.name || "N/A"}</p></Link>

                    </div>

                    <div className="text-xs text-gray-500 text-right">
                      {new Date(data.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                ))}
              </div>
            </div>

            {showCategory === 'Property' && (
              <div className="mt-6 w-full flex justify-center">
                <div className="w-[220px] bg-white p-4 rounded-xl shadow-md border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-600 text-center mb-2">Property Stats</h4>
                  <Doughnut data={propertyData} options={singleOptions} />
                </div>
              </div>
            )}
          </>

        )}

        {/* Agents */}
        {(showCategory === null || showCategory === 'Agent') && (
          <>
            <div className="bg-white shadow-md rounded-md p-5 border-l-4 border-pink-500">
              <h3 className="text-lg font-semibold mb-4 text-pink-600 flex items-center gap-2">
                🧑‍💼 Recently Added Agents
              </h3>
              <div className="space-y-3">
                {Array.isArray(agents) &&
                  agents.slice(0, view).map((data, index) => (
                    <div key={index} className="flex justify-between text-sm border-b pb-2">
                      <div className="text-sm text-pink-600 font-semibold">{index + 1}.</div>
                      <Link href={`/users/${data._id}`}> <span>{data.name}</span></Link>
                      <span>{data.email}</span>
                      <span>{data.location}</span>
                      <span className="text-gray-500">{new Date(data.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
              </div>
            </div>
            {showCategory === 'Agent' && (
              <div className="mt-6 w-full flex justify-center">
                <div className="w-[220px] bg-white p-4 rounded-xl shadow-md border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-600 text-center mb-2">Property Stats</h4>
                  <Doughnut data={agentData} options={singleOptions} />
                </div>
              </div>
            )}
          </>
        )}

        {/* Requests */}
        {(showCategory === null || showCategory === 'Request') && (
          <>
            <div className="bg-white shadow-md rounded-md p-5 border-l-4 border-orange-500">
              <h3 className="text-lg font-semibold mb-4 text-orange-600 flex items-center gap-2">
                📩 Recently Added Requests
              </h3>
              <div className="space-y-3">
                {request?.slice(0, view).map((data, index) => (
                  <div key={index} className="flex justify-between text-sm border-b pb-2">
                    <span>{data.user?.name}</span>
                    <span>{data.user?.phone}</span>
                    <span>{data.property?.title}</span>
                    <span> {data.propertyOwner?.name}</span>
                    <span className="text-gray-500">{new Date(data.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
            {showCategory === 'Request' && (
              <div className="mt-6 w-full flex justify-center">
                <div className="w-[220px] bg-white p-4 rounded-xl shadow-md border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-600 text-center mb-2">Property Stats</h4>
                  <Doughnut data={reqData} options={singleOptions} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>

  );
};

export default AdminDashboard;

