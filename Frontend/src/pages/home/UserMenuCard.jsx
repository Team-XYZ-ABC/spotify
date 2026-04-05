import React from "react";
import { Link } from "react-router";

const UserMenuCard = ({ setShowProfile }) => {
  return (
    <div className="
      fixed md:absolute 
      inset-0 md:inset-auto 
      md:right-0 md:top-14 
      w-full md:w-80 
      h-screen md:h-auto 
      bg-[#121212] text-white 
      md:rounded-lg shadow-lg 
      p-4 md:p-2 
      z-50 overflow-y-auto
    ">

      <div className="flex justify-between items-center md:hidden mb-4">
        <h2 className="text-lg font-semibold">Account</h2>
        <button onClick={() => setShowProfile(false)} className="text-2xl">
          <i className="ri-close-line"></i>
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <MenuItem setShowProfile={setShowProfile} icon="ri-user-line" text="Account" path="/account" />
        <MenuItem setShowProfile={setShowProfile} icon="ri-profile-line" text="Profile" path="/profile" />
        <MenuItem setShowProfile={setShowProfile} icon="ri-vip-crown-line" text="Upgrade to Premium" external />
        <MenuItem setShowProfile={setShowProfile} icon="ri-customer-service-2-line" text="Support" external />
        <MenuItem setShowProfile={setShowProfile} icon="ri-download-line" text="Download" external />
        <MenuItem setShowProfile={setShowProfile} icon="ri-settings-3-line" text="Settings" />
      </div>

      <div className="my-3 border-t border-gray-700"></div>

      <MenuItem setShowProfile={setShowProfile} icon="ri-logout-box-r-line" text="Log out" />

      <div className="mt-4">
        <p className="text-gray-400 text-xs mb-2">Your Updates</p>

        <div className="flex gap-3 items-start bg-[#1e1e1e] p-3 rounded-md hover:bg-[#2a2a2a] transition">
          <i className="ri-megaphone-line text-xl"></i>
          <p className="text-sm text-gray-300 leading-tight">
            Say hello to Your Updates. Check here for news on your followers,
            playlists, events and more
            <span className="text-gray-500"> • 6d</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const MenuItem = ({ icon, text, external, path, setShowProfile }) => {
  return (
<<<<<<< HEAD
    <Link to={path} onClick={() => { setShowProfile(false) }} className={`${text === 'Log out' ? "hover:bg-red-500/30" : "hover:bg-[#2a2a2a]"} flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition`}>

=======
    <Link
      to={path || "#"}
      onClick={() => setShowProfile(false)}
      className={`
        flex items-center justify-between px-3 py-3 md:py-2 
        rounded-md transition
        ${text === "Log out" ? "hover:bg-red-500/30" : "hover:bg-[#2a2a2a]"}
      `}
    >
>>>>>>> 570b79d4e92968e982dba024548a322599d35e31
      <div className="flex items-center gap-3">
        <i className={`${icon} text-lg`}></i>
        <span className="text-sm md:text-sm">{text}</span>
      </div>

      {external && (
        <i className="ri-external-link-line text-sm text-gray-400"></i>
      )}
    </Link>
  );
};

export default UserMenuCard;