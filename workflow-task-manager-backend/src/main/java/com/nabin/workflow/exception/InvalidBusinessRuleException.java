package com.nabin.workflow.exception;

public class InvalidBusinessRuleException extends RuntimeException {

    public InvalidBusinessRuleException(String message) {
        super(message);
    }
}