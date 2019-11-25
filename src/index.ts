import { PORT, environment } from "src/configuration";
import { getApp } from "src/app";
const startServer = async () => {
  try {
    const app = await getApp();
    app.listen(PORT, () => {
      console.log(`server started at http://localhost:${PORT} in ${environment} environment`);
    });
  } catch (error) {
    console.error(error);
  }
};
startServer();
