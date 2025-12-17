import { useApp } from "../AppContext";
import { type ReactNode } from "react";
import { api } from "../../../convex/_generated/api";
import { Loader, Box } from "@mantine/core";
import { TableSyncer } from "./TableSyncer";
import { ProjectSyncer } from "./ProjectSyncer";
import { ProjectModel } from "../../../shared/models/ProjectModel";
import { usePersistedQuery } from "../hooks/usePersistedQuery";

export const AppSyncer = ({ children }: { children: ReactNode }) => {
  const app = useApp();

  // We still need this query here for the loading state check
  const { data: projects } = usePersistedQuery(api.functions.listProjects);

  const hasDataBeenLoaded = projects != undefined;

  if (!hasDataBeenLoaded)
    return (
      <Box
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader size="lg" />
      </Box>
    );

  return (
    <>
      <TableSyncer
        table="projects"
        models={app.projects}
        query={api.functions.listProjects}
        queryArgs={{}}
        createModel={(doc) => new ProjectModel(doc)}
      />
      {app.project ? (
        <ProjectSyncer key={app.project._id} project={app.project} />
      ) : null}
      {children}
    </>
  );
};
