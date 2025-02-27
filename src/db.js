const DB_NAME = "CodeWorkspaceDB";
const STORE_NAME = "code_snippets";
const DB_VERSION = 1;

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: ["questionId", "contestId"],
        });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getCodeRecord = async (questionId, contestId) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get([questionId, contestId || ""]);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveCodeRecord = async (data) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({
      ...data,
      questionId: data.questionId,
      contestId: data.contestId || "",
    });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const deleteCodeRecord = async (questionId, contestId) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete([questionId, contestId || ""]);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};
