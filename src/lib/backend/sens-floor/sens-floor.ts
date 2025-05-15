import io from "socket.io-client";
import PadState from "./pad-state";
import { PadPart } from "./pad-part";
import { RawDataMapping } from "./raw-data-mapping";

export type StepCallback = (x: number, y: number, part: PadPart) => void;

let socket: SocketIOClient.Socket;

const padStates: Array<Array<PadState>> = [];
const stepOnListeners: Array<StepCallback> = [];
const stepOffListeners: Array<StepCallback> = [];

export function initialise(padCountWidth: number, padCountHeight: number): void {
    for (let x = 1; x <= padCountWidth; x++) {
        const padColumn: Array<PadState> = [];
        for (let y = 1; y <= padCountHeight; y++) {
            padColumn.push(new PadState(x, y, stepOn, stepOff));
        }
        padStates.push(padColumn);
    }
}

export function connect(ip: string, port: number): void {
    if (padStates.length === 0) {
        console.error("Failed to connect SensFloor because it's not initialised");
        return;
    }
    if (socket) {
        console.error("Failed to connect SensFloor because it's already connected");
        return;
    }

    socket = io(`http://${ip}:${port}`);

    socket.on("connect", () => {
        console.log(`Connected to ${ip} on port ${port}`);
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
}

export function disconnect(): void {
    if (!socket) {
        console.error("Failed to disconnect SensFloor because it's not connected");
        return;
    }
    socket.close();
}

export function addStepOnListener(listener: StepCallback) {
    stepOnListeners.push(listener);
}

export function addStepOffListener(listener: StepCallback) {
    stepOffListeners.push(listener);
}

function stepOn(x: number, y: number, direction: PadPart): void {
    for (const listener of stepOnListeners) {
        listener(x, y, direction);
    }
}

function stepOff(x: number, y: number, direction: PadPart): void {
    for (const listener of stepOffListeners) {
        listener(x, y, direction);
    }
}
