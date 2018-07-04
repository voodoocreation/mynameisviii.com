export default (article: any) => ({
  ...article,
  isActive: (article.isActive && article.isActive === "y") || false
});
