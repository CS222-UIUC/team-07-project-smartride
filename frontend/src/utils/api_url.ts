import { Capacitor } from "@capacitor/core";

declare const __API_PORT__: string;
declare const __PROJECT_MODE__: string;   // BUILD vs DEV
declare const __DEPLOY_TARGET__: string;  // EMULATOR vs MACHINE
declare const __WLAN_IP__: string;

const API_PORT = __API_PORT__;
const PROJECT_MODE = __PROJECT_MODE__;
const DEPLOY_TARGET = __DEPLOY_TARGET__;
const WLAN_IP = __WLAN_IP__;

function getApiHost(): string {
    let apiHost = "127.0.0.1";
    if (PROJECT_MODE === "BUILD") {
        if (Capacitor.getPlatform() === "android" && DEPLOY_TARGET === "EMULATOR") {
            apiHost = "10.0.2.2";
        } else {
            apiHost = WLAN_IP;
        }
    }
    return apiHost;
}

export const API_URL = `http://${getApiHost()}:${API_PORT}`;
export const IS_DEV = PROJECT_MODE === "DEV";
export const IS_WEB = Capacitor.getPlatform() === "web";