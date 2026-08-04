/* Canonical string sets of the protocol as const maps.
   validate.ts cross-checks each set against the enum in its schema,
   so these cannot drift from the schemas. */

export const PROTOCOL_VERSION = '0.1' as const;

export const SCHEMA_FILE = {
  cast: 'cast.schema.json',
  descriptor: 'descriptor.schema.json',
  envelope: 'envelope.schema.json',
  stage: 'stage.schema.json',
  verbs: 'verbs.schema.json',
} as const;

export const MESSAGE_TYPE = {
  stageHello: 'stage.hello',
  stageTransform: 'stage.transform',
  stageBye: 'stage.bye',
  actorState: 'actor.state',
  verbSummon: 'verb.summon',
  verbCross: 'verb.cross',
  verbPoint: 'verb.point',
  verbTraverse: 'verb.traverse',
  verbSpeak: 'verb.speak',
  verbRetire: 'verb.retire',
  targetResolve: 'target.resolve',
  targetResolved: 'target.resolved',
  targetLost: 'target.lost',
  targetOutcome: 'target.outcome',
  consentRequested: 'consent.requested',
  consentGranted: 'consent.granted',
  consentDenied: 'consent.denied',
  error: 'error',
} as const;

export const ROLE = {
  director: 'director',
  stage: 'stage',
  manager: 'manager',
} as const;

export const STAGE_KIND = {
  desktopOverlay: 'desktop-overlay',
  webPage: 'web-page',
  extensionTab: 'extension-tab',
} as const;

export const DOOR_FACING = {
  left: 'left',
  right: 'right',
} as const;

export const RESOLVE_STRATEGY = {
  a11y: 'a11y',
  text: 'text',
  landmark: 'landmark',
  selector: 'selector',
  vision: 'vision',
} as const;

export const POINT_STYLE = {
  stand: 'stand',
  spotlight: 'spotlight',
  both: 'both',
} as const;

export const TRAVERSE_MODE = {
  headings: 'headings',
  landmarks: 'landmarks',
  custom: 'custom',
} as const;

export const RETIRE_VIA = {
  door: 'door',
  fade: 'fade',
} as const;

export type SchemaFile = (typeof SCHEMA_FILE)[keyof typeof SCHEMA_FILE];
export type MessageType = (typeof MESSAGE_TYPE)[keyof typeof MESSAGE_TYPE];
export type Role = (typeof ROLE)[keyof typeof ROLE];
export type StageKind = (typeof STAGE_KIND)[keyof typeof STAGE_KIND];
export type DoorFacing = (typeof DOOR_FACING)[keyof typeof DOOR_FACING];
export type ResolveStrategy = (typeof RESOLVE_STRATEGY)[keyof typeof RESOLVE_STRATEGY];
export type PointStyle = (typeof POINT_STYLE)[keyof typeof POINT_STYLE];
export type TraverseMode = (typeof TRAVERSE_MODE)[keyof typeof TRAVERSE_MODE];
export type RetireVia = (typeof RETIRE_VIA)[keyof typeof RETIRE_VIA];

/* Where each const map lives in its schema, as a JSON pointer into the
   schema document. validate.ts asserts map values === schema enum. */
export const ENUM_BINDINGS: ReadonlyArray<{
  name: string;
  file: SchemaFile;
  pointer: string;
  values: readonly string[];
}> = [
  { name: 'MESSAGE_TYPE', file: SCHEMA_FILE.envelope, pointer: '/properties/type/enum', values: Object.values(MESSAGE_TYPE) },
  { name: 'ROLE', file: SCHEMA_FILE.envelope, pointer: '/properties/from/properties/role/enum', values: Object.values(ROLE) },
  { name: 'STAGE_KIND', file: SCHEMA_FILE.stage, pointer: '/oneOf/0/properties/kind/enum', values: Object.values(STAGE_KIND) },
  { name: 'DOOR_FACING', file: SCHEMA_FILE.stage, pointer: '/$defs/door/properties/facing/enum', values: Object.values(DOOR_FACING) },
  { name: 'RESOLVE_STRATEGY', file: SCHEMA_FILE.descriptor, pointer: '/$defs/resolved/properties/strategy/enum', values: Object.values(RESOLVE_STRATEGY) },
  { name: 'POINT_STYLE', file: SCHEMA_FILE.verbs, pointer: '/$defs/point/properties/style/enum', values: Object.values(POINT_STYLE) },
  { name: 'TRAVERSE_MODE', file: SCHEMA_FILE.verbs, pointer: '/$defs/traverse/properties/mode/enum', values: Object.values(TRAVERSE_MODE) },
  { name: 'RETIRE_VIA', file: SCHEMA_FILE.verbs, pointer: '/$defs/retire/properties/via/enum', values: Object.values(RETIRE_VIA) },
  { name: 'PROTOCOL_VERSION', file: SCHEMA_FILE.envelope, pointer: '/properties/v/const', values: [PROTOCOL_VERSION] },
];
