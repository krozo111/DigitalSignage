interface PairingScreenProps {
  code: string;
  qrDataUrl: string;
}

export function PairingScreen({ code, qrDataUrl }: PairingScreenProps) {
  return (
    <div className="flex flex-col h-full w-full items-center justify-center text-fg px-6">
      <h1 className="text-xl md:text-2xl text-fg-muted uppercase tracking-widest mb-3">
        Pair your screen
      </h1>
      <p className="text-base md:text-lg text-fg-subtle mb-8">
        Open the control panel to pair this screen
      </p>

      <div className="flex flex-col md:flex-row items-center gap-8">
        <div
          className="text-7xl md:text-9xl font-bold tracking-widest bg-surface-strong border-4 border-accent/30 py-8 px-12 md:px-16 rounded-3xl text-accent font-mono"
          style={{ animation: "pulseGlow 3s ease-in-out infinite" }}
          aria-label={`Pairing code: ${code.split("").join(" ")}`}
        >
          {code}
        </div>

        <div className="relative flex h-32 w-32 items-center justify-center rounded-xl bg-white p-2 md:h-40 md:w-40">
          {qrDataUrl ? (
            <Image
              src={qrDataUrl}
              alt={`QR code for pairing code ${code}`}
              fill
              unoptimized
              sizes="160px"
              className="object-contain p-2"
            />
          ) : (
            <div className="w-full h-full bg-fg-disabled animate-pulse rounded" />
          )}
        </div>
      </div>

      <p className="text-fg-subtle text-sm mt-6">
        The code refreshes every 15 minutes until this screen is paired.
      </p>
    </div>
  );
}
import Image from "next/image";
