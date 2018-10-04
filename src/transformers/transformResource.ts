export default (resource: any) => ({
  ...resource,
  isActive: (resource.isActive && resource.isActive === "y") || false
});
