import { assert } from "https://deno.land/std@0.207.0/assert/mod.ts";
import { isValidSignature } from "./main.ts";

// Randomly generated address
// TODO: dynamically generate address and signatures
const address = "0xCA6448b3C39BD444B9c473109020DF579b130204";

Deno.test("verifies null message", () => {
  const message = "";
  const signature =
    "0x8f542e7fb2bd22d0b871f8f5d05ac9bf88bc2dc15fa328fad5c4bc36b161edb800385ac3c8c9e62f2a90295293ed54449d75a81d5c233e6a62915fbb1cad8d681b";
  assert(isValidSignature(address, message, signature));
});

Deno.test("verifies simple message", () => {
  const message = "Hello, world!";
  const signature =
    "0xd682191e422490844737a88260fa198c83dc1fed8c56d4bd4d98feb620cb2df04d9e72b088aa8d03a853c5d82205dca59e4b4585c03b6e3480fe1403741e47e71c";
  assert(isValidSignature(address, message, signature));
});

Deno.test("verifies complex message", () => {
  const message = "😂👨‍👨‍👧‍👧🏴‍☠️";
  const signature =
    "0xab995ff583d82b02eb114820abd73fdfbb64578c6414f35ef6f6c7c2428ff8c53086f015fe298016a10ad70a7222939182fd292a33468398aaa4e5d306f56b531b";
  assert(isValidSignature(address, message, signature));
});

// TODO: verifies long message

Deno.test("rejects manipulated signature", () => {
  const message = "";
  const signature =
    "0x7f542e7fb2bd22d0b871f8f5d05ac9bf88bc2dc15fa328fad5c4bc36b161edb800385ac3c8c9e62f2a90295293ed54449d75a81d5c233e6a62915fbb1cad8d681b";
  assert(!isValidSignature(address, message, signature));
});

Deno.test("rejects manipulated message", () => {
  const message = "a";
  const signature =
    "0x8f542e7fb2bd22d0b871f8f5d05ac9bf88bc2dc15fa328fad5c4bc36b161edb800385ac3c8c9e62f2a90295293ed54449d75a81d5c233e6a62915fbb1cad8d681b";
  assert(!isValidSignature(address, message, signature));
});
