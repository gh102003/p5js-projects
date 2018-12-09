import { WhiteLight, RedLight, GreenLight } from "./light.mjs";

export class LightFactory {
    create(type) {
        let lights = {"white": WhiteLight, "red": RedLight, "green": GreenLight};
        return new lights[type];
    }
}