import React from "react";
import AccountTileTab from "@/shared/components/ui/AccountTileTab";

const Account = () => {
  return (
    <div className="flex-1 text-white overflow-y-auto h-full">
      <div className="w-1/2 mx-auto">
        <div className="w-full bg-zinc-800 rounded-md px-4 py-2 flex items-center gap-3 mb-6">
          <i className="ri-search-line text-zinc-400 text-lg"></i>
          <input
            type="text"
            placeholder="Search account or help articles"
            className="bg-transparent outline-none w-full text-sm placeholder:text-zinc-400"
          />
        </div>

        <div className="flex gap-4 h-34 mb-6">
          <div className="w-[70%] bg-zinc-800 rounded-lg p-5 flex flex-col justify-between">
            <div>
              <p className="text-xs text-zinc-400 mb-2">Your plan</p>
              <h1 className="text-2xl font-semibold">Spotify Free</h1>
            </div>

            <div className="flex justify-end">
              <button className="border border-zinc-500 px-4 py-1.5 rounded-full text-sm hover:border-white transition">
                Explore plans
              </button>
            </div>
          </div>

          <div className="w-[30%] bg-linear-to-br from-purple-600 to-pink-500 rounded-lg flex flex-col items-center justify-center gap-2">
            <i className="ri-vip-diamond-fill text-3xl"></i>
            <p className="text-sm font-medium">Join Premium</p>
          </div>
        </div>

        <AccountTileTab
          title="Account"
          items={[
            { icon: "ri-file-list-3-line", label: "Manage your subscription" },
            { icon: "ri-pencil-line", label: "Edit personal info" },
            { icon: "ri-refresh-line", label: "Recover playlists" },
            { icon: "ri-home-4-line", label: "Address" },
          ]}
        />

        <AccountTileTab
          title="Payment"
          items={[
            { icon: "ri-file-list-2-line", label: "Order history" },
            { icon: "ri-bank-card-line", label: "Saved payment cards" },
            { icon: "ri-gift-line", label: "Redeem" },
          ]}
        />

        <AccountTileTab
          title="Security and privacy"
          items={[
            { icon: "ri-lock-line", label: "Change password" },
            { icon: "ri-apps-2-line", label: "Manage apps" },
          ]}
        />
      </div>
    </div>
  );
};

export default Account;
