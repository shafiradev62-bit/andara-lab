// Exchange Rate API Routes — /api/exchange-rates
// Full CRUD: GET (list/one), POST (create), PUT (update), DELETE, POST (reset)

import { Router, type Response } from "express";
import type { Request } from "express";
import { z } from "zod";
import { exchangeRateStore } from "../lib/store.js";

const createExchangeRateSchema = z.object({
  symbol:      z.string().min(1),
  label:       z.string().min(1),
  labelEn:     z.string().optional(),
  labelId:     z.string().optional(),
  value:       z.string().min(1),
  change:      z.string().min(1),
  changeValue: z.number().optional().default(0),
  up:          z.enum(["true", "false", "null"]).optional().transform((v) => {
    if (v === "true") return true;
    if (v === "false") return false;
    return null;
  }),
  category:    z.enum(["currency", "index", "commodity", "bond"]).default("currency"),
  order:       z.number().optional().default(99),
  enabled:     z.boolean().optional().default(true),
});

const updateExchangeRateSchema = createExchangeRateSchema.partial();

function problem(res: Response, status: number, title: string, detail?: string) {
  res.status(status).json({ type: `https://andarlab.io/errors/${status}`, title, status, detail });
}

function paramStr(req: Request, name: string): string {
  const v = req.params[name];
  return Array.isArray(v) ? v[0] : (v ?? "");
}

const router = Router();

router.post("/reset", (_req: Request, res: Response) => {
  exchangeRateStore.reset();
  res.json({ data: exchangeRateStore.list(), meta: { total: exchangeRateStore.list().length, reset: true } });
});

router.get("/", (_req: Request, res: Response) => {
  const data = exchangeRateStore.list();
  res.json({ data, meta: { total: data.length } });
});

router.post("/", (req: Request, res: Response) => {
  const result = createExchangeRateSchema.safeParse(req.body);
  if (!result.success) return problem(res, 400, "Validation Error", result.error.message);
  const er = exchangeRateStore.create(result.data);
  res.status(201).json({ data: er, meta: { created: true } });
});

router.get("/:id", (req: Request, res: Response) => {
  const id = paramStr(req, "id");
  const er = exchangeRateStore.get(id);
  if (!er) return problem(res, 404, "Not Found", `Exchange rate '${id}' does not exist`);
  res.json({ data: er });
});

router.put("/:id", (req: Request, res: Response) => {
  const id = paramStr(req, "id");
  const result = updateExchangeRateSchema.safeParse(req.body);
  if (!result.success) return problem(res, 400, "Validation Error", result.error.message);
  const updated = exchangeRateStore.update(id, result.data);
  if (!updated) return problem(res, 404, "Not Found", `Exchange rate '${id}' does not exist`);
  res.json({ data: updated, meta: { updated: true } });
});

router.delete("/:id", (req: Request, res: Response) => {
  const id = paramStr(req, "id");
  if (!exchangeRateStore.delete(id)) return problem(res, 404, "Not Found", `Exchange rate '${id}' does not exist`);
  res.status(204).end();
});

router.post("/reorder", (req: Request, res: Response) => {
  const { ids } = req.body as { ids: string[] };
  if (!Array.isArray(ids)) return problem(res, 400, "Validation Error", "ids must be an array");
  exchangeRateStore.reorder(ids);
  res.json({ data: exchangeRateStore.list(), meta: { reordered: true } });
});

export default router;
