"use client";

import { PageHeader } from "@/components/PageHeader";
import { PairScreenForm } from "@/features/screens/components/PairScreenForm";
import { ScreensList } from "@/features/screens/components/ScreensList";
import { useScreens } from "@/features/screens/hooks/useScreens";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function ScreensPage() {
  useDocumentTitle("Screens — Yugo Signage");
  const { screens, playlists, loading, claim, updatePlaylist, remove, purge } = useScreens();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Screen Management"
        description="Sync your Smart TVs by entering the pairing code."
      />
      <PairScreenForm playlists={playlists} onClaim={claim} />
      <ScreensList
        screens={screens}
        playlists={playlists}
        loading={loading}
        onUpdatePlaylist={updatePlaylist}
        onDelete={remove}
        onPurge={purge}
      />
    </div>
  );
}
