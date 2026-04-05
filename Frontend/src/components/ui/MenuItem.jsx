import { Link } from "react-router";

const MenuItem = ({ isArtist, icon, text, external, path, setShowProfile }) => {
    return (
        <>
            {isArtist ? (
                <a
                    className="flex items-center justify-between px-3 py-3 md:py-2 
        rounded-md transition hover:bg-[#2a2a2a]"
                    href={path}
                    target="_blank"
                >
                    <div className="flex items-center gap-3">
                        <i className={`${icon} text-lg`}></i>
                        <span className="text-sm md:text-sm">{text}</span>
                    </div>
                </a>
            ) : (
                <Link
                    to={path || "#"}
                    onClick={() => setShowProfile(false)}
                    className={`
        flex items-center justify-between px-3 py-3 md:py-2 
        rounded-md transition
        ${text === "Log out" ? "hover:bg-red-500/30" : "hover:bg-[#2a2a2a]"}`}
                >
                    <div className="flex items-center gap-3">
                        <i className={`${icon} text-lg`}></i>
                        <span className="text-sm md:text-sm">{text}</span>
                    </div>

                    {external && (
                        <i className="ri-external-link-line text-sm text-gray-400"></i>
                    )}
                </Link>
            )}
        </>
    );
};

export default MenuItem;
