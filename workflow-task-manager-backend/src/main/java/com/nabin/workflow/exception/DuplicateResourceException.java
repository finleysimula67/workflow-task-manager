package com.nabin.workflow.exception;

public class DuplicateResourceException extends RuntimeException
{

    public DuplicateResourceException(String email, String message)
    {
        super(message);
    }

    public DuplicateResourceException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s already exists with %s: '%s'", resourceName, fieldName, fieldValue));
    }
}