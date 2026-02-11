import { env } from "@ra-healthcare/env/server";
import cors from "cors";
import express from "express";

import { yoga } from "@/graphql";

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
  }),
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).send("OK");
});

app.use(yoga.graphqlEndpoint, yoga);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
  console.log(
    `GraphQL playground at http://localhost:3000${yoga.graphqlEndpoint}`,
  );
});
