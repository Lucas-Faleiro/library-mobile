// Starts Expo over USB: runs `adb reverse` and then Metro bound to IPv4.
//Add "usb": "node scripts/usb.js" to your package.json scripts
// Usage: npm run usb
const { spawnSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

// Set ADB_PATH to override; otherwise falls back to adb on PATH.
const FALLBACK_ADB =
  "C:\\Users\\lucassilva.est\\Downloads\\platform-tools-latest-windows (1)\\platform-tools\\adb.exe";
const adb =
  process.env.ADB_PATH || (fs.existsSync(FALLBACK_ADB) ? FALLBACK_ADB : "adb");

const reverse = spawnSync(adb, ["reverse", "tcp:8081", "tcp:8081"], {
  stdio: "inherit",
});
if (reverse.error || reverse.status !== 0) {
  console.error(
    "\nadb reverse failed. Plug in the phone, unlock it and accept the USB debugging prompt.",
  );
  process.exit(1);
}

const expoBin = path.join(
  __dirname,
  "..",
  "node_modules",
  "expo",
  "bin",
  "cli",
);
const child = spawn(
  process.execPath,
  [expoBin, "start", "--go", "--localhost", ...process.argv.slice(2)],
  {
    stdio: "inherit",
    env: { ...process.env, NODE_OPTIONS: "--dns-result-order=ipv4first" },
  },
);
child.on("exit", (code) => process.exit(code ?? 0));
