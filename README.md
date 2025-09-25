# 🗂️ EpiTrello

EpiTrello is a simplified Trello-like project management application.  
It allows users to create **boards**, organize them into **lists**, and manage **cards** representing tasks.  
Cards can be moved across lists to reflect progress, following the Kanban methodology.

---

## 🎯 Project Goals
Trello is widely used for organizing projects visually.  
The goal of EpiTrello is to **rebuild the core features of Trello** to demonstrate full-stack skills:
- Board → List → Card hierarchy
- CRUD operations for tasks
- Drag & drop interactions
- Authentication & collaboration
- Realtime updates

---

## 🛠️ Tech Stack

| Layer        | Technology         | Role |
|--------------|--------------------|------|
| Frontend     | **React + Vite**   | UI, drag & drop boards/lists/cards |
| Styling      | **TailwindCSS**    | Responsive and modern design |
| Backend      | **Node.js + Express** | REST API for boards/lists/cards |
| Database     | **PostgreSQL**     | Persistent storage of users, boards, lists, cards |
| ORM          | **Prisma**         | Easier database management & migrations |
| Auth         | **JWT**            | Secure login / user sessions |
| Realtime     | **Socket.IO** (later step) | Live updates for multiple users |
| CI/CD        | **GitHub Actions** | Automatic testing and build checks |

---

## 📅 Roadmap

| Step | Milestone | Goal |
|------|-----------|------|
| 0 | Organisation | stack, roadmap, backlog |
| 1 | Project skeleton | Frontend + backend init, database setup |
| 2 | Boards CRUD | Create, list, delete boards |
| 3 | Lists CRUD | Lists inside boards |
| 4 | Cards CRUD | Cards inside lists |
| 5 | Drag & Drop | Move cards across lists |
| 6 | Users & Auth | Register/login, secure routes |
| 7 | Collaboration | Assign users, comments |
| 8 | Realtime | Live board updates |
| 9 | UI Polish | Responsive, clean design |
| 10 | Stretch | Labels, due dates, search |
| 11 | Finalization | Docs, tests, demo |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (>= 18)  
- npm (>= 9)  
- PostgreSQL (>= 14)

``` bash
# Install Node.js and npm
sudo apt update
sudo apt install nodejs npm

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib
```

### Installation
Clone the repo:
```bash
git clone https://github.com/KyllianChandelier/epi-trello.git
cd epi-trello

# future integration with docker-compose
```
## 👤 Author
[Kyllian Chandelier](https://github.com/KyllianChandelier)

Epitech - B-PRO-500 Professional Work
