
    export type RemoteKeys = 'tractor_header/Module';
    type PackageType<T> = T extends 'tractor_header/Module' ? typeof import('tractor_header/Module') :any;