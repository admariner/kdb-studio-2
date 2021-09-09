const { _electron: electron } = require("playwright");
const path = require("path");
const { existsSync, readdirSync } = require("fs");
const fs = require("fs/promises");
const storage = require("electron-json-storage");

exports.mochaHooks = {
  beforeAll: async function () {
    this.timeout(20000);
    this.app = await electron.launch({ args: ["./dist/main.js"] });

    const userData = await this.app.evaluate(({ app }) => {
      return app.getPath("userData");
    });

    console.log("USER DATA", userData);
    this.storageDir = path.join(userData, "storage");

    if (!existsSync(this.storageDir)) await fs.mkdir(this.storageDir);

    await fs.copyFile(
      path.join(__dirname, "fixtures", "server-sample.json"),
      path.join(this.storageDir, "server-sample.json")
    );

    storage.setDataPath(this.storageDir);
    storage.keys((error, allKeys) => {
      console.log("error", error);
      console.log("keys", allKeys);

      const matchingKeys = allKeys.filter((k) => k.startsWith("server-"));

      console.log("matching keys", matchingKeys);

      storage.getMany(matchingKeys, (err, data) => {
        console.log("ERR", err);
        console.log("DATA", data);
      });
    });

    console.log("LIST FILES", readdirSync(this.storageDir));
    const window = await this.app.firstWindow();
    await window.reload();
  },

  afterAll: async function () {
    await this.app.close();
    await fs.rm(this.storageDir, {
      recursive: true,
      force: true,
    });
  },
};
