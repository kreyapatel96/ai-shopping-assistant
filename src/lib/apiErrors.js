// Turns a Gemini API error into a status/message pair that's honest about
// what actually happened, instead of a single generic "something went wrong".
export function describeAssistantError(error) {
  if (error?.status === 429) {
    return {
      status: 429,
      message:
        "The AI assistant has hit its usage limit for now (Gemini API quota). Please try again in a few minutes.",
    };
  }

  return {
    status: 500,
    message: "Sorry, I couldn't process that right now. Please try again.",
  };
}
