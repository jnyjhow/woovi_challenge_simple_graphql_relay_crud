/* eslint-disable flowtype/require-types-at-top */
/* eslint-disable flowtype/no-weak-types */
/* eslint-disable flowtype/no-types-missing-file-annotation */

declare module 'relay-runtime' {
  declare export var ConnectionHandler: any;
  declare export var RecordSource: any;
  declare export var Store: any;
  declare export var Environment: any;
  declare export var Network: any;

  declare export type RequestNode = any;
  declare export type Variables = any;
  declare export type ReaderFragment = any;
  declare export type ConcreteRequest = any;
  declare export opaque type FragmentReference;
}
