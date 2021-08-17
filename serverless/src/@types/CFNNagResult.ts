export interface CFNNagResult {
  filename: string;
  file_results: FileResults;
}

export interface FileResults {
  failure_count: number;
  violations: Violation[];
}

export interface Violation {
  id: string;
  type: string;
  message: string;
  logical_resource_ids: string[];
  line_numbers: number[];
}
