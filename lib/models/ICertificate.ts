export interface ICertificate {
  _id?: string;
  key: number;
  name?: string;
  document: IDocument;
  dateUploaded: string;
  status: string;
}

export interface IDocument {
  name?: string;
  filePath?: string;
  base64String: string;
}
