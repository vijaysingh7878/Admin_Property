'use client'
import React, { useContext, useEffect, useRef, useState } from 'react';
import { MainContext } from './context/context';
import { FaUsers, FaBuilding, FaMicroblog } from 'react-icons/fa';
import { SiMainwp } from "react-icons/si";
import { VscGitPullRequestNewChanges } from "react-icons/vsc";
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement
} from 'chart.js';


ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);


const AdminDashboard = () => {
  const { propertyShow, readProperty, users, allUser, agents, allAgent, request, requestView, blog, viewBlog } = useContext(MainContext);
  const [showCategory, setShowCategory] = useState(null)
  const [view, setView] = useState(5)
  const totalChart = 100;

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
        data: getMonthlyCounts(users).counts,
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
        data: [getMonthlyCounts(users).total, totalChart],
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
      <h2 className="text-2xl font-bold mb-6 text-gray-500"><span className='cursor-pointer' onClick={() => (setShowCategory(null), setView(5))}>Dashboard</span></h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
        {
          showAll.map((data, index) => {
            return (
              <div key={index} className="flex justify-between items-center p-4 cursor-pointer bg-white shadow rounded-lg hover:shadow-md" onClick={() => (setShowCategory(data.name), setView(10))}>
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
      {
        !showCategory ?
          <div>
            <Bar data={data} options={options} />
          </div> : ''
      }
      <div>
      </div>

      {/* recently part */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 my-8 justify-center items-center">


        {/* Recently Added Users */}
        {
          showCategory == null || showCategory == 'User' ?
            <>
              <div className="bg-white shadow-md rounded-md p-5 border-l-4 border-blue-500" >
                <h3 className="text-lg font-semibold mb-4 text-blue-600 flex items-center gap-2">
                  👤 Recently Added Users
                </h3>
                <div className="space-y-3">
                  {users?.slice(0, view).map((data, index) => (
                    <div key={index} className="flex justify-between text-sm border-b pb-2">
                      <span>{data.name}</span>
                      <span className="text-gray-500">{new Date(data.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              {
                showCategory == 'User' ?
                  <div className='w-[200px] m-auto'>
                    <Doughnut data={userData} options={singleOptions} />
                  </div> : ""
              }
            </>
            : ''
        }

        {/* Recently Added Properties */}
        {
          showCategory == null || showCategory == 'Property' ?
            <>
              <div className="bg-white shadow-md rounded-md p-5 border-l-4 border-green-500">
                <h3 className="text-lg font-semibold mb-4 text-green-600 flex items-center gap-2">
                  🏠 Recently Added Properties
                </h3>
                <div className="space-y-3">
                  {readProperty?.slice(0, view).map((data, index) => (
                    <div key={index} className="flex justify-between text-sm border-b pb-2">
                      <span>{data.title}</span>
                      <span className="text-gray-500">{new Date(data.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              {
                showCategory == 'Property' ?
                  <div className='w-[200px] m-auto'>
                    <Doughnut data={propertyData} options={singleOptions} />
                  </div> : ""
              }
            </>
            : ''}

        {/* Recently Added Agents */}
        {
          showCategory == null || showCategory == 'Agent' ?
            <>
              <div className="bg-white shadow-md rounded-md p-5 border-l-4 border-pink-500">
                <h3 className="text-lg font-semibold mb-4 text-pink-600 flex items-center gap-2">
                  🧑‍💼 Recently Added Agents
                </h3>
                <div className="space-y-3">
                  {Array.isArray(agents) &&
                    agents?.slice(0, view).map((data, index) => (
                      <div key={index} className="flex justify-between text-sm border-b pb-2">
                        <span>{data.name}</span>
                        <span className="text-gray-500">{new Date(data.createdAt).toLocaleDateString()}</span>
                      </div>
                    ))}
                </div>
              </div>
              {
                showCategory == 'Agent' ?
                  <div className='w-[200px] m-auto'>
                    <Doughnut data={agentData} options={singleOptions} />
                  </div> : ""
              }</>
            : ''}

        {/* Recently Added Requests */}
        {
          showCategory == null || showCategory == 'Request' ?
            <>
              <div className="bg-white shadow-md rounded-md p-5 border-l-4 border-orange-500">
                <h3 className="text-lg font-semibold mb-4 text-orange-600 flex items-center gap-2">
                  📩 Recently Added Requests
                </h3>
                <div className="space-y-3">
                  {request?.slice(0, view).map((data, index) => (
                    <div key={index} className="flex justify-between text-sm border-b pb-2">
                      <span>{data.user?.name}</span>
                      <span className="text-gray-500">{new Date(data.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              {
                showCategory == 'Request' ?
                  <div className='w-[200px] m-auto'>
                    <Doughnut data={reqData} options={singleOptions} />
                  </div> : ""
              }
            </> : ''}

      </div>


    </div >
  );
};

export default AdminDashboard;

