import { env } from "@ra-healthcare/env/web";
import { cacheExchange } from "@urql/exchange-graphcache";
import { Client, fetchExchange } from "urql";

const client = new Client({
  url: `${env.VITE_SERVER_URL}/graphql`,
  exchanges: [
    cacheExchange({
      updates: {
        Mutation: {
          deletePatient(_result, _args, cache) {
            const patientFields = cache
              .inspectFields("Query")
              .filter((field) => field.fieldName === "patients");
            for (const field of patientFields) {
              cache.invalidate("Query", field.fieldName, field.arguments ?? {});
            }
          },
        },
      },
    }),
    fetchExchange,
  ],
});

export default client;
