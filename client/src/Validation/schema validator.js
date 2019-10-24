import 'ajv'
import TIPDisSchema from 'schemas/TIPDistanceResponseSchema'

function validateTIPDistance(TIPDis){
  let Ajv =require('ajv');
  let ajv = new Ajv();
  let validate =ajv.compile(TIPDisSchema);
  let valid = validate(TIPDis);
  if (!valid)
    console.log(validate.errors);
}

