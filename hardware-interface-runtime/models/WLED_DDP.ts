import dgram from "dgram";
import { runInAction } from "mobx";
import { WLEDClient } from "wled-client";
import { iife } from "../../shared/misc";

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// DDP Protocol constants
// Byte 0 is Flags/Version: high nibble = version (0x4 -> v1), low nibble = flags (bit0 = PUSH)
const VER1 = 0x40; // version 1 in high nibble
const FLAG_PUSH = 0x01; // push flag
const DATA_TYPE = 0x01; // Data type RGB
const OUTPUT_ID = 0x01; // Default ID for output device

const connectWLEDDDP = async ({
  host,
  port,
  signal,
}: {
  host: string;
  port: number;
  signal?: AbortSignal;
}) => {
  let attempt = 0;
  const maxDelay = 5000;
  const baseDelay = 500;

  while (true) {
    if (signal?.aborted) throw new Error("Connection aborted before attempt");

    try {
      console.log(
        `WLED DDP connecting to ${host}:${port}${attempt > 0 ? ` (attempt ${attempt + 1})` : ""}`,
      );

      const socket = dgram.createSocket("udp4");
      const client = new WLEDClient({
        host,
        websocket: false,
      });

      socket.on("close", () => {
        console.log(`dgram socket on.close event to ${host}:${port}`);
      });

      await client.init();
      await client.turnOn();

      // Check if aborted after successful connection
      if (signal?.aborted) {
        console.log(
          `WLED DDP connection succeeded but was aborted, closing ${host}:${port}`,
        );
        socket.close();
        await client.turnOff();
        throw new Error("Connection aborted after successful connection");
      }

      console.log(`WLED DDP connection initialized to ${host}:${port}`);
      return { socket, client };
    } catch (error) {
      if (signal?.aborted) throw new Error("Connection aborted");

      attempt++;
      const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
      console.error(
        `WLED DDP connection failed to ${host}:${port}, retrying in ${delay}ms... error was: ${error}`,
      );
      await sleep(delay);
    }
  }
};

export const createAndConnectWLEDDDP = async ({
  host,
  port,
  signal,
}: {
  host: string;
  port: number;
  signal?: AbortSignal;
}) => {
  const { socket, client } = await connectWLEDDDP({ host, port, signal });

  let isClosedOrClosing = false;

  return {
    async send(rgbBytes: Uint8Array): Promise<void> {
      return new Promise((resolve, reject) => {
        if (isClosedOrClosing) return;

        const packet = iife(() => {
          const header = Buffer.alloc(10); // DDP header is 10 bytes
          header[0] = VER1 | FLAG_PUSH; // version + PUSH flag
          header[1] = 0x00; // Reserved for future use, set to 0.
          header[2] = DATA_TYPE;
          header[3] = OUTPUT_ID;
          header.writeUInt32BE(0, 4); // Offset set to 0
          header.writeUInt16BE(rgbBytes.length, 8); // Data length

          const data = Buffer.from(rgbBytes);

          return Buffer.concat([header, data]);
        });

        // console.log(
        //   `ccc Sending packet of ${packet.length} bytes to ${host}:${port}`,
        // );

        socket.send(
          packet,
          0,
          packet.length,
          port,
          host,
          (error: Error | null, _bytes: number) => {
            if (error) {
              const dataSize = packet.length - 10; // Subtract DDP header size
              reject(
                new Error(
                  `Error sending packet of ${dataSize} bytes to ${host}:${port}`,
                ),
              );
              return;
            }
            resolve();
          },
        );
      });
    },

    async setBrightness(brightness: number): Promise<void> {
      if (isClosedOrClosing) return;
      await client.setBrightness(clamp(brightness, 0, 255));
    },

    async close(): Promise<void> {
      if (isClosedOrClosing) return;
      isClosedOrClosing = true;
      console.log(`Closing WLED DDP connection to ${host}:${port}`);
      socket.close();
      await client.turnOff();
      console.log(`Closed WLED DDP connection to ${host}:${port}`);
    },
  };
};

export type WLEDDDPConnection = Awaited<
  ReturnType<typeof createAndConnectWLEDDDP>
>;
