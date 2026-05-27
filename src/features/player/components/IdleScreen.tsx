interface IdleScreenProps {
  offline: boolean;
}

export function IdleScreen({ offline }: IdleScreenProps) {
  return (
    <div className="flex h-full w-full items-center justify-center text-fg-muted text-xl font-medium px-6 text-center">
      {offline ? "Offline — no content cached" : "Waiting for playlist..."}
    </div>
  );
}
