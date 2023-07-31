import { EncryptStorage } from "encrypt-storage";

export const LocalStorage = new EncryptStorage(
  process.env.REACT_APP_STORAGE_KEY ?? "YERRRRRRRRR"
);

export const SessionStorage = new EncryptStorage(
  process.env.REACT_APP_STORAGE_KEY ?? "YERRRRRRRRR",
  {
    storageType: "sessionStorage",
  }
);
