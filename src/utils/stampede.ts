import { handleDBInteraction } from "../services/product.js";

const cache = new Map();

const { fetchPromise } = handleDBInteraction();

export const PromiseMemorization = (id: string) => {
  try {
    if (cache.has(id)) {
      return cache.get(id);
    }

    const promise = fetchPromise(id);

    // Store the promise immediately
    cache.set(id, promise);

    // Clean up cache after promise resolves/rejects
    promise.finally(() => {
      cache.delete(id);
    });

    return promise;
  } catch (error) {
    console.log("Promise memorization failed", error);
  }
};
