import io from "socket.io-client";
import PadState from "./pad-state";
import { SensFloorRawDataMapping } from "./sens-floor-raw-data-mapping";

let socket: SocketIOClient.Socket;
const padStates: Array<Array<PadState>> = [];

export function initialise(
  padCountWidth: number,
  padCountHeight: number,
): void {
  if (padStates.length === 0) {
    console.error(
      "Failed to initialise SensFloor because it's already initialised",
    );
    return;
  }

  for (let x = 1; x <= padCountWidth; x++) {
    const padColumn: Array<PadState> = [];
    for (let y = 1; y <= padCountHeight; y++) {
      padColumn.push(new PadState(x, y));
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
    const x: number = data.raw[SensFloorRawDataMapping.POSITION_X];
    const y: number = data.raw[SensFloorRawDataMapping.POSITION_X];

    // Pad values in default state (no pressure on pad) have slight variations from 125-128
    // Subtract 128 and take the max with 0 to map default state to 0
    const wnw: number = Math.max(
      data.raw[SensFloorRawDataMapping.PAD_WNW] - 128,
      0,
    );
    const nnw: number = Math.max(
      data.raw[SensFloorRawDataMapping.PAD_NNW] - 128,
      0,
    );
    const nno: number = Math.max(
      data.raw[SensFloorRawDataMapping.PAD_NNO] - 128,
      0,
    );
    const ono: number = Math.max(
      data.raw[SensFloorRawDataMapping.PAD_ONO] - 128,
      0,
    );
    const oso: number = Math.max(
      data.raw[SensFloorRawDataMapping.PAD_OSO] - 128,
      0,
    );
    const sso: number = Math.max(
      data.raw[SensFloorRawDataMapping.PAD_SSO] - 128,
      0,
    );
    const ssw: number = Math.max(
      data.raw[SensFloorRawDataMapping.PAD_SSW] - 128,
      0,
    );
    const wsw: number = Math.max(
      data.raw[SensFloorRawDataMapping.PAD_WSW] - 128,
      0,
    );

    padStates[x][y].update(wnw, nnw, nno, ono, oso, sso, ssw, wsw);
  });
}

export function disconnect(): void {
  if (!socket) {
    console.error("Failed to disconnect SensFloor because it's not connected");
    return;
  }
  socket.close();
}
