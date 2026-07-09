#![windows_subsystem = "windows"]
mod overlay;

use std::thread;
use std::time::Duration;
use windows::Win32::Foundation::{CloseHandle, GetLastError, SetLastError, ERROR_ALREADY_EXISTS, WIN32_ERROR};
use windows::Win32::System::Threading::CreateMutexW;
use windows::core::w;

const INTERVAL_SEC: u64 = 1200;
const FADE_SEC: u64 = 20;

fn ensure_single_instance() -> bool {
    unsafe {
        SetLastError(WIN32_ERROR(0));
        let result = CreateMutexW(None, true, w!("Local\\BlinkGuardMutex_v1"));
        match result {
            Ok(handle) => {
                match GetLastError() {
                    Ok(()) => true,
                    Err(e) => {
                        let already_exists: windows::core::HRESULT = ERROR_ALREADY_EXISTS.into();
                        if e.code() == already_exists {
                            let _ = CloseHandle(handle);
                            false
                        } else {
                            true
                        }
                    }
                }
            }
            Err(_) => false,
        }
    }
}

fn main() {
    if !ensure_single_instance() {
        return;
    }

    let args: Vec<String> = std::env::args().collect();
    let mut interval_sec = INTERVAL_SEC;
    let mut fade_sec = FADE_SEC;

    let mut i = 1;
    while i < args.len() {
        if args[i] == "--interval" && i + 1 < args.len() {
            if let Ok(val) = args[i + 1].parse::<u64>() {
                interval_sec = val;
            }
            i += 2;
        } else if args[i] == "--fade" && i + 1 < args.len() {
            if let Ok(val) = args[i + 1].parse::<u64>() {
                fade_sec = val;
            }
            i += 2;
        } else {
            i += 1;
        }
    }

    loop {
        thread::sleep(Duration::from_secs(interval_sec));
        overlay::windows::show_fade(fade_sec);
    }
}
