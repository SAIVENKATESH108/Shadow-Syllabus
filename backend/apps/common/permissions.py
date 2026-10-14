"""Common object-level permissions ensuring row-level access control."""
from typing import Any
from rest_framework import permissions
from rest_framework.request import Request
from rest_framework.views import APIView


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Object-level permission allowing only owners of an object to edit or delete it."""

    def has_object_permission(self, request: Request, view: APIView, obj: Any) -> bool:
        # Read-only permissions are allowed for SAFE_METHODS
        if request.method in permissions.SAFE_METHODS:
            return True

        # Instance must have an attribute named `user`, `owner`, `instructor`, or `student`
        owner = getattr(obj, "user", getattr(obj, "owner", getattr(obj, "instructor", getattr(obj, "student", None))))
        return bool(owner and owner == request.user)


class IsOwnerOnly(permissions.BasePermission):
    """Object-level permission strictly restricting all operations (read & write) to the owner."""

    def has_permission(self, request: Request, view: APIView) -> bool:
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request: Request, view: APIView, obj: Any) -> bool:
        owner = getattr(obj, "user", getattr(obj, "owner", getattr(obj, "instructor", getattr(obj, "student", None))))
        return bool(owner and owner == request.user)
