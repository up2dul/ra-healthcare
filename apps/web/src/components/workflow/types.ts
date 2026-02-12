export interface WorkflowStep {
  id: string;
  label: string;
  order: number;
}

/** A step that may be new (no persisted id yet). */
export interface LocalWorkflowStep {
  /** Server-side id, or a temporary client-side id prefixed with "new-". */
  id: string;
  label: string;
}
