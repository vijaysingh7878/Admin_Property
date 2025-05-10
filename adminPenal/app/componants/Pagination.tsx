import { useContext } from "react";
import { MainContext } from "../context/context";

export const Pagination = ({ total, limit, skip, value }) => {
    const { skipHendler } = useContext(MainContext);
    return (
        <div className="p-4">
            <ul className="flex gap-2 items-center mt-4">
                {Array.from({ length: Math.ceil(total / limit) }).map((_, index) => (
                    <li key={index}>
                        <button
                            onClick={() => skipHendler(index, limit, value)}
                            className={`px-3 py-1 rounded-md ${skip === index * limit ? 'bg-orange-600' : 'bg-orange-400'} text-white hover:bg-orange-500 transition duration-200`}
                        >
                            {index + 1}
                        </button>
                    </li>
                ))}
            </ul>

        </div>
    )
}
export default Pagination;