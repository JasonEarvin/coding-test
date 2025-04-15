// API route handler for AI feature (mocked for now)
export default function handler(req, res) {
  // Check if the request method is POST; if not, return an error response
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });  // 405: Method Not Allowed
  }

  // Destructure the 'question' from the request body
  const { question } = req.body;

  // If the question is not provided, return a bad request response
  if (!question) {
    return res.status(400).json({ message: 'Question is required' });  // 400: Bad Request
  }

  // Default mock response for any questions not specifically handled
  let response = "Hmm... I'm not sure how to answer that.";

  // Normalize the question to lowercase for case-insensitive comparison
  const q = question.toLowerCase();

  // Basic rule-based AI mock logic (for demonstration purposes)
  // If the question contains specific keywords, return pre-defined responses
  if (q.includes('best sales rep')) {
    response = "Based on the data, Alice seems to be the top sales rep.";
  } else if (q.includes('closed deals')) {
    response = "Check the dashboard to see all closed deals by each rep.";
  } else if (q.includes('region')) {
    response = "The regions covered include North America, Europe, Asia-Pacific, South America, and the Middle East.";
  }

  // Return the response as a JSON object to the frontend
  res.status(200).json({ response });  // 200: OK, with the response
}
