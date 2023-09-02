export class NovatideCharacterData extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      biography: new fields.HTMLField(),
      traits: new fields.SchemaField({
        phys: new fields.SchemaField({
          value: new fields.NumberField({
            initial: 1,
            integer: true,
            nullable: false
          }),
          focus: new fields.BooleanField({
            initial: false,
            nullable: false
          }),
          passiveResolve: new fields.NumberField({
            initial: 1,
            integer: true,
            nullable: false
          })
        }),
        magi: new fields.SchemaField({
          value: new fields.NumberField({
            initial: 1,
            integer: true,
            nullable: false
          }),
          focus: new fields.BooleanField({
            initial: false,
            nullable: false
          }),
          passiveResolve: new fields.NumberField({
            initial: 1,
            integer: true,
            nullable: false
          })
        }),
        ment: new fields.SchemaField({
          value: new fields.NumberField({
            initial: 1,
            integer: true,
            nullable: false
          }),
          focus: new fields.BooleanField({
            initial: false,
            nullable: false
          }),
          passiveResolve: new fields.NumberField({
            initial: 1,
            integer: true,
            nullable: false
          })
        })
      }),
      resolve: new fields.SchemaField({
        base: new fields.NumberField({
          initial: 0,
          integer: true,
          nullable: false
        }),
        value: new fields.NumberField({
          initial: 0,
          integer: true,
          nullable: false
        })
      }),
      injury: new fields.SchemaField({
        value: new fields.NumberField({
          initial: 0,
          integer: true,
          nullable: false
        }),
        max: new fields.NumberField({
          initial: 1,
          integer: true,
          nullable: false
        })
      }),
      reputations: new fields.ArrayField(
        new fields.SchemaField({
          organization: new fields.StringField({
            initial: '',
            nullable: false
          }),
          reputation: new fields.NumberField({
            initial: 0,
            integer: true,
            nullable: false
          })
        }),
        {
          initial: [],
          nullable: false
        }
      )
    }
  }

  /**
   * Determine whether the character is maimed.
   * @type {boolean}
   */
  get maimed() {
    return this.injury.value >= Math.ceil(this.injury.max * 0.75);
  }

  /**
   * Determine whether the character is dying.
   * @type {boolean}
   */
  get dying() {
    return this.injury.value >= this.injury.max;
  }

  /**
   * Determine passive Physical resolve
   * @type {number}
   */
  get physicalResolve() {
    console.log('Novatide | Getting physical resolve', this.traits.physical.value, this.resolve.value);
    return this.traits.physical.value + this.resolve.value;
  }

  /**
   * Determine the passive Mental resolve
   * @type {number}
   */
  get mentalResolve() {
    return this.traits.mental.value + this.resolve.value;
  }

  /**
   * Determine the passive Magical resolve
   * @type {number}
   */
  get magicalResolve() {
    return this.traits.magical.value + this.resolve.value;
  }
}