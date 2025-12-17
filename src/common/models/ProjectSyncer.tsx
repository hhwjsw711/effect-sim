import { ProjectModel } from "../../../shared/models/ProjectModel";
import { api } from "../../../convex/_generated/api";
import { TableSyncer } from "./TableSyncer";
import { SequenceModel } from "../../../shared/models/sequencer/SequenceModel";
import { PlaylistModel } from "../../../shared/models/PlaylistModel";

export const ProjectSyncer = ({ project }: { project: ProjectModel }) => {
  return (
    <>
      <TableSyncer
        table="nodes"
        models={project.nodes}
        query={api.functions.listNodesForProject}
        queryArgs={{ projectId: project._id }}
        createModel={(doc) => project.createNodeModel(doc)}
      />
      <TableSyncer
        table="sequences"
        models={project.sequences}
        query={api.functions.listSequencesForProject}
        queryArgs={{ projectId: project._id }}
        createModel={(doc) => new SequenceModel(doc, project)}
      />
      <TableSyncer
        table="playlists"
        models={project.playlists}
        query={api.functions.listPlaylistsForProject}
        queryArgs={{ projectId: project._id }}
        createModel={(doc) => new PlaylistModel(doc, project)}
      />
    </>
  );
};
