import type { z } from "zod";
import { newApplicationSchema } from "../../validation/validation";

export type AddApplicationInput = z.infer<typeof newApplicationSchema>;
