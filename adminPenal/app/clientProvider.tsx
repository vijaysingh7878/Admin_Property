'use client'

import { store } from "@/redux/store";
import { Provider } from "react-redux";
import { Context } from "./context/context";


const ClientProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>
            <Context>{children}</Context>
        </Provider>
    );
};

export default ClientProvider;
