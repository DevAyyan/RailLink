"use client";

import { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface Station {
  id: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
}

interface Railway {
  id: string;
  station_1_id: string;
  station_2_id: string;
  distance_km: number;
}

// const sampleStations = [
//   { id: "1", name: "Central Station", city: "Karachi", longitude: 100, latitude: 100 },
//   { id: "2", name: "North Terminal", city: "Karachi", longitude: 200, latitude: 50 },
//   { id: "3", name: "East Junction", city: "Karachi", longitude: 250, latitude: 150 },
//   { id: "4", name: "South Station", city: "Karachi", longitude: 150, latitude: 200 },
//   { id: "5", name: "Main Station", city: "Lahore", longitude: 400, latitude: 100 },
//   { id: "6", name: "West Terminal", city: "Lahore", longitude: 500, latitude: 150 },
// ]

// const sampleRailways = [
//   { station_1_id: "1", station_2_id: "2", distance_km: 15 },
//   { station_1_id: "2", station_2_id: "3", distance_km: 12 },
//   { station_1_id: "3", station_2_id: "4", distance_km: 18 },
//   { station_1_id: "4", station_2_id: "1", distance_km: 20 },
//   { station_1_id: "1", station_2_id: "5", distance_km: 300 },
//   { station_1_id: "5", station_2_id: "6", distance_km: 10 },
// ]

export function NetworkGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [stations, setStations] = useState<Station[]>([]);
  const [railways, setRailways] = useState<Railway[]>([]);
  const [dataFetched, setDataFetched] = useState(false);

  const resetView = () => {
    if (cyRef.current) {
      cyRef.current.fit(cyRef.current.nodes(), 100); // Use nodes to fit
      cyRef.current.zoom(1.0);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stationsRes, railwaysRes] = await Promise.all([
          fetch("/api/stations"),
          fetch("/api/railways"),
        ]);

        const stationsData = await stationsRes.json();
        const railwaysData = await railwaysRes.json();

        setStations(
          stationsData.results.map((station: Station) => ({
            id: String(station.id),
            name: station.name,
            city: station.city,
            latitude: Number(station.latitude*25),
            longitude: Number(station.longitude*25),
          }))
        );

        setRailways(
          railwaysData.results.map((railway: Railway) => ({
            station_1_id: String(railway.station_1_id),
            station_2_id: String(railway.station_2_id),
            distance_km: Number(railway.distance_km),
          }))
        );

        setDataFetched(true);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!containerRef.current || stations.length === 0 || railways.length === 0)
      return;

    const cy = cytoscape({
      container: containerRef.current,
      elements: [
        // Nodes (stations)
        ...stations.map((station) => ({
          data: {
            id: String(station.id),
            label: `${station.name}, ${station.city}`,
            city: station.city,
          },
          position: { x: station.longitude, y: station.latitude },
          locked: true,
        })),

        // Edges (railways)
        ...railways.map((railway) => ({
          data: {
            source: String(railway.station_1_id),
            target: String(railway.station_2_id),
            distance: railway.distance_km,
            label: `${railway.distance_km} km`,
          },
        })),
      ],
      style: [
        {
          selector: "node",
          style: {
            "background-color": "#4299e1",
            label: "data(label)",
            color: "#1a202c",
            "text-valign": "center",
            "text-halign": "center",
            "font-size": "15px",
            width: "20px",
            height: "20px",
            "text-wrap": "wrap",
            "text-max-width": "40px",
          },
        },
        {
          selector: "edge",
          style: {
            width: 2,
            "line-color": "#a0aec0",
            "curve-style": "bezier",
            label: "data(label)",
            "font-size": "8px",
            "text-rotation": "autorotate",
            "text-background-color": "#f7fafc",
            "text-background-opacity": 0.7,
            "text-background-padding": "2px",
          },
        },
      ],
      layout: {
        name: "preset",
      },
      minZoom: 0.5,
      maxZoom: 2.0,
      zoom: 1.0,
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
      autoungrabify: true,
      autounselectify: true,
    });

    // Add zoom event listener
    cy.on('zoom', (evt) => {
      const zoom = cy.zoom();
      const baseFontSize = 15;
      const minFontSize = 8;
      const maxFontSize = 30;
      
      const fontSize = Math.min(Math.max(baseFontSize / zoom, minFontSize), maxFontSize);
      
      cy.style()
        .selector('node')
        .style({
          'font-size': `${fontSize}px`
        })
        .selector('edge')
        .style({
          'font-size': `${fontSize * 0.6}px`
        })
        .update();
    });

    cyRef.current = cy;
    cy.fit(cy.nodes(), 50);
    setIsInitialized(true);

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, [stations, railways, dataFetched]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />

      {isInitialized && (
        <Button
          onClick={resetView}
          className="absolute bottom-4 right-4 z-10 bg-white/80 hover:bg-white shadow-md"
          size="sm"
          variant="outline"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset View
        </Button>
      )}
    </div>
  );
}
