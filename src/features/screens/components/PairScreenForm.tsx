"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { errorMessage } from "@/lib/errors";
import { Playlist } from "@/lib/services/playlistService";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { LinkIcon } from "@/components/icons";

interface PairScreenFormProps {
  playlists: Playlist[];
  onClaim: (code: string, name: string, playlistId: string | null) => Promise<void>;
}

export function PairScreenForm({ playlists, onClaim }: PairScreenFormProps) {
  const [pairingCode, setPairingCode] = useState("");
  const [newName, setNewName] = useState("");
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [nameError, setNameError] = useState("");

  const playlistOptions = useMemo(
    () => [
      { value: "", label: "-- None --" },
      ...playlists.map(pl => ({ value: pl.id, label: pl.name })),
    ],
    [playlists]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (pairingCode.length !== 6) {
      setCodeError("Code must be exactly 6 characters");
      return;
    }
    if (!newName.trim()) {
      setNameError("Screen name is required");
      return;
    }

    try {
      setClaiming(true);
      await onClaim(pairingCode, newName, selectedPlaylistId || null);
      setPairingCode("");
      setNewName("");
      setSelectedPlaylistId("");
      setCodeError("");
      setNameError("");
    } catch (err) {
      toast.error("Pairing error: " + errorMessage(err));
    } finally {
      setClaiming(false);
    }
  };

  return (
    <section className="rounded-lg border border-surface-border bg-surface-card p-4">
      <h2 className="text-label mb-4 flex items-center gap-2 text-ink">
        <LinkIcon className="text-action-coral" /> Pair a new screen
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-auto flex-1">
          <Input
            label="TV Code"
            required
            minLength={6}
            maxLength={6}
            placeholder="Ex: 1A2B3C"
            value={pairingCode}
            onChange={(e) => {
              setPairingCode(e.target.value.toUpperCase());
              if (e.target.value.length === 6) setCodeError("");
            }}
            error={codeError}
            className="uppercase tracking-widest font-mono"
          />
        </div>
        <div className="w-full md:w-auto flex-1">
          <Input
            label="Assigned Name"
            required
            placeholder="Ex: Main Reception"
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
              if (e.target.value.trim()) setNameError("");
            }}
            error={nameError}
          />
        </div>
        <div className="w-full md:w-auto flex-1">
          <Select
            label="Initial Playlist"
            value={selectedPlaylistId}
            onChange={(e) => setSelectedPlaylistId(e.target.value)}
            options={playlistOptions}
            aria-label="Select initial playlist"
          />
        </div>
        <Button type="submit" disabled={claiming} loading={claiming} className="w-full md:w-auto">
          {claiming ? "Connecting" : "Pair"}
        </Button>
      </form>
    </section>
  );
}
