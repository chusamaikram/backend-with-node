import { useState } from "react";
import { Link } from "react-router-dom";
import { MoreVertical, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { formatViews } from "@/utils/formatViews";
import { formatDate } from "@/utils/formatDate";

function VideoTable({ videos: initialVideos }) {
  const [videos, setVideos]           = useState(initialVideos);
  const [openMenu, setOpenMenu]       = useState(null);

  function togglePublish(id) {
    setVideos((p) => p.map((v) => v._id === id ? { ...v, ispublished: !v.ispublished } : v));
    setOpenMenu(null);
  }

  function deleteVideo(id) {
    setVideos((p) => p.filter((v) => v._id !== id));
    setOpenMenu(null);
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-bg-border">
      <table className="w-full text-sm">
        <thead className="bg-bg-elevated">
          <tr>
            <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Video</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Views</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Likes</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Status</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Date</th>
            <th className="px-4 py-3 w-10" />
          </tr>
        </thead>
        <tbody className="divide-y divide-bg-border">
          {videos.map((v) => (
            <tr key={v._id} className="hover:bg-bg-elevated/50 transition-colors">
              {/* Thumbnail + title */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img
                    src={v.thumbnail?.url}
                    alt=""
                    className="w-20 aspect-video object-cover rounded-lg shrink-0"
                  />
                  <Link
                    to={`/watch/${v._id}`}
                    className="text-text-primary hover:text-accent transition-colors font-medium line-clamp-2"
                  >
                    {v.title}
                  </Link>
                </div>
              </td>
              <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{formatViews(v.views)}</td>
              <td className="px-4 py-3 text-text-secondary">{v.likesCount?.toLocaleString()}</td>
              <td className="px-4 py-3">
                <Badge variant={v.ispublished ? "success" : "warning"}>
                  {v.ispublished ? "Published" : "Draft"}
                </Badge>
              </td>
              <td className="px-4 py-3 text-text-muted whitespace-nowrap">{formatDate(v.createdAt)}</td>
              {/* Action menu */}
              <td className="px-4 py-3">
                <div className="relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === v._id ? null : v._id)}
                    aria-label="Video actions"
                    className="p-1.5 rounded-md text-text-muted hover:bg-bg-border hover:text-text-primary transition-colors"
                  >
                    <MoreVertical size={16} aria-hidden="true" />
                  </button>
                  {openMenu === v._id && (
                    <div className="absolute right-0 top-full mt-1 w-40 bg-bg-surface border border-bg-border rounded-xl shadow-xl z-10 py-1">
                      <button
                        onClick={() => togglePublish(v._id)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors"
                      >
                        {v.ispublished ? <EyeOff size={14} /> : <Eye size={14} />}
                        {v.ispublished ? "Set as Draft" : "Publish"}
                      </button>
                      <button
                        onClick={() => deleteVideo(v._id)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-error hover:bg-error/10 transition-colors"
                      >
                        <Trash2 size={14} aria-hidden="true" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VideoTable;
