import { gql } from "urql";

export const workflowStepFields = gql`
  fragment WorkflowStepFields on WorkflowStep {
    id
    label
    order
    createdAt
    updatedAt
  }
`;

export const workflowStepsQuery = gql`
  query WorkflowSteps {
    workflowSteps {
      ...WorkflowStepFields
    }
  }
  ${workflowStepFields}
`;

export const saveWorkflowMutation = gql`
  mutation SaveWorkflow($input: SaveWorkflowInput!) {
    saveWorkflow(input: $input) {
      ...WorkflowStepFields
    }
  }
  ${workflowStepFields}
`;
