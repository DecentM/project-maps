import { LocationImages } from "@project-maps/proto/location-images";
import { GeographUKImageSource } from "./image-sources/geograph-uk";

const source = new GeographUKImageSource()

const events = source.getImages(LocationImages.GetLocationImagesRequest.fromObject({
  coordinates: {
    lat: "51.516656",
    lng: "-0.112440",
  },
}))

events.on('image', image => {
  console.log(image.toObject())
})
