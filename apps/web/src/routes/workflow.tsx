import type { Route } from "./+types/_index";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Workflow | RaHealthcare" }];
}

export default function WorkflowPage() {
  return <h1>Workflow</h1>;
}
