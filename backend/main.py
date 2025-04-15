from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
from pathlib import Path

app = FastAPI()

# Enable CORS to allow frontend apps to access this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to the dummy sales data
DATA_PATH = Path(__file__).parent / "dummyData.json"

# Load the dummy data from JSON file
def load_data():
    with open(DATA_PATH, "r") as f:
        return json.load(f)

# Define the request body schema for AI questions
class AIRequest(BaseModel):
    question: str

# AI assistant endpoint that handles natural language questions
@app.post("/api/ai")
def ai_response(request: AIRequest):
    question = request.question.lower()
    data = load_data()
    sales_reps = data["salesReps"]

    # Initialize variables for any found sales rep or client names
    mentioned_rep = None
    mentioned_client = None

    # Search for a sales rep or client mentioned in the question
    for rep in sales_reps:
        if rep["name"].lower() in question:
            mentioned_rep = rep
        for client in rep["clients"]:
            if client["name"].lower() in question:
                mentioned_client = client

    # Answer WHO-type questions
    if "who" in question:
        if mentioned_rep:
            return {"response": f"{mentioned_rep['name']} is a sales rep based in {mentioned_rep['region']}."}
        elif mentioned_client:
            return {"response": f"{mentioned_client['name']} is one of our clients from the {mentioned_client['industry']} industry."}
        else:
            return {"response": "Sorry, I couldn't identify who you're referring to."}

    # Answer WHAT-type questions
    elif "what" in question:
        if "deal" in question and mentioned_client:
            for rep in sales_reps:
                for deal in rep["deals"]:
                    if deal["client"].lower() == mentioned_client["name"].lower():
                        return {"response": f"The deal with {deal['client']} is currently {deal['status']} and valued at {deal['value']} USD."}
            return {"response": "No deal info found for that client."}
        elif mentioned_rep:
            return {"response": f"{mentioned_rep['name']} works as a {mentioned_rep['role']} in the {mentioned_rep['region']} region."}
        else:
            return {"response": "Could you clarify what you're asking about?"}

    # Answer WHERE-type questions
    elif "where" in question:
        if mentioned_rep:
            return {"response": f"{mentioned_rep['name']} works in the {mentioned_rep['region']} region."}
        else:
            return {"response": "Sorry, I couldn't find who you're asking about."}

    # Answer WHEN-type questions by looking for deals associated with clients
    elif "when" in question:
        normalized_question = question.lower()

        if mentioned_client:
            for rep in sales_reps:
                for deal in rep["deals"]:
                    if deal["client"].lower() == mentioned_client["name"].lower():
                        return {
                            "response": f"The deal with {deal['client']} is currently {deal['status']} and valued at {deal['value']} USD."
                        }

        # Fallback to match client names directly from deals
        for rep in sales_reps:
            for deal in rep["deals"]:
                if deal["client"].lower() in normalized_question:
                    return {
                        "response": f"The deal with {deal['client']} is currently {deal['status']} and valued at {deal['value']} USD."
                    }

        return {
            "response": "Sorry, I couldn't find timing details for that deal."
        }

    # Answer WHY-type questions about deal status
    elif "why" in question:
        if mentioned_client:
            for rep in sales_reps:
                for deal in rep["deals"]:
                    if deal["client"].lower() == mentioned_client["name"].lower():
                        return {"response": f"The deal with {deal['client']} is {deal['status']} most likely due to business negotiations or strategic alignment."}
            return {"response": "No reason found for that deal."}
        else:
            return {"response": "Could you clarify why you're asking about something?"}

    # Answer HOW-type questions describing how a deal was closed
    elif "how" in question:
        if mentioned_client:
            for rep in sales_reps:
                for deal in rep["deals"]:
                    if deal["client"].lower() == mentioned_client["name"].lower():
                        return {"response": f"The deal with {deal['client']} was successfully handled by {rep['name']} through effective communication and relationship management."}
            return {"response": "Sorry, I couldn't find how the deal happened."}
        else:
            return {"response": "Please mention a client or deal to explain how it was handled."}

    # Fallback response if no question type matches
    return {"response": "I'm not sure how to answer that question. Try rephrasing it or include more details."}

# Endpoint to return all sales reps with parsed deals and client details
@app.get("/api/sales-reps")
def get_sales_reps():
    data = load_data()
    sales_reps = data["salesReps"]

    parsed_data = []

    for rep in sales_reps:
        parsed_rep = {
            "sales_rep": rep["name"],
            "role": rep["role"],
            "region": rep["region"],
            "deals": []
        }

        # Gather deal info and attach related client details
        for deal in rep["deals"]:
            client_info = next(
                (client for client in rep["clients"] if client["name"] == deal["client"]),
                None
            )

            if client_info:
                parsed_deal = {
                    "title": f"Deal with {deal['client']}",
                    "status": deal["status"],
                    "amount": deal["value"],
                    "client": {
                        "name": client_info["name"],
                        "industry": client_info["industry"],
                        "contact": client_info["contact"]
                    }
                }
                parsed_rep["deals"].append(parsed_deal)

        parsed_data.append(parsed_rep)

    return parsed_data
