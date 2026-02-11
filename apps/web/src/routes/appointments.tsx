import type { Route } from "./+types/_index";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Appointments | RaHealthcare" }];
}

export default function AppointmentsPage() {
  return <h1>Appointments</h1>;
}
