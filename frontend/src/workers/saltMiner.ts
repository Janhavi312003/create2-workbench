import { ethers } from "ethers";

export {};

interface RunPayload {
  deployerAddress: string;
  initCodeHash: string;
  prefix: string;
  startNonce: string;
  maxIterations: number;
}

type WorkerMessage = { type: "run"; payload: RunPayload } | { type: "cancel" };

let cancelled = false;

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const d = e.data;
  if (!d) return;
  if (d.type === "cancel") {
    cancelled = true;
    return;
  }
  if (d.type !== "run") return;
  cancelled = false;
  mine(d.payload);
};

const CHUNK = 4096n;

function mine(payload: RunPayload) {
  const { deployerAddress, initCodeHash, prefix, startNonce, maxIterations } =
    payload;

  let counter = BigInt(startNonce);
  const start = BigInt(startNonce);
  const limit = start + BigInt(maxIterations);
  const targetPrefix = prefix.toLowerCase().replace("0x", "");
  let found = false;

  const step = () => {
    const chunkEnd = counter + CHUNK;
    const chunkLimit = chunkEnd < limit ? chunkEnd : limit;

    while (counter < chunkLimit && !found && !cancelled) {
      const salt = ethers.zeroPadValue(ethers.toBeHex(counter), 32);

      try {
        const create2Inputs = ethers.solidityPacked(
          ["bytes1", "address", "bytes32", "bytes32"],
          ["0xff", deployerAddress, salt, initCodeHash],
        );

        const hash = ethers.keccak256(create2Inputs);
        const address = "0x" + hash.slice(-40);

        if (address.toLowerCase().startsWith("0x" + targetPrefix)) {
          const iterations = Number(counter - start) + 1;
          self.postMessage({
            type: "found",
            salt,
            address: ethers.getAddress(address),
            iterations,
          });
          found = true;
          break;
        }

        const done = counter - start;
        if (done > 0n && done % 5000n === 0n) {
          self.postMessage({
            type: "progress",
            current: Number(done),
            total: maxIterations,
          });
        }
      } catch {
        self.postMessage({
          type: "error",
          message: "Error during calculation",
        });
        return;
      }

      counter += 1n;
    }

    if (found) return;

    if (cancelled) {
      self.postMessage({
        type: "complete",
        message: "Search cancelled",
      });
      return;
    }

    if (counter >= limit) {
      self.postMessage({
        type: "complete",
        message: `Searched ${maxIterations} salts, no match found`,
      });
      return;
    }

    setTimeout(step, 0);
  };

  step();
}
