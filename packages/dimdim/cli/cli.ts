#!/usr/bin/env node

import { Command } from "commander";
import { spawn, execSync } from "child_process";
import * as path from "path";
import * as fs from "fs";

const program = new Command();

program
  .name("dimdim")
  .description("A lightweight eye strain protector screen fader CLI utility")
  .version("1.0.0");

const binaryPath = path.join(__dirname, "..", "bin", "blinker.exe");
const TASK_NAME = "BlinkGuard";

function checkPlatform() {
  if (process.platform !== "win32") {
    console.error("Error: dimdim currently only supports Windows because it relies on native Windows APIs.");
    process.exit(1);
  }
}

function isRunning(): boolean {
  try {
    const output = execSync('tasklist /FI "IMAGENAME eq blinker.exe" /NH', { encoding: "utf8" });
    return output.toLowerCase().includes("blinker.exe");
  } catch {
    return false;
  }
}

function taskExists(): boolean {
  try {
    execSync(`schtasks /QUERY /TN "${TASK_NAME}"`, { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

function ensureBinaryInAppData(): string {
  const appdata = process.env.APPDATA || "";
  const destDir = path.join(appdata, "BlinkGuard");
  const dest = path.join(destDir, "blinker.exe");
  fs.mkdirSync(destDir, { recursive: true });
  if (!fs.existsSync(dest) || fs.readFileSync(binaryPath).length !== fs.readFileSync(dest).length) {
    fs.copyFileSync(binaryPath, dest);
  }
  return dest;
}

function installTask(exePath: string, interval: string, fade: string): boolean {
  const batchCmd = `schtasks /CREATE /TN "${TASK_NAME}" /TR "\\"${exePath}\\" --interval ${interval} --fade ${fade}" /SC ONLOGON /F`;
  const tmpScript = path.join(process.env.TEMP || "", `blinkguard-${Date.now()}.bat`);
  fs.writeFileSync(tmpScript, batchCmd);

  try {
    console.log("  A UAC window will appear — click Yes to enable auto-start on login.");
    execSync(
      `powershell -Command "Start-Process cmd -ArgumentList '/c \\"${tmpScript}\\"' -Verb RunAs -Wait"`,
      { stdio: "pipe", timeout: 120000 }
    );
    return true;
  } catch {
    const cmd = `reg add HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run /v ${TASK_NAME} /t REG_SZ /d "${exePath} --interval ${interval} --fade ${fade}" /f`;
    try { execSync(cmd, { stdio: "pipe" }); } catch {}
    return false;
  } finally {
    try { fs.unlinkSync(tmpScript); } catch {}
  }
}

function removeTask(): void {
  if (!taskExists()) {
    try { execSync(`reg delete HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run /v ${TASK_NAME} /f`, { stdio: "pipe" }); } catch {}
    return;
  }

  const batchCmd = `schtasks /DELETE /TN "${TASK_NAME}" /F`;
  const tmpScript = path.join(process.env.TEMP || "", `blinkguard-rm-${Date.now()}.bat`);
  fs.writeFileSync(tmpScript, batchCmd);

  try {
    execSync(
      `powershell -Command "Start-Process cmd -ArgumentList '/c \\"${tmpScript}\\"' -Verb RunAs -Wait"`,
      { stdio: "pipe", timeout: 60000 }
    );
  } catch {
    execSync(`schtasks /DELETE /TN "${TASK_NAME}" /F`, { stdio: "pipe" });
  } finally {
    try { fs.unlinkSync(tmpScript); } catch {}
  }

  try { execSync(`reg delete HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run /v ${TASK_NAME} /f`, { stdio: "pipe" }); } catch {}
}

program
  .command("start")
  .description("Start dimdim in the background")
  .option("-i, --interval <seconds>", "Interval between breaks in seconds", "1200")
  .option("-f, --fade <seconds>", "Duration of screen fade in seconds", "20")
  .action((options) => {
    checkPlatform();

    if (!fs.existsSync(binaryPath)) {
      console.error(`Error: Could not find binary at: ${binaryPath}`);
      process.exit(1);
    }

    if (isRunning()) {
      console.log("dimdim is already running.");
      return;
    }

    const binaryDest = ensureBinaryInAppData();
    console.log(`Starting dimdim (Interval: ${options.interval}s, Fade: ${options.fade}s)...`);

    const usedTaskScheduler = installTask(binaryDest, options.interval, options.fade);

    const child = spawn(binaryDest, ["--interval", options.interval, "--fade", options.fade], {
      detached: true,
      stdio: "ignore",
    });
    child.unref();

    if (usedTaskScheduler) {
      console.log("dimdim started. It will auto-start on next login via Task Scheduler.");
    } else {
      console.log("dimdim started. Auto-start was set via registry (run 'dimdim start' again later as admin for Task Scheduler).");
    }
  });

program
  .command("stop")
  .description("Stop dimdim and remove it from startup")
  .action(() => {
    checkPlatform();

    if (isRunning()) {
      try {
        execSync("taskkill /F /IM blinker.exe", { stdio: "ignore" });
        console.log("dimdim stopped.");
      } catch {
        console.error("Failed to stop dimdim.");
      }
    } else {
      console.log("dimdim is not running.");
    }

    removeTask();
    console.log("Startup entries removed.");
  });

program
  .command("status")
  .description("Check if dimdim is running")
  .action(() => {
    checkPlatform();
    const running = isRunning();
    const hasTask = taskExists();
    if (running) console.log("Status: RUNNING");
    else console.log("Status: NOT RUNNING");
    if (hasTask) console.log("Startup: Task Scheduler (auto-start on login)");
    else console.log("Startup: Not configured. Run 'dimdim start' to enable.");
  });

program.parse(process.argv);
