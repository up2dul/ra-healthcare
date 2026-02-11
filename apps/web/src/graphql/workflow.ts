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
      data {
        ...WorkflowStepFields
      }
      total
      page
      limit
      totalPages
    }
  }
  ${workflowStepFields}
`;

export const workflowStepQuery = gql`
  query WorkflowStep($id: ID!) {
    workflowStep(id: $id) {
      ...WorkflowStepFields
    }
  }
  ${workflowStepFields}
`;

export const createWorkflowStepMutation = gql`
  mutation CreateWorkflowStep($input: CreateWorkflowStepInput!) {
    createWorkflowStep(input: $input) {
      ...WorkflowStepFields
    }
  }
  ${workflowStepFields}
`;

export const updateWorkflowStepMutation = gql`
  mutation UpdateWorkflowStep($id: ID!, $input: UpdateWorkflowStepInput!) {
    updateWorkflowStep(id: $id, input: $input) {
      ...WorkflowStepFields
    }
  }
  ${workflowStepFields}
`;

export const deleteWorkflowStepMutation = gql`
  mutation DeleteWorkflowStep($id: ID!) {
    deleteWorkflowStep(id: $id)
  }
`;
