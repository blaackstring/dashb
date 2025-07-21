import { InferenceClient } from "@huggingface/inference";

console.log(import.meta.env.VITE_HF_TOKEN);

export const client = new InferenceClient(import.meta.env.VITE_HF_TOKEN || "");
