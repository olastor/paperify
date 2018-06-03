export class ApiParam {
  constructor(
    public name: string,
    public type: string,
    public description: string,
    public values?: any,
    public value?: any,
    public defaultValue?: any
  ) { }
}
