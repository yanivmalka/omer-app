import { TrackerGrid } from '@omer/ds';

const statuses: Record<number, 'y' | 'n'> = {};
for (let i = 1; i <= 19; i++) statuses[i] = 'y';
statuses[12] = 'n';
export const MidOmer = () => <div style={{ width: 380 }}><TrackerGrid statuses={statuses} current={21} tonight={21} /></div>;
export const AllCounted = () => {
  const all: Record<number, 'y'> = {}; for (let i = 1; i <= 49; i++) all[i] = 'y';
  return <div style={{ width: 380 }}><TrackerGrid statuses={all} current={49} /></div>;
};
