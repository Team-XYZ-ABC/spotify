import TrackItem from "./TrackItem"

const TrackList = ({ tracks }) => (
  <>
    <h2 className="text-xl font-bold mb-1">Top tracks this month</h2>
    <p className="text-sm text-gray-400 mb-6">Only visible to you</p>

    <div className="space-y-3">
      {tracks.map((track) => (
        <TrackItem key={track.id} track={track} />
      ))}
    </div>
  </>
);
export default TrackList