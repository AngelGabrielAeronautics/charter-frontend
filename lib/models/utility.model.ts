export interface IRedirect {
  shouldRedirect: boolean;
  redirectPath?: string;
}

export interface INotify {
  shouldNotify: boolean;
  message: string;
  title: string;
  type: "success" | "info" | "warning" | "error" | undefined;
}
