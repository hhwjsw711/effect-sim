/**
 * Exposes all fields from `model.doc` as getters on the model instance.
 * Use with interface merging to get type safety.
 *
 * IMPORTANT: Call this AFTER makeAutoObservable, not before.
 * MobX doesn't handle dynamically-added getters well if they exist before it runs.
 *
 * @example
 * // Interface merging tells TypeScript about the doc fields
 * export interface MyModel extends Readonly<Doc<"myTable">> {}
 *
 * export class MyModel {
 *   constructor(public doc: Doc<"myTable">) {
 *     makeAutoObservable(this);
 *     exposeDocFields(this);
 *   }
 * }
 */
export function exposeDocFields<T extends { doc: object }>(model: T): void {
  const doc = model.doc as Record<string, unknown>;
  for (const key of Object.keys(doc)) {
    if (key in model) continue;
    Object.defineProperty(model, key, {
      get() {
        return (this as { doc: Record<string, unknown> }).doc[key];
      },
      enumerable: true,
      configurable: true,
    });
  }
}
