export interface CFNLintResult {
  Filename: string;
  Level: string;
  Location: Location;
  Message: string;
  Rule: Rule;
}

interface Location {
  End: End;
  Path: string[];
  Start: End;
}

interface End {
  ColumnNumber: number;
  LineNumber: number;
}

interface Rule {
  Description: string;
  Id: string;
  ShortDescription: string;
  Source: string;
}
