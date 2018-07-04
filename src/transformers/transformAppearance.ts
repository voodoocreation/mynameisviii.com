export default (appearance: any) => ({
  ...appearance,
  isActive: (appearance.isActive && appearance.isActive === "y") || false
});
