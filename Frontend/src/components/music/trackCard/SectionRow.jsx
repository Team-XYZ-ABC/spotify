import React from 'react'
import TrackCard from './TrackCard';

const SectionRow = ({ title, items, type, onPlay  }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white hover:underline cursor-pointer">
          {title}
        </h2>
        <button className="text-sm font-medium text-[#b3b3b3] hover:text-white hover:underline transition">
          Show all
        </button>
      </div>

      <div className="scrollbar-hide relative -mx-6 overflow-x-auto px-6 pb-4 scroll-smooth">
        <div className="flex gap-6">
          {items.map((item) => (
            <TrackCard key={item.id} item={item} type={type} onPlay={onPlay}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectionRow