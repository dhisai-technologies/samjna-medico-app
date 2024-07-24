export function delay(seconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export * from "./nav";
export * from "./error";
export * from "./case";
export * from "./date";
export * from "./debounce";
export * from "./bytes";
export * from "./text";
