/* eslint-disable react-refresh/only-export-components */
import { render } from "react-nil";
import { ConvexReactClient, ConvexProvider } from "convex/react";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import type { Doc, Id } from "../convex/_generated/dataModel";
import { Command } from "commander";
import prompts from "prompts";
import { App } from "./App";

// Polyfill requestAnimationFrame for HeadlessFixedFrameProvider
if (!globalThis.requestAnimationFrame) {
  let lastTime = 0;
  globalThis.requestAnimationFrame = (callback) => {
    const currTime = Date.now();
    const timeToCall = Math.max(0, 16 - (currTime - lastTime));
    const id = setTimeout(() => callback(currTime + timeToCall), timeToCall);
    lastTime = currTime + timeToCall;
    return id as unknown as number;
  };
  globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
}

const convexUrl = `https://aromatic-cardinal-985.convex.cloud`; // import.meta.env.VITE_CONVEX_URL as string;

// CLI setup
const program = new Command();
program.option("-p, --project <id>", "Project ID").parse(process.argv);

const options = program.opts();
let projectId = options.project;
let projectDoc: Doc<"projects"> | null = null;

const client = new ConvexHttpClient(convexUrl);

if (!projectId) {
  const projects = await client.query(api.model.listProjects, {});

  if (projects.length === 0) {
    console.error("No projects found.");
    process.exit(1);
  }

  const response = await prompts({
    type: "select",
    name: "projectId",
    message: "Select a project to run",
    choices: projects.map((p) => ({ title: p.name, value: p._id })),
  });

  projectId = response.projectId;
  projectDoc = projects.find((p) => p._id === projectId) ?? null;
} else {
  const projects = await client.query(api.model.listProjects, {});
  projectDoc = projects.find((p) => p._id === projectId) ?? null;
}

if (!projectId || !projectDoc) {
  console.log("No project selected.");
  process.exit(0);
}

// Select Playlist
const playlists = await client.query(api.model.listPlaylistsForProject, {
  projectId: projectId as Id<"projects">,
});

let playlistId: Id<"playlists"> | undefined = undefined;

if (playlists.length > 0) {
  const response = await prompts({
    type: "select",
    name: "playlistId",
    message: "Select a playlist to play (or None to listen)",
    choices: [
      { title: "None (Listen Mode)", value: null },
      ...playlists.map((p) => ({ title: p.name, value: p._id })),
    ],
  });
  if (response.playlistId) {
    playlistId = response.playlistId;
  }
}

const convex = new ConvexReactClient(convexUrl);

// Mount the component so hooks run in Bun
render(
  <ConvexProvider client={convex}>
    <App project={projectDoc} playlistId={playlistId} />
  </ConvexProvider>,
);
