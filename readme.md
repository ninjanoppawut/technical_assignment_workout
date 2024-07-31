# Workout Planner

This project is designed to generate personalized workout plans based on user information. The system utilizes a Large Language Model (LLM) to create customized workout plans for users.

## How It Works

The project generates workout plans based on personal information provided by the user. The personal data is sent to the LLM (Large Language Model), which then creates a customized workout plan for the user to view.

## Setup

### Environment Variables

Create a `.env.local` file in the root directory of the project. This file should contain the following environment variables:

- `MONGODB_URI`: The URI for connecting to your MongoDB database.
- `AUTH_SECRET`: A secret key used for authentication.
- `OPENAI_API_KEY`: Your API key for accessing OpenAI services.

### Installation

1. Clone the repository:
   `git clone https://github.com/ninjanoppawut/technical_assignment_workout.git`

2. Navigate to the project directory:
   `cd technical_assignment_workout`
   `cd workout-plan-frontend`

3. Install the necessary packages:
   `npm install`

4. To run the project locally, use the following command:
   `npm run dev`
