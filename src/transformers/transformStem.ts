export default (stem: any) => ({
  ...stem,
  isActive: (stem.isActive && stem.isActive === "y") || false
});
