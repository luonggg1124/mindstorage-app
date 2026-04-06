import { client } from "@/data/client.config";
import apiPaths from "@/paths/api";
import type { MySpacesError, MySpacesResponse } from "./my-spaces.type";


export class SpaceSDK {


    static async mySpaces<ThrowOnError extends boolean = false>() {
        const response = await client.get<MySpacesResponse, MySpacesError, ThrowOnError>({
            url: apiPaths.space.mySpaces.path
        });
        return response;
    }
 
}