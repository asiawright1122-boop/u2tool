import { locales } from "@/lib/i18n";
import { defineToolCapabilityProfile } from "../define-profile";

export const hexEditorCapabilityProfile = defineToolCapabilityProfile({
  slug: "hex-editor",
  version: "1.0.0",
  enforcement: "inventory",
  modes: [
    {
      id: "text-to-hex",
      labelKey: "tools.hex-editor.capabilities.modes.textToHex",
      runtime: "browser",
    },
    {
      id: "hex-to-text",
      labelKey: "tools.hex-editor.capabilities.modes.hexToText",
      runtime: "browser",
    },
  ],
  acceptedInputs: [
    {
      id: "text",
      labelKey: "tools.hex-editor.capabilities.inputs.text",
    },
    {
      id: "utf8-hex",
      labelKey: "tools.hex-editor.capabilities.inputs.utf8Hex",
    },
  ],
  producedOutputs: [
    {
      id: "utf8-hex",
      labelKey: "tools.hex-editor.capabilities.outputs.utf8Hex",
    },
    {
      id: "decoded-text",
      labelKey: "tools.hex-editor.capabilities.outputs.decodedText",
    },
  ],
  supportedLocales: {
    ui: locales,
    engine: { kind: "language-neutral" },
  },
  browserOnlyFeatures: [
    {
      id: "text-to-hex",
      labelKey: "tools.hex-editor.capabilities.features.textToHex",
      evidenceTest: "",
    },
    {
      id: "hex-to-text",
      labelKey: "tools.hex-editor.capabilities.features.hexToText",
      evidenceTest: "",
    },
    {
      id: "clipboard-copy",
      labelKey: "tools.hex-editor.capabilities.features.clipboardCopy",
      evidenceTest: "",
    },
  ],
  optionalServerFeatures: [],
  limits: [
    {
      id: "no-file-open",
      labelKey: "tools.hex-editor.capabilities.limits.noFileOpen",
    },
    {
      id: "no-offset-grid",
      labelKey: "tools.hex-editor.capabilities.limits.noOffsetGrid",
    },
    {
      id: "no-direct-byte-editing",
      labelKey: "tools.hex-editor.capabilities.limits.noDirectByteEditing",
    },
    {
      id: "utf8-only",
      labelKey: "tools.hex-editor.capabilities.limits.utf8Only",
    },
    {
      id: "no-file-export",
      labelKey: "tools.hex-editor.capabilities.limits.noFileExport",
    },
  ],
  forbiddenClaims: [
    {
      code: "hex-editor-grid-claim",
      pattern:
        /(?<!not )(?<!n't )\b(?:opens?|uploads?|loads?) (?:local )?files?\b|(?<!not )(?<!n't )\b(?:shows?|provides?|includes?) (?:an? )?(?:offset|byte|hex) grid\b/i,
      reason:
        "The tool accepts pasted text or hex and has no file loader or offset grid.",
    },
    {
      code: "hex-editor-byte-edit-claim",
      pattern:
        /(?<!not )(?<!n't )\b(?:edits?|modifies?|overwrites?) (?:individual )?bytes? directly\b|(?<!not )(?<!n't )\b(?:supports?|provides?) direct byte editing\b/i,
      reason:
        "The tool converts whole text values and does not expose direct byte editing.",
    },
    {
      code: "hex-editor-unsupported-encoding-claim",
      pattern:
        /(?<!not )(?<!n't )\b(?:supports?|encodes?|decodes?) (?:text (?:as|with) )?(?:UTF-16|UTF-32|Latin-1|Shift[- ]JIS|multiple encodings)(?: encoding)?\b|(?<!not )(?<!n't )\b(?:offers?|provides?) (?:an )?encoding selector\b/i,
      reason: "The converter supports UTF-8 text only.",
    },
    {
      code: "hex-editor-file-export-claim",
      pattern:
        /(?<!not )(?<!n't )\b(?:saves?|downloads?|exports?) (?:an? )?(?:binary|hex|edited)? ?files?\b/i,
      reason:
        "The current tool copies converted text but does not export files.",
    },
  ],
  targetSearchIntents: ["hex-editor.text-hex-conversion"],
  evidenceTests: [],
});
