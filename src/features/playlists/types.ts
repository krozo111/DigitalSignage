import { MediaItem } from "@/lib/services/mediaService";
import { Playlist } from "@/lib/services/playlistService";

export interface BuiltItem extends MediaItem {
  duration: number;
}

export function buildItemsFromPlaylist(
  playlist: Playlist,
  mediaList: MediaItem[]
): BuiltItem[] {
  return playlist.items.map((item) => {
    const mediaInfo = mediaList.find((m) => m.id === item.mediaId);
    if (mediaInfo) {
      return { ...mediaInfo, duration: item.duration };
    }
    return {
      id: item.mediaId,
      name: "File not found",
      url: "",
      type: "img",
      size: 0,
      storagePath: "",
      createdAt: null,
      duration: item.duration,
    };
  });
}
