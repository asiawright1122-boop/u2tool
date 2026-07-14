import { locales } from "@/lib/i18n";
import { defineToolCapabilityProfile } from "../define-profile";

const fileEditorEvidence = {
  file: "src/components/tools/HexEditor.test.ts",
  testName:
    "opens a local binary file into zero-padded 16-byte rows without a network request [capability:hex-editor:mode:file-editor] [capability:hex-editor:accepted-input:local-binary-file] [capability:hex-editor:browser-feature:editable-byte-grid] [capability:hex-editor:limit:local-files-only]",
};

const editingEvidence = {
  file: "src/components/tools/HexEditor.test.ts",
  testName:
    "edits byte and ASCII cells, navigates hex and ASCII matches, and resets every change [capability:hex-editor:browser-feature:byte-editing] [capability:hex-editor:browser-feature:hex-ascii-search] [capability:hex-editor:browser-feature:reset-changes]",
};

const downloadEvidence = {
  file: "src/components/tools/HexEditor.test.ts",
  testName:
    "downloads the edited bytes with .modified before the original extension [capability:hex-editor:produced-output:modified-binary-file] [capability:hex-editor:browser-feature:download]",
};

const fileLimitEvidence = {
  file: "src/components/tools/HexEditor.test.ts",
  testName:
    "rejects a local file above 2 MiB with the visible pilot-limit message [capability:hex-editor:limit:two-mib-files]",
};

const textConverterEvidence = {
  file: "src/components/tools/HexEditor.test.ts",
  testName:
    "converts visible text and hexadecimal fields as UTF-8 and reports incomplete bytes [capability:hex-editor:mode:text-converter] [capability:hex-editor:accepted-input:text] [capability:hex-editor:accepted-input:utf8-hex] [capability:hex-editor:produced-output:utf8-hex] [capability:hex-editor:produced-output:decoded-text] [capability:hex-editor:browser-feature:text-conversion] [capability:hex-editor:limit:utf8-text-converter]",
};

const languageNeutralEvidence = {
  file: "src/lib/hex-editor.test.ts",
  testName:
    "round-trips Unicode text through UTF-8 bytes without locale-specific processing [capability:hex-editor:engine:language-support]",
};

export const hexEditorCapabilityProfile = defineToolCapabilityProfile({
  slug: "hex-editor",
  version: "2.0.0",
  enforcement: "release-blocking",
  modes: [
    {
      id: "file-editor",
      labelKey: "tools.hex-editor.capabilities.modes.fileEditor",
      runtime: "browser",
      evidence: fileEditorEvidence,
    },
    {
      id: "text-converter",
      labelKey: "tools.hex-editor.capabilities.modes.textConverter",
      runtime: "browser",
      evidence: textConverterEvidence,
    },
  ],
  acceptedInputs: [
    {
      id: "local-binary-file",
      labelKey: "tools.hex-editor.capabilities.inputs.localBinaryFile",
      evidence: fileEditorEvidence,
    },
    {
      id: "text",
      labelKey: "tools.hex-editor.capabilities.inputs.text",
      evidence: textConverterEvidence,
    },
    {
      id: "utf8-hex",
      labelKey: "tools.hex-editor.capabilities.inputs.utf8Hex",
      evidence: textConverterEvidence,
    },
  ],
  producedOutputs: [
    {
      id: "modified-binary-file",
      labelKey: "tools.hex-editor.capabilities.outputs.modifiedBinaryFile",
      evidence: downloadEvidence,
    },
    {
      id: "utf8-hex",
      labelKey: "tools.hex-editor.capabilities.outputs.utf8Hex",
      evidence: textConverterEvidence,
    },
    {
      id: "decoded-text",
      labelKey: "tools.hex-editor.capabilities.outputs.decodedText",
      evidence: textConverterEvidence,
    },
  ],
  supportedLocales: {
    ui: locales,
    engine: {
      kind: "language-neutral",
      evidence: languageNeutralEvidence,
    },
  },
  browserOnlyFeatures: [
    {
      id: "editable-byte-grid",
      labelKey: "tools.hex-editor.capabilities.features.editableByteGrid",
      evidence: fileEditorEvidence,
    },
    {
      id: "byte-editing",
      labelKey: "tools.hex-editor.capabilities.features.byteEditing",
      evidence: editingEvidence,
    },
    {
      id: "hex-ascii-search",
      labelKey: "tools.hex-editor.capabilities.features.hexAsciiSearch",
      evidence: editingEvidence,
    },
    {
      id: "reset-changes",
      labelKey: "tools.hex-editor.capabilities.features.resetChanges",
      evidence: editingEvidence,
    },
    {
      id: "download",
      labelKey: "tools.hex-editor.capabilities.features.download",
      evidence: downloadEvidence,
    },
    {
      id: "text-conversion",
      labelKey: "tools.hex-editor.capabilities.features.textConversion",
      evidence: textConverterEvidence,
    },
  ],
  optionalServerFeatures: [],
  limits: [
    {
      id: "two-mib-files",
      labelKey: "tools.hex-editor.capabilities.limits.twoMibFiles",
      evidence: fileLimitEvidence,
    },
    {
      id: "local-files-only",
      labelKey: "tools.hex-editor.capabilities.limits.localFilesOnly",
      evidence: fileEditorEvidence,
    },
    {
      id: "utf8-text-converter",
      labelKey: "tools.hex-editor.capabilities.limits.utf8TextConverter",
      evidence: textConverterEvidence,
    },
  ],
  forbiddenClaims: [
    {
      code: "hex-editor-disassembly-claim",
      pattern:
        /(?<!not )(?<!n't )\b(?:disassembles?|decompiles?) (?:binary|machine|executable )?(?:code|files?)\b|(?<!not )(?<!n't )\b(?:includes?|provides?|offers?) (?:a )?(?:disassembler|decompiler)\b/i,
      reason: "The browser editor does not disassemble or decompile code.",
    },
    {
      code: "hex-editor-remote-file-claim",
      pattern:
        /(?<!not )(?<!n't )\b(?:opens?|fetches?|loads?) (?:remote )?files? from (?:a )?URL\b|(?<!not )(?<!n't )\buploads? files? to (?:a )?(?:server|cloud)\b/i,
      reason: "The editor opens local files in the browser and has no remote URL workflow.",
    },
    {
      code: "hex-editor-executable-analysis-claim",
      pattern:
        /(?<!not )(?<!n't )\b(?:analy[sz]es?|inspects?|parses?) (?:(?:PE|ELF|Mach-O)(?: executable)?|executable|malware) (?:files?|headers?|binaries?|samples?)\b|(?<!not )(?<!n't )\bmalware analysis\b/i,
      reason: "The editor exposes raw bytes and does not analyze executables or malware.",
    },
    {
      code: "hex-editor-professional-reverse-engineering-claim",
      pattern:
        /(?<!not a )(?<!not an )(?<!not )(?<!n't )\b(?:professional|advanced) reverse[- ]engineering (?:suite|workflow|platform|tool)\b|(?<!not )(?<!n't )\b(?:replaces?|alternative to) (?:IDA|Ghidra|Binary Ninja)\b/i,
      reason: "The pilot editor is not a professional reverse-engineering workflow.",
    },
  ],
  targetSearchIntents: [
    "hex-editor.local-binary-editing",
    "hex-editor.text-hex-conversion",
  ],
  evidenceTests: [
    {
      file: "src/lib/hex-editor.test.ts",
      testName:
        "builds 16-byte rows with numeric offsets, printable ASCII, and zero-padded display offsets [capability:hex-editor:profile:release-readiness]",
    },
  ],
});
