import enum


class UserRole(enum.Enum):
    STUDENT = "STUDENT"
    TEACHER = "TEACHER"


class GradingType(enum.Enum):
    EXACT = "exact"
    SYMBOLIC = "symbolic"
    NUMERIC = "numeric"


class AttemptStatus(enum.Enum):
    NOT_STARTED = "NOT_STARTED"
    IN_PROGRESS = "IN_PROGRESS"
    SUBMITTED = "SUBMITTED"
