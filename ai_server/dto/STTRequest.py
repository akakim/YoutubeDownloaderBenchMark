from dataclasses import dataclass
from typing import Optional

from .BaseModel import BaseModel


@dataclass
class STTRequest(BaseModel):
	"""STT request DTO inheriting common response metadata from BaseModel."""
	job_id: Optional[str] = None
	model: Optional[str] = None
	language: Optional[str] = None