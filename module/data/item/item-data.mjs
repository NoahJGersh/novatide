export class NovatideItemData extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      description: new fields.HTMLField(),
      value: new fields.NumberField({
        initial: 0,
        integer: true,
        nullable: false
      }),
      quantity: new fields.NumberField({
        initial: 1,
        integer: true,
        nullable: false
      })
    }
  }
}