import React from "react";
import { Link } from "react-router";

const UserProfile = () => {
  return (
    <div className="absolute right-0 sm:right-10 top-14 w-full sm:w-80 bg-[#121212] text-white rounded-lg shadow-lg p-2 z-50">
      
      <div className="flex flex-col gap-1">
        <MenuItem icon="ri-user-line" text="Account" path={'/account'}/>
        <MenuItem icon="ri-profile-line" text="Profile" path={'/profile'}/>
        <MenuItem icon="ri-vip-crown-line" text="Upgrade to Premium" external />
        <MenuItem icon="ri-customer-service-2-line" text="Support" external />
        <MenuItem icon="ri-download-line" text="Download" external />
        <MenuItem icon="ri-settings-3-line" text="Settings" />
      </div>

      <div className="my-2 border-t border-gray-700"></div>

      <MenuItem icon="ri-logout-box-r-line" text="Log out" />

      <div className="mt-3">
        <p className="text-gray-400 text-xs mb-2">
          Your Updates
        </p>

        <div className="flex gap-3 items-start bg-[#1e1e1e] p-3 rounded-md hover:bg-[#2a2a2a] cursor-pointer transition">
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

const MenuItem = ({ icon, text, external, path }) => {
  return (
    <Link to={path} className={`${text === 'Log out' ? "hover:bg-red-500/30" : "hover:bg-[#2a2a2a]"} flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition`}>
      
      <div className="flex items-center gap-3">
        <i className={`${icon} text-lg`}></i>
        <span className="text-sm">{text}</span>
      </div>

      {external && (
        <i className="ri-external-link-line text-sm text-gray-400"></i>
      )}
    </Link>
  );
};

export default UserProfile;