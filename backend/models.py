from pydantic import BaseModel
from typing import List, Optional


class Patent(BaseModel):
    id: str
    title: str
    abstract: str
    ipc_codes: List[str]
    applicants: List[str]
    inventors: List[str]
    publication_date: str
    country: str


class PatentSearchRequest(BaseModel):
    keyword: Optional[str] = None
