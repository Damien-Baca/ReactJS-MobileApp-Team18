import 'ajv'
import TIPDisSchema from 'schemas/TIPDistanceResponseSchema'
import TIPConSchema from 'schemas/TIPConfigResponseSchema'
import TIPLocSchema from 'schemas/TIPLocationsResponseSchema'
import TIPTripSchema from 'schemas/TIPTripResponseSchema'

export default class schemaValidator{

  validate(schema) {
    let Ajv = require('ajv');
    let ajv = new Ajv();
    let validate = ajv.compile(TIPDisSchema);
    let valid = validate(schema);
    if (!valid)
      console.log(validate.errors);
  }

}

