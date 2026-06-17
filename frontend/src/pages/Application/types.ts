import type { z } from "zod";
import { newApplicationSchema } from "./validation";

export type AddApplicationInput = z.infer<typeof newApplicationSchema>;
