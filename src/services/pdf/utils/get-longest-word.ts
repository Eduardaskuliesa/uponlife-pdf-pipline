export const getLongestWord = (text: string) => {
  const words = text.split(" ");
  return words.reduce(
    (longest, current) => (current.length > longest.length ? current : longest),
    ""
  );
};
