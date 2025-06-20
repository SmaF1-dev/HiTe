# HiTe
HiTe - platform with unusual interactive Historical Tests

### Navigation

- [ ] [Front-End](front-end)
- [ ] [Server](server)

## Technologies and tools
- Git — version control system
- GitHub — repository hosting platform
- Markdown — markup language for documentation design

### Front-End:
  - Next.js — React-based framework for developing client-server (fullstack) applications for both mobile platforms and the web
  - HTML — hypertext markup language
  - CSS — markup language used for the visual design of websites

### Back-End:
- Python — high-level programming language
- FastAPI — web framework for creating an API written in Python
- PostgreSQL — high-performance open source object-relational database management system

## Launch Instructions
1. Cloning the repository:
  ```rb
  git clone https://github.com/SmaF1-dev/HiTe.git
  ```
2. Select the directory with the client part:
  ```
  cd HiTe/front-end
  ```
## Project structure
- `front-end/` — the client part of the platform
- `server/` — actual version of the server

## Project launch
### To run the client side:
1. Select the directory with the client part:
  ```
  cd front-end
  ```
2. Install the dependencies:
  ```
  npm install
  ```
3. Build the app:
  ```
  npm run build
  # or
  yarn build
  ```
4. Run npm-server:
  ```
  yarn dev
  ```
or
  ```
  npm run dev
  ```
### To run the server side:
1. Select the directory with the client part:
  ```
  cd server
  ```
2. Run FastAPI-server:
  ```
  uvicorn main:app --reload
  ```
