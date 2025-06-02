import { z } from "zod";

export const createAppointmentSchema = z.object({
  patientId: z.string().uuid({
    message: "Paciente é obrigatório",
  }),
  doctorId: z.string().uuid({
    message: "Médico é obrigatório",
  }),
  date: z.date({
    required_error: "Data é obrigatória",
  }),
  priceInCents: z.number().min(1, {
    message: "Valor é obrigatório",
  }),
});

export type CreateAppointmentSchema = z.infer<typeof createAppointmentSchema>;
