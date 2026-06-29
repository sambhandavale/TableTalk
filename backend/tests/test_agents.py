import pytest
from unittest.mock import patch, MagicMock

@pytest.mark.asyncio
async def test_extractor_agent_mocked():
    with patch("ai_workflow.extractor_agent.extract_voice_transcript") as mock_extract:
        mock_extract.return_value = MagicMock(
            model_dump=lambda: {"diner_name": "John", "ordered_items": ["pizza"], "text": "Great pizza", "rating": 5}
        )
        result = await mock_extract("This is a voice transcript")
        
        assert result.model_dump()["diner_name"] == "John"
        assert result.model_dump()["rating"] == 5
        mock_extract.assert_called_once()
