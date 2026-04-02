# Frontend Context

This document describes the **frontend architecture and UI domain model** of the desktop application.

The frontend is responsible for rendering the user interface and managing navigation and UI state.

Backend APIs will be implemented later. For now the focus is **UI structure and interaction logic**.

---

# Application Type

This is a **desktop application** built using:

* Tauri
* React
* React Router
* TypeScript

The UI is similar to productivity applications like Notion or Obsidian.

The application allows users to organize notes inside spaces and groups.

---

# Core Data Hierarchy

The UI represents the following hierarchy:

User
└ Space
└ Group
└ Note

Users navigate this hierarchy through the sidebar and main content panels.

---

# Application Layout

The application uses a **3 column layout**.

Left Sidebar
→ navigation for spaces and groups

Middle Panel
→ list of notes

Right Panel
→ note editor

Layout example:

Sidebar | Notes List | Editor

Components involved:

AppLayout
Sidebar
NoteList
EditorPanel

---

# Router Structure

Routing is handled using React Router.

Routes:

/
/login
/profile/:username

/app
/app/space/:spaceId
/app/space/:spaceId/group/:groupId
/app/note/:noteId

Explanation:

/app is the main application shell.

Space routes load groups.

Group routes load notes.

Note routes open the editor.

---

# Main Pages

The UI contains the following main pages:

LoginPage
ProfilePage
AppPage
SpacePage
GroupPage
NotePage

---

# Layout Components

The core layout components are:

AppLayout
Sidebar
MainContent
EditorPanel

Example structure:

AppLayout
├ Sidebar
│   ├ SpaceList
│   └ GroupList
│
├ MainContent
│   └ NoteList
│
└ EditorPanel
└ NoteEditor

---

# Sidebar

The sidebar shows navigation elements.

Sidebar sections:

Spaces
Groups of selected space

Example:

Spaces

* Personal
* Work
* AI Research

Groups

* LLM
* Agents
* Papers

Selecting a space loads its groups.

Selecting a group loads its notes.

---

# UI Components

Space Components

SpaceList
SpaceItem
CreateSpaceButton

Group Components

GroupList
GroupItem
CreateGroupButton

Note Components

NoteList
NoteItem
NoteEditor
CreateNoteButton

Sharing Components

ShareDialog
PermissionSelector

Profile Components

ProfileHeader
ProfileSpaces
ProfileGroups

---

# UI State Model

Frontend state represents the hierarchy.

Example state structure:

{
user: {},
spaces: [],
currentSpace: null,

groups: [],
currentGroup: null,

notes: [],
currentNote: null
}

For larger data sets, state should be normalized.

Example:

spacesById
groupsById
notesById

---

# Navigation Logic

Navigation behavior:

Selecting a Space

→ loads groups

Selecting a Group

→ loads notes

Selecting a Note

→ opens note editor

Changing space resets group and note selection.

Changing group resets note selection.

---

# Visibility

Spaces and groups support visibility options.

Visibility types:

public
private

Public items may appear on a user's profile page.

Private items are visible only to authorized users.

The UI should display visibility indicators.

---

# Sharing UI

Users can share:

Spaces
Groups

Roles available:

viewer
editor

Share dialog should support:

* searching users
* assigning roles
* removing access

---

# Note Editor

The editor allows users to:

* create notes
* edit note title
* edit note content
* update notes

Future features may include:

* markdown support
* rich text editing
* slash commands
* AI assistance

---

# Profile Page

Each user has a profile page.

The profile page displays:

User information
Public spaces
Public groups

---

# Interaction Rules

Important UI rules:

Selecting a space resets the selected group and note.

Selecting a group resets the selected note.

Editor is only visible when a note is selected.

---

# Future UI Features

Planned improvements:

AI search
Command palette
Keyboard navigation
Drag and drop organization
Real-time collaboration

---

# Guidelines For AI Agents

When generating frontend code:

Use functional React components.

Use React Router for navigation.

Keep components small and reusable.

Avoid deep component nesting.

Separate UI logic from data logic.

Follow a modular component structure.

---

# Design Goals

The interface should be:

Fast
Minimal
Keyboard friendly
Focused on writing and knowledge organization
