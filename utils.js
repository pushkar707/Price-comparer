function calculateLevenshteinDistance(str1, str2) {
  // const minLength = Math.min(str1.length, str2.length);
  str1 = str1.toLowerCase()
  str1 = str1.replaceAll(",","")
  str1 = str1.replaceAll("(","")
  str1 = str1.replaceAll(")","")
  str1 = str1.replaceAll("-","")

  str2 = str2.toLowerCase()
  str2 = str2.replaceAll(",","")
  str2 = str2.replaceAll("(","")
  str2 = str2.replaceAll(")","")
  str2 = str2.replaceAll("-","")

  const words1 = str1.split(" ");
  const words2 = str2.split(" ");
  console.log(words1);
  console.log(words2);

  // Calculate the intersection of word sets
  const intersection = new Set(words1.filter(word => words2.includes(word)));
  console.log(intersection);

  // Calculate Jaccard similarity
  const similarity = (intersection.size / words1.length)*100;
  return similarity;
}