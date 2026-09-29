function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isWholeWordInText(keyword, text) {
  const word = escapeRegExp(keyword.toLowerCase());
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}])${word}(?![\\p{L}\\p{N}])`, 'u');
  return pattern.test(text);
}

function findKeywordsInText(keywords, text) {
  const lowerCaseText = text.toLowerCase();
  return keywords.filter((keyword) => isWholeWordInText(keyword, lowerCaseText));
}
