# UI Components 🎨

Located in `src/components/ui`, these components are the foundational building blocks of the application. They are atomic, stateless, and styled with Tailwind CSS.

## `Button.jsx`
Standard interactive element with support for variants and loading states.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `string` | `'primary'` | Visual style: `primary`, `secondary`, `danger`, `success`. |
| `size` | `string` | `'md'` | Size preset: `sm`, `md`, `lg`. |
| `disabled` | `boolean` | `false` | If true, disables interaction and fades opacity. |
| `onClick` | `func` | - | Click handler. |

---

## `Card.jsx`
A polished container for grouping content. Handles responsive header alignment automatically.

| Prop | Type | Description |
|------|------|-------------|
| `title` | `node` | Header text or element. |
| `action` | `node` | Optional element to render on the right side (e.g., Button). |
| `children` | `node` | Body content. |
| `className` | `string` | Additional CSS classes. |

> **Responsive Note**: On mobile, the header elements stack vertically. On desktop, they align horizontally.

---

## `Input.jsx`
Form input wrapper with built-in label and error handling.

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Text label displayed above input. |
| `error` | `string` | Error message displayed in red below input. |
| `...props` | `any` | Standard HTML input attributes. |

---

## `Modal.jsx`
Overlay dialog for focused tasks. Features a backdrop blur and click-outside dismissal.

| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Controls visibility. |
| `onClose` | `func` | Callback when modal should close. |
| `title` | `string` | Header title of the modal. |

