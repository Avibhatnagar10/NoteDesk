import React, { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./notesEditor.css";

// --- UTILITIES & HOOKS ---
const generateId = () => Date.now() + Math.random();
const useHistoryState = <T,>(initialState: T) => {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const setState = (newState: T | ((prevState: T) => T)) => {
    const resolvedState =
      typeof newState === "function"
        ? (newState as (prevState: T) => T)(history[currentIndex])
        : newState;
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(resolvedState);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };
  const undo = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  }, [currentIndex]);
  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) setCurrentIndex(currentIndex + 1);
  }, [currentIndex, history.length]);
  return {
    state: history[currentIndex],
    setState,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
  };
};

// --- TYPES ---
type ParagraphBlock = { id: number; type: "paragraph"; content: string };
type HeadingBlock = { id: number; type: "heading"; content: string };
type ListBlock = { id: number; type: "list"; items: string[] };
type QuoteBlock = { id: number; type: "quote"; content: string };
type DividerBlock = { id: number; type: "divider" };
type Block =
  | ParagraphBlock
  | HeadingBlock
  | ListBlock
  | QuoteBlock
  | DividerBlock;

// --- INITIAL DATA & STATIC COMPONENTS ---
const initialBlocks: Block[] = [
  {
    id: generateId(),
    type: "heading",
    content: "Welcome to Your Modern Notes Editor! 📝",
  },
  {
    id: generateId(),
    type: "paragraph",
    content:
      "This is a block-based editor. Click any text to start typing, or use the toolbar above for formatting.",
  },
  {
    id: generateId(),
    type: "list",
    items: [
      "Drag the ⋮⋮ handle to reorder blocks.",
      "Press 'Enter' to create a new paragraph block below.",
      "Press 'Backspace' on empty block to delete it.",
    ],
  },
  { id: generateId(), type: "quote", content: "Happy note-taking!" },
];

const navItems = [
  { icon: "description", label: "All Notes", active: true },
  { icon: "book", label: "Notebooks" },
  { icon: "label", label: "Tags" },
  { icon: "history", label: "Recent" },
  { icon: "delete", label: "Trash" },
];

const Icon = ({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) => <span className={`material-symbols-outlined ${className}`}>{name}</span>;

const LeftSidebar = () => (
  <aside className="left-sidebar">
    <div className="sidebar-header">
      <div className="logo-icon">
        <svg
          fill="currentColor"
          height="24px"
          viewBox="0 0 256 256"
          width="24px"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H156.69A15.92,15.92,0,0,0,168,219.31L219.31,168A15.92,15.92,0,0,0,224,156.69V48A16,16,0,0,0,208,32ZM96,88h64a8,8,0,0,1,0,16H96a8,8,0,0,1,0-16Zm32,80H96a8,8,0,0,1,0-16h32a8,8,0,0,1,0,16Zm32-32H96a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Zm12.69,60.69V160h44.7Z"></path>
        </svg>
      </div>
      <h1 className="sidebar-title">My Notes</h1>
    </div>
    <nav className="sidebar-nav">
      <ul>
        {navItems.map((item) => (
          <li key={item.label}>
            <a
              href="#"
              className={`nav-link ${item.active ? "nav-link--active" : ""}`}
            >
              <Icon name={item.icon} />
              <span className="nav-link-text">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
    <div className="sidebar-footer">
      <button className="new-note-button">
        <Icon name="add" />
        <span>New Note</span>
      </button>
    </div>
  </aside>
);

const EditorHeader = ({
  undo,
  redo,
  canUndo,
  canRedo,
  onSave,
}: {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onSave?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  const handleFormat = (command: string) =>
    document.execCommand(command, false);

  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onSave && onSave(e);
  };

  return (
    <header className="editor-header">
      <div className="editor-actions">
        <button className="icon-button" onClick={undo} disabled={!canUndo}>
          <Icon name="undo" />
        </button>
        <button className="icon-button" onClick={redo} disabled={!canRedo}>
          <Icon name="redo" />
        </button>
        <div className="divider"></div>
        <button
          className="icon-button"
          onMouseDown={(e) => {
            e.preventDefault();
            handleFormat("bold");
          }}
        >
          <Icon name="format_bold" />
        </button>
        <button
          className="icon-button"
          onMouseDown={(e) => {
            e.preventDefault();
            handleFormat("italic");
          }}
        >
          <Icon name="format_italic" />
        </button>
        <button
          className="icon-button"
          onMouseDown={(e) => {
            e.preventDefault();
            handleFormat("underline");
          }}
        >
          <Icon name="format_underlined" />
        </button>
        <div className="divider"></div>
        <button className="icon-button" onClick={handleSaveClick}>
          <Icon name="save" />
        </button>
        <button className="icon-button">
          <Icon name="share" />
        </button>
      </div>
      <div className="editor-status">
        <span className="save-status">Saved</span>
        <div
          className="user-avatar"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/a/ACg8ocK_S29a-20b1Zd_7GZJgftO8sH_0z-3f8h9g8b1f8b1=s96-c")',
          }}
        ></div>
      </div>
    </header>
  );
};

// --- EDITOR BLOCK ---
const EditorBlock = ({
  block,
  initialBlock,
  dragHandleListeners,
  onChange,
  onAddBlock,
  onDeleteBlock,
  setRef,
}: {
  block: Block;
  initialBlock?: Block;
  dragHandleListeners: ReturnType<typeof useSortable>["listeners"];
  onChange: (id: number, content: string | string[]) => void;
  onAddBlock: (currentBlockId: number) => void;
  onDeleteBlock: (id: number) => void;
  setRef: (id: number, element: HTMLElement | null) => void;
}) => {
  const getPlaceholderText = (b: Block): string => {
    switch (b.type) {
      case "heading":
        return "Untitled Heading";
      case "paragraph":
        return "Type '/' for commands or start typing...";
      case "quote":
        return "Quote text";
      case "list":
        return "List item";
      case "divider":
        return "";
      default:
        return "";
    }
  };

  const handleSlashCommand = (value: string) => {
    if (!value.startsWith("/")) return;
    const cmd = value.slice(1).toLowerCase();
    switch (cmd) {
      case "h1":
        onChange(block.id, "");
        break;
      case "quote":
        onChange(block.id, "");
        break;
      case "list":
        onChange(block.id, [""]);
        break;
      case "divider":
        onChange(block.id, []);
        break;
      default:
        break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (block.type === "list" && "items" in block) {
        const newItems = [...block.items, ""];
        onChange(block.id, newItems);
      } else {
        onAddBlock(block.id);
      }
    }
    if (e.key === "Backspace") {
      if (block.type === "paragraph" && block.content === "") {
        e.preventDefault();
        onDeleteBlock(block.id);
      }
    }
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      const ids = Object.keys(elementRefs).map(Number);
      const idx = ids.indexOf(block.id);
      const targetId = e.key === "ArrowUp" ? ids[idx - 1] : ids[idx + 1];
      if (targetId && elementRefs[targetId]) {
        e.preventDefault();
        elementRefs[targetId]?.focus();
      }
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLElement>) => {
    if (!initialBlock) return;
    let isUnchanged = false;
    if (
      "content" in block &&
      "content" in initialBlock &&
      block.content === initialBlock.content
    )
      isUnchanged = true;
    if (isUnchanged) {
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(e.target);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  };

  const createEditableProps = (id: number) => ({
    contentEditable: true,
    suppressContentEditableWarning: true,
    onKeyDown: handleKeyDown,
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      onChange(id, e.target.innerHTML);
      handleSlashCommand(e.target.innerText);
    },
    onFocus: handleFocus,
    ref: (el: HTMLElement | null) => setRef(id, el),
    "data-placeholder": getPlaceholderText(block),
  });
  // Save button handler
 

  const commonWrapper = (children: React.ReactNode) => (
    <div className="editor-block">
      <div className="drag-handle" {...dragHandleListeners}>
        <button className="drag-button">
          <Icon name="drag_indicator" className="drag-icon" />
        </button>
      </div>
      {children}
    </div>
  );

  switch (block.type) {
    case "paragraph":
      return commonWrapper(
        <div
          className="paragraph-block"
          {...createEditableProps(block.id)}
          dangerouslySetInnerHTML={{ __html: block.content }}
        />
      );
    case "heading":
      return commonWrapper(
        <h1
          className="heading-1"
          {...createEditableProps(block.id)}
          dangerouslySetInnerHTML={{ __html: block.content }}
        />
      );
    case "quote":
      return commonWrapper(
        <blockquote
          {...createEditableProps(block.id)}
          dangerouslySetInnerHTML={{ __html: block.content }}
        />
      );
    case "list":
      return commonWrapper(
        <ul className="bulleted-list">
          {block.items.map((item, i) => (
            <li
              key={i}
              contentEditable
              suppressContentEditableWarning
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const newItems = [...block.items];
                  newItems.splice(i + 1, 0, "");
                  onChange(block.id, newItems);
                }
              }}
              onBlur={(e) => {
                const newItems = [...block.items];
                newItems[i] = e.target.innerText;
                onChange(block.id, newItems);
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      );
    case "divider":
      return <hr className="block-divider" />;
    default:
      return null;
  }
};

// --- SORTABLE BLOCK ---
const SortableBlock = (
  props: Omit<React.ComponentProps<typeof EditorBlock>, "dragHandleListeners">
) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.block.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <EditorBlock {...props} dragHandleListeners={listeners} />
    </div>
  );
};

// --- MAIN CONTENT ---
// Save button handler
const handleSaveNote = () => {
  const titleInput = document.querySelector<HTMLInputElement>(".editor-title");
  const noteTitle = titleInput?.value || "Untitled Note";

  const noteData = {
    id: Date.now(),
    title: noteTitle,
    blocks: elementRefs ? Object.values(elementRefs).map(el => el?.innerHTML || "") : [],
    lastEdited: new Date().toISOString(),
  };

  // Save in localStorage
  const existingNotes = JSON.parse(localStorage.getItem("notes") || "[]");
  existingNotes.push(noteData);
  localStorage.setItem("notes", JSON.stringify(existingNotes));

  alert("Note saved successfully!");
};


const elementRefs: Record<number, HTMLElement | null> = {};
const MainContent = () => {
  const {
    state: blocks,
    setState: setBlocks,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistoryState<Block[]>(initialBlocks);
  const [focusId, setFocusId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (focusId !== null && elementRefs[focusId]) {
      elementRefs[focusId]?.focus();
      setFocusId(null);
    }
  }, [focusId, blocks]);

  const setRef = (id: number, element: HTMLElement | null) => {
    elementRefs[id] = element;
  };

  const handleBlockChange = (id: number, newContent: string | string[]) => {
    const updatedBlocks = blocks.map((b) => {
      if (b.id !== id) return b;
      if ("content" in b && typeof newContent === "string")
        return { ...b, content: newContent };
      if ("items" in b && Array.isArray(newContent))
        return { ...b, items: newContent };
      return b;
    });
    setBlocks(updatedBlocks);
  };

  const handleAddBlock = (currentBlockId: number) => {
    const newBlock: ParagraphBlock = {
      id: generateId(),
      type: "paragraph",
      content: "",
    };
    const currentIndex = blocks.findIndex((b) => b.id === currentBlockId);
    const newBlocks = [...blocks];
    newBlocks.splice(currentIndex + 1, 0, newBlock);
    setBlocks(newBlocks);
    setFocusId(newBlock.id);
  };

  const handleDeleteBlock = (id: number) => {
    if (blocks.length <= 1) return;
    const index = blocks.findIndex((b) => b.id === id);
    const newBlocks = blocks.filter((b) => b.id !== id);
    setBlocks(newBlocks);
    const prevBlock = newBlocks[index - 1];
    if (prevBlock) setFocusId(prevBlock.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <main className="main-content">
      <EditorHeader
        undo={undo}
        redo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        onSave={handleSaveNote}
      />
      <div className="editor-scroll-area">
        <div className="editor-container">
          <input
            className="editor-title"
            placeholder="Untitled Note"
            defaultValue=""
          />
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={blocks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="editor-body">
                {blocks.map((block) => (
                  <SortableBlock
                    key={block.id}
                    block={block}
                    onChange={handleBlockChange}
                    onAddBlock={handleAddBlock}
                    onDeleteBlock={handleDeleteBlock}
                    setRef={setRef}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </main>
  );
};

// --- RIGHT SIDEBAR & ROOT ---
const RightSidebar = () => (
  <aside className="right-sidebar">
    <h3 className="details-title">Details</h3>
    <p>Here you can show tags, created date, last modified, etc.</p>
  </aside>
);

const NotesEditor = () => (
  <div className="notes-editor-wrapper">
    <LeftSidebar />
    <MainContent />
    <RightSidebar />
  </div>
);

export default NotesEditor;
