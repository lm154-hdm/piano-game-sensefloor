import io from "socket.io-client";
import PadState from "./pad-state";
import { PadPart } from "./pad-part";
import { RawDataMapping } from "./raw-data-mapping";
import { settings } from "../settings.svelte";
import { invoke } from "@tauri-apps/api/core";
import * as Path from "@tauri-apps/api/path";

interface SensFloorConnectionInfo {
    ip: string;
    port: 8000;
}

export type StepEvent = (x: number, y: number, padPart: PadPart) => void;

export type StepEventData = {
    padX: number;
    padY: number;
    padPart: PadPart;
    normalisedX: number;
    normalisedY: number;
};

export type StepEventCallback = (event: StepEventData) => void;

export enum ConnectionState {
    NONE,
    CONNECTING,
    CONNECTION_FAILED,
    CONNECTION_TIMEOUT,
    CONNECTION_SUCCESSFUL,
    NO_CONNECTION_INFORMATION,
    ALREADY_CONNECTED,
}

let socket: SocketIOClient.Socket | undefined;
let dimension: { x: number; y: number } = { x: -1, y: -1 };

const padStates: Array<Array<PadState>> = [];
const stepOnListeners: Array<StepEventCallback> = [];
const stepOffListeners: Array<StepEventCallback> = [];

async function getInfoPath(): Promise<string> {
    const dataPath = await Path.appDataDir();
    console.log(dataPath);
    return await Path.join(dataPath, "config.enc");
}

export async function load(): Promise<ConnectionState> {
    if (socket?.connected) {
        console.warn("SensFloor is already loaded");
        return ConnectionState.ALREADY_CONNECTED;
    }

    const path = await getInfoPath();
    const doesInfoFileExist = await invoke<boolean>("does_file_exist", { path });
    if (!doesInfoFileExist) {
        return ConnectionState.NO_CONNECTION_INFORMATION;
    }

    applyDimension();

    const { ip, port }: SensFloorConnectionInfo = await invoke<SensFloorConnectionInfo>(
        "load_sensfloor_connection_info",
        {
            path,
        },
    );

    return new Promise((resolve, reject) => {
        socket = io(`http://${ip}:${port}`);

        socket.on("connect", () => {
            console.log("Connected to SensFloor");
            resolve(ConnectionState.CONNECTION_SUCCESSFUL);
        });

        socket.on("connect_error", () => {
            console.log("Connection to SensFloor failed");
            resolve(ConnectionState.CONNECTION_FAILED);
        });

        socket.on("connect_timeout", () => {
            console.log("Connection to SensFloor timeouted");
            resolve(ConnectionState.CONNECTION_TIMEOUT);
        });

        socket.on("raw", (data: { raw: Uint8Array }) => {
            const x: number = data.raw[RawDataMapping.POSITION_X] - 1;
            const y: number = data.raw[RawDataMapping.POSITION_Y] - 1;

            // Pad values in default state (no pressure on pad) have slight variations from 125-128
            // Subtract 128 and take the max with 0 to map default state to 0
            const nno: number = Math.max(data.raw[RawDataMapping.PAD_NNO] - 128, 0);
            const ono: number = Math.max(data.raw[RawDataMapping.PAD_ONO] - 128, 0);
            const oso: number = Math.max(data.raw[RawDataMapping.PAD_OSO] - 128, 0);
            const sso: number = Math.max(data.raw[RawDataMapping.PAD_SSO] - 128, 0);
            const ssw: number = Math.max(data.raw[RawDataMapping.PAD_SSW] - 128, 0);
            const wsw: number = Math.max(data.raw[RawDataMapping.PAD_WSW] - 128, 0);
            const wnw: number = Math.max(data.raw[RawDataMapping.PAD_WNW] - 128, 0);
            const nnw: number = Math.max(data.raw[RawDataMapping.PAD_NNW] - 128, 0);

            padStates[x][y].update(nno, ono, oso, sso, ssw, wsw, wnw, nnw);
        });
    });
}

function applyDimension(): void {
    dimension.x = settings.sensFloorConfig.width;
    dimension.y = settings.sensFloorConfig.height;

    for (let x = 1; x <= dimension.x; x++) {
        const padColumn: Array<PadState> = [];
        for (let y = 1; y <= dimension.y; y++) {
            padColumn.push(new PadState(x, y, stepOn, stepOff));
        }
        padStates.push(padColumn);
    }
}

export function disconnect(): void {
    if (!socket) {
        console.error("Failed to disconnect SensFloor because it's not connected");
        return;
    }
    socket.close();
    socket = undefined;
}

export function addStepOnListener(listener: StepEventCallback): void {
    stepOnListeners.push(listener);
}

export function addStepOffListener(listener: StepEventCallback): void {
    stepOffListeners.push(listener);
}

export function removeAllListeners(): void {
    stepOnListeners.length = 0;
    stepOffListeners.length = 0;
}

export function calculateNormalisedCoordinates(
    x: number,
    y: number,
    normalisedCoordinatespadPart: PadPart,
): { x: number; y: number } {
    const halfPadSize = 1 / (dimension.x * 2) / 2;
    let result = { x: 0, y: 0 };

    // Caluclate x coordinate
    result.x = x / dimension.x;
    result.x -= 1 / (dimension.x * 2); // Move coordinate to the middle of the pad
    if (
        normalisedCoordinatespadPart == PadPart.NNO ||
        normalisedCoordinatespadPart == PadPart.ONO ||
        normalisedCoordinatespadPart == PadPart.OSO ||
        normalisedCoordinatespadPart == PadPart.SSO
    ) {
        result.x += halfPadSize;
    } else {
        result.x -= halfPadSize;
    }

    // Caluclate y coordinate
    result.y = y / dimension.y;
    result.y -= 1 / (dimension.y * 2); // Move coordinate to the middle of the pad
    if (
        normalisedCoordinatespadPart == PadPart.WNW ||
        normalisedCoordinatespadPart == PadPart.NNW ||
        normalisedCoordinatespadPart == PadPart.NNO ||
        normalisedCoordinatespadPart == PadPart.ONO
    ) {
        result.y += halfPadSize;
    } else {
        result.y -= halfPadSize;
    }

    return applyMappingToCoordinates(result.x, result.y);
}

function applyMappingToCoordinates(x: number, y: number): { x: number; y: number } {
    if (settings.sensFloorConfig.flipX) {
        x = 1.0 - x;
    }
    if (settings.sensFloorConfig.flipY) {
        y = 1.0 - y;
    }

    // Coordinates range from {0, 1}, move them so they range from {-0.5, 0.5}
    x -= 0.5;
    y -= 0.5;

    // Rotate around origin
    const backupX = x;
    const angle = settings.sensFloorConfig.rotateBy;
    x = x * Math.cos(angle) - y * Math.sin(angle);
    y = backupX * Math.sin(angle) + y * Math.cos(angle);

    // Move coordinates back to {0, 1}
    x += 0.5;
    y += 0.5;

    return { x, y };
}

export function getDimension(): { x: number; y: number } {
    return { x: dimension.x, y: dimension.y };
}

function stepOn(x: number, y: number, padPart: PadPart): void {
    const normalisedCoordinates = calculateNormalisedCoordinates(x, y, padPart);
    for (const listener of stepOnListeners) {
        listener({
            padX: x,
            padY: y,
            padPart: padPart,
            normalisedX: normalisedCoordinates.x,
            normalisedY: normalisedCoordinates.y,
        });
    }
}

function stepOff(x: number, y: number, padPart: PadPart): void {
    const normalisedCoordinates = calculateNormalisedCoordinates(x, y, padPart);
    for (const listener of stepOffListeners) {
        listener({
            padX: x,
            padY: y,
            padPart: padPart,
            normalisedX: normalisedCoordinates.x,
            normalisedY: normalisedCoordinates.y,
        });
    }
}
