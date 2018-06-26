import * as React from "react";
import stripTags from "striptags";

import { absUrl, lengthToDuration } from "../../transformers/transformData";
import Schema from "./Schema";

const getProductionType = (productionType: string) => {
  switch (productionType) {
    default:
    case "studio":
      return "StudioAlbum";

    case "compilation":
      return "CompilationAlbum";

    case "demo":
      return "DemoAlbum";

    case "live":
      return "LiveAlbum";

    case "remix":
      return "RemixAlbum";

    case "soundtrack":
      return "SoundtrackAlbum";
  }
};

const getReleaseType = (type: string) => {
  switch (type) {
    default:
    case "album":
      return "AlbumRelease";

    case "ep":
      return "EPRelease";

    case "single":
    case "remix":
      return "SingleRelease";
  }
};

const getFlatTracklist = (tracklist: IReleaseTrack[][]) => {
  return tracklist.reduce((acc, curr) => {
    acc = [...acc, ...curr];

    return acc;
  }, []);
};

const Release: React.SFC<IRelease> = props => (
  <Schema
    {...{
      "@id": absUrl(`/releases/${props.slug}`),
      "@type": "MusicAlbum",
      albumProductionType: `http://schema.org/${getProductionType(
        props.productionType
      )}`,
      albumRelease: {
        "@type": "MusicRelease",
        duration: lengthToDuration(props.length),
        name: props.title,
        recordLabel: props.recordLabel
      },
      albumReleaseType: `http://schema.org/${getReleaseType(props.type)}`,
      byArtist: {
        "@type": "MusicGroup",
        name: props.artist.name
      },
      datePublished: props.releasedOn,
      description: stripTags(props.description).replace(/\n/g, ""),
      image: props.images[0].imageUrl,
      mainEntityOfPage: {
        "@id": absUrl(`/releases/${props.slug}`)
      },
      name: props.title,
      track: {
        "@type": "ItemList",
        itemListElement: getFlatTracklist(props.tracklist).map(
          (track: IReleaseTrack, index) => ({
            "@type": "ListItem",
            item: {
              "@type": "MusicRecording",
              duration: lengthToDuration(track.length),
              name: track.title,
              recordingOf: {
                "@type": "MusicComposition",
                name: track.title
              }
            },
            position: index + 1
          })
        ),
        numberOfItems: getFlatTracklist(props.tracklist).length
      }
    }}
  />
);

export default Release;
