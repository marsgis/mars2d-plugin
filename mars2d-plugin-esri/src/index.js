import L from "leaflet";
import * as LEsri from "esri-leaflet";
import * as mars2d from "mars2d";

L.esri = LEsri
mars2d.esri = LEsri

export { ArcGisImageLayer } from "./esri/ArcGisImageLayer";
export { ArcGisTileLayer } from "./esri/ArcGisTileLayer";
export { ArcGisDynamicLayer } from "./esri/ArcGisDynamicLayer";
export { ArcGisFeatureLayer } from "./esri/ArcGisFeatureLayer";
