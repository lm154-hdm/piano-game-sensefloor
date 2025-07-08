import io from "socket.io-client";
import PadState from "./pad-state";
import { PadPart } from "./pad-part";
import { RawDataMapping } from "./raw-data-mapping";
import { values } from "../values.svelte";

interface SensFloorConfig {
    ip: string;
    port: number;
    width: number;
    height: number;
    rotateBy: number;
    flipX: boolean;
    flipY: boolean;
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

const padStates: Map<string, PadState> = new Map();
const stepOnListeners: Array<StepEventCallback> = [];
const stepOffListeners: Array<StepEventCallback> = [];

// This is on ugly motherfucker, but it works
function loadSensFloorConfig(): SensFloorConfig | undefined {
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

    if (
        !ip ||
        !port ||
        !width ||
        !height ||
        !rotateBy ||
        !flipX ||
        !flipY ||
        !cropLeft ||
        !cropRight ||
        !cropTop ||
        !cropBottom ||
        !offsetLeft ||
        !offsetRight ||
        !offsetTop ||
        !offsetBottom
    ) {
        return undefined;
    }

    return {
        ip,
        port: parseInt(port),
        width: parseInt(width),
        height: parseInt(height),
        rotateBy: parseFloat(rotateBy),
        flipX: JSON.parse(flipX),
        flipY: JSON.parse(flipY),
        cropLeft: parseInt(cropLeft),
        cropRight: parseInt(cropRight),
        cropTop: parseInt(cropTop),
        cropBottom: parseInt(cropBottom),
        offsetLeft: parseInt(offsetLeft),
        offsetRight: parseInt(offsetRight),
        offsetTop: parseInt(offsetTop),
        offsetBottom: parseInt(offsetBottom),
    };
}

export async function load(): Promise<SensFloorState> {
    if (socket?.connected) {
        console.warn("SensFloor is already loaded");
        return SensFloorState.ALREADY_CONNECTED;
    }

    const tempConfig = loadSensFloorConfig();
    if (!tempConfig) {
        console.error(
            "Missing parameters in SensFloor config. Check the '.env' file of your project and make sure that everything is defined and set",
        );
        return SensFloorState.MISSING_CONFIGURATION;
    }

    config = tempConfig;

    for (let x = 1 + config.offsetLeft; x <= config.width - config.offsetRight; x++) {
        for (let y = 1 + config.offsetBottom; y <= config.height - config.offsetTop; y++) {
            padStates.set(`${x}${y}`, new PadState(x, y, stepOn, stepOff));
        }
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
            const x: number = data.raw[RawDataMapping.POSITION_X];
            const y: number = data.raw[RawDataMapping.POSITION_Y];

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

            const padState = padStates.get(`${x}${y}`);
            if (padState) {
                padState.update(nno, ono, oso, sso, ssw, wsw, wnw, nnw);
            }
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

export function registerStepOnListeners(): void {
    stepOnListeners.push((event: StepEventData): void => {
        const x = event.normalisedX * values.playAreaWidth;
        const y = event.normalisedY * values.playAreaHeight;

        const element: HTMLButtonElement = document.elementFromPoint(x, y) as HTMLButtonElement;
        if (element) {
            element.click();
        }
    });
}

export function unregsiterStepOnListeners(): void {
    stepOnListeners.length = 0;
}

export function calculateNormalisedCoordinates(
    x: number,
    y: number,
    normalisedCoordinatespadPart: PadPart,
): { x: number; y: number } {
    const result = { x: 0, y: 0 };
    
    // Calculate x coordinate
    const width = config.width - config.offsetLeft - config.offsetRight;
    x -= config.offsetLeft;
    result.x = mapRangeToRange(x, 1, width + 1, 0, 1);

    // Move x coordinate to middle of pad
    const padWidth = 1 / width;
    const padPartWidth = padWidth / 2;
    result.x += padPartWidth;

    // Move x coordinate to middle of pad part
    /*if (
        normalisedCoordinatespadPart == PadPart.NNO ||
        normalisedCoordinatespadPart == PadPart.ONO ||
        normalisedCoordinatespadPart == PadPart.OSO ||
        normalisedCoordinatespadPart == PadPart.SSO
    ) {
        result.x += padPartWidth / 2;
    } else {
        result.x -= padPartWidth / 2;
    }*/
    
    // Calculate y coordinate
    const height = config.height - config.offsetTop - config.offsetBottom;
    y -= config.offsetBottom;
    result.y = mapRangeToRange(y, 1, height + 1, 0, 1);

    // Move y coordinate to middle of pad
    const padHeight = 1 / height;
    const padPartHeight = padHeight / 2;
    result.y += padPartHeight;

    // Move y coordinate to middle of pad part
    /*if (
        normalisedCoordinatespadPart == PadPart.WNW ||
        normalisedCoordinatespadPart == PadPart.NNW ||
        normalisedCoordinatespadPart == PadPart.NNO ||
        normalisedCoordinatespadPart == PadPart.ONO
    ) {
        result.y += padPartHeight / 2;
    } else {
        result.y -= padPartHeight / 2;
    }*/

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

function mapRangeToRange(value: number, fromOld: number, toOld: number, fromNew: number, toNew: number): number {
    return (value - fromOld) * (toNew - fromNew) / (toOld - fromOld) + fromNew;
}
