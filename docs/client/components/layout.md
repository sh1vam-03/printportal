# Layout System 📐

**PrintPortal** uses a persistent layout wrapper to ensure navigation consistency across all pages.

## Layout (`Layout.jsx`)
The main wrapper component used in `ProtectedRoutes`.

**Responsibilities:**
1. **State Management**: Manages `isSidebarOpen` (desktop) and `isMobileOpen` (mobile) states.
2. **Structure**: Renders `Navbar` (top) and `Sidebar` (left).
3. **Responsive Logic**:
   - **Desktop**: Shifts content margin (`md:ml-64` vs `md:ml-20`) based on sidebar state.
   - **Mobile**: Content is full width; Sidebar acts as an overlay.

## Sidebar (`Sidebar.jsx`)
The primary navigation drawer.

**Features:**
- **Dynamic Links**: Renders different menu items based on `user.role` (Employee, Admin, Printing).
- **Responsive Modes**:
   - **Desktop**: Collapsible (expands/shrinks).
   - **Mobile**: Off-canvas drawer (slide-in).
- **Logout**: Includes logout functionality in the footer.

## Navbar (`Navbar.jsx`)
Top navigation bar.

**Features:**
- **Mobile Toggle**: Hamburger menu to open Sidebar on small screens.
- **User Info**: Displays current user role.
- **Logout**: Quick access logout button.
