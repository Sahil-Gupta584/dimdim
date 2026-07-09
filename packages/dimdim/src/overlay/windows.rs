use std::thread;
use std::time::Duration;

use windows::Win32::Foundation::*;
use windows::Win32::Graphics::Gdi::*;
use windows::Win32::System::LibraryLoader::GetModuleHandleW;
use windows::Win32::UI::WindowsAndMessaging::*;

use windows::core::w;

pub fn show_fade(duration_secs: u64) {
    unsafe {
        let h_instance = GetModuleHandleW(None).unwrap();

        let class_name = w!("BlinkGuardOverlay");
        unsafe extern "system" fn window_proc(
            hwnd: HWND,
            msg: u32,
            wparam: WPARAM,
            lparam: LPARAM,
        ) -> LRESULT {
            unsafe { DefWindowProcW(hwnd, msg, wparam, lparam) }
        }

        let wnd_class = WNDCLASSW {
            lpfnWndProc: Some(window_proc),
            hInstance: h_instance.into(),
            lpszClassName: class_name,
            hbrBackground: HBRUSH(GetStockObject(BLACK_BRUSH).0),
            ..Default::default()
        };

        RegisterClassW(&wnd_class);

        let hwnd = CreateWindowExW(
            WS_EX_TOPMOST | WS_EX_LAYERED,
            class_name,
            w!(""),
            WS_POPUP,
            0,
            0,
            GetSystemMetrics(SM_CXSCREEN),
            GetSystemMetrics(SM_CYSCREEN),
            None,
            None,
            h_instance,
            None,
        );

        SetLayeredWindowAttributes(hwnd, COLORREF(0), 220, LWA_ALPHA).unwrap();
        ShowWindow(hwnd, SW_SHOW);
        UpdateWindow(hwnd);

        thread::sleep(Duration::from_secs(duration_secs));

        DestroyWindow(hwnd).unwrap();
    }
}
