import { env } from "@ra-healthcare/env/web";
import { cacheExchange } from "@urql/exchange-graphcache";
import { Client, fetchExchange } from "urql";

const client = new Client({
  url: `${env.VITE_SERVER_URL}/graphql`,
  exchanges: [cacheExchange(), fetchExchange],
});

export default client;
