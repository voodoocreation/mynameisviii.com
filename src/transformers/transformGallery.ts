import { toTitleCase } from "./transformData";

export default (gallery: any) => ({
  ...gallery,
  title: gallery.title || toTitleCase(gallery.slug, "-")
});
