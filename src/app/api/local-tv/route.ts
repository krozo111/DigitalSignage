import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";

export const runtime = "nodejs";

const execFileAsync = promisify(execFile);
const ACTIONS = new Set([
  "on",
  "off",
  "volume-up",
  "volume-down",
  "mute",
  "unmute",
  "volume",
  "launch-player",
]);
const TVS = {
  jvc: { host: process.env.LOCAL_TV_JVC_HOST ?? "Android-3.local" },
  foyer: { host: process.env.LOCAL_TV_FOYER_HOST ?? "10.61.0.27" },
  lvl35: { host: process.env.LOCAL_TV_LVL35_HOST ?? "10.61.0.38" },
} as const;
type DeviceId = keyof typeof TVS;

function deviceId(value: unknown): DeviceId | null {
  return typeof value === "string" && Object.hasOwn(TVS, value) ? value as DeviceId : null;
}

function unavailable() {
  return NextResponse.json(
    { error: "Local TV control is available from the development server on this Mac only." },
    { status: 404, headers: { "Cache-Control": "no-store" } }
  );
}

async function authorize(request: NextRequest, mutating: boolean): Promise<NextResponse | null> {
  if (process.env.NODE_ENV === "production" || process.env.LOCAL_TV_CONTROL_ENABLED !== "true") {
    return unavailable();
  }

  if (mutating) {
    const origin = request.headers.get("origin");
    if (!origin || origin !== request.nextUrl.origin) {
      return NextResponse.json({ error: "Cross-origin request rejected." }, { status: 403 });
    }
    const fetchSite = request.headers.get("sec-fetch-site");
    if (fetchSite && fetchSite !== "same-origin") {
      return NextResponse.json({ error: "Cross-origin request rejected." }, { status: 403 });
    }
  }

  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Administrator sign-in required." }, { status: 401 });
  }

  return null;
}

async function runCommand(device: DeviceId, action: "status" | string, level?: number) {
  const python = process.env.LOCAL_TV_PYTHON
    ?? `${process.cwd()}/.local/tv-remote-venv/bin/python`;
  const script = `${process.cwd()}/scripts/tv_remote.py`;
  const args = [script, action];
  if (action === "volume" && level !== undefined) args.push(String(level));
  args.push("--device", device, "--host", TVS[device].host);

  const { stdout } = await execFileAsync(python, args, {
    cwd: process.cwd(),
    timeout: 60_000,
    maxBuffer: 32 * 1024,
    env: process.env,
  });

  return JSON.parse(stdout.trim()) as {
    device: { manufacturer?: string; model?: string; sw_version?: string } | null;
    power: "on" | "off" | "unknown";
    app: string;
    volume: { level: number; max: number; muted: boolean } | null;
  };
}

export async function GET(request: NextRequest) {
  const denied = await authorize(request, false);
  if (denied) return denied;

  const device = deviceId(request.nextUrl.searchParams.get("device") ?? "jvc");
  if (!device) return NextResponse.json({ error: "Unknown TV." }, { status: 400 });

  try {
    const status = await runCommand(device, "status");
    return NextResponse.json(status, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[local-tv] status failed:", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Could not read the local TV status." }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  const denied = await authorize(request, true);
  if (denied) return denied;

  let body: { action?: unknown; level?: unknown; device?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const action = body.action;
  if (typeof action !== "string" || !ACTIONS.has(action)) {
    return NextResponse.json({ error: "Unsupported TV action." }, { status: 400 });
  }
  const device = deviceId(body.device ?? "jvc");
  if (!device) return NextResponse.json({ error: "Unknown TV." }, { status: 400 });
  if (device !== "jvc" && (action === "on" || action === "off")) {
    return NextResponse.json({ error: "Power control is not available for this TV." }, { status: 400 });
  }

  let level: number | undefined;
  if (action === "volume") {
    if (typeof body.level !== "number" || !Number.isInteger(body.level) || body.level < 0 || body.level > 100) {
      return NextResponse.json({ error: "Volume must be an integer from 0 to 100." }, { status: 400 });
    }
    level = body.level;
  } else if (body.level !== undefined) {
    return NextResponse.json({ error: "Only the volume action accepts a level." }, { status: 400 });
  }

  try {
    const status = await runCommand(device, action, level);
    return NextResponse.json(status, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error(`[local-tv] ${device} ${action} failed:`, error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "The TV did not confirm the requested action." }, { status: 503 });
  }
}
