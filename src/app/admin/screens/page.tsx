"use client";

import { PageHeader } from "@/components/PageHeader";
import { StatStrip } from "@/components/ui/StatStrip";
import { ErrorState } from "@/components/ui/ErrorState";
import { RefreshNotice } from "@/components/ui/RefreshNotice";
import { PairScreenForm } from "@/features/screens/components/PairScreenForm";
import { ScreensList } from "@/features/screens/components/ScreensList";
import { useScreens } from "@/features/screens/hooks/useScreens";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { isScreenOnline } from "@/lib/screenStatus";
import { LocalTvControl } from "@/features/screens/components/LocalTvControl";

const localTvs = [
  { id: "jvc", label: "JVC 40 Android TV" },
  { id: "foyer", label: "foyer" },
  { id: "lvl35", label: "lvl35" },
] as const;

export default function ScreensPage() {
  useDocumentTitle("Screens — Yugo Signage");
  const { screens, playlists, loading, error, claim, updatePlaylist, remove, purge, refresh } = useScreens();
  const linkedScreens = screens.filter((screen) => !screen.pairingCode);
  const onlineScreens = linkedScreens.filter(isScreenOnline).length;
  const pendingScreens = screens.length - linkedScreens.length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Screen Management"
        description="Sync your Smart TVs by entering the pairing code."
      />
      <StatStrip
        items={[
          { label: "Screens", value: screens.length, detail: `${linkedScreens.length} linked` },
          { label: "Online", value: onlineScreens, detail: linkedScreens.length ? "Heartbeat in range" : "No linked screens", tone: onlineScreens ? "success" : "default" },
          { label: "Awaiting pairing", value: pendingScreens, detail: pendingScreens ? "Claim from this page" : "No pending devices", tone: pendingScreens ? "info" : "default" },
          { label: "Playlists", value: playlists.length, detail: "Available to assign" },
        ]}
      />
      {process.env.NODE_ENV === "development" && (
        <div className="grid gap-4 xl:grid-cols-2">
          {localTvs.map((tv) => <LocalTvControl key={tv.id} deviceId={tv.id} label={tv.label} />)}
        </div>
      )}
      {Boolean(error) && screens.length > 0 && <RefreshNotice onRetry={refresh} />}
      {error && screens.length === 0 ? (
        <ErrorState onRetry={refresh} />
      ) : (
        <>
          <PairScreenForm playlists={playlists} onClaim={claim} />
          <ScreensList
            screens={screens}
            playlists={playlists}
            loading={loading}
            onUpdatePlaylist={updatePlaylist}
            onDelete={remove}
            onPurge={purge}
          />
        </>
      )}
    </div>
  );
}
