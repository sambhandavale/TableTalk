import logging
from typing import Type, TypeVar, Optional, Any
from pydantic import BaseModel
from ai_workflow.config import ai_config

logger = logging.getLogger("TableTalk.LLMService")

T = TypeVar("T", bound=BaseModel)

class GeminiLLMService:
    def __init__(self):
        self.api_key = ai_config.GEMINI_API_KEY
        self.model = ai_config.GEMINI_MODEL
        self.client = None
        
        if self.api_key:
            try:
                # Import google-genai client library dynamically
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
                logger.info(f"Gemini LLM Service initialized successfully with model {self.model}.")
            except Exception as e:
                logger.error(f"Failed to initialize Gemini GenAI Client: {e}")

    async def generate_structured_output(
        self, 
        prompt: str, 
        system_instruction: str, 
        response_schema: Type[T],
        fallback_data: Any
    ) -> T:
        """Asynchronously calls Google Gemini with structured outputs, falling back to mock schema on failure/no key."""
        if self.client:
            try:
                # Run LLM generation inside thread pool to prevent blocking Event Loop
                import asyncio
                from google.genai import types
                
                def run_gemini():
                    # Request structured JSON matching response_schema
                    response = self.client.models.generate_content(
                        model=self.model,
                        contents=prompt,
                        config=types.GenerateContentConfig(
                            system_instruction=system_instruction,
                            temperature=ai_config.TEMPERATURE,
                            response_mime_type="application/json",
                            response_schema=response_schema
                        )
                    )
                    return response_schema.model_validate_json(response.text)

                loop = asyncio.get_running_loop()
                result = await loop.run_in_executor(None, run_gemini)
                logger.info("Successfully fetched structured output from Gemini LLM.")
                return result
            except Exception as e:
                logger.error(f"Structured LLM execution encountered error: {e}. Raising exception instead of using mock data.")
                raise Exception(f"AI Processing Failed: {e}")
                
        # If no client is configured
        logger.error("No Gemini Client initialized. Cannot generate AI output.")
        raise Exception("AI Processing Failed: Gemini API Key not configured.")

# Global LLM client instance
llm_service = GeminiLLMService()
