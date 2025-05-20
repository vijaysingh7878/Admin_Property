'use client';

import { toast, ToastContainer } from "react-toastify";
import { createContext, useEffect, useState } from "react";
// import AdminHeader from "../componants/AdminHeader";
import AdminSideBar from "../componants/AdminSideBar";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { login } from "@/redux/reducer/AdminSlice";
import axios from "axios";

export const MainContext = createContext();

export const Context = ({ children }) => {
    // const BASE_URL = 'http://localhost:5001'
    const BASE_URL = 'https://admin-property.onrender.com'
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();

    const admin = useSelector((state) => state.admin.data);
    const [loading, setLoading] = useState(true);
    const [readProperty, setReadProperty] = useState([]);
    const [totalProperty, setTotalProperty] = useState()
    const [users, setUsers] = useState()
    const [totalUsers, setTotalUsers] = useState()
    // const [agents, setAgents] = useState();
    const [totalAgents, setTotalAgents] = useState();
    const [request, setRequest] = useState();
    const [blog, setBlog] = useState();
    const [banner, setBanner] = useState();
    const [chat, setChat] = useState();
    const [limit, setLimit] = useState(10);
    const [skip, setSkip] = useState();
    const [averageRating, setAverageRating] = useState('')


    const tostymsg = (msg, status) => {
        toast(msg, { type: status ? "success" : "error" });
    };

    // propertyShow part
    const propertyShow = async (filter = '', searchProperty = '', id = '', skip = 0) => {

        await axios.get(BASE_URL + `/property/read?filter=${filter}&searchProperty=${searchProperty}&id=${id}&skip=${skip}&limit=${limit}`).then(
            (success) => {
                setReadProperty(success.data.allProperty);
                setTotalProperty(success.data.total)
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    }

    // allUser part
    const allUser = async (searchUsers = '', filter = '', skip = 0, id = '', role = '') => {
        await axios.get(BASE_URL + `/user/read?id=${id}&filter=${filter}&name=${searchUsers}&skip=${skip}&limit=${limit}&role=${role}`, {
            headers: {
                Authorization: `${localStorage.getItem("adminToken")}`
            }
        }).then(
            (success) => {
                console.log(success.data);

                setUsers(success.data.users)
                setTotalUsers(success.data.total)
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    }

    // allAgent part
    // const allAgent = async (searchUsers = '', filter = '', id = '', skip = 0) => {
    //     await axios.get(BASE_URL + `/agent/read?name=${searchUsers}&filter=${filter}&id=${id}&skip=${skip}&limit=${limit}`, {
    //         headers: {
    //             Authorization: `${localStorage.getItem("adminToken")}`
    //         }
    //     }).then(
    //         (success) => {
    //             setAgents(success.data.users)
    //             setTotalAgents(success.data.total)
    //         }
    //     ).catch(
    //         (error) => {
    //             console.log(error);
    //         }
    //     )
    // }
    //   requestview part
    const requestView = async (filter = '') => {
        await axios.get(BASE_URL + `/req/read?filter=${filter}`, {
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
    const viewBlog = (id = '') => {
        axios.get(BASE_URL + `/blog/read?id=${id}`).then(
            (success) => {
                setBlog(success.data.allBlog)
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    }

    // view banner part
    const viewBanner = () => {
        axios.get(BASE_URL + `/banner/read`).then(
            (success) => {
                setBanner(success.data.allBanner)
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    }

    // viewChat part
    const viewChat = (id = '') => {
        axios.get(BASE_URL + `/chat/read`).then(
            (success) => {
                setChat(success.data.user)
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    }

    // rating part
    const rating = async (id) => {

        await axios.get(BASE_URL + `/rating/read?id=${id}`).then(
            (success) => {
                setAverageRating(success.data.averageRating);
                console.log(success.data);

            }
        ).catch(
            (error) => {
                console.log(error);

            }
        )
    }


    // skip handler part
    const skipHendler = (index, limit, path) => {
        const newSkip = index * limit;
        router.push(`/${path}?skip=${newSkip}&limit=${limit}`)
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
        <MainContext.Provider value={{ BASE_URL, tostymsg, propertyShow, readProperty, users, allUser, requestView, request, viewBlog, blog, viewChat, chat, totalUsers, totalProperty, totalAgents, skipHendler, limit, skip, setSkip, rating, averageRating, viewBanner, banner }}>
            <>
                {admin && pathname != "/login" ? (
                    <div className="flex">
                        <AdminSideBar />

                        <main className="flex-1 overflow-y-auto bg-white">
                            {children}
                        </main>

                    </div>
                ) : (
                    pathname == "/login" && children
                )}
                <ToastContainer autoClose={1000} />
            </>
        </MainContext.Provider>
    );
};
