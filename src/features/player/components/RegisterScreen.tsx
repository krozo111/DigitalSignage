interface RegisterScreenProps {
  registering: boolean;
  error: string;
  onRegister: () => void;
}

export function RegisterScreen({ registering, error, onRegister }: RegisterScreenProps) {
  return (
    <div className="flex flex-col h-full w-full items-center justify-center text-fg gap-6 px-6">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Digital Signage Player</h1>
        <p className="text-fg-muted text-lg">No screen is registered on this device.</p>
      </div>

      {error && (
        <div
          role="alert"
          className="bg-danger-soft border border-danger/30 text-danger px-4 py-3 rounded-lg text-sm max-w-md"
        >
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={onRegister}
        disabled={registering}
        className="bg-accent hover:bg-accent/90 disabled:opacity-50 text-on-accent font-bold py-4 px-10 rounded-2xl text-xl transition-all border-none cursor-pointer shadow-[0_0_30px_rgba(239,184,81,0.3)] focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/40"
      >
        {registering ? "Registering..." : "Register New Screen"}
      </button>

      <p className="text-fg-subtle text-sm max-w-md text-center">
        This will create a screen identity and show a pairing code. You&apos;ll link it from
        the admin dashboard.
      </p>
    </div>
  );
}
