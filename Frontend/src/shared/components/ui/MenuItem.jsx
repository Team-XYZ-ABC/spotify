import { Link } from "react-router";

const MenuItem = ({ isArtist, icon, text, external, path, setShowProfile, onClick }) => {
    return (
        <>
            {isArtist ? (
                <Link
                    className="flex items-center justify-between px-3 py-3 md:py-2 
        rounded-md transition hover:bg-[#2a2a2a]"
                    to={path}
                    target="_blank"
                >
                    <div className="flex items-center gap-3">
                        <i className={`${icon} text-lg`}></i>
                        <span className="text-sm md:text-sm">{text}</span>
                    </div>
                </Link>
            ) : (
                <Link
                    to={path || "#"}
                    onClick={(e) => {
                        setShowProfile(false);
                        if (onClick) onClick(e);
                    }}
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
