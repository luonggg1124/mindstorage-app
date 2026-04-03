import { Client, Stronghold } from '@tauri-apps/plugin-stronghold';
// when using `"withGlobalTauri": true`, you may use
// const { Client, Stronghold } = window.__TAURI__.stronghold;
import { appDataDir } from '@tauri-apps/api/path';
// when using `"withGlobalTauri": true`, you may use
// const { appDataDir } = window.__TAURI__.path;

const initStronghold = async () => {
  const vaultPath = `${await appDataDir()}/vault.hold`;
  const vaultPassword = 'vault password';
  const stronghold = await Stronghold.load(vaultPath, vaultPassword);

  let client: Client;
  const clientName = 'client';
  try {
    client = await stronghold.loadClient(clientName);
  } catch {
    client = await stronghold.createClient(clientName);
  }

  return {
    stronghold,
    client,
  };
};

// Singleton instances
let strongholdInstance: Stronghold | null = null;
let clientInstance: Client | null = null;

const getStoreInstance = async () => {
  if (!strongholdInstance || !clientInstance) {
    const { stronghold, client } = await initStronghold();
    strongholdInstance = stronghold;
    clientInstance = client;
  }
  return clientInstance.getStore();
};

// Insert a record to the store (Create/Update)
const insertRecord = async (store: any, key: string, value: string) => {
  const data = Array.from(new TextEncoder().encode(value));
  await store.insert(key, data);
};

// Read a record from store
const getRecord = async (store: any, key: string): Promise<string> => {
  const data = await store.get(key);
  return new TextDecoder().decode(new Uint8Array(data));
};

// Delete a record from store
const deleteRecord = async (store: any, key: string) => {
  await store.remove(key);
};

// Exported CRUD functions like localStorage
export const setStorage = async (key: string, value: string) => {
  const store = await getStoreInstance();
  await insertRecord(store, key, value);
};

export const getStorage = async (key: string): Promise<string | null> => {
  try {
    const store = await getStoreInstance();
    return await getRecord(store, key);
  } catch {
    return null; // If key not found
  }
};

export const removeStorage = async (key: string) => {
  const store = await getStoreInstance();
  await deleteRecord(store, key);
};

// Save changes to stronghold
export const saveStorage = async () => {
  if (strongholdInstance) {
    await strongholdInstance.save();
  }
};