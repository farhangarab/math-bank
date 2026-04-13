import enum


class UserRole(enum.Enum):
    STUDENT = "STUDENT"
    TEACHER = "TEACHER"


class GradingType(enum.Enum):
    EXACT = "exact"
    SYMBOLIC = "symbolic"
    NUMERIC = "numeric"
