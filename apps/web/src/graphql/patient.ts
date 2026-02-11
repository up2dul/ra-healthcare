import { gql } from "urql";

export const patientFields = gql`
  fragment PatientFields on Patient {
    id
    name
    email
    phone
    dateOfBirth
    gender
    address
    createdAt
    updatedAt
  }
`;

export const patientsQuery = gql`
  query Patients($page: Int, $limit: Int, $search: String) {
    patients(page: $page, limit: $limit, search: $search) {
      data {
        ...PatientFields
      }
      total
      page
      limit
      totalPages
    }
  }
  ${patientFields}
`;

export const patientQuery = gql`
  query Patient($id: ID!) {
    patient(id: $id) {
      ...PatientFields
      appointments {
        id
        title
        startTime
        endTime
        status
      }
    }
  }
  ${patientFields}
`;

export const createPatientMutation = gql`
  mutation CreatePatient($input: CreatePatientInput!) {
    createPatient(input: $input) {
      ...PatientFields
    }
  }
  ${patientFields}
`;

export const updatePatientMutation = gql`
  mutation UpdatePatient($id: ID!, $input: UpdatePatientInput!) {
    updatePatient(id: $id, input: $input) {
      ...PatientFields
    }
  }
  ${patientFields}
`;

export const deletePatientMutation = gql`
  mutation DeletePatient($id: ID!) {
    deletePatient(id: $id)
  }
`;
