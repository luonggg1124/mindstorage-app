# TipTap Rich Text Editor

Một rich text editor hoàn chỉnh được xây dựng với TipTap và React, hỗ trợ đầy đủ các tính năng formatting.

## Tính năng

### Text Formatting

- **Bold** - Làm đậm văn bản
- **Italic** - Làm nghiêng văn bản
- **Underline** - Gạch chân văn bản
- **Strikethrough** - Gạch ngang văn bản
- **Code** - Định dạng code inline

### Headings

- Hỗ trợ 6 cấp độ heading (H1-H6)
- Tự động styling với Tailwind CSS

### Lists

- **Bullet List** - Danh sách có dấu chấm
- **Ordered List** - Danh sách có số thứ tự
- **Task List** - Danh sách công việc với checkbox

### Text Alignment

- Left, Center, Right, Justify
- Hoạt động với headings và paragraphs

### Tables

- Tạo bảng với header row
- Thêm/xóa cột và hàng
- Resizable columns
- Full table controls khi đang edit

### Links & Media

- **Links** - Thêm và xóa links
- **Images** - Chèn hình ảnh từ URL
- **Horizontal Rules** - Đường kẻ ngang

### Block Elements

- **Blockquotes** - Trích dẫn
- **Code Blocks** - Khối code với syntax highlighting
- **Horizontal Rules** - Đường phân cách

### Advanced Features

- **Subscript/Superscript** - Chỉ số trên/dưới
- **Text Highlighting** - Highlight với nhiều màu sắc
- **Undo/Redo** - Hoàn tác/làm lại
- **Character Count** - Đếm ký tự và từ
- **Placeholder** - Text placeholder tùy chỉnh

## Cách sử dụng

```tsx
import Editor from "@/Components/custom/editor";

const MyComponent = () => {
  const [content, setContent] = useState("");

  return (
    <Editor
      content={content}
      onChange={setContent}
      placeholder="Bắt đầu viết nội dung..."
      className="min-h-[400px]"
    />
  );
};
```

## Props

| Prop          | Type                        | Default                        | Description                    |
| ------------- | --------------------------- | ------------------------------ | ------------------------------ |
| `content`     | `string`                    | `""`                           | Nội dung HTML của editor       |
| `onChange`    | `(content: string) => void` | -                              | Callback khi nội dung thay đổi |
| `placeholder` | `string`                    | `"Enter your content here..."` | Placeholder text               |
| `className`   | `string`                    | `""`                           | CSS classes bổ sung            |

## Extensions được sử dụng

- **StarterKit** - Các extension cơ bản
- **Underline** - Gạch chân
- **Highlight** - Highlight text với màu sắc
- **Link** - Links
- **Image** - Hình ảnh
- **HorizontalRule** - Đường kẻ ngang
- **Placeholder** - Placeholder text
- **Typography** - Typography improvements
- **CharacterCount** - Đếm ký tự
- **HardBreak** - Line breaks
- **Color** - Text color
- **TextStyle** - Text styling
- **TextAlign** - Text alignment
- **Subscript/Superscript** - Chỉ số trên/dưới
- **Table** - Bảng với controls
- **TaskList/TaskItem** - Task lists
- **Dropcursor** - Drop cursor
- **Gapcursor** - Gap cursor
- **Focus** - Focus management

## Styling

Editor sử dụng Tailwind CSS với các class tùy chỉnh:

- `.tiptap` - Container chính
- `.tiptap h1-h6` - Headings
- `.tiptap p` - Paragraphs
- `.tiptap ul/ol` - Lists
- `.tiptap blockquote` - Blockquotes
- `.tiptap pre/code` - Code blocks
- `.tiptap table` - Tables
- `.tiptap mark[data-color]` - Highlight colors

## Keyboard Shortcuts

- `Ctrl+B` - Bold
- `Ctrl+I` - Italic
- `Ctrl+U` - Underline
- `Ctrl+K` - Link
- `Ctrl+Z` - Undo
- `Ctrl+Y` - Redo
- `Enter` - New paragraph
- `Shift+Enter` - Line break

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (basic support)

## Dependencies

```json
{
  "@tiptap/core": "^3.0.7",
  "@tiptap/react": "^3.0.7",
  "@tiptap/starter-kit": "^3.0.7",
  "@tiptap/extension-underline": "^3.0.7",
  "@tiptap/extension-highlight": "^3.0.7",
  "@tiptap/extension-link": "^3.0.7",
  "@tiptap/extension-image": "^3.0.7",
  "@tiptap/extension-horizontal-rule": "^3.0.7",
  "@tiptap/extension-placeholder": "^3.0.7",
  "@tiptap/extension-typography": "^3.0.7",
  "@tiptap/extension-character-count": "^3.0.7",
  "@tiptap/extension-color": "^3.0.7",
  "@tiptap/extension-text-style": "^3.0.7",
  "@tiptap/extension-text-align": "^3.0.7",
  "@tiptap/extension-subscript": "^3.0.7",
  "@tiptap/extension-superscript": "^3.0.7",
  "@tiptap/extension-table": "^3.0.7",
  "@tiptap/extension-task-list": "^3.0.7",
  "@tiptap/extension-task-item": "^3.0.7",
  "@tiptap/extension-dropcursor": "^3.0.7",
  "@tiptap/extension-gapcursor": "^3.0.7",
  "@tiptap/extension-focus": "^3.0.7"
}
```
