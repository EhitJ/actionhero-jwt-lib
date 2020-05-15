import { Initializer } from "actionhero";
export declare class MyInitializer extends Initializer {
    constructor();
    initialize(): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
}
