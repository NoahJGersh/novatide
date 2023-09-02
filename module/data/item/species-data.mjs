export class NovatideSpeciesData extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      description: new fields.HTMLField(),
      baseTraits: new fields.SchemaField({
        phys: new fields.NumberField({
          initial: 1,
          integer: true,
          nullable: false
        }),
        magi: new fields.NumberField({
          initial: 1,
          integer: true,
          nullable: false
        }),
        ment: new fields.NumberField({
          initial: 1,
          integer: true,
          nullable: false
        }),
        resolve: new fields.NumberField({
          initial: 0,
          integer: true,
          nullable: false
        })
      })
    }
  }
}