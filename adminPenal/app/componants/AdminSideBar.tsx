"use client";
import Link from "next/link";
import { HiHomeModern } from "react-icons/hi2";
import { RiSlideshowFill } from "react-icons/ri";
import { FaUserFriends } from "react-icons/fa";
import { SiMainwp } from "react-icons/si";
import { IoMdSettings } from "react-icons/io";
import { FaMicroblog } from "react-icons/fa";
import { VscGitPullRequestNewChanges } from "react-icons/vsc";
// import { BsChatDotsFill } from "react-icons/bs";
import { usePathname } from "next/navigation";

export default function AdminSideBar() {
  const pathname = usePathname();
  const sideBarValue = [
    {
      name: "Dashboard",
      icon: <RiSlideshowFill />,
      slug: "",
    },
    {
      name: "Users",
      icon: <FaUserFriends />,
      slug: "users",
    },
    {
      name: "Property",
      icon: <HiHomeModern />,
      slug: "property",
    },
    {
      name: "Agents",
      icon: <SiMainwp />,
      slug: "agents",
    },
    {
      name: "Requests",
      icon: <VscGitPullRequestNewChanges />,
      slug: "request",
    },
    {
      name: "Blogs",
      icon: <FaMicroblog />,
      slug: "blog",
    },
    {
      name: "Settings",
      icon: <IoMdSettings />,
      slug: "setting"
    },
  ];

  return (
    <div className="h-[89vh] bg-gradient-to-t from-blue-500 to-blue-300 text-white py-6 px-1 shadow-lg">
      <div className="space-y-6">
        {sideBarValue.map((value, index) => (
          <div key={index}>
            <Link
              href={`/${value.slug}`}
              className={`flex items-center gap-4 px-2 py-1 rounded-lg transition-all duration-300 ease-in-out transform hover:text-black hover:bg-white ${'/' + `${value.slug}` == pathname ? 'bg-white text-blue-500' : ''}`}
            >
              <span className="text-xl">{value.icon}</span>
              <span className="text-lg">{value.name}</span>
            </Link>
          </div>
        ))}
      </div>
    </div >
  );
}
