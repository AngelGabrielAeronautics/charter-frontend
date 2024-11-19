export interface IFile {
  name: string;
  data: string;
  mimetype: string;
  size: number;
}

export interface IFileInfo {
  documentName: string;
  dateUploaded: Date | null;
  expirationDate?: Date | null;
  file?: IFile | null;
  status: string;
}
