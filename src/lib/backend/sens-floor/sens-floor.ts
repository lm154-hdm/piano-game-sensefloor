import io from "socket.io-client";
import PadState from "./pad-state";
import { PadPart } from "./pad-part";
import { RawDataMapping } from "./raw-data-mapping";
import { settings } from "../settings.svelte";

interface SensFloorConfig {
    ip: string;
    port: number;
    width: number;
    height: number;
    rotateBy: number;
    flipX: number;
    flipY: number;
    cropLeft: number;
    cropRight: number;
    cropTop: number;
    cropBottom: number;
    offsetLeft: number;
    offsetRight: number;
    offsetTop: number;
    offsetBottom: number;
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

export enum SensFloorState {
    NONE,
    CONNECTING,
    CONNECTION_FAILED,
    CONNECTION_TIMEOUT,
    CONNECTION_SUCCESSFUL,
    MISSING_CONFIGURATION,
    ALREADY_CONNECTED,
}

let socket: SocketIOClient.Socket | undefined;
let config: SensFloorConfig;

const padStates: Array<Array<PadState>> = [];
const stepOnListeners: Array<StepEventCallback> = [];
const stepOffListeners: Array<StepEventCallback> = [];

function loadSensFloorConfig(): SensFloorConfig {
    const ip = import.meta.env.VITE_SENSFLOOR_IP;
    const port = import.meta.env.VITE_SENSFLOOR_PORT;
    const width = import.meta.env.VITE_SENSFLOOR_WIDTH;
    const height = import.meta.env.VITE_SENSFLOOR_HEIGHT;
    const rotateBy = import.meta.env.VITE_SENSFLOOR_ROTATE_BY;
    const flipX = import.meta.env.VITE_SENSFLOOR_FLIP_X;
    const flipY = import.meta.env.VITE_SENSFLOOR_FLIP_Y;
    const cropLeft = import.meta.env.VITE_APPLICATION_CROP_LEFT;
    const cropRight = import.meta.env.VITE_APPLICATION_CROP_RIGHT;
    const cropTop = import.meta.env.VITE_APPLICATION_CROP_TOP;
    const cropBottom = import.meta.env.VITE_APPLICATION_CROP_BOTTOM;
    const offsetLeft = import.meta.env.VITE_SENSFLOOR_OFFSET_LEFT;
    const offsetRight = import.meta.env.VITE_SENSFLOOR_OFFSET_RIGHT;
    const offsetTop = import.meta.env.VITE_SENSFLOOR_OFFSET_TOP;
    const offsetBottom = import.meta.env.VITE_SENSFLOOR_OFFSET_BOTTOM;

    return {
        ip,
        port,
        width,
        height,
        rotateBy,
        flipX,
        flipY,
        cropLeft,
        cropRight,
        cropTop,
        cropBottom,
        offsetLeft,
        offsetRight,
        offsetTop,
        offsetBottom,
    };
}

function isConfigComplete(): boolean {
    if (
        config.ip &&
        config.port &&
        config.width &&
        config.height &&
        config.rotateBy &&
        config.flipX &&
        config.flipY &&
        config.cropLeft &&
        config.cropRight &&
        config.cropTop &&
        config.cropBottom &&
        config.offsetLeft &&
        config.offsetRight &&
        config.offsetTop &&
        config.offsetBottom
    ) {
        return true;
    }
    return false;
}

export async function load(): Promise<SensFloorState> {
    if (socket?.connected) {
        console.warn("SensFloor is already loaded");
        return SensFloorState.ALREADY_CONNECTED;
    }

    config = loadSensFloorConfig();

    // We know that this is not a beautiful solution,
    // but we wanted a way to receive the information about the .env file inside of the application,
    // because the git respository where this is described is going to be deleted at the end of WS 25/26
    if (!isConfigComplete()) {
        console.error(
            "Missing parameters in SensFloor config. Check the '.env' file of your project and make sure that the following parameters are set:",
            '"VITE_SENSFLOOR_IP"',
            '"VITE_SENSFLOOR_PORT"',
            '"VITE_SENSFLOOR_WIDTH"',
            '"VITE_SENSFLOOR_HEIGHT"',
            '"VITE_SENSFLOOR_ROTATE_BY"',
            '"VITE_SENSFLOOR_FLIP_X"',
            '"VITE_SENSFLOOR_FLIP_Y"',
            '"VITE_APPLICATION_CROP_LEFT"',
            '"VITE_APPLICATION_CROP_RIGHT"',
            '"VITE_APPLICATION_CROP_TOP"',
            '"VITE_APPLICATION_CROP_BOTTOM"',
            '"VITE_SENSFLOOR_OFFSET_LEFT"',
            '"VITE_SENSFLOOR_OFFSET_RIGHT"',
            '"VITE_SENSFLOOR_OFFSET_TOP"',
            '"VITE_SENSFLOOR_OFFSET_BOTTOM"',
        );
        return SensFloorState.MISSING_CONFIGURATION;
    }

    for (let x = 1; x <= config.width; x++) {
        const padColumn: Array<PadState> = [];
        for (let y = 1; y <= config.height; y++) {
            padColumn.push(new PadState(x, y, stepOn, stepOff));
        }
        padStates.push(padColumn);
    }

    return new Promise((resolve, reject) => {
        socket = io(`http://${config.ip}:${config.port}`);

        socket.on("connect", () => {
            console.log("Connected to SensFloor");
            resolve(SensFloorState.CONNECTION_SUCCESSFUL);
        });

        socket.on("connect_error", () => {
            console.log("Connection to SensFloor failed");
            resolve(SensFloorState.CONNECTION_FAILED);
        });

        socket.on("connect_timeout", () => {
            console.log("Connection to SensFloor timeouted");
            resolve(SensFloorState.CONNECTION_TIMEOUT);
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
    const halfPadSize = 1 / (config.width * 2) / 2;
    let result = { x: 0, y: 0 };

    // Caluclate x coordinate
    result.x = x / config.width;
    result.x -= 1 / (config.width * 2); // Move coordinate to the middle of the pad
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
    result.y = y / config.height;
    result.y -= 1 / (config.height * 2); // Move coordinate to the middle of the pad
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
    if (config.flipX) {
        x = 1.0 - x;
    }
    if (config.flipY) {
        y = 1.0 - y;
    }

    // Coordinates range from {0, 1}, move them so they range from {-0.5, 0.5}
    x -= 0.5;
    y -= 0.5;

    // Rotate around origin
    const backupX = x;
    const angle = config.rotateBy;
    x = x * Math.cos(angle) - y * Math.sin(angle);
    y = backupX * Math.sin(angle) + y * Math.cos(angle);

    // Move coordinates back to {0, 1}
    x += 0.5;
    y += 0.5;

    return { x, y };
}

export function getConfig(): SensFloorConfig {
    return { ...config };
}

export function getDimension(): { x: number; y: number } {
    return { x: config.width, y: config.height };
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
