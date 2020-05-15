export namespace DEFAULT {
    export function jwtauth(config: any): {
        enabled: {
            web: boolean;
            websocket: boolean;
            socket: boolean;
            testServer: boolean;
        };
        secret: string;
        algorithm: string;
        enableGet: boolean;
    };
}
