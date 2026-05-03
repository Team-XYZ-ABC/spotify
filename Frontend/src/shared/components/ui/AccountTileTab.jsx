import React from 'react'

const AccountTileTab = ({ title, items }) => {
  return (
    <div className="bg-zinc-800 rounded-lg p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      <div className="flex flex-col">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-3 cursor-pointer hover:bg-zinc-700 px-2 rounded-md transition"
          >
            <div className="flex items-center gap-3">
              <i className={`${item.icon} text-lg text-zinc-300`}></i>
              <span className="text-sm">{item.label}</span>
            </div>

            <i className="ri-arrow-right-s-line text-xl text-zinc-400"></i>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountTileTab