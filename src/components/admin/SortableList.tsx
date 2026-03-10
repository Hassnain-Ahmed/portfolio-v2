import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DraggableAttributes,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { ReactNode } from "react";

export interface DragHandleProps {
  ref: (node: HTMLElement | null) => void;
  listeners: Record<string, Function> | undefined;
  attributes: DraggableAttributes;
}

interface SortableListProps<T> {
  items: T[];
  getId: (item: T, index: number) => string;
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number, dragHandle: DragHandleProps) => ReactNode;
}

function SortableItem<T>({
  id,
  item,
  index,
  renderItem,
}: {
  id: string;
  item: T;
  index: number;
  renderItem: SortableListProps<T>["renderItem"];
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 10 : undefined,
  };

  const dragHandle: DragHandleProps = {
    ref: setActivatorNodeRef,
    listeners,
    attributes,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {renderItem(item, index, dragHandle)}
    </div>
  );
}

export default function SortableList<T>({ items, getId, onReorder, renderItem }: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const ids = items.map((item, i) => getId(item, i));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...items];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    onReorder(reordered);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        {items.map((item, i) => (
          <SortableItem key={ids[i]} id={ids[i]} item={item} index={i} renderItem={renderItem} />
        ))}
      </SortableContext>
    </DndContext>
  );
}

export function DragHandle({ dragHandle }: { dragHandle: DragHandleProps }) {
  return (
    <button
      ref={dragHandle.ref}
      {...dragHandle.listeners}
      {...dragHandle.attributes}
      className="shrink-0 cursor-grab touch-none rounded p-1 text-gray-600 hover:text-gray-400 active:cursor-grabbing"
      tabIndex={0}
    >
      <GripVertical size={16} />
    </button>
  );
}
