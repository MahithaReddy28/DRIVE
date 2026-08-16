import { Facility } from './types';

export const DEFAULT_FACILITIES: Facility[] = [
  {
    id: "fac_01",
    name: "Relief Center Alpha (Perambur Sector)",
    type: "RELIEF_CENTER",
    lat: 13.1020,
    lng: 80.2520,
    elevation: 1.2,
    capacity: "5,000 refugees",
    icon: "warehouse"
  },
  {
    id: "fac_02",
    name: "Central Medical Hub (Park Town)",
    type: "HOSPITAL",
    lat: 13.0815,
    lng: 80.2770,
    elevation: 3.8,
    capacity: "850 beds / Trauma Level I",
    icon: "hospital"
  },
  {
    id: "fac_03",
    name: "Guindy Emergency Logistics Post",
    type: "LOGISTICS_HUB",
    lat: 13.0067,
    lng: 80.2020,
    elevation: 5.2,
    capacity: "Relief Fleet B Headquarter",
    icon: "truck"
  },
  {
    id: "fac_04",
    name: "Velachery Emergency Shelter",
    type: "SHELTER",
    lat: 12.9815,
    lng: 80.2180,
    elevation: 0.9,
    capacity: "2,200 evacuees",
    icon: "home"
  },
  {
    id: "fac_05",
    name: "Anna Nagar Rescue Command",
    type: "DISPATCH_CENTER",
    lat: 13.0850,
    lng: 80.2100,
    elevation: 4.1,
    capacity: "Air & Amphibious Command",
    icon: "shield"
  },
  {
    id: "fac_06",
    name: "Adyar Water Rescue Station",
    type: "RESCUE_STATION",
    lat: 13.0012,
    lng: 80.2565,
    elevation: 1.5,
    capacity: "Boat Teams 14-20",
    icon: "anchor"
  },
  {
    id: "fac_07",
    name: "Royapettah Medical Depot",
    type: "HOSPITAL",
    lat: 13.0535,
    lng: 80.2610,
    elevation: 3.2,
    capacity: "Pharmaceutical Reserve",
    icon: "cross"
  }
];
