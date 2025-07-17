export interface Patent {
  id: string;
  title: string;
  abstract: string;
  ipc_codes: string[];
  applicants: string[];
  inventors: string[];
  publication_date: string;
  country: string;
}
