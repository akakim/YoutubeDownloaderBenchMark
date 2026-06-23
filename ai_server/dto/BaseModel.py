from dataclasses import dataclass, asdict
from typing import Any, Dict, Optional


@dataclass
class BaseModel:
	"""Common base model for DTOs that includes response metadata.

	Provides `code` and `message` fields and a helper to build
	a standard response payload.
	"""
	code: int = 0
	message: str = ""

	def to_response(self, data: Optional[Any] = None) -> Dict[str, Any]:
		"""Return a serializable response dict including code/message and optional data."""
		resp = {"code": self.code, "message": self.message}
		if data is not None:
			resp["data"] = data
		return resp
