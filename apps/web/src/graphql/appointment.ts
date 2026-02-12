import { gql } from "urql";

export const appointmentFields = gql`
  fragment AppointmentFields on Appointment {
    id
    patientId
    title
    description
    startTime
    endTime
    status
    createdAt
    updatedAt
    patient {
      id
      name
    }
  }
`;

export const appointmentsQuery = gql`
  query Appointments($startDate: DateTime, $endDate: DateTime, $patientId: ID) {
    appointments(
      startDate: $startDate
      endDate: $endDate
      patientId: $patientId
    ) {
      ...AppointmentFields
    }
  }
  ${appointmentFields}
`;

export const appointmentQuery = gql`
  query Appointment($id: ID!) {
    appointment(id: $id) {
      ...AppointmentFields
    }
  }
  ${appointmentFields}
`;

export const createAppointmentMutation = gql`
  mutation CreateAppointment($input: CreateAppointmentInput!) {
    createAppointment(input: $input) {
      ...AppointmentFields
    }
  }
  ${appointmentFields}
`;

export const updateAppointmentMutation = gql`
  mutation UpdateAppointment($id: ID!, $input: UpdateAppointmentInput!) {
    updateAppointment(id: $id, input: $input) {
      ...AppointmentFields
    }
  }
  ${appointmentFields}
`;

export const deleteAppointmentMutation = gql`
  mutation DeleteAppointment($id: ID!) {
    deleteAppointment(id: $id)
  }
`;
