import logging
from ai_workflow.services.llm_service import llm_service
from ai_workflow.schemas.extractor import VoiceExtractionOutput

logger = logging.getLogger("TableTalk.ExtractorAgent")

EXTRACTOR_SYSTEM_PROMPT = """
You are an AI assistant for a feedback system. Your task is to extract structured details from a user's spoken voice transcript.
The transcript may contain their name, whether they are a first-time or returning visitor, items/services they ordered, and their actual feedback.
Your goal is to parse this out cleanly.
- If no name is mentioned, return "Anonymous".
- If no visitor status is mentioned, return "first-time".
- `ordered_items` should be a list of distinct dishes/services.
- `cleaned_review_text` should be the actual feedback portion of the text, removing things like "Hi my name is X". Keep the exact meaning and tone of the feedback.
"""

class ReviewExtractorAgent:
    async def extract_voice_transcript(self, transcript: str) -> VoiceExtractionOutput:
        """Parses a voice transcript into structured form data."""
        logger.info("Extractor Agent processing voice transcript...")

        # Base fallback logic
        fallback_extraction = VoiceExtractionOutput(
            diner_name="Anonymous",
            visitor_type="first-time",
            ordered_items=[],
            cleaned_review_text=transcript.strip()
        )

        prompt = f"Raw Transcript: {transcript}\n\nPlease extract the fields."

        # Process structured output via Gemini
        structured_extraction = await llm_service.generate_structured_output(
            prompt=prompt,
            system_instruction=EXTRACTOR_SYSTEM_PROMPT,
            response_schema=VoiceExtractionOutput,
            fallback_data=fallback_extraction
        )

        return structured_extraction

# Global agent instance
extractor_agent = ReviewExtractorAgent()
