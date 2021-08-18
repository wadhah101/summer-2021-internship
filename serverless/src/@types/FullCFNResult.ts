import { CFNLintResult } from "./CFNLintResult";
import { CFNNagResult } from "./CFNNagResult";

export interface FullCFNResult {
  executionID: string;
  date: string;
  CFNNagResult: CFNNagResult[];
  CFNLintResult: CFNLintResult[];
}
