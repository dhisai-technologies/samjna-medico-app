export function delay(seconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export function generateRandomText(
  words = ["Lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit"],
  numberOfLines = 1,
): string {
  let randomText = "";

  for (let i = 0; i < numberOfLines; i++) {
    const lineLength = Math.floor(Math.random() * 10) + 5; // Random line length between 5 and 15 words
    let line = "";
    for (let j = 0; j < lineLength; j++) {
      const wordIndex = Math.floor(Math.random() * words.length);
      line += `${words[wordIndex]} `;
    }
    randomText += `${line.trim()}\n`;
  }

  return randomText.trim();
}

export * from "./nav";
export * from "./error";
export * from "./case";
export * from "./date";
export * from "./debounce";
