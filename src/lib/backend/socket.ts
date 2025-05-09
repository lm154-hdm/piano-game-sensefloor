import io from "socket.io-client";

type RawData = {
  raw: Uint8Array;
};

type SensFloorData = {
  x: number;
  y: number;
  nno: number;
  ono: number;
  oso: number;
  sso: number;
  ssw: number;
  wsw: number;
  wnw: number;
  nnw: number;
};

let socket: SocketIOClient.Socket;

export function connect(ip: string, port: number): void {
  if (socket) {
    console.error("Already connected to socket");
    return;
  }
  socket = io(`http://${ip}:${port}`, {
    reconnection: true,
    reconnectionAttempts: 2,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    randomizationFactor: 0.5,
    timeout: 20000,
  });
  socket.on("connect", () => {
    console.log(`Connected to ${ip} on port ${port}`);
  });
  socket.on("connect_error", (error: any) => {
    console.log(`Could NOT connect to ${ip} on port ${port}.`, error);
  });

  socket.on("raw", (data: RawData) => {
    const d: SensFloorData = {
      x: data.raw[3],
      y: data.raw[4],
      wnw: Math.max(data.raw[9] - 128, 0),
      nnw: Math.max(data.raw[10] - 128, 0),
      nno: Math.max(data.raw[11] - 128, 0),
      ono: Math.max(data.raw[12] - 128, 0),
      oso: Math.max(data.raw[13] - 128, 0),
      sso: Math.max(data.raw[14] - 128, 0),
      ssw: Math.max(data.raw[15] - 128, 0),
      wsw: Math.max(data.raw[16] - 128, 0),
    };

    console.log(
      `Position x: ${d.x} | Position y: ${d.y} | nno: ${d.nno} | ono: ${d.ono} | oso: ${d.oso} | sso: ${d.sso} | ssw: ${d.ssw}| wsw: ${d.wsw}| wnw: ${d.wnw}| nnw: ${d.nnw}`,
    );
  });
}
