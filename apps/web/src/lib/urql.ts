import { env } from "@ra-healthcare/env/web";
import { type Cache, cacheExchange } from "@urql/exchange-graphcache";
import { Client, fetchExchange } from "urql";

function invalidateQueries(cache: Cache, fieldName: string) {
  const fields = cache
    .inspectFields("Query")
    .filter((f) => f.fieldName === fieldName);
  for (const field of fields) {
    cache.invalidate("Query", field.fieldName, field.arguments ?? {});
  }
}

const client = new Client({
  url: `${env.VITE_SERVER_URL}/graphql`,
  exchanges: [
    cacheExchange({
      updates: {
        Mutation: {
          deletePatient(_result, _args, cache) {
            invalidateQueries(cache, "patients");
          },
          createAppointment(_result, _args, cache) {
            invalidateQueries(cache, "appointments");
          },
          updateAppointment(_result, _args, cache) {
            invalidateQueries(cache, "appointments");
          },
          deleteAppointment(_result, _args, cache) {
            invalidateQueries(cache, "appointments");
          },
          saveWorkflow(_result, _args, cache) {
            invalidateQueries(cache, "workflowSteps");
          },
        },
      },
    }),
    fetchExchange,
  ],
});

export default client;
