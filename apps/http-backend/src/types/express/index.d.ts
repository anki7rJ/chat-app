import { JwtPayload } from "jsonwebtoken";

export interface customUserPayload extends JwtPayload{
    id:string,
    email:string
}

declare global{
    namespace Express{
        interface Request{
            user?:customUserPayload
        }
    }
}