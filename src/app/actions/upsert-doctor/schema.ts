import { z } from "zod";

export const upsertDoctorSchema = z
  .object({
    id: z.string().uuid().optional(),
    name: z.string().trim().min(1, { message: "nome é obrigatório" }),
    specialty: z
      .string()
      .trim()
      .min(1, { message: "especialidade é obrigatório" }),
    appointmentPriceInCents: z
      .number()
      .min(1, { message: "preço é obrigatório" }),
    availableFromWeekDay: z.number().min(0).max(6, {
      message: "dia da semana inválido",
    }),
    availableToWeekDay: z.number().min(0).max(6, {
      message: "dia da semana inválido",
    }),
    availableFromTime: z
      .string()
      .min(1, { message: "horário de início é obrigatório" }),
    availableToTime: z
      .string()
      .min(1, { message: "horário de término é obrigatório" }),
  })
  .refine(
    (data) => {
      return data.availableFromTime < data.availableToTime;
    },
    {
      message: "horário de início deve ser menor que o horário de término",
      path: ["availableToTime"],
    },
  );

export type UpsertDoctorSchema = z.infer<typeof upsertDoctorSchema>;
