export type FetchState<T> =
  | {
      state: "uninitialized";
    }
  | {
      state: "loading";
      previousData?: T;
    }
  | {
      state: "loaded";
      data: T;
    }
  | {
      state: "error";
      error: Error | any;
      previousData?: T;
    };
