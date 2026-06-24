import VideoCard from "@/components/video/VideoCard";

function HistoryGroup({ label, videos }) {
    return (
        <section>
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
                {label}
            </h2>
            <ul role="list" className="space-y-3">
                {videos.map((v) => (
                    <li key={v._id}>
                        <VideoCard video={v} layout="horizontal" />
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default HistoryGroup;
