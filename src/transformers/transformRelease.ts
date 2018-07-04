export default (release: any) => ({
  ...release,
  isActive: (release.isActive && release.isActive === "y") || false
});
