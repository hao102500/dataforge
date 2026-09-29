import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableField({ field, selected, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: field.key,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "df-field-item",
        selected ? "is-selected" : "",
        isDragging ? "is-dragging" : "",
      ].join(" ")}
      onClick={onClick}
    >
      {/* 拖拽手柄 */}
      <span
        className="df-field-drag"
        {...attributes}
        {...listeners}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <span className="material-symbols-outlined">drag_indicator</span>
      </span>

      {/* 字段内容 */}
      <div className="df-field-main">
        <div className="df-field-title">
          <span className="df-field-name">{field.name}</span>

          <span className="df-field-key">{field.key}</span>
        </div>

        <div className="df-field-description">{field.description}</div>
      </div>

      {/* 数据类型 */}
      <span className="df-field-type">{field.type}</span>
    </div>
  );
}
