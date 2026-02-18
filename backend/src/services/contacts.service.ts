import { ContactRequestStatus as PrismaStatus } from "@prisma/client";
import { prisma } from "../config/database.js";
import { AppError } from "../utils/AppError.js";
import { ErrorCode } from "../utils/errorCodes.js";
import { sendContactNotification } from "./brevo.service.js";
import type { CreateContactSchemaType, ContactStatusEnum } from "shared";
import type { ContactRequest } from "shared";

const statusToApi = (s: PrismaStatus): ContactRequest["status"] => {
  switch (s) {
    case "PENDING":
      return "pending";
    case "IN_PROGRESS":
      return "in_progress";
    case "DONE":
      return "done";
    default:
      return "pending";
  }
};

const statusToPrisma = (s: ContactStatusEnum): PrismaStatus => {
  switch (s) {
    case "pending":
      return "PENDING";
    case "in_progress":
      return "IN_PROGRESS";
    case "done":
      return "DONE";
    default:
      return "PENDING";
  }
};

function toContactRequest(row: {
  id: string;
  name: string;
  email: string;
  message: string;
  status: PrismaStatus;
  createdAt: Date;
  updatedAt: Date;
}): ContactRequest {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    status: statusToApi(row.status),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function createContactRequest(
  data: CreateContactSchemaType,
): Promise<ContactRequest> {
  const row = await prisma.contactRequest.create({
    data: {
      name: data.name,
      email: data.email,
      message: data.message,
      status: "PENDING",
    },
  });

  sendContactNotification({
    name: data.name,
    email: data.email,
    message: data.message,
  }).catch((err) => {
    console.error("[Contacts] Brevo notification error (request saved):", err);
  });

  return toContactRequest(row);
}

export async function getAllContactRequests(): Promise<ContactRequest[]> {
  const rows = await prisma.contactRequest.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toContactRequest);
}

export async function updateContactRequestStatus(
  id: string,
  status: ContactStatusEnum,
): Promise<ContactRequest> {
  const row = await prisma.contactRequest.findUnique({ where: { id } });
  if (!row) {
    throw new AppError(
      404,
      "Demande de contact non trouvée",
      ErrorCode.NOT_FOUND,
    );
  }
  const updated = await prisma.contactRequest.update({
    where: { id },
    data: { status: statusToPrisma(status) },
  });
  return toContactRequest(updated);
}
