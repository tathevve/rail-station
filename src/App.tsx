import React, { useState } from 'react';
import { MapContainer, TileLayer, Polyline, FeatureGroup } from 'react-leaflet';
import { LatLngTuple, LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import geoJson from './rail_lines.json';
import SegmentControls from './SegmentControls';
import './App.css';

const App: React.FC = () => {
  const [selectedLines, setSelectedLines] = useState<number[]>([]);
  const [segments, setSegments] = useState<{ name: string; lines: number[] }[]>([]);
  const [editingSegmentIndex, setEditingSegmentIndex] = useState<number | null>(null);

  const features = geoJson.features.map((f, idx) => {
    const coordinates: LatLngTuple[] = f.geometry.coordinates.map((coord: number[]): LatLngTuple => [coord[1], coord[0]]);
    return { coordinates, properties: f.properties, index: idx };
  });

  const handleLineClick = (index: number) => {
    if (editingSegmentIndex === null) {
      setSelectedLines((prevSelected) => {
        if (prevSelected.includes(index)) {
          return prevSelected.filter((i) => i !== index);
        } else {
          return [...prevSelected, index];
        }
      });
    } else {
      setSegments((prevSegments) => {
        const newSegments = [...prevSegments];
        const segment = newSegments[editingSegmentIndex!].lines;
        if (segment.includes(index)) {
          const updatedSegment = segment.filter((lineIdx) => lineIdx !== index);
          newSegments[editingSegmentIndex!] = { ...newSegments[editingSegmentIndex!], lines: updatedSegment };
        } else {
          newSegments[editingSegmentIndex!] = { ...newSegments[editingSegmentIndex!], lines: [...segment, index] };
        }
        return newSegments;
      });
    }
  };

  const handleCreateSegment = (name: string, lines: number[]) => {
    if (name.trim()) {
      setSegments((prevSegments) => [
        ...prevSegments,
        { name, lines },
      ]);
      setSelectedLines([]);
    }
  };

  const handleEditSegment = (index: number) => {
    setEditingSegmentIndex(index);
  };

  const handleSaveSegmentEdit = () => {
    setEditingSegmentIndex(null);
  };

  const handleDeleteSegment = (index: number) => {
    setSegments((prevSegments) => prevSegments.filter((_, idx) => idx !== index));
    if (editingSegmentIndex === index) {
      setEditingSegmentIndex(null);
    }
  };

  const handleSegmentNameChange = (index: number, name: string) => {
    setSegments((prevSegments) => {
      const newSegments = [...prevSegments];
      newSegments[index] = { ...newSegments[index], name };
      return newSegments;
    });
  };

  const renderSegments = () => (
    segments.map((segment, idx) => (
      <FeatureGroup key={idx}>
        {segment.lines.map((lineIdx: number) => (
          <Polyline
            key={lineIdx}
            positions={features[lineIdx].coordinates}
            color={editingSegmentIndex === idx ? 'green' : 'red'}
            eventHandlers={{
              click: () => handleLineClick(lineIdx),
              mouseover: (event: LeafletMouseEvent) => {
                const tooltip = event.target.bindTooltip(
                  `<div><strong>Segment:</strong> ${segment.name}</div>`,
                  { direction: 'top', permanent: false }
                );
                tooltip.openTooltip(event.latlng);
              },
              mouseout: (event: LeafletMouseEvent) => {
                event.target.closeTooltip();
              },
            }}
          />
        ))}
      </FeatureGroup>
    ))
  );

  return (
    <div className="container">
      <div className="header">
        <SegmentControls
          segments={segments}
          editingSegmentIndex={editingSegmentIndex}
          selectedLines={selectedLines}
          onCreateSegment={handleCreateSegment}
          onEditSegment={handleEditSegment}
          onSaveSegmentEdit={handleSaveSegmentEdit}
          onDeleteSegment={handleDeleteSegment}
          onSegmentNameChange={handleSegmentNameChange}
          onLineSelectionChange={handleLineClick}
        />
      </div>

      <MapContainer center={[42.238420597484961, -71.799343185487814]} zoom={13} className="map-container">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {features.map((feature) => (
          <Polyline
            key={feature.index}
            positions={feature.coordinates}
            color={selectedLines.includes(feature.index) ? 'red' : 'blue'}
            eventHandlers={{
              click: () => handleLineClick(feature.index),
            }}
          />
        ))}

        {renderSegments()}
      </MapContainer>
    </div>
  );
};

export default App;
