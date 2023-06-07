# VIDEO STREAMING - API (Express.js + TypeORM + Fluent ffmpeg)

**About:** Backend API of the video streaming website demo. Built using Express.js, Typescript, TypeORM (PostgreSQL), fluent-ffmpeg.

**_Check frontend UI: [https://github.com/remankader/video-streaming-ui](https://github.com/remankader/video-streaming-ui)_**

**Features:**

- Video upload with _title_, _category_ and optional _about_ fields.
- Auto conversion to streaming friendly video using [Fluent ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg).
- Homepage with category sections.
- Single page layout for each category.
- Search functionality.
- Video page with highly customizable [ReactPlayer](https://github.com/CookPete/react-player).
- Responsive design using [Tailwind CSS](https://tailwindcss.com/docs/overflow).

## Screenshots

### Desktop

| | | |
|:-:|:-:|:-:|
| <img width="1920" alt="Home Page" src="./doc/media/image/d-home.jpg"> | <img width="1920" alt="Single Page" src="./doc/media/image/d-single.jpg"> | <img width="1920" alt="Player Page" src="./doc/media/image/d-player.jpg"> |
| Home Page | Single Page | Player Page |

| | | |
|:-:|:-:|:-:|
| <img width="1920" alt="Upload Page" src="./doc/media/image/d-upload.jpg"> | <img width="1920" alt="Redirect on Upload Success" src="./doc/media/image/d-upload-success.jpg"> | <img width="1920" alt="Search Page" src="./doc/media/image/d-search.jpg"> |
| Upload Page | Upload Success | Search Page |

### Mobile

| | | | | | |
|:-:|:-:|:-:|:-:|:-:|:-:|
| <img width="500" alt="Home Page" src="./doc/media/image/m-home.jpg"> | <img width="500" alt="Single Page" src="./doc/media/image/m-single.jpg"> | <img width="500" alt="Player Page" src="./doc/media/image/m-player.jpg"> | <img width="500" alt="Upload Page" src="./doc/media/image/m-upload.jpg"> | <img width="500" alt="Upload Success" src="./doc/media/image/m-upload-success.jpg"> | <img width="500" alt="Search Page" src="./doc/media/image/m-search.jpg"> |
| Home Page | Single Page | Player Page | Upload Page | Upload Success | Search Page |

## Start Development Server

- **Step 1:** On root directory make a copy of **.env.example** and rename it to **.env**

- **Step 2:** Set/update values in **.env**

- **Step 3:** Install dependency packages by running:

```bash
npm install
# or
yarn install
```

- **Step 4:** Start development server by running:

```bash
npm run dev
# or
yarn dev
```

- **Step 5:** By default you can make api calls to [http://localhost:8000](http://localhost:8000)

## Migration

- **Generate:** Generate migration file/files if needed by running:

_( **Note:** A generated migration file already available in **./src/migrations/** directory. Only run this command if new changes have been made to **./src/entities/** directory )_

```bash
npm run migration:generate --name=file_name_here
```

- **Run:** Now run migration by running:

_( **Note:** Make sure there is an empty database with the name specified in the **.env** file. PostgreSQL was chosen for this demo )_

```bash
npm run migration:run
```

**_[ Built on Node v18.15.0 ]_**
