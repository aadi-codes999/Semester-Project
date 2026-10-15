export function getFeatureCollection(features = []) {
  return {
    type: "FeatureCollection",
    features,
  };
}
