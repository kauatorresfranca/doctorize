import db from "@/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as Schema from "@/db/schema";
import { userToClinicsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { customSession } from "better-auth/plugins";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "pg" or "mysql"
    usePlural: true,
    schema: Schema,
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    customSession(async ({ user, session }) => {
      const clinics = await db.query.userToClinicsTable.findMany({
        where: eq(userToClinicsTable.userId, user.id),
        with: {
          clinic: true,
        },
      });
      //TODO: AO ADAPTAR PARA O USUARIO TER MULTIPLAS CLINICAS, SERÁ NECESSÁRIO ALTERAR A LÓGICA PARA RETORNAR TODAS AS CLINICAS DO USUARIO
      const clinic = clinics[0];
      return {
        user: {
          ...user,
          clinic: {
            id: clinic.clinicId,
            name: clinic.clinic.name,
          },
        },
        session,
      };
    }),
  ],
  user: {
    modelName: "usersTable",
  },
  session: {
    modelName: "sessionsTable",
  },
  account: {
    modelName: "accountsTable",
  },
  verification: {
    modelName: "verificationsTable",
  },
  emailAndPassword: {
    enabled: true,
  },
});
