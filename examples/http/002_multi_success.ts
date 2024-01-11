import { launchHost } from "../util/host";
import axios from "axios";

async function sleep(delayMs: number) {
  return await new Promise((resolve) => setTimeout(resolve, delayMs));
}

/** Launch an express server that echoes the number in the URL */
const { origin, destroy } = await launchHost((app) => {
  app.get("/echo/:number", async (req, res) => {
    await sleep(2);
    return res
      .status(200)
      .send(JSON.stringify(Number.parseFloat(req.params["number"])));
  });
});

async function retrieveNumber(value: number) {
  try {
    const requestUrl = `${origin}/echo/${value}`;

    const { data } = await axios.get(requestUrl);

    if (typeof data !== "number") {
      throw new Error(`Unexpected data ${JSON.stringify(data)}`);
    }
    return data;
  } catch (error) {
    console.error(
      `Error retrieving ${value}: ${
        error instanceof Error ? error.message : JSON.stringify(error)
      }`,
    );
    throw error;
  }
}

try {
  const COUNT = 100;

  const numbersToRetrieve = Array.from({ length: COUNT }).map(
    (_, value) => value,
  );

  const numberPromises = numbersToRetrieve.map(retrieveNumber);

  const numbers = await Promise.all(numberPromises);

  console.log(JSON.stringify(numbers));

  process.exit(0);
} catch (error) {
  console.error(
    `Encountered error ${
      error instanceof Error ? error.message : JSON.stringify(error)
    }`,
  );
  process.exit(-1);
} finally {
  await destroy();
}
