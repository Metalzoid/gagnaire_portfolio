import type { Request, Response } from "express";
import * as contactsService from "../services/contacts.service.js";
import { success, successList } from "../utils/apiResponse.js";

export async function list(req: Request, res: Response) {
  const contacts = await contactsService.getAllContactRequests();
  return successList(res, contacts, { total: contacts.length });
}

export async function updateStatus(req: Request, res: Response) {
  const id = String(req.params.id);
  const contact = await contactsService.updateContactRequestStatus(
    id,
    req.body.status,
  );
  return success(res, contact);
}
