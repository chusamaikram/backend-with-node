import VideoCard from "@/components/video/VideoCard";

function HistoryGroup({ label, videos }) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
        {label}
      </h2>
      <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {videos.map((v) => (
          <li key={v._id}><VideoCard video={v} /></li>
        ))}
      </ul>
    </section>
  );
}

export default HistoryGroup;
