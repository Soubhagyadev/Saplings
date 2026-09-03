import json
import os
import re
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types

load_dotenv()

app = FastAPI(title="Saplings API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)


class TreeRequest(BaseModel):
    sourceText: str


def make_id(title: str, position: int) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    return f"{slug or 'topic'}-{position}"


def normalize_node(node: dict[str, Any], position: int = 0) -> dict[str, Any]:
    title = str(node.get("title", "Untitled topic")).strip()
    raw_cards = node.get("flashcards", [])
    cards = [
        {"question": str(card.get("question", "")).strip(), "answer": str(card.get("answer", "")).strip()}
        for card in raw_cards if isinstance(card, dict) and card.get("question") and card.get("answer")
    ]
    raw_children = node.get("children", [])
    children = [normalize_node(child, index) for index, child in enumerate(raw_children) if isinstance(child, dict)]
    return {"id": make_id(title, position), "title": title, "flashcards": cards, "children": children}


@app.post("/api/generate-tree")
def generate_tree(request: TreeRequest) -> dict[str, Any]:
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GEMINI_API")
    if not api_key:
        raise HTTPException(500, "Missing GEMINI_API_KEY in .env")
    source = request.sourceText.strip()
    if len(source) < 100:
        raise HTTPException(400, "This PDF does not contain enough readable text.")

    prompt = """Create a concise study topic tree from the source text below.
Return JSON only, exactly matching this shape:
{
  "title": "Main subject",
  "flashcards": [{"question": "question", "answer": "short source-grounded answer"}],
  "children": [
    {"title": "Subtopic", "flashcards": [{"question": "question", "answer": "answer"}], "children": []}
  ]
}
Use 2-5 main branches, nested subtopics where useful, and 1-3 flashcards per meaningful node.
Do not invent facts not supported by the source.

SOURCE:
""" + source[:100000]

    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model="gemini-3.7-flash",
            contents=prompt,
            config=types.GenerateContentConfig(response_mime_type="application/json"),
        )
        generated = json.loads(response.text)
        if not isinstance(generated, dict):
            raise ValueError("The model did not return a topic object.")
        return {"tree": normalize_node(generated)}
    except Exception as error:
        raise HTTPException(502, f"Gemini generation failed: {error}") from error
