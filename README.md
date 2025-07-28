# Note-taking app with AI-powered search and summarization

This project is a modern note-taking application built for a hackathon. It leverages AI to enhance the user experience by providing intelligent search and summarization capabilities.

## Features:

- **Effortless Note Creation:** Easily create and organize notes.
- **AI-Powered Search:** Find your notes quickly and efficiently using semantic search.
- **Automatic Summarization:** Get concise summaries of your notes to quickly grasp the main points.
- **User Authentication:** Securely store and access your notes with user accounts.
- **Responsive Design:** Access your notes from any device.

## Technologies Used:

- **Frontend:** React, TypeScript, Tailwind CSS, shadcn-ui
- **Backend:** Supabase (for database, authentication, and edge functions)
- **AI:** Supabase Edge Functions with the `generate-embedding` and `search-notes` functions for AI capabilities.
- **Development:** Vite

## Getting Started:

1. **Clone the repository:**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up Supabase:**
   - Create a Supabase project.
   - Configure authentication (e.g., email/password).
   - Set up the database schema (refer to `supabase/migrations` for table definitions).
   - Deploy the `generate-embedding` and `search-notes` edge functions (refer to `supabase/functions`).
   - Add your Supabase project URL and `anon` key to a `.env` file in the project root:
     ```env
     VITE_SUPABASE_URL=YOUR_SUPABASE_URL
     VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
     ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```

## Project Structure:

- `src/components`: Reusable React components.
- `src/hooks`: Custom React hooks.
- `src/lib`: Utility functions.
- `src/pages`: Application pages.
- `src/integrations/supabase`: Supabase client and type definitions.
- `supabase/migrations`: Database schema migrations.
- `supabase/functions`: Supabase Edge Functions for AI capabilities.

## How to Contribute:

We welcome contributions to this project! Please feel free to submit pull requests or open issues for bug fixes, new features, or improvements.

## License:

This project is licensed under the MIT License.

## Acknowledgments:

- Thanks to the Supabase team for their excellent platform and documentation.
- Thanks to the developers of React, TypeScript, Tailwind CSS, and shadcn-ui for their amazing tools.
