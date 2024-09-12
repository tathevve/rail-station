import React, { useState } from 'react';

interface SegmentControlsProps {
  segments: { name: string; lines: number[] }[];
  editingSegmentIndex: number | null;
  selectedLines: number[];
  onCreateSegment: (name: string, lines: number[]) => void;
  onEditSegment: (index: number) => void;
  onSaveSegmentEdit: () => void;
  onDeleteSegment: (index: number) => void;
  onSegmentNameChange: (index: number, name: string) => void;
  onLineSelectionChange: (index: number) => void;
}

const SegmentControls: React.FC<SegmentControlsProps> = ({
  segments,
  editingSegmentIndex,
  selectedLines,
  onCreateSegment,
  onEditSegment,
  onSaveSegmentEdit,
  onDeleteSegment,
  onSegmentNameChange,
  onLineSelectionChange,
}) => {
  const [newSegmentName, setNewSegmentName] = useState<string>('');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSegmentName(e.target.value);
  };

  const handleCreateSegment = () => {
    if (selectedLines.length > 0 && newSegmentName.trim()) {
      onCreateSegment(newSegmentName, selectedLines);
      setNewSegmentName('');
    }
  };

  const handleSegmentNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingSegmentIndex !== null) {
      onSegmentNameChange(editingSegmentIndex, e.target.value);
    }
  };

  return (
    <div style={{ padding: '10px', backgroundColor: 'white', zIndex: 1000 }}>
      {editingSegmentIndex === null ? (
        <>
          <input
            type="text"
            value={newSegmentName}
            onChange={handleNameChange}
            placeholder="Enter segment name"
            style={{ marginRight: '10px' }}
          />
          <button onClick={handleCreateSegment} disabled={selectedLines.length === 0 || !newSegmentName.trim()}>
            Create Segment
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            value={segments[editingSegmentIndex].name}
            onChange={handleSegmentNameChange}
            placeholder="Edit segment name"
            style={{ marginRight: '10px' }}
          />
          <button onClick={onSaveSegmentEdit}>
            Save Segment Edits
          </button>
          <button onClick={() => onDeleteSegment(editingSegmentIndex!)} style={{ marginLeft: '10px' }}>
            Delete Segment
          </button>
        </>
      )}
      <ul>
        {segments.map((segment, index) => (
          <li key={index}>
            {segment.name}
            <button onClick={() => onEditSegment(index)} style={{ marginLeft: '10px' }}>
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SegmentControls;
