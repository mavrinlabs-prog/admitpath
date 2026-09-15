#!/usr/bin/env node

const fs = require("fs");
const fsPromises = require("fs/promises");

function toInvalidArgumentError(targetPath, originalError) {
  const error = new Error(`EINVAL: invalid argument, readlink '${targetPath}'`);
  error.code = "EINVAL";
  error.errno = -4071;
  error.path = targetPath;
  error.syscall = "readlink";
  error.cause = originalError;
  return error;
}

function normalizeReadlinkError(targetPath, error) {
  if (!error || error.code !== "EISDIR") return error;
  try {
    const stat = fs.lstatSync(targetPath);
    if (!stat.isSymbolicLink()) {
      return toInvalidArgumentError(targetPath, error);
    }
  } catch {
    // Preserve the original error if lstat itself fails.
  }
  return error;
}

const originalReadlinkSync = fs.readlinkSync.bind(fs);
fs.readlinkSync = function patchedReadlinkSync(targetPath, options) {
  try {
    return originalReadlinkSync(targetPath, options);
  } catch (error) {
    throw normalizeReadlinkError(targetPath, error);
  }
};

const originalReadlink = fs.readlink.bind(fs);
fs.readlink = function patchedReadlink(targetPath, options, callback) {
  let resolvedOptions = options;
  let resolvedCallback = callback;
  if (typeof options === "function") {
    resolvedCallback = options;
    resolvedOptions = undefined;
  }
  return originalReadlink(targetPath, resolvedOptions, (error, linkString) => {
    if (error) {
      resolvedCallback(normalizeReadlinkError(targetPath, error));
      return;
    }
    resolvedCallback(null, linkString);
  });
};

const originalPromisesReadlink = fsPromises.readlink.bind(fsPromises);
fsPromises.readlink = async function patchedPromisesReadlink(targetPath, options) {
  try {
    return await originalPromisesReadlink(targetPath, options);
  } catch (error) {
    throw normalizeReadlinkError(targetPath, error);
  }
};

if (fs.promises && typeof fs.promises.readlink === "function") {
  fs.promises.readlink = fsPromises.readlink;
}
