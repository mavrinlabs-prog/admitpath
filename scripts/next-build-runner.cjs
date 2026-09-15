#!/usr/bin/env node

require("./next-build-patched.cjs");

process.argv = [
  process.argv[0],
  require.resolve("next/dist/bin/next"),
  ...process.argv.slice(2),
];

require("next/dist/bin/next");
