# dimdim

A ultra-lightweight break reminder and eye-strain protector for Windows, written in Rust and packaged as an npm CLI.

## How it works
`dimdim` runs in the background and overlays a semi-transparent black screen periodically to remind you to blink and rest your eyes (following the 20-20-20 rule).
* **Zero Resource Overhead**: Built with native Rust and Win32 APIs (only ~1.2 MB).
* **Single Instance Lock**: Ensures only one fader runs at a time using a local mutex.
* **Auto-run on Startup**: Registers itself to run automatically when Windows boots via Task Scheduler.

---

## Installation

Install globally via npm:
```bash
npm install -g dimdim
```

---

## Usage

### 1. Start the service
Start the background fader. You can customize the interval and fade duration:
```bash
# Start with defaults (20 minutes interval, 20 seconds fade)
dimdim start

# Start with custom settings (e.g. 10 minutes interval, 10 seconds fade)
dimdim start --interval 600 --fade 10
```
*Note: This will also automatically register dimdim to run on Windows logon with these exact settings.*

### 2. Check Status
Check if dimdim is currently running in the background:
```bash
dimdim status
```

### 3. Stop the service
Stop the background fader process:
```bash
dimdim stop
```

---

## Configuration Options (for `dimdim start`)

| Option | Shorthand | Default | Description |
|---|---|---|---|
| `--interval <seconds>` | `-i` | `1200` | The time (in seconds) between break screens. |
| `--fade <seconds>` | `-f` | `20` | How long the screen stays faded. |

---

## License
MIT
