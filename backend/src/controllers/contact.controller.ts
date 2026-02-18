import type { Request, Response } from "express";
import * as contactsService from "../services/contacts.service.js";
import { success } from "../utils/apiResponse.js";

export async function submit(req: Request, res: Response) {
  const contact = await contactsService.createContactRequest(req.body);
  return success(res, contact, 201);
}
