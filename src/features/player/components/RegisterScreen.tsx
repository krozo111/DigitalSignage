interface RegisterScreenProps {
  registering: boolean;
  error: string;
  onRegister: () => void;
}

export function RegisterScreen({ registering, error, onRegister }: RegisterScreenProps) {
  return (
    <div className="flex flex-col h-full w-full items-center justify-center text-fg gap-8 px-6">
      <div className="text-center max-w-md">
        <h1 className="text-display text-fg">
          <span className="text-accent">Yugo</span> Signage Player
        </h1>
        <p className="text-fg-muted text-label mt-3">No screen is registered on this device.</p>
      </div>

      {error && (
        <div
          role="alert"
          className="bg-danger-soft border border-danger/40 text-danger px-4 py-3 rounded-lg text-label max-w-md"
        >
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={onRegister}
        disabled={registering}
        className="bg-accent hover:bg-accent-strong disabled:opacity-50 disabled:cursor-not-allowed text-on-accent font-semibold py-3.5 px-8 rounded-xl text-base transition-colors border-none cursor-pointer shadow-[0_1px_0_oklch(1_0_0/0.25)_inset,0_12px_28px_-12px_oklch(0.81_0.155_75/0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {registering ? "Registering" : "Register this screen"}
      </button>

      <p className="text-fg-subtle text-meta max-w-md text-center leading-relaxed">
        Creates a screen identity and shows a pairing code. Link it from the admin dashboard.
      </p>
    </div>
  );
}
