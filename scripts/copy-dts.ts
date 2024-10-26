import { cp } from "node:fs/promises";
import { fileURLToPath, URL } from "node:url";

async function main() {
  await cp(
    fileURLToPath(new URL("../packages/types/dist", import.meta.url)),
    fileURLToPath(new URL("../packages/viaz/dist/types", import.meta.url)),
    {
      force: true,
      recursive: true,
    }
  );

  console.info("copy dts ok...");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
