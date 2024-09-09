// Setup: npm install alchemy-sdk
import { Alchemy, Network } from "alchemy-sdk";

const config = {
  apiKey: "Ln_N9nopsQWhEiuPukqD2lCfJDcKRzqU",
  network: Network.ETH_SEPOLIA,
};
const alchemy = new Alchemy(config);

const data = await alchemy.core.getAssetTransfers({
  fromBlock: "0x0",
  fromAddress: "0xf5052b56D6479cECc0F8db7264A0082F19C86457",
  category: ["external", "internal"],
});

console.log(data.transfers);