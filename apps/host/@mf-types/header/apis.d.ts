
    export type RemoteKeys = 'header/Module';
    type PackageType<T> = T extends 'header/Module' ? typeof import('header/Module') :any;