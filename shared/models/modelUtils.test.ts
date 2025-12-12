import { describe, it, expect } from "vitest";
import { exposeDocFields } from "./modelUtils";

describe("exposeDocFields", () => {
  it("creates getters for all doc fields", () => {
    const model = {
      doc: { _id: "123", name: "Test", count: 42 },
    };

    exposeDocFields(model);

    const exposed = model as unknown as { _id: string; name: string; count: number };
    expect(exposed._id).toBe("123");
    expect(exposed.name).toBe("Test");
    expect(exposed.count).toBe(42);
  });

  it("reflects changes to doc fields", () => {
    const model = {
      doc: { value: "initial" },
    };

    exposeDocFields(model);

    const exposed = model as unknown as { value: string };
    expect(exposed.value).toBe("initial");

    model.doc.value = "updated";

    expect(exposed.value).toBe("updated");
  });

  it("does not override existing properties on the model", () => {
    const model = {
      doc: { name: "from doc" },
      name: "existing",
    };

    exposeDocFields(model);

    expect(model.name).toBe("existing");
  });

  it("does not override the doc property itself", () => {
    const originalDoc = { _id: "123", doc: "nested doc value" };
    const model = {
      doc: originalDoc,
    };

    exposeDocFields(model);

    expect(model.doc).toBe(originalDoc);
  });

  it("creates enumerable getters", () => {
    const model = {
      doc: { _id: "123", name: "Test" },
    };

    exposeDocFields(model);

    const keys = Object.keys(model);
    expect(keys).toContain("_id");
    expect(keys).toContain("name");
  });

  it("handles nested object fields", () => {
    const settings = { nightMode: true, brightness: 100 };
    const model = {
      doc: { settings },
    };

    exposeDocFields(model);

    const exposed = model as unknown as { settings: typeof settings };
    expect(exposed.settings).toBe(settings);
    expect(exposed.settings.nightMode).toBe(true);
  });

  it("handles null and undefined values", () => {
    const model = {
      doc: { nullField: null, undefinedField: undefined },
    };

    exposeDocFields(model);

    const exposed = model as unknown as { nullField: null; undefinedField: undefined };
    expect(exposed.nullField).toBe(null);
    expect(exposed.undefinedField).toBe(undefined);
  });

  it("handles array fields", () => {
    const items = [1, 2, 3];
    const model = {
      doc: { items },
    };

    exposeDocFields(model);

    const exposed = model as unknown as { items: number[] };
    expect(exposed.items).toBe(items);
    expect(exposed.items).toEqual([1, 2, 3]);
  });
});
