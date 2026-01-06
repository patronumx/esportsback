
// Component for individual Zone Image
const ZoneImage = ({ obj, isSelected, onSelect, onDragMove, onDragEnd }) => {
    const [image] = useImage(obj.imageUrl);

    // Calculate dimensions from radius
    // Radius is half-width. Konva Image draws from top-left by default.
    // We want obj.x, obj.y to be the CENTER.

    // width = radius * 2
    const width = obj.radius * 2;
    const height = obj.radius * 2;

    return (
        <KonvaImage
            id={obj.id}
            image={image}
            x={obj.x - width / 2} // Offset to center
            y={obj.y - height / 2}
            width={width}
            height={height}
            draggable={true} // Always draggable (controlled by logic)
            onClick={() => onSelect(obj.id)}
            onDragMove={onDragMove}
            onDragEnd={onDragEnd}
            // Add shadow or stroke to indicate selection?
            shadowColor="white"
            shadowBlur={isSelected ? 20 : 0}
            shadowOpacity={0.5}
        />
    );
};
