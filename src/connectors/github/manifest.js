import Ajv from "ajv/dist/2020.js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const schemaPath = join(dirname(fileURLToPath(import.meta.url)), "manifest.schema.json");
const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
const ajv = new Ajv({ allErrors: true, strict: false });
const validator = ajv.compile(schema);

export function validateManifest(manifest) {
  const valid = validator(manifest);
  const errors = valid
    ? []
    : (validator.errors || []).map((e) => {
        const where = e.instancePath || "(root)";
        return `${where} ${e.message}${e.params?.additionalProperty ? ` '${e.params.additionalProperty}'` : ""}`;
      });
  return { valid, errors };
}
