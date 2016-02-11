import {Record, List} from "immutable";

/**
 * Simply apply to an object array via `.map()` function
 * @param Class
 * @returns {*}
 * @constructor
 */
export function ImmutableRecord (Class) {
  const instance = new Class();
  for (const k in instance) {
    if (instance[k] === null || instance[k] === undefined) {
      throw new Error("Default value require for " + Class.name + "#" + k);
    }
  }
  return Record(instance);
}