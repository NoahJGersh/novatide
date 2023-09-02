export class NovatideCareerData extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      description: new fields.HTMLField(),
      tableTags: new fields.ArrayField(
        new fields.StringField({
          initial: '',
          nullable: false
        }),
        {
          initial: [],
          nullable: false
        }
      ),
      tier: new fields.NumberField({
        initial: 1,
        integer: true,
        nullable: false
      })
    }
  }
}