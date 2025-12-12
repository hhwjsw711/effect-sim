import { ActionIcon, Menu } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useApp } from "../common/AppContext";

export function NodesTreeAddMenu() {
  const app = useApp();
  const project = app.getProject();

  return (
    <Menu shadow="md" width={180} withinPortal>
      <Menu.Target>
        <ActionIcon size="sm" variant="subtle" aria-label="Add">
          <IconPlus size={16} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          onClick={() => {
            const node = project.createStringNode({
              ledCount: 196,
              port: 4048,
            });
            app.setSelectedEntity({ kind: "node", node });
            app.layout.showInspector();
          }}
        >
          Add String
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            const node = project.createVirtualStringNode();
            app.setSelectedEntity({
              kind: "virtual_string",
              node,
              selectedSegmentIndex: null,
            });
            app.layout.showInspector();
          }}
        >
          Add Virtual String
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            project.createFolderNode({
              label: "New Folder",
            });
          }}
        >
          Add Folder
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            const node = project.createSwitchNode();
            app.setSelectedEntity({ kind: "node", node });
            app.layout.showInspector();
          }}
        >
          Add Switch
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
