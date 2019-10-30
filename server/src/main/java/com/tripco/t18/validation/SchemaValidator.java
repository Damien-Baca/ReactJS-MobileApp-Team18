package com.tripco.t18.validation;
//credit to 314 ta and instructor

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import org.everit.json.schema.Schema;
import org.everit.json.schema.SchemaException;
import org.everit.json.schema.loader.SchemaLoader;
import org.everit.json.schema.ValidationException;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONTokener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SchemaValidator {

  private static final Logger log = LoggerFactory.getLogger(SchemaValidator.class);

  public static boolean validate(JSONObject jsonString, String schemaPath) {
    try {
      Class cls = Class.forName("com.tripco.t18.validation.SchemaValidator");

      try (InputStream inputStream = cls.getClassLoader().getResourceAsStream(schemaPath)) {
        assert inputStream != null;
        JSONObject rawSchema = new JSONObject(new JSONTokener(inputStream));
        Schema schema = SchemaLoader.load(rawSchema);
        schema.validate(jsonString);
        return true;
      }
    } catch(Exception e) {
      log.error("Exception: {}", e.getMessage());
      return false;
    }
  }
}
