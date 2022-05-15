#!/usr/bin/env -S node --experimental-json-modules
import { build } from "electron-builder"
import { pick } from "lodash-es"
import { execFileSync } from "node:child_process"
import * as fs from "node:fs/promises"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import packageJson from "../package.json" assert { type: "json" }

const projectRoot = join(fileURLToPath(import.meta.url), "../..")
const tempReleaseFolder = join(projectRoot, "release.temp")
const releaseFolder = join(projectRoot, "release")
const distFolder = join(projectRoot, "dist")

const releasePackageJson = {
  ...pick(
    packageJson,
    "name",
    "productName",
    "version",
    "description",
    "author",
    "license",
    "homepage",
    "bugs",
    "repository",
    "main",
    "dependencies",
  ),
  devDependencies: {
    electron: packageJson.devDependencies["electron"],
  },
}

await fs.mkdir(tempReleaseFolder, { recursive: true })

await fs.cp(distFolder, join(tempReleaseFolder, "dist"), { recursive: true })

await fs.writeFile(
  join(tempReleaseFolder, "package.json"),
  JSON.stringify(releasePackageJson, undefined, 2),
)
await fs.cp("pnpm-lock.yaml", join(tempReleaseFolder, "pnpm-lock.yaml"), {
  recursive: true,
})

await fs.writeFile(
  join(tempReleaseFolder, ".npmrc"),
  ["node-linker = hoisted", "strict-peer-dependencies = false"].join("\n"),
)

execFileSync("pnpm", ["install"], {
  cwd: tempReleaseFolder,
  stdio: "inherit",
})

await build({
  dir: process.argv.includes("--dir"),
  projectDir: tempReleaseFolder,
  config: {
    appId: "dev.mapleleaf.pulsecord",
    files: ["dist"],
    directories: {
      output: releaseFolder,
    },
    linux: {
      target: ["AppImage", "pacman"],
      category: "Audio",
      // icon: join(projectRoot, "assets/icons/linux"),
    },
  },
})

await fs.rm(tempReleaseFolder, { recursive: true, force: true })
