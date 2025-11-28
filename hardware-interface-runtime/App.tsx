import { useMemo, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import type { Id, Doc } from "../convex/_generated/dataModel";
import { ClientDataSocket } from "./ClientDataSocket";
import { String } from "./String";
import { ProjectModel } from "../shared/models/ProjectModel";
import { LedDataStoreModel } from "../src/data/LedDataStoreModel";
import { LedDataStoreContext } from "../src/data/LedDataStoreContext";
import { HeadlessPlaylistPlayer } from "./HeadlessPlaylistPlayer";
import { HeadlessLedDataDispatcher } from "./HeadlessLedDataDispatcher";
import { FixedFrameProvider } from "../src/common/FixedFrameProvider";

export const App = observer(
  ({
    project,
    playlistId,
  }: {
    project: Doc<"projects">;
    playlistId?: Id<"playlists">;
  }) => {
    const data = useQuery(api.model.getDataForProject, {
      projectId: project._id,
    });

    const projectModel = useMemo(() => new ProjectModel(project), [project]);
    const ledDataStore = useMemo(
      () => new LedDataStoreModel(projectModel),
      [projectModel],
    );

    useEffect(() => {
      if (data) {
        projectModel.updateFromServerData(data);
      }
    }, [data, projectModel]);

    const playlist = useMemo(() => {
      if (!playlistId) return null;
      return projectModel.playlists.find((p) => p._id === playlistId);
    }, [projectModel, playlistId, projectModel.playlists.length]);

    return (
      <LedDataStoreContext.Provider value={ledDataStore}>
        <FixedFrameProvider>
          {/* Render Strings (Outputs) */}
          {projectModel.strings.map((stringModel) => (
            <String key={stringModel._id} string={stringModel.doc} />
          ))}

          {/* Logic */}
          {playlistId && playlist ? (
            <>
              <HeadlessPlaylistPlayer playlist={playlist} />
              <HeadlessLedDataDispatcher />
            </>
          ) : (
            <ClientDataSocket />
          )}
        </FixedFrameProvider>
      </LedDataStoreContext.Provider>
    );
  },
);
