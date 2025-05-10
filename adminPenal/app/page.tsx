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






// const StatCard = ({ title, value, subtitle, color }) => (
//   <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-all">
//     <div className={`text-4xl font-bold ${color}`}>{value}</div>
//     <h3 className="text-lg font-semibold text-gray-700 mt-2">{title}</h3>
//     <p className="text-sm text-gray-500">{subtitle}</p>
//   </div>
// );

// const Section = ({ title, items, type }) => (
//   <div className="bg-white shadow rounded-lg p-6">
//     <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
//     <ul className="space-y-3 text-sm text-gray-700">
//       {items?.length > 0 ? (
//         items.slice(0, 3).map((item, index) => (
//           <li key={index} className="flex justify-between items-center">
//             <span>
//               {type === 'user' && `User ${item?.name} registered.`}
//               {type === 'property' && `Property ${item?.title} listed.`}
//               {type === 'agent' && `Agent ${item?.name} approved.`}
//               {type === 'request' && `Request for ${item?.propertyId || 'Property'} created.`}
//               {type === 'blog' && `Blog ${item?.title} published.`}
//             </span>
//             {new Date(item?.createdAt).toLocaleString()}
//           </li>
//         ))
//       ) : (
//         <li className="text-gray-400">No recent activity.</li>
//       )}
//     </ul>
//   </div>
// );

{/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
  <StatCard title="Users" value={users?.length || 0} subtitle="Total registered users" color="text-blue-500" />
  <StatCard title="Properties" value={readProperty?.length || 0} subtitle="Total properties listed" color="text-green-500" />
  <StatCard title="Agents" value={agents?.length || 0} subtitle="Total active agents" color="text-purple-500" />
  <StatCard title="Requests" value={request?.length || 0} subtitle="Pending requests" color="text-yellow-500" />
  <StatCard title="Blogs" value={blog?.length || 0} subtitle="Published blogs" color="text-pink-500" />
</div> */}

{/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <Section title="Recent Registered Users" items={users} type="user" />
  <Section title="Recent Added Properties" items={readProperty} type="property" />
  <Section title="Recent Approved Agents" items={agents} type="agent" />
  <Section title="Recent Requests" items={request} type="request" />
  <Section title="Recent Blogs" items={blog} type="blog" />
</div> */}