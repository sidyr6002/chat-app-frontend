let isRefreshing = false;
const refreshQueue: (() => void)[] = [];

export const withRefreshLock = async <T>(fn: () => Promise<T>): Promise<T> => {
  return new Promise((resolve, reject) => {
    const execute = async () => {
      if (isRefreshing) {
        refreshQueue.push(execute);
        return;
      }
      isRefreshing = true;
      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        reject(error);
      } finally {
        isRefreshing = false;
        const next = refreshQueue.shift();
        if (next) next();
      }
    };
    execute();
  });
};