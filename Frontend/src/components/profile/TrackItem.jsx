const TrackItem = ({ track }) => (
  <div className="grid grid-cols-12 items-center hover:bg-[#1a1a1a] p-3 rounded">
    <span className="col-span-1 text-gray-400">{track.id}</span>

    <div className="col-span-6 flex gap-3">
      <img src={track.img} className="w-10 h-10 rounded" />
      <div>
        <p>{track.title}</p>
        <p className="text-xs text-gray-400">{track.artist}</p>
      </div>
    </div>

    <span className="col-span-3 text-gray-400">{track.album}</span>
    <span className="col-span-2 text-right text-gray-400">
      {track.duration}
    </span>
  </div>
);

export default TrackItem