# Text-to-Speech (TTS) API

A lightweight, secure, and production-ready Express & TypeScript API designed to convert text into high-quality speech audio files using the Microsoft Edge Neural TTS engine. It splits long texts semantically into parallel chunks and streams them back combined as a single audio file.

![API Playground Screenshot](./public/image.png)

---

## 🚀 Features

- **Text-to-Speech Conversion:** Converts any string of text into a downloadable `.mp3` audio stream.
- **Smart Text Chunking:** Semantically splits long paragraphs into chunks of under 2000 characters to optimize phrasing context and comply with Edge TTS limits, preserving natural sentence/word transitions.
- **Parallel Chunk Fetching:** Processes and downloads text chunks in parallel for ultra-fast response times.
- **API Key Security:** Protects routes using flexible authorization headers, bearer tokens, or query keys.
- **TypeScript First:** Reorganized, fully typed, and structured codebase.
- **Production-ready Testing:** Integrated with Jest, ts-jest, and Supertest for unit and integration testing.
- **Vercel Serverless Ready:** Deploy directly to Vercel without manual compilation.

---

## 📂 Project Architecture

```
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI pipeline
├── src/
│   ├── middlewares/
│   │   └── auth.ts            # API Key authentication middleware
│   ├── controllers/
│   │   └── ttsController.ts   # TTS generation & stream merging logic
│   ├── routes/
│   │   └── ttsRoutes.ts       # Route endpoints mapping
│   ├── utils/
│   │   └── textSplitter.ts    # Semantic text splitting utility
│   ├── app.ts                 # Express application instantiation
│   └── server.ts              # Local listener server entry point
├── tests/
│   ├── auth.test.ts           # Authentication tests
│   ├── textSplitter.test.ts   # Splitting logic unit tests
│   └── tts.test.ts            # Endpoint integration tests
├── .env.example               # Configuration example
├── tsconfig.json              # TypeScript compilation parameters
├── vercel.json                # Vercel Serverless routing config
└── README.md                  # Project documentation
```

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (version 18 or 20 recommended)
- `pnpm` (or `npm`/`yarn` equivalent)

### Installation & Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/text-to-speech-api.git
   cd text-to-speech-api
   ```

2. **Install Dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure Environment:**
   Create a `.env` file using the template:
   ```bash
   cp .env.example .env
   ```
   Modify `.env` and set your secret API Key:
   ```env
   API_KEY=your_secret_api_key_here
   PORT=3000
   ```

4. **Run the Development Server:**
   ```bash
   pnpm dev
   ```
   The local server will start at `http://localhost:3000`.

---

## 📖 API Reference

All requests must be authenticated. The API key can be supplied in one of three ways:
1. Custom header: `x-api-key: your_secret_api_key_here`
2. Authorization header: `Authorization: Bearer your_secret_api_key_here`
3. Query Parameter: `?key=your_secret_api_key_here`

---

### Get Speech (GET Request)

Ideal for embedding directly in `<audio>` HTML elements.

- **URL:** `/api/tts`
- **Method:** `GET`
- **Query Parameters:**
  - `key` (Required): Your API Key.
  - `text` (Required): The text content you want to convert.
  - `lang` (Optional): Target language code (default: `vi` for Vietnamese. Supports `en`, `ja`, `ko`, `fr`, etc.).

**Example HTML Integration:**
```html
<audio controls>
  <source src="http://localhost:3000/api/tts?key=your_secret_api_key_here&text=Hello+World&lang=en" type="audio/mpeg">
</audio>
```

---

### Get Speech (POST Request)

Ideal for API calls from backends or frontend applications sending large blocks of text.

- **URL:** `/api/tts`
- **Method:** `POST`
- **Headers:**
  - `Content-Type: application/json`
  - `x-api-key: your_secret_api_key_here`
- **Request Body (JSON):**
  ```json
  {
    "text": "This is a longer text that will be converted into speech audio.",
    "lang": "en"
  }
  ```

- **Success Response:**
  - **Status:** `200 OK`
  - **Content-Type:** `audio/mpeg`
  - **Headers:** `Content-Disposition: attachment; filename="speech.mp3"`
  - **Body:** Binary audio stream (MP3 format).

---

## 🧪 Testing

The repository includes a comprehensive unit and integration test suite configured with Jest.

- **Run all tests:**
  ```bash
  pnpm test
  ```

- **Run tests in watch mode:**
  ```bash
  pnpm test -- --watch
  ```

- **Run tests with coverage:**
  ```bash
  pnpm test:cov
  ```

---

## 🚀 Deployment

### Deploy to Vercel

The project is pre-configured to deploy seamlessly to Vercel as a Serverless function.

1. Install the Vercel CLI (`npm install -g vercel`) or connect the repo to the Vercel Dashboard.
2. Run the deployment:
   ```bash
   vercel
   ```
3. Add the `API_KEY` Environment Variable in your Vercel Dashboard project settings.

### Docker / Production Server

To compile the TypeScript code and run the node bundle manually:

```bash
pnpm build
pnpm start
```
The compiled code will be output to `/dist/` and runs the production node server.