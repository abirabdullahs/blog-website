'use client';

import { type Editor } from '@tiptap/react';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Youtube as YoutubeIcon,
  Table as TableIcon,
  Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolbarProps {
  editor: Editor | null;
}

const Toolbar = ({ editor }: ToolbarProps) => {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addYoutubeVideo = () => {
    const url = window.prompt('Enter YouTube URL');
    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 480,
      });
    }
  };

  const setLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-[#FDFCFB] border border-black border-b-0 sticky top-0 z-10">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn("p-2 hover:bg-black/5 transition-colors", editor.isActive('bold') && "bg-black text-white")}
      >
        <Bold size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn("p-2 hover:bg-black/5 transition-colors", editor.isActive('italic') && "bg-black text-white")}
      >
        <Italic size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={cn("p-2 hover:bg-black/5 transition-colors", editor.isActive('underline') && "bg-black text-white")}
      >
        <UnderlineIcon size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={cn("p-2 hover:bg-black/5 transition-colors", editor.isActive('codeBlock') && "bg-black text-white")}
      >
        <Code size={16} />
      </button>

      <div className="w-[1px] bg-black/10 mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={cn("p-2 hover:bg-black/5 transition-colors", editor.isActive('heading', { level: 1 }) && "bg-black text-white")}
      >
        <Heading1 size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn("p-2 hover:bg-black/5 transition-colors", editor.isActive('heading', { level: 2 }) && "bg-black text-white")}
      >
        <Heading2 size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={cn("p-2 hover:bg-black/5 transition-colors", editor.isActive('heading', { level: 3 }) && "bg-black text-white")}
      >
        <Heading3 size={16} />
      </button>

      <div className="w-[1px] bg-black/10 mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn("p-2 hover:bg-black/5 transition-colors", editor.isActive('bulletList') && "bg-black text-white")}
      >
        <List size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn("p-2 hover:bg-black/5 transition-colors", editor.isActive('orderedList') && "bg-black text-white")}
      >
        <ListOrdered size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={cn("p-2 hover:bg-black/5 transition-colors", editor.isActive('blockquote') && "bg-black text-white")}
      >
        <Quote size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="p-2 hover:bg-black/5 transition-colors"
      >
        <Minus size={16} />
      </button>

      <div className="w-[1px] bg-black/10 mx-1" />

      <button onClick={addImage} className="p-2 hover:bg-black/5 transition-colors">
        <ImageIcon size={16} />
      </button>
      <button onClick={setLink} className={cn("p-2 hover:bg-black/5 transition-colors", editor.isActive('link') && "bg-black text-white")}>
        <LinkIcon size={16} />
      </button>
      <button onClick={addYoutubeVideo} className="p-2 hover:bg-black/5 transition-colors">
        <YoutubeIcon size={16} />
      </button>
      <button 
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        className="p-2 hover:bg-black/5 transition-colors"
      >
        <TableIcon size={16} />
      </button>

      <div className="w-[1px] bg-black/10 mx-1 flex-grow" />

      <button
        onClick={() => editor.chain().focus().undo().run()}
        className="p-2 hover:bg-black/5 transition-colors"
      >
        <Undo size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        className="p-2 hover:bg-black/5 transition-colors"
      >
        <Redo size={16} />
      </button>
    </div>
  );
};

export default Toolbar;
