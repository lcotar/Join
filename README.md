<p align="center">
  <img src="assets/img/logo_dark.png" alt="Join Logo" width="160">
</p>

<h1 align="center">Join</h1>

<p align="center">
  A Kanban-style task management tool inspired by Trello, built with vanilla HTML, CSS and JavaScript.
</p>

<p align="center">
  <a href="https://join.leacotar.com/"><strong>Live Demo »</strong></a>
</p>

---

## About

Join lets you organize tasks on a drag-and-drop Kanban board, manage contacts, and keep track of deadlines and priorities from a summary dashboard. It was built as a team capstone project during the Developer Akademie web development bootcamp, with a Firebase Realtime Database as the backend.

## Features

- **Login & Sign-up** with a guest login option
- **Kanban board** with drag-and-drop task cards across To-do, In Progress, Await Feedback and Done
- **Task management** — create and edit tasks with title, description, due date, category, priority (urgent/medium/low) and subtasks
- **Assignees** — assign one or more contacts to a task
- **Contacts** — add, edit and delete contacts, grouped alphabetically
- **Summary dashboard** — overview of task counts per status, urgent tasks and the next upcoming deadline
- **Responsive design** for desktop and mobile
- **Persistent data** via Firebase Realtime Database

## Tech Stack

- HTML5 / CSS3
- Vanilla JavaScript (no framework)
- Firebase Realtime Database (REST API)

## Getting Started

This project has no build step or dependencies — it runs as static files.

1. Clone the repository
   ```bash
   git clone https://github.com/johannesngl/join.git
   cd join
   ```
2. Open `index.html` in your browser, or serve the folder with a local web server (recommended, e.g. the VS Code "Live Server" extension) so relative fetch requests work correctly.
3. Data is stored in a Firebase Realtime Database. To use your own database, replace the `BASE_URL` values in `scripts/storage.js` and `scripts/add-task.js` with your own Firebase project URL.

## Project Structure

```
join/
├── index.html            # Login
├── signup.html           # Sign-up
├── summary.html          # Dashboard overview
├── board.html            # Kanban board
├── add-task.html         # Create a task
├── contacts.html / edit-contact.html
├── legal.html / privacy.html
├── scripts/              # App logic (board, contacts, storage, rendering, ...)
├── style/                # Stylesheets per page
└── assets/                # Images, icons and fonts
```

## Team

This project was built by:

- [Johannes Singl](https://github.com/johannesngl)
- [Lea Cotar](https://github.com/lcotar)
- Frank Kessler
- Lukasz Barszczewski

## License

This project was created for educational purposes as part of the Developer Akademie bootcamp.
