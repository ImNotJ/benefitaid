package com.example.benefits.entity;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import java.io.IOException;

public class RequirementTypeDeserializer extends JsonDeserializer<Requirement.RequirementType> {
    @Override
    public Requirement.RequirementType deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getText().toUpperCase();
        return Requirement.RequirementType.valueOf(value);
    }
}