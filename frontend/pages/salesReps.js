import { useEffect, useState } from "react";

const SalesReps = () => {
  // State to hold the list of sales reps fetched from the API
  const [salesReps, setSalesReps] = useState([]);

  // useEffect hook to fetch sales rep data from the API when the component is mounted
  useEffect(() => {
    // Async function to fetch the sales rep data
    const fetchData = async () => {
      const response = await fetch("http://127.0.0.1:8000/api/sales-reps"); // Fetch data from the sales reps API
      const data = await response.json();  // Parse the response as JSON
      setSalesReps(data);  // Set the fetched data to the salesReps state
    };
    fetchData(); // Call the fetchData function
  }, []);  // Empty dependency array means this effect runs only once after the initial render

  return (
    <div className="sales-reps-section">
      {/* If there are sales reps data, map over the array and display each rep's info */}
      {salesReps.length > 0 ? (
        salesReps.map((rep) => (
          <div key={rep.sales_rep} className="sales-rep-card">
            {/* Display the sales rep's name, role, and region */}
            <h2>{rep.sales_rep}</h2>
            <h3>{rep.role} - {rep.region}</h3>
            <div>
              {/* Display the deals associated with the current sales rep */}
              <h4>Deals:</h4>
              <ul>
                {/* Map over the deals of the current sales rep and display each deal */}
                {rep.deals.map((deal, index) => (
                  <li key={index}>
                    {/* Display deal details such as title, status, amount */}
                    <h5>{deal.title}</h5>
                    <p>Status: {deal.status}</p>
                    <p>Amount: ${deal.amount}</p>
                    <p>Client Info:</p>
                    <ul>
                      {/* Display detailed client info related to the deal */}
                      <li>Name: {deal.client.name}</li>
                      <li>Industry: {deal.client.industry}</li>
                      <li>Contact: {deal.client.contact}</li>
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      ) : (
        // If no sales reps data is available, display a loading message
        <p>Loading sales data...</p>
      )}
    </div>
  );
};

export default SalesReps;
