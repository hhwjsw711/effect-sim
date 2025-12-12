/**
 * Exposes all fields from `model.doc` as getters on the model instance.
 * Use with interface merging to get type safety.
 *
 * @example
 * // Interface merging tells TypeScript about the doc fields
 * export interface MyModel extends Readonly<Doc<"myTable">> {}
 *
 * export class MyModel {
 *   constructor(public doc: Doc<"myTable">) {
 *     exposeDocFields(this);
 *     makeAutoObservable(this);
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

