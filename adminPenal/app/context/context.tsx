'use client';

import { toast, ToastContainer } from "react-toastify";
import { createContext, useEffect, useState } from "react";
import AdminHeader from "../componants/AdminHeader";
import AdminSideBar from "../componants/AdminSideBar";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { login } from "@/redux/reducer/AdminSlice";
import axios from "axios";

export const MainContext = createContext();

export const Context = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();

    const admin = useSelector((state) => state.admin.data);
    const [loading, setLoading] = useState(true);
    const [readProperty, setReadProperty] = useState()
    const [users, setUsers] = useState()
    const [agents, setAgents] = useState();
    const [request, setRequest] = useState();
    const [blog, setBlog] = useState();

    const tostymsg = (msg, status) => {
        toast(msg, { type: status ? "success" : "error" });
    };

    // propertyShow part
    const propertyShow = () => {
        axios.get('http://localhost:5001/property/read', {
            headers: {
                Authorization: `${localStorage.getItem("adminToken")}`
            }
        }).then(
            (success) => {
                setReadProperty(success.data.allProperty);
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    }

    // allUser part
    const allUser = async () => {
        await axios.get('http://localhost:5001/user/read', {
            headers: {
                Authorization: `${localStorage.getItem("adminToken")}`
            }
        }).then(
            (success) => {
                setUsers(success.data.users)
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    }

    // allAgent part
    const allAgent = async () => {
        await axios.get('http://localhost:5001/agent/read', {
            headers: {
                Authorization: `${localStorage.getItem("adminToken")}`
            }
        }).then(
            (success) => {
                setAgents(success.data.users)
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    }
    //   requestview part
    const requestView = async () => {
        await axios.get('http://localhost:5001/req/read', {
            headers: {
                Authorization: `${localStorage.getItem("adminToken")}`
            }
        }).then(
            (success) => {
                setRequest(success.data.request)
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    }
    // viewBlog part
    const viewBlog = () => {
        axios.get(`http://localhost:5001/blog/read`).then(
            (success) => {
                setBlog(success.data.allBlog)
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    }

    useEffect(() => {
        const usAdmin = localStorage.getItem("admin");
        if (usAdmin) {
            dispatch(login({ admin: JSON.parse(usAdmin) }));
        }
        setLoading(false);
    }, [dispatch]);

    useEffect(() => {
        if (!loading && !admin && pathname !== "/login") {
            router.replace("/login");
        }
    }, [admin, pathname, loading, router]);

    if (loading) return null;

    if (!admin && pathname !== "/login") return null;

    return (
        <MainContext.Provider value={{ tostymsg, propertyShow, readProperty, users, allUser, allAgent, agents, requestView, request, viewBlog, blog }}>
            <>
                {admin && pathname != "/login" ? (
                    <>
                        <AdminHeader />
                        <div className="flex gap-1 h-[89vh]">
                            <AdminSideBar />
                            <main className="flex-1 overflow-y-auto p-1 bg-white">
                                {children}
                            </main>
                        </div>
                    </>
                ) : (
                    pathname == "/login" && children
                )}
                <ToastContainer autoClose={1000} />
            </>
        </MainContext.Provider>
    );
};
