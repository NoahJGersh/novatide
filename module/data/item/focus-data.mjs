export class NovatideFocusData extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      description: new fields.HTMLField(),
      trait: new fields.StringField({
        initial: 'phys',
        nullable: false
      }),
      currentTier: new fields.NumberField({
        initial: 0,
        integer: true,
        nullable: false
      }),
      tiers: new fields.ArrayField(
        new fields.SchemaField({
          tier: new fields.NumberField({
            initial: 0,
            integer: true,
            nullable: false
          }),
          unlockRequirements: new fields.ArrayField(
            new fields.StringField({
              initial: '',
              nullable: false
            }),
            {
              initial: [],
              nullable: false
            }
          )
        }),
        {
          initial: [{tier: 0, unlockRequirements: []}],
          nullable: false
        }
      )
    }
  }
}