import type { Route } from "./+types/_index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "RaHealthcare" },
    {
      name: "description",
      content: "RaHealthcare is a simple healthcare scheduling app",
    },
  ];
}

export default function PatientsPage() {
  return <h1>ok</h1>;
}
