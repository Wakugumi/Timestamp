declare global {
  interface Window {
    snap: any; // For Midtrans script API
    electron: {
      invoke: (channel: string, data?: any) => Promise<any | void>;
      send: (channel: string, data?: any) => Promise<any | void>;
      on: (channel: string, callback: (...args: any[]) => void) => void;
    };
  }
}
window.electron = window.electron || {};
window.snap = windiw.snap | {};
export {};
