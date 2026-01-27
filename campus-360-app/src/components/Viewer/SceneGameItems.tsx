import { Collectible } from '../Game/GameComponents';

// Placeholder positions for game items - in real app, these would come from manifest
const GAME_ITEMS = [
  { id: 'item1', pos: [15, -5, -20] as [number, number, number], sceneId: 'gatetologo-1' },
  { id: 'item2', pos: [-10, 0, 15] as [number, number, number], sceneId: 'gatetologo-2' },
  { id: 'item3', pos: [0, -8, -25] as [number, number, number], sceneId: 'block1-12' },
];

export const SceneGameItems: React.FC<{ currentImageId: string }> = ({ currentImageId }) => {
  return (
    <>
      {GAME_ITEMS.filter((item) => item.sceneId === currentImageId).map((item) => (
        <Collectible key={item.id} id={item.id} position={item.pos} />
      ))}
    </>
  );
};
