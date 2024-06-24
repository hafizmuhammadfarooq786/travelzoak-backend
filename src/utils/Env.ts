import { ConfigService } from "@nestjs/config";
import Constants from "./Constants";

export enum EnvId {
    Dev = "development",
    Prod = "production"
}

export function getEnvId(configService: ConfigService): EnvId {
    return configService.get<EnvId>(Constants.ENV_VARS.NODE_ENV) === EnvId.Prod ? EnvId.Prod : EnvId.Dev;
}