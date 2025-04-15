// Importing the useState hook from React to manage local component state
import { useState } from 'react';

export default function AiPage() {
  // State variables for managing the question input, AI response, loading state, and errors
  const [question, setQuestion] = useState('');   // Stores the current question input by the user
  const [answer, setAnswer] = useState('');       // Stores the AI's response to the question
  const [loading, setLoading] = useState(false);  // Boolean to track if the AI response is being processed
  const [error, setError] = useState('');         // Stores any error message in case the request fails

  // Function to handle form submission when the user asks a question
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    setLoading(true);   // Sets loading to true to show the "Thinking..." button
    setAnswer('');      // Clears previous answer
    setError('');       // Clears any previous errors

    try {
      // Sending the user's question to the AI API using a POST request
      const res = await fetch('http://localhost:8000/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  // Setting the content type to JSON
        },
        body: JSON.stringify({ question }),    // Sending the question in the request body
      });

      // If the response is not OK (error status), throw an error
      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }

      // Parse the JSON response from the AI API and set the answer state with the response
      const data = await res.json();
      setAnswer(data.response);
    } catch (err) {
      // In case of an error, set an error message and log the error to the console
      setError('Failed to get AI response.');
      console.error(err);
    } finally {
      // Set loading to false once the request is complete, whether successful or not
      setLoading(false);
    }
  };

  return (
    <div className="ai-page">
      <div className="ai-container">
        <h1 className="ai-title">Ask the AI About the Sales</h1>

        {/* Displaying example questions for the user to try */}
        <div className="example-questions">
          <h3>Try asking questions like:</h3>
          <ul>
            <li>Who is Alice?</li>
            <li>Where is sales rep Bob?</li>
          </ul>
        </div>

        {/* Form for submitting the user's question */}
        <form onSubmit={handleSubmit} className="ai-form">
          <input
            type="text"
            placeholder="Ask a question..."  // Placeholder text in the input field
            value={question}                // Value is bound to the question state
            onChange={(e) => setQuestion(e.target.value)}  // Updates the question state as user types
            className="ai-input"
            required   // Makes the input field required to submit the form
          />
          <button type="submit" disabled={loading} className="ai-button">
            {loading ? 'Thinking...' : 'Ask'}  {/* Show "Thinking..." while loading */}
          </button>
        </form>

        {/* If there's an error, display the error message */}
        {error && <p className="ai-error">{error}</p>}

        {/* If there's an answer, display it */}
        {answer && (
          <div className="ai-response">
            <strong>AI says:</strong>
            <p>{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
