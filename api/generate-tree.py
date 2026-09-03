import json
import os
import re
from http.server import BaseHTTPRequestHandler
from typing import Any

from google import genai
from google.genai import types


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


def generate(source_text: str) -> dict[str, Any]:
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GEMINI_API")
    if not api_key:
        raise ValueError("Missing GEMINI_API_KEY environment variable")

    source = source_text.strip()
    if len(source) < 100:
        raise ValueError("This PDF does not contain enough readable text.")

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


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        cors_headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Content-Type": "application/json",
        }

        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length)

        try:
            data = json.loads(body)
            source_text = data.get("sourceText", "")
            result = generate(source_text)
            self.send_response(200)
            for k, v in cors_headers.items():
                self.send_header(k, v)
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
        except ValueError as e:
            self.send_response(400)
            for k, v in cors_headers.items():
                self.send_header(k, v)
            self.end_headers()
            self.wfile.write(json.dumps({"detail": str(e)}).encode())
        except Exception as e:
            self.send_response(502)
            for k, v in cors_headers.items():
                self.send_header(k, v)
            self.end_headers()
            self.wfile.write(json.dumps({"detail": f"Gemini generation failed: {e}"}).encode())

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
