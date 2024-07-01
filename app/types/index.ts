export type Action =
  | {
      action: "facts";
      chunk: string;
    }
  | {
      action: "stop";
    }
  | {
      action: "error";
      message: string;
    };
